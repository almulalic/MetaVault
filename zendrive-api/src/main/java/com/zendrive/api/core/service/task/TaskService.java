package com.zendrive.api.core.service.task;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zendrive.api.core.model.dao.jobrunr.Task;
import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import com.zendrive.api.core.repository.jobrunr.TaskRepository;
import com.zendrive.api.core.task.model.parameters.DeleteTaskParameters;
import com.zendrive.api.core.task.model.parameters.ScanTaskParameters;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.core.task.model.request.ScanTaskRequest;
import com.zendrive.api.core.task.model.request.ZenDriveJobRequest;
import com.zendrive.api.core.utils.ClazzUtil;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.rest.models.dto.job.CreateTaskResponse;
import lombok.RequiredArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.lang.reflect.Constructor;
import java.util.*;

import static org.jobrunr.scheduling.JobBuilder.aJob;

@Service
@RequiredArgsConstructor
public class TaskService {
	private final TaskRepository taskRepository;
	private final TaskDefinitionService taskDefinitionService;

	private final ObjectMapper objectMapper = new ObjectMapper();

	public Page<Task> getAll(Pageable pageable) {
		return taskRepository.findAll(pageable);
	}

	public CreateTaskResponse<JobRequest> run(
		String definitionId,
		String name,
		ObjectNode parameters
	) {
		TaskDefinition definition = taskDefinitionService.getDefinition(definitionId);

		try {
			ClazzUtil.validateObjectNode(definition.getParametersClasspath(), parameters);

			Class<?> requestClass = Class.forName(definition.getRequestClasspath());

			if (!JobRequest.class.isAssignableFrom(requestClass)) {
				throw new IllegalArgumentException("Class must extend JobRequest");
			}

			Constructor<?> constructor = requestClass.getDeclaredConstructors()[0];
			Class<?> parameterType = constructor.getParameterTypes()[0];
			Object parameterObject = objectMapper.treeToValue(parameters, parameterType);
			ZenDriveJobRequest request = (ZenDriveJobRequest) constructor.newInstance(parameterObject);

			String id = BackgroundJobRequest.create(
				aJob()
					.withName(name)
					.withLabels(Set.of("type:%s".formatted(request.getType())))
					.withJobRequest(request)
					.withAmountOfRetries(1)
			).toString();

			return CreateTaskResponse.Builder()
															 .withId(id)
															 .withRequest(request)
															 .build();
		} catch (Exception ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	public CreateTaskResponse<ScanTaskRequest> runScan(ScanTaskParameters parameters) {
		TaskDefinition definition = taskDefinitionService.getScanDefinition();
		ScanTaskRequest scanTaskRequest = new ScanTaskRequest(parameters);

		try {
			String id = BackgroundJobRequest.create(
				aJob()
					.withName(String.format("%s - %s", definition.getName(), parameters.getConfig().getInputPath()))
					.withLabels(Set.of("type:%s".formatted(scanTaskRequest.getType())))
					.withJobRequest(scanTaskRequest)
					.withAmountOfRetries(1)
			).toString();

			return CreateTaskResponse.<ScanTaskRequest>Builder()
															 .withId(id)
															 .withRequest(scanTaskRequest)
															 .build();
		} catch (Exception ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	public CreateTaskResponse<DeleteTaskRequest> runDelete(DeleteTaskParameters parameters) {
		TaskDefinition definition = taskDefinitionService.getDeleteDefinition();
		DeleteTaskRequest deleteTaskRequest = new DeleteTaskRequest(parameters);

		try {
			String id = BackgroundJobRequest.create(
				aJob()
					.withName(String.format("%s - %s", definition.getName(), parameters.getDirectoryId()))
					.withLabels(Set.of("type:%s".formatted(deleteTaskRequest.getType())))
					.withJobRequest(deleteTaskRequest)
					.withAmountOfRetries(1)
			).toString();

			return CreateTaskResponse.<DeleteTaskRequest>Builder()
															 .withId(id)
															 .withRequest(deleteTaskRequest)
															 .build();
		} catch (Exception ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	public List<Task> getRunning() {
		return taskRepository.getRunningJobs();
	}

	public Optional<Task> getJob(String jobId) {
		return taskRepository.findById(jobId);
	}
}

package com.zendrive.api.core.service.task;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zendrive.api.core.model.dao.jobrunr.Task;
import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import com.zendrive.api.core.model.task.TaskRequest;
import com.zendrive.api.core.repository.jobrunr.TaskRepository;
import com.zendrive.api.core.task.model.parameters.DeleteTaskParameters;
import com.zendrive.api.core.task.model.parameters.ScanTaskParameters;
import com.zendrive.api.core.task.model.parameters.SyncTaskParameters;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.core.task.model.request.ScanTaskRequest;
import com.zendrive.api.core.task.model.request.SyncTaskRequest;
import com.zendrive.api.core.task.model.request.ZenDriveJobRequest;
import com.zendrive.api.core.utils.ClazzUtil;
import com.zendrive.api.exception.InvalidArgumentsException;
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
import static org.jobrunr.scheduling.RecurringJobBuilder.aRecurringJob;

@Service
@RequiredArgsConstructor
public class TaskService {
	private final TaskRepository taskRepository;
	private final TaskDefinitionService taskDefinitionService;

	private final ObjectMapper objectMapper = new ObjectMapper();

	public Task get(String id) {
		return find(id).orElseThrow(() -> new InvalidArgumentsException("Task not found!"));
	}

	public Optional<Task> find(String id) {
		return taskRepository.findById(id);
	}

	public Page<Task> getPage(Pageable pageable) {
		return taskRepository.findAll(pageable);
	}

	public List<Task> getRunning() {
		return taskRepository.getRunningTasks();
	}

	public int countRunningByRecurringId(String id) {
		return taskRepository.countRunningByRecurringId(id);
	}

	public CreateTaskResponse<ZenDriveJobRequest> run(
		String definitionId,
		String name,
		ObjectNode parameters
	) {
		TaskDefinition definition = taskDefinitionService.get(definitionId);

		try {
			ClazzUtil.validateObjectNode(definition.getParametersClasspath(), parameters);

			Class<?> requestClass = Class.forName(definition.getRequestClasspath());

			if (!JobRequest.class.isAssignableFrom(requestClass)) {
				throw new InvalidArgumentsException("Class must extend JobRequest");
			}

			Constructor<?> constructor = requestClass.getDeclaredConstructors()[0];
			Class<?> parameterType = constructor.getParameterTypes()[0];
			Object parameterObject = objectMapper.treeToValue(parameters, parameterType);
			ZenDriveJobRequest request = (ZenDriveJobRequest) constructor.newInstance(parameterObject);

			return runBackgroundJob(
				TaskRequest.Builder()
									 .withName(name)
									 .withLabels(Set.of("type:%s".formatted(request.getType())))
									 .withAmountOfRetries(1)
									 .withJobRequest(request)
									 .build()
			);
		} catch (Exception ex) {
			throw new InvalidArgumentsException(ex.getMessage());
		}
	}

	public CreateTaskResponse<ScanTaskRequest> runScan(ScanTaskParameters parameters) {
		TaskDefinition definition = taskDefinitionService.getScan();

		ScanTaskRequest scanTaskRequest = new ScanTaskRequest(parameters);

		return runBackgroundJob(
			TaskRequest.<ScanTaskRequest>Builder()
								 .withName(String.format(
									 "%s - %s",
									 definition.getName(),
									 parameters.getConfig().getInputPath()
								 ))
								 .withLabels(Set.of("type:%s".formatted(scanTaskRequest.getType())))
								 .withAmountOfRetries(1)
								 .withJobRequest(scanTaskRequest)
								 .withSyncConfig(parameters.getConfig().getSyncConfig())
								 .build(),
			null
		);
	}

	public CreateTaskResponse<SyncTaskRequest> runSync(SyncTaskParameters parameters) {
		TaskDefinition definition = taskDefinitionService.getSync();
		SyncTaskRequest syncTaskRequest = new SyncTaskRequest(parameters);

		return runBackgroundJob(
			TaskRequest.<SyncTaskRequest>Builder()
								 .withName(String.format("%s - %s", definition.getName(), parameters.getDirectoryId()))
								 .withLabels(Set.of("type:%s".formatted(syncTaskRequest.getType())))
								 .withAmountOfRetries(1)
								 .withJobRequest(syncTaskRequest)
								 .withSyncConfig(parameters.getSyncConfig())
								 .build(),
			null
		);
	}

	public CreateTaskResponse<DeleteTaskRequest> runDelete(DeleteTaskParameters parameters) {
		TaskDefinition definition = taskDefinitionService.getDelete();
		DeleteTaskRequest deleteTaskRequest = new DeleteTaskRequest(parameters);

		String name = String.format(
			"%s - %s",
			definition.getName(),
			parameters.getDirectoryIds().size() == 1 ? parameters.getDirectoryIds().get(0)
																							 : parameters.getDirectoryIds().size() + " Metafiles"
		);

		return runBackgroundJob(
			TaskRequest.<DeleteTaskRequest>Builder()
								 .withName(name)
								 .withLabels(Set.of("type:%s".formatted(deleteTaskRequest.getType())))
								 .withAmountOfRetries(1)
								 .withJobRequest(deleteTaskRequest)
								 .build(),
			null
		);
	}

	public void scheduleSync(SyncTaskParameters parameters) {
		TaskDefinition definition = taskDefinitionService.getSync();
		SyncTaskRequest syncTaskRequest = new SyncTaskRequest(parameters);

		scheduleBackgroundJob(
			TaskRequest.<SyncTaskRequest>Builder()
								 .withName(String.format("%s - %s", definition.getName(), parameters.getDirectoryId()))
								 .withLabels(Set.of("type:%s".formatted(syncTaskRequest.getType())))
								 .withAmountOfRetries(1)
								 .withJobRequest(syncTaskRequest)
								 .withSyncConfig(parameters.getSyncConfig())
								 .build()
		);
	}

	public void stop(String id) {
		BackgroundJobRequest.delete(UUID.fromString(id));
	}

	public void stopMany(List<String> ids) {
		ids.forEach(this::stop);
	}


	protected <T extends ZenDriveJobRequest> CreateTaskResponse<T> runBackgroundJob(TaskRequest<T> taskRequest) {
		return runBackgroundJob(taskRequest, taskRequest);
	}

	protected <T extends ZenDriveJobRequest, K extends ZenDriveJobRequest> CreateTaskResponse<T> runBackgroundJob(
		TaskRequest<T> taskRequest,
		TaskRequest<K> scheduleRequest
	) {
		String id = BackgroundJobRequest.create(
			aJob()
				.withName(taskRequest.getName())
				.withLabels(taskRequest.getLabels())
				.withAmountOfRetries(taskRequest.getAmountOfRetries())
				.withJobRequest(taskRequest.getJobRequest())
		).toString();

		if (taskRequest.getSyncConfig() != null && scheduleRequest != null) {
			scheduleBackgroundJob(scheduleRequest);
		}

		return CreateTaskResponse.<T>Builder()
														 .withId(id)
														 .withRequest(taskRequest.getJobRequest())
														 .build();

	}

	protected <T extends ZenDriveJobRequest> void scheduleBackgroundJob(TaskRequest<T> scheduleRequest) {
		BackgroundJobRequest.createRecurrently(
			aRecurringJob()
				.withId(UUID.randomUUID().toString())
				.withName(scheduleRequest.getName())
				.withLabels(scheduleRequest.getLabels())
				.withAmountOfRetries(scheduleRequest.getAmountOfRetries())
				.withJobRequest(scheduleRequest.getJobRequest())
				.withCron(scheduleRequest.getSyncConfig().getCronExpression())
		);
	}
}

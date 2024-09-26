package com.zendrive.api.core.service.task;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zendrive.api.core.model.dao.jobrunr.RecurringTask;
import com.zendrive.api.core.model.jobrunr.TaskParameter;
import com.zendrive.api.core.model.task.SyncConfig;
import com.zendrive.api.core.repository.jobrunr.RecurringTaskRepository;
import com.zendrive.api.core.task.model.request.ZenDriveJobRequest;
import com.zendrive.api.exception.InvalidArgumentsException;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import static org.jobrunr.scheduling.RecurringJobBuilder.aRecurringJob;

@Service
@RequiredArgsConstructor
public class RecurringTaskService {
	private final RecurringTaskRepository recurringTaskRepository;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public Page<RecurringTask> getPage(Pageable pageable) {
		return recurringTaskRepository.findAll(pageable);
	}

	public RecurringTask get(String id) {
		return find(id).orElseThrow(() -> new InvalidArgumentsException("Recurring task not found!"));
	}

	public Optional<RecurringTask> find(String id) {
		return recurringTaskRepository.findById(id);
	}

	public String edit(String id, SyncConfig syncConfig) {
		try {
			RecurringTask recurringTask = get(id);

			TaskParameter taskParameter = recurringTask.getData().getDetails().getParameters().get(0);

			ObjectMapper mapper = new ObjectMapper();
			Class<?> requestClass = Class.forName(taskParameter.getClassName());
			Constructor<?> constructor = requestClass.getDeclaredConstructors()[0];
			Class<?> parameterType = constructor.getParameterTypes()[0];
			Object parameterObject = objectMapper.treeToValue(
				mapper.convertValue(taskParameter.getObject(), JsonNode.class).get("parameters"),
				parameterType
			);

			return BackgroundJobRequest.createRecurrently(
				aRecurringJob()
					.withId(recurringTask.getId())
					.withName(recurringTask.getData().getName())
					.withLabels(recurringTask.getData().getLabels())
					.withAmountOfRetries(recurringTask.getData().getAmountOfRetries())
					.withJobRequest((ZenDriveJobRequest) constructor.newInstance(parameterObject))
					.withCron(syncConfig.getCronExpression())
			);
		} catch (ClassNotFoundException | InvocationTargetException | InstantiationException |
						 IllegalAccessException | JsonProcessingException ex) {
			throw new InvalidArgumentsException(ex.getMessage());
		}
	}

	public void delete(String id) {
		BackgroundJobRequest.deleteRecurringJob(id);
	}

	public void deleteAll(List<String> ids) {
		ids.forEach(BackgroundJobRequest::deleteRecurringJob);
	}
}

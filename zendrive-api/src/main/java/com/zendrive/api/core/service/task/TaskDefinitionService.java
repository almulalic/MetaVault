package com.zendrive.api.core.service.task;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import com.zendrive.api.core.repository.zendrive.elastic.TaskDefinitionRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import com.zendrive.api.core.utils.ClazzUtil;
import com.zendrive.api.exception.InvalidArgumentsException;
import com.zendrive.api.exception.ZendriveErrorCode;
import com.zendrive.api.exception.ZendriveException;
import com.zendrive.api.rest.models.dto.task.CreateTaskDefinitionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskDefinitionService {
	private final RoleRepository roleRepository;
	private final TaskDefinitionRepository taskDefinitionRepository;

	public List<TaskDefinition> getAll(String query) {
		return taskDefinitionRepository.findAllByNameLike(query);
	}

	public TaskDefinition get(String id) {
		return find(id).orElseThrow(() -> new InvalidArgumentsException("Task definition not found!"));
	}

	public Optional<TaskDefinition> find(String id) {
		return taskDefinitionRepository.findById(id);
	}

	public TaskDefinition getScan() {
		return taskDefinitionRepository.findByName("Scan Task") //todo fix hardcoding
																	 .orElseThrow(() -> new InvalidArgumentsException("Task definition not found!"));
	}

	public TaskDefinition getSync() {
		return taskDefinitionRepository.findByName("Sync Task") //todo fix hardcoding
																	 .orElseThrow(() -> new InvalidArgumentsException("Task definition not found!"));
	}

	public TaskDefinition getDelete() {
		return taskDefinitionRepository.findByName("Delete Task") //todo fix hardcoding
																	 .orElseThrow(() -> new InvalidArgumentsException("Task definition not found!"));
	}

	public TaskDefinition register(CreateTaskDefinitionDto dto, Long userId) {
		if (taskDefinitionRepository.findByName(dto.getName()).isPresent()) {
			throw new InvalidArgumentsException("Name must be unique!");
		}

		if (dto.getPermissions().isEmpty()) {
			throw new InvalidArgumentsException("At least one permission must be specified!");
		}

		roleRepository.getRoles(dto.getPermissions().getAllRoles());

		try {
			return taskDefinitionRepository.save(
				TaskDefinition.Builder()
											.withId(UUID.randomUUID().toString())
											.withName(dto.getName())
											.withCreatedBy(userId)
											.withPermissions(dto.getPermissions())
											.withHandlerClasspath(dto.getHandlerClasspath())
											.withRequestClasspath(dto.getRequestClasspath())
											.withParametersClasspath(dto.getParametersClasspath())
											.withCreatedAt(LocalDateTime.now().toString())
											.withUpdatedAt(LocalDateTime.now().toString())
											.withProperties(ClazzUtil.toJsonSchema(Class.forName(dto.getParametersClasspath())))
											.build()
			);
		} catch (ClassNotFoundException ex) {
			throw new InvalidArgumentsException("Properties class was not found on classpath");
		} catch (ElasticsearchException ex) {
			throw new ZendriveException("Unable to save the request to elastic!", ZendriveErrorCode.GENERAL);
		}
	}

	public void delete(String id) {
		taskDefinitionRepository.delete(get(id));
	}
}

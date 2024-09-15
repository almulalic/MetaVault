package com.zendrive.api.core.service.task;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import com.zendrive.api.core.repository.zendrive.elastic.TaskDefinitionRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import com.zendrive.api.core.utils.ClazzUtil;
import com.zendrive.api.exception.BadRequestException;
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
	private final TaskDefinitionRepository taskDefinitionRepository;
	private final RoleRepository roleRepository;

	public List<TaskDefinition> getDefinitions(String query) {
		return taskDefinitionRepository.findAllByNameLike(query);
	}

	public TaskDefinition getDefinition(String id) {
		return taskDefinitionRepository.findById(id)
																	 .orElseThrow(() -> new BadRequestException("Task definition not found!"));
	}

	public TaskDefinition getScanDefinition() {
		return taskDefinitionRepository.findByName("Scan Task")
																	 .orElseThrow(() -> new BadRequestException("Task definition not found!"));
	}

	public TaskDefinition getDeleteDefinition() {
		return taskDefinitionRepository.findByName("Delete Task")
																	 .orElseThrow(() -> new BadRequestException("Task definition not found!"));
	}

	public TaskDefinition register(CreateTaskDefinitionDto dto, Long userId) {
		if (taskDefinitionRepository.findByName(dto.getName()).isPresent()) {
			throw new IllegalArgumentException("Name must be unique!");
		}

		if (dto.getPermissions().isEmpty()) {
			throw new IllegalArgumentException("At least one permission must be specified!");
		}

		try {
			roleRepository.getRoles(dto.getPermissions().getAllRoles());
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}

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
			throw new RuntimeException("Properties class was not found on classpath");
		} catch (ElasticsearchException ex) {
			throw new BadRequestException("Unable to save the request to elastic!");
		}
	}

	public TaskDefinition deleteDefinition(String id) {
		Optional<TaskDefinition> taskDefinition = taskDefinitionRepository.findById(id);

		if (taskDefinition.isEmpty()) {
			throw new BadRequestException("Task definition does not exist!");
		}

		taskDefinitionRepository.deleteById(id);
		return taskDefinition.get();
	}
}

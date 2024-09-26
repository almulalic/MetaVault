package com.zendrive.api.rest.controller.task;

import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import com.zendrive.api.core.service.task.TaskDefinitionService;
import com.zendrive.api.rest.controller.Controller;
import com.zendrive.api.rest.models.dto.task.CreateTaskDefinitionDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/task/definition")
@RequiredArgsConstructor
public class TaskDefinitionController extends Controller {
	private final TaskDefinitionService taskDefinitionService;

	@RequestMapping(method = RequestMethod.GET, path = "")
	public ResponseEntity<List<TaskDefinition>> getPage(
		@Param("query") String query
	) {
		return ResponseEntity.ok(this.taskDefinitionService.getAll(query));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/{taskId}")
	public ResponseEntity<TaskDefinition> get(
		@PathVariable String taskId
	) {
		return ResponseEntity.ok(this.taskDefinitionService.get(taskId));
	}

	@RequestMapping(method = RequestMethod.POST, path = "")
	public ResponseEntity<TaskDefinition> register(
		@RequestBody
		@Valid CreateTaskDefinitionDto dto
	) {
		return ResponseEntity.ok(this.taskDefinitionService.register(dto, getCurrentUser().getId()));
	}

	@RequestMapping(method = RequestMethod.DELETE, path = "/{taskId}")
	public void delete(
		@PathVariable String taskId
	) {
		this.taskDefinitionService.delete(taskId);
	}
}

package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.jobrunr.Task;
import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import com.zendrive.api.core.service.task.TaskDefinitionService;
import com.zendrive.api.core.service.task.TaskService;
import com.zendrive.api.core.task.model.parameters.ScanTaskParameters;
import com.zendrive.api.core.task.model.request.ScanTaskRequest;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.rest.models.dto.job.CreateTaskResponse;
import com.zendrive.api.rest.models.dto.task.CreateTaskDefinitionDto;
import com.zendrive.api.rest.models.dto.task.RunTaskDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@ApiVersion(1)
@RequestMapping("api/task")
@RequiredArgsConstructor
public class TaskController {
	private final TaskService taskService;
	private final TaskDefinitionService taskDefinitionService;

	@RequestMapping(method = RequestMethod.GET, path = "/all")
	public ResponseEntity<Page<Task>> getAll(
		Pageable pageable
	) {
		return ResponseEntity.ok(this.taskService.getAll(pageable));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/{taskId}")
	public ResponseEntity<Task> getOne(
		@PathVariable String taskId
	) {
		return ResponseEntity.ok(
			this.taskService
				.getJob(taskId)
				.orElseThrow(() -> new BadRequestException("Not found!"))
		);
	}

	@RequestMapping(method = RequestMethod.GET, path = "/running")
	public ResponseEntity<List<Task>> getRunning() {
		return ResponseEntity.ok(this.taskService.getRunning());
	}

	@RequestMapping(method = RequestMethod.GET, path = "/definition")
	public ResponseEntity<List<TaskDefinition>> getTaskDefinitions(
		@Param("query") String query
	) {
		try {
			return ResponseEntity.ok(this.taskDefinitionService.getDefinitions(query));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.GET, path = "/definition/{id}")
	public ResponseEntity<TaskDefinition> getTaskDefinition(
		@PathVariable String id
	) {
		try {
			return ResponseEntity.ok(this.taskDefinitionService.getDefinition(id));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, path = "/definition/register")
	public ResponseEntity<TaskDefinition> registerTask(
		HttpServletRequest request,
		@RequestBody
		@Valid CreateTaskDefinitionDto dto
	) {
		try {
			User user = ((User) request.getAttribute("user"));
			return ResponseEntity.ok(this.taskDefinitionService.register(dto, user.getId()));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, path = "/run")
	public ResponseEntity<CreateTaskResponse> runTask(
		HttpServletRequest request,
		@RequestBody
		@Valid RunTaskDto dto
	) {
		try {
			return ResponseEntity.ok(
				this.taskService.run(
					dto.getDefinitionId(),
					dto.getName(),
					dto.getParameters()
				)
			);
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, path = "/run/scan")
	public ResponseEntity<CreateTaskResponse<ScanTaskRequest>> runScanTask(
		HttpServletRequest request,
		@RequestBody
		@Valid ScanTaskParameters dto
	) {
		try {
			User user = ((User) request.getAttribute("user"));
			return ResponseEntity.ok(this.taskService.runScan(dto));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.DELETE, path = "/definition/{id}")
	public ResponseEntity<TaskDefinition> deleteTaskDefinition(
		HttpServletRequest request,
		@PathVariable String id
	) {
		try {
			return ResponseEntity.ok(this.taskDefinitionService.deleteDefinition(id));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}
	}

}

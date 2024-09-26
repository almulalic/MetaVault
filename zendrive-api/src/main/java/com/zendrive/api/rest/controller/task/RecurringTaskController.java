package com.zendrive.api.rest.controller.task;

import com.zendrive.api.core.model.dao.jobrunr.RecurringTask;
import com.zendrive.api.core.service.task.RecurringTaskService;

import com.zendrive.api.rest.controller.Controller;
import com.zendrive.api.rest.models.dto.task.DeleteTasksDto;
import com.zendrive.api.rest.models.dto.task.EditRecurringTaskDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/task/recurring")
@RequiredArgsConstructor
public class RecurringTaskController extends Controller {
	private final RecurringTaskService recurringTaskService;

	@RequestMapping(method = RequestMethod.GET, path = "/page")
	public ResponseEntity<Page<RecurringTask>> getPage(
		Pageable pageable
	) {
		return ResponseEntity.ok(this.recurringTaskService.getPage(pageable));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/{taskId}")
	public ResponseEntity<RecurringTask> get(
		@PathVariable String taskId
	) {
		return ResponseEntity.ok(this.recurringTaskService.get(taskId));
	}

	@RequestMapping(method = RequestMethod.PUT, path = "/{taskId}")
	public ResponseEntity<String> edit(
		@PathVariable String taskId,
		@RequestBody
		@Valid
		EditRecurringTaskDto dto
	) {
		return ResponseEntity.ok(this.recurringTaskService.edit(taskId, dto.getSyncConfig()));
	}

	@RequestMapping(method = RequestMethod.DELETE, path = "/{taskId}")
	public void stop(
		@PathVariable String taskId
	) {
		this.recurringTaskService.delete(taskId);
	}

	@RequestMapping(method = RequestMethod.DELETE, path = "/all")
	public void stopAll(
		@RequestBody
		@Valid DeleteTasksDto dto
	) {
		this.recurringTaskService.deleteAll(dto.getIds());
	}
}

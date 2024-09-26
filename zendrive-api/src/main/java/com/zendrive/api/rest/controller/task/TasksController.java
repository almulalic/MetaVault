package com.zendrive.api.rest.controller.task;

import com.zendrive.api.core.model.dao.jobrunr.Task;
import com.zendrive.api.core.service.task.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/tasks")
@RequiredArgsConstructor
public class TasksController {
	private final TaskService taskService;

	@RequestMapping(method = RequestMethod.GET, path = "/page")
	public ResponseEntity<Page<Task>> getAll(
		Pageable pageable
	) {
		return ResponseEntity.ok(this.taskService.getPage(pageable));
	}
}

package com.zendrive.api.rest.controller.task;

import com.zendrive.api.core.model.dao.jobrunr.Task;
import com.zendrive.api.core.service.task.TaskService;
import com.zendrive.api.core.task.model.parameters.DeleteTaskParameters;
import com.zendrive.api.core.task.model.parameters.ScanTaskParameters;
import com.zendrive.api.core.task.model.parameters.SyncTaskParameters;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.core.task.model.request.ScanTaskRequest;
import com.zendrive.api.core.task.model.request.SyncTaskRequest;
import com.zendrive.api.core.task.model.request.ZenDriveJobRequest;
import com.zendrive.api.rest.controller.Controller;
import com.zendrive.api.rest.models.dto.job.CreateTaskResponse;
import com.zendrive.api.rest.models.dto.task.DeleteTasksDto;
import com.zendrive.api.rest.models.dto.task.RunTaskDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/task")
@RequiredArgsConstructor
public class
TaskController extends Controller {
	private final TaskService taskService;

	@RequestMapping(method = RequestMethod.GET, path = "/{taskId}")
	public ResponseEntity<Task> get(
		@PathVariable String taskId
	) {
		return ResponseEntity.ok(this.taskService.get(taskId));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/running")
	public ResponseEntity<List<Task>> getRunning() {
		return ResponseEntity.ok(this.taskService.getRunning());
	}

	@RequestMapping(method = RequestMethod.POST, path = "/run")
	public ResponseEntity<CreateTaskResponse<ZenDriveJobRequest>> run(
		@RequestBody
		@Valid RunTaskDto dto
	) {
		return ResponseEntity.ok(
			this.taskService.run(dto.getDefinitionId(), dto.getName(), dto.getParameters())
		);
	}

	@RequestMapping(method = RequestMethod.POST, path = "/run/scan")
	public ResponseEntity<CreateTaskResponse<ScanTaskRequest>> runScan(
		@RequestBody
		@Valid ScanTaskParameters dto
	) {
		return ResponseEntity.ok(this.taskService.runScan(dto));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/run/sync")
	public ResponseEntity<CreateTaskResponse<SyncTaskRequest>> runSync(
		@RequestBody
		@Valid SyncTaskParameters dto
	) {
		return ResponseEntity.ok(this.taskService.runSync(dto));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/run/delete")
	public ResponseEntity<CreateTaskResponse<DeleteTaskRequest>> runDelete(
		@RequestBody
		@Valid DeleteTaskParameters dto
	) {
		return ResponseEntity.ok(this.taskService.runDelete(dto));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/{taskId}/stop")
	public void stop(
		@PathVariable String taskId
	) {
		this.taskService.stop(taskId);
	}

	@RequestMapping(method = RequestMethod.POST, path = "/stop")
	public void stop(
		@RequestBody
		@Valid DeleteTasksDto dto
	) {
		this.taskService.stopMany(dto.getIds());
	}
}

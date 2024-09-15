package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.metafile.FileStats;
import com.zendrive.api.core.service.stats.StatsService;
import com.zendrive.api.rest.models.dto.stats.StatsRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.FileSystemException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/stats")
@RequiredArgsConstructor
public class StatsController {
	private final StatsService statsService;

	@RequestMapping(method = RequestMethod.POST, path = "")
	public ResponseEntity<FileStats> getStats(
		@Valid
		@RequestBody
		StatsRequest request
	) throws FileSystemException {
		return ResponseEntity.ok(this.statsService.get(request.getPath(), request.getStorageConfig()));
	}
}

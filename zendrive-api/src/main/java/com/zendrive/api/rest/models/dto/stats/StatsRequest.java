package com.zendrive.api.rest.models.dto.stats;

import com.zendrive.api.core.model.task.StorageConfig;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StatsRequest {
	private String path;
	private StorageConfig storageConfig;
}

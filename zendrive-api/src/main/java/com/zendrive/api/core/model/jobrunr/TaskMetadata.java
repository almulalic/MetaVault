package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskMetadata {
	@JsonIgnore
	private String className;
	private TaskDashboardLog taskRunrDashboardLog;
	private TaskDashboardProgress taskRunrDashboardProgressBar;

	@JsonIgnore
	private static final ObjectMapper objectMapper = new ObjectMapper();

	@JsonAnySetter
	public void handleUnknownProperties(String key, Object value) {
		if (key.matches("jobRunrDashboardLog-\\d+")) {
			this.taskRunrDashboardLog = objectMapper.convertValue(value, TaskDashboardLog.class);
		} else if (key.matches("jobRunrDashboardProgressBar-\\d+")) {
			this.taskRunrDashboardProgressBar = objectMapper.convertValue(value, TaskDashboardProgress.class);
		}
	}
}
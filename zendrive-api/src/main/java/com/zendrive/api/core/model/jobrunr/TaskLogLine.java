package com.zendrive.api.core.model.jobrunr;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskLogLine {
	private TaskLogLevel level;
	private String logInstant;
	private String logMessage;
}

package com.zendrive.api.core.model.jobrunr;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDashboardLevel {
	private List<TaskLogLine> logLines;
}

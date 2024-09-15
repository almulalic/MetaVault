package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties("@class")
public class TaskDashboardLog {
	private List<TaskLogLine> logLines;
}

package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties("@class")
public class TaskDashboardProgress {
	private int totalAmount;
	private int succeededAmount;
	private int failedAmount;
	private int progress;
	private List<TaskLogLine> logLines;
}

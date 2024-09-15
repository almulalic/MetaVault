package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
	@JsonAlias({ "jobRunrDashboardLog-2" })
	@JsonProperty("taskRunrDashboardLog2")
	private TaskDashboardLog taskRunrDashboardLog2;
	@JsonAlias({ "jobRunrDashboardProgressBar-2" })
	@JsonProperty("taskRunrDashboardProgressBar2")
	private TaskDashboardProgress taskRunrDashboardProgressBar2;
}
package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDetails {
	private String className;
	private String methodName;
	private boolean cacheable;
	@JsonAlias({ "jobParameters" })
	@JsonProperty("parameters")
	private List<TaskParameter> parameters;
}

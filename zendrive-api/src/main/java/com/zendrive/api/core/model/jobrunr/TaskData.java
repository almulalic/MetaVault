package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskData {
	private String id;
	private int version;
	@JsonAlias({ "jobSignature" })
	@JsonProperty("signature")
	private String signature;
	@JsonAlias({ "jobName" })
	@JsonProperty("name")
	private String name;
	private HashSet<String> labels;
	private int amountOfRetries;
	@JsonAlias({ "jobHistory" })
	@JsonProperty("history")
	private List<TaskHistoryItem> history;
	private TaskMetadata metadata;
	@JsonAlias({ "jobDetails" })
	@JsonProperty("details")
	private TaskDetails details;
}

package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties("@class")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskHistoryItem {
	private TaskState state;
	private String serverId;
	private String serverName;
	private int latencyDuration;
	private int processDuration;
	private Instant createdAt;
	private Instant updatedAt;
	private String reason;
	private String message;
	private String exceptionType;
	private String exceptionMessage;
	private String exceptionCauseType;
	private String exceptionCauseMessage;
	private String stackTrace;
	private boolean doNotRetry;
	private Instant scheduledAt;
	private String recurringJobId;
}

package com.zendrive.api.core.model.task;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class SyncConfig {
	@NotNull(message = "Cron expression must not be null!")
	@NotEmpty(message = "Cron expression must not be empty!")
	private String cronExpression;

	@Min(value = 1, message = "Minimum concurrency is 1!")
	private int maxConcurrency = 1;

	private String recurrentJobId;
}

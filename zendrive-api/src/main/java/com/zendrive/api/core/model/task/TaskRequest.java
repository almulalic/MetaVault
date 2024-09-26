package com.zendrive.api.core.model.task;

import com.zendrive.api.core.task.model.request.ZenDriveJobRequest;
import lombok.*;

import java.util.Set;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class TaskRequest<T extends ZenDriveJobRequest> {
	private String name;
	private Set<String> labels;
	private int amountOfRetries;
	private T jobRequest;
	private SyncConfig syncConfig;
}

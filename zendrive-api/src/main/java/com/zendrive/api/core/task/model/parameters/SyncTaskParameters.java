package com.zendrive.api.core.task.model.parameters;

import com.zendrive.api.core.model.task.ConflictStrategy;
import com.zendrive.api.core.model.task.SyncConfig;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class SyncTaskParameters {
	@NotNull(message = "Directory id must not be null!")
	@NotEmpty(message = "Directory id must not empty!")
	private String directoryId;

	@NotNull(message = "File conflict strategy must not be null!")
	private ConflictStrategy fileConflictStrategy;

	private SyncConfig syncConfig;
}

package com.zendrive.api.core.task.model.parameters;

import com.zendrive.api.core.model.task.ConflictStrategy;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class ReScanTaskParameters {
	@NotNull
	private String directoryId;

	@NotNull
	private ConflictStrategy fileConflictStrategy;
}

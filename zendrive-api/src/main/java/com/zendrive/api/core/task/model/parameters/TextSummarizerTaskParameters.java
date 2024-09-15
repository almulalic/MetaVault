package com.zendrive.api.core.task.model.parameters;

import com.zendrive.api.core.model.task.ConflictStrategy;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TextSummarizerTaskParameters {
	@NotNull(message = "Directory id must not be null.")
	@NotEmpty(message = "Directory id must not be empty.")
	private String directoryId;

	@NotNull(message = "Destination key must not be null.")
	@NotEmpty(message = "Destination key must not be empty.")
	private String destinationKey;

	@NotNull(message = "Conflict strategy must not be null.")
	private ConflictStrategy conflictStrategy;

	@NotNull(message = "Extension whitelist must not be null.")
	private List<String> extensionsWhitelist;
}

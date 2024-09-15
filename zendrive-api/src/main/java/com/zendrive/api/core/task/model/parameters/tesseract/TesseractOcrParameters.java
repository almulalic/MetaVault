package com.zendrive.api.core.task.model.parameters.tesseract;

import com.zendrive.api.core.model.task.ConflictStrategy;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class TesseractOcrParameters {
	@NotNull
	@NotEmpty
	private String directoryId;

	@NotNull
	@NotEmpty
	private String destinationKey;

	@NotNull
	private ConflictStrategy conflictStrategy;

	@NotNull
	private List<String> extensionsWhitelist;

	@NotNull
	private TesseractParameters tesseractParameters;
}

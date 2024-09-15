package com.zendrive.api.core.task.model.parameters;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class ImageMetadataExtractParameters {
	private String directoryId;
	private String destinationKey;
	private boolean override;
}

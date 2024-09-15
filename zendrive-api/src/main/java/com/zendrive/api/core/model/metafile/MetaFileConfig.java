package com.zendrive.api.core.model.metafile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class MetaFileConfig {
	@Valid
	@NotNull
	private StorageConfig storageConfig;

	@NotNull
	@NotEmpty
	private String inputPath;

	private boolean sync;
}

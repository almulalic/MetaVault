package com.zendrive.api.core.model.metafile;

import com.zendrive.api.core.model.task.StorageConfig;
import com.zendrive.api.core.model.task.SyncConfig;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
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
	@NotNull(message = "Storage config must not be null!")
	private StorageConfig storageConfig;

	@NotNull(message = "Input path must not be null!")
	@NotEmpty(message = "Input path must not be empty!")
	private String inputPath;

	@Valid
	private SyncConfig syncConfig;
}

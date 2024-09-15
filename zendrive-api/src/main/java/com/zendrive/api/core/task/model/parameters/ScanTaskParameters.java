package com.zendrive.api.core.task.model.parameters;

import com.zendrive.api.core.model.metafile.MetaFileConfig;
import com.zendrive.api.core.model.metafile.Permissions;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class ScanTaskParameters {
	@NotNull
	@Valid
	private MetaFileConfig config;

	@NotNull
	@Valid
	private Permissions permissions;

	private String parentId;
}

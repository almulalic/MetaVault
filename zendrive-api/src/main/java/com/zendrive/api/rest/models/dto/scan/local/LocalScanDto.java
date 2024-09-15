package com.zendrive.api.rest.models.dto.scan.local;

import com.zendrive.api.core.model.metafile.MetaFileConfig;
import com.zendrive.api.core.model.metafile.Permissions;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalScanDto {
	@NotNull
	private MetaFileConfig config;

	@NotNull
	private Permissions permissions;
}

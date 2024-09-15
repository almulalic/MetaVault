package com.zendrive.api.core.model.metafile;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class StorageConfig {
	@NotNull
	private StorageType type;

	private String credentials;

	@AssertTrue(message = "Credentials must be provided for S3 storage")
	public boolean isValid() {
		if (type == StorageType.S3) {
			return credentials != null && !credentials.trim().isEmpty();
		}

		return true;
	}
}

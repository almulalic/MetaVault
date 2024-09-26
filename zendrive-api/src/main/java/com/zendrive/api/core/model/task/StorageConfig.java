package com.zendrive.api.core.model.task;

import com.zendrive.api.core.model.metafile.StorageType;
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
	@NotNull(message = "Storage type must not be null!")
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

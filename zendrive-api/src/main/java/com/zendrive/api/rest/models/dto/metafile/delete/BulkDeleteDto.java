package com.zendrive.api.rest.models.dto.metafile.delete;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkDeleteDto {
	@NotNull(message = "Ids must not be null!")
	@NotEmpty(message = "Ids must not be empty!")
	private List<String> ids;
}

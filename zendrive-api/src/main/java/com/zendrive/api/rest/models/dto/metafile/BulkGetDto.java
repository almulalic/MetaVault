package com.zendrive.api.rest.models.dto.metafile;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkGetDto {
	private List<String> metafileIds;
}

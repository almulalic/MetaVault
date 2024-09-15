package com.zendrive.api.rest.models.dto.metafile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchRequest {
	private String query;
	private int page;
	private int pageSize;
}

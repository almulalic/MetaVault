package com.zendrive.api.core.model.metafile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Breadcrumb {
	private String id;
	private String name;

	public static List<Breadcrumb> fromList(List<String> breadcrums) {
		return breadcrums.stream().map(x -> new Breadcrumb(null, x)).toList();
	}
}

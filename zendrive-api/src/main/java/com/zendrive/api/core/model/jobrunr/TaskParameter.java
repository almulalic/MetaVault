package com.zendrive.api.core.model.jobrunr;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskParameter {
	private String className;
	private String actualClassName;
	private Object object;
}

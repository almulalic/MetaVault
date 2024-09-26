package com.zendrive.api.core.model.task;

public enum TaskType {
	SCAN("SCAN"),
	SYNC("SYNC"),
	DELETE("DELETE");

	private final String value;

	TaskType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}
}

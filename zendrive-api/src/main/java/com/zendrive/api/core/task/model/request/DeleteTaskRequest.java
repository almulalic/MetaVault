package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.DeleteTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.DeleteTaskParameters;

public record DeleteTaskRequest(DeleteTaskParameters parameters) implements ZenDriveJobRequest {
	@Override
	public Class<DeleteTaskRequestHandler> getJobRequestHandler() {
		return DeleteTaskRequestHandler.class;
	}

	@Override
	public String getType() {
		return "Delete";
	}
}
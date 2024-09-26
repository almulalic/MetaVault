package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.SyncTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.SyncTaskParameters;

public record SyncTaskRequest(SyncTaskParameters parameters) implements ZenDriveJobRequest {
	@Override
	public Class<SyncTaskRequestHandler> getJobRequestHandler() {
		return SyncTaskRequestHandler.class;
	}

	@Override
	public String getType() {
		return "Sync";
	}
}
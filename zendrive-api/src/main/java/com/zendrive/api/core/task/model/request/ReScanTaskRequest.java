package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.ReScanTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.ReScanTaskParameters;

public record ReScanTaskRequest(ReScanTaskParameters parameters) implements ZenDriveJobRequest {
	@Override
	public Class<ReScanTaskRequestHandler> getJobRequestHandler() {
		return ReScanTaskRequestHandler.class;
	}

	@Override
	public String getType() {
		return "Rescan";
	}
}
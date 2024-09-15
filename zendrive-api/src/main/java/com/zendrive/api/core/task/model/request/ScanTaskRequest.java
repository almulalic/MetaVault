package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.ScanTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.ScanTaskParameters;
import org.jobrunr.jobs.lambdas.JobRequest;

public record ScanTaskRequest(ScanTaskParameters parameters) implements ZenDriveJobRequest {
	@Override
	public Class<ScanTaskRequestHandler> getJobRequestHandler() {
		return ScanTaskRequestHandler.class;
	}

	@Override
	public String getType() {
		return "Scan";
	}
}
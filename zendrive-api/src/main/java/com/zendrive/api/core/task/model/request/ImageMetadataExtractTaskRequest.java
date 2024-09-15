package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.ImageMetadataExtractTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.ImageMetadataExtractParameters;
import org.jobrunr.jobs.lambdas.JobRequest;

public record ImageMetadataExtractTaskRequest(ImageMetadataExtractParameters parameters) implements JobRequest {
	@Override
	public Class<ImageMetadataExtractTaskRequestHandler> getJobRequestHandler() {
		return ImageMetadataExtractTaskRequestHandler.class;
	}

	public String getName() {
		return "Image Metadata Extract";
	}
}
package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.TextSummarizerTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.TextSummarizerTaskParameters;

public record TextSummarizerTaskRequest(TextSummarizerTaskParameters parameters) implements ZenDriveJobRequest {
	@Override
	public Class<TextSummarizerTaskRequestHandler> getJobRequestHandler() {
		return TextSummarizerTaskRequestHandler.class;
	}

	@Override
	public String getType() {
		return "Text Summarizer";
	}
}
package com.zendrive.api.core.task.model.request;

import com.zendrive.api.core.task.handler.TesseractOcrTaskRequestHandler;
import com.zendrive.api.core.task.model.parameters.tesseract.TesseractOcrParameters;
import org.jobrunr.jobs.lambdas.JobRequest;

public record TesseractOcrTaskRequest(TesseractOcrParameters parameters) implements ZenDriveJobRequest {
	@Override
	public Class<TesseractOcrTaskRequestHandler> getJobRequestHandler() {
		return TesseractOcrTaskRequestHandler.class;
	}

	@Override
	public String getType() {
		return "Tesseract OCR";
	}
}
package com.zendrive.api.core.task.model.request;

import org.jobrunr.jobs.lambdas.JobRequest;

public interface ZenDriveJobRequest extends JobRequest {

	String getType();
}

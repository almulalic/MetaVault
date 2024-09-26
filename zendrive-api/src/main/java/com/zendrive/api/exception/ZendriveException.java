package com.zendrive.api.exception;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ZendriveException extends RuntimeException {
	private ZendriveErrorCode errorCode;

	@JsonIgnore
	@Override
	public StackTraceElement[] getStackTrace() {
		return super.getStackTrace();
	}

	public ZendriveException(ZendriveErrorCode errorCode) {
		this.errorCode = errorCode;
	}

	public ZendriveException(String message, ZendriveErrorCode errorCode) {
		super(message);
		this.errorCode = errorCode;
	}

	public ZendriveException(String message, Throwable cause, ZendriveErrorCode errorCode) {
		super(message, cause);
		this.errorCode = errorCode;
	}

	public ZendriveException(Throwable cause, ZendriveErrorCode errorCode) {
		super(cause);
		this.errorCode = errorCode;
	}
}

package com.zendrive.api.exception;

public class InvalidArgumentsException extends ZendriveException {
	private static final ZendriveErrorCode errorCode = ZendriveErrorCode.INVALID_ARGUMENTS;
	
	public InvalidArgumentsException() {
		super(errorCode);
	}

	public InvalidArgumentsException(String message) {
		super(message, errorCode);
	}

	public InvalidArgumentsException(String message, Throwable cause) {
		super(message, cause, errorCode);
	}

	public InvalidArgumentsException(Throwable cause) {
		super(cause, errorCode);
	}
}

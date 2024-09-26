package com.zendrive.api.exception;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ZendriveErrorCode {
	GENERAL(1),
	AUTHENTICATION(10),
	JWT_TOKEN_EXPIRED(11),
	CREDENTIALS_EXPIRED(15),
	PERMISSION_DENIED(20),
	INVALID_ARGUMENTS(30),
	ENTITY_NOT_FOUND(32);

	private final int errorCode;

	ZendriveErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	@JsonValue
	public int getErrorCode() {
		return errorCode;
	}
}

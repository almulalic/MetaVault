package com.zendrive.api.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RestControllerAdvice
public class ZenDriveExceptionHandler {
	private static final Map<HttpStatus, ZendriveErrorCode> statusToErrorCodeMap = new HashMap<>();

	static {
		statusToErrorCodeMap.put(HttpStatus.BAD_REQUEST, ZendriveErrorCode.INVALID_ARGUMENTS);
		statusToErrorCodeMap.put(HttpStatus.UNAUTHORIZED, ZendriveErrorCode.AUTHENTICATION);
		statusToErrorCodeMap.put(HttpStatus.FORBIDDEN, ZendriveErrorCode.PERMISSION_DENIED);
		statusToErrorCodeMap.put(HttpStatus.NOT_FOUND, ZendriveErrorCode.ENTITY_NOT_FOUND);
		statusToErrorCodeMap.put(HttpStatus.INTERNAL_SERVER_ERROR, ZendriveErrorCode.GENERAL);
		statusToErrorCodeMap.put(HttpStatus.SERVICE_UNAVAILABLE, ZendriveErrorCode.GENERAL);
	}

	private static final Map<ZendriveErrorCode, HttpStatus> errorCodeToStatusMap = new HashMap<>();

	static {
		errorCodeToStatusMap.put(ZendriveErrorCode.GENERAL, HttpStatus.INTERNAL_SERVER_ERROR);
		errorCodeToStatusMap.put(ZendriveErrorCode.AUTHENTICATION, HttpStatus.UNAUTHORIZED);
		errorCodeToStatusMap.put(ZendriveErrorCode.JWT_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
		errorCodeToStatusMap.put(ZendriveErrorCode.CREDENTIALS_EXPIRED, HttpStatus.UNAUTHORIZED);
		errorCodeToStatusMap.put(ZendriveErrorCode.PERMISSION_DENIED, HttpStatus.FORBIDDEN);
		errorCodeToStatusMap.put(ZendriveErrorCode.INVALID_ARGUMENTS, HttpStatus.BAD_REQUEST);
		errorCodeToStatusMap.put(ZendriveErrorCode.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
	}

	private static final ObjectMapper objectMapper = new ObjectMapper();

	private static ZendriveErrorCode statusToErrorCode(HttpStatus status) {
		return statusToErrorCodeMap.getOrDefault(status, ZendriveErrorCode.GENERAL);
	}

	private static HttpStatus errorCodeToStatus(ZendriveErrorCode errorCode) {
		return errorCodeToStatusMap.getOrDefault(errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(Exception.class)
	public void handle(Exception exception, HttpServletResponse response) throws IOException {
		log.debug("Processing exception {}", exception.getMessage(), exception);

		if (!response.isCommitted()) {
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);

			if (exception instanceof ZendriveException zendriveException) {
				ZendriveErrorCode errorCode = zendriveException.getErrorCode();
				HttpStatus status = errorCodeToStatus(errorCode);
				response.setStatus(status.value());

				objectMapper.writeValue(response.getWriter(), zendriveException);
			} else {
				response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

				objectMapper.writeValue(response.getWriter(), new ZendriveException(
					exception.getMessage(),
					exception.getCause(),
					ZendriveErrorCode.GENERAL
				));
			}
		}
	}

}

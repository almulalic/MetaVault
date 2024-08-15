package com.zendrive.api.exception.auth;

import com.zendrive.api.exception.GenericHttpException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a token refresh fails.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class TokenRefreshException extends GenericHttpException {
  public TokenRefreshException(String token, String message) {
    super(HttpStatus.UNAUTHORIZED, String.format("Failed for [%s]: %s", token, message));
  }
}

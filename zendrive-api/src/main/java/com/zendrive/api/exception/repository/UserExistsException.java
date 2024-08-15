package com.zendrive.api.exception.repository;

import com.zendrive.api.exception.GenericHttpException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a user exists in database.
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UserExistsException extends GenericHttpException {
  public UserExistsException(String message) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}

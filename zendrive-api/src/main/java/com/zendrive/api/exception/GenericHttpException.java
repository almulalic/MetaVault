package com.zendrive.api.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;

/**
 * Generic exception class for handling HTTP-related exceptions.
 * <p>
 * This exception provides flexibility for handling various HTTP status codes and custom error messages.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GenericHttpException extends RuntimeException {

  private HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  /**
   * Constructs a new instance of GenericHttpException with the specified HTTP status code.
   *
   * @param httpCode The HTTP status code.
   */
  public GenericHttpException(HttpStatus httpCode) {
    this.httpStatus = httpCode;
  }

  /**
   * Constructs a new instance of GenericHttpException with the specified HTTP status code and custom error message.
   *
   * @param httpCode The HTTP status code.
   * @param message  The custom error message.
   */
  public GenericHttpException(HttpStatus httpCode, String message) {
    super(message);
    this.httpStatus = httpCode;
  }

  /**
   * Constructs a new instance of GenericHttpException with a custom error message and the underlying cause.
   *
   * @param message The custom error message.
   * @param e       The underlying cause of the exception.
   */
  public GenericHttpException(String message, Exception e) {
    super(message, e);
  }

  /**
   * Constructs a new instance of GenericHttpException with the underlying cause of the exception.
   *
   * @param e The underlying cause of the exception.
   */
  public GenericHttpException(Exception e) {
    super(e);
  }

  /**
   * Constructs a new instance of GenericHttpException with a custom error message.
   *
   * @param message The custom error message.
   */
  public GenericHttpException(String message) {
    super(message);
  }
}

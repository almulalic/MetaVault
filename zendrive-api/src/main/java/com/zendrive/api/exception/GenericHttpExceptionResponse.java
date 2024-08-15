package com.zendrive.api.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

/**
 * Represents the response structure for handling instances of GenericHttpException in the application.
 */
@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class GenericHttpExceptionResponse {

  /**
   * The error message associated with the exception.
   */
  private final String message;

  /**
   * The fully qualified name of the exception class.
   */
  private final String throwableName;

  /**
   * The HTTP status of the error response.
   */
  private final HttpStatus httpStatus;

  /**
   * The HTTP status code of the error response.
   */
  private final int httpStatusCode;

  /**
   * The timestamp when the error response was generated.
   */
  private final ZonedDateTime timestamp;
}

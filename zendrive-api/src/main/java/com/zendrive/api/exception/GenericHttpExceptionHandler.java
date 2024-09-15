package com.zendrive.api.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;

/**
 * Global exception handler for handling instances of GenericHttpException across the application.
 */
@ControllerAdvice
public class GenericHttpExceptionHandler {

    /**
     * Handles instances of GenericHttpException and returns a ResponseEntity with the appropriate error response.
     *
     * @param ex The instance of GenericHttpException to handle.
     * @return A ResponseEntity containing the error response.
     */
    @ExceptionHandler(
      value = {
        GenericHttpException.class,
        GenericHttpException.class
      }
    )
    public ResponseEntity<Object> handleGenericHttpException(GenericHttpException ex) {
        GenericHttpExceptionResponse genericHttpExceptionResponse =
          GenericHttpExceptionResponse.Builder()
            .withHttpStatus(ex.getHttpStatus())
            .withHttpStatusCode(ex.getHttpStatus().value())
            .withMessage(ex.getMessage())
            .withThrowableName(ex.getClass().getName())
            .withTimestamp(ZonedDateTime.now())
            .build();

        return new ResponseEntity<>(genericHttpExceptionResponse, ex.getHttpStatus());
    }
}

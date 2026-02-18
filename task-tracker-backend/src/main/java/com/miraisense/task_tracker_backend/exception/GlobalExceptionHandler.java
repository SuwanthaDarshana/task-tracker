package com.miraisense.task_tracker_backend.exception;

import com.miraisense.task_tracker_backend.dto.StandardResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<StandardResponseDTO<Object>> handleResourceNotFoundException(
                        ResourceNotFoundException ex) {
                return new ResponseEntity<>(
                                StandardResponseDTO.builder()
                                                .message(ex.getMessage())
                                                .statusCode(HttpStatus.NOT_FOUND.value())
                                                .build(),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(DuplicateResourceException.class)
        public ResponseEntity<StandardResponseDTO<Object>> handleDuplicateResourceException(
                        DuplicateResourceException ex) {
                return new ResponseEntity<>(
                                StandardResponseDTO.builder()
                                                .message(ex.getMessage())
                                                .statusCode(HttpStatus.CONFLICT.value())
                                                .build(),
                                HttpStatus.CONFLICT);
        }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<StandardResponseDTO<Object>> handleAuthenticationException(AuthenticationException ex) {
                return new ResponseEntity<>(
                                StandardResponseDTO.builder()
                                                .message(ex.getMessage())
                                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                                .build(),
                                HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<StandardResponseDTO<Map<String, String>>> handleValidationExceptions(
                        MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                return new ResponseEntity<>(
                                StandardResponseDTO.<Map<String, String>>builder()
                                                .data(errors)
                                                .message("Validation failed")
                                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                                .build(),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<StandardResponseDTO<Object>> handleGenericException(Exception ex) {
                log.error("Unhandled exception", ex);
                return new ResponseEntity<>(
                                StandardResponseDTO.builder()
                                                .message("An unexpected error occurred. Please try again later.")
                                                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                                .build(),
                                HttpStatus.INTERNAL_SERVER_ERROR);
        }

}

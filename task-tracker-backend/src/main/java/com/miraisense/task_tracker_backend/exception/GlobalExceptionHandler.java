package com.miraisense.task_tracker_backend.exception;

import com.miraisense.task_tracker_backend.dto.StandardResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles 404 - Resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.NOT_FOUND.value())
                        .build(),
                HttpStatus.NOT_FOUND
        );
    }

    // Handles 409 - Duplicate resource (e.g., email already in use)
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleDuplicateResourceException(DuplicateResourceException ex) {
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.CONFLICT.value())
                        .build(),
                HttpStatus.CONFLICT
        );
    }

    // Handles 401 - Authentication failure (invalid credentials)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.UNAUTHORIZED.value())
                        .build(),
                HttpStatus.UNAUTHORIZED
        );
    }

    // Handles DTO @Valid constraints (e.g., @NotBlank, @FutureOrPresent)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponseDTO<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return new ResponseEntity<>(
                StandardResponseDTO.<Map<String, String>>builder()
                        .data(errors)
                        .message("Validation failed")
                        .statusCode(HttpStatus.BAD_REQUEST.value())
                        .build(),
                HttpStatus.BAD_REQUEST
        );
    }

    // Handles any other unexpected exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build(),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}

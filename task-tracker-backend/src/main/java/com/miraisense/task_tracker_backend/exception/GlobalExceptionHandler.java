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

    // Handles resource not found or logic errors
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.NOT_FOUND.value())
                        .build(),
                HttpStatus.NOT_FOUND
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

}

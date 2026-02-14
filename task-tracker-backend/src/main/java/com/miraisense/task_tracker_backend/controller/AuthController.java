package com.miraisense.task_tracker_backend.controller;

import com.miraisense.task_tracker_backend.dto.*;
import com.miraisense.task_tracker_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> register(@Valid @RequestBody UserRequestDTO request) {

        UserResponseDTO userResponseDTO = userService.register(request);
        return new ResponseEntity<>(
                StandardResponseDTO.<UserResponseDTO>builder()
                        .data(userResponseDTO)
                        .message("User registered successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build(),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponseDTO<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {

        AuthResponseDTO authResponseDTO = userService.login(request);
        return ResponseEntity.ok(
                StandardResponseDTO.<AuthResponseDTO>builder()
                        .data(authResponseDTO)
                        .message("Login successful")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }
}

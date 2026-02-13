package com.miraisense.task_tracker_backend.service.impl;

import com.miraisense.task_tracker_backend.dto.AuthResponseDTO;
import com.miraisense.task_tracker_backend.dto.LoginRequestDTO;
import com.miraisense.task_tracker_backend.dto.UserRequestDTO;
import com.miraisense.task_tracker_backend.dto.UserResponseDTO;
import com.miraisense.task_tracker_backend.entity.User;
import com.miraisense.task_tracker_backend.exception.ResourceNotFoundException;
import com.miraisense.task_tracker_backend.repository.UserRepository;
import com.miraisense.task_tracker_backend.security.JwtService;
import com.miraisense.task_tracker_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserResponseDTO register(UserRequestDTO request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // Create and encode password
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String jwtToken = jwtService.generateToken(user.getEmail());

        // Return auth data (Providing the userId for the frontend to manage tasks)
        return AuthResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token(jwtToken) // JWT token
                .build();
    }
}

package com.miraisense.task_tracker_backend.service.impl;

import com.miraisense.task_tracker_backend.dto.AuthResponseDTO;
import com.miraisense.task_tracker_backend.dto.LoginRequestDTO;
import com.miraisense.task_tracker_backend.dto.UserRequestDTO;
import com.miraisense.task_tracker_backend.dto.UserResponseDTO;
import com.miraisense.task_tracker_backend.entity.User;
import com.miraisense.task_tracker_backend.exception.AuthenticationException;
import com.miraisense.task_tracker_backend.exception.DuplicateResourceException;
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
            throw new DuplicateResourceException("Email already in use");
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
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        // Generate short-lived access token (JWT)
        String accessToken = jwtService.generateToken(user.getEmail());

        // Return auth data (access token only — refresh token is set as HttpOnly cookie
        // by controller)
        return AuthResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token(accessToken)
                .build();
    }
}

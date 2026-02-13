package com.miraisense.task_tracker_backend.service;

import com.miraisense.task_tracker_backend.dto.AuthResponseDTO;
import com.miraisense.task_tracker_backend.dto.LoginRequestDTO;
import com.miraisense.task_tracker_backend.dto.UserRequestDTO;
import com.miraisense.task_tracker_backend.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO register(UserRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
}

package com.miraisense.task_tracker_backend.service;

import com.miraisense.task_tracker_backend.dto.TaskRequestDTO;
import com.miraisense.task_tracker_backend.dto.TaskResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId);

    Page<TaskResponseDTO> getAllTasksByUserId(Long userId, Pageable pageable);

    TaskResponseDTO getTaskById(Long taskId, Long authenticatedUserId);

    TaskResponseDTO updateTask(Long taskId, TaskRequestDTO taskRequestDTO, Long authenticatedUserId);

    void deleteTask(Long taskId, Long authenticatedUserId);
}

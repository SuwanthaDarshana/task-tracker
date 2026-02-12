package com.miraisense.task_tracker_backend.service.impl;

import com.miraisense.task_tracker_backend.dto.TaskRequestDTO;
import com.miraisense.task_tracker_backend.dto.TaskResponseDTO;
import com.miraisense.task_tracker_backend.service.TaskService;

import java.util.List;

public class TaskServiceImpl implements TaskService {
    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId) {
        return null;
    }

    @Override
    public List<TaskResponseDTO> getAllTasksByUserId(Long userId) {
        return List.of();
    }

    @Override
    public TaskResponseDTO getTaskById(Long id) {
        return null;
    }

    @Override
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        return null;
    }

    @Override
    public void deleteTask(Long taskId) {

    }
}

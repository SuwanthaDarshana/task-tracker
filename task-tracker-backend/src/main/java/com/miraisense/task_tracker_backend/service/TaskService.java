package com.miraisense.task_tracker_backend.service;

import com.miraisense.task_tracker_backend.dto.TaskRequestDTO;
import com.miraisense.task_tracker_backend.dto.TaskResponseDTO;

import java.util.List;

public interface TaskService{
    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId);
    List<TaskResponseDTO> getAllTasksByUserId(Long userId);
    TaskResponseDTO getTaskById(Long taskId);
    TaskResponseDTO updateTask(Long taskId, TaskRequestDTO taskRequestDTO);
    void deleteTask(Long taskId);
}

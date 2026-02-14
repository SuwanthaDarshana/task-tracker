package com.miraisense.task_tracker_backend.service.impl;

import com.miraisense.task_tracker_backend.dto.TaskRequestDTO;
import com.miraisense.task_tracker_backend.dto.TaskResponseDTO;
import com.miraisense.task_tracker_backend.entity.Task;
import com.miraisense.task_tracker_backend.entity.TaskStatus;
import com.miraisense.task_tracker_backend.entity.User;
import com.miraisense.task_tracker_backend.exception.ResourceNotFoundException;
import com.miraisense.task_tracker_backend.repository.TaskRepository;
import com.miraisense.task_tracker_backend.repository.UserRepository;
import com.miraisense.task_tracker_backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {


    private final TaskRepository taskRepository;
    private final UserRepository userRepository;


    @Override
    @CacheEvict(value = "tasks", key = "#userId") // Clear cache when a task is created then next 'get' will be fresh
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Task task = Task.builder()
                .title(taskRequestDTO.getTitle())
                .description(taskRequestDTO.getDescription())
                .status(taskRequestDTO.getStatus() != null ? taskRequestDTO.getStatus() : TaskStatus.TODO)
                .dueDate(taskRequestDTO.getDueDate())
                .user(user)
                .build();

        return mapToResponseDTO(taskRepository.save(task)) ;
    }

    @Override
    @Cacheable(value = "tasks", key = "#userId + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<TaskResponseDTO> getAllTasksByUserId(Long userId, Pageable pageable) {
        Page<Task> taskPage = taskRepository.findByUserId(userId, pageable);
        return taskPage.map(this::mapToResponseDTO);
    }

    @Override
    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToResponseDTO(task);
    }

    @Override
    @CacheEvict(value = "tasks", allEntries = true) // Safer to clear all task cache on update
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setTitle(taskRequestDTO.getTitle());
        task.setDescription(taskRequestDTO.getDescription());
        if (taskRequestDTO.getStatus() != null) {
            task.setStatus(taskRequestDTO.getStatus());
        }
        task.setDueDate(taskRequestDTO.getDueDate());
        return mapToResponseDTO(taskRepository.save(task));
    }

    @Override
    @CacheEvict(value = "tasks", allEntries = true)
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Cannot delete. Task not found with id: " + taskId);
        }
        taskRepository.deleteById(taskId);

    }


    private TaskResponseDTO mapToResponseDTO(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .build();
    }


}

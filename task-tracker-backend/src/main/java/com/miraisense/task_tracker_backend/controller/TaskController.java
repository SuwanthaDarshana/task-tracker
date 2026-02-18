package com.miraisense.task_tracker_backend.controller;

import com.miraisense.task_tracker_backend.dto.StandardResponseDTO;
import com.miraisense.task_tracker_backend.dto.TaskRequestDTO;
import com.miraisense.task_tracker_backend.dto.TaskResponseDTO;
import com.miraisense.task_tracker_backend.entity.User;
import com.miraisense.task_tracker_backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

        private final TaskService taskService;

        @PostMapping("/{userId}")
        public ResponseEntity<StandardResponseDTO<TaskResponseDTO>> createTask(
                        @PathVariable Long userId,
                        @Valid @RequestBody TaskRequestDTO taskRequestDTO,
                        @AuthenticationPrincipal User principal) {
                // Verify the authenticated user matches the path userId
                if (!principal.getId().equals(userId)) {
                        return new ResponseEntity<>(
                                        StandardResponseDTO.<TaskResponseDTO>builder()
                                                        .message("You can only create tasks for your own account")
                                                        .statusCode(HttpStatus.FORBIDDEN.value())
                                                        .build(),
                                        HttpStatus.FORBIDDEN);
                }
                TaskResponseDTO taskResponseDTO = taskService.createTask(taskRequestDTO, userId);
                return new ResponseEntity<>(
                                StandardResponseDTO.<TaskResponseDTO>builder()
                                                .data(taskResponseDTO)
                                                .message("Task created successfully")
                                                .statusCode(HttpStatus.CREATED.value())
                                                .build(),
                                HttpStatus.CREATED);
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<StandardResponseDTO<Page<TaskResponseDTO>>> getAllTasksByUserId(
                        @PathVariable Long userId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "6") int size,
                        @AuthenticationPrincipal User principal) {

                // Verify the authenticated user matches the path userId
                if (!principal.getId().equals(userId)) {
                        return new ResponseEntity<>(
                                        StandardResponseDTO.<Page<TaskResponseDTO>>builder()
                                                        .message("You can only view your own tasks")
                                                        .statusCode(HttpStatus.FORBIDDEN.value())
                                                        .build(),
                                        HttpStatus.FORBIDDEN);
                }

                // Modern way: Sort by dueDate descending so newest tasks appear first
                Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").descending());

                Page<TaskResponseDTO> tasksPage = taskService.getAllTasksByUserId(userId, pageable);

                return ResponseEntity.ok(
                                StandardResponseDTO.<Page<TaskResponseDTO>>builder()
                                                .data(tasksPage)
                                                .message("Tasks retrieved successfully")
                                                .statusCode(HttpStatus.OK.value())
                                                .build());
        }

        @GetMapping("/{taskId}")
        public ResponseEntity<StandardResponseDTO<TaskResponseDTO>> getTaskById(
                        @PathVariable Long taskId,
                        @AuthenticationPrincipal User principal) {
                TaskResponseDTO taskResponseDTO = taskService.getTaskById(taskId, principal.getId());
                return ResponseEntity.ok(
                                StandardResponseDTO.<TaskResponseDTO>builder()
                                                .data(taskResponseDTO)
                                                .message("Task retrieved successfully")
                                                .statusCode(HttpStatus.OK.value())
                                                .build());
        }

        @PutMapping("/{taskId}")
        public ResponseEntity<StandardResponseDTO<TaskResponseDTO>> updateTask(
                        @PathVariable Long taskId,
                        @Valid @RequestBody TaskRequestDTO taskRequestDTO,
                        @AuthenticationPrincipal User principal) {
                TaskResponseDTO taskResponseDTO = taskService.updateTask(taskId, taskRequestDTO, principal.getId());
                return ResponseEntity.ok(
                                StandardResponseDTO.<TaskResponseDTO>builder()
                                                .data(taskResponseDTO)
                                                .message("Task updated successfully")
                                                .statusCode(HttpStatus.OK.value())
                                                .build());
        }

        @DeleteMapping("/{taskId}")
        public ResponseEntity<StandardResponseDTO<Void>> deleteTask(
                        @PathVariable Long taskId,
                        @AuthenticationPrincipal User principal) {
                taskService.deleteTask(taskId, principal.getId());
                return ResponseEntity.ok(
                                StandardResponseDTO.<Void>builder()
                                                .message("Task deleted successfully")
                                                .statusCode(HttpStatus.OK.value())
                                                .build());
        }
}

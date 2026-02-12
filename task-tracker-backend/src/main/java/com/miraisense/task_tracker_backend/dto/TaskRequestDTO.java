package com.miraisense.task_tracker_backend.dto;

import com.miraisense.task_tracker_backend.entity.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be under 100 characters")
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private TaskStatus status;  //Optional: Defaulted to TODO in service if null

    @FutureOrPresent(message = "Due date cannot be in the past")
    private LocalDateTime dueDate;
}

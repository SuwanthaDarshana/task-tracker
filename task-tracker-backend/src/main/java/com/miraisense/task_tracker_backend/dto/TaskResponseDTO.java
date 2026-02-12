package com.miraisense.task_tracker_backend.dto;

import com.miraisense.task_tracker_backend.entity.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDateTime dueDate;
}

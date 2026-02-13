package com.miraisense.task_tracker_backend.repository;

import com.miraisense.task_tracker_backend.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long id);
    Page<Task> findByUserId(Long id, Pageable pageable);

}

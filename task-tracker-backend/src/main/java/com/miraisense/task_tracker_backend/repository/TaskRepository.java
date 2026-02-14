package com.miraisense.task_tracker_backend.repository;

import com.miraisense.task_tracker_backend.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByUserId(Long id, Pageable pageable);

}

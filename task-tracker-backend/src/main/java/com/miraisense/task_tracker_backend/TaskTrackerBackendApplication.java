package com.miraisense.task_tracker_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TaskTrackerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskTrackerBackendApplication.class, args);
	}

}

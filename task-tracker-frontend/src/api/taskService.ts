import api from "./axiosConfig";
import type { Task, StandardResponse, CreateTaskRequest, PageResponse } from "../types";

export const taskService = {
  getTasks: async (userId: number, page: number = 0, size: number = 6): Promise<PageResponse<Task>> => {
    const { data } = await api.get<StandardResponse<PageResponse<Task>>>(
      `/tasks/user/${userId}`,
      { params: { page, size } },
    );
    return data.data;
  },

  // Fetch ALL tasks by iterating through every page
  getAllTasks: async (userId: number): Promise<Task[]> => {
    const allTasks: Task[] = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
      const { data } = await api.get<StandardResponse<PageResponse<Task>>>(
        `/tasks/user/${userId}`,
        { params: { page, size: 100 } },
      );
      const pageData = data.data;
      allTasks.push(...pageData.content);
      totalPages = pageData.totalPages;
      page++;
    }

    return allTasks;
  },

  createTask: async (
    userId: number,
    task: CreateTaskRequest,
  ): Promise<Task> => {
    const { data } = await api.post<StandardResponse<Task>>(
      `/tasks/${userId}`,
      task,
    );
    return data.data;
  },

  updateTask: async (
    taskId: number,
    task: Partial<CreateTaskRequest>,
  ): Promise<Task> => {
    const { data } = await api.put<StandardResponse<Task>>(
      `/tasks/${taskId}`,
      task,
    );
    return data.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  getTaskById: async (taskId: number): Promise<Task> => {
    const { data } = await api.get<StandardResponse<Task>>(
      `/tasks/${taskId}`,
    );
    return data.data;
  },
};

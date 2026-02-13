import api from "./axiosConfig";
import type { Task, StandardResponse, CreateTaskRequest } from "../types";

export const taskService = {
  getTasks: async (userId: number): Promise<Task[]> => {
    const { data } = await api.get<StandardResponse<Task[]>>(
      `/tasks/user/${userId}`,
    );
    return data.data;
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
};

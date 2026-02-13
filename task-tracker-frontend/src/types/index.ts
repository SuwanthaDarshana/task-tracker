export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export type User = {
  id: number;
  email: string;
};

export type UserResponseDTO = User;

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
};

export type AuthResponse = {
  token: string;
  email: string;
  userId: number;
};

export type StandardResponse<T> = {
  data: T;
  message: string;
  statusCode: number;
};

// For creating/updating tasks
export type CreateTaskRequest = Omit<Task, 'id'>;

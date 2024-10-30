export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
  lastActiveAt?: string;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  timeSpent: number; // in seconds
}

export interface User {
  id: string;
  email: string;
  name: string;
}
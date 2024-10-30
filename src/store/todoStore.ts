import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Subtask } from '../types';

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addSubtask: (todoId: string, text: string) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  updateTodoText: (todoId: string, text: string) => void;
  updateTimeSpent: (todoId: string, subtaskId: string | null, seconds: number) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now().toString(),
              text,
              completed: false,
              subtasks: [],
              createdAt: new Date().toISOString(),
              timeSpent: 0,
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  completedAt: !todo.completed ? new Date().toISOString() : undefined,
                }
              : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      addSubtask: (todoId, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: [
                    ...todo.subtasks,
                    {
                      id: Date.now().toString(),
                      text,
                      completed: false,
                      timeSpent: 0,
                    },
                  ],
                }
              : todo
          ),
        })),
      toggleSubtask: (todoId, subtaskId) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? {
                          ...subtask,
                          completed: !subtask.completed,
                          completedAt: !subtask.completed
                            ? new Date().toISOString()
                            : undefined,
                        }
                      : subtask
                  ),
                }
              : todo
          ),
        })),
      deleteSubtask: (todoId, subtaskId) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks.filter(
                    (subtask) => subtask.id !== subtaskId
                  ),
                }
              : todo
          ),
        })),
      updateTodoText: (todoId, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId ? { ...todo, text } : todo
          ),
        })),
      updateTimeSpent: (todoId, subtaskId, seconds) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  timeSpent: subtaskId ? todo.timeSpent : todo.timeSpent + seconds,
                  lastActiveAt: new Date().toISOString(),
                  subtasks: todo.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, timeSpent: subtask.timeSpent + seconds }
                      : subtask
                  ),
                }
              : todo
          ),
        })),
    }),
    {
      name: 'todo-storage',
    }
  )
);
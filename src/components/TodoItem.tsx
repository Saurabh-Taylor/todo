import React from 'react';
import { Trash2, ChevronRight, CheckCircle2, Timer } from 'lucide-react';
import { Todo } from '../types';
import { useNavigate } from 'react-router-dom';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  isSelected,
  onSelect 
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex items-center justify-between animate-fade-in ${
        isSelected ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''
      }`}
    >
      <div className="flex items-center flex-1 min-w-0">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
          }`}
        >
          {todo.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>
        <span
          className={`ml-3 truncate ${
            todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'
          }`}
        >
          {todo.text}
        </span>
        {todo.subtasks.length > 0 && (
          <span className="ml-3 text-sm px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
            {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onSelect}
          className={`text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors p-1 ${
            isSelected ? 'text-purple-500 dark:text-purple-400' : ''
          }`}
        >
          <Timer className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(`/todos/${todo.id}`)}
          className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { Subtask } from '../types';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="group flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all animate-fade-in">
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            subtask.completed
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
          }`}
        >
          {subtask.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>
        <span
          className={`ml-3 ${
            subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'
          }`}
        >
          {subtask.text}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
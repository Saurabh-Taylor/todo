import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { Todo } from '../types';
import { useTodoStore } from '../store/todoStore';

interface FocusSessionProps {
  todo: Todo;
  onClose: () => void;
}

const timePresets = [
  { label: '15m', value: 15 },
  { label: '25m', value: 25 },
  { label: '30m', value: 30 },
  { label: '45m', value: 45 },
  { label: '60m', value: 60 },
];

export const FocusSession: React.FC<FocusSessionProps> = ({ todo, onClose }) => {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<string | null>(null);
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toggleSubtask, updateTimeSpent } = useTodoStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        setElapsedTime((time) => time + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Update time spent when timer completes
      updateTimeSpent(todo.id, selectedSubtask, elapsedTime);
      setElapsedTime(0);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
        if (elapsedTime > 0) {
          updateTimeSpent(todo.id, selectedSubtask, elapsedTime);
        }
      }
    };
  }, [isRunning, timeLeft, todo.id, selectedSubtask, elapsedTime, updateTimeSpent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const resetTimer = () => {
    if (elapsedTime > 0) {
      updateTimeSpent(todo.id, selectedSubtask, elapsedTime);
    }
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setElapsedTime(0);
  };

  const setCustomDuration = (minutes: number) => {
    setDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setShowTimeSettings(false);
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Focus Session</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <svg className="w-48 h-48">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
            <circle
              className="text-purple-500 dark:text-purple-400"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
              strokeDasharray="439.8"
              strokeDashoffset={439.8 - (progress * 439.8) / 100}
              style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-white">
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setShowTimeSettings(!showTimeSettings)}
              className="mt-2 text-sm text-purple-500 dark:text-purple-400 flex items-center justify-center gap-1 hover:text-purple-600 dark:hover:text-purple-300"
            >
              <Clock className="w-4 h-4" />
              {duration}m
            </button>
          </div>
        </div>

        {showTimeSettings && (
          <div className="flex flex-wrap gap-2 justify-center">
            {timePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setCustomDuration(preset.value)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  duration === preset.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <div className="w-full flex justify-center mt-2">
              <input
                type="number"
                min="1"
                max="120"
                value={duration}
                onChange={(e) => setCustomDuration(Math.min(120, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                placeholder="Custom"
              />
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Current Task</h3>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-purple-500'}`} />
              <span className="text-gray-800 dark:text-white font-medium">{todo.text}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Total time: {formatTotalTime(todo.timeSpent)}
            </div>
          </div>

          {todo.subtasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtasks</h4>
              {todo.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  onClick={() => setSelectedSubtask(subtask.id)}
                  className={`p-3 rounded-lg bg-white dark:bg-gray-800 flex items-center space-x-3 cursor-pointer transition-all ${
                    selectedSubtask === subtask.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubtask(todo.id, subtask.id);
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      subtask.completed
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {subtask.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {subtask.text}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Time spent: {formatTotalTime(subtask.timeSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ListTodo } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { SubtaskItem } from '../components/SubtaskItem';

export const TodoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newSubtask, setNewSubtask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const todo = useTodoStore((state) =>
    state.todos.find((t) => t.id === id)
  );
  
  const {
    toggleTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateTodoText,
  } = useTodoStore();

  if (!todo) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center text-gray-500">Todo not found</div>
      </div>
    );
  }

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim() && id) {
      addSubtask(id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const handleUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.text.trim()) {
      updateTodoText(todo.id, todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <button
        onClick={() => navigate('/todos')}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Tasks
      </button>

      <div className="glass-effect rounded-2xl p-6 shadow-xl space-y-8 todo-container">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="h-5 w-5 text-purple-600 rounded-lg focus:ring-purple-500"
          />
          {isEditing ? (
            <form onSubmit={handleUpdateTodo} className="flex-1">
              <input
                type="text"
                value={todo.text}
                onChange={(e) => updateTodoText(todo.id, e.target.value)}
                className="w-full p-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                onBlur={() => setIsEditing(false)}
              />
            </form>
          ) : (
            <h1
              className={`text-2xl font-bold flex-1 cursor-pointer hover:text-purple-600 transition-colors ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
              onClick={() => setIsEditing(true)}
            >
              {todo.text}
            </h1>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <ListTodo className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">Subtasks</h2>
          </div>
          
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a new subtask..."
              className="flex-1 p-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </form>

          <div className="space-y-2">
            {todo.subtasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 flex flex-col items-center space-y-4">
                  <ListTodo className="w-12 h-12" />
                  <p>No subtasks yet</p>
                </div>
              </div>
            ) : (
              todo.subtasks.map((subtask) => (
                <SubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={() => toggleSubtask(todo.id, subtask.id)}
                  onDelete={() => deleteSubtask(todo.id, subtask.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
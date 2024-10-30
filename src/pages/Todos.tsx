import React, { useState } from 'react';
import { Plus, ListTodo, Focus, Timer, Calendar } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { TodoItem } from '../components/TodoItem';
import { FocusSession } from '../components/FocusSession';

type FilterType = 'all' | 'active' | 'completed';
type TimeFilter = 'all' | 'today' | 'week' | 'month';

export const Todos: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [showFocusPanel, setShowFocusPanel] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleTodoSelect = (id: string) => {
    setSelectedTodoId(id);
    setShowFocusPanel(true);
  };

  const handleCloseFocusPanel = () => {
    setShowFocusPanel(false);
    setSelectedTodoId(null);
  };

  // Rest of the filtering logic remains the same...
  const isInTimeRange = (date: string | undefined, filter: TimeFilter) => {
    if (!date || filter === 'all') return true;
    
    const todoDate = new Date(date);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (filter) {
      case 'today':
        return todoDate >= startOfDay;
      case 'week':
        return todoDate >= startOfWeek;
      case 'month':
        return todoDate >= startOfMonth;
      default:
        return true;
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const statusMatch = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      todo.completed;

    const timeMatch = isInTimeRange(
      todo.completed ? todo.completedAt : todo.lastActiveAt || todo.createdAt,
      timeFilter
    );

    return statusMatch && timeMatch;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      <div className={`flex-1 p-4 overflow-auto ${showFocusPanel ? 'hidden lg:block' : ''}`}>
        <div className="glass-effect rounded-2xl p-4 md:p-6 shadow-xl space-y-6 todo-container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <ListTodo className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
            </div>
            {selectedTodoId && !showFocusPanel && (
              <button
                onClick={() => setShowFocusPanel(true)}
                className="lg:hidden px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center space-x-2"
              >
                <Timer className="w-4 h-4" />
                <span>Focus</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 p-3 rounded-xl border border-purple-100 dark:border-purple-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
            <button
              type="submit"
              className="px-4 md:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Add Task</span>
            </button>
          </form>

          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <div className="flex gap-2 justify-center flex-wrap">
              {(['all', 'active', 'completed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 md:px-4 py-2 rounded-lg transition-all transform hover:scale-105 text-sm md:text-base ${
                    filter === filterType
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              {(['all', 'today', 'week', 'month'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setTimeFilter(filterType)}
                  className={`px-3 md:px-4 py-2 rounded-lg transition-all transform hover:scale-105 text-sm md:text-base ${
                    timeFilter === filterType
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden md:inline">{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 flex flex-col items-center space-y-4">
                  <ListTodo className="w-12 h-12" />
                  <p className="text-lg">No {filter === 'all' ? '' : filter} tasks found</p>
                </div>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div key={todo.id} className="space-y-1">
                  <TodoItem
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    isSelected={todo.id === selectedTodoId}
                    onSelect={() => handleTodoSelect(todo.id)}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 pl-4">
                    {todo.completed ? (
                      <>Completed: {formatDate(todo.completedAt!)}</>
                    ) : todo.lastActiveAt ? (
                      <>Last active: {formatDate(todo.lastActiveAt)}</>
                    ) : (
                      <>Created: {formatDate(todo.createdAt)}</>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="font-medium">{todos.length}</span> total tasks • 
            <span className="font-medium"> {todos.filter(t => !t.completed).length}</span> active • 
            <span className="font-medium"> {todos.filter(t => t.completed).length}</span> completed
          </div>
        </div>
      </div>

      <div className={`${
        showFocusPanel ? 'fixed inset-0 z-50 lg:static lg:w-[400px]' : 'hidden lg:block lg:w-[400px]'
      } border-l border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg`}>
        {selectedTodoId && todos.find(t => t.id === selectedTodoId) ? (
          <FocusSession 
            todo={todos.find(t => t.id === selectedTodoId)!} 
            onClose={handleCloseFocusPanel}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
            <Focus className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Focus Session</h2>
            <p>Select a task to start a focus session and track your progress</p>
          </div>
        )}
      </div>
    </div>
  );
};
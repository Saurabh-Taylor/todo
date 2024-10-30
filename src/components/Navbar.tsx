import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare, Sparkles, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-effect shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <Sparkles className="w-6 h-6 text-pink-500 dark:text-pink-400 animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
              Taskify
            </span>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
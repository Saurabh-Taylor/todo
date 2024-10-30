import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Todos } from './pages/Todos';
import { TodoDetail } from './pages/TodoDetail';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/authStore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <Todos />
              </PrivateRoute>
            }
          />
          <Route
            path="/todos/:id"
            element={
              <PrivateRoute>
                <TodoDetail />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
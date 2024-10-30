import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string) => boolean;
  logout: () => void;
}

// Demo user data
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (email, password) => {
    if (email === 'demo@example.com' && password === 'password') {
      set({ user: DEMO_USER });
      return true;
    }
    return false;
  },
  signup: (email, password, name) => {
    const newUser = { id: Date.now().toString(), email, name };
    set({ user: newUser });
    return true;
  },
  logout: () => set({ user: null }),
}));
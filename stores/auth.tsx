import { create } from 'zustand';
import { User } from '@/types';
import { auth } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await auth.login(email, password);
      await AsyncStorage.setItem('token', response.data.token);
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to login',
        isLoading: false,
      });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await auth.register(data);
      await AsyncStorage.setItem('token', response.data.token);
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to register',
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
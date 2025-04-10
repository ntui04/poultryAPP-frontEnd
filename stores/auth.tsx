import { create } from 'zustand';
import api, { setAuthToken } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterData) => Promise<boolean>;

  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  firstname: string;
  lastname: string;
  phone_number: string;
  location: string;
  password: string;
  password_confirmation: string;
  role: string;
}


export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/register', data);
      const { token, user } = response.data;
      
      await SecureStore.setItemAsync('token', token);
      setAuthToken(token);
      
      set({ token, user, isLoading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

 
  logout: async () => {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('token');
      setAuthToken(null);
      set({ token: null, user: null });
    }
  },

  clearError: () => set({ error: null }),
}));
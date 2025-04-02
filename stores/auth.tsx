import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/api';

interface User {
  profileImage: string | undefined;
  id: string;
  firstname: string;
  lastname: string;
  phone_number: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (phone_number: string, password: string) => Promise<void>;
  register: (data: {
    firstname: string;
    lastname: string;
    phone_number: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (phone_number, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Validate inputs before making API call
      if (!phone_number || !password) {
        throw new Error('Phone number and password are required');
      }

      const response = await api.post('/api/auth/login', { 
        phone_number, 
        password 
      });

      if (!response.data?.token) {
        throw new Error('Invalid response from server');
      }

      await AsyncStorage.setItem('token', response.data.token);
      set({ 
        user: response.data.user, 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      let errorMessage = 'Failed to login';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({
        error: errorMessage,
        isLoading: false,
        user: null
      });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });

      // Validate required fields
      if (!data.firstname || !data.lastname || !data.phone_number || !data.password) {
        throw new Error('All fields are required');
      }

      const response = await api.post('/api/register', data);

      if (!response.data?.token) {
        throw new Error('Invalid response from server');
      }

      await AsyncStorage.setItem('token', response.data.token);
      set({ 
        user: response.data.user, 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      let errorMessage = 'Failed to register';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({
        error: errorMessage,
        isLoading: false,
        user: null
      });
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      set({ user: null, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
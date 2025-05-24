import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Load user from AsyncStorage when app starts
  loadUser: async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(
          'http://192.162.244.32:8000/api/user',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set({ user: response.data, token });
      } catch (error) {
        set({ token: null, user: null });
        AsyncStorage.removeItem('token');
      }
    }
  },

  // Register user
  register: async (name, number, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        'http://192.168.185.32:8000/api/register',
        {
          name,
          number,
          password,
        }
      );

      const { user, token } = response.data;
      await AsyncStorage.setItem('token', token);

      set({ user, token });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Login user
  login: async (phone_number, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        'http://192.162.244.32:8000/api/login',
        {
          number,
          password,
        }
      );

      const { user, token } = response.data;
      await AsyncStorage.setItem('token', token);

      set({ user, token });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout user
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Update user profile
  setUser: (updatedUser) => set({ user: updatedUser }),

  // Clear errors
  clearError: () => set({ error: null }),
}));

export default useAuthStore;


import { create } from 'zustand';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://127.0.0.1:8000/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userJson = await SecureStore.getItemAsync('userData');
      
      if (token && userJson) {
        const user = JSON.parse(userJson);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ user, token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      
      const { user, token } = response.data;
      
      // Store user data and token securely
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed. Please try again.';
      
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },
  
  clearError: () => set({ error: null })
}));
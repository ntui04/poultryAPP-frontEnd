import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
  
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
      }
  
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('Network error - no response from server');
      } else {
        throw new Error(error.message || 'Request setup error');
      }
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      
      await AsyncStorage.setItem('userToken', response.data.token);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        throw new Error('Network error - no response from server');
      } else {
        throw new Error(error.message || 'Request setup error');
      }
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
};

export default authService;

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
  
      // ✅ If the API returns a token, store it in AsyncStorage
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
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    
    // ✅ Store token in AsyncStorage instead of localStorage
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
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    throw new Error('Logout failed');
  }
};

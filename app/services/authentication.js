import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = 'http://192.168.47.32:8000/api';

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login user
  async login(credentials) {
    try {
      console.log('Login Credentials:', credentials);
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);

      console.log('Login Response:', response.data);

      await this.storeAuthData(response.data);
      return response.data;
    } catch (error) {
      console.error('Login Error Details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request,
      });
      throw this.handleError(error);
    }
  }

  // Logout user
  
  

  async logout() {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Get stored token
      if (!token) throw new Error("No token found");

      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await AsyncStorage.removeItem('authToken'); // Remove token from storage

      return true; // Successfully logged out
    } catch (error) {
      console.error("Logout Error:", error);
      return false; // Failed to logout
    }
  }
  
  

  // Register Agro Vet Shop
  async registerShop(shopData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/shops`, shopData, {
        headers: {
          Authorization: `Bearer ${await this.getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Store authentication data
  async storeAuthData(data) {
    try {
      if (!data || !data.token) {
        throw new Error('Invalid authentication data received');
      }

      // Store the auth token
      await AsyncStorage.setItem('authToken', data.token);

      // Check if user data exists before storing
      if (data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      } else {
        console.warn(
          'User data missing from response. Skipping userData storage.'
        );
      }
    } catch (error) {
      console.error('Error storing authentication data:', error.message);
    }
  }

  // Get stored token
  async getToken() {
    return await AsyncStorage.getItem('userToken');
  }

  // Get stored user data
  async getUserData() {
    const userDataString = await AsyncStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  }

  // Clear authentication data
  async clearAuthData() {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(
        'No response from server. Please check your network connection.'
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
}

export default new AuthService();

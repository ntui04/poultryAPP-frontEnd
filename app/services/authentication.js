import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = 'http://192.168.118.32:8000/api';

class AuthService {
  logout() {
    throw new Error('Method not implemented.');
  }
  // Register a new user
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (err) {
      console.error('Registration Error:', err.response ? err.response.data : err);
      
      let errorMessage = 'Registration failed';
      const apiErrors = {};
      
      if (err.response) {
        if (err.response.data.errors) {
          // Map backend errors to frontend field names
          for (const [key, value] of Object.entries(err.response.data.errors)) {
            if (key === 'password' && value.includes('confirmation')) {
              apiErrors.confirm_password = value;
            } else {
              apiErrors[key] = value;
            }
          }
          errorMessage = Object.values(apiErrors).flat().join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      // Throw an object that contains both the message and the detailed errors
      throw { 
        message: errorMessage,
        errors: apiErrors 
      };
    }
  }


  // Login user
  async login(credentials) {
    try {
      console.log('Login Credentials:', credentials);
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  
      console.log('Login Response:', response.data);
  
      // Store user data in Zustand state
      useAuthStore.setState({
        user: response.data.user, 
        token: response.data.token 
      });
  
      // Persist authentication data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('token', response.data.token);
  
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
      // Get token from storage
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.warn('No token found in storage');
        return true; // Consider it success if no token exists
      }

      // Make logout request to backend
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Clear storage after successful API call
      await AsyncStorage.multiRemove(['authToken', 'user']);

      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if API fails, clear local storage
      await AsyncStorage.multiRemove(['authToken', 'user']).catch(console.error);
      
      return false;
    }
  }

  
  async updateProfile(profileData) {
    try {
      // Validate input
      if (!profileData) {
        throw new Error('Profile data is required');
      }

      // Get the current authentication token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Prepare the request configuration
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Perform password validation if password is being updated
      if (profileData.password) {
        if (profileData.password !== profileData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        // Remove confirmPassword before sending to backend
        delete profileData.confirmPassword;
      }

      // Send update request to the server
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, config);

      // Update local storage with new user data
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      // Update Zustand store
      useAuthStore.setState({
        user: response.data.user
      });

      return response.data.user;
    } catch (error) {
      console.error('Profile Update Error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request,
      });
      throw this.handleError(error);
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

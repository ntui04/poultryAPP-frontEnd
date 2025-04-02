// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.96.32/api', // Replace with your Laravel server IP
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or use AsyncStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
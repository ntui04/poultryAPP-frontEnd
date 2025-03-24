import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Handle logout or token refresh here
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => api.post('/auth/register', data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

export const shops = {
  getNearby: (latitude: number, longitude: number, radius: number) =>
    api.get('/shops/nearby', { params: { latitude, longitude, radius } }),
  getById: (id: string) => api.get(`/shops/${id}`),
  getProducts: (shopId: string) => api.get(`/shops/${shopId}/products`),
};

export const vets = {
  getAvailable: () => api.get('/vets/available'),
  getById: (id: string) => api.get(`/vets/${id}`),
  bookConsultation: (vetId: string, data: {
    scheduled_for: string;
    description: string;
  }) => api.post(`/vets/${vetId}/book`, data),
};

export const marketplace = {
  getProducts: (params?: {
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
  }) => api.get('/products', { params }),
  createOrder: (data: {
    products: { id: string; quantity: number }[];
    shipping_address: string;
  }) => api.post('/orders', data),
};

export const profile = {
  get: () => api.get('/profile'),
  update: (data: {
    name?: string;
    phone?: string;
    avatar_url?: string;
  }) => api.patch('/profile', data),
};

export default api;
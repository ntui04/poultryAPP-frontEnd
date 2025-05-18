import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config
const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: 'http://192.168.242.32:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle validation errors
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      let errorMessage = '';
      
      // Convert Laravel validation errors to readable message
      Object.keys(validationErrors).forEach(key => {
        errorMessage += `${validationErrors[key].join(', ')}\n`;
      });
      
      error.message = errorMessage.trim();
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  // Login with phone number
  login: async (phone_number: string, password: string) => {
    const response = await api.post('/login', {
      phone_number,
      password,
    });
    return response.data;
  },

  // Register new user
  register: async (data: {
    firstname: string;
    lastname: string;
    phone_number: string;
    password: string;
  }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    await AsyncStorage.removeItem('token');
    return response.data;
  },

  // Get authenticated user profile
  getProfile: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};


export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Agro-vet shop endpoints
export const shops = {
  // Get all shops
  getAll: async (params?: {
    search?: string;
    category?: string;
    page?: number;
  }) => {
    const response = await api.get('/api/shops', { params });
    return response.data;
  },

  // Get single shop
  getById: async (id: string) => {
    const response = await api.get(`/api/shops/${id}`);
    return response.data;
  },

  // Create shop (for shop owners)
  create: async (data: {
    name: string;
    description: string;
    address: string;
    phone: string;
    working_hours: {
      open: string;
      close: string;
      days: string[];
    };
  }) => {
    const response = await api.post('/api/shops', data);
    return response.data;
  },

  // Update shop
  update: async (id: string, data: Partial<{
    name: string;
    description: string;
    address: string;
    phone: string;
    working_hours: {
      open: string;
      close: string;
      days: string[];
    };
  }>) => {
    const response = await api.put(`/api/shops/${id}`, data);
    return response.data;
  },

  // Delete shop
  delete: async (id: string) => {
    const response = await api.delete(`/api/shops/${id}`);
    return response.data;
  },
};

// Products endpoints
export const products = {
  // Get all products
  getAll: async (params?: {
    shop_id?: string;
    category?: string;
    search?: string;
    page?: number;
  }) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  // Get single product
  getById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Create product (for shop owners)
  create: async (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    shop_id: string;
    images: string[];
  }) => {
    const response = await api.post('/api/products', data);
    return response.data;
  },

  // Update product
  update: async (id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
  }>) => {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id: string) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },
};

// Orders endpoints
export const orders = {
  // Get all orders
  getAll: async (params?: {
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    page?: number;
  }) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
  },

  // Get single order
  getById: async (id: string) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Create order
  create: async (data: {
    shop_id: string;
    products: Array<{
      id: string;
      quantity: number;
    }>;
    shipping_address: string;
  }) => {
    const response = await api.post('/api/orders', data);
    return response.data;
  },

  // Update order status (for shop owners)
  updateStatus: async (id: string, status: 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },
};

export default api;
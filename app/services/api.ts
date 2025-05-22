import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
const apiz = axios.create({
  baseURL: 'http://192.168.121.32:8000/api',
    //  baseURL: 'http://127.0.0.1:8000/api',

  timeout: 10000,
})

export const BASE_URL = 'http://192.168.121.32:8000';
export const mediaUrl = `${BASE_URL}/storage/`;

apiz.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const articlesApi = {
  // Normal users: see all articles (e.g. for viewing)
  getAllPublic: () => apiz.get('/articles'),

  // Consultants: see only their own posts (e.g. for managing)
  getAllByConsultant: () => apiz.get('/articles/consl'),

  getOne: (id: string) => apiz.get(`/articles/${id}`),

  create: (data: any) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return apiz.post('/articles', data, { headers });
  },

  update: (id: string, data: any) => apiz.put(`/articles/${id}`, data),

  delete: (id: string) => apiz.delete(`/articles/${id}`),
};



export const productsApi = {
  getAll: () => apiz.get('/products/farm'),
  getMyPurchases: () => apiz.get('/purchases'),
  purchase: (data: {
    product_id: number;
    quantity: number;
    total_price: number;
    location: {
      city: string | null;
      region: string | null;
      country: string | null;
      latitude: number | null;
      longitude: number | null;
    };
  }) => apiz.post('/purchases', data),
};

export const ordersApi = {
  getAll: () => apiz.get('/orders'),
  getOne: (id: number) => apiz.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) => apiz.patch(`/orders/${id}/status`, { status }),
};



export const statisticsApi = {
  getOverview: () => apiz.get('/statistics/overview'),
  getMonthlyGrowth: () => apiz.get('/statistics/monthly-growth'),
  getRecentActivity: () => apiz.get('/statistics/recent-activity'),
};


export const consultantsApi = {
  getAll: () => apiz.get('/consultants'),
  getOne: (id: string) => apiz.get(`/consultants/${id}`),
  create: (data: any) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return apiz.post('/consultants', data, { headers });
  },
  update: (id: string, data: any) => apiz.put(`/consultants/${id}`, data),
  delete: (id: string) => apiz.delete(`/consultants/${id}`),
};


export const shopsApi = {
  getOne: (id: number) => apiz.get(`/shops/${id}`),
};

export const authApi = {
  requestResetToken: (phone: string) => {
    return apiz.post('/request-password-reset', { phone });
  },
  resetPassword: (payload: {
    phone_number: string;
    token: string;
    password: string;
  }) => {
    return apiz.post('/reset-password', payload);
  }
};

export default apiz;
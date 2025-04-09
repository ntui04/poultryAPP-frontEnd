import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiz = axios.create({
  baseURL: 'http://192.168.36.32:8000/api',
  timeout: 10000,
})



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
  getAll: () => apiz.get('/articles'),
  getOne: (id: string) => apiz.get(`/articles/${id}`),
  create: (data: any) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return apiz.post('/articles/post', data, { headers });
  },
  update: (id: string, data: any) => apiz.put(`/articles/${id}`, data),
  delete: (id: string) => apiz.delete(`/articles/${id}`),
};

export const productsApi = {
  getAll: () => apiz.get('/products/farm'),
  purchase: (data: {
    product_id: number;
    quantity: number;
    total_price: number;
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


export default apiz;
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiz = axios.create({
  baseURL: 'http://192.168.215.32:8000/api',
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
  create: (data: any) => apiz.post('/articles/post', data),
  update: (id: string, data: any) => apiz.put(`/articles/${id}`, data),
  delete: (id: string) => apiz.delete(`/articles/${id}`),
};



export default apiz;
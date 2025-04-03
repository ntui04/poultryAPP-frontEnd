import axios from 'axios';

const apiz = axios.create({
  baseURL: 'http://192.168.239.32:8000/api',
  timeout: 10000,
})

export default apiz;
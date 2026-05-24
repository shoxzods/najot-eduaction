import axios from 'axios';
const endpoint = 'https://najot-edu.softwareengineer.uz/api/v1';


export const api = axios.create({
  baseURL: endpoint,
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

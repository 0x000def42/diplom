import axios from 'axios';


const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const subscribers = [];

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      subscribers.forEach((callback) => callback());
    }
    return Promise.reject(error);
  }
);

// @ts-ignore
api.onUnauthorized = (callback) => {
  subscribers.push(callback);
};

export default api;

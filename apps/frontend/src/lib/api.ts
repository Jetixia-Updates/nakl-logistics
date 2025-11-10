import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Log the error but don't redirect automatically
      console.warn('Authentication error - 401:', error.response?.data);
      // Optionally remove token
      // localStorage.removeItem('token');
      
      // Only redirect to login if explicitly on an admin page that requires auth
      // For now, we'll let individual pages handle this
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

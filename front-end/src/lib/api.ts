import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
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

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    const errorCode = error.response?.data?.errorCode;
    
    // Global error notifications
    if (error.response?.status === 401) {
      if (error.config?.url?.includes('/auth/login')) {
          toast.error(message);
      } else {
          toast.error('Session expired. Please login again.');
          const role = localStorage.getItem('role');
          localStorage.removeItem('token');
          localStorage.removeItem('role');

          // Context-aware redirection
          if (role === 'admin' || role === 'super_admin' || window.location.pathname.startsWith('/admin')) {
              if (window.location.pathname.startsWith('/super-admin')) {
                  window.location.href = '/super-admin/login';
              } else {
                  window.location.href = '/admin/login';
              }
          } else if (role === 'receptionist' || window.location.pathname.startsWith('/receptionist')) {
              window.location.href = '/receptionist/login';
          } else {
              window.location.href = '/';
          }
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 400 && errorCode === 'VALIDATION_ERROR') {
      // Validation errors are often handled by forms, but we can toast a general one
      toast.error(message);
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

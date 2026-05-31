import axios from 'axios';
console.log('API URL:', import.meta.env.VITE_API_URL);

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Safe production fallback if Vercel build variable is missing
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://crackit-1a7h.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

// Set up a request interceptor to dynamically inject the token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crackit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up a response interceptor to intercept expired tokens (401 Unauthorized) and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      const isLoginRequest = error.config?.url?.includes('login') || error.config?.url?.includes('/auth');
      
      if (!isAuthPage && !isLoginRequest) {
        localStorage.removeItem('crackit_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

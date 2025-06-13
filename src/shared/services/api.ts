import axios from 'axios';

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://engage-api-bmb0fqhpg7bkdwdp.eastus2-01.azurewebsites.net';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const API_KEY = import.meta.env.VITE_X_API_KEY || 'd3ae2eec-604a-402e-a414-c7e4cc0e2b2e';
const API_SECRET = import.meta.env.VITE_X_API_SECRET || 'Kj#9mP$vN2xL&hQ5wR8tY3cB@nM4fD7';

// Create an Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    'X-API-Secret': API_SECRET,
  },
});

// Interceptor to add the JWT token and ensure API keys for every request
api.interceptors.request.use(
  (config) => {
    // Ensure API keys are always set in headers for every request
    config.headers['X-API-Key'] = String(API_KEY);
    config.headers['X-API-Secret'] = String(API_SECRET);
    
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.MODE === 'development') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        headersSet: {
          'X-API-Key': !!config.headers['X-API-Key'],
          'X-API-Secret': !!config.headers['X-API-Secret'],
          'Authorization': !!config.headers.Authorization,
        },
      });
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response.data; // Return data directly to simplify usage
  },
  (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      // Handle 401 Unauthorized errors - redirect to login except for auth endpoints
      if (error.response.status === 401 && 
          !error.config.url.includes('login') && 
          !error.config.url.includes('signups') &&
          !error.config.url.includes('verify')) {
        console.error('Unauthorized, logging out...');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility function to add standard headers
const addStandardHeaders = (config = {}) => {
  return {
    ...config,
    headers: {
      ...(config as any).headers,
      'X-API-Key': String(API_KEY),
      'X-API-Secret': String(API_SECRET),
    },
  };
};

// Helper methods for API calls to maintain compatibility with old apiService
export const get = (url, cfg = {}) => {
  return api.get(url, addStandardHeaders(cfg));
};

export const post = (url, data, cfg = {}) => {
  return api.post(url, data, addStandardHeaders(cfg));
};

export const put = (url, data, cfg = {}) => {
  return api.put(url, data, addStandardHeaders(cfg));
};

export const del = (url, cfg = {}) => {
  return api.delete(url, addStandardHeaders(cfg));
};

export const postFormData = (url, formData, cfg = {}) => {
  const config = addStandardHeaders(cfg);
  config.headers['Content-Type'] = 'multipart/form-data';
  return api.post(url, formData, config);
};

// Auth services for better organization
export const authService = {
  login: async (email, password) => {
    try {
      const response = await post('/users/login', { email, password });
      
      if ((response as any).access_token) {
        localStorage.setItem('jwtToken', (response as any).access_token);
        return {
          ...response,
          token: (response as any).access_token,
        };
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  },
  
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return false;
      
      const response = await post('/users/verify-token', { token });
      return (response as any).valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },
};

// Named API service object for backward compatibility
export const apiService = {
  get,
  post,
  put,
  del,
  postFormData,
  sendVerificationCode: (data) => post('/device-verifications/send/', data),
  verifyCode: (data) => post('/device-verifications/verify/', data),
  login: (email, password) => authService.login(email, password),
  logout: () => authService.logout(),
};

export default api;


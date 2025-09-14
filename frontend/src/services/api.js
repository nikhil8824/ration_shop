import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://localhost:5000/api'; // Backend running on port 5000

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      // This will be handled by the auth context
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  // Admin only
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getAdminProducts: (params) => api.get('/products/admin/all', { params }),
};

export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  // Admin only
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getAdminOrders: (params) => api.get('/orders/admin/all', { params }),
  getOrderStats: () => api.get('/orders/admin/stats'),
};

export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  getUserStats: () => api.get('/users/stats/overview'),
};

export default api;

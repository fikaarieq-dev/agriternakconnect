import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

export const getProducts = (kategori) => API.get('/products/', { params: { kategori } });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products/', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');

export const createOrder = (data) => API.post('/orders/', data);
export const getOrders = () => API.get('/orders/');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const updatePaymentStatus = (id, status_pembayaran) => API.put(`/orders/${id}/payment-status`, { status_pembayaran });
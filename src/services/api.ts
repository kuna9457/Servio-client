import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: 'user' | 'provider';
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  provider: User;
  rating: number;
  availability: string;
}

export interface Booking {
  _id: string;
  service: Service;
  user: User;
  provider: User;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: string;
  totalAmount: number;
  address: string;
  notes?: string;
}

// Auth API
export const authAPI = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'provider';
    phone: string;
  }) => api.post('/auth/register', data),

  

  login: (data: { email: string; password: string }) => api.post('/auth/login', data),

  updateProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => api.put('/auth/profile', data),

  googleAuth: (data: { credential: string }) => api.post('/auth/google', data),

  initiatePasswordReset: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),

  verifyResetCode: (data: { email: string; code: string }) =>
    api.post('/auth/verify-reset-code', data),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
};

// Services API
export const servicesAPI = {
  getAllServices: () => api.get('/services'),

  getServiceById: (id: string) => api.get(`/services/${id}`),

  createService: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
  }) => api.post('/services', data),

  updateService: (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
  }) => api.put(`/services/${id}`, data),

  deleteService: (id: string) => api.delete(`/services/${id}`),

  getProviderServices: () => api.get('/services/provider'),

  getUserBookings: () => api.get('/services/bookings'),

  bookService: async (serviceId: string, data: {
    scheduledDate: string;
    totalAmount: number;
    address: string;
    notes?: string;
  }) => {
    const response = await api.post(`/services/${serviceId}/book`, data);
    return response;
  },

  getProviderBookings: async () => {
    const response = await api.get('/services/bookings/provider');
    return response;
  },
};

export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
}; 

export const Professional = {
  registerProfessional: (data: {
    name: string;
    email: string
    phone: string;
    location: string;
    serviceCategories: string[];
    description: string;
    availability: string;
    perPersonRate: string;
  }) => api.post('/professionals/register', data),
};
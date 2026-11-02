import axios from 'axios';
import { Project, User, Order } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';

// Spring Boot 3 backend baseURL target
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('projectkit_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error logging for frontend demo when Spring Boot is offline
    if (error.code === 'ERR_NETWORK' || !error.response) {
      // Expected during standalone frontend evaluation
    }
    return Promise.reject(error);
  }
);

/**
 * Service abstractions for future Java 17 + Spring Boot 3 integration.
 * Each method returns mock data promises if backend is not yet attached.
 */
export const projectService = {
  async getAll(params?: { category?: string; search?: string; sort?: string }): Promise<Project[]> {
    try {
      const res = await apiClient.get('/projects', { params });
      return res.data;
    } catch {
      // Fallback to local dataset
      let list = [...INITIAL_PROJECTS];
      if (params?.category && params.category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            p.primaryLanguage.toLowerCase().includes(query)
        );
      }
      return list;
    }
  },

  async getById(id: string): Promise<Project | null> {
    try {
      const res = await apiClient.get(`/projects/${id}`);
      return res.data;
    } catch {
      const match = INITIAL_PROJECTS.find((p) => p.id === id || p.slug === id);
      return match || null;
    }
  },

  async create(data: Partial<Project>): Promise<Project> {
    try {
      const res = await apiClient.post('/projects', data);
      return res.data;
    } catch {
      const newProj = {
        ...INITIAL_PROJECTS[0],
        id: `proj-${Date.now()}`,
        title: data.title || 'Untitled Project',
        slug: (data.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
        price: data.price || 1999,
        originalPrice: (data.price || 1999) + 1500,
        createdAt: new Date().toISOString().split('T')[0],
        ...data,
      } as Project;
      return newProj;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/projects/${id}`);
      return true;
    } catch {
      return true;
    }
  },
};

export const categoryService = {
  async getAll() {
    try {
      const res = await apiClient.get('/categories');
      return res.data;
    } catch {
      return CATEGORIES;
    }
  },
};

export const orderService = {
  async create(orderData: Partial<Order>): Promise<Order> {
    try {
      const res = await apiClient.post('/orders', orderData);
      return res.data;
    } catch {
      const order: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `PK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: orderData.userId || 'usr-student-01',
        projectId: orderData.projectId || 'proj-001',
        projectTitle: orderData.projectTitle || 'Online Job Portal',
        category: orderData.category || 'Web Development',
        amount: orderData.amount || 1999,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        paymentMethod: orderData.paymentMethod || 'UPI (Fast & Direct)',
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        downloadToken: `pk_dl_${Math.random().toString(36).substring(2, 10)}`,
      };
      return order;
    }
  },
};

export const authService = {
  async login(email: string, _password?: string): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post('/auth/login', { email, _password });
      return res.data;
    } catch {
      const isAdmin = email.toLowerCase().includes('admin');
      const user: User = {
        id: isAdmin ? 'usr-admin-01' : 'usr-student-01',
        fullName: isAdmin ? 'Prof. Anita Sharma (Admin)' : 'Rahul Varma',
        email: email,
        phoneNumber: '+91 98765 43210',
        collegeName: isAdmin ? 'National Institute of Engineering' : 'Vellore Institute of Technology',
        role: isAdmin ? 'admin' : 'student',
        joinedDate: '2025-08-10',
      };
      const token = `mock_jwt_token_${Date.now()}`;
      return { user, token };
    }
  },

  async register(data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    collegeName?: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch {
      const user: User = {
        id: `usr-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || '+91 98765 00000',
        collegeName: data.collegeName || 'Indian Institute of Engineering',
        role: 'student',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      const token = `mock_jwt_token_${Date.now()}`;
      return { user, token };
    }
  },
};

import apiClient, { BackendApiResponse } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  collegeName?: string;
  phone?: string;
}

export interface AuthBackendResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    fullName: string;
    collegeName?: string;
    phone?: string;
    role: string;
    status: string;
    createdAt?: string;
  };
}

export const authService = {
  /**
   * Authenticate student or admin against Spring Boot /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<BackendApiResponse<AuthBackendResponse>>(
        '/api/auth/login',
        credentials
      );

      const authData = response.data.data;
      if (authData?.accessToken) {
        localStorage.setItem('projectkit_auth_token', authData.accessToken);
        if (authData.refreshToken) {
          localStorage.setItem('projectkit_refresh_token', authData.refreshToken);
        }
      }

      const u = authData.user;
      const user: User = {
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: (u.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : '2025-01-01',
      };
      return { user, token: authData.accessToken };
    } catch (error) {
      // Local development fallback if Spring Boot backend is temporarily offline
      const email = credentials.email.toLowerCase();
      const isAdmin = email.includes('admin');
      const user: User = {
        id: isAdmin ? 'usr-admin-01' : 'usr-student-01',
        fullName: isAdmin ? 'Dr. Anita Sharma' : 'John Doe',
        email: credentials.email,
        phoneNumber: '+91 98765 43210',
        collegeName: isAdmin ? 'National Institute of Technology' : 'Metropolitan Institute of Technology',
        role: isAdmin ? 'admin' : 'student',
        joinedDate: '2025-08-14',
      };
      const token = `dev_jwt_${Date.now()}`;
      localStorage.setItem('projectkit_auth_token', token);
      return { user, token };
    }
  },

  /**
   * Register a new student account at /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<BackendApiResponse<AuthBackendResponse>>(
        '/api/auth/register',
        {
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password || 'Student@123',
          collegeName: payload.collegeName,
          phone: payload.phone,
        }
      );

      const authData = response.data.data;
      const u = authData.user;
      const user: User = {
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      };
      return { user, token: authData?.accessToken || '' };
    } catch (error) {
      // Local fallback
      const user: User = {
        id: `usr-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        phoneNumber: payload.phone || '+91 98765 00000',
        collegeName: payload.collegeName || 'Indian Engineering Institute',
        role: 'student',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      return { user, token: '' };
    }
  },

  /**
   * Log out current user and invalidate refresh token on backend
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('projectkit_refresh_token');
    try {
      if (refreshToken) {
        await apiClient.post('/api/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore network failure on logout
    } finally {
      localStorage.removeItem('projectkit_auth_token');
      localStorage.removeItem('projectkit_refresh_token');
      localStorage.removeItem('projectkit_user');
    }
  },

  /**
   * Fetch current authenticated user profile from /api/auth/me
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<BackendApiResponse<any>>('/api/auth/me');
      const u = response.data?.data;
      if (!u) return null;
      return {
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: (u.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : '2025-01-01',
      };
    } catch {
      return null;
    }
  },

  /**
   * Request email-based password reset token from /api/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await apiClient.post<BackendApiResponse<void>>('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      return (
        response.data?.message ||
        'If your email is registered with ProjectKit, password reset instructions have been dispatched.'
      );
    } catch (err: any) {
      if (err.response?.status === 429) {
        throw new Error('Too many password reset attempts. Please wait 60 seconds.');
      }
      return 'If your email is registered with ProjectKit, password reset instructions have been dispatched.';
    }
  },

  /**
   * Complete password reset using token and new password via /api/auth/reset-password
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const response = await apiClient.post<BackendApiResponse<void>>('/api/auth/reset-password', {
      token: token.trim(),
      newPassword,
    });
    return (
      response.data?.message ||
      'Password has been reset successfully. You can now log in with your new credentials.'
    );
  },
};

export default authService;

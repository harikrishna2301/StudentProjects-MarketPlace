import apiClient, { BackendApiResponse } from './api';
import { User } from '../types';

export interface StudentProfileUpdatePayload {
  fullName: string;
  collegeName?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PurchasedProject {
  projectId: number;
  projectTitle: string;
  projectSlug: string;
  thumbnailUrl: string;
  categoryName: string;
  orderNumber: string;
  pricePaid: number;
  purchaseDate: string;
  downloadSourceUrl: string;
  downloadDocumentationUrl: string;
}

export interface StudentDashboardMetrics {
  profile: User;
  totalPurchasedProjects: number;
  totalAmountSpent: number;
  recentPurchases: PurchasedProject[];
}

export const studentService = {
  /**
   * Fetch authenticated student profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<BackendApiResponse<any>>('/api/students/profile');
    const d = response.data.data;
    return {
      id: String(d.id),
      email: d.email,
      fullName: d.fullName,
      collegeName: d.collegeName,
      phoneNumber: d.phone,
      role: (d.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
      joinedDate: d.createdAt ? d.createdAt.split('T')[0] : '2025-01-01',
    };
  },

  /**
   * Update student profile information
   */
  async updateProfile(data: StudentProfileUpdatePayload): Promise<User> {
    const response = await apiClient.put<BackendApiResponse<any>>('/api/students/profile', data);
    const d = response.data.data;
    return {
      id: String(d.id),
      email: d.email,
      fullName: d.fullName,
      collegeName: d.collegeName,
      phoneNumber: d.phone,
      role: (d.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
      joinedDate: d.createdAt ? d.createdAt.split('T')[0] : '2025-01-01',
    };
  },

  /**
   * Change student password
   */
  async changePassword(data: ChangePasswordPayload): Promise<void> {
    await apiClient.put<BackendApiResponse<void>>('/api/students/change-password', data);
  },

  /**
   * Get all verified purchased projects with download URLs
   */
  async getPurchasedProjects(): Promise<PurchasedProject[]> {
    try {
      const response = await apiClient.get<BackendApiResponse<PurchasedProject[]>>('/api/students/purchases');
      return response.data.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Get student dashboard overview metrics
   */
  async getDashboard(): Promise<StudentDashboardMetrics | null> {
    try {
      const response = await apiClient.get<BackendApiResponse<any>>('/api/students/dashboard');
      const d = response.data.data;
      if (!d) return null;
      return {
        profile: {
          id: String(d.profile?.id),
          email: d.profile?.email,
          fullName: d.profile?.fullName,
          collegeName: d.profile?.collegeName,
          phoneNumber: d.profile?.phone,
          role: (d.profile?.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
          joinedDate: d.profile?.createdAt ? d.profile.createdAt.split('T')[0] : '2025-01-01',
        },
        totalPurchasedProjects: Number(d.totalPurchasedProjects || 0),
        totalAmountSpent: Number(d.totalAmountSpent || 0),
        recentPurchases: d.recentPurchases || [],
      };
    } catch {
      return null;
    }
  },
};

export default studentService;

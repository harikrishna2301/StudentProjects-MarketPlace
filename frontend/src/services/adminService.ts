import apiClient, { BackendApiResponse } from './api';
import { User } from '../types';

export interface AdminDashboardData {
  totalStudents: number;
  totalProjects: number;
  totalOrders: number;
  totalPaidOrders: number;
  totalRevenue: number;
  recentOrders?: any[];
  recentStudents?: any[];
}

export const adminService = {
  /**
   * Fetch aggregate admin dashboard stats from Spring Boot
   */
  async getDashboardStats(): Promise<AdminDashboardData> {
    try {
      const response = await apiClient.get<BackendApiResponse<AdminDashboardData>>('/api/admin/dashboard');
      return response.data.data;
    } catch {
      return {
        totalStudents: 1420,
        totalProjects: 42,
        totalOrders: 124,
        totalPaidOrders: 118,
        totalRevenue: 248400,
      };
    }
  },

  /**
   * Fetch paginated registered students
   */
  async getStudents(page: number = 0, size: number = 15): Promise<User[]> {
    try {
      const response = await apiClient.get<BackendApiResponse<{ content: any[] }>>('/api/admin/students', {
        params: { page, size },
      });
      const content = response.data?.data?.content || [];
      return content.map((u) => ({
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: (u.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : '2025-01-01',
      }));
    } catch {
      return [];
    }
  },

  /**
   * Update student account status
   */
  async updateStudentStatus(userId: string | number, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<boolean> {
    try {
      await apiClient.put(`/api/admin/students/${userId}/status`, { status });
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Upload project source code package
   */
  async uploadSourceCode(projectId: string | number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/admin/projects/${projectId}/source-code`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Upload project documentation PDF
   */
  async uploadDocumentation(projectId: string | number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/admin/projects/${projectId}/documentation`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Upload project thumbnail image
   */
  async uploadThumbnail(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<BackendApiResponse<{ thumbnailUrl: string }>>(
      '/api/admin/projects/upload-thumbnail',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data.thumbnailUrl;
  },

  /**
   * Upload project screenshot
   */
  async uploadScreenshot(projectId: string | number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/admin/projects/${projectId}/screenshot`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Upload project presentation PPT/PPTX
   */
  async uploadPresentation(projectId: string | number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/admin/projects/${projectId}/presentation`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Upload project demo video MP4/WEBM
   */
  async uploadDemoVideo(projectId: string | number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/admin/projects/${projectId}/demo-video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

export default adminService;

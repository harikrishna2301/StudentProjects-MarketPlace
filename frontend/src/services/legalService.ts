import apiClient from './api';

export interface LegalDocumentDto {
  id: string;
  type: string;
  title: string;
  version: string;
  content: string;
  effectiveDate: string;
  published: boolean;
}

export interface UserConsentDto {
  id: string;
  userId: string;
  userEmail: string;
  documentType: string;
  documentVersion: string;
  consentedAt: string;
  ipAddress: string;
  userAgent: string;
  source: string;
}

export interface DeletionRequestDto {
  id: string;
  userId: string;
  userEmail: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  requestedAt: string;
  adminNotes?: string;
  processedAt?: string;
}

export const legalService = {
  /**
   * Fetch active legal document by type
   */
  async getDocument(type: string): Promise<LegalDocumentDto | null> {
    try {
      const response = await apiClient.get<LegalDocumentDto>(`/api/legal/documents/${type}`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Record user agreement audit log
   */
  async recordConsent(data: {
    documentType: string;
    documentVersion: string;
    source: string;
  }): Promise<boolean> {
    try {
      await apiClient.post('/api/legal/consent', data);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Sync cookie preferences
   */
  async syncCookiePreferences(data: {
    sessionId: string;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }): Promise<boolean> {
    try {
      await apiClient.put('/api/users/cookie-preferences', data);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Submit account deletion request (DPDPA 2023)
   */
  async submitDeletionRequest(reason: string): Promise<boolean> {
    try {
      await apiClient.post('/api/users/account-deletion-request', { reason });
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Admin: fetch all legal audit consents
   */
  async getConsents(): Promise<UserConsentDto[]> {
    try {
      const response = await apiClient.get<UserConsentDto[]>('/api/admin/legal/consents');
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * Admin: fetch account deletion requests
   */
  async getDeletionRequests(): Promise<DeletionRequestDto[]> {
    try {
      const response = await apiClient.get<DeletionRequestDto[]>('/api/admin/legal/deletion-requests');
      return response.data;
    } catch {
      return [];
    }
  },
};

export default legalService;

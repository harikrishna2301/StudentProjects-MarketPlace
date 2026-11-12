import apiClient, { BackendApiResponse } from './api';
import { Order } from '../types';

export interface BackendOrderResponse {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  items: Array<{
    projectId: number;
    projectTitle: string;
    price: number;
  }>;
  createdAt: string;
}

export const orderService = {
  /**
   * Fetch paginated orders for authenticated student
   */
  async getMyOrders(page: number = 0, size: number = 10): Promise<Order[]> {
    try {
      const response = await apiClient.get<BackendApiResponse<{ content: BackendOrderResponse[] }>>(
        '/api/orders',
        { params: { page, size } }
      );
      const items = response.data?.data?.content || [];
      return items.map((o) => ({
        id: String(o.orderId),
        orderNumber: o.orderNumber,
        userId: 'current-user',
        projectId: String(o.items?.[0]?.projectId || '1'),
        projectTitle: o.items?.[0]?.projectTitle || 'Project Kit',
        category: 'Engineering',
        amount: Number(o.totalAmount),
        date: o.createdAt ? o.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: o.status === 'PAID' ? 'Completed' : 'Processing',
        paymentMethod: 'UPI / Razorpay',
        invoiceId: `INV-${o.orderNumber.replace(/[^0-9]/g, '').slice(-6) || '902144'}`,
        downloadToken: `pk_dl_${o.orderNumber}`,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Fetch single order by order number
   */
  async getByOrderNumber(orderNumber: string): Promise<BackendOrderResponse | null> {
    try {
      const response = await apiClient.get<BackendApiResponse<BackendOrderResponse>>(
        `/api/orders/number/${orderNumber}`
      );
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Create an order on Spring Boot backend.
   * Total price and discounts are strictly calculated server-side from database records.
   */
  async create(projectIds: number[], couponCode?: string): Promise<BackendOrderResponse> {
    const payload: { projectIds: number[]; couponCode?: string } = { projectIds };
    if (couponCode && couponCode.trim()) {
      payload.couponCode = couponCode.trim();
    }
    const response = await apiClient.post<BackendApiResponse<BackendOrderResponse>>(
      '/api/orders',
      payload
    );
    return response.data.data;
  },

  /**
   * Download project source code directly as streaming blob
   */
  async downloadSource(projectId: number | string, projectTitle: string): Promise<void> {
    const response = await apiClient.get(`/api/projects/${projectId}/download/source`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-source.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download project documentation PDF directly as streaming blob
   */
  async downloadDocumentation(projectId: number | string, projectTitle: string): Promise<void> {
    const response = await apiClient.get(`/api/projects/${projectId}/download/documentation`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-documentation.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download project presentation PPT/PPTX directly as streaming blob
   */
  async downloadPresentation(projectId: number | string, projectTitle: string): Promise<void> {
    const response = await apiClient.get(`/api/projects/${projectId}/download/presentation`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-presentation.pptx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default orderService;

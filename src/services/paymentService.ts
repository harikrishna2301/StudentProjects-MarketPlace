import apiClient, { BackendApiResponse } from './api';

export interface PaymentVerificationPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentVerifiedResult {
  paymentNumber: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  razorpayPaymentId: string;
  createdAt: string;
}

export const paymentService = {
  /**
   * Send Razorpay cryptographic HMAC signature to backend for verification.
   * Spring Boot verifies signature and activates the purchased order.
   */
  async verifyPayment(data: PaymentVerificationPayload): Promise<PaymentVerifiedResult> {
    const response = await apiClient.post<BackendApiResponse<PaymentVerifiedResult>>(
      '/api/payments/verify',
      data
    );
    return response.data.data;
  },
};

export default paymentService;

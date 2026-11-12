import apiClient, { BackendApiResponse } from './api';

export interface CouponValidationResponse {
  valid: boolean;
  couponCode?: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
  message: string;
}

export interface CouponDto {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  perUserLimit: number;
  timesUsed: number;
  active: boolean;
  createdAt: string;
}

export const couponService = {
  /**
   * Validate a promotional coupon code against the cart project items.
   * Discounts are calculated authoritatively on the backend.
   */
  async validate(couponCode: string, projectIds: number[]): Promise<CouponValidationResponse> {
    try {
      const response = await apiClient.post<BackendApiResponse<CouponValidationResponse>>(
        '/api/coupons/validate',
        { couponCode: couponCode.trim(), projectIds }
      );
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return {
        valid: false,
        message: response.data?.message || 'Unable to validate coupon code.',
      };
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to apply coupon.';
      return {
        valid: false,
        message: errorMsg,
      };
    }
  },

  /**
   * Admin: fetch all coupon configurations
   */
  async getAll(): Promise<CouponDto[]> {
    const response = await apiClient.get<BackendApiResponse<CouponDto[]>>('/api/admin/coupons');
    return response.data.data || [];
  },

  /**
   * Admin: update coupon active status
   */
  async updateStatus(id: number, active: boolean): Promise<CouponDto> {
    const response = await apiClient.patch<BackendApiResponse<CouponDto>>(
      `/api/admin/coupons/${id}/status?active=${active}`
    );
    return response.data.data;
  },
};

export default couponService;

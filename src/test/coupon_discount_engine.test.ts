import { describe, it, expect } from 'bun:test';

interface MockCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  isExpired: boolean;
  timesUsed: number;
  usageLimit?: number;
  perUserLimit: number;
}

function calculateDiscount(coupon: MockCoupon, orderAmount: number, userUsage: number = 0): {
  valid: boolean;
  discountAmount: number;
  finalAmount: number;
  error?: string;
} {
  if (coupon.isExpired) {
    return { valid: false, discountAmount: 0, finalAmount: orderAmount, error: 'Coupon has expired' };
  }

  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, finalAmount: orderAmount, error: 'Coupon usage limit reached' };
  }

  if (userUsage >= coupon.perUserLimit) {
    return { valid: false, discountAmount: 0, finalAmount: orderAmount, error: 'You have already redeemed this coupon' };
  }

  if (orderAmount < coupon.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      finalAmount: orderAmount,
      error: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Prevent negative totals
  discount = Math.min(discount, orderAmount);
  const finalAmount = Math.max(0, orderAmount - discount);

  return {
    valid: true,
    discountAmount: Math.round(discount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100,
  };
}

describe('Coupon and Discount Engine Rules', () => {
  it('calculates percentage discount accurately without cap', () => {
    const coupon: MockCoupon = {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 500,
      isExpired: false,
      timesUsed: 5,
      usageLimit: 100,
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 1200);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(120);
    expect(result.finalAmount).toBe(1080);
  });

  it('enforces maximum discount cap for percentage discount', () => {
    const coupon: MockCoupon = {
      code: 'EXAM50',
      discountType: 'PERCENTAGE',
      discountValue: 50,
      minOrderAmount: 1000,
      maxDiscountAmount: 300, // Capped at ₹300
      isExpired: false,
      timesUsed: 0,
      usageLimit: 50,
      perUserLimit: 1,
    };

    // 50% of ₹2,000 would be ₹1,000, but capped at ₹300
    const result = calculateDiscount(coupon, 2000);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(300);
    expect(result.finalAmount).toBe(1700);
  });

  it('calculates flat fixed amount discount accurately', () => {
    const coupon: MockCoupon = {
      code: 'FLAT200',
      discountType: 'FIXED_AMOUNT',
      discountValue: 200,
      minOrderAmount: 1000,
      isExpired: false,
      timesUsed: 12,
      usageLimit: 500,
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 1500);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(200);
    expect(result.finalAmount).toBe(1300);
  });

  it('prevents discount from creating negative total when fixed discount exceeds order total', () => {
    const coupon: MockCoupon = {
      code: 'SUPER500',
      discountType: 'FIXED_AMOUNT',
      discountValue: 500,
      minOrderAmount: 0,
      isExpired: false,
      timesUsed: 1,
      usageLimit: 100,
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 350);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(350);
    expect(result.finalAmount).toBe(0); // Zero total, never negative
  });

  it('rejects coupon when order total is below minimum required amount', () => {
    const coupon: MockCoupon = {
      code: 'BIGSAVER',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 2000,
      isExpired: false,
      timesUsed: 0,
      usageLimit: 100,
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 1499);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Minimum order amount');
    expect(result.finalAmount).toBe(1499);
  });

  it('rejects expired coupon code', () => {
    const coupon: MockCoupon = {
      code: 'OLDCOUPON',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderAmount: 0,
      isExpired: true,
      timesUsed: 5,
      usageLimit: 100,
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 1000);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Coupon has expired');
  });

  it('rejects coupon when user has already reached per-user usage limit', () => {
    const coupon: MockCoupon = {
      code: 'SINGLEUSE',
      discountType: 'FIXED_AMOUNT',
      discountValue: 100,
      minOrderAmount: 0,
      isExpired: false,
      timesUsed: 10,
      usageLimit: 100,
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 1000, 1); // User already used 1 time
    expect(result.valid).toBe(false);
    expect(result.error).toContain('already redeemed');
  });

  it('rejects coupon when global usage limit has been exhausted', () => {
    const coupon: MockCoupon = {
      code: 'LIMITED20',
      discountType: 'FIXED_AMOUNT',
      discountValue: 100,
      minOrderAmount: 0,
      isExpired: false,
      timesUsed: 20,
      usageLimit: 20, // Exhausted
      perUserLimit: 1,
    };

    const result = calculateDiscount(coupon, 1000, 0);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('usage limit reached');
  });
});

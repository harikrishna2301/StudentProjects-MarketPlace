package com.projectkit.service;

import com.projectkit.dto.request.CreateCouponRequest;
import com.projectkit.dto.request.ValidateCouponRequest;
import com.projectkit.dto.response.CouponDto;
import com.projectkit.dto.response.CouponValidationResponse;
import com.projectkit.entity.Coupon;
import com.projectkit.entity.Order;
import com.projectkit.entity.User;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {

    /**
     * Validate a coupon code against a set of project kits for an authenticated user.
     * Calculates the exact discount and returns detailed breakdown.
     */
    CouponValidationResponse validateCoupon(ValidateCouponRequest request, Long userId);

    /**
     * Calculate discount amount for a given coupon and pre-discount order total.
     * Enforces percentage capping, minimum amounts, and guarantees total never goes negative.
     */
    BigDecimal calculateDiscount(Coupon coupon, BigDecimal originalAmount);

    /**
     * Look up and atomically lock coupon for redemption during order creation.
     */
    Coupon getAndLockCouponForRedemption(String code, Long userId, BigDecimal originalAmount);

    /**
     * Record coupon usage audit trail upon order placement.
     */
    void recordCouponUsage(Coupon coupon, User user, Order order, BigDecimal discountAmount);

    // Admin Operations
    CouponDto createCoupon(CreateCouponRequest request);

    CouponDto updateCouponStatus(Long couponId, boolean active);

    void deleteCoupon(Long couponId);

    List<CouponDto> getAllCoupons();

    CouponDto getCouponById(Long couponId);
}

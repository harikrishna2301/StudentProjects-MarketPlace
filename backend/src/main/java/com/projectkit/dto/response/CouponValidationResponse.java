package com.projectkit.dto.response;

import com.projectkit.enums.DiscountType;
import java.math.BigDecimal;

public class CouponValidationResponse {

    private boolean valid;
    private String couponCode;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal originalAmount;
    private BigDecimal finalAmount;
    private String message;

    public CouponValidationResponse() {
    }

    public static CouponValidationResponse invalid(String message) {
        CouponValidationResponse resp = new CouponValidationResponse();
        resp.setValid(false);
        resp.setMessage(message);
        resp.setDiscountAmount(BigDecimal.ZERO);
        return resp;
    }

    public static CouponValidationResponse valid(String couponCode, DiscountType discountType,
                                                  BigDecimal discountValue, BigDecimal discountAmount,
                                                  BigDecimal originalAmount, BigDecimal finalAmount,
                                                  String message) {
        CouponValidationResponse resp = new CouponValidationResponse();
        resp.setValid(true);
        resp.setCouponCode(couponCode);
        resp.setDiscountType(discountType);
        resp.setDiscountValue(discountValue);
        resp.setDiscountAmount(discountAmount);
        resp.setOriginalAmount(originalAmount);
        resp.setFinalAmount(finalAmount);
        resp.setMessage(message);
        return resp;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

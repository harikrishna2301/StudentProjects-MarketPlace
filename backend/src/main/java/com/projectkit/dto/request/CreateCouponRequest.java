package com.projectkit.dto.request;

import com.projectkit.enums.DiscountType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreateCouponRequest {

    @NotBlank(message = "Coupon code cannot be empty")
    @Pattern(regexp = "^[A-Za-z0-9_-]{3,50}$", message = "Coupon code must be 3-50 alphanumeric characters")
    private String code;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.01", message = "Discount value must be greater than zero")
    private BigDecimal discountValue;

    @DecimalMin(value = "0.00", message = "Minimum order amount cannot be negative")
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @DecimalMin(value = "0.01", message = "Maximum discount amount must be greater than zero")
    private BigDecimal maxDiscountAmount;

    private LocalDateTime startDate;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    @Min(value = 1, message = "Usage limit must be at least 1")
    private Integer usageLimit;

    @NotNull(message = "Per-user limit is required")
    @Min(value = 1, message = "Per-user limit must be at least 1")
    private Integer perUserLimit = 1;

    private boolean active = true;

    public CreateCouponRequest() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public BigDecimal getMaxDiscountAmount() {
        return maxDiscountAmount;
    }

    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) {
        this.maxDiscountAmount = maxDiscountAmount;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getPerUserLimit() {
        return perUserLimit;
    }

    public void setPerUserLimit(Integer perUserLimit) {
        this.perUserLimit = perUserLimit;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

package com.projectkit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ValidateCouponRequest {

    @NotBlank(message = "Coupon code is required")
    private String couponCode;

    @NotEmpty(message = "Order must contain at least one project kit")
    private List<Long> projectIds;

    public ValidateCouponRequest() {
    }

    public ValidateCouponRequest(String couponCode, List<Long> projectIds) {
        this.couponCode = couponCode;
        this.projectIds = projectIds;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public List<Long> getProjectIds() {
        return projectIds;
    }

    public void setProjectIds(List<Long> projectIds) {
        this.projectIds = projectIds;
    }
}

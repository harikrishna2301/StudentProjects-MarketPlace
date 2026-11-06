package com.projectkit.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CreateOrderRequest {

    @NotEmpty(message = "Order must contain at least one project kit")
    private List<Long> projectIds;

    private String couponCode;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(List<Long> projectIds) {
        this.projectIds = projectIds;
    }

    public CreateOrderRequest(List<Long> projectIds, String couponCode) {
        this.projectIds = projectIds;
        this.couponCode = couponCode;
    }

    public List<Long> getProjectIds() {
        return projectIds;
    }

    public void setProjectIds(List<Long> projectIds) {
        this.projectIds = projectIds;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }
}

package com.projectkit.dto.response;

import com.projectkit.entity.Order;
import com.projectkit.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {

    private Long orderId;
    private String orderNumber;
    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String couponCode;
    private String currency = "INR";
    private OrderStatus status;
    private String razorpayOrderId;
    private String razorpayKeyId;
    private List<OrderItemDto> items;
    private LocalDateTime createdAt;

    public static class OrderItemDto {
        private Long projectId;
        private String projectTitle;
        private BigDecimal price;

        public OrderItemDto(Long projectId, String projectTitle, BigDecimal price) {
            this.projectId = projectId;
            this.projectTitle = projectTitle;
            this.price = price;
        }

        public Long getProjectId() {
            return projectId;
        }

        public String getProjectTitle() {
            return projectTitle;
        }

        public BigDecimal getPrice() {
            return price;
        }
    }

    public OrderResponse() {
    }

    public static OrderResponse fromEntity(Order order, String razorpayKeyId) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setOriginalAmount(order.getOriginalAmount() != null ? order.getOriginalAmount() : order.getTotalAmount());
        response.setDiscountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO);
        response.setTotalAmount(order.getTotalAmount());
        response.setCouponCode(order.getCouponCode());
        response.setStatus(order.getStatus());
        response.setRazorpayOrderId(order.getRazorpayOrderId());
        response.setRazorpayKeyId(razorpayKeyId);
        response.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                    .map(i -> new OrderItemDto(i.getProject().getId(), i.getProjectTitle(), i.getPrice()))
                    .collect(Collectors.toList()));
        }

        return response;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    public void setRazorpayKeyId(String razorpayKeyId) {
        this.razorpayKeyId = razorpayKeyId;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

package com.projectkit.dto.response;

import com.projectkit.entity.Payment;
import com.projectkit.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private String paymentNumber;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String razorpayPaymentId;
    private LocalDateTime createdAt;

    public PaymentResponse() {
    }

    public static PaymentResponse fromEntity(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setPaymentNumber(payment.getPaymentNumber());
        if (payment.getOrder() != null) {
            response.setOrderNumber(payment.getOrder().getOrderNumber());
        }
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setStatus(payment.getStatus());
        response.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        response.setCreatedAt(payment.getCreatedAt());
        return response;
    }

    public String getPaymentNumber() {
        return paymentNumber;
    }

    public void setPaymentNumber(String paymentNumber) {
        this.paymentNumber = paymentNumber;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

package com.projectkit.service;

import com.projectkit.dto.request.PaymentVerifyRequest;
import com.projectkit.dto.response.PaymentResponse;

public interface PaymentService {

    PaymentResponse verifyPayment(PaymentVerifyRequest request, Long userId);

    void processWebhook(String payload, String signatureHeader);
}

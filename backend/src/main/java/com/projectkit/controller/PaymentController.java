package com.projectkit.controller;

import com.projectkit.dto.request.PaymentVerifyRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.PaymentResponse;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Razorpay payment verification and webhook processing")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/verify")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Verify Razorpay payment", description = "Validates HMAC-SHA256 signature and activates access to purchased project downloads")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        PaymentResponse response = paymentService.verifyPayment(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment verified and order finalized successfully", response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook receiver", description = "Listens to asynchronous payment notifications from Razorpay gateway")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature
    ) {
        paymentService.processWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }
}

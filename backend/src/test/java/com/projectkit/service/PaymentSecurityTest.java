package com.projectkit.service;

import com.projectkit.dto.request.PaymentVerifyRequest;
import com.projectkit.dto.response.PaymentResponse;
import com.projectkit.entity.Order;
import com.projectkit.entity.OrderItem;
import com.projectkit.entity.Payment;
import com.projectkit.entity.Project;
import com.projectkit.entity.User;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.PaymentStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.PaymentVerificationException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.PaymentRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentSecurityTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private com.projectkit.repository.InvoiceRepository invoiceRepository;

    @Mock
    private com.projectkit.service.EmailService emailService;

    @Mock
    private Environment environment;

    private PaymentServiceImpl paymentService;

    private static final String TEST_KEY_SECRET = "secret_key_for_testing_purposes_only_32_bytes";
    private static final String TEST_WEBHOOK_SECRET = "webhook_secret_for_testing_purposes_only";

    private User sampleUser;
    private Order sampleOrder;
    private Project sampleProject;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentServiceImpl(orderRepository, paymentRepository, projectRepository, invoiceRepository, emailService, environment);
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_KEY_SECRET);
        ReflectionTestUtils.setField(paymentService, "webhookSecret", TEST_WEBHOOK_SECRET);

        sampleUser = new User();
        sampleUser.setId(10L);
        sampleUser.setEmail("student@test.com");
        sampleUser.setRole(Role.STUDENT);

        sampleProject = new Project();
        sampleProject.setId(100L);
        sampleProject.setTitle("AI Healthcare Scanner");
        sampleProject.setPurchaseCount(5);

        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setOrderNumber("PK-2026-TEST");
        sampleOrder.setUser(sampleUser);
        sampleOrder.setTotalAmount(new BigDecimal("1499.00"));
        sampleOrder.setStatus(OrderStatus.PENDING);
        sampleOrder.setRazorpayOrderId("order_rzp_12345");

        OrderItem orderItem = new OrderItem(sampleOrder, sampleProject, new BigDecimal("1499.00"), sampleProject.getTitle());
        sampleOrder.setItems(List.of(orderItem));

        lenient().when(invoiceRepository.findByOrderId(any())).thenReturn(Optional.empty());
        lenient().when(invoiceRepository.save(any(com.projectkit.entity.Invoice.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    @DisplayName("TASK 2 & 6: Valid Razorpay signature should verify payment, generate invoice, send confirmation email, and mark order as PAID")
    void verifyPayment_WithValidSignature_ShouldSucceed() {
        String paymentId = "pay_rzp_99999";
        String validSignature = calculateHmacSha256("order_rzp_12345|" + paymentId, TEST_KEY_SECRET);

        PaymentVerifyRequest request = new PaymentVerifyRequest("order_rzp_12345", paymentId, validSignature);

        when(orderRepository.findByRazorpayOrderId("order_rzp_12345")).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId(paymentId)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.verifyPayment(request, sampleUser.getId());

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals(OrderStatus.PAID, sampleOrder.getStatus());
        assertEquals(paymentId, sampleOrder.getRazorpayPaymentId());
        assertEquals(6, sampleProject.getPurchaseCount()); // Incremented
        verify(orderRepository, times(1)).save(sampleOrder);
        verify(projectRepository, times(1)).save(sampleProject);
        verify(invoiceRepository, times(1)).save(any(com.projectkit.entity.Invoice.class));
        verify(emailService, times(1)).sendPaymentSuccessEmail(eq("student@test.com"), any(), any(), eq("PK-2026-TEST"), any());
        verify(emailService, times(1)).sendInvoiceAvailableEmail(eq("student@test.com"), any(), any(), eq("PK-2026-TEST"), any());
    }

    @Test
    @DisplayName("TASK 2 & 6: Invalid Razorpay signature should throw PaymentVerificationException, fail order, and send failure email")
    void verifyPayment_WithInvalidSignature_ShouldFail() {
        String paymentId = "pay_rzp_99999";
        String fakeSignature = "invalid_tampered_signature_hex_12345";

        PaymentVerifyRequest request = new PaymentVerifyRequest("order_rzp_12345", paymentId, fakeSignature);

        when(orderRepository.findByRazorpayOrderId("order_rzp_12345")).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId(paymentId)).thenReturn(Optional.empty());

        assertThrows(PaymentVerificationException.class, () -> paymentService.verifyPayment(request, sampleUser.getId()));

        assertEquals(OrderStatus.FAILED, sampleOrder.getStatus());
        verify(orderRepository, times(1)).save(sampleOrder);
        verify(paymentRepository, times(1)).save(any(Payment.class)); // Saved FAILED payment record
        verify(emailService, times(1)).sendPaymentFailureEmail(eq("student@test.com"), any(), eq("PK-2026-TEST"), any());
    }

    @Test
    @DisplayName("TASK 2 & 6: Missing or unconfigured Razorpay credentials must cause verification to fail safely")
    void verifyPayment_WithMissingSecret_ShouldThrowException() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "");

        PaymentVerifyRequest request = new PaymentVerifyRequest("order_rzp_12345", "pay_rzp_99999", "sig123");

        when(orderRepository.findByRazorpayOrderId("order_rzp_12345")).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId("pay_rzp_99999")).thenReturn(Optional.empty());

        PaymentVerificationException ex = assertThrows(PaymentVerificationException.class,
                () -> paymentService.verifyPayment(request, sampleUser.getId()));

        assertTrue(ex.getMessage().contains("not configured"));
    }

    @Test
    @DisplayName("TASK 2 & 6: Replay attack prevention: duplicate payment ID must be rejected")
    void verifyPayment_WithDuplicatePaymentId_ShouldThrowBadRequest() {
        PaymentVerifyRequest request = new PaymentVerifyRequest("order_rzp_12345", "pay_already_processed", "sig");

        when(orderRepository.findByRazorpayOrderId("order_rzp_12345")).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId("pay_already_processed")).thenReturn(Optional.of(new Payment()));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> paymentService.verifyPayment(request, sampleUser.getId()));

        assertTrue(ex.getMessage().contains("replay"));
    }

    @Test
    @DisplayName("TASK 2 & 6: Simulated order IDs attempting to bypass verification in production must be rejected")
    void verifyPayment_WithSimulatedOrderIdInProduction_MustNotBypass() {
        sampleOrder.setRazorpayOrderId("order_sim_malicious_bypass");
        PaymentVerifyRequest request = new PaymentVerifyRequest("order_sim_malicious_bypass", "pay_123", "fake_sig");

        when(orderRepository.findByRazorpayOrderId("order_sim_malicious_bypass")).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId("pay_123")).thenReturn(Optional.empty());
        when(environment.acceptsProfiles(any(Profiles.class))).thenReturn(false); // Production profile

        assertThrows(PaymentVerificationException.class, () -> paymentService.verifyPayment(request, sampleUser.getId()));
        assertEquals(OrderStatus.FAILED, sampleOrder.getStatus());
    }

    @Test
    @DisplayName("TASK 2 & 6: Duplicate payment webhook must be processed idempotently without double-charging or re-incrementing")
    void processWebhook_WithDuplicateEvent_ShouldBeIdempotent() {
        String payload = """
                {
                    "event": "order.paid",
                    "payload": {
                        "payment": {
                            "entity": {
                                "id": "pay_wh_123",
                                "order_id": "order_rzp_12345"
                            }
                        }
                    }
                }
                """;
        String validSignature = calculateHmacSha256(payload, TEST_WEBHOOK_SECRET);

        // First call: order is PENDING
        when(orderRepository.findByRazorpayOrderId("order_rzp_12345")).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId("pay_wh_123")).thenReturn(Optional.empty());

        paymentService.processWebhook(payload, validSignature);

        assertEquals(OrderStatus.PAID, sampleOrder.getStatus());
        assertEquals(6, sampleProject.getPurchaseCount());

        // Second call with same webhook event: order is already PAID
        paymentService.processWebhook(payload, validSignature);

        // Verify purchase count was not incremented a second time
        assertEquals(6, sampleProject.getPurchaseCount());
        verify(orderRepository, times(1)).save(sampleOrder);
    }

    @Test
    @DisplayName("TASK 2 & 6: Webhook with invalid signature must be rejected immediately")
    void processWebhook_WithInvalidSignature_ShouldReject() {
        String payload = "{\"event\": \"order.paid\"}";
        String invalidSignature = "invalid_tampered_webhook_sig";

        paymentService.processWebhook(payload, invalidSignature);

        // Order repository must never be touched
        verify(orderRepository, never()).findByRazorpayOrderId(anyString());
    }

    private String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}

package com.projectkit.service.impl;

import com.projectkit.dto.request.PaymentVerifyRequest;
import com.projectkit.dto.response.PaymentResponse;
import com.projectkit.entity.*;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.PaymentStatus;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.PaymentVerificationException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.InvoiceRepository;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.PaymentRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.service.EmailService;
import com.projectkit.service.PaymentService;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Year;
import java.util.Random;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final InvoiceRepository invoiceRepository;
    private final EmailService emailService;
    private final Environment environment;

    @Value("${projectkit.razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Value("${projectkit.razorpay.webhook-secret:}")
    private String webhookSecret;

    public PaymentServiceImpl(OrderRepository orderRepository,
                              PaymentRepository paymentRepository,
                              ProjectRepository projectRepository,
                              InvoiceRepository invoiceRepository,
                              EmailService emailService,
                              Environment environment) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.projectRepository = projectRepository;
        this.invoiceRepository = invoiceRepository;
        this.emailService = emailService;
        this.environment = environment;
    }

    @Override
    @Transactional
    public PaymentResponse verifyPayment(PaymentVerifyRequest request, Long userId) {
        if (request == null || request.getRazorpayOrderId() == null || request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null
                || request.getRazorpayOrderId().isBlank() || request.getRazorpayPaymentId().isBlank() || request.getRazorpaySignature().isBlank()) {
            throw new BadRequestException("Razorpay order ID, payment ID, and signature are required.");
        }

        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "razorpayOrderId", request.getRazorpayOrderId()));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to verify payment for this order.");
        }

        if (order.getStatus() == OrderStatus.PAID) {
            throw new BadRequestException("This order has already been paid and verified.");
        }

        // Prevent payment replay: ensure this payment ID has not already been used for any order
        if (paymentRepository.findByRazorpayPaymentId(request.getRazorpayPaymentId()).isPresent()) {
            throw new BadRequestException("This payment transaction has already been processed (replay detected).");
        }

        boolean isValid = verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            Payment failedPayment = new Payment();
            failedPayment.setOrder(order);
            failedPayment.setPaymentNumber("PAY-FAIL-" + System.currentTimeMillis());
            failedPayment.setAmount(order.getTotalAmount());
            failedPayment.setStatus(PaymentStatus.FAILED);
            failedPayment.setRazorpayOrderId(request.getRazorpayOrderId());
            failedPayment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            failedPayment.setRazorpaySignature(request.getRazorpaySignature());
            failedPayment.setErrorDescription("Signature verification mismatch");
            paymentRepository.save(failedPayment);

            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);

            // Notify student of failed payment
            try {
                User student = order.getUser();
                emailService.sendPaymentFailureEmail(
                        student.getEmail(),
                        student.getFullName(),
                        order.getOrderNumber(),
                        "Razorpay payment signature mismatch or untrusted transaction response."
                );
            } catch (Exception ex) {
                logger.warn("Could not dispatch payment failure email: {}", ex.getMessage());
            }

            throw new PaymentVerificationException("Payment signature verification failed. Transaction was not authorized.");
        }

        // Successful payment record
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentNumber("PAY-" + System.currentTimeMillis() + "-" + (1000 + new Random().nextInt(9000)));
        payment.setAmount(order.getTotalAmount());
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setPaymentMethod("RAZORPAY_ONLINE");

        Payment savedPayment = paymentRepository.save(payment);

        // Update order status to PAID
        order.setStatus(OrderStatus.PAID);
        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        orderRepository.save(order);

        // Increment purchase count on each project kit
        for (OrderItem item : order.getItems()) {
            Project project = item.getProject();
            project.setPurchaseCount(project.getPurchaseCount() + 1);
            projectRepository.save(project);
        }

        // Generate official Tax Invoice
        Invoice invoice = createInvoiceForOrder(order);

        // Dispatch transactional emails
        try {
            User student = order.getUser();
            emailService.sendPaymentSuccessEmail(
                    student.getEmail(),
                    student.getFullName(),
                    savedPayment.getPaymentNumber(),
                    order.getOrderNumber(),
                    savedPayment.getAmount()
            );
            emailService.sendInvoiceAvailableEmail(
                    student.getEmail(),
                    student.getFullName(),
                    invoice.getInvoiceNumber(),
                    order.getOrderNumber(),
                    invoice.getTotalAmount()
            );
        } catch (Exception ex) {
            logger.warn("Non-blocking failure during payment email dispatch for order {}: {}", order.getOrderNumber(), ex.getMessage());
        }

        logger.info("Order #{} marked as PAID following verified payment #{}, invoice #{}",
                order.getOrderNumber(), savedPayment.getPaymentNumber(), invoice.getInvoiceNumber());
        return PaymentResponse.fromEntity(savedPayment);
    }

    @Override
    @Transactional
    public void processWebhook(String payload, String signatureHeader) {
        if (signatureHeader == null || signatureHeader.isBlank()) {
            logger.warn("Razorpay webhook rejected: missing signature header");
            return;
        }

        if (webhookSecret == null || webhookSecret.isBlank() || isPlaceholder(webhookSecret)) {
            logger.error("Razorpay webhook secret is not configured on server. Webhook rejected.");
            return;
        }

        boolean validWebhook = verifyHmacSha256(payload, signatureHeader, webhookSecret);
        if (!validWebhook) {
            logger.warn("Received invalid Razorpay webhook signature. Webhook rejected.");
            return;
        }

        try {
            JSONObject json = new JSONObject(payload);
            String event = json.optString("event");

            if ("order.paid".equalsIgnoreCase(event) || "payment.captured".equalsIgnoreCase(event)) {
                JSONObject payloadObj = json.getJSONObject("payload");
                JSONObject paymentEntity = payloadObj.getJSONObject("payment").getJSONObject("entity");
                String razorpayOrderId = paymentEntity.optString("order_id");
                String razorpayPaymentId = paymentEntity.optString("id");

                orderRepository.findByRazorpayOrderId(razorpayOrderId).ifPresent(order -> {
                    // Idempotent webhook check: if already paid, do nothing
                    if (order.getStatus() == OrderStatus.PAID) {
                        logger.info("Order #{} is already PAID. Skipping duplicate webhook event.", order.getOrderNumber());
                        return;
                    }

                    order.setStatus(OrderStatus.PAID);
                    order.setRazorpayPaymentId(razorpayPaymentId);
                    orderRepository.save(order);

                    Payment webhookPayment = paymentRepository.findByRazorpayPaymentId(razorpayPaymentId).orElseGet(() -> {
                        Payment payment = new Payment();
                        payment.setOrder(order);
                        payment.setPaymentNumber("PAY-WH-" + System.currentTimeMillis() + "-" + (1000 + new Random().nextInt(9000)));
                        payment.setAmount(order.getTotalAmount());
                        payment.setCurrency("INR");
                        payment.setStatus(PaymentStatus.SUCCESS);
                        payment.setRazorpayOrderId(razorpayOrderId);
                        payment.setRazorpayPaymentId(razorpayPaymentId);
                        payment.setPaymentMethod("RAZORPAY_WEBHOOK");
                        return paymentRepository.save(payment);
                    });

                    for (OrderItem item : order.getItems()) {
                        Project project = item.getProject();
                        project.setPurchaseCount(project.getPurchaseCount() + 1);
                        projectRepository.save(project);
                    }

                    Invoice invoice = createInvoiceForOrder(order);

                    try {
                        User student = order.getUser();
                        emailService.sendPaymentSuccessEmail(
                                student.getEmail(),
                                student.getFullName(),
                                webhookPayment.getPaymentNumber(),
                                order.getOrderNumber(),
                                webhookPayment.getAmount()
                        );
                        emailService.sendInvoiceAvailableEmail(
                                student.getEmail(),
                                student.getFullName(),
                                invoice.getInvoiceNumber(),
                                order.getOrderNumber(),
                                invoice.getTotalAmount()
                        );
                    } catch (Exception ex) {
                        logger.warn("Email notification failed during webhook handling: {}", ex.getMessage());
                    }

                    logger.info("Order #{} marked as PAID via verified Razorpay webhook", order.getOrderNumber());
                });
            }
        } catch (Exception ex) {
            logger.error("Failed to parse or process Razorpay webhook payload: {}", ex.getMessage());
        }
    }

    private Invoice createInvoiceForOrder(Order order) {
        return invoiceRepository.findByOrderId(order.getId()).orElseGet(() -> {
            String invoiceNumber = "INV-" + Year.now().getValue() + "-" + (100000 + new Random().nextInt(900000));
            BigDecimal subtotal = order.getTotalAmount();
            BigDecimal tax = BigDecimal.ZERO;
            User user = order.getUser();
            String name = (user.getFullName() != null && !user.getFullName().isBlank()) ? user.getFullName() : "Student";
            String email = user.getEmail();

            Invoice invoice = new Invoice(
                    invoiceNumber,
                    order,
                    user,
                    subtotal,
                    tax,
                    order.getTotalAmount(),
                    name,
                    email
            );
            return invoiceRepository.save(invoice);
        });
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null ||
                orderId.isBlank() || paymentId.isBlank() || signature.isBlank()) {
            return false;
        }

        // Strictly isolated to active 'dev' profile and explicit property flag
        if (isDevSimulationAllowed() && orderId.startsWith("order_sim_")) {
            logger.warn("Processing SIMULATED payment verification in dev profile for order: {}", orderId);
            return true;
        }

        // Fail-safe: if Razorpay key secret is missing or placeholder in production, verification must fail
        if (razorpayKeySecret == null || razorpayKeySecret.isBlank() || isPlaceholder(razorpayKeySecret)) {
            logger.error("Razorpay key secret is not configured. Payment verification cannot proceed.");
            throw new PaymentVerificationException("Razorpay gateway secrets are not configured on server. Verification cannot proceed.");
        }

        String data = orderId + "|" + paymentId;
        return verifyHmacSha256(data, signature, razorpayKeySecret);
    }

    private boolean isDevSimulationAllowed() {
        return environment.acceptsProfiles(Profiles.of("dev")) &&
                Boolean.parseBoolean(environment.getProperty("projectkit.payments.allow-simulation", "false"));
    }

    private boolean isPlaceholder(String secret) {
        return secret == null || secret.isBlank() || secret.contains("placeholder");
    }

    private boolean verifyHmacSha256(String data, String expectedSignature, String secret) {
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

            return MessageDigest.isEqual(
                    hexString.toString().getBytes(StandardCharsets.UTF_8),
                    expectedSignature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception ex) {
            logger.error("Error computing HMAC-SHA256 signature", ex);
            return false;
        }
    }
}

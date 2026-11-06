package com.projectkit.service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Transactional email service provider abstraction for ProjectKit.
 * Supports branded transactional email dispatch for authentication,
 * order management, payment events, and invoices.
 */
public interface EmailService {

    /**
     * Sends student account verification email with confirmation link.
     */
    void sendAccountVerificationEmail(String toEmail, String recipientName, String verificationToken);

    /**
     * Sends password reset email with secure one-time reset token link.
     */
    void sendPasswordResetEmail(String toEmail, String recipientName, String resetToken);

    /**
     * Sends order confirmation email when a student places an order.
     */
    void sendOrderConfirmationEmail(String toEmail, String recipientName, String orderNumber, BigDecimal totalAmount, List<String> itemTitles);

    /**
     * Sends payment success notification with payment and order identifiers.
     */
    void sendPaymentSuccessEmail(String toEmail, String recipientName, String paymentNumber, String orderNumber, BigDecimal amount);

    /**
     * Sends payment failure notification with failure reason and recovery instructions.
     */
    void sendPaymentFailureEmail(String toEmail, String recipientName, String orderNumber, String failureReason);

    /**
     * Sends notification that a tax invoice is generated and ready for download.
     */
    void sendInvoiceAvailableEmail(String toEmail, String recipientName, String invoiceNumber, String orderNumber, BigDecimal amount);
}

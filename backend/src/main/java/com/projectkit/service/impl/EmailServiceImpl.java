package com.projectkit.service.impl;

import com.projectkit.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.Year;
import java.util.List;
import java.util.Locale;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${projectkit.mail.from-address:noreply@projectkit.in}")
    private String fromAddress;

    @Value("${projectkit.mail.from-name:ProjectKit Marketplace}")
    private String fromName;

    @Value("${projectkit.mail.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${projectkit.mail.enabled:true}")
    private boolean mailEnabled;

    public EmailServiceImpl(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    @Override
    @Async
    public void sendAccountVerificationEmail(String toEmail, String recipientName, String verificationToken) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
        String subject = "Verify your ProjectKit Student Account";

        String contentHtml = ""
                + "<p style=\"margin: 0 0 16px; font-size: 15px; color: #334155;\">Hi " + escapeHtml(recipientName) + ",</p>"
                + "<p style=\"margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "Welcome to <strong>ProjectKit</strong> – the verified student technology marketplace. "
                + "Please verify your email address to activate your account and start exploring production-grade source code, circuit schematics, and project kits."
                + "</p>"
                + "<div style=\"text-align: center; margin: 28px 0;\">"
                + "  <a href=\"" + verificationUrl + "\" style=\"display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);\">Verify Student Email</a>"
                + "</div>"
                + "<p style=\"margin: 20px 0 0; font-size: 12px; color: #64748B;\">"
                + "Or copy and paste this verification link into your browser:<br/>"
                + "<a href=\"" + verificationUrl + "\" style=\"color: #2563EB; word-break: break-all;\">" + verificationUrl + "</a>"
                + "</p>"
                + "<p style=\"margin: 16px 0 0; font-size: 12px; color: #94A3B8;\">"
                + "This verification token will expire in 24 hours. If you did not create this account, please disregard this email."
                + "</p>";

        sendHtmlEmail(toEmail, subject, wrapInTemplate("Verify Your Account", contentHtml));
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetToken) {
        String resetUrl = frontendUrl + "/login?mode=reset-password&token=" + resetToken;
        String subject = "Reset your ProjectKit Password";

        String contentHtml = ""
                + "<p style=\"margin: 0 0 16px; font-size: 15px; color: #334155;\">Hi " + escapeHtml(recipientName) + ",</p>"
                + "<p style=\"margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "We received a request to reset the password for your ProjectKit account. Click the button below to choose a new secure password:"
                + "</p>"
                + "<div style=\"text-align: center; margin: 28px 0;\">"
                + "  <a href=\"" + resetUrl + "\" style=\"display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);\">Reset Password</a>"
                + "</div>"
                + "<p style=\"margin: 20px 0 0; font-size: 12px; color: #64748B;\">"
                + "Reset URL link:<br/>"
                + "<a href=\"" + resetUrl + "\" style=\"color: #2563EB; word-break: break-all;\">" + resetUrl + "</a>"
                + "</p>"
                + "<div style=\"margin: 20px 0 0; padding: 12px; background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; font-size: 12px; color: #92400E;\">"
                + "<strong>Security Advisory:</strong> This single-use reset link expires in 15 minutes. If you did not initiate this request, your account remains secure and no further action is required."
                + "</div>";

        sendHtmlEmail(toEmail, subject, wrapInTemplate("Password Reset Request", contentHtml));
    }

    @Override
    @Async
    public void sendOrderConfirmationEmail(String toEmail, String recipientName, String orderNumber, BigDecimal totalAmount, List<String> itemTitles) {
        String subject = "Order Confirmation - #" + orderNumber;

        StringBuilder itemsListHtml = new StringBuilder();
        itemsListHtml.append("<ul style=\"margin: 12px 0; padding-left: 20px; color: #334155;\">");
        if (itemTitles != null) {
            for (String title : itemTitles) {
                itemsListHtml.append("<li style=\"margin-bottom: 6px; font-size: 13px;\">").append(escapeHtml(title)).append("</li>");
            }
        }
        itemsListHtml.append("</ul>");

        String formattedAmount = formatCurrency(totalAmount);

        String contentHtml = ""
                + "<p style=\"margin: 0 0 16px; font-size: 15px; color: #334155;\">Hi " + escapeHtml(recipientName) + ",</p>"
                + "<p style=\"margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "Thank you for choosing ProjectKit! Your order <strong>#" + escapeHtml(orderNumber) + "</strong> has been initiated and logged."
                + "</p>"
                + "<div style=\"background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 16px 0;\">"
                + "  <div style=\"font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 8px;\">Purchased Kit Items:</div>"
                +    itemsListHtml
                + "  <div style=\"margin-top: 12px; pt-2; border-top: 1px dashed #CBD5E1; display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; font-size: 14px;\">"
                + "    <span>Total Amount:</span> <span>" + formattedAmount + "</span>"
                + "  </div>"
                + "</div>"
                + "<p style=\"margin: 16px 0 0; font-size: 13px; color: #475569;\">"
                + "Once your online payment verification completes, your instant source code and documentation download links will activate immediately in your Student Dashboard."
                + "</p>";

        sendHtmlEmail(toEmail, subject, wrapInTemplate("Order Confirmation", contentHtml));
    }

    @Override
    @Async
    public void sendPaymentSuccessEmail(String toEmail, String recipientName, String paymentNumber, String orderNumber, BigDecimal amount) {
        String dashboardUrl = frontendUrl + "/student/purchases";
        String subject = "Payment Confirmed - Order #" + orderNumber;
        String formattedAmount = formatCurrency(amount);

        String contentHtml = ""
                + "<p style=\"margin: 0 0 16px; font-size: 15px; color: #334155;\">Hi " + escapeHtml(recipientName) + ",</p>"
                + "<div style=\"background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;\">"
                + "  <span style=\"color: #065F46; font-weight: 700; font-size: 14px;\">✓ Payment Authorized & Confirmed</span>"
                + "  <p style=\"margin: 4px 0 0; font-size: 13px; color: #047857;\">Payment Reference: <strong>" + escapeHtml(paymentNumber) + "</strong></p>"
                + "</div>"
                + "<p style=\"margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "Your payment of <strong>" + formattedAmount + "</strong> for Order <strong>#" + escapeHtml(orderNumber) + "</strong> was successfully authorized and verified via Razorpay."
                + "</p>"
                + "<p style=\"margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "Full access rights, source repositories, circuit diagrams, and project reports have been granted to your student account."
                + "</p>"
                + "<div style=\"text-align: center; margin: 26px 0;\">"
                + "  <a href=\"" + dashboardUrl + "\" style=\"display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);\">Access My Purchases</a>"
                + "</div>";

        sendHtmlEmail(toEmail, subject, wrapInTemplate("Payment Received", contentHtml));
    }

    @Override
    @Async
    public void sendPaymentFailureEmail(String toEmail, String recipientName, String orderNumber, String failureReason) {
        String checkoutUrl = frontendUrl + "/cart";
        String subject = "Payment Unsuccessful - Order #" + orderNumber;

        String contentHtml = ""
                + "<p style=\"margin: 0 0 16px; font-size: 15px; color: #334155;\">Hi " + escapeHtml(recipientName) + ",</p>"
                + "<div style=\"background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;\">"
                + "  <span style=\"color: #991B1B; font-weight: 700; font-size: 14px;\">✕ Payment Failed or Cancelled</span>"
                + "  <p style=\"margin: 4px 0 0; font-size: 13px; color: #B91C1C;\">Reason: " + escapeHtml(failureReason != null ? failureReason : "Transaction could not be authorized by bank/gateway.") + "</p>"
                + "</div>"
                + "<p style=\"margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "Your payment for Order <strong>#" + escapeHtml(orderNumber) + "</strong> was not completed. If any funds were deducted, your bank will automatically reverse the transaction within 3-5 business days."
                + "</p>"
                + "<div style=\"text-align: center; margin: 24px 0;\">"
                + "  <a href=\"" + checkoutUrl + "\" style=\"display: inline-block; background-color: #0F172A; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px;\">Review Cart & Retry</a>"
                + "</div>";

        sendHtmlEmail(toEmail, subject, wrapInTemplate("Payment Alert", contentHtml));
    }

    @Override
    @Async
    public void sendInvoiceAvailableEmail(String toEmail, String recipientName, String invoiceNumber, String orderNumber, BigDecimal amount) {
        String invoiceUrl = frontendUrl + "/student/purchases";
        String subject = "Tax Invoice Available - #" + invoiceNumber;
        String formattedAmount = formatCurrency(amount);

        String contentHtml = ""
                + "<p style=\"margin: 0 0 16px; font-size: 15px; color: #334155;\">Hi " + escapeHtml(recipientName) + ",</p>"
                + "<p style=\"margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.6;\">"
                + "Your official GST/Tax invoice for Order <strong>#" + escapeHtml(orderNumber) + "</strong> is now ready for your records."
                + "</p>"
                + "<div style=\"background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 16px 0;\">"
                + "  <div style=\"font-size: 13px; margin-bottom: 6px; color: #64748B;\">Invoice Number: <strong style=\"color: #0F172A;\">" + escapeHtml(invoiceNumber) + "</strong></div>"
                + "  <div style=\"font-size: 13px; margin-bottom: 6px; color: #64748B;\">Total Paid: <strong style=\"color: #0F172A;\">" + formattedAmount + "</strong></div>"
                + "  <div style=\"font-size: 13px; color: #64748B;\">Status: <strong style=\"color: #059669;\">PAID IN FULL</strong></div>"
                + "</div>"
                + "<div style=\"text-align: center; margin: 24px 0;\">"
                + "  <a href=\"" + invoiceUrl + "\" style=\"display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px;\">View Invoice in Dashboard</a>"
                + "</div>";

        sendHtmlEmail(toEmail, subject, wrapInTemplate("Invoice Available", contentHtml));
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (!mailEnabled) {
            logger.info("Email dispatch disabled via configuration. Target: {}, Subject: {}", to, subject);
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            logger.warn("No JavaMailSender configured; logging transactional email to console. [To: {} | Subject: {}]", to, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Dispatched transactional email [Subject: '{}'] to '{}'", subject, to);
        } catch (Exception ex) {
            logger.error("Failed to send transactional email [Subject: '{}'] to '{}': {}", subject, to, ex.getMessage());
        }
    }

    private String wrapInTemplate(String preheader, String bodyContent) {
        int currentYear = Year.now().getValue();
        return "<!DOCTYPE html>"
                + "<html lang=\"en\">"
                + "<head>"
                + "  <meta charset=\"UTF-8\">"
                + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "  <title>" + escapeHtml(preheader) + "</title>"
                + "</head>"
                + "<body style=\"margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;\">"
                + "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #F1F5F9; padding: 32px 12px;\">"
                + "    <tr>"
                + "      <td align=\"center\">"
                + "        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width: 580px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;\">"
                + "          <!-- Header with Navy & Digital Cyan Accents -->"
                + "          <tr>"
                + "            <td style=\"background-color: #0B1329; padding: 28px 32px; border-bottom: 3px solid #2563EB;\">"
                + "              <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">"
                + "                <tr>"
                + "                  <td>"
                + "                    <span style=\"font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;\">PROJECT<span style=\"color: #06B6D4;\">KIT</span></span>"
                + "                    <div style=\"font-size: 11px; color: #94A3B8; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;\">Verified Student Tech Marketplace</div>"
                + "                  </td>"
                + "                </tr>"
                + "              </table>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Main Body -->"
                + "          <tr>"
                + "            <td style=\"padding: 32px;\">"
                +                bodyContent
                + "            </td>"
                + "          </tr>"
                + "          <!-- Footer -->"
                + "          <tr>"
                + "            <td style=\"background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0; text-align: center;\">"
                + "              <p style=\"margin: 0 0 8px; font-size: 11px; color: #64748B;\">"
                + "                © " + currentYear + " ProjectKit Technologies India Pvt Ltd. All rights reserved."
                + "              </p>"
                + "              <p style=\"margin: 0 0 8px; font-size: 11px; color: #94A3B8;\">"
                + "                Support: <a href=\"mailto:support@projectkit.in\" style=\"color: #2563EB; text-decoration: none;\">support@projectkit.in</a> | "
                + "                Legal: <a href=\"mailto:compliance@projectkit.in\" style=\"color: #2563EB; text-decoration: none;\">compliance@projectkit.in</a>"
                + "              </p>"
                + "              <p style=\"margin: 0; font-size: 10px; color: #94A3B8;\">"
                + "                Security: Sending domain verified via SPF, DKIM, and DMARC policies for projectkit.in."
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "₹0.00";
        try {
            NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
            return nf.format(amount);
        } catch (Exception e) {
            return "₹" + amount.toPlainString();
        }
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}

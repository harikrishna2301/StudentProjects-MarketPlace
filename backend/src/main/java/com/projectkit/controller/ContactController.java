package com.projectkit.controller;

import com.projectkit.dto.request.ContactInquiryRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.ContactInquiryResponse;
import com.projectkit.entity.ContactInquiry;
import com.projectkit.repository.ContactInquiryRepository;
import com.projectkit.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contact Desk", description = "Student academic inquiries and technical support ticket dispatch")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactInquiryRepository inquiryRepository;
    private final EmailService emailService;

    public ContactController(ContactInquiryRepository inquiryRepository, EmailService emailService) {
        this.inquiryRepository = inquiryRepository;
        this.emailService = emailService;
    }

    @PostMapping
    @Operation(summary = "Submit student support inquiry", description = "Validates and logs student technical inquiries, assigning a support ticket")
    public ResponseEntity<ApiResponse<ContactInquiryResponse>> submitInquiry(
            @Valid @RequestBody ContactInquiryRequest request,
            HttpServletRequest httpRequest
    ) {
        ContactInquiry inquiry = new ContactInquiry();
        inquiry.setFullName(request.getFullName().trim());
        inquiry.setEmail(request.getEmail().trim());
        inquiry.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        inquiry.setCollege(request.getCollege() != null ? request.getCollege().trim() : null);
        inquiry.setCategory(request.getCategory() != null ? request.getCategory().trim() : "General Support");
        inquiry.setSubject(request.getSubject().trim());
        inquiry.setMessage(request.getMessage().trim());
        inquiry.setStatus("NEW");

        if (httpRequest != null) {
            String remoteAddr = httpRequest.getHeader("X-Forwarded-For");
            if (remoteAddr == null || remoteAddr.isBlank()) {
                remoteAddr = httpRequest.getRemoteAddr();
            }
            inquiry.setIpAddress(remoteAddr);
        }

        ContactInquiry saved = inquiryRepository.save(inquiry);
        logger.info("New contact support inquiry logged with ticket #PK-INQ-{} from {}", saved.getId(), saved.getEmail());

        ContactInquiryResponse response = new ContactInquiryResponse(
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getSubject(),
                saved.getStatus(),
                saved.getCreatedAt(),
                "Thank you for contacting ProjectKit Support Desk. Your inquiry (Ticket #PK-INQ-" + saved.getId() + ") has been received. Our engineering coordinator will respond within 2-4 hours."
        );

        return ResponseEntity.ok(ApiResponse.success("Inquiry submitted successfully", response));
    }
}

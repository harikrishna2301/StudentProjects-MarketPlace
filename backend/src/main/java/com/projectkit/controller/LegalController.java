package com.projectkit.controller;

import com.projectkit.dto.request.UserConsentRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.LegalDocumentDto;
import com.projectkit.dto.response.UserConsentDto;
import com.projectkit.enums.LegalDocumentType;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.LegalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/legal")
@Tag(name = "Legal & Compliance", description = "Public legal policies, terms, cookie governance and consent recording")
public class LegalController {

    private final LegalService legalService;

    public LegalController(LegalService legalService) {
        this.legalService = legalService;
    }

    @GetMapping("/terms")
    @Operation(summary = "Get published Terms and Conditions")
    public ResponseEntity<ApiResponse<LegalDocumentDto>> getTerms() {
        LegalDocumentDto doc = legalService.getPublishedDocument(LegalDocumentType.TERMS_AND_CONDITIONS);
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/privacy")
    @Operation(summary = "Get published Privacy Policy")
    public ResponseEntity<ApiResponse<LegalDocumentDto>> getPrivacyPolicy() {
        LegalDocumentDto doc = legalService.getPublishedDocument(LegalDocumentType.PRIVACY_POLICY);
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/cookies")
    @Operation(summary = "Get published Cookie Policy")
    public ResponseEntity<ApiResponse<LegalDocumentDto>> getCookiePolicy() {
        LegalDocumentDto doc = legalService.getPublishedDocument(LegalDocumentType.COOKIE_POLICY);
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/refunds")
    @Operation(summary = "Get published Refund & Cancellation Policy")
    public ResponseEntity<ApiResponse<LegalDocumentDto>> getRefundPolicy() {
        LegalDocumentDto doc = legalService.getPublishedDocument(LegalDocumentType.REFUND_POLICY);
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/intellectual-property")
    @Operation(summary = "Get published Copyright & Intellectual Property Policy")
    public ResponseEntity<ApiResponse<LegalDocumentDto>> getIntellectualPropertyPolicy() {
        LegalDocumentDto doc = legalService.getPublishedDocument(LegalDocumentType.INTELLECTUAL_PROPERTY);
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/grievance")
    @Operation(summary = "Get published Contact & Grievance Redressal Information")
    public ResponseEntity<ApiResponse<LegalDocumentDto>> getGrievanceInfo() {
        LegalDocumentDto doc = legalService.getPublishedDocument(LegalDocumentType.GRIEVANCE_REDRESSAL);
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/documents")
    @Operation(summary = "Get all active published legal documents")
    public ResponseEntity<ApiResponse<List<LegalDocumentDto>>> getAllPublishedDocuments() {
        List<LegalDocumentDto> list = legalService.getAllPublishedDocuments();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/consent")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Record user consent to a legal policy", description = "Saves an immutable audit record with timestamp, version, and client details")
    public ResponseEntity<ApiResponse<UserConsentDto>> recordConsent(
            @Valid @RequestBody UserConsentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest servletRequest
    ) {
        if (request.getIpAddress() == null || request.getIpAddress().isBlank()) {
            request.setIpAddress(servletRequest.getRemoteAddr());
        }
        if (request.getUserAgent() == null || request.getUserAgent().isBlank()) {
            request.setUserAgent(servletRequest.getHeader("User-Agent"));
        }

        UserConsentDto dto = legalService.recordConsent(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Consent recorded successfully", dto));
    }

    @GetMapping("/consent/history")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get current user's consent history")
    public ResponseEntity<ApiResponse<List<UserConsentDto>>> getConsentHistory(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<UserConsentDto> history = legalService.getUserConsentHistory(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}

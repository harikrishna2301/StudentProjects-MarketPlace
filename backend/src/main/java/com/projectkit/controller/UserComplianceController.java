package com.projectkit.controller;

import com.projectkit.dto.request.AccountDeletionRequestDto;
import com.projectkit.dto.request.CookiePreferenceRequest;
import com.projectkit.dto.response.AccountDeletionResponseDto;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.CookiePreferenceDto;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.LegalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Privacy & Governance", description = "Cookie preferences management and account deletion requests")
public class UserComplianceController {

    private final LegalService legalService;

    public UserComplianceController(LegalService legalService) {
        this.legalService = legalService;
    }

    @GetMapping("/cookie-preferences")
    @Operation(summary = "Get user or guest cookie preferences")
    public ResponseEntity<ApiResponse<CookiePreferenceDto>> getCookiePreferences(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String sessionId
    ) {
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        CookiePreferenceDto dto = legalService.getCookiePreferences(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/cookie-preferences")
    @Operation(summary = "Update user or guest cookie preferences")
    public ResponseEntity<ApiResponse<CookiePreferenceDto>> saveCookiePreferences(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CookiePreferenceRequest request
    ) {
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        CookiePreferenceDto dto = legalService.saveCookiePreferences(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Cookie preferences saved successfully", dto));
    }

    @PostMapping("/account-deletion-request")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Submit account deletion request under DPDPA / GDPR")
    public ResponseEntity<ApiResponse<AccountDeletionResponseDto>> requestAccountDeletion(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AccountDeletionRequestDto request
    ) {
        AccountDeletionResponseDto response = legalService.requestAccountDeletion(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Account deletion request submitted for administrative review", response));
    }
}

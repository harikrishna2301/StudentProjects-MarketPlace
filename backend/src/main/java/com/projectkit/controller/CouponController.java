package com.projectkit.controller;

import com.projectkit.dto.request.CreateCouponRequest;
import com.projectkit.dto.request.ValidateCouponRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.CouponDto;
import com.projectkit.dto.response.CouponValidationResponse;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Coupons", description = "Coupon validation, discount calculation, and administrative coupon management")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/api/coupons/validate")
    @Operation(summary = "Validate coupon code", description = "Validates coupon eligibility and returns calculated discount for project kits")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(
            @Valid @RequestBody ValidateCouponRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long userId = currentUser != null ? currentUser.getId() : null;
        CouponValidationResponse validation = couponService.validateCoupon(request, userId);
        if (validation.isValid()) {
            return ResponseEntity.ok(ApiResponse.success(validation.getMessage(), validation));
        } else {
            return ResponseEntity.ok(ApiResponse.error(validation.getMessage(), validation));
        }
    }

    // =========================================================================
    // ADMIN ENDPOINTS (Restricted to ROLE_ADMIN)
    // =========================================================================

    @PostMapping("/api/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Create coupon (Admin)", description = "Allows administrators to create promotional discount coupons")
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(
            @Valid @RequestBody CreateCouponRequest request
    ) {
        CouponDto created = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created successfully", created));
    }

    @GetMapping("/api/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get all coupons (Admin)", description = "Retrieves all active and inactive coupon configurations")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getAllCoupons() {
        List<CouponDto> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @GetMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get coupon details (Admin)", description = "Retrieves configuration for a specific coupon ID")
    public ResponseEntity<ApiResponse<CouponDto>> getCouponById(@PathVariable Long id) {
        CouponDto coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.success(coupon));
    }

    @PatchMapping("/api/admin/coupons/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Update coupon active status (Admin)", description = "Enables or deactivates an existing coupon")
    public ResponseEntity<ApiResponse<CouponDto>> updateCouponStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        CouponDto updated = couponService.updateCouponStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Coupon status updated", updated));
    }

    @DeleteMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Delete or archive coupon (Admin)", description = "Removes unused coupon or deactivates historical coupon")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon removed or deactivated successfully", null));
    }
}

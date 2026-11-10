package com.projectkit.controller;

import com.projectkit.dto.request.ChangePasswordRequest;
import com.projectkit.dto.request.UpdateProfileRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.PurchasedProjectDto;
import com.projectkit.dto.response.StudentDashboardDto;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Student Account", description = "Student profile management, purchased project kits and dashboard")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get student profile", description = "Retrieves profile information for the authenticated student")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileResponse profile = studentService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update student profile", description = "Updates full name, college name, and contact phone number")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserProfileResponse updated = studentService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change password", description = "Updates account password following verification of current credentials")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        studentService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @GetMapping("/purchases")
    @Operation(summary = "Get purchased projects", description = "Returns all verified purchased project kits with authorized download links")
    public ResponseEntity<ApiResponse<List<PurchasedProjectDto>>> getPurchasedProjects(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<PurchasedProjectDto> purchases = studentService.getPurchasedProjects(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(purchases));
    }

    @GetMapping("/my-kits")
    @Operation(summary = "Get all student kits", description = "Returns all claimed free project kits and purchased paid kits")
    public ResponseEntity<ApiResponse<List<com.projectkit.dto.response.MyKitDto>>> getMyKits(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<com.projectkit.dto.response.MyKitDto> kits = studentService.getMyKits(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(kits));
    }

    @GetMapping("/projects/{projectId}/access")
    @Operation(summary = "Check project kit access entitlement", description = "Verifies if the student owns active entitlement to the specified kit")
    public ResponseEntity<ApiResponse<com.projectkit.dto.response.ProjectAccessStatusDto>> checkProjectAccess(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        com.projectkit.dto.response.ProjectAccessStatusDto status = studentService.checkProjectAccess(currentUser.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    @GetMapping("/available-free")
    @Operation(summary = "Get available free kits not yet claimed", description = "Returns active free projects the student has not yet claimed")
    public ResponseEntity<ApiResponse<List<com.projectkit.dto.response.ProjectSummaryDto>>> getAvailableFreeKits(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<com.projectkit.dto.response.ProjectSummaryDto> available = studentService.getAvailableFreeKits(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(available));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get student dashboard metrics", description = "Returns overview statistics including total purchased projects and spent amount")
    public ResponseEntity<ApiResponse<StudentDashboardDto>> getDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        StudentDashboardDto dashboard = studentService.getDashboard(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}

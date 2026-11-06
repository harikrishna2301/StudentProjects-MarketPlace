package com.projectkit.controller;

import com.projectkit.dto.request.ForgotPasswordRequest;
import com.projectkit.dto.request.LoginRequest;
import com.projectkit.dto.request.RefreshTokenRequest;
import com.projectkit.dto.request.RegisterRequest;
import com.projectkit.dto.request.ResetPasswordRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.AuthResponse;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, JWT tokens, password recovery and logout")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student account", description = "Registers a student account and returns JWT credentials")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates credentials and returns JWT access and refresh tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Generates a new access token using a valid refresh token with token rotation")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Revokes the active refresh token session")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        if (request != null && request.getRefreshToken() != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated profile", description = "Returns details of the currently authenticated user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileResponse response = authService.getCurrentUser(userPrincipal);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Sends a single-use time-bounded password reset token to user email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("If your email is registered with ProjectKit, password reset instructions have been sent.", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset account password", description = "Verifies single-use cryptographic token, updates password, and terminates other active sessions")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully. You can now log in with your new credentials.", null));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify account email address", description = "Validates the activation token sent upon student registration")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email address verified successfully. Your account is active.", null));
    }
}

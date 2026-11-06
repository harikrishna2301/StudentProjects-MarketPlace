package com.projectkit.service;

import com.projectkit.dto.request.*;
import com.projectkit.dto.response.AuthResponse;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.security.UserPrincipal;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String refreshToken);

    UserProfileResponse getCurrentUser(UserPrincipal userPrincipal);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void verifyEmail(String token);
}

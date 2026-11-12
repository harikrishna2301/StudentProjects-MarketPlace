package com.projectkit.service;

import com.projectkit.dto.request.ForgotPasswordRequest;
import com.projectkit.dto.request.LoginRequest;
import com.projectkit.dto.request.RefreshTokenRequest;
import com.projectkit.dto.request.RegisterRequest;
import com.projectkit.dto.request.ResetPasswordRequest;
import com.projectkit.dto.response.AuthResponse;
import com.projectkit.entity.PasswordResetToken;
import com.projectkit.entity.RefreshToken;
import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.PasswordResetTokenRepository;
import com.projectkit.repository.RefreshTokenRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.security.JwtTokenProvider;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private com.projectkit.service.EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("student@example.com");
        sampleUser.setFullName("John Doe");
        sampleUser.setPasswordHash("encoded_password");
        sampleUser.setRole(Role.STUDENT);
        sampleUser.setStatus(AccountStatus.ACTIVE);
    }

    @Test
    @DisplayName("Register: Valid registration should save student user and return tokens")
    void register_WhenEmailNotExists_ShouldRegisterSuccessfully() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "student@example.com",
                "Password@123",
                "IIT Bombay",
                "+91 9999999999"
        );

        when(userRepository.existsByEmail("student@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("jwt_access_token");
        when(tokenProvider.getJwtExpirationMs()).thenReturn(86400000L);
        when(tokenProvider.getRefreshExpirationMs()).thenReturn(604800000L);

        RefreshToken refreshToken = new RefreshToken(sampleUser, "uuid-refresh-token", Instant.now().plusMillis(604800000L));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt_access_token", response.getAccessToken());
        assertEquals("uuid-refresh-token", response.getRefreshToken());
        assertEquals("student@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register: Duplicate email should throw BadRequestException")
    void register_WhenEmailAlreadyExists_ShouldThrowBadRequest() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "student@example.com",
                "Password@123",
                "IIT Bombay",
                "+91 9999999999"
        );

        when(userRepository.existsByEmail("student@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login: Valid credentials should authenticate and issue access + refresh tokens")
    void login_WithValidCredentials_ShouldReturnAuthResponse() {
        LoginRequest request = new LoginRequest("student@example.com", "Password@123");
        UserPrincipal userPrincipal = UserPrincipal.create(sampleUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("jwt_access_token");
        when(tokenProvider.getJwtExpirationMs()).thenReturn(86400000L);
        when(tokenProvider.getRefreshExpirationMs()).thenReturn(604800000L);

        RefreshToken refreshToken = new RefreshToken(sampleUser, "uuid-refresh-token", Instant.now().plusMillis(604800000L));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt_access_token", response.getAccessToken());
        assertEquals("student@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Login: Invalid credentials should throw BadCredentialsException")
    void login_WithInvalidCredentials_ShouldThrowBadCredentialsException() {
        LoginRequest request = new LoginRequest("student@example.com", "WrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(userRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Refresh Token: Valid token should rotate and return new refresh token + access token")
    void refreshToken_WithValidToken_ShouldRotateAndReturnNewTokens() {
        RefreshToken oldToken = new RefreshToken(sampleUser, "valid-refresh-token", Instant.now().plusSeconds(3600));
        oldToken.setRevoked(false);

        when(refreshTokenRepository.findByToken("valid-refresh-token")).thenReturn(Optional.of(oldToken));
        when(tokenProvider.getRefreshExpirationMs()).thenReturn(604800000L);
        when(tokenProvider.getJwtExpirationMs()).thenReturn(86400000L);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("new_access_token");

        RefreshToken newRefreshToken = new RefreshToken(sampleUser, "new-rotated-refresh-token", Instant.now().plusMillis(604800000L));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(newRefreshToken);

        AuthResponse response = authService.refreshToken(new RefreshTokenRequest("valid-refresh-token"));

        assertNotNull(response);
        assertEquals("new_access_token", response.getAccessToken());
        assertTrue(oldToken.isRevoked(), "Old refresh token must be marked as revoked during rotation");
        verify(refreshTokenRepository, atLeastOnce()).save(oldToken);
    }

    @Test
    @DisplayName("Refresh Token: Reusing revoked token should trigger reuse detection and invalidate user sessions")
    void refreshToken_WithRevokedToken_ShouldTriggerReuseDetectionAndRevokeAllUserSessions() {
        RefreshToken revokedToken = new RefreshToken(sampleUser, "revoked-token", Instant.now().plusSeconds(3600));
        revokedToken.setRevoked(true);

        when(refreshTokenRepository.findByToken("revoked-token")).thenReturn(Optional.of(revokedToken));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class,
                () -> authService.refreshToken(new RefreshTokenRequest("revoked-token")));

        assertTrue(ex.getMessage().contains("Security Alert: Refresh token has already been used and revoked"));
        verify(refreshTokenRepository, times(1)).deleteByUser(sampleUser);
    }

    @Test
    @DisplayName("Refresh Token: Expired token should be deleted and throw UnauthorizedException")
    void refreshToken_WithExpiredToken_ShouldDeleteAndThrowUnauthorized() {
        RefreshToken expiredToken = new RefreshToken(sampleUser, "expired-token", Instant.now().minusSeconds(100));

        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expiredToken));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class,
                () -> authService.refreshToken(new RefreshTokenRequest("expired-token")));

        assertTrue(ex.getMessage().contains("expired"));
        verify(refreshTokenRepository, times(1)).delete(expiredToken);
    }

    @Test
    @DisplayName("Forgot Password: Valid email should generate hashed reset token")
    void forgotPassword_WhenUserExists_ShouldSaveHashedResetToken() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(sampleUser));

        authService.forgotPassword(new ForgotPasswordRequest("student@example.com"));

        verify(passwordResetTokenRepository, times(1)).invalidateAllActiveTokensForUser(1L);
        verify(passwordResetTokenRepository, times(1)).save(any(PasswordResetToken.class));
    }

    @Test
    @DisplayName("Reset Password: Valid token should update password and invalidate refresh tokens")
    void resetPassword_WithValidToken_ShouldUpdatePasswordAndRevokeSessions() {
        PasswordResetToken resetToken = new PasswordResetToken(
                sampleUser,
                "hashed_token_value",
                LocalDateTime.now().plusMinutes(15)
        );

        when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode("NewSecretPassword@123")).thenReturn("new_encoded_password");

        authService.resetPassword(new ResetPasswordRequest("plain-token", "NewSecretPassword@123"));

        assertTrue(resetToken.isUsed(), "Password reset token must be marked as used");
        assertEquals("new_encoded_password", sampleUser.getPasswordHash());
        verify(passwordResetTokenRepository, times(1)).save(resetToken);
        verify(userRepository, times(1)).save(sampleUser);
        verify(refreshTokenRepository, times(1)).deleteByUser(sampleUser);
    }

    @Test
    @DisplayName("Reset Password: Expired token should throw BadRequestException")
    void resetPassword_WithExpiredToken_ShouldThrowBadRequest() {
        PasswordResetToken expiredToken = new PasswordResetToken(
                sampleUser,
                "hashed_token_value",
                LocalDateTime.now().minusMinutes(5)
        );

        when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.of(expiredToken));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> authService.resetPassword(new ResetPasswordRequest("plain-token", "NewPassword@123")));

        assertTrue(ex.getMessage().contains("expired"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Reset Password: Reusing already used token should throw BadRequestException")
    void resetPassword_WithAlreadyUsedToken_ShouldThrowBadRequest() {
        PasswordResetToken usedToken = new PasswordResetToken(
                sampleUser,
                "hashed_token_value",
                LocalDateTime.now().plusMinutes(10)
        );
        usedToken.setUsed(true);

        when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.of(usedToken));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> authService.resetPassword(new ResetPasswordRequest("plain-token", "NewPassword@123")));

        assertTrue(ex.getMessage().contains("already been used"));
        verify(userRepository, never()).save(any(User.class));
    }
}

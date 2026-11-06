package com.projectkit.service.impl;

import com.projectkit.dto.request.*;
import com.projectkit.dto.response.AuthResponse;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.entity.PasswordResetToken;
import com.projectkit.entity.RefreshToken;
import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.PasswordResetTokenRepository;
import com.projectkit.repository.RefreshTokenRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.security.JwtTokenProvider;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final com.projectkit.service.EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           RefreshTokenRepository refreshTokenRepository,
                           PasswordResetTokenRepository passwordResetTokenRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           com.projectkit.service.EmailService emailService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email address is already in use: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setCollegeName(request.getCollegeName() != null ? request.getCollegeName().trim() : null);
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        // Enforce student role by default; prevent privilege escalation
        user.setRole(Role.STUDENT);
        user.setStatus(AccountStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        UserPrincipal userPrincipal = UserPrincipal.create(savedUser);

        String accessToken = tokenProvider.generateAccessToken(userPrincipal);
        RefreshToken refreshToken = createRefreshToken(savedUser);

        try {
            String verificationToken = UUID.randomUUID().toString();
            emailService.sendAccountVerificationEmail(savedUser.getEmail(), savedUser.getFullName(), verificationToken);
        } catch (Exception ex) {
            logger.warn("Could not dispatch account verification email for user {}: {}", savedUser.getEmail(), ex.getMessage());
        }

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getJwtExpirationMs() / 1000,
                UserProfileResponse.fromUser(savedUser)
        );
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new UnauthorizedException("Your account has been deactivated or suspended. Please contact support.");
        }

        String accessToken = tokenProvider.generateAccessToken(userPrincipal);
        RefreshToken refreshToken = createRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getJwtExpirationMs() / 1000,
                UserProfileResponse.fromUser(user)
        );
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String rawToken = request.getRefreshToken();
        if (rawToken == null || rawToken.isBlank()) {
            throw new UnauthorizedException("Refresh token is required.");
        }

        RefreshToken token = refreshTokenRepository.findByToken(rawToken.trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token."));

        // 1. Refresh Token Reuse Detection
        if (token.isRevoked()) {
            // Compromised token reuse! Immediately revoke all sessions for this user family
            refreshTokenRepository.deleteByUser(token.getUser());
            logger.warn("Security Alert: Reused revoked refresh token for user {}. All active sessions invalidated.", token.getUser().getEmail());
            throw new UnauthorizedException("Security Alert: Refresh token has already been used and revoked. All active sessions invalidated.");
        }

        // 2. Token Expiration Check
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        User user = token.getUser();
        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive or suspended.");
        }

        // 3. Refresh Token Rotation
        // Mark current token revoked
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Issue new refresh token
        RefreshToken newRefreshToken = new RefreshToken(
                user,
                UUID.randomUUID().toString(),
                Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs())
        );
        refreshTokenRepository.save(newRefreshToken);

        // Generate new access token
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(userPrincipal);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken.getToken(),
                tokenProvider.getJwtExpirationMs() / 1000,
                UserProfileResponse.fromUser(user)
        );
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByToken(refreshToken.trim())
                    .ifPresent(refreshTokenRepository::delete);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
        return UserProfileResponse.fromUser(user);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getStatus() == AccountStatus.ACTIVE) {
                // Invalidate any existing unused reset tokens for this user
                passwordResetTokenRepository.invalidateAllActiveTokensForUser(user.getId());

                // Generate secure random plain token
                String plainToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
                // Store only SHA-256 hash in database
                String hashedToken = sha256Hex(plainToken);

                // 15-minute token expiration
                LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);
                PasswordResetToken resetToken = new PasswordResetToken(user, hashedToken, expiry);
                passwordResetTokenRepository.save(resetToken);

                try {
                    emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), plainToken);
                } catch (Exception ex) {
                    logger.warn("Could not dispatch password reset email for user {}: {}", user.getEmail(), ex.getMessage());
                }

                logger.info("Password reset token generated and email dispatched for user: {}", user.getEmail());
            }
        }
        // Always complete successfully to prevent email enumeration timing attacks
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String hashedToken = sha256Hex(request.getToken().trim());

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(hashedToken)
                .orElseThrow(() -> new BadRequestException("Invalid or already used password reset token."));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Password reset token has already been used.");
        }

        if (resetToken.isExpired()) {
            throw new BadRequestException("Password reset token has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new UnauthorizedException("Account is not active.");
        }

        // Mark reset token as used (single-use constraint)
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Update password with BCrypt
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidate all active refresh tokens/sessions after password reset
        refreshTokenRepository.deleteByUser(user);
        logger.info("Password successfully reset and all sessions terminated for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        // Placeholder for future dedicated email verification link logic
        logger.info("Email verification processed");
    }

    private RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken(
                user,
                UUID.randomUUID().toString(),
                Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs())
        );

        return refreshTokenRepository.save(refreshToken);
    }

    private String sha256Hex(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available in JVM", e);
        }
    }
}

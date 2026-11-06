package com.projectkit.security;

import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenSecurityTest {

    private JwtTokenProvider tokenProvider;
    private UserPrincipal samplePrincipal;

    private static final String SECURE_TEST_SECRET = "super_secure_jwt_secret_key_for_testing_purposes_at_least_256_bits_length!";

    @BeforeEach
    void setUp() {
        // 1 hour access token validity
        tokenProvider = new JwtTokenProvider(SECURE_TEST_SECRET, 3600000L, 604800000L);

        User user = new User();
        user.setId(42L);
        user.setEmail("student@test.com");
        user.setFullName("Aarav Patel");
        user.setPasswordHash("hashed_pwd");
        user.setRole(Role.STUDENT);
        user.setStatus(AccountStatus.ACTIVE);

        samplePrincipal = UserPrincipal.create(user);
    }

    @Test
    @DisplayName("TASK 6: Valid JWT should be successfully parsed, verified and extract claims")
    void testValidJwtToken() {
        String token = tokenProvider.generateAccessToken(samplePrincipal);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("student@test.com", tokenProvider.getUsernameFromJwt(token));
        assertEquals(42L, tokenProvider.getUserIdFromJwt(token));
    }

    @Test
    @DisplayName("TASK 6: Tampered / Invalid JWT signature must fail validation")
    void testInvalidJwtSignature() {
        String token = tokenProvider.generateAccessToken(samplePrincipal);
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        assertFalse(tokenProvider.validateToken(tamperedToken));
    }

    @Test
    @DisplayName("TASK 6: Expired JWT token must be rejected during validation")
    void testExpiredJwtToken() {
        // Construct token provider with -1000ms expiration (already expired)
        JwtTokenProvider expiredProvider = new JwtTokenProvider(SECURE_TEST_SECRET, -1000L, -1000L);
        String expiredToken = expiredProvider.generateAccessToken(samplePrincipal);

        assertFalse(tokenProvider.validateToken(expiredToken));
    }

    @Test
    @DisplayName("TASK 6: Completely malformed or empty token must fail validation")
    void testMalformedJwtToken() {
        assertFalse(tokenProvider.validateToken("not.a.valid.jwt.token"));
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken("   "));
    }
}

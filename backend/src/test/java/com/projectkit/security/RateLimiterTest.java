package com.projectkit.security;

import com.projectkit.security.ratelimit.InMemoryRateLimiter;
import com.projectkit.security.ratelimit.RateLimitFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

public class RateLimiterTest {

    private InMemoryRateLimiter rateLimiter;
    private RateLimitFilter rateLimitFilter;

    @BeforeEach
    void setUp() {
        rateLimiter = new InMemoryRateLimiter();
        rateLimitFilter = new RateLimitFilter(rateLimiter);
    }

    @Test
    @DisplayName("TASK 5 & 6: RateLimiter allows requests within max allowance and throttles when exceeded")
    void testRateLimiterDirectAcquire() {
        String clientIp = "192.168.1.100";
        int maxRequests = 5;
        long windowMs = 60_000L;

        for (int i = 0; i < maxRequests; i++) {
            assertTrue(rateLimiter.tryAcquire(clientIp, maxRequests, windowMs), "Request " + (i + 1) + " should be allowed");
        }

        // 6th request exceeds limit
        assertFalse(rateLimiter.tryAcquire(clientIp, maxRequests, windowMs), "Request 6 should be rejected");

        // Reset clears records
        rateLimiter.reset(clientIp);
        assertTrue(rateLimiter.tryAcquire(clientIp, maxRequests, windowMs), "Request after reset should be allowed");
    }

    @Test
    @DisplayName("TASK 5 & 6: RateLimitFilter returns HTTP 429 Too Many Requests on excessive POST /api/auth/login")
    void testLoginEndpointRateLimiting() throws Exception {
        String clientIp = "203.0.113.15";

        // First 5 attempts allowed
        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr(clientIp);
            MockHttpServletResponse response = new MockHttpServletResponse();
            FilterChain filterChain = new MockFilterChain();

            rateLimitFilter.doFilter(request, response, filterChain);
            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        }

        // 6th attempt should be blocked with 429 Too Many Requests
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr(clientIp);
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = new MockFilterChain();

        rateLimitFilter.doFilter(request, response, filterChain);

        assertEquals(429, response.getStatus());
        assertEquals("60", response.getHeader("Retry-After"));
        assertTrue(response.getContentAsString().contains("Too many login attempts"));
    }

    @Test
    @DisplayName("TASK 5 & 6: RateLimitFilter returns HTTP 429 on excessive POST /api/auth/register")
    void testRegisterEndpointRateLimiting() throws Exception {
        String clientIp = "203.0.113.20";

        // Registration limit is 3 per minute
        for (int i = 0; i < 3; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/register");
            request.setRemoteAddr(clientIp);
            MockHttpServletResponse response = new MockHttpServletResponse();
            FilterChain filterChain = new MockFilterChain();

            rateLimitFilter.doFilter(request, response, filterChain);
            assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        }

        // 4th attempt blocked
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/register");
        request.setRemoteAddr(clientIp);
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = new MockFilterChain();

        rateLimitFilter.doFilter(request, response, filterChain);

        assertEquals(429, response.getStatus());
        assertTrue(response.getContentAsString().contains("Too many registration attempts"));
    }
}

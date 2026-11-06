package com.projectkit.security.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimiter rateLimiter;

    // Default rate limits per client IP
    private static final int MAX_LOGIN_ATTEMPTS = 5;          // 5 attempts per minute
    private static final int MAX_REGISTER_ATTEMPTS = 3;       // 3 attempts per minute
    private static final int MAX_PASSWORD_RESET_ATTEMPTS = 3;  // 3 attempts per minute
    private static final long WINDOW_MS = 60_000L;            // 1 minute (60,000 ms)

    public RateLimitFilter(RateLimiter rateLimiter) {
        this.rateLimiter = rateLimiter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method)) {
            String clientIp = resolveClientIp(request);

            if (path.equals("/api/auth/login")) {
                String key = "login:" + clientIp;
                if (!rateLimiter.tryAcquire(key, MAX_LOGIN_ATTEMPTS, WINDOW_MS)) {
                    sendRateLimitExceededResponse(response, "Too many login attempts. Please wait 60 seconds before trying again.");
                    return;
                }
            } else if (path.equals("/api/auth/register")) {
                String key = "register:" + clientIp;
                if (!rateLimiter.tryAcquire(key, MAX_REGISTER_ATTEMPTS, WINDOW_MS)) {
                    sendRateLimitExceededResponse(response, "Too many registration attempts. Please wait 60 seconds before trying again.");
                    return;
                }
            } else if (path.startsWith("/api/auth/forgot-password") || path.startsWith("/api/auth/reset-password")) {
                String key = "reset:" + clientIp;
                if (!rateLimiter.tryAcquire(key, MAX_PASSWORD_RESET_ATTEMPTS, WINDOW_MS)) {
                    sendRateLimitExceededResponse(response, "Too many password reset attempts. Please wait 60 seconds.");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }

    private void sendRateLimitExceededResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429 Too Many Requests
        response.setHeader("Retry-After", "60");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String json = String.format("{\"success\":false,\"message\":\"%s\",\"data\":null}", message);
        response.getWriter().write(json);
    }
}

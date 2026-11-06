package com.projectkit.security.ratelimit;

public interface RateLimiter {
    /**
     * Attempts to consume one request token for the given client key within the time window.
     *
     * @param key         Client identifier (e.g. client IP or composite user key)
     * @param maxRequests Maximum allowed requests within window
     * @param windowMs    Window duration in milliseconds
     * @return true if request is allowed, false if limit exceeded
     */
    boolean tryAcquire(String key, int maxRequests, long windowMs);

    /**
     * Resets / clears recorded attempts for a specific key (e.g. after successful login).
     */
    void reset(String key);
}

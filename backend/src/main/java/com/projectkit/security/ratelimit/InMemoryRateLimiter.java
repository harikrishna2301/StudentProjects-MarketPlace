package com.projectkit.security.ratelimit;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class InMemoryRateLimiter implements RateLimiter {

    // Key -> queue of timestamps (milliseconds)
    private final ConcurrentHashMap<String, ConcurrentLinkedQueue<Long>> requestLogs = new ConcurrentHashMap<>();

    @Override
    public boolean tryAcquire(String key, int maxRequests, long windowMs) {
        long now = System.currentTimeMillis();
        long windowStart = now - windowMs;

        ConcurrentLinkedQueue<Long> timestamps = requestLogs.computeIfAbsent(key, k -> new ConcurrentLinkedQueue<>());

        synchronized (timestamps) {
            // Evict timestamps older than current window
            while (!timestamps.isEmpty() && timestamps.peek() < windowStart) {
                timestamps.poll();
            }

            if (timestamps.size() < maxRequests) {
                timestamps.add(now);
                return true;
            } else {
                return false;
            }
        }
    }

    @Override
    public void reset(String key) {
        requestLogs.remove(key);
    }

    /**
     * Periodic or memory hygiene cleanup for expired entries
     */
    public void cleanExpiredEntries(long maxWindowMs) {
        long threshold = System.currentTimeMillis() - maxWindowMs;
        requestLogs.entrySet().removeIf(entry -> {
            ConcurrentLinkedQueue<Long> queue = entry.getValue();
            synchronized (queue) {
                while (!queue.isEmpty() && queue.peek() < threshold) {
                    queue.poll();
                }
                return queue.isEmpty();
            }
        });
    }
}

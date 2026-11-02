package com.projectkit.controller;

import com.projectkit.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Health & Diagnostics Endpoint for Initial Verification
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        Map<String, String> healthData = Map.of(
            "status", "UP",
            "service", "ProjectKit Backend",
            "javaVersion", System.getProperty("java.version"),
            "environment", "Development"
        );
        return ResponseEntity.ok(ApiResponse.success("ProjectKit API is online and healthy", healthData));
    }
}

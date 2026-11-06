package com.projectkit.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Liveness and Readiness Health Probes for Hosting Platforms")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    @Operation(summary = "Health probe", description = "Verifies application liveness and database connectivity")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());
        response.put("application", "projectkit-backend");
        response.put("version", "1.0.0");

        boolean dbConnected = false;
        try (Connection connection = dataSource.getConnection()) {
            dbConnected = connection.isValid(2);
        } catch (Exception ex) {
            response.put("databaseError", ex.getMessage());
        }

        response.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");

        if (!dbConnected) {
            response.put("status", "DEGRADED");
            return ResponseEntity.status(503).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/liveness")
    @Operation(summary = "Liveness probe", description = "Quick lightweight check for container orchestrators")
    public ResponseEntity<Map<String, String>> liveness() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString()
        ));
    }
}

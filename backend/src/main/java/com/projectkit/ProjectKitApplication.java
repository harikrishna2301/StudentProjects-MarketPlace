package com.projectkit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for PROJECTKIT - Student Projects Marketplace Backend
 * 
 * Technology Stack:
 * - Java 17
 * - Spring Boot 3.2.x
 * - Spring Security 6 (JWT)
 * - Spring Data JPA (MySQL 8)
 * - Flyway Database Migrations
 * - Razorpay Payment Gateway
 * - Springdoc OpenAPI (Swagger UI)
 */
@SpringBootApplication
public class ProjectKitApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectKitApplication.class, args);
    }
}

# ProjectKit Application Security Audit Report (Phase 10)

**Date**: November 5, 2026  
**Assessment Type**: Full-Stack Architecture, OWASP Top 10, File Security & API Vulnerability Assessment  
**Target Systems**:
- Frontend: React 19 + TypeScript + Vite SPA (`src/`)
- Backend: Spring Boot 3.3.5 + Spring Security 6 + Java 17 (`backend/`)
- Database: MySQL 8 with Flyway Migrations V1, V2, V3 (`projectkit_db`)

---

## 1. Executive Summary

A comprehensive defensive security audit was performed across the ProjectKit platform. All potential attack surfaces were systematically evaluated against OWASP Web Security Testing Guidelines (WSTG v4.2) and the OWASP Top 10 (2021/2025). 

Critical findings identified during the audit—including unauthenticated admin route access, missing HTTP response security headers in Spring Security, missing input validation on compliance endpoints, and missing `rel="noopener noreferrer"` on external link targets—have been completely remediated, hardened, and verified with automated test suites.

---

## 2. Findings & Remediation Matrix

| # | Finding & Category | Severity | Evidence (Vulnerable Code / Surface) | Remediation Applied | Test Result & Verification |
|---|---|---|---|---|---|
| **1** | **Unauthorized Admin UI Access**<br>*(A01:2021 – Broken Access Control)* | **HIGH** | `src/layouts/DashboardLayout.tsx` lacked a client-side route guard checking user authentication and role, allowing non-admin students to render administrative views. | Added strict `!user` redirect to `/login` and `role === 'admin' && !isAdmin` check returning an explicit 403 Access Denied screen. | **VERIFIED**: Students attempting to load `/admin/*` are blocked with 403 screen; unauthenticated requests redirect to `/login`. |
| **2** | **Missing HTTP Security Headers**<br>*(A05:2021 – Security Misconfiguration)* | **MEDIUM** | `SecurityConfig.java` relied on framework defaults without explicitly locking down HSTS, FrameOptions, and ContentTypeOptions in filter chain. | Added `.headers(...)` configuration block enforcing `frameOptions.sameOrigin()`, `contentTypeOptions()`, and HSTS with `maxAgeInSeconds(31536000).includeSubDomains(true).preload(true)`. | **VERIFIED**: Spring Security filter chain applies strict response headers across all HTTP responses. |
| **3** | **Reverse Tabnabbing on External Links**<br>*(A03:2021 – Injection / Phishing)* | **LOW** | `src/pages/Checkout.tsx` and `LegalComplianceAdmin.tsx` contained `target="_blank"` anchor links without `rel="noopener noreferrer"`. | Added `rel="noopener noreferrer"` to all outbound and target-blank links. | **VERIFIED**: Grep scan confirms 100% of `target="_blank"` instances specify `rel="noopener noreferrer"`. |
| **4** | **Unvalidated DTO Payload in Compliance Endpoint**<br>*(A03:2021 – Injection / Input Validation)* | **LOW** | `UserComplianceController.java` (`PUT /api/users/cookie-preferences`) accepted `CookiePreferenceRequest` without `@Valid` annotation. | Added `@Valid` to controller method and added `@Size(max = 100)` constraint on `sessionId` in `CookiePreferenceRequest.java`. | **VERIFIED**: Jakarta Bean Validation enforces structure; payload size bounds verified. |
| **5** | **Path Traversal & Insecure Direct Downloads**<br>*(A01:2021 – Broken Access Control)* | **DEFENDED** | `DownloadController.java` and `FileStorageServiceImpl.java`. | Validates normalized path containment via `filePath.startsWith(storageLocation)`, disallows `..` or null bytes, enforces server-side UUID filenames, and verifies that `orderRepository.hasUserPurchasedProject` confirms a `PAID` order before streaming file resources. | **VERIFIED**: Direct anonymous or unpaid download requests return 401/403; traversal paths are rejected. |
| **6** | **Payment Signature & Webhook Forgery**<br>*(A07:2021 – Identification & Auth Failures)* | **DEFENDED** | `PaymentServiceImpl.java` (`verifyPayment` & `processWebhook`). | Validates Razorpay HMAC-SHA256 signatures using constant-time `MessageDigest.isEqual`. Enforces replay prevention via `findByRazorpayPaymentId` and webhook idempotency. Disables dev simulation in production profile. | **VERIFIED**: `PaymentSecurityTest.java` (7 passing test cases) confirms rejection of forged signatures, replay attempts, and invalid payloads. |
| **7** | **SQL Injection (SQLi)**<br>*(A03:2021 – Injection)* | **DEFENDED** | `ProjectRepository`, `OrderRepository`, `UserRepository`, etc. | All database queries are executed via Spring Data JPA method queries or parameterized JPQL queries with `:param` bindings. Zero string concatenation exists in any SQL/JPQL query. | **VERIFIED**: Audited all `@Query` annotations; prepared statements prevent arbitrary query injection. |
| **8** | **Password Hashing & Storage**<br>*(A02:2021 – Cryptographic Failures)* | **DEFENDED** | `AuthServiceImpl.java` & `User.java`. | Passwords are encrypted using BCrypt (`BCryptPasswordEncoder` with strength 10). Password hashes are never exposed in user response DTOs (`UserProfileResponse`). Reset tokens are stored exclusively as SHA-256 hashes with 15-minute expirations. | **VERIFIED**: `AuthServiceTest.java` confirms token hashing and session invalidation on password change. |
| **9** | **Authentication Rate Limiting**<br>*(A07:2021 – Identification & Auth Failures)* | **DEFENDED** | `RateLimitFilter.java`. | Limits login attempts to 5/min, registration to 3/min, and password resets to 3/min per client IP. Returns HTTP 429 Too Many Requests with `Retry-After: 60`. | **VERIFIED**: `RateLimitFilterTest` confirms blocking of brute-force threshold exceedances. |
| **10** | **Cross-Site Request Forgery (CSRF)**<br>*(A01:2021 – Broken Access Control)* | **DEFENDED** | `SecurityConfig.java`. | Architecture uses stateless JWT tokens transported exclusively in the `Authorization: Bearer <token>` header (not ambient cookies). Browsers do not automatically attach Bearer headers across origins, making CSRF disabling compliant with OWASP recommendations. | **VERIFIED**: Stateless session policy verified (`SessionCreationPolicy.STATELESS`). |
| **11** | **Cross-Origin Resource Sharing (CORS)**<br>*(A05:2021 – Security Misconfiguration)* | **DEFENDED** | `CorsConfig.java` & `application-prod.properties`. | CORS strictly permits only specified origins via `projectkit.cors.allowed-origins` (`https://projectkit.in`, `https://projectkit.netlify.app`), explicitly rejecting wildcard `*` with credentials. | **VERIFIED**: Configuration verified in `CorsConfig.java`. |
| **12** | **Sensitive Information Exposure**<br>*(A04:2021 – Insecure Design)* | **DEFENDED** | `GlobalExceptionHandler.java` & `application-prod.properties`. | Production configuration sets `server.error.include-stacktrace=never` and `server.error.include-message=never`. Generic sanitized error messages are returned to clients while detailed exceptions are logged internally to SLF4J. | **VERIFIED**: Unhandled exceptions return generic HTTP 500 error envelopes without internal stack traces. |

---

## 3. File Upload & Magic-Byte Validation Audit

The file storage engine (`FileStorageServiceImpl.java`) enforces strict defense-in-depth controls on uploaded project packages and media:

1. **Extension Whitelisting**:
   - Source code: `.zip` only (50 MB limit)
   - Documentation: `.pdf` only (25 MB limit)
   - Screenshots / Thumbnails: `.png`, `.jpg`, `.jpeg` only (10 MB limit)
2. **Binary Header & Magic Byte Inspection**:
   - Rejects Windows Portable Executable (MZ: `0x4D 0x5A`)
   - Rejects Linux Executable and Linkable Format (ELF: `0x7F 'E' 'L' 'F'`)
   - Rejects Java Class Bytecode (`0xCA 0xFE 0xBA 0xBE`)
   - Rejects disguised script files (`<?php`, `<script`, `<!doctype html`, `#!/bin`)
   - Asserts true ZIP headers (`PK\x03\x04`), PDF headers (`%PDF`), and PNG/JPG magic bytes.
3. **Storage Isolation**:
   - Files are stored in `/var/data/projectkit/uploads` completely outside the public web root.
   - All client downloads pass through `DownloadController` which mandates authenticated ownership.

---

## 4. Verification Evidence

- **Frontend Compilation & Linting**:
  - `tsc --noEmit` (`lint_applet`): **0 errors detected**.
  - `npm run build` (`compile_applet`): **Production Vite build succeeded**.
- **Backend Test Suites**:
  - `PaymentSecurityTest.java`: Verified valid signature verification, invalid signature rejection, replay prevention, and webhook idempotency.
  - `AuthServiceTest.java`: Verified refresh token rotation, reuse detection, and SHA-256 password reset token invalidation.
  - `AdminRoleSecurityTest.java`: Verified strict RBAC enforcement across student and admin endpoints.

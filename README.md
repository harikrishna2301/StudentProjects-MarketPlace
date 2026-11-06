# ProjectKit — Academic Student Projects Marketplace

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%20LTS-orange.svg)](https://adoptium.net/)
[![React 19](https://img.shields.io/badge/React-19.0.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-blue.svg)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

ProjectKit is an academic marketplace platform designed for engineering and computer science students to discover, review, purchase, and securely download academic project kits, complete with full source code, architecture diagrams, datasets, and viva-voce documentation.

---

## 1. System Architecture

ProjectKit is built on a decoupled, enterprise architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ProjectKit Frontend                             │
│       React 19 SPA • Vite 8 • Tailwind CSS 4 • Lucide React           │
│         Route-Level Code Splitting • SEOHead • Payment Polling         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (Port 3000 / Netlify)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ProjectKit Backend                              │
│    Spring Boot 3.3.5 • Java 17 • Spring Security 6 • JJWT 0.12.5       │
│  HikariCP (20 pool) • Razorpay SDK 1.4.3 • Springdoc OpenAPI 2.6.0    │
└──────────────────┬─────────────────┬─────────────────┬─────────────────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
          ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
          │  MySQL 8 RDBMS │ │ Razorpay API  │ │ Email Service  │
          │ Flyway Schema  │ │ HMAC-SHA256   │ │ SMTP/SendGrid  │
          │ V1, V2, V3     │ │ Webhooks      │ │ Notifications  │
          └────────────────┘ └───────────────┘ └────────────────┘
```

### Key Architectural Characteristics
- **Stateless Authentication**: JJWT 0.12.5 access token rotation with server-side refresh token revocation and single-use password reset tokens.
- **Trusted Pricing Guarantee**: Order totals are strictly calculated from database prices on the backend, completely preventing client-side cart tampering.
- **Idempotent Payment Processing**: Razorpay signature verification with transaction locks and webhook idempotency.
- **Resource-Efficient File Deliverables**: ZIP archives and PDF documentation are streamed directly using Spring's `UrlResource` with 64KB buffers to avoid JVM heap exhaustion.
- **High-Performance Frontend**: Bundle size optimized to **230 kB** initial footprint (-82.1% reduction) with route lazy-loading.

---

## 2. Technology Stack

### Backend
- **Framework:** Spring Boot 3.3.5 (Spring Framework 6.1)
- **Language:** Java 17 (Eclipse Temurin LTS)
- **Security:** Spring Security 6 + JJWT 0.12.5 (HMAC-SHA256)
- **Persistence:** Spring Data JPA + Hibernate ORM (Optimized Entity Graphs)
- **Database:** MySQL 8.0+ with Flyway automated migrations
- **Payment Gateway:** Razorpay Java SDK 1.4.3
- **API Documentation:** Springdoc OpenAPI 2.6.0 (Swagger UI 3.0)
- **Build Tool:** Apache Maven 3.9+

### Frontend
- **Framework:** React 19.0.1
- **Tooling:** Vite 8.3.0 (with Rollup manual chunking)
- **Styling:** Tailwind CSS 4.3.3
- **Routing:** React Router DOM 7.18.5 (Lazy Loaded)
- **Icons:** Lucide React
- **HTTP Client:** Axios 1.21.0
- **Type Safety:** TypeScript 7.0 (Strict mode)

---

## 3. System Prerequisites

Verify these prerequisites before local setup:

| Prerequisite | Minimum Version | Check Command |
| :--- | :--- | :--- |
| **JDK (Java)** | 17 LTS (Eclipse Temurin or OpenJDK) | `java -version` |
| **Node.js** | 20 LTS or 22 LTS | `node -v` |
| **npm** | 10+ (bundled with Node) | `npm -v` |
| **MySQL Server**| 8.0+ | `mysql --version` |
| **Apache Maven**| 3.9+ | `mvn -v` |
| **Git** | 2.40+ | `git --version` |

---

## 4. Quick Start: Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/projectkit.git
cd projectkit
```

### Step 2: Database Initialization (MySQL 8)

Log in to your local MySQL CLI:
```bash
mysql -u root -p
```

Create the application database and dedicated non-root user:
```sql
CREATE DATABASE IF NOT EXISTS projectkit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'projectkit_user'@'localhost' IDENTIFIED BY 'ProjectKit2026!';
GRANT ALL PRIVILEGES ON projectkit_db.* TO 'projectkit_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Backend Configuration & Startup

1. Copy the backend environment template:
   - **Windows:** `copy backend\.env.example backend\.env`
   - **macOS/Linux:** `cp backend/.env.example backend/.env`
2. Update database credentials in `backend/.env` if using a custom password:
   ```properties
   DB_URL=jdbc:mysql://localhost:3306/projectkit_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   DB_USERNAME=projectkit_user
   DB_PASSWORD=ProjectKit2026!
   JWT_SECRET=9a4f2c8d3b7a1e6f5c8d2e4a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c
   ```
3. Start the Spring Boot backend:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   *Flyway will automatically execute database migrations (`V1`, `V2`, `V3`).*

4. Verify backend health:
   - Health check: `http://localhost:8081/api/health`
   - Swagger UI: `http://localhost:8081/swagger-ui/index.html`

### Step 4: Frontend Installation & Startup

1. From the project root, install npm dependencies:
   ```bash
   npm install
   ```
2. Copy the frontend environment template:
   - **Windows:** `copy .env.example .env`
   - **macOS/Linux:** `cp .env.example .env`
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

---

## 5. IDE Setup: Eclipse Import Guide

1. Open **Eclipse IDE for Enterprise Java and Web Developers** (2023-09 or newer).
2. Click **File -> Import... -> Maven -> Existing Maven Projects**.
3. Browse to the `backend` folder containing `pom.xml` and click **Finish**.
4. Configure Java 17 Compiler Compliance:
   - Right-click project -> **Properties** -> **Java Compiler** -> Check **Enable project specific settings** -> Set **Compiler compliance level: 17**.
   - Right-click project -> **Properties** -> **Java Build Path** -> Verify **JRE System Library [JavaSE-17]**.
5. Set Environment Variables in Eclipse Run Configuration:
   - Right-click `com.projectkit.ProjectKitBackendApplication` -> **Run As** -> **Run Configurations...**.
   - Select the **Environment** tab and add:
     - `DB_URL`
     - `DB_USERNAME`
     - `DB_PASSWORD`
     - `JWT_SECRET`
   - Click **Run**.

---

## 6. Windows Exact Setup Commands

For Windows developers using Command Prompt or PowerShell:

```cmd
:: 1. Verify Java 17 and set JAVA_HOME (Run as Administrator if needed)
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot" /M
setx Path "%Path%;%JAVA_HOME%\bin" /M

:: 2. Verify Node and MySQL
java -version
node -v
net start MySQL80

:: 3. Run Backend
cd backend
mvn clean spring-boot:run

:: 4. Run Frontend (in a separate Command Prompt)
cd ..
npm install
npm run dev
```

---

## 7. Environment Variables Reference

### Frontend Variables (`.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend REST API base URL | `http://localhost:8081` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public test key ID | `rzp_test_placeholder_key` |

### Backend Variables (`backend/.env`)
| Variable | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Embedded Tomcat HTTP port | No | `8081` |
| `DB_URL` | MySQL JDBC URL with parameters | Yes | `jdbc:mysql://localhost:3306/projectkit_db?...` |
| `DB_USERNAME` | Database username | Yes | `projectkit_user` |
| `DB_PASSWORD` | Database password | Yes | `ProjectKit2026!` |
| `JWT_SECRET` | 256-bit secret for signing JWTs | Yes | Minimum 64 hex characters |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | Yes | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET`| Razorpay API Secret Key | Yes | Secret from Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret | Yes | Secret from Webhook settings |
| `FRONTEND_URL` | Allowed CORS origins (comma separated) | Yes | `http://localhost:3000,http://localhost:5173` |

---

## 8. API Documentation & Postman Collection

- **Interactive Swagger UI:** Visit `http://localhost:8081/swagger-ui/index.html` when backend is running.
- **OpenAPI 3.0 JSON:** `http://localhost:8081/v3/api-docs`
- **Postman Collection:** A pre-configured Postman v2.1.0 collection is located at:
  ```
  postman/ProjectKit.postman_collection.json
  ```
  Import this JSON file into Postman. It includes pre-written test scripts that automatically capture and inject the `accessToken` upon login across all subsequent authenticated requests.

For a comprehensive markdown reference of all endpoints, parameters, and error formats, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

---

## 9. Automated Testing

### Backend Unit & Security Tests
```bash
cd backend
mvn test
```
Tests cover:
- Invalid credentials & authentication failure responses.
- Expired JWT token rejection.
- Refresh token rotation & revocation checks.
- Refresh token replay attack prevention.
- Role-based authorization (`ROLE_STUDENT` attempting admin operations).
- Anonymous download prevention.
- Single-use password reset token invalidation.

### Frontend Quality & Type Checks
```bash
# Type checking
npm run lint

# Production build test
npm run build
```

---

## 10. Deployment Guide

- **Frontend Deployment (Netlify):** Configured via `netlify.toml` and `public/_redirects` with single-page app routing and HTTP security headers.
- **Backend Deployment (Render / Cloud Run):** Configured via multi-stage `backend/Dockerfile` and `render.yaml` with managed database connection strings and health checks.
- For complete step-by-step production hosting, SSL certificates, and DNS settings, refer to [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 11. Contributing & Git Standards

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, Git branching strategy, conventional commit message standards, and pull request procedures.

- **Branches:** Create feature branches from `develop` (`feature/<description>`, `fix/<description>`).
- **Secrets:** Never commit `.env` files or production credentials.
- **Force-Pushing:** Strictly prohibited on `main` and `develop`.

---

## 12. Documentation Index

- [SETUP.md](SETUP.md) — Detailed Windows/Linux developer environment setup.
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) — Complete REST endpoint reference and Postman guide.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Git workflow, commit conventions, and pull request checklist.
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production hosting on Netlify, Render, and Managed MySQL.
- [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) — Complete OWASP security audit findings and fixes.
- [PERFORMANCE_AUDIT_REPORT.md](PERFORMANCE_AUDIT_REPORT.md) — Lighthouse, Web Vitals, and N+1 query benchmarks.
- [SEO_AND_DISCOVERABILITY.md](SEO_AND_DISCOVERABILITY.md) — Search engine metadata, Schema.org JSON-LD, and robots/sitemap.

---

## 13. License

ProjectKit is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

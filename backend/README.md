# ProjectKit — Spring Boot 3.3.5 Backend

Backend REST API service for ProjectKit, providing student authentication, role-based authorization, project catalog search, order management, Razorpay payment processing, and secure file deliverable streaming.

---

## 1. Requirements

- **Java Development Kit:** JDK 17 (Eclipse Temurin LTS recommended)
- **Database:** MySQL 8.0+
- **Build Tool:** Apache Maven 3.9+
- **Port:** Default HTTP `8081`

---

## 2. Configuration (`.env`)

Copy `.env.example` to `.env` or provide environment variables to your IDE:

```properties
PORT=8081
SPRING_PROFILES_ACTIVE=dev
DB_URL=jdbc:mysql://localhost:3306/projectkit_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=9a4f2c8d3b7a1e6f5c8d2e4a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c
RAZORPAY_KEY_ID=rzp_test_YourKeyId
RAZORPAY_KEY_SECRET=YourSecretKey
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecret
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

---

## 3. Running the Service

### Windows
```cmd
mvn clean spring-boot:run
```

### macOS / Linux
```bash
./mvnw clean spring-boot:run
# Or
mvn clean spring-boot:run
```

---

## 4. Database Migrations (Flyway)

Flyway automatically discovers and runs pending SQL scripts on startup from `src/main/resources/db/migration/`:
- `V1__init_schema.sql` — Core users, roles, categories, projects, orders, payments, refresh tokens.
- `V2__seed_projects.sql` — Curated academic project kit seed data.
- `V3__compliance_tables.sql` — Legal consent and compliance audit logs.

---

## 5. API Endpoints & Swagger UI

- **Interactive Documentation:** `http://localhost:8081/swagger-ui/index.html`
- **OpenAPI 3.0 JSON:** `http://localhost:8081/v3/api-docs`
- **Health Check:** `http://localhost:8081/api/health`

---

## 6. Testing

Run automated unit and security tests:
```bash
mvn test
```

# ProjectKit Production Deployment & Infrastructure Guide

This guide documents the production deployment architecture for the **ProjectKit** platform.

---

## 1. Architecture Overview

```
                                      [ Internet / Students ]
                                                 │
                                 ┌───────────────┴──────────────┐
                                 │                              │
                     HTTPS / DNS: projectkit.in       HTTPS: api.projectkit.in
                                 │                              │
                                 ▼                              ▼
                       ┌──────────────────┐           ┌────────────────────┐
                       │  Netlify (Edge)  │           │ Render Web Service │
                       │  React 19 + Vite │           │ Spring Boot 3.3.5  │
                       │  SPA Static CDN  │           │ Java 17 Temurin    │
                       └──────────────────┘           └─────────┬──────────┘
                                                                │
                                              Private VPC / TLS │ (Port 3306)
                                                                ▼
                                                      ┌────────────────────┐
                                                      │   Managed MySQL 8  │
                                                      │ AWS RDS / DO DBaaS │
                                                      │ Flyway V1, V2, V3  │
                                                      └────────────────────┘
```

---

## 2. Frontend Deployment (Netlify)

### Settings
- **Repository**: Connected GitHub repository
- **Base directory**: `/` (repository root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `20.x`

### Production Environment Variables in Netlify
Configure these in **Site configuration > Environment variables**:

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.projectkit.in` | Base URL of deployed Spring Boot backend |
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxxxx` | Razorpay public key ID for checkout modal |
| `VITE_APP_URL` | `https://projectkit.in` | Canonical URL for social sharing & OpenGraph |

### SPA Redirects & Security Headers
Netlify reads `public/_redirects` and `netlify.toml` directly from source control:
- Rewrites all paths `/*` to `/index.html` with HTTP 200 for React Router.
- Enforces HTTP response headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and Strict `Content-Security-Policy`.

---

## 3. Backend Deployment (Render / Docker)

### Web Service Specification
- **Environment**: Docker (uses `backend/Dockerfile`)
- **Docker Build Context**: `./backend`
- **DockerfilePath**: `./backend/Dockerfile`
- **Instance Type**: Starter / Standard (1 vCPU, 1 GB RAM min)
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: Enabled on `main` branch

### Environment Variables in Render Dashboard
Configure in **Render Service > Environment**:

| Variable Name | Recommended Setting / Format |
| :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `PORT` | Auto-injected by Render (default `8081`) |
| `DB_URL` | `jdbc:mysql://<host>:<port>/projectkit_db?sslMode=REQUIRED&useSSL=true` |
| `DB_USERNAME` | Dedicated application user (e.g. `projectkit_app`) |
| `DB_PASSWORD` | Cryptographically generated password (>32 chars) |
| `JWT_SECRET` | 256-bit Hexadecimal secret key |
| `JWT_EXPIRATION_MS` | `86400000` (24 Hours) |
| `JWT_REFRESH_EXPIRATION_MS` | `604800000` (7 Days) |
| `RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Secret key from Razorpay dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signing secret |
| `FRONTEND_URL` | `https://projectkit.in,https://projectkit.netlify.app` |
| `SMTP_HOST` | `smtp.sendgrid.net` (or `email-smtp.us-east-1.amazonaws.com`) |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | `apikey` |
| `SMTP_PASSWORD` | SendGrid / AWS SES API Key |
| `PROJECTKIT_MAIL_FROM` | `noreply@projectkit.in` |
| `PROJECTKIT_MAIL_NAME` | `ProjectKit Marketplace` |
| `STORAGE_DIR` | `/var/data/projectkit/uploads` |

---

## 4. Managed Database Configuration (MySQL 8)

### Security Best Practices
1. **Network Firewalls (VPC / IP Allowlisting)**:
   - Restrict incoming traffic on port 3306 exclusively to Render's outbound IP addresses.
   - Do NOT expose `0.0.0.0/0` publicly.
2. **Dedicated Database User**:
   ```sql
   CREATE USER 'projectkit_app'@'%' IDENTIFIED BY 'StrongGeneratedSecretKeyHere!';
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON projectkit_db.* TO 'projectkit_app'@'%';
   FLUSH PRIVILEGES;
   ```
3. **Automated Backups & Point-in-Time Recovery (PITR)**:
   - Enable daily automated snapshots with a 14-day retention policy.
   - Enable binary logging for point-in-time recovery.
4. **Flyway Migration Execution**:
   - In production profile (`application-prod.properties`), `spring.flyway.enabled=true` automatically validates and applies pending migrations (`V1`, `V2`, `V3`) before the application starts accepting traffic.

---

## 5. Verification Checklist

1. **Backend Health Check**:
   ```bash
   curl -i https://api.projectkit.in/api/health
   # Expected: HTTP 200 OK {"status":"UP","database":"CONNECTED","version":"1.0.0"}
   ```
2. **Frontend Routing Verification**:
   Navigate directly to `https://projectkit.in/projects` and refresh the browser. Netlify rewrite must return the index page without 404 errors.
3. **Razorpay Live Checkout Test**:
   Perform a real ₹1 verification transaction in production to confirm end-to-end webhook receipt and order status transition to `PAID`.

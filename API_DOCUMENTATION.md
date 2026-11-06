# ProjectKit REST API Reference & Postman Integration

**Version:** 1.0.0  
**Base URL (Local):** `http://localhost:8081`  
**Base URL (Production):** `https://api.yourdomain.com`  
**Interactive Swagger UI:** `http://localhost:8081/swagger-ui/index.html`  
**OpenAPI Specification:** `http://localhost:8081/v3/api-docs`  
**Postman Collection File:** `postman/ProjectKit.postman_collection.json`  

---

## 1. Authentication & Security Architecture

ProjectKit uses stateless JSON Web Token (JJWT 0.12.5) authentication over HTTPS:
- **Access Token:** Short-lived (15 minutes). Sent in the `Authorization` header:  
  `Authorization: Bearer <accessToken>`
- **Refresh Token:** Long-lived (7 days). Stored in the database, rotated upon each exchange, and revoked immediately upon logout or password reset.
- **Role-Based Access Control (RBAC):**
  - `ROLE_STUDENT`: Browse catalog, place orders, verify Razorpay payments, download owned source files, manage profile.
  - `ROLE_ADMIN`: Manage project kits, toggle publication, review sales analytics, view customer compliance audits.

### Standard Response Envelope
All API endpoints return a uniform JSON envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-11-05T01:30:00Z"
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "message": "Invalid credentials provided",
  "data": null,
  "timestamp": "2026-11-05T01:30:00Z"
}
```

---

## 2. Endpoints Matrix

### 2.1 System & Health Checks
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Overall service and database connectivity status (`{"status":"UP"}`) |
| `GET` | `/api/health/liveness` | Public | Container orchestrator liveness probe |

### 2.2 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account (`email`, `fullName`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate student/admin. Returns `accessToken`, `refreshToken`, user object |
| `POST` | `/api/auth/refresh` | Public | Rotate refresh token and issue new 15-minute access token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile, roles, and status |
| `POST` | `/api/auth/logout` | Authenticated | Revoke refresh token and invalidate current session |
| `POST` | `/api/auth/forgot-password` | Public | Generate hashed single-use reset token and send reset email |
| `POST` | `/api/auth/reset-password` | Public | Validate single-use token, hash new password with BCrypt, revoke active refresh tokens |
| `PUT` | `/api/auth/change-password` | Authenticated | Change password with current password verification |

### 2.3 Project Catalog (`/api/projects`)
*All public catalog endpoints enforce HTTP `Cache-Control: public, max-age=300`.*

| Method | Endpoint | Access | Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Public | `keyword`, `categoryId`, `difficulty`, `minPrice`, `maxPrice`, `page`, `size`, `sortBy`, `sortDir` | Paginated search across title, tags, description with single JOIN FETCH |
| `GET` | `/api/projects/featured` | Public | None | Curated featured academic projects for homepage |
| `GET` | `/api/projects/popular` | Public | None | Top purchased project kits |
| `GET` | `/api/projects/{slug}` | Public / Auth | None | Full project kit details, screenshots, technologies, and purchase status |
| `GET` | `/api/projects/id/{id}` | Public / Auth | None | Lookup project kit by numerical ID |

### 2.4 Categories (`/api/categories`)
*Enforces HTTP `Cache-Control: public, max-age=3600`.*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | List all active academic disciplines (AI/ML, IoT, Web, Cloud) |
| `GET` | `/api/categories/{slug}` | Public | Get category details and project counts by slug |

### 2.5 Orders (`/api/orders`)
*Enforces HTTP `Cache-Control: no-store, must-revalidate`.*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Student | Create a pending order with database-calculated prices and initiate Razorpay order ID |
| `GET` | `/api/orders` | Student | Paginated list of student's personal order history |
| `GET` | `/api/orders/{id}` | Student | Order details by ID (enforces user ownership) |
| `GET` | `/api/orders/number/{orderNumber}` | Student | Real-time status lookup for post-payment polling view |

### 2.6 Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/verify` | Student | Validates Razorpay HMAC SHA256 signature, matches order amount, transitions order to `PAID`, grants download rights, and triggers confirmation email |
| `POST` | `/api/payments/webhook` | Gateway (Secret) | Idempotent gateway webhook processor verifying `X-Razorpay-Signature` |

### 2.7 Secure Deliverable Downloads (`/api/downloads`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/downloads/source/{projectId}` | Student (Owner) | Direct streaming of source code `.zip` archive via `UrlResource` (64KB chunks) |
| `GET` | `/api/downloads/docs/{projectId}` | Student (Owner) | Direct streaming of documentation & report `.pdf` deliverable |

---

## 3. Importing Postman Collection

1. Open **Postman** (Desktop or Web).
2. Click **Import** in the top-left navigation.
3. Select or drag-and-drop `postman/ProjectKit.postman_collection.json`.
4. Ensure the Collection Variable `baseUrl` points to `http://localhost:8081`.
5. Execute `02 - Authentication -> Student Login`:
   - The embedded Postman test script automatically extracts `accessToken` and `refreshToken` and populates your collection variables.
   - Subsequent authenticated requests in the collection automatically inherit `Bearer {{accessToken}}`.

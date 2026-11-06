# ProjectKit Complete Local Setup Guide

This guide provides step-by-step instructions to configure, build, and run both the **Spring Boot 3.3.5 Backend** and **React 19 / Vite Frontend** on Windows, macOS, and Linux.

---

## 1. System Prerequisites

Ensure you have the following installed before starting:

| Tool | Recommended Version | Download Link | Verification Command |
| :--- | :--- | :--- | :--- |
| **JDK (Java)** | Eclipse Temurin 17 (LTS) | [adoptium.net](https://adoptium.net/) | `java -version` |
| **Node.js** | Node 20 LTS or Node 22 | [nodejs.org](https://nodejs.org/) | `node -v` |
| **npm** | npm 10+ (bundled with Node) | Bundled | `npm -v` |
| **MySQL Server** | MySQL 8.0 or 8.4 LTS | [dev.mysql.com](https://dev.mysql.com/downloads/installer/) | `mysql --version` |
| **Apache Maven** | Maven 3.9+ | [maven.apache.org](https://maven.apache.org/) | `mvn -v` |
| **Git** | Git 2.40+ | [git-scm.com](https://git-scm.com/) | `git --version` |

---

## 2. Windows Environment Configuration (Exact Commands)

### 2.1 Set JAVA_HOME on Windows
1. Open **Command Prompt** as Administrator.
2. Run the following command (replace with your actual JDK 17 folder if different):
   ```cmd
   setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot" /M
   setx Path "%Path%;%JAVA_HOME%\bin" /M
   ```
3. Close and reopen Command Prompt, then verify:
   ```cmd
   java -version
   echo %JAVA_HOME%
   ```
   *Expected output: OpenJDK 64-Bit Server VM (build 17.x).*

### 2.2 Configure MySQL Database on Windows
1. Verify MySQL Service is running:
   ```cmd
   net start MySQL80
   ```
2. Log in to the MySQL command-line client:
   ```cmd
   mysql -u root -p
   ```
3. Execute the database initialization SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS projectkit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'projectkit_user'@'localhost' IDENTIFIED BY 'ProjectKit2026!';
   GRANT ALL PRIVILEGES ON projectkit_db.* TO 'projectkit_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## 3. Backend Setup (Spring Boot 3.3.5)

### 3.1 Configure Environment Variables
In the `backend` directory, create a `.env` file or configure your IDE run configuration:
```properties
PORT=8081
SPRING_PROFILES_ACTIVE=dev
DB_URL=jdbc:mysql://localhost:3306/projectkit_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=projectkit_user
DB_PASSWORD=ProjectKit2026!
JWT_SECRET=9a4f2c8d3b7a1e6f5c8d2e4a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c
JWT_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
RAZORPAY_WEBHOOK_SECRET=rzp_test_webhook_secret
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

### 3.2 Eclipse IDE Import Instructions
1. Open **Eclipse IDE for Enterprise Java and Web Developers** (2023-09 or newer recommended).
2. Go to **File -> Import...**.
3. Expand **Maven** and select **Existing Maven Projects**, then click **Next**.
4. In **Root Directory**, browse to and select the `backend` folder.
5. Ensure `pom.xml` is checked, then click **Finish**.
6. Wait for Eclipse to download all Maven dependencies.
7. Configure JDK 17 Compiler Compliance:
   - Right-click project -> **Properties** -> **Java Build Path** -> **Libraries** -> Select **JRE System Library [JavaSE-17]**.
   - Right-click project -> **Properties** -> **Java Compiler** -> Check **Compiler compliance level: 17**.
8. Set up Eclipse Run Configuration:
   - Right-click `com.projectkit.ProjectKitBackendApplication` -> **Run As** -> **Run Configurations...**.
   - Select the **Environment** tab and add the variables from step 3.1 (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).
   - Click **Apply** then **Run**.

### 3.3 IntelliJ IDEA Import Instructions
1. Open IntelliJ IDEA -> **Open** -> Select the `backend/pom.xml` file -> Choose **Open as Project**.
2. Go to **File -> Project Structure -> Project**:
   - Set **SDK** to `17` (e.g., Eclipse Temurin 17).
   - Set **Language Level** to `17 - Sealed classes, pattern matching...`.
3. Open `src/main/java/com/projectkit/ProjectKitBackendApplication.java`.
4. Click the green **Run** arrow next to the `main` method.

### 3.4 Command-Line Startup & Migrations
On startup, **Flyway** automatically checks and runs pending database migrations (`V1__init_schema.sql`, `V2__seed_projects.sql`, `V3__compliance_tables.sql`).

**Windows (CMD/PowerShell):**
```cmd
cd backend
mvn clean spring-boot:run
```

**macOS/Linux (Terminal):**
```bash
cd backend
mvn clean spring-boot:run
```

### 3.5 Verify Backend Health
Once started, test the service endpoints in your browser:
- Health check: `http://localhost:8081/api/health` (Returns `{"status": "UP"}`)
- Swagger OpenAPI UI: `http://localhost:8081/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`

---

## 4. Frontend Setup (React 19 / Vite)

### 4.1 Install Dependencies
From the repository root directory:
```bash
# Windows / macOS / Linux
npm install
```

### 4.2 Configure Frontend Environment
Create `.env` in the root folder:
```properties
VITE_API_BASE_URL=http://localhost:8081
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder_key
```

### 4.3 Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`. The Vite reverse-proxy forwards `/api/*` requests directly to `http://localhost:8081`.

---

## 5. Testing & Verification

### 5.1 Run Backend Tests
Runs all JUnit 5 and Spring Security mock tests:
```bash
cd backend
mvn test
```

### 5.2 Run Frontend Verification
Checks TypeScript types and compiles production bundles:
```bash
npm run lint
npm run build
```

---

## 6. Common Troubleshooting

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `java: error: release version 17 not supported` | Java compiler using JDK 8 or 11 | Set `JAVA_HOME` to JDK 17 and configure IDE project SDK to 17. |
| `CommunicationsException: Communications link failure` | MySQL service is stopped or port 3306 blocked | Run `net start MySQL80` on Windows, or `sudo systemctl start mysql` on Linux. |
| `Access denied for user 'root'@'localhost'` | Wrong database password in `.env` | Update `DB_PASSWORD` or create user `projectkit_user` as documented in Section 2.2. |
| `CORS error in browser console` | Frontend port not allowed in backend | Ensure `FRONTEND_URL` in `backend/.env` contains your client origin (e.g., `http://localhost:3000`). |
| `Razorpay checkout modal fails to open` | Invalid or missing `VITE_RAZORPAY_KEY_ID` | Add test key `rzp_test_...` to frontend `.env` and restart dev server. |

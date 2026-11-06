# ProjectKit Contributing Guidelines & Development Workflow

Thank you for contributing to ProjectKit! This document outlines our standard engineering practices, Git workflow, code review expectations, and dependency management policies.

---

## 1. Core Principles

1. **Security First**: Never commit secrets, credentials, API keys, or private certificates. All credentials must be sourced from environment variables.
2. **Quality & Testing**: No pull request may be merged without passing automated unit and integration tests (`mvn test` for backend, `npm run build && npm run lint` for frontend).
3. **Traceability**: Every commit and pull request must describe *what* changed and *why*.
4. **Performance & Cleanliness**: No unoptimized bundles, unused dependencies, or unhandled N+1 database queries.

---

## 2. Git Branching Strategy

We follow a structured Git feature branch model:

- `main`: Production-ready code. Protected branch. Direct pushes are disabled.
- `develop`: Integration branch for the next release.
- Feature Branches: Created from `develop` and merged via Pull Request.
  - `feature/<short-description>`: e.g., `feature/post-payment-polling`
  - `fix/<short-description>`: e.g., `fix/admin-route-guard`
  - `perf/<short-description>`: e.g., `perf/vite-code-splitting`
  - `security/<short-description>`: e.g., `security/header-hardening`
  - `docs/<short-description>`: e.g., `docs/api-postman-update`

### Branch Lifecycle Example (Bash / PowerShell)
```bash
# 1. Update local develop branch
git checkout develop
git pull origin develop

# 2. Create your isolated feature branch
git checkout -b feature/order-receipt-pdf

# 3. Work on changes, test thoroughly, and stage files
git status
git add src/components/OrderReceipt.tsx

# 4. Commit using Conventional Commits standard
git commit -m "feat(orders): add downloadable tax invoice receipt modal"

# 5. Push to your remote branch
git push origin feature/order-receipt-pdf
```

---

## 3. Commit Message Standards

ProjectKit strictly enforces **Conventional Commits**:

```text
<type>(<scope>): <subject>

[optional body explaining motivation and trade-offs]

[optional footer(s) referencing issue number, e.g., Closes #42]
```

### Commit Types
- `feat`: A new user-facing feature or API endpoint.
- `fix`: A bug fix in existing functionality.
- `security`: Security patches, auth hardening, or vulnerability resolution.
- `perf`: Performance optimization (bundle reduction, query indexing, caching).
- `docs`: Documentation updates (README, API docs, Swagger).
- `test`: Adding or refactoring automated tests.
- `refactor`: Code changes that neither fix bugs nor add features.
- `chore`: Build tooling, dependency adjustments, or CI workflow updates.

### Examples of Good Commit Messages
- `feat(payment): implement Razorpay signature verification and webhook idempotency`
- `fix(auth): prevent refresh token reuse by rotating jti on token exchange`
- `perf(catalog): add JPA entity graph to prevent N+1 query on project listing`
- `security(admin): enforce server-side role check on compliance endpoints`

---

## 4. Protected Rules & Git Hygiene

1. **Never Commit Secrets**:
   - Check `git status` before committing.
   - Files named `.env`, `.env.local`, `*.key`, `*.pem`, `*.p12`, or containing real API keys must never be staged.
   - Use `git status` and `.gitignore` to verify untracked secrets.
2. **Never Commit Build Outputs**:
   - Do NOT commit `node_modules/`, `dist/`, `target/`, `build/`, `*.jar`, or `*.war`.
3. **Never Force-Push to Shared Branches**:
   - `git push --force` on `main` or `develop` is strictly prohibited.
   - If history cleanup is needed on a private feature branch, use `git push --force-with-lease`.
4. **Clean Pull Requests**:
   - Ensure PR branches are rebased or cleanly merged against the latest `develop`.
   - Provide a clear PR description detailing testing evidence, before-and-after screenshots, and affected endpoints.

---

## 5. Dependency Management Policy

### Backend (Maven `pom.xml`)
- Maintain exact or property-managed versions in `pom.xml`.
- Do not introduce redundant third-party libraries when Spring Framework or JDK 17 provides built-in utilities (e.g., use `java.time` instead of Joda-Time; use Spring Security instead of custom auth filters).
- Before adding a Maven package, verify:
  1. Active maintenance and zero known CVE vulnerabilities.
  2. Compatibility with Spring Boot 3.3.x and Java 17.
- Check for vulnerable dependencies:
  ```bash
  mvn dependency:analyze
  ```

### Frontend (npm `package.json`)
- Maintain clean package manifests. Remove unused packages immediately.
- Use explicit, tested versions. Avoid unnecessary major version jumps that introduce breaking API changes.
- Verify production build and chunk sizes after any package addition:
  ```bash
  npm run build
  npm run lint
  ```

---

## 6. Code Review & Pull Request Checklist

Before submitting a Pull Request, verify:
- [ ] Code follows project architectural patterns (Service Layer, DTO validation, Tailwind tokens).
- [ ] No hardcoded passwords, tokens, URLs, or secrets in code or comments.
- [ ] Database migrations (Flyway) are additive, idempotent, and include backward-compatible rollbacks where needed.
- [ ] Frontend routes are lazy-loaded with proper error boundaries.
- [ ] HTTP responses enforce appropriate `Cache-Control` headers (public for catalog, `no-store` for payment/auth).
- [ ] All unit and integration tests pass cleanly (`mvn test` and `npm run lint`).

-- ===================================================================
-- PROJECTKIT DATABASE SCHEMA MIGRATION V5
-- Module: Student Project Access Entitlements, Free Project Kits & Contact Inquiries
-- Target Database: MySQL 8.0+
-- Collation: utf8mb4_unicode_ci
-- ===================================================================

-- 1. EXTEND PROJECTS TABLE WITH FREE PROJECT CAPABILITIES & PUBLICATION STATUS
ALTER TABLE projects
    ADD COLUMN is_free BOOLEAN NOT NULL DEFAULT FALSE AFTER difficulty_level,
    ADD COLUMN access_type VARCHAR(20) NOT NULL DEFAULT 'PAID' AFTER is_free,
    ADD COLUMN claim_count INT NOT NULL DEFAULT 0 AFTER purchase_count,
    ADD COLUMN publication_status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' AFTER is_active;

CREATE INDEX idx_projects_is_free ON projects (is_free);
CREATE INDEX idx_projects_access_type ON projects (access_type);
CREATE INDEX idx_projects_publication_status ON projects (publication_status);

-- 2. CREATE STUDENT PROJECT ACCESS ENTITLEMENTS TABLE
-- Ensures strict access control: students only access claimed free kits or paid purchases
CREATE TABLE IF NOT EXISTS student_project_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    access_type VARCHAR(30) NOT NULL, -- 'FREE_CLAIM' or 'PAID_PURCHASE'
    order_id BIGINT NULL,             -- NULL for free claims
    payment_id VARCHAR(100) NULL,     -- NULL for free claims
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    access_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' or 'REVOKED'
    CONSTRAINT fk_access_student FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_access_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_access_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
    CONSTRAINT uq_student_project UNIQUE (student_id, project_id),
    INDEX idx_access_student (student_id),
    INDEX idx_access_project (project_id),
    INDEX idx_access_type (access_type),
    INDEX idx_access_status (access_status),
    INDEX idx_access_granted (granted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. MIGRATE HISTORICAL PAID PURCHASES TO PRESERVE EXISTING ENTITLEMENTS
-- Ensures no existing user purchase records are lost or invalidated
INSERT IGNORE INTO student_project_access (student_id, project_id, access_type, order_id, payment_id, granted_at, access_status)
SELECT o.user_id, oi.project_id, 'PAID_PURCHASE', o.id, o.razorpay_payment_id, o.created_at, 'ACTIVE'
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'PAID';

-- 4. CREATE CONTACT INQUIRIES AUDIT TABLE
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(150),
    category VARCHAR(50) NOT NULL DEFAULT 'General Support',
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW', -- 'NEW', 'IN_PROGRESS', 'RESOLVED'
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inquiries_email (email),
    INDEX idx_inquiries_status (status),
    INDEX idx_inquiries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

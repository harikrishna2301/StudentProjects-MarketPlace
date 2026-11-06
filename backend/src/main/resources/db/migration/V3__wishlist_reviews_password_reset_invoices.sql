-- ===================================================================
-- PROJECTKIT DATABASE SCHEMA MIGRATION V3
-- Module: Wishlist, Reviews, Password Reset, Invoices & Notifications
-- Target Database: MySQL 8.0+
-- Collation: utf8mb4_unicode_ci
-- ===================================================================

-- 1. WISHLIST ITEMS TABLE
-- Stores saved student project kits with unique constraint per user and project
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    UNIQUE KEY uk_wishlist_user_project (user_id, project_id),
    INDEX idx_wishlist_user (user_id),
    INDEX idx_wishlist_project (project_id),
    INDEX idx_wishlist_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. REVIEWS & RATINGS TABLE
-- Stores student verified reviews with single review constraint per student per kit
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    UNIQUE KEY uk_reviews_user_project (user_id, project_id),
    INDEX idx_reviews_project_approved (project_id, is_approved),
    INDEX idx_reviews_user (user_id),
    INDEX idx_reviews_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PASSWORD RESET TOKENS TABLE
-- Secure time-bounded tokens for student self-service password recovery
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_password_reset_user (user_id),
    INDEX idx_password_reset_token (token),
    INDEX idx_password_reset_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. INVOICES & TAX METADATA TABLE
-- Preserves immutable financial invoice records with GST/tax breakdown
-- Critical: Foreign keys use ON DELETE RESTRICT to protect financial auditability
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    billing_name VARCHAR(100) NOT NULL,
    billing_email VARCHAR(150) NOT NULL,
    billing_phone VARCHAR(20),
    billing_address TEXT,
    gstin VARCHAR(30),
    pdf_path VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoices_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_invoices_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    INDEX idx_invoices_number (invoice_number),
    INDEX idx_invoices_user (user_id),
    INDEX idx_invoices_order (order_id),
    INDEX idx_invoices_date (invoice_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. NOTIFICATIONS TABLE
-- Real-time in-app alerts for purchases, updates, downloads, and policy advisories
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, is_read),
    INDEX idx_notifications_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

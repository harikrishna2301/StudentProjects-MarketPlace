-- ===================================================================
-- PROJECTKIT DATABASE SCHEMA MIGRATION V4
-- Module: Coupon and Discount Engine
-- Target Database: MySQL 8.0+
-- Collation: utf8mb4_unicode_ci
-- ===================================================================

-- 1. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL, -- 'PERCENTAGE' or 'FIXED_AMOUNT'
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    max_discount_amount DECIMAL(10,2), -- Optional ceiling for percentage discounts
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    usage_limit INT, -- NULL = unlimited total usage
    per_user_limit INT NOT NULL DEFAULT 1,
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_active_dates (is_active, start_date, expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. COUPON REDEMPTIONS AUDIT TABLE
-- Tracks every user redemption to prevent duplicate usage and enforce limits
CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redemptions_coupon FOREIGN KEY (coupon_id) REFERENCES coupons (id) ON DELETE RESTRICT,
    CONSTRAINT fk_redemptions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_redemptions_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    INDEX idx_redemptions_user_coupon (user_id, coupon_id),
    INDEX idx_redemptions_order (order_id),
    INDEX idx_redemptions_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ENHANCE ORDERS TABLE TO PRESERVE ORIGINAL AND DISCOUNTED VALUES
-- If columns do not exist, add original_amount, discount_amount, and coupon_code
ALTER TABLE orders 
    ADD COLUMN original_amount DECIMAL(10,2) AFTER user_id,
    ADD COLUMN discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER original_amount,
    ADD COLUMN coupon_code VARCHAR(50) AFTER razorpay_payment_id;

-- Backfill original_amount for historical orders
UPDATE orders SET original_amount = total_amount WHERE original_amount IS NULL;

-- 4. SEED INITIAL VERIFIED STUDENT DISCOUNT COUPONS
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, start_date, expiry_date, usage_limit, per_user_limit, is_active)
VALUES 
('WELCOME10', 'PERCENTAGE', 10.00, 500.00, 500.00, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 365 DAY), 1000, 1, TRUE),
('FLAT200', 'FIXED_AMOUNT', 200.00, 1000.00, NULL, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 365 DAY), 500, 1, TRUE),
('EXAMREADY', 'PERCENTAGE', 15.00, 1500.00, 750.00, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 250, 1, TRUE)
ON DUPLICATE KEY UPDATE code=code;

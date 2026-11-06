-- ===================================================================
-- PROJECTKIT DATABASE SCHEMA MIGRATION V1
-- Target Database: MySQL 8.0+
-- Collation: utf8mb4_unicode_ci
-- ===================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    college_name VARCHAR(150),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    short_description VARCHAR(500) NOT NULL,
    detailed_description LONGTEXT NOT NULL,
    category_id BIGINT NOT NULL,
    technologies VARCHAR(500) NOT NULL,
    features TEXT,
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'INTERMEDIATE',
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    thumbnail_url VARCHAR(500),
    view_count INT NOT NULL DEFAULT 0,
    purchase_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT,
    INDEX idx_projects_slug (slug),
    INDEX idx_projects_category (category_id),
    INDEX idx_projects_active (is_active),
    INDEX idx_projects_featured (is_featured),
    INDEX idx_projects_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PROJECT FILES TABLE (Secure Private Files & Public Media)
CREATE TABLE IF NOT EXISTS project_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    file_type VARCHAR(30) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_files_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    INDEX idx_files_project (project_id),
    INDEX idx_files_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_razorpay (razorpay_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    project_title VARCHAR(200) NOT NULL,
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_items_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE RESTRICT,
    INDEX idx_items_order (order_id),
    INDEX idx_items_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    payment_method VARCHAR(50),
    error_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_razorpay_order (razorpay_order_id),
    INDEX idx_payments_razorpay_pay (razorpay_payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. REFRESH TOKENS TABLE
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_tokens_user (user_id),
    INDEX idx_tokens_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- SEED DATA
-- Default Admin Account: admin@projectkit.com / Admin@123
-- BCrypt: $2a$10$wT8KkVy2uKqTfx3h2JbX6ODF81c15c8w4qB2nK02m8J4uVb.H4m.W
-- ===================================================================
INSERT INTO users (email, password_hash, full_name, college_name, phone, role, status)
VALUES (
    'admin@projectkit.com',
    '$2a$10$wT8KkVy2uKqTfx3h2JbX6ODF81c15c8w4qB2nK02m8J4uVb.H4m.W',
    'ProjectKit Administrator',
    'ProjectKit HQ',
    '+91 9876543210',
    'ADMIN',
    'ACTIVE'
) ON DUPLICATE KEY UPDATE email=email;

-- Seed Default Categories
INSERT INTO categories (name, slug, description, icon_name, is_active) VALUES
('Web Development', 'web-development', 'Full-stack, modern frontend and enterprise backend web applications', 'Globe', TRUE),
('Machine Learning & AI', 'machine-learning-ai', 'Deep learning, computer vision, NLP and predictive analytics projects', 'Brain', TRUE),
('Cloud Computing & DevOps', 'cloud-devops', 'Microservices, Docker, Kubernetes and CI/CD automated deployments', 'Cloud', TRUE),
('IoT & Embedded Systems', 'iot-embedded', 'Arduino, Raspberry Pi, ESP32 and sensor telemetry smart kits', 'Cpu', TRUE),
('Blockchain & Web3', 'blockchain-web3', 'Smart contracts, Ethereum dApps and decentralized storage solutions', 'ShieldCheck', TRUE),
('Mobile App Development', 'mobile-apps', 'Cross-platform Flutter, React Native and native Android applications', 'Smartphone', TRUE),
('Cyber Security & Networking', 'cyber-security', 'Penetration testing, encryption, network monitoring and ethical hacking', 'Lock', TRUE)
ON DUPLICATE KEY UPDATE name=name;

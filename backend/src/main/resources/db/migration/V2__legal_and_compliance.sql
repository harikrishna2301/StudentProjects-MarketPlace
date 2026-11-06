-- ===================================================================
-- PROJECTKIT DATABASE SCHEMA MIGRATION V2
-- Module: Legal Pages, Consent Auditing, Cookie Preferences & Compliance
-- Target Database: MySQL 8.0+
-- Collation: utf8mb4_unicode_ci
-- ===================================================================

-- 1. LEGAL DOCUMENTS TABLE (Versioned compliance documents)
CREATE TABLE IF NOT EXISTS legal_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_type VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    requires_review BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_legal_doc_type_version (document_type, version),
    INDEX idx_legal_type_published (document_type, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USER CONSENTS AUDIT TABLE (Immutable records of consent)
CREATE TABLE IF NOT EXISTS user_consents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_version VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    accepted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consents_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_consents_user (user_id),
    INDEX idx_consents_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. COOKIE PREFERENCES TABLE (User & Guest consent choices)
CREATE TABLE IF NOT EXISTS cookie_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    session_id VARCHAR(100) NULL,
    essential BOOLEAN NOT NULL DEFAULT TRUE,
    functional BOOLEAN NOT NULL DEFAULT FALSE,
    analytics BOOLEAN NOT NULL DEFAULT FALSE,
    marketing BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cookies_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_cookies_user (user_id),
    INDEX idx_cookies_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ACCOUNT DELETION REQUESTS TABLE (DPDPA 2023 / GDPR compliance)
CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    admin_notes TEXT,
    CONSTRAINT fk_deletion_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_deletion_user (user_id),
    INDEX idx_deletion_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- SEED INITIAL PUBLISHED LEGAL POLICIES (Version 1.0)
-- With clearly marked business placeholders and educational disclaimers
-- ===================================================================

INSERT INTO legal_documents (document_type, version, title, content, is_published, requires_review, published_at)
VALUES 
(
    'TERMS_AND_CONDITIONS',
    '1.0',
    'Terms and Conditions of Use',
    '## 1. Introduction and Acceptance of Terms
Welcome to ProjectKit ("[PROJECTKIT_LEGAL_ENTITY_NAME]", "Platform", "we", "us", or "our"). By registering, accessing, browsing, or purchasing academic project materials through our marketplace, you ("Student", "User", or "You") agree to be bound by these Terms and Conditions.

[LEGAL NOTICE: This document is a foundational compliance template and must be reviewed by a qualified legal professional before commercial publication.]

## 2. Educational & Learning Purpose Disclaimer
CRITICAL NOTICE: All project kits, source codes, architecture schematics, IEEE SRS documentation, database scripts, and viva voce guides available on ProjectKit are provided solely and strictly for EDUCATIONAL, RESEARCH, AND REFERENCE PURPOSES.
* We do NOT guarantee academic grades, marks, syndicate approvals, or faculty acceptance.
* We do NOT represent or warrant that materials submitted to colleges or universities will be free of plagiarism or institutional honor code infractions.
* The student assumes complete and sole responsibility for adapting, understanding, compiling, and defending their academic submissions.

## 3. Eligibility & Account Security
You must be at least 18 years of age or possess legal parental/guardian consent to make purchases. You agree to maintain the confidentiality of your login credentials and immediately notify [SUPPORT_EMAIL_ADDRESS] of unauthorized access.

## 4. Digital Product Delivery & Licensing
Upon verified payment confirmation via Razorpay, you receive a non-exclusive, non-transferable, revocable single-user academic license to download the project source code ZIP and documentation PDF.
* Prohibited: You may not resell, sub-license, redistribute on public GitHub repositories, telegram channels, or commercial marketplaces.
* Prohibited: You may not share your account or distribute batch archives.

## 5. Account Suspension & Termination
We reserve the right to suspend or terminate accounts that breach academic integrity standards, reverse-engineer the platform, or execute unauthorized automated scrapers.

## 6. Governing Law & Dispute Resolution
These Terms are governed by the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in [OFFICIAL_JURISDICTION_CITY], India.',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'PRIVACY_POLICY',
    '1.0',
    'Privacy Policy & Personal Data Governance',
    '## 1. Overview & Commitment
[PROJECTKIT_LEGAL_ENTITY_NAME] ("ProjectKit") respects your digital privacy. This Privacy Policy outlines how we collect, process, store, and protect your information in adherence to the Digital Personal Data Protection Act (DPDPA), 2023 of India, and internationally recognized privacy standards.

[LEGAL NOTICE: This document is a foundational compliance template and must be reviewed by a qualified legal professional before commercial publication.]

## 2. Personal Information Collected
We collect only the minimum required information necessary to provide educational materials:
* Registration Details: Full Legal Name, University Email Address, Mobile Phone Number, Engineering College / University Name.
* Order Records: Project IDs purchased, transaction identifiers, payment amounts, and timestamps.
* Technical Metadata: IP addresses, browser user agent, and verified consent timestamps for legal compliance.
* Financial Data Exemption: We do NOT store credit/debit card numbers, CVVs, or UPI PINs. All financial checkout transactions are securely processed through Razorpay (PCI-DSS Level 1 compliant gateway).

## 3. Purposes of Processing
Your data is processed strictly for:
* Creating and maintaining your authenticated student account.
* Verifying purchase transactions and unlocking secure digital downloads.
* Providing transactional receipts and grievance redressal support.
* Auditing compliance with Terms and legal policies.

## 4. Data Sharing & Third Parties
We do not sell, rent, or trade student personal information. Data is shared exclusively with:
* Razorpay Payment Gateway (for transaction authorization).
* Authorized cloud infrastructure and hosting providers bound by strict confidentiality.

## 5. User Data Rights & Account Deletion
Under the DPDPA 2023, you have the right to access, rectify, and request erasure of your personal data. You may submit an Account Deletion Request directly through your Profile Settings or contact [GRIEVANCE_OFFICER_EMAIL]. Upon review, non-statutory records will be purged within 30 days.',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'COOKIE_POLICY',
    '1.0',
    'Cookie & Tracking Technologies Policy',
    '## 1. What Are Cookies?
Cookies are small text files placed on your device to ensure secure website operations, remember session preferences, and improve browsing performance.

[LEGAL NOTICE: This document is a foundational compliance template and must be reviewed by a qualified legal professional before commercial publication.]

## 2. Categories of Cookies Used
* Essential Cookies (Strictly Necessary): Required for user authentication, security CSRF protection, and shopping cart persistence. These cannot be disabled.
* Functional Cookies: Remember your chosen theme (Light/Dark mode) and interface preferences.
* Analytics Cookies (Optional): Aggregate, anonymized usage statistics to help us optimize course navigation. Requires explicit prior consent.
* Marketing Cookies (Optional): We do NOT run intrusive third-party behavioral ads on student accounts.

## 3. Cookie Consent Banner & Granular Controls
In accordance with zero-pill consent discipline:
* Essential cookies remain active for platform security.
* Non-essential cookies remain deactivated until you choose "Accept All" or configure granular choices.
* You may update or withdraw your consent at any time via the Cookie Preferences link in our footer.',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'REFUND_POLICY',
    '1.0',
    'Refund and Cancellation Policy for Digital Goods',
    '## 1. Nature of Digital Goods
All items sold on ProjectKit are digital downloads comprising complete source code packages, documentation manuals, and database dumps.

[LEGAL NOTICE: This document is a foundational compliance template and must be reviewed by a qualified legal professional before commercial publication.]

## 2. Eligible Refund Circumstances
While digital products are generally non-tangible and irrevocable once unlocked, we honor refund requests in the following verified circumstances:
* Duplicate Transactions: You were accidentally billed more than once for the same project kit due to network timeouts.
* Payment Deducted but Order Not Created: Your bank or UPI was debited, but Razorpay failed to return an order confirmation and the item was never unlocked.
* Unresolvable Technical Defect: A project archive is corrupt or completely missing critical promised deliverables, and our technical engineering desk is unable to rectify the issue within 5 business days.

## 3. Non-Refundable Scenarios
Refunds cannot be granted for:
* Change of mind after downloading the source code archive.
* Rejection of project proposal by your university committee or guide (students must confirm topic suitability prior to purchase).
* Inability to run the software due to student hardware failing to meet listed specifications (e.g., minimum RAM or missing JDK 17).

## 4. Refund Procedure
Submit your transaction ID, registered email, and grievance details to [PAYMENTS_DISPUTE_EMAIL]. Legitimate claims are reviewed and processed within 7 to 10 banking days through original payment methods.',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'INTELLECTUAL_PROPERTY',
    '1.0',
    'Copyright and Intellectual Property Policy',
    '## 1. Platform Intellectual Property
The ProjectKit brand, logos, user interfaces, documentation templates, and proprietary backend logic are protected under Indian and international copyright and trademark laws.

[LEGAL NOTICE: This document is a foundational compliance template and must be reviewed by a qualified legal professional before commercial publication.]

## 2. Project Kit Licensing Terms
When you purchase a project kit, you receive a single-user Educational License. You are permitted to:
* Study, execute, modify, and extend the source code for academic coursework.
* Present the architecture diagrams and SRS reports during faculty reviews and viva examinations.

You are STRICTLY PROHIBITED from:
* Uploading project kits to open public repositories or file-sharing websites.
* Commercial resale or distribution of the kits to other students.

## 3. Notice and Take-Down Procedure (DMCA / Indian Copyright Act)
If you believe any project hosted on our platform infringes upon your copyright, submit a formal notice to our Grievance Officer at [DMCA_COPYRIGHT_EMAIL] with:
1. Identification of the copyrighted work claimed to have been infringed.
2. Link / URL to the infringing project on ProjectKit.
3. Proof of authorization or copyright ownership.
We act swiftly to investigate and suspend infringing content in accordance with applicable laws.',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'GRIEVANCE_REDRESSAL',
    '1.0',
    'Contact and Grievance Redressal Information',
    '## 1. Grievance Redressal Mechanism
Pursuant to the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data Protection Act, 2023, the details of our designated Grievance Officer are set forth below:

[LEGAL NOTICE: This document is a foundational compliance template and must be reviewed by a qualified legal professional before commercial publication.]

## 2. Designated Grievance Officer
* Name: [GRIEVANCE_OFFICER_NAME]
* Designation: Compliance & Student Grievance Officer
* Entity Name: [PROJECTKIT_LEGAL_ENTITY_NAME]
* Official Address: [OFFICIAL_REGISTERED_OFFICE_ADDRESS]
* Official Email: grievance@[PROJECTKIT_OFFICIAL_DOMAIN].com
* Phone Contact: [OFFICIAL_GRIEVANCE_PHONE_NUMBER]
* Response Timelines: Acknowledgment within 24 hours; resolution within 15 days of receipt.

## 3. Student Support & Inquiries
* Technical Project Support: support@[PROJECTKIT_OFFICIAL_DOMAIN].com
* Billing & Payment Assistance: payments@[PROJECTKIT_OFFICIAL_DOMAIN].com
* Academic Licensing Queries: legal@[PROJECTKIT_OFFICIAL_DOMAIN].com',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content);

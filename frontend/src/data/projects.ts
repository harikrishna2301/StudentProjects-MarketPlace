import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'Online Job Portal & Recruitment System',
    slug: 'online-job-portal-mern',
    category: 'Web Development',
    primaryLanguage: 'JavaScript',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Tailwind CSS', 'JWT'],
    price: 1999,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 148,
    shortDescription: 'Comprehensive full-stack recruitment portal with applicant tracking, employer hiring dashboard, resume parsing, and interview scheduling.',
    overview: 'The Online Job Portal is an end-to-end full-stack web platform built on the MERN stack that bridges college graduates and recruiters. It features dedicated applicant and employer portals, automated resume scoring, application status workflows, and interactive analytics for hiring managers.',
    problemStatement: 'Conventional campus placement portals lack transparent candidate communication, automated resume verification, and modern applicant tracking systems, forcing placement cells to handle manual spreadsheets.',
    objectives: [
      'Implement dual-role authentication with JWT token lifecycle management',
      'Provide recruiters with candidate filtering by skills, CGPA, and graduation batch',
      'Offer applicants real-time notification alerts on application progress',
      'Generate downloadable PDF application dossiers and placement analytical summaries'
    ],
    features: [
      { title: 'Candidate Portal', description: 'Multi-step resume builder, job search with filters, and 1-click application submission.' },
      { title: 'Recruiter Dashboard', description: 'Job posting editor, applicant scoring, shortlist pipeline, and interview slot scheduler.' },
      { title: 'Automated Status Pipeline', description: 'Real-time state transitions: Applied -> Under Review -> Shortlisted -> Interview -> Selected.' },
      { title: 'Analytics & Reporting', description: 'Placement cell visual charts on hiring ratios, salary distributions, and top hiring companies.' }
    ],
    modules: ['Authentication & Authorization', 'Candidate Profile & Resume Builder', 'Job Listings & Search Engine', 'Application Tracking System (ATS)', 'Admin Placement Console'],
    requirements: {
      hardware: ['Intel Core i3 or higher / AMD equivalent', '4 GB RAM minimum (8 GB recommended)', '2 GB free disk space'],
      software: ['Node.js v18.x or v20.x', 'MongoDB Community Server v6+ or MongoDB Atlas', 'Modern web browser (Chrome, Firefox, Edge)', 'VS Code or preferred IDE'],
      dependencies: ['react@18+', 'express@4.18+', 'mongoose@7+', 'jsonwebtoken@9+', 'bcryptjs@2.4+']
    },
    documentationIncluded: [
      { item: 'Full IEEE Format Project Report', format: 'PDF & DOCX (85+ Pages)', description: 'Complete academic report conforming to standard university final year format.' },
      { item: 'Software Requirement Specification (SRS)', format: 'PDF (28 Pages)', description: 'Functional & non-functional requirements, use cases, and IEEE 830 standards.' },
      { item: 'System Architecture & UML Diagrams', format: 'High-Res PNG & StarUML', description: 'Class, Use Case, Sequence, Activity, and ER diagrams.' },
      { item: 'Viva Voce Q&A Cheat Sheet', format: 'PDF (15 Pages)', description: 'Top 60 questions asked by external examiners with model answers.' },
      { item: 'PowerPoint Presentation', format: 'PPTX (24 Slides)', description: 'Professional slide deck ready for project review and final seminar defense.' }
    ],
    installationSteps: [
      { step: 1, title: 'Clone Repository & Install Backend', codeCommand: 'cd backend && npm install', description: 'Download dependencies including Express, Mongoose, and JWT.' },
      { step: 2, title: 'Configure Environment Variables', codeCommand: 'cp .env.example .env', description: 'Set MONGO_URI and JWT_SECRET inside your backend .env file.' },
      { step: 3, title: 'Install Frontend Client', codeCommand: 'cd ../frontend && npm install', description: 'Install React and styling libraries.' },
      { step: 4, title: 'Run Development Servers', codeCommand: 'npm run dev', description: 'Launch backend on port 5000 and frontend on port 5173 with hot reload.' }
    ],
    featured: true,
    createdAt: '2025-01-15',
    downloadsCount: 420,
    academicYear: '2025–2026',
    colorTheme: '#2563EB'
  },
  {
    id: 'proj-002',
    title: 'Smart City Traffic Management System',
    slug: 'smart-traffic-management-java',
    category: 'Java & Spring Boot',
    primaryLanguage: 'Java',
    techStack: ['Java 17', 'JavaFX', 'MySQL 8', 'OpenCV', 'Multi-threading', 'JDBC'],
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 94,
    shortDescription: 'Adaptive signal control simulator that dynamically calibrates green signal duration based on live vehicle density using Java and computer vision algorithms.',
    overview: 'The Smart Traffic Management System optimizes vehicular movement across multi-junction urban corridors. Unlike static timer signals, it computes instantaneous density using queue length detection and grants prioritized clearance for emergency services like ambulances and fire engines.',
    problemStatement: 'Fixed-timer traffic lights cause unnecessary congestion during off-peak hours on empty lanes while heavily congested opposite lanes suffer extended gridlock.',
    objectives: [
      'Calculate lane vehicle density dynamically via image edge detection and background subtraction',
      'Optimize traffic light switching intervals using greedy priority heuristics',
      'Provide automated green corridors for registered emergency response vehicles via RF/GPS trigger',
      'Log junction telemetry and violation reports directly into MySQL database'
    ],
    features: [
      { title: 'Density-Based Green Timing', description: 'Real-time adaptation from 15 seconds to 90 seconds based on lane backlog.' },
      { title: 'Emergency Vehicle Corridor', description: 'Immediate signal preemption for emergency vehicles with manual override console.' },
      { title: 'Interactive Simulation View', description: 'JavaFX graphical rendering showing vehicle spawns, lane queues, and signal changes.' },
      { title: 'Violation & Analytics Logging', description: 'Automatic logging of signal jumping and aggregate peak-hour bottleneck metrics.' }
    ],
    modules: ['Vehicle Density Extraction Engine', 'Adaptive Signal Switching Algorithm', 'Emergency Vehicle Preemption Service', 'JavaFX GUI Simulator', 'Database Persistence & Auditing'],
    requirements: {
      hardware: ['Intel Core i5 / AMD Ryzen 5 or higher', '8 GB RAM', 'Webcam / video source for CV feed demo'],
      software: ['JDK 17 (Eclipse Temurin or Oracle JDK)', 'MySQL Server 8.0+', 'IntelliJ IDEA or Eclipse IDE', 'Maven 3.8+'],
      dependencies: ['opencv-java-4.x', 'mysql-connector-j-8.x', 'javafx-controls', 'lombok']
    },
    documentationIncluded: [
      { item: 'Final IEEE Project Documentation', format: 'PDF & DOCX (92 Pages)', description: 'Comprehensive report with mathematical formulations of queuing theory.' },
      { item: 'UML Design & Sequence Diagrams', format: 'High-Res PDF & StarUML', description: 'Complete state chart, component, and timing diagrams for multi-threading.' },
      { item: 'Database Schema & Sample Dump', format: 'SQL File', description: 'Ready-to-import MySQL database with mock traffic telemetry.' },
      { item: 'Viva Voce Master Guide', format: 'PDF (18 Pages)', description: 'Detailed Q&A on Java concurrency, synchronization, and OpenCV pipelines.' },
      { item: 'Project Defense PPT', format: 'PPTX (22 Slides)', description: 'Includes flowcharts, hardware block diagrams, and algorithmic complexity comparisons.' }
    ],
    installationSteps: [
      { step: 1, title: 'Set up MySQL Database', codeCommand: 'mysql -u root -p < schema_traffic.sql', description: 'Create database and seed initial signal junction configurations.' },
      { step: 2, title: 'Open Project in IntelliJ / Eclipse', codeCommand: 'mvn clean install', description: 'Import as Maven project and resolve dependencies automatically.' },
      { step: 3, title: 'Configure Database Credentials', codeCommand: 'src/main/resources/db.properties', description: 'Adjust DB_USER and DB_PASS to match your local MySQL configuration.' },
      { step: 4, title: 'Execute Main Application', codeCommand: 'mvn javafx:run', description: 'Starts the JavaFX GUI dashboard and active vehicle simulation loop.' }
    ],
    featured: true,
    createdAt: '2025-02-01',
    downloadsCount: 312,
    academicYear: '2025–2026',
    colorTheme: '#D97706'
  },
  {
    id: 'proj-003',
    title: 'Enterprise Student Information & Examination System',
    slug: 'student-management-system-spring-boot',
    category: 'Java & Spring Boot',
    primaryLanguage: 'Java',
    techStack: ['Spring Boot 3', 'Spring Security 6', 'MySQL', 'Thymeleaf / REST', 'Hibernate JPA', 'JasperReports'],
    price: 1899,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 167,
    shortDescription: 'Institutional student lifecycle management system featuring attendance tracking, fee management, semester grade cards, and role-based access control.',
    overview: 'Engineered for universities and engineering colleges, this Spring Boot 3 enterprise application centralizes student admissions, course enrollments, faculty grade submissions, fee receipts, and JasperReports PDF report card generation.',
    problemStatement: 'Educational institutions frequently battle disjointed legacy desktop tools, causing delays in marks tabulation, attendance shortages, and manual hall ticket issuance.',
    objectives: [
      'Provide Role-Based Access Control (RBAC) across Admin, Faculty, and Student tiers',
      'Automate grade point calculation (SGPA/CGPA) with institutional grading rules',
      'Generate automated digital hall tickets with barcode validation',
      'Implement printable JasperReports for fee receipts and official mark sheets'
    ],
    features: [
      { title: 'Three-Tier RBAC Portal', description: 'Separate secure spaces for College Dean, Faculty Instructors, and Students.' },
      { title: 'Automated GPA Tabulation', description: 'Instant calculation of internal assessments, semester exams, and final grade letters.' },
      { title: 'Fee Payment & Receipt Engine', description: 'Tracks tuition fees, installment plans, and issues digitally signed PDF receipts.' },
      { title: 'Attendance Analytics', description: 'Daily attendance logs with automatic alerts when student falls below 75% cutoff.' }
    ],
    modules: ['Student Admission & KYC', 'Course Curriculum & Faculty Allocation', 'Attendance Tracking & Alert Module', 'Examination & Grade Tabulation', 'Fee Billing & Jasper Reporting'],
    requirements: {
      hardware: ['Intel i3 8th Gen or above', '4 GB RAM minimum', '1 GB disk space'],
      software: ['JDK 17 or JDK 21', 'MySQL Server 8+', 'Maven 3.8+', 'Postman (for API testing)'],
      dependencies: ['spring-boot-starter-web', 'spring-boot-starter-security', 'spring-boot-starter-data-jpa', 'jasperreports@6.20+']
    },
    documentationIncluded: [
      { item: 'University Standard Project Report', format: 'PDF & DOCX (90 Pages)', description: 'Thorough chapters covering SDLC, SRS, Architecture, Testing, and Conclusion.' },
      { item: 'Database ER Diagram & Data Dictionary', format: 'PDF & PNG', description: 'Full normalized 3NF database schema diagrams and relationship mappings.' },
      { item: 'Postman Collection & API Docs', format: 'JSON & Swagger UI', description: 'Exported endpoints for all 38 REST controllers.' },
      { item: 'External Examiner Viva Preparation', format: 'PDF (20 Pages)', description: 'Spring framework core questions, dependency injection, JPA lifecycle, and security filters.' },
      { item: 'Presentation Deck', format: 'PPTX (25 Slides)', description: 'Complete system workflow slides and screen demonstrations.' }
    ],
    installationSteps: [
      { step: 1, title: 'Create MySQL Database', codeCommand: 'CREATE DATABASE student_erp_db;', description: 'Set up empty schema for Spring Data JPA auto-generation.' },
      { step: 2, title: 'Update application.properties', codeCommand: 'src/main/resources/application.properties', description: 'Provide spring.datasource.username and spring.datasource.password.' },
      { step: 3, title: 'Build Project with Maven', codeCommand: 'mvn clean package -DskipTests', description: 'Downloads all spring starters and compiles executable JAR.' },
      { step: 4, title: 'Run Spring Boot App', codeCommand: 'mvn spring-boot:run', description: 'Application starts on http://localhost:8080 with seeded demo credentials.' }
    ],
    featured: true,
    createdAt: '2025-01-20',
    downloadsCount: 520,
    academicYear: '2025–2026',
    colorTheme: '#059669'
  },
  {
    id: 'proj-004',
    title: 'Automated Fake News Detection & Fact Verification',
    slug: 'fake-news-detection-python-ml',
    category: 'AI & Machine Learning',
    primaryLanguage: 'Python',
    techStack: ['Python 3.10', 'Scikit-Learn', 'BERT', 'NLP', 'Flask / Streamlit', 'Pandas'],
    price: 2199,
    originalPrice: 3599,
    rating: 4.8,
    reviewsCount: 110,
    shortDescription: 'Natural Language Processing pipeline leveraging TF-IDF, Passive-Aggressive Classifier, and fine-tuned BERT transformer models to classify misinformation in digital articles.',
    overview: 'This project utilizes state-of-the-art NLP techniques to analyze semantic markers, sentiment polarization, and lexical features of news articles. Trained on benchmark datasets (ISOT & LIAR), it achieves 94.6% classification accuracy with an intuitive web verification dashboard.',
    problemStatement: 'Rapid proliferation of fabricated stories on social media compromises democratic discourse and creates panic during public health emergencies.',
    objectives: [
      'Preprocess raw text data through tokenization, lemmatization, and stop-word removal',
      'Train and benchmark multiple ML classifiers (PassiveAggressive, Naive Bayes, BERT)',
      'Produce confidence scores and highlight deceptive linguistic indicators',
      'Expose a lightweight REST endpoint for live URL or raw text verification'
    ],
    features: [
      { title: 'Multi-Model Inference', description: 'Compares lightweight TF-IDF predictions against transformer embeddings.' },
      { title: 'Interactive Web Verifier', description: 'Paste news text or article URL to obtain authenticity likelihood and word importance.' },
      { title: 'Linguistic Feature Heatmap', description: 'Highlights sensationalist words and clickbait phrases directly in the text.' },
      { title: 'Model Evaluation Benchmarks', description: 'Interactive confusion matrices, ROC-AUC curves, and classification reports.' }
    ],
    modules: ['Data Ingestion & Cleaning Pipeline', 'Feature Extraction (TF-IDF & Embeddings)', 'Model Training & Hyperparameter Tuning', 'Flask Inference Web API', 'Streamlit Interactive Dashboard'],
    requirements: {
      hardware: ['Intel i5 or AMD Ryzen / Apple M-series', '8 GB RAM', 'Optional NVIDIA GPU for faster BERT fine-tuning'],
      software: ['Python 3.9 or 3.10', 'Jupyter Notebook / Google Colab', 'Git', 'Modern browser'],
      dependencies: ['scikit-learn==1.3+', 'transformers==4.30+', 'flask==2.3+', 'pandas==2.0+', 'nltk==3.8+']
    },
    documentationIncluded: [
      { item: 'IEEE Research Format Project Report', format: 'PDF & LaTeX Source (78 Pages)', description: 'Theoretical background on vector spaces, attention mechanisms, and metrics.' },
      { item: 'Jupyter Notebook with EDA', format: 'IPYNB', description: 'Step-by-step exploratory data analysis with matplotlib and seaborn plots.' },
      { item: 'Cleaned Dataset Files', format: 'CSV (ISOT Dataset)', description: 'Curated and pre-labeled corpus of over 40,000 real and fake news articles.' },
      { item: 'Viva Voce Master Guide', format: 'PDF (16 Pages)', description: 'Key questions on Precision vs Recall, Overfitting, BERT vs Word2Vec, and ROC curves.' },
      { item: 'Defense PPT Presentation', format: 'PPTX (20 Slides)', description: 'High-impact visual slides explaining model architecture and test results.' }
    ],
    installationSteps: [
      { step: 1, title: 'Create Python Virtual Environment', codeCommand: 'python -m venv venv && source venv/bin/activate', description: 'Isolate dependencies to prevent package version conflicts.' },
      { step: 2, title: 'Install Python Requirements', codeCommand: 'pip install -r requirements.txt', description: 'Installs Flask, Scikit-Learn, Pandas, and NLTK.' },
      { step: 3, title: 'Download NLTK Corpora', codeCommand: 'python -c "import nltk; nltk.download(\'stopwords\')"', description: 'Sets up linguistic stop-word dictionaries.' },
      { step: 4, title: 'Launch Web App', codeCommand: 'python app.py', description: 'Starts the web analyzer at http://localhost:5000.' }
    ],
    featured: false,
    createdAt: '2025-02-10',
    downloadsCount: 290,
    academicYear: '2025–2026',
    colorTheme: '#7C3AED'
  },
  {
    id: 'proj-005',
    title: 'Full-Stack E-Commerce Platform with Payment Gateway',
    slug: 'ecommerce-website-react-spring-boot',
    category: 'Web Development',
    primaryLanguage: 'Java',
    techStack: ['React 18', 'Spring Boot 3', 'MySQL', 'Stripe / Razorpay API', 'Tailwind CSS', 'Redux Toolkit'],
    price: 2499,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 182,
    shortDescription: 'Modern production-style shopping portal with real-time product inventory, cart state management, Razorpay payment integration, and administrative order fulfillment.',
    overview: 'Built using decoupled architecture with React on the client and Java Spring Boot 3 on the server, this e-commerce project simulates modern shopping experiences with product reviews, order tracking, and invoice downloads.',
    problemStatement: 'Monolithic academic e-commerce projects rely on outdated JSP technology without modern decoupled frontend states, reactive carts, or real payment webhooks.',
    objectives: [
      'Build a modern responsive storefront with product category filters and keyword search',
      'Implement atomic transactions in Spring Boot to avoid race conditions during inventory checkout',
      'Integrate mock payment gateway flow with cryptographic signature verification',
      'Develop admin dashboard for product management, stock monitoring, and order status updates'
    ],
    features: [
      { title: 'Interactive Product Catalog', description: 'Infinite scroll, price range sliders, brand filters, and stock status indicators.' },
      { title: 'Persistent Shopping Cart', description: 'Redux-managed cart preserved across browser sessions with coupon discount code support.' },
      { title: 'Checkout & Payment Flow', description: 'Address validation, simulated UPI / Card checkout modal, and automated invoice creation.' },
      { title: 'Merchant Operations Console', description: 'Product CRUD operations with image upload, revenue charts, and dispatch status.' }
    ],
    modules: ['Catalog & Product Browsing', 'Cart & Wishlist Engine', 'Checkout & Order Placement', 'Customer Profile & Order History', 'Merchant Inventory Dashboard'],
    requirements: {
      hardware: ['Intel i5 or higher', '8 GB RAM', '3 GB free storage'],
      software: ['JDK 17', 'Node.js v18+', 'MySQL 8.0+', 'Maven 3.8+'],
      dependencies: ['spring-boot-starter-web', 'spring-boot-starter-data-jpa', 'react@18+', 'reduxjs/toolkit', 'axios']
    },
    documentationIncluded: [
      { item: 'Comprehensive Final Year Thesis Report', format: 'PDF & DOCX (95 Pages)', description: 'Complete documentation meeting Anna University, VTU, and JNTU guidelines.' },
      { item: 'API Documentation (Swagger 3.0)', format: 'OpenAPI JSON & HTML', description: 'Full REST specifications for all product, order, and user routes.' },
      { item: 'Database ERD & SQL Seed Script', format: 'SQL & PDF', description: 'Pre-populated with 50 realistic consumer electronics and fashion products.' },
      { item: 'Viva Voce Exam Questions', format: 'PDF (22 Pages)', description: 'Covers CORS, REST vs GraphQL, Spring Transactional annotations, and Redux flow.' },
      { item: 'Project Defense Slide Deck', format: 'PPTX (26 Slides)', description: 'Polished animations and diagrams ready for final internal and external viva.' }
    ],
    installationSteps: [
      { step: 1, title: 'Database Setup', codeCommand: 'mysql -u root -p < ecommerce_dump.sql', description: 'Creates ecommerce_db and populates sample catalog.' },
      { step: 2, title: 'Run Spring Boot Backend', codeCommand: 'cd backend && mvn spring-boot:run', description: 'Runs backend on http://localhost:8080 with Swagger at /swagger-ui.html.' },
      { step: 3, title: 'Install Frontend Packages', codeCommand: 'cd ../frontend && npm install', description: 'Installs React, Tailwind, and Lucide icons.' },
      { step: 4, title: 'Start Frontend Client', codeCommand: 'npm run dev', description: 'Opens client on http://localhost:5173 with proxy configured.' }
    ],
    featured: true,
    createdAt: '2025-01-25',
    downloadsCount: 475,
    academicYear: '2025–2026',
    colorTheme: '#2563EB'
  },
  {
    id: 'proj-006',
    title: 'Hospital & Patient Healthcare Management System',
    slug: 'hospital-management-system-java-mysql',
    category: 'Java & Spring Boot',
    primaryLanguage: 'Java',
    techStack: ['Java 17', 'Spring Boot', 'MySQL 8', 'Hibernate', 'Bootstrap / React', 'Chart.js'],
    price: 1799,
    originalPrice: 2899,
    rating: 4.7,
    reviewsCount: 88,
    shortDescription: 'Clinical records platform facilitating doctor appointment scheduling, OPD billing, digital prescription generation, and diagnostic lab reports.',
    overview: 'Designed to streamline healthcare facilities, this system connects reception staff, medical practitioners, lab technicians, and patients. It ensures accurate medical history tracking, prevents appointment overlaps, and issues digital prescriptions.',
    problemStatement: 'Paper-based patient registries lead to lost diagnostic history, billing errors, prolonged OPD wait times, and poor coordination between doctors and pharmacies.',
    objectives: [
      'Centralize patient electronic medical records (EMR) accessible to licensed physicians',
      'Automate doctor shift availability calendars and token scheduling',
      'Generate computerized prescriptions with pharmacy dispensing status',
      'Provide hospital administrators with bed occupancy and revenue summaries'
    ],
    features: [
      { title: 'OPD & Appointment Scheduling', description: 'Doctor slot booking with intelligent token generation and waiting room queue display.' },
      { title: 'Doctor Clinical Workspace', description: 'Review past visit notes, allergies, and enter structured diagnosis and medication lists.' },
      { title: 'Lab Diagnostics Module', description: 'Order blood, imaging, or pathology tests and upload test results directly to patient profile.' },
      { title: 'Automated Billing & Invoicing', description: 'Aggregates consultation fees, lab charges, and bed charges into a consolidated bill.' }
    ],
    modules: ['Reception & Patient Registration', 'Doctor Clinical Desk', 'Laboratory & Test Reports', 'Pharmacy & Inventory', 'Admin & Audit Logs'],
    requirements: {
      hardware: ['Intel i3 or AMD equivalent', '4 GB RAM', '1.5 GB disk space'],
      software: ['JDK 17+', 'MySQL 8.0+', 'Maven', 'IntelliJ / Eclipse'],
      dependencies: ['spring-boot-starter-web', 'spring-boot-starter-data-jpa', 'mysql-connector-j', 'itextpdf (for prescriptions)']
    },
    documentationIncluded: [
      { item: 'Standard Engineering Project Report', format: 'PDF & DOCX (88 Pages)', description: 'Complete write-up with hospital workflow analysis and system specifications.' },
      { item: 'UML Models & Use Case Matrices', format: 'High-Res PNG', description: 'Hospital actor interaction diagrams, state transition models, and ER schema.' },
      { item: 'Seeded Database Backup', format: 'SQL File', description: 'Contains 20 mock doctors across departments, 100 sample patients, and fee structures.' },
      { item: 'Viva Voce Q&A Companion', format: 'PDF (16 Pages)', description: 'Explains database normalization, HIPAA data privacy principles, and Hibernate transactions.' },
      { item: 'Seminar PowerPoint Presentation', format: 'PPTX (22 Slides)', description: 'Ready-to-present slide deck highlighting system modularity.' }
    ],
    installationSteps: [
      { step: 1, title: 'Database Initialization', codeCommand: 'mysql -u root -p < hospital_schema.sql', description: 'Loads tables and initial administrative roles.' },
      { step: 2, title: 'Configure Database Properties', codeCommand: 'src/main/resources/application.yml', description: 'Set your database username and password.' },
      { step: 3, title: 'Compile and Package', codeCommand: 'mvn clean install', description: 'Resolves all medical reporting and PDF compilation libraries.' },
      { step: 4, title: 'Run Application', codeCommand: 'mvn spring-boot:run', description: 'Accessible at http://localhost:8080.' }
    ],
    featured: false,
    createdAt: '2025-02-14',
    downloadsCount: 260,
    academicYear: '2025–2026',
    colorTheme: '#0284C7'
  },
  {
    id: 'proj-007',
    title: 'AI Face Recognition Biometric Attendance System',
    slug: 'face-recognition-attendance-system-python',
    category: 'AI & Machine Learning',
    primaryLanguage: 'Python',
    techStack: ['Python 3.10', 'OpenCV', 'face_recognition', 'dlib', 'SQLite / MySQL', 'Tkinter / Flask'],
    price: 2299,
    originalPrice: 3699,
    rating: 4.9,
    reviewsCount: 135,
    shortDescription: 'Real-time contactless facial recognition attendance tracker using 128-dimensional deep metric embeddings to identify and mark students automatically via webcam.',
    overview: 'Eliminating proxy attendance and manual sign-in sheets, this AI application detects multiple faces in real-time video frames, extracts 68 facial landmarks, generates deep feature vector embeddings, and marks attendance into a database with anti-spoofing liveness checks.',
    problemStatement: 'Traditional paper rolls or fingerprint scanners are slow, unhygienic, prone to proxy entries, and create long entry queues before college lectures.',
    objectives: [
      'Capture and encode student facial datasets with automated crop and augmentation',
      'Achieve sub-second facial matching under varying classroom lighting conditions',
      'Incorporate eye-blink liveness detection to prevent photo and screen spoofing',
      'Export daily attendance registers directly into Excel / CSV format for college ERP'
    ],
    features: [
      { title: 'Sub-Second Detection & Match', description: 'Locates faces using HOG / CNN detector and matches against 128D encodings database.' },
      { title: 'Anti-Spoofing Liveness Verification', description: 'Tracks Eye Aspect Ratio (EAR) blinks to ensure physically present human attendance.' },
      { title: 'Student Enrollment Studio', description: 'Interactive camera module that captures 30 varied angle headshots in 10 seconds.' },
      { title: 'Automated Excel Export', description: 'One-click generation of monthly percentage reports ready for academic coordinators.' }
    ],
    modules: ['Face Dataset Ingestion & Augmentation', 'Encoding Extractor (dlib ResNet-34)', 'Real-Time Camera Recognition Stream', 'Liveness Blink Detector', 'Attendance Database & Excel Exporter'],
    requirements: {
      hardware: ['Intel i5 or higher / Apple Silicon', '8 GB RAM', 'Integrated 720p HD webcam or external USB camera'],
      software: ['Python 3.9 or 3.10 (64-bit)', 'Visual Studio C++ Build Tools (for dlib compilation)', 'Conda or Python venv'],
      dependencies: ['opencv-python==4.8+', 'face-recognition==1.3+', 'dlib==19.24+', 'numpy==1.24+', 'pandas==2.0+']
    },
    documentationIncluded: [
      { item: 'Complete Academic Thesis Report', format: 'PDF & DOCX (82 Pages)', description: 'Details mathematical formulas of Euclidean distance matching and HOG feature descriptors.' },
      { item: 'UML & Computer Vision Pipeline Diagrams', format: 'PDF & High-Res PNG', description: 'System flowchart from camera frame capture to SQL attendance commit.' },
      { item: 'Pre-Trained Encodings Dataset Demo', format: 'Pickle (.pkl) & CSV', description: 'Ready sample student dataset for immediate live demonstration.' },
      { item: 'Comprehensive Viva Voce Booklet', format: 'PDF (18 Pages)', description: 'Covers CNN vs HOG, Triplet Loss, Cosine Similarity, and Liveness defense strategies.' },
      { item: 'Viva PPT Presentation Deck', format: 'PPTX (24 Slides)', description: 'Includes live demo guide, architecture slides, and performance benchmark tables.' }
    ],
    installationSteps: [
      { step: 1, title: 'Setup Virtual Environment', codeCommand: 'conda create -n face_att python=3.10 -y && conda activate face_att', description: 'Conda handles dlib and CMake pre-requisites cleanly.' },
      { step: 2, title: 'Install Dependencies', codeCommand: 'pip install -r requirements.txt', description: 'Installs OpenCV, face-recognition, and Pandas.' },
      { step: 3, title: 'Register Students Dataset', codeCommand: 'python register_student.py --id 2026CS101', description: 'Takes sample snapshots of student faces to build encodings.' },
      { step: 4, title: 'Launch Attendance Tracker', codeCommand: 'python main_attendance.py', description: 'Opens webcam stream, detects faces, and logs attendance automatically.' }
    ],
    featured: true,
    createdAt: '2025-01-18',
    downloadsCount: 395,
    academicYear: '2025–2026',
    colorTheme: '#7C3AED'
  },
  {
    id: 'proj-008',
    title: 'Automated College Library Management System',
    slug: 'library-management-system-java',
    category: 'Java & Spring Boot',
    primaryLanguage: 'Java',
    techStack: ['Java 17', 'Swing / JavaFX', 'MySQL 8', 'JDBC', 'Barcode Reader Support', 'iText PDF'],
    price: 0,
    originalPrice: 0,
    isFree: true,
    accessType: 'FREE',
    publicationStatus: 'PUBLISHED',
    claimCount: 340,
    rating: 4.7,
    reviewsCount: 76,
    shortDescription: 'Academic library automation solution featuring ISBN barcode book cataloging, automated overdue fine calculation, book reservations, and student library cards.',
    overview: 'A robust desktop and client-server library solution crafted in Java and MySQL. It enables librarians to scan book barcodes for lightning-fast checkouts, auto-calculates per-day overdue fines, and generates monthly book inventory audits.',
    problemStatement: 'Manual library registers lead to untracked book losses, inaccurate fine collections, misplaced books, and agonizingly slow queue times during peak semester end periods.',
    objectives: [
      'Implement barcode scanning for rapid book issuance and returns',
      'Compute differential fine rules based on undergraduate vs faculty borrowing allowances',
      'Maintain indexed catalog searchable by title, author, category, and ISBN',
      'Generate printable library membership cards and circulation receipts'
    ],
    features: [
      { title: 'Barcode Circulation Desk', description: 'Scan student ID barcode and book ISBN for instant issue/return in 3 seconds.' },
      { title: 'Overdue Fine Automator', description: 'Auto-computes fines based on university holiday calendar and borrowing rules.' },
      { title: 'Comprehensive OPAC Search', description: 'Students can search book availability, shelf location, and place hold requests.' },
      { title: 'Audit & Stock Verification', description: 'Inventory verification tool that flags lost, damaged, or unreturned volumes.' }
    ],
    modules: ['Book Cataloging & ISBN Management', 'Member Registration & Card Generation', 'Circulation (Issue / Return / Renew)', 'Fine Billing & Payment Logging', 'Reports & Stock Audit'],
    requirements: {
      hardware: ['Intel i3 or higher', '4 GB RAM', 'Standard USB Barcode Scanner (optional, keyboard wedge)'],
      software: ['JDK 17', 'MySQL Server 8.0+', 'NetBeans / IntelliJ / Eclipse'],
      dependencies: ['mysql-connector-j', 'itextpdf', 'jcalendar']
    },
    documentationIncluded: [
      { item: 'Full University Format Report', format: 'PDF & DOCX (80 Pages)', description: 'Structured academic report complete with database schema and test cases.' },
      { item: 'Entity Relationship Diagram & UML', format: 'PNG & StarUML', description: 'Complete class diagrams, schema mappings, and use case diagrams.' },
      { item: 'Database SQL Seed Script', format: 'SQL File', description: 'Pre-loaded with 300 engineering reference books, authors, and Dewey decimal tags.' },
      { item: 'Viva Voce Examination Questions', format: 'PDF (15 Pages)', description: 'JDBC connection pooling, PreparedStatement security against SQL Injection, and event listeners.' },
      { item: 'Final Review PPT', format: 'PPTX (20 Slides)', description: 'Concise slides detailing architecture, problem statement, and demo screenshots.' }
    ],
    installationSteps: [
      { step: 1, title: 'Database Import', codeCommand: 'mysql -u root -p < library_db.sql', description: 'Sets up library schema with sample catalog.' },
      { step: 2, title: 'Configure DB Connection', codeCommand: 'src/com/library/util/DBConnection.java', description: 'Update URL, username, and password.' },
      { step: 3, title: 'Compile Java Files', codeCommand: 'javac -cp "lib/*:." src/com/library/main/Main.java', description: 'Compiles all source files.' },
      { step: 4, title: 'Launch Desktop Application', codeCommand: 'java -cp "lib/*:src" com.library.main.Main', description: 'Opens the librarian dashboard login window.' }
    ],
    featured: false,
    createdAt: '2025-02-18',
    downloadsCount: 340,
    academicYear: '2025–2026',
    colorTheme: '#D97706'
  },
  {
    id: 'proj-009',
    title: 'IoT Smart Agriculture & Automated Soil Irrigation',
    slug: 'smart-agriculture-iot-esp32',
    category: 'IoT & Embedded',
    primaryLanguage: 'Python',
    techStack: ['Python', 'ESP32', 'MQTT', 'Flask', 'Soil Moisture Sensors', 'DHT11'],
    price: 0,
    originalPrice: 0,
    isFree: true,
    accessType: 'FREE',
    publicationStatus: 'PUBLISHED',
    claimCount: 195,
    rating: 4.8,
    reviewsCount: 89,
    shortDescription: 'Precision farming telemetry system that monitors soil moisture, ambient humidity, and temperature via ESP32 microcontrollers to trigger automated water pump solenoids.',
    overview: 'This IoT engineering project demonstrates closed-loop automated irrigation. Sensor nodes deployed in farmland transmit soil telemetry over MQTT to a Python cloud dashboard, enabling farmers to schedule irrigation or trigger water solenoids remotely.',
    problemStatement: 'Inefficient manual irrigation wastes up to 45% of groundwater and causes crop damage from over-saturation or prolonged under-watering.',
    objectives: [
      'Read multi-depth capacitive soil moisture and ambient weather metrics',
      'Stream lightweight sensor packets via MQTT broker (Mosquitto)',
      'Trigger 5V relay water solenoid valves when soil moisture dips below configurable threshold',
      'Render live real-time graph dashboards with weather forecast integration'
    ],
    features: [
      { title: 'Closed-Loop Irrigation', description: 'Automatic motor switching with dry-run protection and water usage counter.' },
      { title: 'Real-Time Telemetry Dashboard', description: 'Live line charts of soil moisture %, ambient temperature, and humidity.' },
      { title: 'Emergency SMS / Email Alert', description: 'Notifies the farmer if water level in reservoir is depleted or pump fails.' },
      { title: 'Solar Powered Edge Node Code', description: 'Low-power deep sleep cycles for off-grid ESP32 solar battery operation.' }
    ],
    modules: ['ESP32 Firmware & Sensor Acquisition', 'MQTT Broker & Telemetry Gateway', 'Python Backend & Threshold Controller', 'Web Monitoring Dashboard', 'Alert Notification Dispatcher'],
    requirements: {
      hardware: ['ESP32 NodeMCU Dev Board', 'Capacitive Soil Moisture Sensor v1.2', 'DHT11 / DHT22 Sensor', '5V Relay Module & Submersible DC Water Pump'],
      software: ['Arduino IDE with ESP32 Board Manager', 'Python 3.9+', 'Mosquitto MQTT Broker'],
      dependencies: ['paho-mqtt', 'flask', 'plotly', 'adafruit-dht']
    },
    documentationIncluded: [
      { item: 'Hardware & Software Project Report', format: 'PDF & DOCX (86 Pages)', description: 'Detailed circuit pinout schematics, power consumption analysis, and code listings.' },
      { item: 'Circuit & Breadboard Wiring Diagrams', format: 'Fritzing (.fzz) & High-Res PNG', description: 'Step-by-step pin connection schematics with resistor values and protection diodes.' },
      { item: 'Firmware & Backend Source Files', format: 'C++ (.ino) & Python (.py)', description: 'Cleanly commented source ready for flashing into ESP32.' },
      { item: 'Viva Voce Exam Questions', format: 'PDF (16 Pages)', description: 'Key questions on MQTT vs HTTP, ADC calibration, ESP32 deep sleep, and relay isolation.' },
      { item: 'Seminar Presentation', format: 'PPTX (22 Slides)', description: 'Rich presentation with block diagrams, IoT architecture, and field results.' }
    ],
    installationSteps: [
      { step: 1, title: 'Flash ESP32 Firmware', codeCommand: 'Upload via Arduino IDE', description: 'Configure your WiFi SSID and MQTT server IP.' },
      { step: 2, title: 'Start MQTT Broker', codeCommand: 'mosquitto -v', description: 'Launches local MQTT messaging broker.' },
      { step: 3, title: 'Run Python Telemetry Bridge', codeCommand: 'python telemetry_server.py', description: 'Receives sensor packets and updates web visualizer.' },
      { step: 4, title: 'View Real-Time Dashboard', codeCommand: 'http://localhost:5000', description: 'Displays live gauges and automatic pump controls.' }
    ],
    featured: false,
    createdAt: '2025-02-05',
    downloadsCount: 195,
    academicYear: '2025–2026',
    colorTheme: '#EA580C'
  },
  {
    id: 'proj-010',
    title: 'Blockchain-Based Academic Degree Certificate Verification',
    slug: 'blockchain-certificate-verification',
    category: 'Cybersecurity & Cloud',
    primaryLanguage: 'JavaScript',
    techStack: ['Solidity', 'Ethereum / Polygon', 'Ethers.js', 'React.js', 'IPFS / Pinata', 'MetaMask'],
    price: 2599,
    originalPrice: 4299,
    rating: 4.9,
    reviewsCount: 92,
    shortDescription: 'Decentralized document verification platform issuing cryptographically tamper-proof academic credentials on Ethereum blockchain with IPFS decentralized storage.',
    overview: 'Solves academic credential forgery by anchoring cryptographic certificate hashes directly onto an immutable blockchain smart contract. Employers can scan a QR code to instantaneously verify graduate authenticity without contacting university registrars.',
    problemStatement: 'Forged university degrees and manipulated transcripts threaten corporate hiring integrity and take universities weeks to manually verify.',
    objectives: [
      'Write and deploy ERC-721 / verifiable credential Solidity smart contract',
      'Store high-resolution certificate PDFs on decentralized InterPlanetary File System (IPFS)',
      'Allow university registrar to issue signed credentials using institutional private key',
      'Provide public 1-click verification portal through cryptographic hash comparison'
    ],
    features: [
      { title: 'Immutable Smart Contract', description: 'Audited Solidity contract mapping cryptographic certificate hashes to student roll numbers.' },
      { title: 'Decentralized IPFS Storage', description: 'Certificates stored on IPFS ensuring permanent availability and content addressing.' },
      { title: 'Instant QR Code Verification', description: 'Employers scan QR code on physical certificate to view instant on-chain proof.' },
      { title: 'Registrar Batch Minting', description: 'Upload university graduating class CSV to batch-mint 500 certificates in one transaction.' }
    ],
    modules: ['Solidity Smart Contract (Hardhat)', 'University Registrar Minting Portal', 'Decentralized IPFS Storage Node', 'Public Verification Web Portal', 'MetaMask Web3 Provider'],
    requirements: {
      hardware: ['Intel i5 or higher', '8 GB RAM', 'Internet connection for testnet RPC'],
      software: ['Node.js v18+', 'MetaMask Browser Extension', 'Hardhat / Truffle', 'VS Code'],
      dependencies: ['ethers@6.x', 'hardhat', '@openzeppelin/contracts', 'react@18+', 'pinata/sdk']
    },
    documentationIncluded: [
      { item: 'Comprehensive Final Year Report', format: 'PDF & DOCX (94 Pages)', description: 'Explains SHA-256 hashing, asymmetric cryptography, consensus algorithms, and smart contracts.' },
      { item: 'Smart Contract Architecture & State Diagrams', format: 'PNG & Draw.io', description: 'Visual mapping of owner permissions, minting states, and verification transactions.' },
      { item: 'Hardhat Deployment Scripts & Tests', format: 'JavaScript / TypeScript', description: 'Includes 100% test coverage suite asserting verification constraints.' },
      { item: 'Viva Voce Master Booklet', format: 'PDF (20 Pages)', description: 'Top questions on Gas fees, Proof of Stake, 51% attack, and IPFS content identifiers.' },
      { item: 'Viva Presentation Slides', format: 'PPTX (25 Slides)', description: 'Diagram-rich deck ready for department external viva examiners.' }
    ],
    installationSteps: [
      { step: 1, title: 'Install Dependencies', codeCommand: 'npm install', description: 'Installs Hardhat, Ethers, and OpenZeppelin contracts.' },
      { step: 2, title: 'Compile Smart Contracts', codeCommand: 'npx hardhat compile', description: 'Builds ABI artifacts and checks Solidity syntax.' },
      { step: 3, title: 'Deploy to Local Hardhat Node', codeCommand: 'npx hardhat node & npx hardhat run scripts/deploy.js --network localhost', description: 'Deploys contract locally.' },
      { step: 4, title: 'Run Verification Web UI', codeCommand: 'cd frontend && npm run dev', description: 'Opens verification app connected to local node.' }
    ],
    featured: false,
    createdAt: '2025-02-12',
    downloadsCount: 220,
    academicYear: '2025–2026',
    colorTheme: '#0284C7'
  }
];

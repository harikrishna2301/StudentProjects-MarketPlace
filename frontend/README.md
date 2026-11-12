# ProjectKit — React + Vite Frontend

Client web application for **ProjectKit — Student Projects Marketplace**, providing modern UI for exploring and downloading academic engineering project kits, purchasing kits with Razorpay checkout, tracking entitlements in the student dashboard, and managing catalog items via the admin console.

---

## 1. Technologies

- **Framework:** React 19 + TypeScript
- **Bundler / Dev Server:** Vite 6
- **Styling:** Tailwind CSS v4 + Custom Design Tokens (Midnight Violet `#0B0720`, Royal Purple `#25134D`, Electric Violet `#6A2FC8`, Luminous Lilac `#D1B8FF`)
- **Typography:** Outfit (Headings) & DM Sans (Content & Project Titles)
- **Routing:** React Router v7
- **HTTP Client:** Axios with JWT Bearer Interceptors
- **Icons:** Lucide React
- **Animations:** Motion & CSS 3D Depth Utilities

---

## 2. Directory Structure

```text
frontend/
├── public/                 # Static assets, favicon, mockups
├── src/
│   ├── assets/             # Brand logos and graphic resources
│   ├── components/         # Reusable UI components (Hero, Navbar, ProjectCard, CategoryCard, etc.)
│   ├── context/            # React Context providers (AuthContext, ProjectsContext, CartContext, WishlistContext)
│   ├── data/               # Academic categories, mock projects, curriculum mappings
│   ├── layouts/            # Page layouts (MainLayout, DashboardLayout)
│   ├── pages/              # Routed pages (Home, Projects, ProjectDetails, Checkout, Dashboards, Auth)
│   ├── services/           # Backend API integration clients (authService, projectService, orderService, etc.)
│   ├── types/              # TypeScript interface definitions (User, Project, Order, Category, etc.)
│   ├── utils/              # Helper utilities (currency formatters, string sanitizers, validators)
│   ├── App.tsx             # Root router view hierarchy
│   ├── index.css           # Global Tailwind CSS definitions and custom design system
│   └── main.tsx            # React application entry point
├── index.html              # HTML shell with Google Fonts and viewport metadata
├── package.json            # Node.js dependencies and run scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build pipeline and proxy configurations
```

---

## 3. Getting Started

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm or bun

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your configuration:

```env
VITE_BACKEND_URL=http://localhost:8081
VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyId
VITE_APP_TITLE=ProjectKit — Student Projects Marketplace
```

### Running Locally

```bash
npm run dev
```

The application runs on `http://localhost:3000` (or `http://localhost:5173`) with API proxying to `http://localhost:8081`.

### Production Build

```bash
npm run build
```

Compiled static artifacts are generated into the `dist/` directory ready for deployment on Netlify, Vercel, AWS S3, or Nginx.

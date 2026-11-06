# ProjectKit SEO & Search Discoverability Documentation

This document outlines the search engine optimization (SEO) architecture, indexing strategies, structured data schemas, and discoverability plans for **ProjectKit** (`https://projectkit.in`).

---

## 1. SPA Prerendering & Server-Side Rendering (SSR) Evaluation

### The Reality of Modern Search Engine Indexing
ProjectKit is built as a single-page React application powered by Vite. A common misconception is that client-side dynamic `<meta>` tags and `<script>` injections alone guarantee universal indexing:

| Search Engine / Crawler | JavaScript Execution Capability | Implications for ProjectKit |
| :--- | :--- | :--- |
| **Googlebot (Evergreen Chromium)** | High (renders JS in 2-phase indexing queue) | Fully indexes client-rendered routes, but experiences crawl budget delays during peak traffic. |
| **Bingbot / DuckDuckGo** | Moderate (partial JS rendering) | Best served with pre-rendered HTML DOM. |
| **Social Unfurlers (WhatsApp, Twitter/X, LinkedIn, Slack)** | **None (Zero JS execution)** | Read only raw initial HTML payload delivered on initial HTTP GET. |

### Technical Decision: Netlify Edge Prerendering / Static Generation
To guarantee that WhatsApp, LinkedIn, X, and search engine crawlers receive fully populated `<title>`, `<meta description>`, OpenGraph tags, and JSON-LD structured data without maintaining a complex Node.js SSR runtime:

1. **Netlify Prerendering Feature**:
   - Enable **Netlify Prerendering** in **Site settings > Build & deploy > Prerendering**.
   - Netlify automatically detects crawler user-agents (e.g., `googlebot`, `bingbot`, `twitterbot`, `facebookexternalhit`) and caches server-side rendered HTML snapshots of public routes (`/`, `/projects`, `/projects/*`, `/about`, `/terms`, `/privacy`, etc.).
2. **Client-Side Canonical DOM Synchronization (`SEOHead.tsx`)**:
   - For interactive users navigating via React Router, the dedicated `<SEOHead />` component updates `document.title`, canonical tags, robots meta tags, OpenGraph properties, and Schema.org scripts on every route transition.

---

## 2. Public vs. Private NoIndex Route Matrix

### Public Indexable Pages (`robots.txt: Allow`)
- **Homepage** (`/`): Priority 1.0 (WebSite & Organization Schema)
- **Catalog** (`/projects`): Priority 0.9 (BreadcrumbList Schema)
- **Project Details** (`/projects/:id`): Priority 0.8 (Accurate Product Schema with INR pricing & stock)
- **Company About** (`/about`): Priority 0.7
- **Legal & Compliance Documents** (`/terms`, `/privacy`, `/refund-policy`, `/cookies`, `/copyright`, `/grievance`): Priority 0.5

### Strictly Non-Indexable Private Pages (`robots.txt: Disallow` & `<meta name="robots" content="noindex, nofollow" />`)
To prevent student data leakage, payment token exposure, and internal administration crawling, the following routes strictly enforce `noindex, nofollow`:
- `/login` & `/register`
- `/checkout/*` & `/payment/status/*`
- `/dashboard/*` & `/student/*` (Wishlist, My Purchases, Order History, Secure Downloads, Profile)
- `/admin/*` (Back-office management, user lists, financial audit)
- `/api/*` & `/uploads/*`

---

## 3. Schema.org JSON-LD Structured Data Implementation

### A. WebSite & Organization (Homepage: `https://projectkit.in/`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://projectkit.in/#organization",
      "name": "ProjectKit Technologies India Pvt Ltd",
      "url": "https://projectkit.in",
      "logo": "https://projectkit.in/favicon.ico",
      "description": "Verified student technology marketplace providing final-year project kits, source code, and IEEE documentation.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@projectkit.in",
        "contactType": "Customer Support",
        "areaServed": "IN"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://projectkit.in/#website",
      "url": "https://projectkit.in",
      "name": "ProjectKit",
      "publisher": { "@id": "https://projectkit.in/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://projectkit.in/projects?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

### B. Accurate Product Structured Data (`/projects/:id`)
*Policy compliance: Visible price, INR currency, and in-stock availability are verified against actual database values. No fake reviews or fabricated rating counts are emitted.*

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Online Job Portal & Recruitment System",
  "description": "Comprehensive full-stack recruitment portal with applicant tracking, employer hiring dashboard, and resume parsing.",
  "category": "Web Development",
  "offers": {
    "@type": "Offer",
    "price": "1999",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "url": "https://projectkit.in/projects/proj-001"
  }
}
```

---

## 4. Google Search Console Setup & Verification

1. **Add Property**:
   - Navigate to [Google Search Console](https://search.google.com/search-console).
   - Add property type: **Domain** (`projectkit.in`).
2. **DNS TXT Record Verification**:
   - Add the TXT verification token provided by Google to domain DNS:
     ```
     Host: @
     Type: TXT
     Value: google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     TTL: 3600
     ```
3. **Submit Sitemap**:
   - Under **Indexing > Sitemaps**, enter `sitemap.xml`.
   - Googlebot will retrieve `https://projectkit.in/sitemap.xml` and discover all canonical URLs.
4. **URL Inspection**:
   - Inspect `https://projectkit.in/projects/proj-001` using the Live Test URL feature to verify that the Chromium rendering engine successfully evaluates dynamic Product schema and OpenGraph tags.

---

## 5. Privacy-Compliant Web Analytics Integration Plan

1. **Consent-Gated Telemetry**:
   - ProjectKit maintains explicit student cookie consent via `CookieBanner.tsx` and the `cookie_preferences` database table.
   - Analytics scripts (Google Analytics 4 / Plausible Analytics) are strictly initialized **only** when `analyticsCookies: true` is granted by the student.
2. **Implementation Pattern**:
   ```ts
   // Example consent check before Google Tag Manager / GA4 injection
   const consent = localStorage.getItem('projectkit_cookie_preferences');
   if (consent && JSON.parse(consent).analytics === true) {
     // Inject Google Analytics gtag.js or privacy-first tracker
   }
   ```
3. **No PII Tracking**:
   - Student names, email addresses, order amounts, and payment IDs are strictly excluded from event query parameters.

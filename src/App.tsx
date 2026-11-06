/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

// Components & Overlays
import { WishlistToast } from './components/WishlistToast';
import { CookieBanner } from './components/CookieBanner';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Eagerly loaded primary landing view
import { Home } from './pages/Home';

// Lazily loaded route components for optimal initial bundle size
const Projects = lazy(() => import('./pages/Projects').then((m) => ({ default: m.Projects })));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails').then((m) => ({ default: m.ProjectDetails })));
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const PaymentStatus = lazy(() => import('./pages/PaymentStatus').then((m) => ({ default: m.PaymentStatus })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));

// Student Dashboard Pages (Lazy loaded)
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard })));
const MyWishlist = lazy(() => import('./pages/MyWishlist').then((m) => ({ default: m.MyWishlist })));
const MyPurchases = lazy(() => import('./pages/MyPurchases').then((m) => ({ default: m.MyPurchases })));
const OrderHistory = lazy(() => import('./pages/OrderHistory').then((m) => ({ default: m.OrderHistory })));
const Downloads = lazy(() => import('./pages/Downloads').then((m) => ({ default: m.Downloads })));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings').then((m) => ({ default: m.ProfileSettings })));

// Admin Dashboard Pages (Lazy loaded)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

// Legal & Compliance Pages (Lazy loaded)
const TermsAndConditions = lazy(() => import('./pages/legal/TermsAndConditions').then((m) => ({ default: m.TermsAndConditions })));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy').then((m) => ({ default: m.CookiePolicy })));
const RefundPolicy = lazy(() => import('./pages/legal/RefundPolicy').then((m) => ({ default: m.RefundPolicy })));
const IntellectualPropertyPolicy = lazy(() => import('./pages/legal/IntellectualPropertyPolicy').then((m) => ({ default: m.IntellectualPropertyPolicy })));
const GrievanceRedressal = lazy(() => import('./pages/legal/GrievanceRedressal').then((m) => ({ default: m.GrievanceRedressal })));

const RouteLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center py-20 bg-slate-50 dark:bg-[#070D1F]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#2F4BFF]/20 border-t-[#2F4BFF] dark:border-[#5B7BFF]/20 dark:border-t-[#5B7BFF] animate-spin" />
      <span className="text-xs font-semibold text-slate-500 dark:text-[#9AA6C7] tracking-wider uppercase">Loading View...</span>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProjectsProvider>
            <WishlistProvider>
              <CartProvider>
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                  {/* Public Storefront Routes */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/checkout/:id" element={<Checkout />} />
                    <Route path="/payment/status/:orderNumber" element={<PaymentStatus />} />
                    <Route path="/student" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/student/purchases" element={<Navigate to="/dashboard/purchases" replace />} />
                    <Route path="/student/orders" element={<Navigate to="/dashboard/orders" replace />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Legal & Compliance Routes */}
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/copyright" element={<IntellectualPropertyPolicy />} />
                    <Route path="/grievance" element={<GrievanceRedressal />} />

                    {/* Legal URL Aliases */}
                    <Route path="/legal/terms" element={<Navigate to="/terms" replace />} />
                    <Route path="/legal/privacy" element={<Navigate to="/privacy" replace />} />
                    <Route path="/legal/cookies" element={<Navigate to="/cookies" replace />} />
                    <Route path="/legal/refund-policy" element={<Navigate to="/refund-policy" replace />} />
                    <Route path="/legal/copyright" element={<Navigate to="/copyright" replace />} />
                    <Route path="/legal/grievance" element={<Navigate to="/grievance" replace />} />
                  </Route>

                  {/* Student Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardLayout role="student" />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path="wishlist" element={<MyWishlist />} />
                    <Route path="purchases" element={<MyPurchases />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="downloads" element={<Downloads />} />
                    <Route path="profile" element={<ProfileSettings />} />
                  </Route>

                  {/* Admin Dashboard Routes */}
                  <Route path="/admin" element={<DashboardLayout role="admin" />}>
                    <Route index element={<AdminDashboard initialTab="overview" />} />
                    <Route path="projects" element={<AdminDashboard initialTab="projects" />} />
                    <Route path="add-project" element={<AdminDashboard initialTab="add" />} />
                    <Route path="categories" element={<AdminDashboard initialTab="categories" />} />
                    <Route path="orders" element={<AdminDashboard initialTab="orders" />} />
                    <Route path="users" element={<AdminDashboard initialTab="users" />} />
                    <Route path="legal" element={<AdminDashboard initialTab="legal" />} />
                  </Route>

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>

                {/* Real-time Global Wishlist Notification Toast */}
                <WishlistToast />

                {/* Cookie Consent & Preferences Banner */}
                <CookieBanner />
              </CartProvider>
            </WishlistProvider>
          </ProjectsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

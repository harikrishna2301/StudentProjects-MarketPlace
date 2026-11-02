/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { WishlistProvider } from './context/WishlistContext';

// Components & Overlays
import { WishlistToast } from './components/WishlistToast';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Storefront Pages
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Student Dashboard Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { MyWishlist } from './pages/MyWishlist';
import { MyPurchases } from './pages/MyPurchases';
import { OrderHistory } from './pages/OrderHistory';
import { Downloads } from './pages/Downloads';
import { ProfileSettings } from './pages/ProfileSettings';

// Admin Dashboard Pages
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProjectsProvider>
            <WishlistProvider>
              <Routes>
                {/* Public Storefront Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
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
                </Route>

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Real-time Global Wishlist Notification Toast */}
              <WishlistToast />
            </WishlistProvider>
          </ProjectsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

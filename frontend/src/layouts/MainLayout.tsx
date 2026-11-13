import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FD] dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] font-sans transition-colors duration-200 relative">
      {/* Accessibility Skip-To-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] px-4 py-2.5 bg-[#6A2FC8] text-white font-semibold rounded-xl shadow-xl outline-none"
      >
        Skip to main content
      </a>

      {/* Floating Centered Frosted Pill Navbar */}
      <Navbar />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Main Page Content */}
      <main
        id="main-content"
        className={`flex-1 ${isHomePage ? '' : 'pt-24 sm:pt-28'}`}
      >
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

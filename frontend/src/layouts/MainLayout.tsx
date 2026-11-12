import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const { user, isAdmin, quickSwitchUser } = useAuth();
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

      {/* Optional Slim Demo Role Switcher (Non-intrusive) */}
      {showDemoBanner && (
        <aside
          aria-label="Frontend Demo Notice"
          className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800 transition-all z-40 relative"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-blue-400 shrink-0">Demo Sandbox:</span>
              <span className="truncate">
                Frontend preview ready for Java 17, Spring Boot 3 & MySQL backend integration.
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <span>Active role:</span>
                <span className="font-semibold text-white">
                  {user ? (isAdmin ? 'Admin' : 'Student') : 'Guest'}
                </span>
                <button
                  onClick={() => quickSwitchUser(isAdmin ? 'student' : 'admin')}
                  className="text-blue-400 hover:text-blue-300 underline text-[11px] ml-1"
                >
                  Switch to {isAdmin ? 'Student' : 'Admin'}
                </button>
              </div>

              <button
                onClick={() => setShowDemoBanner(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

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

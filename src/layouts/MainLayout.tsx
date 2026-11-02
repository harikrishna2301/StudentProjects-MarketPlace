import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Info, X, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const { user, isAdmin, quickSwitchUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Slim notice banner: single-line promotional/evaluation disclosure */}
      {showDemoBanner && (
        <aside
          aria-label="Frontend Demo Notice"
          className="bg-slate-900 text-slate-300 px-4 py-2 text-xs border-b border-slate-800 transition-all"
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

      {/* Main Top Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

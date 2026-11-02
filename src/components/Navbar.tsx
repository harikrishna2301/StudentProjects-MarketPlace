import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  FolderKanban,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, quickSwitchUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleCategoriesClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('popular-categories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FolderKanban className="w-4 h-4" />
            </div>
            <span>ProjectKit</span>
          </Link>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/') && location.pathname === '/' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/projects') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Explore Projects
            </Link>
            <Link
              to="/#popular-categories"
              onClick={handleCategoriesClick}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/about') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                  isActive('/dashboard') || isActive('/admin')
                    ? 'text-blue-600 font-semibold'
                    : ''
                }`}
              >
                {isAdmin ? 'Admin Console' : 'My Dashboard'}
              </Link>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">{user?.fullName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800">{user?.fullName}</p>
                      <p className="text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                        {isAdmin ? 'Administrator' : 'B.Tech Student'}
                      </span>
                    </div>

                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}</span>
                    </Link>

                    {!isAdmin && (
                      <Link
                        to="/dashboard/purchases"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Purchases</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400">
                        Demo Account Switch
                      </div>
                      <button
                        onClick={() => {
                          quickSwitchUser('student');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Switch to Student</span>
                        {!isAdmin && <span className="text-blue-600">✓</span>}
                      </button>
                      <button
                        onClick={() => {
                          quickSwitchUser('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Switch to Admin</span>
                        {isAdmin && <span className="text-blue-600">✓</span>}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800"
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800"
          >
            Explore Projects
          </Link>
          <Link
            to="/#popular-categories"
            onClick={(e) => {
              handleCategoriesClick(e);
              setMobileMenuOpen(false);
            }}
            className="block py-2 text-sm font-medium text-slate-800"
          >
            Categories
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800"
          >
            About
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-blue-600"
              >
                {isAdmin ? 'Admin Console' : 'Student Dashboard'}
              </Link>
              <button
                onClick={() => {
                  quickSwitchUser(isAdmin ? 'student' : 'admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-xs text-slate-600"
              >
                Switch role ({isAdmin ? 'to Student' : 'to Admin'})
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-red-600 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

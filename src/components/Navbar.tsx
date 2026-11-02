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
  Search,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { GlobalSearch } from './GlobalSearch';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchModalOpen, setMobileSearchModalOpen] = useState(false);
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FolderKanban className="w-4 h-4" />
            </div>
            <span>ProjectKit</span>
          </Link>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0">
            <Link
              to="/"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/') && location.pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/projects') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Explore Projects
            </Link>
            <Link
              to="/#popular-categories"
              onClick={handleCategoriesClick}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/about') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${
                  isActive('/dashboard') || isActive('/admin')
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : ''
                }`}
              >
                {isAdmin ? 'Admin Console' : 'Dashboard'}
              </Link>
            )}
          </nav>

          {/* Zone 2.5: Global Search in Header (Desktop & Large Screens) */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm mx-1 lg:mx-3">
            <GlobalSearch variant="navbar" />
          </div>

          {/* Zone 3: 1 primary action & ThemeToggle */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">{user?.fullName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.fullName}</p>
                      <p className="text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                        {isAdmin ? 'Administrator' : 'B.Tech Student'}
                      </span>
                    </div>

                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}</span>
                    </Link>

                    {!isAdmin && (
                      <Link
                        to="/dashboard/purchases"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>My Purchases</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 my-1 pt-1">
                      <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400">
                        Demo Account Switch
                      </div>
                      <button
                        onClick={() => {
                          quickSwitchUser('student');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center justify-between"
                      >
                        <span>Switch to Student</span>
                        {!isAdmin && <span className="text-blue-600 dark:text-blue-400">✓</span>}
                      </button>
                      <button
                        onClick={() => {
                          quickSwitchUser('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center justify-between"
                      >
                        <span>Switch to Admin</span>
                        {isAdmin && <span className="text-blue-600 dark:text-blue-400">✓</span>}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
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
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
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

          {/* Mobile buttons: Search + ThemeToggle + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setMobileSearchModalOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search projects"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle size="sm" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          {/* Mobile In-drawer Global Search Bar */}
          <div className="pb-1">
            <GlobalSearch
              variant="compact"
              onCloseModal={() => setMobileMenuOpen(false)}
            />
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            Explore Projects
          </Link>
          <Link
            to="/#popular-categories"
            onClick={(e) => {
              handleCategoriesClick(e);
              setMobileMenuOpen(false);
            }}
            className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            Categories
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            About
          </Link>

          {/* Mobile Theme Switch Row */}
          <div className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Dark Mode Appearance</span>
            <ThemeToggle variant="switch" />
          </div>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-blue-600 dark:text-blue-400"
              >
                {isAdmin ? 'Admin Console' : 'Student Dashboard'}
              </Link>
              <button
                onClick={() => {
                  quickSwitchUser(isAdmin ? 'student' : 'admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-xs text-slate-600 dark:text-slate-400"
              >
                Switch role ({isAdmin ? 'to Student' : 'to Admin'})
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-red-600 dark:text-red-400 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
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

      {/* Mobile / Fullscreen Global Search Dialog */}
      {mobileSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Search Academic Projects
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Filter by title, domain category, or technical skill
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close search dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <GlobalSearch
              variant="modal"
              autoFocus
              onCloseModal={() => setMobileSearchModalOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

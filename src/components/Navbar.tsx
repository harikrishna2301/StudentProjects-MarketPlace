import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Package,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { itemCount: cartCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection: once user scrolls past hero (~80px or >100px), make background more opaque
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: Close mobile drawer on Escape and return focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#how-it-works');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Floating Centered Frosted Pill Navigation Header (Zero-clipping mobile layout) */}
      <header
        role="banner"
        className="fixed top-[14px] sm:top-[18px] z-50 w-full pointer-events-none animate-nav-slide-down"
        style={{
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          className={`pointer-events-auto rounded-full transition-all duration-300 px-3.5 sm:px-5 py-2 sm:py-2.5 ${
            scrolled
              ? 'bg-[#0B1B3F]/92 dark:bg-[#070D1F]/95 border border-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-[20px]'
              : 'bg-[rgba(11,27,63,0.55)] border border-[rgba(255,255,255,0.2)] shadow-[0_6px_24px_rgba(0,0,0,0.18)] backdrop-blur-[16px]'
          }`}
          style={{
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          {/* Left: ProjectKit logo/wordmark (always visible, never hidden or clipped) */}
          <div className="shrink-0 flex items-center md:mr-5 lg:mr-8">
            <BrandLogo size="sm" variant="full" to="/" lightText={true} />
          </div>

          {/* Desktop & Tablet: Links grouped after the gap (16px on tablet, 24px on desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium shrink-0"
          >
            <Link
              to="/"
              className={`transition-colors whitespace-nowrap py-1 ${
                isActive('/') && location.pathname === '/'
                  ? 'text-white font-semibold underline underline-offset-4 decoration-[#5B7BFF] decoration-2'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/projects"
              className={`transition-colors whitespace-nowrap py-1 ${
                isActive('/projects')
                  ? 'text-white font-semibold underline underline-offset-4 decoration-[#5B7BFF] decoration-2'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Projects
            </Link>

            <a
              href="#how-it-works"
              onClick={handleHowItWorksClick}
              className="text-white/80 hover:text-white transition-colors whitespace-nowrap py-1"
            >
              How It Works
            </a>

            <Link
              to="/projects#pricing"
              className="text-white/80 hover:text-white transition-colors whitespace-nowrap py-1"
            >
              Pricing
            </Link>

            <Link
              to="/about"
              className={`transition-colors whitespace-nowrap py-1 ${
                isActive('/about')
                  ? 'text-white font-semibold underline underline-offset-4 decoration-[#5B7BFF] decoration-2'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right (side, not centre): grouped with margin-left: auto */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 shrink-0"
            style={{ marginLeft: 'auto' }}
          >
            {/* Cart Icon with count badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 text-white hover:text-white rounded-full hover:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7BFF] flex items-center justify-center"
              aria-label={`View shopping cart with ${cartCount} items`}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-[#2F4BFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 font-mono shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Only: Wishlist Icon Button */}
            <Link
              to="/dashboard/wishlist"
              className="hidden md:flex relative min-w-[44px] min-h-[44px] p-2 text-white hover:text-rose-300 rounded-full hover:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7BFF] items-center justify-center"
              aria-label={`View saved wishlist with ${wishlistCount} items`}
              title="Academic Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 font-mono shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Desktop Only: Theme Toggle */}
            <div className="hidden md:flex items-center">
              <ThemeToggle variant="icon" />
            </div>

            {/* Desktop Only: Login or User Dropdown */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all"
                    aria-label="User account menu"
                    aria-expanded={profileDropdownOpen}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#2F4BFF] flex items-center justify-center text-white text-[10px] font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-[85px] truncate text-white">{user?.fullName?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown className="w-3 h-3 text-white/80" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] shadow-xl p-2 z-50 space-y-1 text-xs text-slate-700 dark:text-[#CBD5E1]"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="p-2 border-b border-slate-100 dark:border-[#25335F]">
                        <div className="font-bold text-slate-900 dark:text-[#E8ECFA] truncate">{user?.fullName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-[#9AA6C7] truncate">{user?.email}</div>
                      </div>

                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#16224A] text-[#2F4BFF] dark:text-[#5B7BFF] font-medium"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#16224A] text-slate-800 dark:text-[#E8ECFA] font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#2F4BFF]" />
                            <span>Student Dashboard</span>
                          </Link>
                          <Link
                            to="/dashboard/purchases"
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#16224A] text-slate-700 dark:text-[#CBD5E1]"
                          >
                            <Package className="w-4 h-4 text-[#6C5CE7]" />
                            <span>My Purchased Kits</span>
                          </Link>
                        </>
                      )}

                      <div className="pt-1 border-t border-slate-100 dark:border-[#25335F]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold shadow-xs transition-transform hover:scale-[1.03] active:scale-[0.97]"
                  aria-label="Log in to student portal"
                >
                  Log In
                </Link>
              )}
            </div>

            {/* Mobile (Under 768px): Hamburger Button 44x44px touch target */}
            <button
              ref={hamburgerButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-white rounded-full hover:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7BFF]"
              aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Full-Width Mobile Drawer (Under 768px) with Focus Trap */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md flex flex-col md:hidden pt-20 pb-8 px-5 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm mx-auto bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto animate-hero-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25335F]">
                <BrandLogo size="sm" variant="full" onClick={() => setMobileMenuOpen(false)} />
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    hamburgerButtonRef.current?.focus();
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-800 dark:text-[#E8ECFA]">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-slate-100 dark:bg-[#16224A] text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-[#16224A]/60'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-colors ${
                    isActive('/projects')
                      ? 'bg-slate-100 dark:bg-[#16224A] text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-[#16224A]/60'
                  }`}
                >
                  Explore Projects
                </Link>

                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleHowItWorksClick(e);
                  }}
                  className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16224A]/60 transition-colors"
                >
                  How It Works
                </a>

                <Link
                  to="/projects#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16224A]/60 transition-colors"
                >
                  Pricing
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-colors ${
                    isActive('/about')
                      ? 'bg-slate-100 dark:bg-[#16224A] text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-[#16224A]/60'
                  }`}
                >
                  Contact & Support
                </Link>

                <Link
                  to="/dashboard/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16224A]/60 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Saved Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="text-xs font-mono font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            {/* Mobile Footer & Auth Area */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#25335F] space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#9AA6C7]">Appearance</span>
                <ThemeToggle variant="pill" />
              </div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2F4BFF] text-white font-semibold text-xs shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{isAdmin ? 'Admin Console' : 'Student Dashboard'}</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-[#25335F] text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-slate-100 dark:bg-[#16224A] text-slate-800 dark:text-[#E8ECFA] font-semibold text-xs border border-slate-200 dark:border-[#25335F]"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-[#0B1B3F] hover:bg-[#152857] text-white font-semibold text-xs shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

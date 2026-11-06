import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  Download,
  User,
  LogOut,
  PlusCircle,
  Tags,
  Users,
  Shield,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Heart,
  FileText,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { useWishlist } from '../context/WishlistContext';
import { SEOHead } from '../components/SEOHead';

interface DashboardLayoutProps {
  role?: 'student' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role = 'student' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout, quickSwitchUser } = useAuth();
  const { wishlistCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Security Guard: Authentication & Role-Based Authorization
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#080D1A] text-slate-900 dark:text-[#F8FAFC]">
        <div className="max-w-md w-full bg-white dark:bg-[#0B1329] p-8 rounded-2xl border border-rose-200 dark:border-rose-900 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">403 – Administrative Access Denied</h2>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
            Your authenticated account does not possess the requisite administrative privileges to access the ProjectKit back-office console.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold inline-block"
            >
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const studentNavItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Wishlist', path: '/dashboard/wishlist', icon: Heart, badge: wishlistCount },
    { name: 'My Purchases', path: '/dashboard/purchases', icon: FolderKanban },
    { name: 'Order History', path: '/dashboard/orders', icon: Receipt },
    { name: 'Downloads', path: '/dashboard/downloads', icon: Download },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Add Project', path: '/admin/add-project', icon: PlusCircle },
    { name: 'Manage Categories', path: '/admin/categories', icon: Tags },
    { name: 'Manage Orders', path: '/admin/orders', icon: Receipt },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Legal & Compliance', path: '/admin/legal', icon: FileText },
  ];

  const navItems = role === 'admin' ? adminNavItems : studentNavItems;

  const isCurrentPath = (path: string) => {
    if (path === '/dashboard' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const currentItem = navItems.find((i) => isCurrentPath(i.path));
  const currentTitle = currentItem?.name || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#080D1A] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <SEOHead
        title={`${currentTitle} — ProjectKit`}
        description="Private authenticated dashboard."
        noIndex={true}
      />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-[#080D1A]/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#080E20] text-slate-800 dark:text-[#F8FAFC] flex flex-col justify-between border-r border-slate-200 dark:border-[#1A2846] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-[#1A2846]">
            <BrandLogo size="sm" variant="full" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-800 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-6 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
              {role === 'admin' ? 'Administration Console' : 'Student Workspace'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              const hasBadge = (item as any).badge !== undefined && (item as any).badge > 0;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#2F4BFF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#16224A] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#2F4BFF] dark:text-[#5B7BFF]'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {hasBadge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono tabular-nums font-bold rounded-full ${
                        active
                          ? 'bg-white text-[#2F4BFF]'
                          : 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 dark:border-rose-500/30'
                      }`}
                    >
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Role Simulator inside Sidebar */}
          <div className="px-4 py-3 mx-3 rounded-xl bg-slate-50 dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] text-xs">
            <div className="text-[10px] text-slate-500 dark:text-[#9AA6C7] font-semibold mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2F4BFF] dark:text-[#5B7BFF]" />
              <span>Role Simulator</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  quickSwitchUser('student');
                  navigate('/dashboard');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                  role === 'student'
                    ? 'bg-[#2F4BFF] text-white shadow-xs'
                    : 'bg-white dark:bg-[#16224A] text-slate-600 dark:text-[#9AA6C7] border border-slate-200 dark:border-[#25335F] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  quickSwitchUser('admin');
                  navigate('/admin');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                  role === 'admin'
                    ? 'bg-[#2F4BFF] text-white shadow-xs'
                    : 'bg-white dark:bg-[#16224A] text-slate-600 dark:text-[#9AA6C7] border border-slate-200 dark:border-[#25335F] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-[#25335F] space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-xl bg-[#2F4BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-[#E8ECFA] truncate">
                {user?.fullName || 'Academic User'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#9AA6C7] truncate">{user?.email}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-[#25335F] flex items-center justify-between">
            <Link
              to="/projects"
              className="text-xs text-[#2F4BFF] dark:text-[#5B7BFF] hover:text-[#1E36D6] dark:hover:text-[#8C7CFF] font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 dark:bg-[#070D1F]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#25335F] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-[#9AA6C7] hover:text-slate-900 dark:hover:text-[#E8ECFA] rounded-lg hover:bg-slate-100 dark:hover:bg-[#16224A]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9AA6C7]">
              <Link to="/" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF]">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-[#1A2846]" />
              <span className="text-slate-800 dark:text-[#CBD5E1] font-semibold">{currentTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#0B1329] hover:bg-slate-200 dark:hover:bg-[#101C38] text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-[#1A2846] transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
              <span>Browse Catalog</span>
            </Link>

            <ThemeToggle variant="pill" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#080D1A] transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

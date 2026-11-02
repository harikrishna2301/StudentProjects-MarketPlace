import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  Sparkles,
  Heart,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useWishlist } from '../context/WishlistContext';

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
  ];

  const navItems = role === 'admin' ? adminNavItems : studentNavItems;

  const isCurrentPath = (path: string) => {
    if (path === '/dashboard' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Derive breadcrumb from current path
  const currentItem = navItems.find((i) => isCurrentPath(i.path));
  const currentTitle = currentItem?.name || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold text-base tracking-tight text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span>ProjectKit</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-6 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {role === 'admin' ? 'Administration' : 'Workspace'}
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {hasBadge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono tabular-nums font-bold rounded-full ${
                        active
                          ? 'bg-white text-blue-600'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Demo Switcher inside Sidebar */}
          <div className="px-6 py-4 mx-3 rounded-lg bg-slate-800/50 border border-slate-800 text-xs">
            <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Role Simulator</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  quickSwitchUser('student');
                  navigate('/dashboard');
                }}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                  role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  quickSwitchUser('admin');
                  navigate('/admin');
                }}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {user?.fullName || 'Academic User'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.collegeName || 'Engineering Campus'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-1.5 text-red-400 hover:text-red-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar with Breadcrumb Contract & Actions */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                ProjectKit
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              <Link
                to={role === 'admin' ? '/admin' : '/dashboard'}
                className="hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                {role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentTitle}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              to="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Browse Catalog</span>
            </Link>

            {role === 'admin' ? (
              <Link
                to="/admin/add-project"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Project Kit</span>
              </Link>
            ) : (
              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                <span>Find Project</span>
              </Link>
            )}
          </div>
        </header>

        {/* Dashboard Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

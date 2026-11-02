import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your university email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Redirect to intended page or dashboard
      const stateRedirect = (location.state as any)?.from;
      if (stateRedirect) {
        navigate(stateRedirect);
      } else if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Unable to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('rahul.student@projectkit.edu');
      setPassword('StudentPass2026!');
    } else {
      setEmail('admin@projectkit.edu');
      setPassword('AdminPass2026!');
    }
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {/* Brand header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-slate-900 dark:text-white">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span>ProjectKit</span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Access your purchased project kits, source files, and IEEE documents
          </p>
        </div>

        {/* Quick Demo Pre-fill helpers */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-2 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Quick Demo Accounts:</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('student')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 text-left transition-colors"
            >
              <div className="font-semibold text-blue-600 dark:text-blue-400">Student Demo</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">rahul.student@...</div>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 text-left transition-colors"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Admin Demo</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">admin@projectkit.edu</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {forgotPasswordNotice && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            Demo notice: In this evaluation environment, use the 1-click demo login buttons above or any email.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotPasswordNotice(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Link to Registration */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};

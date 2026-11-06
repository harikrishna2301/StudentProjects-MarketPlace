import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { BrandLogo } from '../components/BrandLogo';
import { SEOHead } from '../components/SEOHead';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

type AuthViewMode = 'login' | 'forgot-password' | 'reset-password';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Mode state
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Reset password form state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      const stateRedirect = (location.state as any)?.from;
      if (stateRedirect) {
        navigate(stateRedirect);
      } else if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered university email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const message = await authService.forgotPassword(forgotEmail);
      setForgotSuccess(message);
    } catch (err: any) {
      setForgotError(err.message || 'Unable to request password reset. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetToken.trim()) {
      setResetError('Please enter the reset token received in your email.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please verify both fields.');
      return;
    }

    setResetLoading(true);
    try {
      const message = await authService.resetPassword(resetToken, newPassword);
      setResetSuccess(message);
      // Clear inputs
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      // After 2.5 seconds, switch back to login mode so user can sign in
      setTimeout(() => {
        setViewMode('login');
        setError('');
      }, 2500);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message;
      setResetError(serverMsg || 'Failed to reset password. Please check your token.');
    } finally {
      setResetLoading(false);
    }
  };

  // Sync mode with URL query parameters (/login?mode=forgot-password)
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'forgot-password' || mode === 'forgot') {
      setViewMode('forgot-password');
    } else if (mode === 'reset-password' || mode === 'reset') {
      setViewMode('reset-password');
      const token = searchParams.get('token');
      if (token) setResetToken(token);
    }
  }, [location.search]);

  const switchToForgotPassword = () => {
    setForgotEmail(email);
    setForgotError('');
    setForgotSuccess('');
    setViewMode('forgot-password');
    navigate('/login?mode=forgot-password', { replace: true });
  };

  const switchToLogin = () => {
    setError('');
    setViewMode('login');
    navigate('/login', { replace: true });
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
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080D1A] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <SEOHead
        title="Student Sign In"
        description="Secure sign in to your ProjectKit student account."
        noIndex={true}
      />
      <div className="max-w-md w-full space-y-7 bg-white dark:bg-[#0B1329] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-sm dark:shadow-[0_20px_50px_rgba(8,13,26,0.8)]">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <BrandLogo size="lg" variant="stacked" tagline="Build. Learn. Launch." />

          {viewMode === 'login' && (
            <>
              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
                Sign in to your account
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                Access your purchased project kits, source files, and IEEE documents
              </p>
            </>
          )}

          {viewMode === 'forgot-password' && (
            <>
              <div className="w-11 h-11 mt-4 rounded-xl bg-blue-50 dark:bg-[#16224A] border border-blue-200 dark:border-[#25335F] text-[#2F4BFF] dark:text-[#5B7BFF] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
                Forgot your password?
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8] max-w-xs">
                Enter your university email to receive a secure, single-use password reset token.
              </p>
            </>
          )}

          {viewMode === 'reset-password' && (
            <>
              <div className="w-11 h-11 mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
                Set a new password
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8] max-w-xs">
                Enter the cryptographic reset token and your new account password.
              </p>
            </>
          )}
        </div>

        {/* ============================================================== */}
        {/* VIEW MODE: LOGIN */}
        {/* ============================================================== */}
        {viewMode === 'login' && (
          <>
            {/* Quick Demo Switcher */}
            <div className="p-3 bg-slate-50 dark:bg-[#16224A] rounded-xl border border-slate-200 dark:border-[#25335F] space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 dark:text-[#9AA6C7] uppercase tracking-wider flex items-center justify-between">
                <span>Fast Evaluation Credentials</span>
                <span className="text-[#2F4BFF] dark:text-[#5B7BFF] font-mono">Dev Mode</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('student')}
                  className="px-2.5 py-1.5 bg-white dark:bg-[#0F1830] hover:bg-blue-50 dark:hover:bg-[#2F4BFF]/20 text-[#2F4BFF] dark:text-[#5B7BFF] rounded-lg border border-slate-200 dark:border-[#25335F] hover:border-[#2F4BFF]/60 dark:hover:border-[#5B7BFF]/60 transition-colors text-center font-semibold"
                >
                  Demo Student
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="px-2.5 py-1.5 bg-white dark:bg-[#0F1830] hover:bg-violet-50 dark:hover:bg-[#6C5CE7]/20 text-[#6C5CE7] dark:text-[#8C7CFF] rounded-lg border border-slate-200 dark:border-[#25335F] hover:border-[#6C5CE7]/60 dark:hover:border-[#8C7CFF]/60 transition-colors text-center font-semibold"
                >
                  Demo Admin
                </button>
              </div>
            </div>

            {/* Error message banner */}
            {error && (
              <div
                role="alert"
                className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="login-email" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 dark:text-[#94A3B8] cursor-pointer hover:text-slate-900 dark:hover:text-[#CBD5E1]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-[#1A2846] text-[#2563EB] accent-[#2563EB]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pk-btn-primary w-full py-2.5 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white font-semibold rounded-xl transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(47,75,255,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center pt-1 pb-1">
              <button
                type="button"
                onClick={switchToForgotPassword}
                className="text-xs text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] font-medium transition-colors hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-[#9AA6C7] pt-2 border-t border-slate-200 dark:border-[#25335F]">
              <span>Don&apos;t have a student account? </span>
              <Link to="/register" className="text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] font-semibold">
                Create an Account
              </Link>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE: FORGOT PASSWORD */}
        {/* ============================================================== */}
        {viewMode === 'forgot-password' && (
          <div className="space-y-4 text-xs">
            {/* Status messages */}
            {forgotSuccess && (
              <div
                role="status"
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="leading-relaxed">
                  <span className="font-semibold block">Reset Token Dispatched</span>
                  <span>{forgotSuccess}</span>
                </div>
              </div>
            )}

            {forgotError && (
              <div
                role="alert"
                className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                  University Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 dark:bg-[#16224A] rounded-xl border border-blue-100 dark:border-[#25335F] text-[11px] text-slate-600 dark:text-[#9AA6C7] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF] shrink-0 mt-0.5" />
                <span>
                  The reset token is cryptographically hashed with SHA-256 and expires strictly in 15 minutes.
                </span>
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="pk-btn-primary w-full py-2.5 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white font-semibold rounded-xl transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(47,75,255,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {forgotLoading ? (
                  <span>Dispatching Reset Token...</span>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200 dark:border-[#25335F] flex items-center justify-between">
              <button
                type="button"
                onClick={switchToLogin}
                className="text-slate-600 dark:text-[#9AA6C7] hover:text-slate-900 dark:hover:text-[#E8ECFA] flex items-center gap-1.5 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetError('');
                  setResetSuccess('');
                  setViewMode('reset-password');
                }}
                className="text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline font-semibold"
              >
                Have a token? Reset now
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE: RESET PASSWORD */}
        {/* ============================================================== */}
        {viewMode === 'reset-password' && (
          <div className="space-y-4 text-xs">
            {resetSuccess && (
              <div
                role="status"
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="leading-relaxed">
                  <span className="font-semibold block">Password Changed</span>
                  <span>{resetSuccess} Redirecting to login...</span>
                </div>
              </div>
            )}

            {resetError && (
              <div
                role="alert"
                className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="reset-token" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                  Reset Token
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="reset-token"
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter or paste token from email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] font-mono outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reset-new-password" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="reset-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reset-confirm-password" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="reset-confirm-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-semibold rounded-xl transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {resetLoading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <span>Confirm & Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200 dark:border-[#25335F] flex items-center justify-between">
              <button
                type="button"
                onClick={switchToLogin}
                className="text-slate-600 dark:text-[#9AA6C7] hover:text-slate-900 dark:hover:text-[#E8ECFA] flex items-center gap-1.5 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('forgot-password')}
                className="text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline font-semibold"
              >
                Request a new token
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User as UserIcon,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { BrandLogo } from '../components/BrandLogo';
import { SEOHead } from '../components/SEOHead';

type AdminAuthMode = 'login' | 'setup' | 'forgot' | 'reset';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, loginAdmin, setupInitialAdmin, hasLocalAdmin } = useAuth();

  const [adminExists, setAdminExists] = useState<boolean>(() => hasLocalAdmin());
  const [mode, setMode] = useState<AdminAuthMode>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // First-time Admin setup state
  const [setupName, setSetupName] = useState('');
  const [setupTitle, setSetupTitle] = useState('Lead Administrator');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  // Forgot & Reset Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [previewResetToken, setPreviewResetToken] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmNewAdminPassword, setConfirmNewAdminPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    setAdminExists(hasLocalAdmin());
  }, [hasLocalAdmin]);

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const switchMode = (nextMode: AdminAuthMode) => {
    setError('');
    setSuccessMsg('');
    setMode(nextMode);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please enter your administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!setupName.trim()) {
      setError('Please enter the administrator full name.');
      return;
    }
    if (!setupEmail.trim() || !setupEmail.includes('@')) {
      setError('Please provide a valid administrator email address.');
      return;
    }
    if (setupPassword.length < 8) {
      setError('Administrator password must be at least 8 characters.');
      return;
    }
    if (setupPassword !== setupConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const created = await setupInitialAdmin({
        fullName: setupName,
        email: setupEmail,
        password: setupPassword,
        adminTitle: setupTitle,
      });
      setAdminExists(true);
      setMode('login');
      setEmail(created.email);
      setPassword('');
      setSuccessMsg('Administrator account initialized. Sign in below with your new credentials.');
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize administrator account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setPreviewResetToken('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter your registered administrator email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.forgotAdminPassword(forgotEmail);
      setSuccessMsg(result.message);
      if (result.previewResetToken) {
        setPreviewResetToken(result.previewResetToken);
        setResetToken(result.previewResetToken);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to process administrator password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetToken.trim()) {
      setError('Please enter your administrator reset token.');
      return;
    }
    if (newAdminPassword.length < 8) {
      setError('New administrator password must be at least 8 characters.');
      return;
    }
    if (newAdminPassword !== confirmNewAdminPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const msg = await authService.resetAdminPassword(resetToken, newAdminPassword);
      setMode('login');
      if (forgotEmail.trim()) {
        setEmail(forgotEmail.trim());
      }
      setPassword('');
      setResetToken('');
      setPreviewResetToken('');
      setNewAdminPassword('');
      setConfirmNewAdminPassword('');
      setSuccessMsg(msg);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset administrator password.');
    } finally {
      setLoading(false);
    }
  };

  const headerMeta: Record<AdminAuthMode, { title: string; subtitle: string }> = {
    login: {
      title: 'Administrator Login',
      subtitle: 'Authorized ProjectKit administrators only',
    },
    setup: {
      title: 'Initialize Admin Account',
      subtitle: 'One-time setup for your ProjectKit admin credentials',
    },
    forgot: {
      title: 'Admin Password Recovery',
      subtitle: 'Request a verification token for your administrator account',
    },
    reset: {
      title: 'Set New Admin Password',
      subtitle: 'Enter your recovery token to update administrator credentials',
    },
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6 bg-[#0B0720] text-[#F8FAFC]">
      <SEOHead
        title="Administrator Login — ProjectKit"
        description="Restricted ProjectKit administrative console sign in."
        noIndex={true}
      />

      <div className="mb-6 flex flex-col items-center text-center">
        <BrandLogo size="lg" variant="full" tagline="Administration & Operations Console" lightText={true} />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-[#140A2E] border border-[#3A2074] shadow-[0_0_40px_rgba(106,47,200,0.45)] p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#3A2074]/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6A2FC8]/25 border border-[#9D71E8]/40 text-[#D1B8FF] flex items-center justify-center">
              {mode === 'forgot' || mode === 'reset' ? (
                <KeyRound className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {headerMeta[mode].title}
              </h1>
              <p className="text-xs text-[#C5B4E3]">{headerMeta[mode].subtitle}</p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div
            role="status"
            className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-email" className="block text-xs font-semibold text-[#D1B8FF]">
                Administrator Email
              </label>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yourdomain.com"
                    className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="block text-xs font-semibold text-[#D1B8FF]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setPreviewResetToken('');
                    switchMode('forgot');
                  }}
                  className="text-[11px] font-semibold text-[#9D71E8] hover:text-[#D1B8FF] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#D1B8FF] hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full auth-pill-btn py-3 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#6A2FC8]/50 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying Admin Session...' : 'Sign In to Admin Console'}
              </button>
            </div>

            {!adminExists && (
              <div className="p-3.5 rounded-2xl bg-[#25134D]/60 border border-[#6A2FC8]/40 text-xs text-[#D1B8FF] space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <KeyRound className="w-3.5 h-3.5 text-[#D1B8FF]" />
                  <span>No local admin account configured yet</span>
                </div>
                <p className="text-[11px] text-[#C5B4E3] leading-relaxed">
                  If you are running without the Spring Boot + MySQL server, create your one-time administrator credentials to access the Admin Console.
                </p>
                <button
                  type="button"
                  onClick={() => switchMode('setup')}
                  className="text-[11px] font-bold text-white bg-[#6A2FC8] hover:bg-[#5824A8] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Set Up Administrator Account
                </button>
              </div>
            )}
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-forgot-email" className="block text-xs font-semibold text-[#D1B8FF]">
                Administrator Email
              </label>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="admin-forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@yourdomain.com"
                    className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                </div>
              </div>
            </div>

            {previewResetToken && (
              <div className="p-3.5 rounded-2xl bg-[#25134D]/80 border border-[#9D71E8]/50 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D1B8FF]">
                  One-Time Recovery Token
                </div>
                <div className="px-3 py-2 rounded-xl bg-[#0B0720] border border-[#6A2FC8]/50 font-mono text-sm font-bold text-emerald-300 tracking-wider select-all">
                  {previewResetToken}
                </div>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Enter Reset Token & Set New Password →
                </button>
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full auth-pill-btn py-3 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#6A2FC8]/50 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending Reset Token...' : 'Request Admin Reset Token'}
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#C5B4E3] pt-1">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-[#D1B8FF] font-semibold hover:underline cursor-pointer"
                >
                  Already have a reset token?
                </button>
              </div>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-reset-token" className="block text-xs font-semibold text-[#D1B8FF]">
                Recovery Token
              </label>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="admin-reset-token"
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="e.g. PK-ADM-XXXXXX"
                    className="w-full bg-transparent py-1.5 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-new-password" className="block text-xs font-semibold text-[#D1B8FF]">
                New Password (min. 8 chars)
              </label>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="admin-new-password"
                    type={showResetPassword ? 'text' : 'password'}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="text-[#D1B8FF] hover:text-white transition-colors"
                    aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-confirm-new-password" className="block text-xs font-semibold text-[#D1B8FF]">
                Confirm New Password
              </label>
              <div className="auth-underline-field pb-1">
                <input
                  id="admin-confirm-new-password"
                  type={showResetPassword ? 'text' : 'password'}
                  value={confirmNewAdminPassword}
                  onChange={(e) => setConfirmNewAdminPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full auth-pill-btn py-3 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#6A2FC8]/50 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Update Admin Password'}
              </button>
              <div className="flex items-center justify-between text-[11px] text-[#C5B4E3] pt-1">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ← Request New Token
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#D1B8FF] font-semibold hover:underline cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        )}

        {mode === 'setup' && (
          <form onSubmit={handleInitialAdminSetup} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="setup-name" className="block text-xs font-semibold text-[#D1B8FF]">
                Administrator Full Name
              </label>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="setup-name"
                    type="text"
                    value={setupName}
                    onChange={(e) => setSetupName(e.target.value)}
                    placeholder="e.g. Hari Krishna"
                    className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="setup-role-title" className="block text-xs font-semibold text-[#D1B8FF]">
                Designation / Role
              </label>
              <div className="auth-underline-field pb-1">
                <select
                  id="setup-role-title"
                  value={setupTitle}
                  onChange={(e) => setSetupTitle(e.target.value)}
                  className="w-full bg-[#140A2E] py-1.5 text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="Lead Administrator">Lead Administrator</option>
                  <option value="Co-Founder">Co-Founder</option>
                  <option value="Technical Administrator">Technical Administrator</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="setup-email" className="block text-xs font-semibold text-[#D1B8FF]">
                Administrator Email
              </label>
              <div className="auth-underline-field pb-1">
                <div className="flex items-center justify-between text-white/90">
                  <input
                    id="setup-email"
                    type="email"
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                    placeholder="admin@yourdomain.com"
                    className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="setup-password" className="block text-xs font-semibold text-[#D1B8FF]">
                  Password (min. 8 chars)
                </label>
                <div className="auth-underline-field pb-1">
                  <div className="flex items-center justify-between text-white/90">
                    <input
                      id="setup-password"
                      type={showSetupPassword ? 'text' : 'password'}
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      placeholder="Strong password"
                      className="w-full bg-transparent py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupPassword(!showSetupPassword)}
                      className="text-[#D1B8FF] hover:text-white"
                    >
                      {showSetupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="setup-confirm" className="block text-xs font-semibold text-[#D1B8FF]">
                  Confirm Password
                </label>
                <div className="auth-underline-field pb-1">
                  <input
                    id="setup-confirm"
                    type={showSetupPassword ? 'text' : 'password'}
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-transparent py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full auth-pill-btn py-3 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#6A2FC8]/50 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Admin...' : 'Create Admin Account'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full py-2 text-xs font-semibold text-[#C5B4E3] hover:text-white transition-colors cursor-pointer"
              >
                Back to Administrator Login
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-[#3A2074]/80 flex items-center justify-between text-xs text-[#C5B4E3]">
          <Link to="/login" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </Link>
          <Link to="/" className="hover:text-white transition-colors">
            Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

interface AuthSplitCardProps {
  initialMode?: 'login' | 'register';
}

export const AuthSplitCard: React.FC<AuthSplitCardProps> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // Mode: 'login' | 'register' | 'forgot-password' | 'reset-password'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>(() => {
    const searchParams = new URLSearchParams(location.search);
    const m = searchParams.get('mode');
    if (m === 'forgot-password' || m === 'forgot') return 'forgot-password';
    if (m === 'reset-password' || m === 'reset') return 'reset-password';
    return initialMode;
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>(() => {
    return (location.state as any)?.email || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration banner message (if redirected from account creation)
  const [registeredSuccess, setRegisteredSuccess] = useState<string>(() => {
    return (location.state as any)?.registeredMessage || '';
  });

  // Registration form state
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    collegeName: '',
    password: '',
    confirmPassword: '',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreedToLegal, setAgreedToLegal] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Reset password form state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  // Keep state synced with location
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const m = searchParams.get('mode');
    if (m === 'forgot-password' || m === 'forgot') {
      setMode('forgot-password');
    } else if (m === 'reset-password' || m === 'reset') {
      setMode('reset-password');
      const token = searchParams.get('token');
      if (token) setResetToken(token);
    } else if (location.pathname === '/register') {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }

    if ((location.state as any)?.registeredMessage) {
      setRegisteredSuccess((location.state as any).registeredMessage);
    }
    if ((location.state as any)?.email) {
      setLoginEmail((location.state as any).email);
    }
  }, [location.pathname, location.search, location.state]);

  const switchMode = (newMode: 'login' | 'register') => {
    setLoginError('');
    setRegError('');
    setRegisteredSuccess('');
    setMode(newMode);
    if (newMode === 'login') {
      navigate('/login', { replace: false });
    } else {
      navigate('/register', { replace: false });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your university email address.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your account password.');
      return;
    }

    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      const stateRedirect = (location.state as any)?.from;
      if (stateRedirect) {
        navigate(stateRedirect);
      } else if (loginEmail.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setLoginError('Invalid email or password. Please verify your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regData.fullName.trim()) {
      setRegError('Please provide your full legal name.');
      return;
    }
    if (!regData.email.trim() || !regData.email.includes('@')) {
      setRegError('Please provide a valid email address.');
      return;
    }
    if (!regData.collegeName.trim()) {
      setRegError('Please enter your engineering college or university name.');
      return;
    }
    if (regData.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setRegError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreedToLegal) {
      setRegError('You must agree to the Terms & Privacy Policy to create an account.');
      return;
    }

    setRegLoading(true);
    try {
      await register({
        fullName: regData.fullName,
        email: regData.email,
        phoneNumber: regData.phoneNumber,
        collegeName: regData.collegeName,
      });

      // Audit consent record for compliance
      const consentRecord = {
        terms: {
          documentType: 'TERMS_AND_CONDITIONS',
          version: '1.0',
          source: 'REGISTRATION',
          timestamp: new Date().toISOString(),
        },
        privacy: {
          documentType: 'PRIVACY_POLICY',
          version: '1.0',
          source: 'REGISTRATION',
          timestamp: new Date().toISOString(),
        },
      };

      try {
        localStorage.setItem('projectkit_registration_consent', JSON.stringify(consentRecord));
        fetch('/api/legal/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: 'TERMS_AND_CONDITIONS',
            documentVersion: '1.0',
            source: 'REGISTRATION',
          }),
        }).catch(() => {});
      } catch {
        // Fallback for offline mode
      }

      // After successful account creation, do NOT auto-login. Navigate to login!
      setLoginEmail(regData.email);
      setRegisteredSuccess('Account created successfully! Please sign in with your email and password.');
      switchMode('login');
    } catch {
      setRegError('Registration failed. This email may already be registered.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your university email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const msg = await authService.forgotPassword(forgotEmail);
      setForgotSuccess(msg);
    } catch (err: any) {
      setForgotError(err.message || 'Unable to request password reset token.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetToken.trim()) {
      setResetError('Please enter the reset token from your email.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetLoading(true);
    try {
      const msg = await authService.resetPassword(resetToken, newPassword);
      setResetSuccess(msg);
      setTimeout(() => {
        setMode('login');
        setLoginError('');
      }, 2500);
    } catch (err: any) {
      setResetError(err.message || 'Failed to reset password. Please check your token.');
    } finally {
      setResetLoading(false);
    }
  };

  const fillQuickDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setLoginEmail('john.doe@projectkit.edu');
      setLoginPassword('StudentPass2026!');
    } else {
      setLoginEmail('admin@projectkit.edu');
      setLoginPassword('AdminPass2026!');
    }
    setLoginError('');
    setRegisteredSuccess('');
  };

  const isRegister = mode === 'register';

  return (
    <div className="w-full flex items-center justify-center py-6 px-4 sm:px-6">
      {/* Outer Card with Neon Purple Glow Border strictly matching reference */}
      <div className="auth-split-card shadow-[0_0_40px_rgba(106,47,200,0.55)]">
        {/* Subtle Ambient Radial Lighting Flares */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6A2FC8]/20 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#9D71E8]/15 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* ============================================================== */}
        {/* DESKTOP ANIMATED SPLIT VIEW */}
        {/* ============================================================== */}
        <div className="relative z-10 w-full min-h-[520px] flex flex-col md:flex-row items-stretch">
          {/* ------------------------------------------------------------ */}
          {/* Left Container: Login Form OR Slanted Welcome Panel (if register) */}
          {/* ------------------------------------------------------------ */}
          <div
            className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${
              isRegister
                ? 'order-2 md:order-1 hidden md:flex items-center justify-center text-center p-8 bg-gradient-to-br from-[#25134D] via-[#6A2FC8] to-[#9D71E8] diagonal-panel-left relative overflow-hidden'
                : 'order-1'
            }`}
          >
            {isRegister ? (
              /* Slanted Left Panel shown when in Registration mode */
              <div className="relative z-10 max-w-xs space-y-4 text-white">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase drop-shadow-md">
                  WELCOME!
                </h2>
                <p className="text-xs text-[#F2E9FF]/90 leading-relaxed">
                  Join ProjectKit to explore curated academic project kits, runnable source code, IEEE reports, and viva voce defense sheets.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-2 border-white/80 text-white hover:bg-white hover:text-[#0B0720] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            ) : mode === 'forgot-password' ? (
              /* Forgot Password Form */
              <div className="space-y-5 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#D1B8FF] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Reset Password
                  </h1>
                  <p className="text-xs text-[#C5B4E3] mt-1">
                    Enter your registered university email to receive a password reset token.
                  </p>
                </div>

                {forgotSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                {forgotError && (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="auth-underline-field pb-1">
                    <div className="flex items-center justify-between text-white/90">
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Academic Email Address"
                        className="w-full bg-transparent py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                        required
                      />
                      <Mail className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full auth-pill-btn py-3 rounded-full text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                  >
                    {forgotLoading ? 'Sending Token...' : 'Send Reset Token'}
                  </button>
                </form>
              </div>
            ) : mode === 'reset-password' ? (
              /* Reset Password Form */
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    New Password
                  </h1>
                  <p className="text-xs text-[#C5B4E3] mt-1">
                    Enter your token and set a new password.
                  </p>
                </div>

                {resetSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                {resetError && (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="auth-underline-field pb-1">
                    <div className="flex items-center justify-between text-white/90">
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Reset Token"
                        className="w-full bg-transparent py-2 text-sm text-white font-mono placeholder:text-white/40 focus:outline-none"
                        required
                      />
                      <KeyRound className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                    </div>
                  </div>

                  <div className="auth-underline-field pb-1">
                    <div className="flex items-center justify-between text-white/90">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password (min. 6 chars)"
                        className="w-full bg-transparent py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-[#D1B8FF] hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-underline-field pb-1">
                    <div className="flex items-center justify-between text-white/90">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full bg-transparent py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                        required
                      />
                      <Lock className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full auth-pill-btn py-3 rounded-full text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                  >
                    {resetLoading ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </form>
              </div>
            ) : (
              /* Standard Login Form (Matching Reference Image) */
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    Login
                  </h1>
                </div>

                {/* Registration success feedback alert */}
                {registeredSuccess && (
                  <div
                    role="status"
                    className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs flex items-start gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">{registeredSuccess}</div>
                  </div>
                )}

                {/* Error Banner */}
                {loginError && (
                  <div
                    role="alert"
                    className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Fast Evaluation Demo Credentials */}
                <div className="p-2.5 rounded-xl bg-[#25134D]/60 border border-[#6A2FC8]/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#D1B8FF] uppercase tracking-wider">
                    <span>Quick Fill</span>
                    <span className="text-emerald-400 font-mono">Dev Test</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('student')}
                      className="py-1 px-2 rounded-lg bg-[#0B0720]/80 hover:bg-[#6A2FC8]/40 text-[#F2E9FF] border border-[#6A2FC8]/50 text-center font-semibold transition-colors"
                    >
                      Demo Student
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('admin')}
                      className="py-1 px-2 rounded-lg bg-[#0B0720]/80 hover:bg-[#9D71E8]/40 text-[#F2E9FF] border border-[#9D71E8]/50 text-center font-semibold transition-colors"
                    >
                      Demo Admin
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {/* Username / Email field with clean underline and right icon */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#D1B8FF]">
                      Username / Email
                    </label>
                    <div className="auth-underline-field pb-1">
                      <div className="flex items-center justify-between text-white/90">
                        <input
                          id="login-username"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. john.doe@projectkit.edu"
                          className="w-full bg-transparent py-1.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none"
                          required
                        />
                        <User className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Password field with clean underline and lock / eye icon */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-[#D1B8FF]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-[11px] text-[#9D71E8] hover:text-[#D1B8FF] hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="auth-underline-field pb-1">
                      <div className="flex items-center justify-between text-white/90">
                        <input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full bg-transparent py-1.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="text-[#D1B8FF] hover:text-white transition-colors"
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Neon Pill Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full auth-pill-btn py-3 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#6A2FC8]/50 active:scale-[0.99] cursor-pointer"
                    >
                      {loginLoading ? 'Signing In...' : 'Login'}
                    </button>
                  </div>

                  {/* Switch to Sign Up text */}
                  <div className="text-center pt-2 text-xs text-[#C5B4E3]">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="font-bold text-[#D1B8FF] hover:text-white hover:underline transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Right Container: Slanted Welcome Panel (Login) OR Register Form */}
          {/* ------------------------------------------------------------ */}
          <div
            className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${
              !isRegister
                ? 'order-2 hidden md:flex items-center justify-center text-center p-8 bg-gradient-to-br from-[#25134D] via-[#6A2FC8] to-[#9D71E8] diagonal-panel-right relative overflow-hidden'
                : 'order-1 md:order-2'
            }`}
          >
            {!isRegister ? (
              /* Slanted Right Panel shown in Login Mode (Matching Reference Image) */
              <div className="relative z-10 max-w-xs space-y-4 text-white">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase drop-shadow-md">
                  WELCOME BACK!
                </h2>
                <p className="text-xs text-[#F2E9FF]/90 leading-relaxed">
                  Access verified academic project kits, runnable source code, IEEE documentation, and viva voce defense guides.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-2 border-white/80 text-white hover:bg-white hover:text-[#0B0720] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form shown on the Right side when in Register mode */
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    Sign Up
                  </h1>
                  <p className="text-xs text-[#C5B4E3] mt-1">
                    Create your student profile to access project kits
                  </p>
                </div>

                {/* Error Banner */}
                {regError && (
                  <div
                    role="alert"
                    className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Full Legal Name */}
                  <div className="space-y-0.5">
                    <label className="block text-[11px] font-semibold text-[#D1B8FF]">
                      Full Name
                    </label>
                    <div className="auth-underline-field pb-1">
                      <div className="flex items-center justify-between text-white/90">
                        <input
                          type="text"
                          name="fullName"
                          value={regData.fullName}
                          onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                          placeholder="Full Name as on University ID"
                          className="w-full bg-transparent py-1 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none"
                          required
                        />
                        <User className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* University Email */}
                  <div className="space-y-0.5">
                    <label className="block text-[11px] font-semibold text-[#D1B8FF]">
                      Academic Email
                    </label>
                    <div className="auth-underline-field pb-1">
                      <div className="flex items-center justify-between text-white/90">
                        <input
                          type="email"
                          name="email"
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          placeholder="student@university.edu"
                          className="w-full bg-transparent py-1 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none"
                          required
                        />
                        <Mail className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* College Name */}
                  <div className="space-y-0.5">
                    <label className="block text-[11px] font-semibold text-[#D1B8FF]">
                      College / University
                    </label>
                    <div className="auth-underline-field pb-1">
                      <div className="flex items-center justify-between text-white/90">
                        <input
                          type="text"
                          name="collegeName"
                          value={regData.collegeName}
                          onChange={(e) => setRegData({ ...regData, collegeName: e.target.value })}
                          placeholder="e.g. Vellore Institute of Technology"
                          className="w-full bg-transparent py-1 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none"
                          required
                        />
                        <GraduationCap className="w-4 h-4 text-[#D1B8FF] shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password in 2 Cols on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-0.5">
                      <label className="block text-[11px] font-semibold text-[#D1B8FF]">
                        Password
                      </label>
                      <div className="auth-underline-field pb-1">
                        <div className="flex items-center justify-between text-white/90">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            name="password"
                            value={regData.password}
                            onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                            placeholder="Min. 6 chars"
                            className="w-full bg-transparent py-1 text-xs text-white placeholder:text-white/30 focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="text-[#D1B8FF] hover:text-white"
                          >
                            {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[11px] font-semibold text-[#D1B8FF]">
                        Confirm Password
                      </label>
                      <div className="auth-underline-field pb-1">
                        <div className="flex items-center justify-between text-white/90">
                          <input
                            type={showRegConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={regData.confirmPassword}
                            onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                            placeholder="Re-enter"
                            className="w-full bg-transparent py-1 text-xs text-white placeholder:text-white/30 focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                            className="text-[#D1B8FF] hover:text-white"
                          >
                            {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#C5B4E3]">
                      <input
                        type="checkbox"
                        checked={agreedToLegal}
                        onChange={(e) => setAgreedToLegal(e.target.checked)}
                        className="mt-0.5 accent-[#6A2FC8] rounded cursor-pointer"
                        required
                      />
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" className="text-[#D1B8FF] hover:underline font-semibold">
                          Terms & Conditions
                        </Link>{' '}
                        and acknowledge the{' '}
                        <Link to="/privacy" target="_blank" className="text-[#D1B8FF] hover:underline font-semibold">
                          Privacy Policy
                        </Link>.
                      </span>
                    </label>
                  </div>

                  {/* Neon Pill Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full auth-pill-btn py-3 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#6A2FC8]/50 active:scale-[0.99] cursor-pointer"
                    >
                      {regLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </div>

                  {/* Switch to Login */}
                  <div className="text-center pt-1 text-xs text-[#C5B4E3]">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-bold text-[#D1B8FF] hover:text-white hover:underline transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitCard;

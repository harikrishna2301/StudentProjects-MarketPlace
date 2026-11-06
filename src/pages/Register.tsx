import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';
import { SEOHead } from '../components/SEOHead';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    collegeName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToLegal, setAgreedToLegal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.collegeName.trim()) {
      setError('Please enter your engineering college or university name.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreedToLegal) {
      setError('You must read and agree to the Terms and Conditions and acknowledge the Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        collegeName: formData.collegeName,
      });

      // Audit consent record
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

      navigate('/dashboard');
    } catch {
      setError('Registration failed. This email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080D1A] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <SEOHead
        title="Create Student Account"
        description="Register for a verified ProjectKit student account."
        noIndex={true}
      />
      <div className="max-w-md w-full space-y-7 bg-white dark:bg-[#0B1329] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-sm dark:shadow-[0_20px_50px_rgba(8,13,26,0.8)]">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <BrandLogo size="lg" variant="stacked" tagline="Build. Learn. Launch." />
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
            Create Student Account
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
            Get immediate access to verified engineering project kits
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullname" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                id="reg-fullname"
                type="text"
                name="fullName"
                required
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Rahul Varma"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-email" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@vit.edu"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  id="reg-phone"
                  type="tel"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* College Name */}
          <div>
            <label htmlFor="reg-college" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
              Engineering College / University *
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                id="reg-college"
                type="text"
                name="collegeName"
                required
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="e.g. Vellore Institute of Technology (VIT)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-password" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  id="reg-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Mandatory Unchecked Legal Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-[#CBD5E1] select-none">
              <input
                type="checkbox"
                required
                checked={agreedToLegal}
                onChange={(e) => {
                  setAgreedToLegal(e.target.checked);
                  setError('');
                }}
                className="mt-0.5 rounded border-slate-300 dark:border-[#1A2846] text-[#2563EB] accent-[#2563EB] w-4 h-4 cursor-pointer shrink-0"
              />
              <span className="leading-snug">
                I have read and agree to the{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms and Conditions
                </Link>{' '}
                and acknowledge the{' '}
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pk-btn-primary w-full py-2.5 px-4 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white font-semibold rounded-xl transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(47,75,255,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Student Account...' : 'Create Student Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Link to login */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-[#25335F] text-xs text-slate-500 dark:text-[#9AA6C7]">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] hover:underline">
            Sign In to Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

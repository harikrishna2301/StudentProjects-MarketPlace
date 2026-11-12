import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Save,
  CheckCircle2,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Check,
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState(user?.fullName || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john.doe@projectkit.edu');
  const [phone, setPhone] = useState(user?.phoneNumber || '+91 98765 43210');
  const [college, setCollege] = useState(user?.collegeName || 'Metropolitan Institute of Technology');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2025–2026');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Privacy & Deletion request states
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [deletionSubmitted, setDeletionSubmitted] = useState(
    !!localStorage.getItem('projectkit_deletion_request')
  );
  const [deletionLoading, setDeletionLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = {
        ...user,
        fullName,
        email,
        phoneNumber: phone,
        collegeName: college,
      };
      localStorage.setItem('projectkit_user', JSON.stringify(updated));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Reset your demo evaluation purchases and restore initial state?')) {
      localStorage.removeItem('projectkit_orders');
      localStorage.removeItem('projectkit_user');
      localStorage.removeItem('projectkit_deletion_request');
      window.location.reload();
    }
  };

  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionReason.trim()) return;

    setDeletionLoading(true);
    const reqData = {
      userId: user?.id || 'demo_student',
      userEmail: user?.email || 'student@example.com',
      reason: deletionReason.trim(),
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
    };

    localStorage.setItem('projectkit_deletion_request', JSON.stringify(reqData));

    try {
      await fetch('/api/users/account-deletion-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({ reason: deletionReason.trim() }),
      });
    } catch {}

    setDeletionLoading(false);
    setDeletionSubmitted(true);
    setShowDeletionModal(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-200 dark:border-[#1A2846] pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
          Profile & University Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
          Update your student identification details stamped onto generated project reports and invoices.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile updated successfully! Academic credentials saved in session.</span>
        </div>
      )}

      {/* Theme Appearance Setting Box */}
      <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs p-6 sm:p-8 space-y-4 transition-colors">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
            Appearance & Workspace Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Switch between Light mode and Dark mode. Persisted automatically in localStorage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Theme Card Option */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 ${
              theme === 'light'
                ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/30 ring-2 ring-[#2563EB]/30'
                : 'border-slate-200 dark:border-[#1A2846] bg-white dark:bg-[#080E20] hover:border-slate-300 dark:hover:border-[#3B82F6]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">Light Theme</span>
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] text-slate-600 font-mono">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span>Clean white canvas & slate-900 typography</span>
            </div>
          </button>

          {/* Dark Theme Card Option */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 ${
              theme === 'dark'
                ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#2563EB]/40'
                : 'border-slate-200 dark:border-[#1A2846] bg-white dark:bg-[#080E20] hover:border-slate-300 dark:hover:border-[#3B82F6]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center border border-indigo-700/50">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">Dark Mode</span>
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5B7BFF]" />
              <span>Deep navy & slate night palette for low-light code reviews</span>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-inner">
            {fullName.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{fullName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{college}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              Verified B.Tech Candidate
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registered University Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Engineering College
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Branch / Department
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Academic Passing Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-[#1A2846] flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Information</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="text-xs text-slate-400 dark:text-[#94A3B8] hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </form>

      {/* Data Governance & Privacy Rights Card (DPDPA 2023) */}
      <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs p-6 sm:p-8 space-y-4 transition-colors">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
            Data Privacy & Student Rights (DPDPA 2023)
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5 leading-relaxed">
            Manage your personal data processing preferences, cookie consents, or request account erasure in accordance with the Digital Personal Data Protection Act, 2023.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Cookie Preferences Management */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC] block">
                Cookie Consent Preferences
              </span>
              <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-1">
                Customize functional and analytics cookie permissions across your workstation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-[#101C38] dark:hover:bg-[#1E2E4E] text-slate-700 dark:text-[#CBD5E1] rounded-xl text-xs font-semibold transition-colors self-start border border-slate-300 dark:border-[#1A2846]"
            >
              Configure Cookies
            </button>
          </div>

          {/* Account Deletion Request */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                Account Erasure & Deletion
              </span>
              <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-1">
                {deletionSubmitted
                  ? 'Your account deletion request has been submitted and is currently under administrative review.'
                  : 'Permanently remove your student profile and deactivate your access.'}
              </p>
            </div>

            {deletionSubmitted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-[11px] font-semibold rounded-xl self-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Deletion Request Pending</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeletionModal(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold transition-colors self-start"
              >
                Request Account Deletion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Account Deletion Request Modal */}
      {showDeletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                Submit Account Deletion Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Under the DPDPA 2023, you may request full erasure of your account. In accordance with statutory audit requirements, financial invoices will be archived while all active sessions will be terminated.
              </p>
            </div>

            <form onSubmit={handleAccountDeletion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Deletion (Optional feedback)
                </label>
                <textarea
                  required
                  rows={3}
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  placeholder="e.g. Completed academic semester, no longer need project kits..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-red-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDeletionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deletionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {deletionLoading ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

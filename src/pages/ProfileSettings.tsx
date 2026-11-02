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

  const [fullName, setFullName] = useState(user?.fullName || 'Rahul Varma');
  const [email, setEmail] = useState(user?.email || 'rahul.student@projectkit.edu');
  const [phone, setPhone] = useState(user?.phoneNumber || '+91 98451 22890');
  const [college, setCollege] = useState(user?.collegeName || 'Vellore Institute of Technology (VIT)');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2025–2026');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Profile & University Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Appearance & Workspace Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 ring-2 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Light Theme</span>
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] text-slate-600 font-mono">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Clean white canvas & slate-900 typography</span>
            </div>
          </button>

          {/* Dark Theme Card Option */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/40'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center border border-indigo-700/50">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Mode</span>
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Deep navy & slate night palette for low-light code reviews</span>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
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

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Information</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </form>
    </div>
  );
};

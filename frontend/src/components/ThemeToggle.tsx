import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'pill' | 'icon' | 'labeled' | 'switch';
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'pill',
  className = '',
  size = 'md',
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  // Premium Pill Switch (Default for Navbar: tactile, intuitive, shows both states)
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group relative inline-flex items-center h-8 w-16 px-1 rounded-full bg-[#F2E9FF] dark:bg-[#25134D] border border-[#D1B8FF]/60 dark:border-[#3A2074] shadow-inner hover:border-[#6A2FC8]/50 dark:hover:border-[#9D71E8]/50 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] ${className}`}
        role="switch"
        aria-checked={isDark}
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      >
        {/* Sliding Indicator Thumb */}
        <span
          className={`pointer-events-none absolute left-1 top-1 h-6 w-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-out shadow-sm ${
            isDark
              ? 'translate-x-8 bg-[#0B0720] text-[#D1B8FF] border border-[#3A2074]'
              : 'translate-x-0 bg-white text-[#6A2FC8] border border-[#D1B8FF]'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-[#D1B8FF]/20" />
          ) : (
            <Sun className="w-3.5 h-3.5 fill-[#6A2FC8]/20" />
          )}
        </span>

        {/* Background Inactive Icons for Spatial Clarity */}
        <span className="w-full flex items-center justify-between px-1.5 pointer-events-none select-none">
          <Sun
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'text-[#9D71E8] opacity-60' : 'opacity-0'
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              !isDark ? 'text-[#6A2FC8] opacity-60' : 'opacity-0'
            }`}
          />
        </span>
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] ${
          isDark ? 'bg-[#6A2FC8]' : 'bg-slate-300'
        } ${className}`}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out flex items-center justify-center ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-[#5B7BFF]" />
          ) : (
            <Sun className="w-3 h-3 text-[#F59E0B]" />
          )}
        </span>
      </button>
    );
  }

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
          isDark
            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Light Theme</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-slate-600" />
            <span>Dark Theme</span>
          </>
        )}
      </button>
    );
  }

  // Classic Icon variant
  const isSm = size === 'sm';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
        isDark
          ? 'bg-slate-800/90 text-amber-400 hover:text-amber-300 hover:bg-slate-700/90 border border-slate-700 shadow-xs'
          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/90 shadow-xs'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className={isSm ? 'w-4 h-4' : 'w-4 h-4'} />
      ) : (
        <Moon className={isSm ? 'w-4 h-4' : 'w-4 h-4'} />
      )}
    </button>
  );
};

export default ThemeToggle;

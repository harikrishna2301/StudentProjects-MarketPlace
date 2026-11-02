import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'labeled' | 'switch';
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = '',
  size = 'md',
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isDark ? 'bg-blue-600' : 'bg-slate-200'
        } ${className}`}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-blue-600" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500" />
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
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
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

  // Default 'icon' button
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

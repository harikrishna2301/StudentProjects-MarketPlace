import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings, Check, X, Shield, Lock, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'projectkit_cookie_preferences';

export const CookieBanner: React.FC = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference state
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Check if consent has already been recorded
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setShowBanner(true);
    } else {
      try {
        const parsed: CookiePreferences = JSON.parse(saved);
        setFunctional(!!parsed.functional);
        setAnalytics(!!parsed.analytics);
        setMarketing(!!parsed.marketing);
      } catch {
        setShowBanner(true);
      }
    }

    // Global listener for reopening settings from Footer or Profile
    const handleOpenModal = () => {
      setShowModal(true);
      setShowBanner(false);
    };

    window.addEventListener('open-cookie-preferences', handleOpenModal);
    return () => window.removeEventListener('open-cookie-preferences', handleOpenModal);
  }, []);

  const savePreferences = (preferences: {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => {
    const consentPayload: CookiePreferences = {
      essential: true,
      functional: preferences.functional,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentPayload));
    setFunctional(preferences.functional);
    setAnalytics(preferences.analytics);
    setMarketing(preferences.marketing);
    setShowBanner(false);
    setShowModal(false);

    // Sync to backend API if possible
    try {
      let sessionId = localStorage.getItem('projectkit_session_id');
      if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('projectkit_session_id', sessionId);
      }

      fetch('/api/users/cookie-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({
          sessionId,
          functional: preferences.functional,
          analytics: preferences.analytics,
          marketing: preferences.marketing,
        }),
      }).catch(() => {
        // Silent failure in offline / local development mode
      });
    } catch {
      // Ignore network errors
    }
  };

  const handleAcceptAll = () => {
    savePreferences({ functional: true, analytics: true, marketing: false });
  };

  const handleRejectNonEssential = () => {
    savePreferences({ functional: false, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    savePreferences({ functional, analytics, marketing });
  };

  return (
    <>
      {/* 1. Bottom Fixed Cookie Consent Banner */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white dark:bg-[#1A0D3D] rounded-2xl border border-slate-300 dark:border-[#3A2074] shadow-2xl p-5 text-slate-800 dark:text-[#F2E9FF] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F2E9FF]">
                Your Privacy & Cookie Preferences
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-[#C5B4E3] leading-relaxed">
                We use strictly necessary cookies to ensure secure student authentication and order delivery. Non-essential cookies are disabled until you decide. Read our{' '}
                <Link to="/cookies" className="text-[#6A2FC8] dark:text-[#D1B8FF] font-semibold hover:underline">
                  Cookie Policy
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#3A2074]">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto flex-1 px-3 py-2 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="w-full sm:w-auto flex-1 px-3 py-2 bg-slate-100 dark:bg-[#25134D] hover:bg-slate-200 dark:hover:bg-[#3A2074] text-slate-700 dark:text-[#F2E9FF] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              onClick={() => {
                setShowBanner(false);
                setShowModal(true);
              }}
              className="w-full sm:w-auto p-2 text-slate-500 hover:text-slate-700 dark:text-[#C5B4E3] dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Customize preferences"
              aria-label="Customize cookie preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. Granular Cookie Customization Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A0D3D] rounded-2xl border border-slate-200 dark:border-[#3A2074] max-w-lg w-full p-6 shadow-2xl space-y-5 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3A2074]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2E9FF]">
                    Customize Cookie Preferences
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3]">
                    Control which technologies are permitted during your session
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Essential Cookies (Always On) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0720] border border-slate-200 dark:border-[#3A2074] flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-[#F2E9FF]">
                    <Lock className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#D1B8FF]" />
                    <span>Strictly Necessary & Authentication (Essential)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3] leading-relaxed">
                    Required for student login security, CSRF protection, and downloading purchased source code packages.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] font-bold text-[10px] rounded uppercase shrink-0 border border-[#D1B8FF]/60 dark:border-[#3A2074]">
                  Always Active
                </span>
              </div>

              {/* Functional Cookies */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0720] border border-slate-200 dark:border-[#3A2074] flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-[#F2E9FF] block">
                    Functional & Workspace Preferences
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3] leading-relaxed">
                    Remembers your Light/Dark theme preference and wishlist favorites across browsing sessions.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-[#6A2FC8]"></div>
                </label>
              </div>

              {/* Analytics Cookies */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0720] border border-slate-200 dark:border-[#3A2074] flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-[#F2E9FF] block">
                    Aggregated Anonymous Analytics
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3] leading-relaxed">
                    Helps us understand project popularity and technical stack search trends without identifying your identity.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-[#6A2FC8]"></div>
                </label>
              </div>

              {/* Marketing Tracking */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0720] border border-slate-200 dark:border-[#3A2074] flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-[#F2E9FF] block">
                    Advertising & Retargeting Pixels
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3] leading-relaxed">
                    ProjectKit does not deploy behavioral advertising trackers on student accounts.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-[#25134D] text-slate-600 dark:text-[#C5B4E3] font-bold text-[10px] rounded uppercase shrink-0 border border-slate-300 dark:border-[#3A2074]">
                  Disabled
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#3A2074] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-[#C5B4E3] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-[#6A2FC8] hover:bg-[#5824A8] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

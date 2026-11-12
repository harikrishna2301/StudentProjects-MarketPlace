import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';
import { Cookie, Settings, CheckCircle2, XCircle } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
  const triggerCookieModal = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  };

  return (
    <LegalLayout
      title="Cookie & Tracking Technologies Policy"
      documentType="COOKIE_POLICY"
      version="1.0"
      lastUpdated="November 2026"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. What Are Cookies & Web Storage?
          </h2>
          <p>
            Cookies are small cryptographic text files placed on your computer or mobile device by a web server. Along with HTML5 LocalStorage and SessionStorage, they allow web platforms to remember your authentication session, retain interface settings, and guarantee operational security.
          </p>
        </section>

        {/* Quick Preference Launcher */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
              Manage Your Personal Cookie Preferences
            </span>
            <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
              You have complete control over non-essential cookies. You can inspect or modify your choices at any time.
            </p>
          </div>
          <button
            onClick={triggerCookieModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Open Cookie Preferences</span>
          </button>
        </div>

        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Detailed Classification of Cookies Used
          </h2>

          <div className="space-y-3">
            {/* Category 1: Essential */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>A. Strictly Necessary & Essential Cookies (Always Active)</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                  Mandatory
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                These cookies and storage keys are indispensable for the core operation of ProjectKit. They enable secure student login sessions (JWT bearer validation), maintain shopping cart selections, and prevent Cross-Site Request Forgery (CSRF). Disabling these through browser settings will prevent the platform from operating.
              </p>
            </div>

            {/* Category 2: Functional */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                  <Cookie className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>B. Functional Preference Cookies</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  Configurable
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                These cookies remember choices you make, such as Light mode versus Dark mode theme settings, search history highlights, and wishlist favorites.
              </p>
            </div>

            {/* Category 3: Analytics */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                  <Cookie className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>C. Aggregated Analytics Cookies</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                  Requires Consent
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                These cookies collect anonymized, non-personally identifiable telemetry regarding how students navigate between project categories and technical stacks. This data helps our curriculum engineers curate higher-demand capstone kits. They are deactivated by default unless you explicitly grant consent.
              </p>
            </div>

            {/* Category 4: Marketing */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                  <XCircle className="w-4 h-4 text-slate-400" />
                  <span>D. Advertising & Third-Party Tracking Cookies</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                  Not Utilized
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ProjectKit does NOT participate in third-party ad networks or deploy invasive retargeting pixels across your student devices.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Zero-Pill Consent Discipline
          </h2>
          <p>
            In strict compliance with modern privacy mandates:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>We do NOT treat continued scrolling or page browsing as implied consent.</li>
            <li>Non-essential cookies remain deactivated until you actively choose to enable them.</li>
            <li>Your cookie preference selections are cryptographically recorded and stored for audit trails.</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Managing Cookies Through Your Web Browser
          </h2>
          <p className="text-xs">
            In addition to our on-site preferences banner, you can configure your browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge) to refuse or delete cookies. Note that blocking all cookies may prevent successful authentication and access to your purchased ZIP source archives.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};

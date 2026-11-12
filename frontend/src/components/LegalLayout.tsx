import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Shield,
  Cookie,
  RotateCcw,
  Copyright,
  HelpCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Printer,
  Scale,
} from 'lucide-react';
import { SEOHead } from './SEOHead';

interface LegalLayoutProps {
  title: string;
  documentType: string;
  version: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  documentType,
  version,
  lastUpdated,
  children,
}) => {
  const location = useLocation();

  const legalNavItems = [
    { name: 'Terms & Conditions', path: '/terms', icon: Scale },
    { name: 'Privacy Policy', path: '/privacy', icon: Shield },
    { name: 'Cookie Policy', path: '/cookies', icon: Cookie },
    { name: 'Refund & Cancellation', path: '/refund-policy', icon: RotateCcw },
    { name: 'Copyright & IP', path: '/copyright', icon: Copyright },
    { name: 'Grievance Redressal', path: '/grievance', icon: HelpCircle },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEOHead
        title={`${title} — ProjectKit`}
        description={`Read the official ${title} (Version ${version}) for ProjectKit verified academic technology marketplace.`}
        canonicalPath={location.pathname}
      />
      {/* Back to Home & Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-[#25335F]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#9AA6C7] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#E8ECFA] bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] rounded-xl hover:bg-slate-50 dark:hover:bg-[#16224A] transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Policy</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Policy Navigation */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] p-4 shadow-xs transition-colors">
            <div className="px-3 pb-3 mb-2 border-b border-slate-200 dark:border-[#25335F]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#9AA6C7]">
                Compliance Center
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7] mt-0.5">
                ProjectKit Governance Documents
              </p>
            </div>

            <nav className="space-y-1">
              {legalNavItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#2F4BFF] text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-[#9AA6C7] hover:bg-slate-100 dark:hover:bg-[#16224A] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Educational Purpose Card */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#070D1F] border border-blue-200 dark:border-[#25335F] text-xs text-blue-900 dark:text-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#2F4BFF] dark:text-[#5B7BFF]">
              <CheckCircle2 className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF] shrink-0" />
              <span>Academic Purpose</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-[#9AA6C7]">
              ProjectKit materials are strictly intended for engineering coursework and reference. No academic grades or faculty approvals are guaranteed.
            </p>
          </div>
        </aside>

        {/* Right Main Policy Content */}
        <main className="lg:col-span-9 bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] p-6 sm:p-10 shadow-xs transition-colors space-y-8 text-slate-900 dark:text-[#E8ECFA]">
          {/* Header Metadata */}
          <div className="border-b border-slate-200 dark:border-[#25335F] pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 dark:bg-[#16224A] text-[#2F4BFF] dark:text-[#5B7BFF] rounded-md border border-blue-200 dark:border-[#25335F]">
                Official Document: {documentType}
              </span>
              <span className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 dark:bg-[#070D1F] text-slate-700 dark:text-[#E8ECFA] rounded-md border border-slate-200 dark:border-[#25335F]">
                Version {version}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-[#9AA6C7]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last Updated: {lastUpdated}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
              {title}
            </h1>
          </div>

          {/* Mandatory Review Warning Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Legal Review & Customization Notice: </span>
              This document is a foundational compliance template structured in accordance with applicable Indian laws (including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023). Placeholders in <span className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded text-[11px] font-bold">[BRACKETS]</span> denote business particulars that must be formally supplied and verified by a qualified legal professional prior to commercial launch.
            </div>
          </div>

          {/* Document Body */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

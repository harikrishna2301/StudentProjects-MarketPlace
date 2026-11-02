import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  ShieldCheck,
  Award,
  BookCheck,
  FileCheck2,
  Database,
  HelpCircle,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Trust Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Verified Repositories</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Tested against Java 17, Node 18, and Python 3.10 with zero broken imports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">IEEE 830 Documentation</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Complete 80+ page Word & PDF reports meeting university syndicate guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">MySQL 3NF Schemas</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Normalized relational tables populated with realistic sample data records.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Viva Voce Master Guide</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                60+ examiner question answers tailored to your exact architectural stack.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter & Main Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Newsletter Box */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <FolderKanban className="w-4 h-4" />
              </div>
              <span>ProjectKit</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier academic project marketplace for B.Tech engineering graduates. Access production-style source code, IEEE reports, and viva defense kits.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm">
              <div className="text-xs font-semibold text-white mb-2">
                Get New Project Kits & Viva Alerts:
              </div>
              {subscribed ? (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed! Academic project alerts activated.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Engineering Domains */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Project Domains
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/projects?category=Web+Development" className="hover:text-white transition-colors">
                  Web & Full-Stack
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Java+%26+Spring+Boot" className="hover:text-white transition-colors">
                  Java 17 & Spring Boot 3
                </Link>
              </li>
              <li>
                <Link to="/projects?category=AI+%26+Machine+Learning" className="hover:text-white transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Python+%26+Data+Science" className="hover:text-white transition-colors">
                  Python & Data Analytics
                </Link>
              </li>
              <li>
                <Link to="/projects?category=IoT+%26+Embedded" className="hover:text-white transition-colors">
                  IoT & Embedded Telemetry
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Cybersecurity+%26+Cloud" className="hover:text-white transition-colors">
                  Cybersecurity & Cloud
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Documentation & Deliverables */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Kit Deliverables
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  IEEE 830 Standard SRS
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  StarUML Class & Sequence Models
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  MySQL 8 Relational Schema
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  60+ Viva Voce Question Bank
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Seminar Presentation PPTX
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Installation Runbooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Platform & Accounts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/purchases" className="hover:text-white transition-colors">
                  My Purchases & Downloads
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Management Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Academic License & Fair Use
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Spring Boot 3 API Roadmap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ProjectKit Marketplace. Engineered for B.Tech, M.Tech, and MCA academic capstones.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Frontend Preview · Java 17, Spring Boot 3 & MySQL Architecture Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

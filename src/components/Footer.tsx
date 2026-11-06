import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import {
  Mail,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  FolderCode,
  Sliders,
  Scale,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const openCookiePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#070D1F] border-t border-slate-200 dark:border-[#25335F] text-slate-600 dark:text-[#9AA6C7] pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" variant="full" tagline="Build. Learn. Launch." />

            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed max-w-sm pt-2">
              A curated technology marketplace for B.Tech & engineering students. Explore verified
              project kits complete with full source code, IEEE standard documentation, and
              viva voce preparation guides.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#0F1830] hover:bg-slate-50 dark:hover:bg-[#16224A] border border-slate-200 dark:border-[#25335F] hover:border-[#2F4BFF] flex items-center justify-center text-slate-600 dark:text-[#9AA6C7] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors shadow-xs"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#0F1830] hover:bg-slate-50 dark:hover:bg-[#16224A] border border-slate-200 dark:border-[#25335F] hover:border-[#2F4BFF] flex items-center justify-center text-slate-600 dark:text-[#9AA6C7] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors shadow-xs"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@projectkit.edu"
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#0F1830] hover:bg-slate-50 dark:hover:bg-[#16224A] border border-slate-200 dark:border-[#25335F] hover:border-[#2F4BFF] flex items-center justify-center text-slate-600 dark:text-[#9AA6C7] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors shadow-xs"
                aria-label="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Explore Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#E8ECFA]">
              Explore Projects
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#9AA6C7]">
              <li>
                <Link to="/projects?category=Java+%26+Spring+Boot" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Java & Spring Boot
                </Link>
              </li>
              <li>
                <Link to="/projects?category=AI+%26+Machine+Learning" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Web+Development" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Full-Stack MERN
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Cybersecurity+%26+Cloud" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Cyber Security & Cloud
                </Link>
              </li>
              <li>
                <Link to="/projects?category=IoT+%26+Embedded" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  IoT & Embedded
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Student Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#E8ECFA]">
              Student Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#9AA6C7]">
              <li>
                <Link to="/dashboard" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/purchases" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  My Purchased Kits
                </Link>
              </li>
              <li>
                <Link to="/dashboard/wishlist" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/dashboard/downloads" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Download Manager
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  About ProjectKit
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors font-mono">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#E8ECFA]">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#9AA6C7]">
              <li>
                <Link to="/terms" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Privacy Policy (DPDPA)
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Intellectual Property
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] transition-colors">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookiePreferences}
                  className="flex items-center gap-1.5 text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline transition-colors pt-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cookie Preferences</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Purpose Disclaimer Banner */}
        <div className="pt-8 border-t border-slate-200 dark:border-[#25335F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#9AA6C7]">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <ShieldCheck className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-800 dark:text-[#E8ECFA]">Academic Research Notice:</strong>{' '}
              All projects hosted on ProjectKit are provided strictly as reference implementations and educational
              starter kits for research, conceptual understanding, and final-year university laboratory study.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-500 dark:text-[#9AA6C7]">
            <span>India DPDPA 2023 Compliant</span>
            <span>·</span>
            <span>₹ INR Verified Payments</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Badges */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#25335F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#9AA6C7]">
          <p>© {new Date().getFullYear()} ProjectKit. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-[#2F4BFF] dark:text-[#5B7BFF]">Spring Boot 3.3.5</span>
            <span>·</span>
            <span className="text-[#2F4BFF] dark:text-[#5B7BFF]">Java 17</span>
            <span>·</span>
            <span className="text-[#2F4BFF] dark:text-[#5B7BFF]">React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

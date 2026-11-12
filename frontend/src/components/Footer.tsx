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
    <footer
      className="bg-gradient-to-b from-[#25134D] via-[#1A0D3D] to-[#0B0720] text-white border-t border-[#3A2074] pt-16 pb-12 transition-colors duration-300 relative overflow-hidden shadow-inner"
    >
      {/* Subtle atmospheric ambient glow to enhance purple depth */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#6A2FC8]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#9D71E8]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            {/* Highly visible logo card container ensuring maximum contrast and prominence */}
            <div className="inline-flex items-center p-3.5 rounded-2xl bg-[#0B0720]/85 backdrop-blur-md border border-[#9D71E8]/50 shadow-xl hover:border-[#D1B8FF]/70 transition-all">
              <BrandLogo size="lg" variant="full" tagline="Build. Learn. Launch." lightText={true} />
            </div>

            <p className="text-xs text-[#D1B8FF]/90 leading-relaxed max-w-sm pt-2 font-normal">
              A curated technology marketplace for B.Tech & engineering students. Explore verified
              project kits complete with full source code, IEEE standard documentation, and
              viva voce preparation guides.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/50 flex items-center justify-center text-white transition-all shadow-xs"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/50 flex items-center justify-center text-white transition-all shadow-xs"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@projectkit.in?subject=ProjectKit%20Support%20Request"
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/50 flex items-center justify-center text-white transition-all shadow-xs"
                aria-label="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Explore Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore Projects
            </h4>
            <ul className="space-y-2 text-xs text-purple-100">
              <li>
                <Link to="/projects?category=Java+%26+Spring+Boot" className="hover:text-white hover:underline transition-colors">
                  Java & Spring Boot
                </Link>
              </li>
              <li>
                <Link to="/projects?category=AI+%26+Machine+Learning" className="hover:text-white hover:underline transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Web+Development" className="hover:text-white hover:underline transition-colors">
                  Full-Stack MERN
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Cybersecurity+%26+Cloud" className="hover:text-white hover:underline transition-colors">
                  Cyber Security & Cloud
                </Link>
              </li>
              <li>
                <Link to="/projects?category=IoT+%26+Embedded" className="hover:text-white hover:underline transition-colors">
                  IoT & Embedded
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Student Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Student Hub
            </h4>
            <ul className="space-y-2 text-xs text-purple-100">
              <li>
                <Link to="/dashboard" className="hover:text-white hover:underline transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/purchases" className="hover:text-white hover:underline transition-colors">
                  My Purchased Kits
                </Link>
              </li>
              <li>
                <Link to="/dashboard/wishlist" className="hover:text-white hover:underline transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/dashboard/downloads" className="hover:text-white hover:underline transition-colors">
                  Download Manager
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors">
                  About ProjectKit
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white hover:underline transition-colors font-mono">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-purple-100">
              <li>
                <Link to="/terms" className="hover:text-white hover:underline transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white hover:underline transition-colors">
                  Privacy Policy (DPDPA)
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white hover:underline transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white hover:underline transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="hover:text-white hover:underline transition-colors">
                  Intellectual Property
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="hover:text-white hover:underline transition-colors">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookiePreferences}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white hover:underline transition-colors pt-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cookie Preferences</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Purpose Disclaimer Banner */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-purple-100/90">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Academic Research Notice:</strong>{' '}
              All projects hosted on ProjectKit are provided strictly as reference implementations and educational
              starter kits for research, conceptual understanding, and final-year university laboratory study.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-purple-200">
            <span>India DPDPA 2023 Compliant</span>
            <span>·</span>
            <span>₹ INR Verified Payments</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Badges */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-200/90">
          <p>© {new Date().getFullYear()} ProjectKit. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-purple-100">
            <span className="font-semibold text-white">Spring Boot 3.3.5</span>
            <span>·</span>
            <span className="font-semibold text-white">Java 17</span>
            <span>·</span>
            <span className="font-semibold text-white">React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { useProjects } from '../context/ProjectsContext';
import { ProjectCard } from '../components/ProjectCard';
import { CategoryCard } from '../components/CategoryCard';
import { SEOHead } from '../components/SEOHead';
import { StudentReviewsSection } from '../components/StudentReviewsSection';
import studentService from '../services/studentService';
import { filterAdminProjects } from '../utils/adminProjectFilters';
import {
  ArrowRight,
  Search,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BookOpen,
  Sparkles,
  ChevronRight,
  Award,
  Layers,
  HelpCircle,
  Code2,
  Lock,
  Cpu,
  Mail,
  Phone,
  Clock,
  Send,
  Check,
  Copy,
  Zap,
  AlertCircle,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { projects, categories } = useProjects();

  const [featuredDomain, setFeaturedDomain] = useState<string>('All');
  const [homeProjectSearch, setHomeProjectSearch] = useState<string>('');

  // Handle smooth scroll if navigated with hash or on hash change
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        }
      }
    };

    const timer = setTimeout(handleHash, 100);
    window.addEventListener('hashchange', handleHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactBackendOffline, setContactBackendOffline] = useState(false);
  const [contactTicketNumber, setContactTicketNumber] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@projectkit.in');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  const generateHomeMailtoUrl = () => {
    const subject = encodeURIComponent(contactForm.subject || 'ProjectKit Support Request');
    const bodyText = `Hello ProjectKit Support Team,\n\nName: ${contactForm.name || '[Your Name]'}\nEmail: ${contactForm.email || '[Your Email]'}\n\nMessage:\n${contactForm.message || ''}`;
    return `mailto:support@projectkit.in?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactBackendOffline(false);
      setContactError('Please complete all required fields (Name, Email, and Inquiry Details).');
      return;
    }

    try {
      setContactLoading(true);
      setContactError('');
      setContactBackendOffline(false);
      const res = await studentService.submitContactInquiry({
        fullName: contactForm.name.trim(),
        email: contactForm.email.trim(),
        category: 'Homepage Quick Inquiry',
        subject: contactForm.subject.trim() || 'ProjectKit Support Request',
        message: contactForm.message.trim(),
      });
      setContactTicketNumber(res?.ticketNumber || `TCK-${Date.now().toString().slice(-6)}`);
      setContactSubmitted(true);
    } catch (err: any) {
      setContactSubmitted(false);
      setContactBackendOffline(Boolean(err?.isBackendOffline));
      setContactError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to send inquiry right now. Please email support@projectkit.in directly.'
      );
    } finally {
      setContactLoading(false);
    }
  };

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  // Filtered featured projects (supports direct homepage search across all listed kits + domain filter)
  const domainFilteredProjects = projects.filter((p) => {
    if (featuredDomain === 'All') return true;
    return p.category.toLowerCase().includes(featuredDomain.toLowerCase());
  });
  const filteredFeatured = homeProjectSearch.trim()
    ? filterAdminProjects(domainFilteredProjects, homeProjectSearch, 'All').slice(0, 6)
    : domainFilteredProjects.slice(0, 6);

  // Popular category quick links for the hero bottom strip
  const popularCategories = [
    { name: 'Web Apps', query: 'Web Development' },
    { name: 'Java', query: 'Java & Spring Boot' },
    { name: 'Python', query: 'Python Full Stack' },
    { name: 'AI/ML', query: 'AI & Machine Learning' },
    { name: 'IoT', query: 'IoT & Embedded' },
  ];

  return (
    <div className="bg-[#F5F7FB] dark:bg-[#070D1F] text-slate-900 dark:text-[#E8ECFA] transition-colors duration-200">
      <SEOHead
        title="ProjectKit — Verified Student Projects Marketplace | B.Tech & Engineering"
        description="Verified B.Tech final year project kits with source code, IEEE standard reports, and viva voce cheat sheets at student-friendly prices."
        canonicalPath="/"
      />

      {/* =========================================================================
          1. FULL-VIEWPORT HERO SECTION (min-height: 100svh)
          ========================================================================= */}
      <Hero onHowItWorksClick={scrollToSection('how-it-works')} />

      {/* Subtle Divider between Hero and Rest of Site */}
      <div className="pk-divider" />

      {/* =========================================================================
          2. FEATURED PROJECTS SECTION (3D Tilt & Layered Depth)
          ========================================================================= */}
      <section id="featured-projects" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#25335F]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#9D71E8] dark:text-[#D1B8FF]" />
              <span>Recommended Kits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
              Featured Final-Year Project Kits
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] mt-1">
              Fully runnable applications verified by experienced university evaluators.
            </p>
          </div>

          {/* Domain Filter Switcher + Direct Section Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#C5B4E3] absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="home-featured-search"
                type="text"
                aria-label="Search featured projects on home page"
                value={homeProjectSearch}
                onChange={(e) => setHomeProjectSearch(e.target.value)}
                placeholder="Search kits on this page..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-white dark:bg-[#1A0D3D] border border-slate-200 dark:border-[#3A2074] rounded-xl text-slate-900 dark:text-[#F2E9FF] placeholder:text-slate-400 dark:placeholder:text-[#C5B4E3]/60 outline-none focus:border-[#6A2FC8] dark:focus:border-[#9D71E8]"
              />
              {homeProjectSearch && (
                <button
                  type="button"
                  onClick={() => setHomeProjectSearch('')}
                  aria-label="Clear homepage project search"
                  className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-[#1A0D3D] rounded-xl border border-slate-200 dark:border-[#3A2074] shadow-xs">
              {['All', 'Java', 'Python', 'Web', 'IoT'].map((domain) => (
                <button
                  key={domain}
                  onClick={() => setFeaturedDomain(domain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    featuredDomain === domain
                      ? 'bg-[#6A2FC8] text-white shadow-xs'
                      : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
                  }`}
                >
                  {domain === 'All' ? 'All Focus' : domain}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matching Project Cards */}
        {filteredFeatured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatured.map((project) => (
              <div key={project.id} className="pk-card-tilt h-full">
                <ProjectCard project={project} searchQuery={homeProjectSearch} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-[#F2E9FF]">
              No kits matched &ldquo;{homeProjectSearch.trim()}&rdquo; in {featuredDomain === 'All' ? 'any category' : featuredDomain}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setHomeProjectSearch('');
                  setFeaturedDomain('All');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#25134D] text-slate-800 dark:text-[#F2E9FF] hover:bg-slate-200 dark:hover:bg-[#3A2074] cursor-pointer"
              >
                Clear Search
              </button>
              {homeProjectSearch.trim() && (
                <Link
                  to={`/projects?search=${encodeURIComponent(homeProjectSearch.trim())}`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#6A2FC8] hover:bg-[#5824A8] text-white"
                >
                  Search Full Catalog →
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            to={homeProjectSearch.trim() ? `/projects?search=${encodeURIComponent(homeProjectSearch.trim())}` : '/projects'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1A0D3D] hover:bg-slate-50 dark:hover:bg-[#25134D] text-slate-900 dark:text-[#E8ECFA] rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#3A2074] hover:border-[#6A2FC8] transition-all shadow-xs"
          >
            <span>
              {homeProjectSearch.trim()
                ? `View All Results for "${homeProjectSearch.trim()}" in Directory`
                : `Browse Full Project Directory (${projects.length}+ Kits)`}
            </span>
            <ArrowRight className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8]" />
          </Link>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          3. CATEGORIES SECTION (10 Academic Domains)
          ========================================================================= */}
      <section id="popular-categories" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#3A2074]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8] mb-1">
              Curriculum Specializations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
              Explore by Academic Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] mt-1">
              Find complete project kits aligned with engineering department guidelines.
            </p>
          </div>

          <Link
            to="/projects"
            className="text-xs font-semibold text-[#6A2FC8] hover:text-[#5824A8] dark:text-[#9D71E8] dark:hover:text-[#D1B8FF] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 10 Categories Responsive Grid: 2 columns on tablet, 5 columns on desktop for perfect 2-row symmetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
          {categories.map((category) => (
            <div key={category.id} className="h-full w-full flex flex-col">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          4. HOW IT WORKS SECTION (Clean 3-Step Process)
          ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8]">
            Simple 3-Step Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
            How ProjectKit Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7]">
            From selection to execution in three straightforward, verified steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="card pk-card-tilt p-6 sm:p-7 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center font-bold text-sm font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">1. Pick Your Capstone Kit</h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Explore curated project kits categorized by branch, domain, and university semester. Review technical architectures, ER diagrams, and package deliverables.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card pk-card-tilt p-6 sm:p-7 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-[#9D71E8] dark:text-[#D1B8FF] flex items-center justify-center font-bold text-sm font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">2. Complete Verified Checkout</h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Pay securely via Razorpay gateway using UPI, Cards, or Net Banking. Every order is verified with server-side HMAC signatures for payment protection.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card pk-card-tilt p-6 sm:p-7 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center font-bold text-sm font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">3. Instant Deliverables Access</h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Instantly unlock and download your full runnable source code ZIP, IEEE format report (.docx / .pdf), database SQL dumps, and comprehensive viva preparation guides.
            </p>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          5. WHY PROJECTKIT SECTION (Platform Integrity)
          ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8]">
              Platform Integrity
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
              Why Engineering Students Trust ProjectKit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Every project kit is built following industry design patterns and structured to help you understand, defend, and present your final-year capstone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shadow-xs">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Verified Runnable Code</h3>
              <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
                Pre-configured Maven / Gradle / npm workspaces with Dockerfiles and setup guides to ensure you run the project in minutes without dependency conflicts.
              </p>
            </div>

            <div className="card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-[#9D71E8] dark:text-[#D1B8FF] flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">IEEE Standard Reports</h3>
              <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
                Includes full 80+ page standard IEEE format documentation, complete with UML diagrams, system architecture blueprints, and entity relationships.
              </p>
            </div>

            <div className="card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Viva Voce Preparation</h3>
              <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
                Comprehensive viva cheat sheets with answers to anticipated faculty questions, design decisions, and architectural trade-off justifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          PRICING SECTION (Student-Friendly Project Tiers starting from ₹999)
          ========================================================================= */}
      <section id="pricing" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8]">
            <Zap className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#9D71E8]" />
            <span>Transparent Student Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
            One-Time Payment. Lifetime Project Access.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
            Every kit starts from ₹999 with instant code downloads, standard IEEE documentation, and verified run scripts. No hidden subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Tier 1: Starter Kit */}
          <div className="card pk-card-tilt p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A798C4]">
                  Mini-Projects & Labs
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#E8ECFA] mt-1">Starter Kit</h3>
                <p className="text-xs text-slate-600 dark:text-[#9AA6C7] mt-1">
                  Ideal for semester mini-projects and baseline lab assignments.
                </p>
              </div>

              <div className="pt-2 pb-1 border-y border-slate-100 dark:border-[#3A2074]">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#E8ECFA] font-mono">₹999</span>
                  <span className="text-xs text-slate-500 dark:text-[#9AA6C7]">/ project</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Instant ZIP download upon payment
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#CBD5E1] pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full runnable source code archive (.zip)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>MySQL / PostgreSQL schema & seed script</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Step-by-step local installation guide</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Basic architecture overview diagram</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400 dark:text-slate-500 line-through">
                  <span>IEEE 80+ page standard Word report</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400 dark:text-slate-500 line-through">
                  <span>Viva voce cheat sheet & Q&A bank</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/projects"
                className="w-full py-3 px-4 bg-slate-100 dark:bg-[#25134D] hover:bg-slate-200 dark:hover:bg-[#3A2074] text-slate-900 dark:text-[#E8ECFA] rounded-xl text-xs font-semibold text-center block transition-all"
              >
                Browse Starter Kits
              </Link>
            </div>
          </div>

          {/* Tier 2: Complete Academic Kit (Recommended - Subtle, no excessive scale or bending) */}
          <div className="card pk-card-tilt relative p-6 sm:p-8 flex flex-col justify-between !border-2 !border-[#6A2FC8] dark:!border-[#9D71E8] shadow-xl shadow-[#6A2FC8]/15">
            {/* Recommended Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6A2FC8] to-[#9D71E8] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
              Most Popular • Final-Year Recommended
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8]">
                  B.Tech Capstone Ready
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#E8ECFA] mt-1">Complete Academic Kit</h3>
                <p className="text-xs text-slate-600 dark:text-[#9AA6C7] mt-1">
                  Everything required to build, test, document, and defend your project.
                </p>
              </div>

              <div className="pt-2 pb-1 border-y border-slate-100 dark:border-[#3A2074]">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#6A2FC8] dark:text-[#D1B8FF] font-mono">₹1,999</span>
                  <span className="text-xs text-slate-500 dark:text-[#9AA6C7]">/ project</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Instant full deliverables bundle
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#CBD5E1] pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-900 dark:text-[#E8ECFA]">Complete verified runnable source code</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-900 dark:text-[#E8ECFA]">80+ page standard IEEE documentation (.docx & .pdf)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8] shrink-0 mt-0.5" />
                  <span>Editable PPT presentation slides for review rounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8] shrink-0 mt-0.5" />
                  <span>Viva voce cheat sheet with 50+ faculty questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8] shrink-0 mt-0.5" />
                  <span>Complete UML, DFD, and ER database schemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8] shrink-0 mt-0.5" />
                  <span>6-month bugfix & setup guidance support</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/projects"
                className="w-full py-3.5 px-4 bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white rounded-xl text-xs font-semibold text-center block shadow-lg shadow-[#6A2FC8]/30 transition-all"
              >
                Explore Complete Kits
              </Link>
            </div>
          </div>

          {/* Tier 3: Enterprise Capstone */}
          <div className="card pk-card-tilt p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9AA6C7]">
                  High Complexity / Honors
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#E8ECFA] mt-1">Enterprise Capstone</h3>
                <p className="text-xs text-slate-600 dark:text-[#9AA6C7] mt-1">
                  Advanced AI/ML, Microservices, and Cloud-native projects.
                </p>
              </div>

              <div className="pt-2 pb-1 border-y border-slate-100 dark:border-[#25335F]">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#E8ECFA] font-mono">₹3,499</span>
                  <span className="text-xs text-slate-500 dark:text-[#9AA6C7]">/ project</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Includes Docker & Cloud manifests
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#CBD5E1] pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Everything in Complete Academic Kit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Docker Compose & Kubernetes deployment YAMLs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pre-trained AI models & Jupyter validation notebooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Comprehensive 100+ question viva defense bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority 1-on-1 advisor resolution via email</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/projects"
                className="w-full py-3 px-4 bg-slate-100 dark:bg-[#16224A] hover:bg-slate-200 dark:hover:bg-[#1C2C5E] text-slate-900 dark:text-[#E8ECFA] rounded-xl text-xs font-semibold text-center block transition-all"
              >
                Browse Capstone Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          6. TESTIMONIALS SECTION (Student Success Proof)
      {/* =========================================================================
          6. STUDENT REVIEWS & RATINGS SECTION
          ========================================================================= */}
      <section id="student-reviews" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#3A2074]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8] mb-1">
              Verified Academic Feedback
            </div>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-[#E8ECFA] tracking-tight">
              Student Reviews & Viva Defense Ratings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] mt-1">
              Independent evaluations from final-year engineering scholars who defended ProjectKit capstones across top universities.
            </p>
          </div>
        </div>

        <StudentReviewsSection showHeaderSummary={true} />
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          7. FAQ SECTION
          ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8]">
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7]">
            Clear answers about deliverables, licensing, and payment processing.
          </p>
        </div>

        <div className="space-y-4">
          <div className="card p-6 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              Are these project kits fully runnable and tested?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Yes. Each kit is tested across clean environments with modern JDK versions (Java 17 / Python 3.10+) and includes step-by-step installation instructions, database schemas, and sample test accounts.
            </p>
          </div>

          <div className="card p-6 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              What files do I receive immediately after payment?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              You receive instant access to download the full source code archive (.zip), the 80+ page standard IEEE documentation in both editable Word (.docx) and PDF formats, MySQL database dumps, and the viva voce cheat sheet.
            </p>
          </div>

          <div className="card p-6 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              Can I customize the code and add my own features?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Absolutely. All projects are provided as clean starter kits and reference implementations. You are encouraged to modify the UI, add custom algorithms, and tailor the logic to match your specific college project objectives.
            </p>
          </div>

          <div className="card p-6 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              What payment methods are supported?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              We support UPI (Google Pay, PhonePe, Paytm), all major Debit/Credit cards, and Indian Net Banking through our Razorpay integration with 256-bit encryption.
            </p>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          CONTACT SECTION (Academic Inquiries, Support & Quick Message Form)
          ========================================================================= */}
      <section id="contact" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8]">
            <Mail className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#9D71E8]" />
            <span>Academic Support & Inquiries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
            We Are Here to Help You Succeed
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
            Have questions about project stack compatibility, IEEE formatting guidelines, or custom feature additions? Reach out to our engineering support desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card p-6 sm:p-7 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-xs">
                {/* Official Email Item with Action & Copy */}
                <div className="card p-3.5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 dark:text-[#F2E9FF]">Official Academic Email Support</div>
                      <a
                        href="mailto:support@projectkit.in?subject=ProjectKit%20Academic%20Support%20Request&body=Hello%20ProjectKit%20Team%2C%0A%0AMy%20Name%3A%20%0ACollege%3A%20%0AProject%20Kit%20Inquiry%3A%20%0A"
                        className="text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline font-mono text-xs font-semibold block truncate"
                        title="Click to compose email"
                      >
                        support@projectkit.in
                      </a>
                      <div className="text-[10px] text-slate-500 dark:text-[#C5B4E3] mt-0.5">Average reply time: under 2 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="mailto:support@projectkit.in?subject=ProjectKit%20Academic%20Support%20Request&body=Hello%20ProjectKit%20Support%20Team%2C%0A%0AStudent%20Name%3A%20%0AUniversity%20%2F%20College%3A%20%0AProject%20Kit%20Title%3A%20%0A%0AMy%20Question%20or%20Request%3A%20%0A"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-[11px] font-semibold transition-all shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Email</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/40 dark:bg-[#25134D]/80 border border-white/30 dark:border-[#3A2074] text-[11px] font-semibold text-slate-700 dark:text-[#F2E9FF] hover:bg-white/60 dark:hover:bg-[#3A2074] transition-all cursor-pointer"
                    >
                      {emailCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-[#C5B4E3]" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* WhatsApp & Phone Item */}
                <div className="card flex items-start gap-3.5 p-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-[#F2E9FF]">Student Helpline & WhatsApp</div>
                    <a
                      href="tel:+919876543210"
                      className="text-slate-700 dark:text-[#CBD5E1] hover:text-[#6A2FC8] dark:hover:text-[#D1B8FF] font-mono text-xs"
                    >
                      +91 98765 43210
                    </a>
                    <div className="text-[11px] text-slate-500 dark:text-[#C5B4E3] mt-0.5">Direct coordinator assistance</div>
                  </div>
                </div>

                {/* Operating Hours Item */}
                <div className="card flex items-start gap-3.5 p-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-[#F2E9FF]">Support Desk Hours</div>
                    <div className="text-slate-600 dark:text-[#C5B4E3]">Monday – Saturday: 9:00 AM – 8:00 PM IST</div>
                    <div className="text-[11px] text-slate-500 dark:text-[#C5B4E3] mt-0.5">Emergency review day coverage active</div>
                  </div>
                </div>
              </div>

              {/* Webmail fallback info */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#3A2074] space-y-2">
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Using webmail (Gmail/Outlook)?</strong> Click "Copy Address" above, or visit our{' '}
                  <Link to="/contact" className="text-[#6A2FC8] dark:text-[#D1B8FF] font-bold underline">
                    Dedicated Support Desk
                  </Link>{' '}
                  for custom project requests.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-8">
              {contactSubmitted ? (
                <div className="py-10 text-center space-y-4 animate-hero-1">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#E8ECFA]">
                    Message Sent Successfully!
                  </h3>
                  {contactTicketNumber && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                      <span>Ticket Ref:</span>
                      <span>{contactTicketNumber}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 dark:text-[#9AA6C7] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900 dark:text-white">{contactForm.name}</strong>. Our academic engineering advisor has received your inquiry regarding <span className="text-[#6A2FC8] dark:text-[#D1B8FF] font-medium">{contactForm.subject || 'Project Support'}</span> and will reply to <span className="font-mono text-slate-700 dark:text-slate-300">{contactForm.email}</span> shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setContactForm({ name: '', email: '', subject: '', message: '' });
                        setContactSubmitted(false);
                        setContactError('');
                      }}
                      className="px-5 py-2.5 bg-slate-100 dark:bg-[#25134D] hover:bg-slate-200 dark:hover:bg-[#3A2074] text-slate-900 dark:text-[#E8ECFA] rounded-xl text-xs font-semibold transition-all"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {contactError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-200 space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                        <div className="space-y-1">
                          <p className="font-semibold text-rose-900 dark:text-rose-100">
                            {contactBackendOffline ? 'Online Inquiry Server Offline' : 'Could Not Submit Inquiry'}
                          </p>
                          <p className="leading-relaxed">{contactError}</p>
                        </div>
                      </div>
                      {contactBackendOffline && (
                        <div className="flex flex-wrap items-center gap-2 pl-6">
                          <a
                            href={generateHomeMailtoUrl()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-[11px] font-semibold transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send via Email App Instead</span>
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyEmail}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#25134D] border border-rose-200 dark:border-[#3A2074] text-slate-700 dark:text-[#F2E9FF] text-[11px] font-semibold hover:bg-slate-50 dark:hover:bg-[#3A2074] transition-colors cursor-pointer"
                          >
                            {emailCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{emailCopied ? 'Email Copied' : 'Copy support@projectkit.in'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Aditi Rao"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#E8ECFA] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="aditi@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#E8ECFA] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                      Project Domain or Kit Inquired
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. AI Crop Disease Prediction / Spring Boot E-Commerce"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#E8ECFA] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                      Inquiry Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe what tech stack, deliverables, or assistance you require for your submission..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#E8ECFA] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">
                      We respect your privacy. No spam.
                    </span>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#6A2FC8]/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{contactLoading ? 'Sending Inquiry...' : 'Send Inquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          8. CALL TO ACTION SECTION (Deep Purple Palette Card)
          ========================================================================= */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#25134D] to-[#0B0720] border border-[#3A2074] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6A2FC8]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D1B8FF]">
              Get Started Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Complete Your Final Year Project?
            </h2>
            <p className="text-xs sm:text-sm text-[#D1B8FF]/90 leading-relaxed">
              Explore 24+ engineering capstone kits with verified source code and standard IEEE documentation.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/projects"
              className="px-7 py-3.5 bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white text-xs font-semibold rounded-[9px] shadow-lg shadow-[#6A2FC8]/35 transition-transform hover:scale-[1.01] active:scale-[0.98]"
            >
              Browse Complete Catalog
            </Link>
            <a
              href="#how-it-works"
              onClick={scrollToSection('how-it-works')}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-[9px] transition-transform hover:scale-[1.01] active:scale-[0.98]"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

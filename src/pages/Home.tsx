import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { ProjectCard } from '../components/ProjectCard';
import { CategoryCard } from '../components/CategoryCard';
import { SEOHead } from '../components/SEOHead';
import {
  ArrowRight,
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
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { projects, categories } = useProjects();

  const [featuredDomain, setFeaturedDomain] = useState<string>('All');

  // Handle smooth scroll if navigated with hash
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered featured projects
  const filteredFeatured = projects
    .filter((p) => {
      if (featuredDomain === 'All') return true;
      return p.category.toLowerCase().includes(featuredDomain.toLowerCase());
    })
    .slice(0, 6);

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
      <section
        aria-label="Hero Introduction"
        className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B1B3F] to-[#16224A]"
      >
        {/* Full-viewport Hero Background Image (with slow subtle zoom & responsive focal point) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
          <picture>
            <source srcSet="/hero-bg.webp" type="image/webp" />
            <img
              src="/hero-bg.jpg"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[70%_center] sm:object-center animate-hero-zoom"
            />
          </picture>
        </div>

        {/* Readability Overlays: Navy gradient (0.55 top/left, 0.25 middle, 0.60 bottom) */}
        {/* 1. Vertical Navy Gradient: Keeps text readable while girl and laptop remain clearly visible */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(7,13,31,0.55) 0%, rgba(7,13,31,0.25) 45%, rgba(7,13,31,0.60) 100%)',
          }}
        />

        {/* 2. Horizontal Left Gradient: Enhances text legibility on desktop while leaving the right half open for the girl */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(to right, rgba(7,13,31,0.60) 0%, rgba(7,13,31,0.40) 35%, rgba(7,13,31,0.10) 65%, transparent 100%)',
          }}
        />

        {/* 3. Subtle ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(circle at 35% 20%, rgba(47,75,255,0.18) 0%, transparent 65%)',
          }}
        />

        {/* Hero Content: Desktop left-aligned (max-w-[560px]), Mobile centered upper area */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[13vh] sm:pt-[16vh] pb-8 flex-1 flex flex-col justify-start">
          <div className="max-w-[560px] text-center lg:text-left mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
            {/* Eyebrow Frosted Pill */}
            <div className="animate-hero-eyebrow mb-5">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.14)] border border-[rgba(255,255,255,0.35)] backdrop-blur-[8px] text-[11px] sm:text-xs font-semibold text-[#FFFFFF] tracking-wide shadow-xs">
                Ready-to-submit final year projects
              </span>
            </div>

            {/* H1: Build. Submit. Succeed. (Word-by-word reveal) */}
            <h1
              className="font-inter font-bold text-[clamp(2.1rem,4.8vw,3.25rem)] leading-[1.12] tracking-[-0.025em] text-[#FFFFFF] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] mb-4"
              style={{ textWrap: 'balance' }}
            >
              <span className="animate-word-1 inline-block text-[#FFFFFF] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] mr-2.5">Build.</span>
              <span className="animate-word-2 inline-block text-[#FFFFFF] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] mr-2.5">Submit.</span>
              <span className="animate-word-3 inline-block text-[#A5B4FF] animate-shimmer-succeed [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">Succeed.</span>
            </h1>

            {/* Subtext: rgba(255,255,255,0.88) with text-shadow */}
            <p className="animate-hero-subtext text-sm sm:text-base text-[rgba(255,255,255,0.88)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] leading-relaxed mb-8 max-w-[480px]">
              Verified B.Tech project kits with source code, report and documentation, at student-friendly prices.
            </p>

            {/* Two Buttons: Primary "Browse Projects" and Secondary "How It Works" */}
            <div className="animate-hero-buttons flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <Link
                to="/projects"
                className="w-full sm:w-auto px-6 py-3 bg-[#0B1B3F] hover:bg-[#152857] active:bg-[#071129] text-white text-xs font-semibold rounded-[9px] border border-[rgba(255,255,255,0.25)] shadow-lg shadow-[#0B1B3F]/40 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7BFF] focus-visible:ring-offset-2 min-h-[44px]"
              >
                <span>Browse Projects</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-6 py-3 bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.22)] border border-[rgba(255,255,255,0.4)] backdrop-blur-md text-[#FFFFFF] text-xs font-semibold rounded-[9px] shadow-xs flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7BFF] focus-visible:ring-offset-2 min-h-[44px]"
              >
                <span>How It Works</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip Pinned to Hero: Popular Categories with subtle dark gradient backdrop */}
        <div className="relative z-10 w-full bg-gradient-to-t from-black/50 via-black/30 to-transparent border-t border-white/15 animate-hero-bottom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs">
            <span className="uppercase tracking-wider font-bold text-[10px] text-white/90 shrink-0 drop-shadow-xs">
              Popular categories:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/projects?category=${encodeURIComponent(cat.query)}`}
                  className="text-white/90 hover:text-white font-medium text-xs transition-colors drop-shadow-xs hover:underline underline-offset-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider between Hero and Rest of Site */}
      <div className="pk-divider" />

      {/* =========================================================================
          2. FEATURED PROJECTS SECTION (3D Tilt & Layered Depth)
          ========================================================================= */}
      <section id="featured-projects" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#25335F]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F4BFF] dark:text-[#5B7BFF] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7] dark:text-[#8C7CFF]" />
              <span>Recommended Kits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
              Featured Final-Year Project Kits
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] mt-1">
              Fully runnable applications verified by experienced university evaluators.
            </p>
          </div>

          {/* Domain Filter Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-[#0F1830] rounded-xl border border-slate-200 dark:border-[#25335F] shadow-xs">
            {['All', 'Java', 'Python', 'Web', 'IoT'].map((domain) => (
              <button
                key={domain}
                onClick={() => setFeaturedDomain(domain)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  featuredDomain === domain
                    ? 'bg-[#2F4BFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
                }`}
              >
                {domain === 'All' ? 'All Focus' : domain}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Featured Project Cards with 3D Depth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatured.map((project) => (
            <div key={project.id} className="pk-card-tilt h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#0F1830] hover:bg-slate-50 dark:hover:bg-[#16224A] text-slate-900 dark:text-[#E8ECFA] rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#25335F] hover:border-[#2F4BFF] transition-all shadow-xs hover:scale-[1.02]"
          >
            <span>Browse Full Project Directory ({projects.length}+ Kits)</span>
            <ArrowRight className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF]" />
          </Link>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          3. CATEGORIES SECTION (10 Academic Domains)
          ========================================================================= */}
      <section id="popular-categories" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#25335F]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2F4BFF] dark:text-[#5B7BFF] mb-1">
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
            className="text-xs font-semibold text-[#2F4BFF] hover:text-[#1E36D6] dark:text-[#5B7BFF] dark:hover:text-[#8C7CFF] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 10 Categories Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((category) => (
            <div key={category.id} className="pk-card-tilt h-full">
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
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2F4BFF] dark:text-[#5B7BFF]">
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
          <div className="pk-card-tilt bg-white dark:bg-[#0F1830] p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-[#25335F] hover:border-[#2F4BFF] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] text-[#2F4BFF] dark:text-[#5B7BFF] flex items-center justify-center font-bold text-sm font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">1. Pick Your Capstone Kit</h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Explore curated project kits categorized by branch, domain, and university semester. Review technical architectures, ER diagrams, and package deliverables.
            </p>
          </div>

          {/* Step 2 */}
          <div className="pk-card-tilt bg-white dark:bg-[#0F1830] p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-[#25335F] hover:border-[#6C5CE7] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] text-[#6C5CE7] dark:text-[#8C7CFF] flex items-center justify-center font-bold text-sm font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">2. Complete Verified Checkout</h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Pay securely via Razorpay gateway using UPI, Cards, or Net Banking. Every order is verified with server-side HMAC signatures for payment protection.
            </p>
          </div>

          {/* Step 3 */}
          <div className="pk-card-tilt bg-white dark:bg-[#0F1830] p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-[#25335F] hover:border-[#2F4BFF] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] text-[#2F4BFF] dark:text-[#5B7BFF] flex items-center justify-center font-bold text-sm font-mono">
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
        <div className="bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2F4BFF] dark:text-[#5B7BFF]">
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
            <div className="bg-slate-50 dark:bg-[#16224A]/60 p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] text-[#2F4BFF] dark:text-[#5B7BFF] flex items-center justify-center shadow-xs">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Verified Runnable Code</h3>
              <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
                Pre-configured Maven / Gradle / npm workspaces with Dockerfiles and setup guides to ensure you run the project in minutes without dependency conflicts.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#16224A]/60 p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] text-[#6C5CE7] dark:text-[#8C7CFF] flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">IEEE Standard Reports</h3>
              <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
                Includes full 80+ page standard IEEE format documentation, complete with UML diagrams, system architecture blueprints, and entity relationships.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#16224A]/60 p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] text-[#2F4BFF] dark:text-[#5B7BFF] flex items-center justify-center shadow-xs">
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
          6. TESTIMONIALS SECTION (Student Success Proof)
          ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2F4BFF] dark:text-[#5B7BFF]">
            Student Success Stories
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
            Trusted by Final-Year Engineers Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7]">
            Real feedback from engineering students who successfully defended their capstone projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="pk-card-tilt bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs">
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed italic">
              "The Spring Boot & React kit saved our team during the final internal review. The IEEE report was accepted on the first submission without major formatting revisions."
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-[#25335F] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2F4BFF] text-white flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#E8ECFA]">Rahul Sharma</h4>
                <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">B.Tech CSE, VIT Vellore</p>
              </div>
            </div>
          </div>

          <div className="pk-card-tilt bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs">
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed italic">
              "The viva voce cheat sheet was a game changer. The external examiner asked specifically about JWT replay prevention and database indexes, exactly as explained in the guide."
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-[#25335F] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center font-bold text-xs">
                SP
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#E8ECFA]">Sneha Patel</h4>
                <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">B.Tech IT, BITS Pilani</p>
              </div>
            </div>
          </div>

          <div className="pk-card-tilt bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs">
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed italic">
              "Clean source code with zero deprecated libraries. Running Docker Compose set up the backend and MySQL container in under 3 minutes on our lab machine."
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-[#25335F] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2F4BFF] text-white flex items-center justify-center font-bold text-xs">
                KR
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#E8ECFA]">Karthik Raja</h4>
                <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">B.Tech ECE, NIT Trichy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="pk-divider" />

      {/* =========================================================================
          7. FAQ SECTION
          ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2F4BFF] dark:text-[#5B7BFF]">
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
          <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              Are these project kits fully runnable and tested?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Yes. Each kit is tested across clean environments with modern JDK versions (Java 17 / Python 3.10+) and includes step-by-step installation instructions, database schemas, and sample test accounts.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              What files do I receive immediately after payment?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              You receive instant access to download the full source code archive (.zip), the 80+ page standard IEEE documentation in both editable Word (.docx) and PDF formats, MySQL database dumps, and the viva voce cheat sheet.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              Can I customize the code and add my own features?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              Absolutely. All projects are provided as clean starter kits and reference implementations. You are encouraged to modify the UI, add custom algorithms, and tailor the logic to match your specific college project objectives.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200 dark:border-[#25335F] space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">
              What payment methods are supported?
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed">
              We support UPI (Google Pay, PhonePe, Paytm), all major Debit/Credit cards, and Indian Net Banking through our Razorpay integration with 256-bit encryption.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CALL TO ACTION SECTION (Dark Navy Deep Card)
          ========================================================================= */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0B1B3F] to-[#070D1F] border border-[#25335F] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2F4BFF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B7BFF]">
              Get Started Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Complete Your Final Year Project?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 24+ engineering capstone kits with verified source code and standard IEEE documentation.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/projects"
              className="px-7 py-3.5 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white text-xs font-semibold rounded-[9px] shadow-lg shadow-[#2F4BFF]/30 transition-transform hover:scale-[1.04] active:scale-[0.97]"
            >
              Browse Complete Catalog
            </Link>
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-[9px] transition-transform hover:scale-[1.04] active:scale-[0.97]"
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

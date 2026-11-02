import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { ProjectCard } from '../components/ProjectCard';
import { CategoryCard } from '../components/CategoryCard';
import { SearchBar } from '../components/SearchBar';
import { ProjectIllustration } from '../components/ProjectIllustration';
import {
  Code2,
  FileCheck2,
  HelpCircle,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Star,
  ExternalLink,
  BookOpen,
  Award,
  ChevronRight,
  Laptop,
  FolderArchive,
  Search,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { projects, categories } = useProjects();

  // Active filter for featured showcase
  const [featuredDomain, setFeaturedDomain] = useState<string>('All');
  // Interactive inspector preview tab on hero
  const [inspectorTab, setInspectorTab] = useState<'code' | 'docs' | 'viva'>('code');

  const sampleHeroProject = projects.find((p) => p.id === 'proj-003') || projects[0];

  // Auto-scroll to #popular-categories if navigated with hash
  React.useEffect(() => {
    if (window.location.hash === '#popular-categories') {
      setTimeout(() => {
        const el = document.getElementById('popular-categories');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleHeroSearch = (query: string, category?: string) => {
    let url = `/projects?search=${encodeURIComponent(query)}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    navigate(url);
  };

  // Featured projects filtered by domain tab
  const filteredFeatured = projects
    .filter((p) => {
      if (featuredDomain === 'All') return p.featured;
      return p.category.toLowerCase().includes(featuredDomain.toLowerCase());
    })
    .slice(0, 3);

  const recentProjects = [...projects].reverse().slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Subtle engineering blueprint grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading, Subtitle & Commercial Search Bar */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 rounded-full shadow-xs">
                <span className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold ml-0.5">4.9/5</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span>12,000+ B.Tech Students Guided</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] text-balance">
                Build Your Future With The{' '}
                <span className="text-blue-600 dark:text-blue-400">Right Project.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Explore ready-to-use engineering projects with source code, documentation and implementation guides.
              </p>

              {/* Professional Search Bar */}
              <div className="pt-2 max-w-2xl space-y-3">
                <SearchBar
                  size="large"
                  onSearch={handleHeroSearch}
                  placeholder="Search Spring Boot, MERN, Python AI, Java MySQL..."
                />

                {/* Popular Keywords Strip */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Popular searches:</span>
                  <button
                    onClick={() => handleHeroSearch('Spring Boot')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                  >
                    Spring Boot
                  </button>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => handleHeroSearch('MERN')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                  >
                    MERN Stack
                  </button>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => handleHeroSearch('Machine Learning')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                  >
                    Machine Learning
                  </button>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => handleHeroSearch('Java')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                  >
                    Java
                  </button>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => handleHeroSearch('IoT')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                  >
                    IoT
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/projects"
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#popular-categories"
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
                >
                  Browse Categories
                </a>
              </div>

              {/* Guarantees Row */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Java 17 & Node 20 runtimes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>IEEE 830 standard documentation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>60+ Viva Voce examiner Q&A</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Project Kit Inspector */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 text-white overflow-hidden">
                {/* Inspector Header with Tab Toggles */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
                      kit_inspector.sh
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg text-[11px] font-mono">
                    <button
                      onClick={() => setInspectorTab('code')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        inspectorTab === 'code'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Code
                    </button>
                    <button
                      onClick={() => setInspectorTab('docs')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        inspectorTab === 'docs'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Report
                    </button>
                    <button
                      onClick={() => setInspectorTab('viva')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        inspectorTab === 'viva'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Viva
                    </button>
                  </div>
                </div>

                {/* Inspector Dynamic Viewport */}
                <div className="p-5 space-y-4">
                  {/* TAB 1: CODEBASE INSPECTION */}
                  {inspectorTab === 'code' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">Project: {sampleHeroProject.title}</span>
                        <span className="text-emerald-400 font-semibold font-mono text-[11px]">
                          ✓ Build Passing
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-hidden">
                        <div className="text-slate-500 text-[10px]"># Repository Directory Structure</div>
                        <div className="text-blue-400">├── /src/main/java/com/projectkit/</div>
                        <div className="text-slate-400 pl-4">├── controller/ (38 REST Endpoints)</div>
                        <div className="text-slate-400 pl-4">├── service/ (Transactional Logic)</div>
                        <div className="text-slate-400 pl-4">└── repository/ (Spring Data JPA)</div>
                        <div className="text-emerald-400">├── /database/schema_mysql_3nf.sql</div>
                        <div className="text-amber-400">├── /docs/IEEE_Report_88_Pages.docx</div>
                        <div className="text-purple-400">└── /viva/Examiner_Questions_60.pdf</div>
                      </div>

                      <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="text-blue-300 truncate">$ mvn clean install && mvn spring-boot:run</span>
                        <span className="text-emerald-400 font-semibold shrink-0 text-[10px]">Port 8080</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: IEEE REPORT INSPECTION */}
                  {inspectorTab === 'docs' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">IEEE 830 Specification Report</span>
                        <span className="text-blue-400 font-semibold text-[11px]">88 Pages · Word & PDF</span>
                      </div>

                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="text-slate-400 font-medium">Chapter Index & Deliverables:</div>
                        <ul className="space-y-1.5 text-slate-300 text-[11px]">
                          <li className="flex items-center gap-2">
                            <span className="text-blue-400 font-mono">01.</span>
                            <span>Literature Survey & Comparative Analysis (18 Citations)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-400 font-mono">02.</span>
                            <span>Software Requirements Specification (SRS IEEE 830)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-400 font-mono">03.</span>
                            <span>UML Architecture: Class, Sequence & DFD Diagrams</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-400 font-mono">04.</span>
                            <span>Software Testing Matrices (Unit, Integration, Blackbox)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: VIVA VOCE DEFENSE */}
                  {inspectorTab === 'viva' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">External Viva Voce Cheat Sheet</span>
                        <span className="text-purple-400 font-semibold text-[11px]">60+ Examiner Q&A</span>
                      </div>

                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="font-semibold text-amber-300 text-[11px]">
                          Q: How do you handle concurrency & race conditions in this project?
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          "We implement pessimistic locking in Spring Data JPA alongside @Transactional isolation levels to prevent phantom reads during state changes."
                        </p>
                        <div className="text-slate-500 text-[10px] pt-1">
                          ✓ Includes model answers for Java, Spring Boot, React, and MySQL.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing and Direct Link to Featured Kit */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Featured Capstone Kit</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-white font-mono">
                          ₹{sampleHeroProject.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ₹{sampleHeroProject.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/projects/${sampleHeroProject.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Inspect Kit Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MODERN STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {/* Stat 1 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Verified Repositories
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                500+
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Full-stack engineering kits across Java, Python, and Web stacks.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Students Guided
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                12,000+
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Graduates across VIT, SRM, PES, Anna University, and NITs.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Viva Clearance
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                98.4%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                First-attempt pass rate in final external evaluation seminars.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Specializations
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                45+
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Academic disciplines including CSE, IT, ECE, AI & Data Science.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section id="popular-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Academic Disciplines
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Engineering Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select your academic branch and preferred technology stack.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
          >
            <span>View all collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROJECTS WITH DOMAIN SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Hand-Curated Blueprints
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Final-Year Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Top reviewed kits selected for comprehensive documentation, clean architecture, and viva readiness.
            </p>
          </div>

          {/* Interactive domain pill tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto shrink-0">
            <button
              onClick={() => setFeaturedDomain('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                featuredDomain === 'All'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Kits
            </button>
            <button
              onClick={() => setFeaturedDomain('Java')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                featuredDomain === 'Java'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Java & Spring Boot
            </button>
            <button
              onClick={() => setFeaturedDomain('Web')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                featuredDomain === 'Web'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MERN Stack
            </button>
            <button
              onClick={() => setFeaturedDomain('AI')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                featuredDomain === 'AI'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              AI & Machine Learning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredFeatured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 5. PROFESSIONAL HOW IT WORKS SECTION */}
      <section className="bg-white dark:bg-slate-950 py-16 sm:py-20 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Step-by-Step Pathway
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How ProjectKit Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Four structured milestones from capstone selection to a high-scoring university viva defense.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Browse Verified Blueprints
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter by department, programming language (Java, Python, MERN), and budget. Inspect detailed modules, problem statements, and requirements before ordering.
              </p>
              <div className="pt-2 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                <span>Filter by university syllabus</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Instant Kit Delivery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Download the complete codebase archive, normalized MySQL database script, IEEE format 80+ page report in Word & PDF, and seminar PowerPoint deck.
              </p>
              <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span>Direct ZIP archive unlock</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                10-Minute Local Setup
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Follow copy-paste execution commands in IntelliJ, Eclipse, VS Code, or terminal. Pre-tested dependencies eliminate version mismatches.
              </p>
              <div className="pt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                <span>Tested on Windows, Mac, Linux</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ace Your Final Viva
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Master external examiner scrutiny with our 60+ question viva cheat sheet covering system architecture, ER models, and concurrency.
              </p>
              <div className="pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <span>Guaranteed viva confidence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY ADDED PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              New 2025–2026 Releases
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recently Added Engineering Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Freshly architected capstone kits covering IoT telemetry, Spring Boot microservices, and smart contracts.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 shrink-0"
          >
            <span>View all recent kits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE PROJECTKIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-900/90 rounded-3xl p-8 sm:p-12 text-white border border-transparent dark:border-slate-800">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              Institutional Quality Standards
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why 12,000+ Engineering Students Rely on ProjectKit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every project kit is built by senior software engineers and reviewed against university academic syllabi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">100% Tested Source Code</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero broken imports or outdated packages. Maven, npm, and pip dependencies are locked and tested on Java 17, Node 18, and Python 3.10.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">IEEE Standard Documentation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Includes literature surveys, SRS according to IEEE 830, software design documents (SDD), and testing matrices ready for university submission.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Viva Voce Q&A Cheat Sheet</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Curated compilation of 60+ tricky viva questions asked by external university examiners, complete with concise model answers.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Normalized Database Dumps</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete MySQL / PostgreSQL SQL scripts with 3NF normalization, foreign key constraints, and 50+ rows of realistic dummy data.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">High-Res UML Diagrams</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Editable StarUML and high-resolution PNG exports of Class diagrams, Sequence diagrams, Use Case diagrams, and Entity-Relationship models.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Turnkey Setup Commands</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear copy-paste instructions for IntelliJ, Eclipse, VS Code, and terminal runtimes so your project runs smoothly in under 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Attributable) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Verified Student Outcomes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Final Year B.Tech Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Read authentic reviews from students who defended their capstones with top grades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
              "The Smart Traffic Management Java project was praised by our external examiner. The multi-threading simulation and 85-page IEEE report saved our team weeks of formatting stress. We scored an O Grade (Outstanding)!"
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                KV
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Karthik Venkat</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">B.Tech CSE, SRM Institute of Science</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
              "I purchased the Spring Boot Student Management kit. What stood out was the 60 viva questions guide. The external examiner asked three questions directly from that cheat sheet regarding JPA entity lifecycle."
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                SP
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Sneha Patel</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">B.Tech IT, Vellore Institute of Technology</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
              "The Face Recognition Attendance System in Python ran right out of the box after following the 4-step terminal instructions. The anti-spoofing blink detector made our project review seminar the best in our department."
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                AN
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Aditya Nambiar</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">B.Tech CSE, PES University Bengaluru</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CONVERSION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Ace Your Final Year Project Review?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Browse through our library of verified engineering kits and get complete code, documentation, and viva guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/projects"
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-blue-600 bg-white hover:bg-slate-50 rounded-xl shadow-sm transition-all"
            >
              Browse All Projects
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all border border-blue-500/80"
            >
              Create Student Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

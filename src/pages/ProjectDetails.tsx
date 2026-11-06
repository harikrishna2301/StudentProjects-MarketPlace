import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import { ProjectIllustration } from '../components/ProjectIllustration';
import { ProjectCard } from '../components/ProjectCard';
import {
  Star,
  Download,
  CheckCircle2,
  FileText,
  Terminal,
  Cpu,
  Layers,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Maximize2,
  X,
  Database,
  GitBranch,
  Laptop,
  FolderArchive,
  Code2,
  ExternalLink,
  Server,
  Key,
  Heart,
  Play,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { WatchDemoModal } from '../components/WatchDemoModal';
import { SEOHead } from '../components/SEOHead';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, projects } = useProjects();
  const { purchasedProjectIds, downloadProjectKit } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'screenshots' | 'modules' | 'docs' | 'setup'>('overview');
  // Selected screenshot in hero gallery (0 = main cover, 1 = UI, 2 = ERD, 3 = DFD, 4 = Viva)
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [fullscreenModal, setFullscreenModal] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);

  // Dynamically load project using the URL project ID
  const project = id ? getProjectById(id) : undefined;

  // Scroll to top whenever project ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePreviewIndex(0);
  }, [id]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Project Kit Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          The requested engineering project ID "{id}" could not be located in our catalog.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span>Return to Projects Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isPurchased = purchasedProjectIds.includes(project.id);
  const isWishlisted = isInWishlist(project.id);

  // Related projects in the same category or sharing primary language
  const relatedProjects = projects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.primaryLanguage === project.primaryLanguage))
    .slice(0, 3);

  const handleCopyCommand = (command: string, stepIndex: number) => {
    navigator.clipboard.writeText(command);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  // Structured screenshots & diagram previews for academic verification
  const previewGalleries = [
    {
      id: 0,
      title: 'Repository Architecture & Runtime Build',
      tag: 'Verified Build',
      caption: `${project.primaryLanguage} Runtime · Maven / NPM / Pip Dependencies Locked`,
    },
    {
      id: 1,
      title: 'Full Application Dashboard & Client UI',
      tag: 'Application UI',
      caption: 'Responsive user and administration portals with reactive state management',
    },
    {
      id: 2,
      title: '3NF Normalized Relational Database Schema',
      tag: 'ER Diagram',
      caption: 'Normalized tables, foreign key constraints, indexes, and sample seeds',
    },
    {
      id: 3,
      title: 'Multi-Tier System Flow & Sequence Diagram',
      tag: 'System DFD',
      caption: 'Client Presentation -> REST API Controller -> Service Layer -> Database Repository',
    },
    {
      id: 4,
      title: 'External Examiner Viva Voce Defense Sheet',
      tag: 'Viva Voce Q&A',
      caption: 'Top 60 examiner questions with concise theoretical and architectural model answers',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEOHead
        title={`${project.title} — Academic Project Kit & IEEE Docs`}
        description={project.shortDescription || project.overview.slice(0, 155)}
        canonicalPath={`/projects/${project.id}`}
        ogType="product"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": project.title,
          "description": project.shortDescription || project.overview,
          "category": project.category,
          "offers": {
            "@type": "Offer",
            "price": String(project.price),
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": `https://projectkit.in/projects/${project.id}`
          }
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <Link to="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <Link
          to={`/projects?category=${encodeURIComponent(project.category)}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 font-medium truncate"
        >
          {project.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px] sm:max-w-none">
          {project.title}
        </span>
      </nav>

      {/* Hero Split Header & Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Interactive Screenshot & Architecture Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 p-2 sm:p-4 relative group">
            {/* Main Interactive Screen Showcase */}
            {activePreviewIndex === 0 && (
              <ProjectIllustration
                category={project.category}
                primaryLanguage={project.primaryLanguage}
                techStack={project.techStack}
                title={project.title}
                aspect="16:9"
              />
            )}

            {/* Screen 1: Application UI Mockup */}
            {activePreviewIndex === 1 && (
              <div className="aspect-[16/9] bg-slate-950 rounded-xl p-5 border border-slate-800 flex flex-col justify-between text-white font-mono select-none">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-400" />
                    <span>Application Workspace · {project.title}</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">200 OK Live</span>
                </div>

                <div className="my-auto py-2 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Active Records</div>
                      <div className="text-blue-400 font-bold text-sm">1,420</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">API Latency</div>
                      <div className="text-emerald-400 font-bold text-sm">18 ms</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Security Tier</div>
                      <div className="text-purple-400 font-bold text-sm">JWT Auth</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-300 truncate">
                    ✓ Clean decoupled client architecture (React 18 / REST / JPA)
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>Front-end responsive viewport</span>
                  <span className="text-slate-400">Anna / VTU / JNTU Standard</span>
                </div>
              </div>
            )}

            {/* Screen 2: Database Schema & ER Diagram */}
            {activePreviewIndex === 2 && (
              <div className="aspect-[16/9] bg-slate-950 rounded-xl p-5 border border-slate-800 flex flex-col justify-between text-white font-mono select-none">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Entity-Relationship Model (3NF Normalized)</span>
                  </div>
                  <span className="text-amber-400 font-bold text-[11px]">MySQL 8.0</span>
                </div>

                <div className="my-auto py-2 space-y-2 text-[10px]">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-amber-400 font-bold">TABLE: core_entity (PK: id BIGINT AUTO_INCREMENT)</div>
                    <div className="text-slate-400 pl-2">├── title VARCHAR(255) NOT NULL</div>
                    <div className="text-slate-400 pl-2">├── category_id INT NOT NULL (FK &rarr; categories.id)</div>
                    <div className="text-slate-400 pl-2">└── created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                  </div>
                  <div className="text-slate-500 text-[9px]">
                    ✓ Includes full .sql seed script pre-populated with realistic university data.
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>Normalized relational database</span>
                  <span className="text-slate-400">Foreign Key Integrity Verified</span>
                </div>
              </div>
            )}

            {/* Screen 3: System Flow & DFD Diagram */}
            {activePreviewIndex === 3 && (
              <div className="aspect-[16/9] bg-slate-950 rounded-xl p-5 border border-slate-800 flex flex-col justify-between text-white font-mono select-none">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-400" />
                    <span>Multi-Tier Architecture & Data Flow (DFD Level 1)</span>
                  </div>
                  <span className="text-blue-400 font-bold text-[11px]">IEEE SDD</span>
                </div>

                <div className="my-auto py-2 space-y-2 text-center text-[11px]">
                  <div className="p-2 bg-blue-950/60 border border-blue-800 text-blue-300 rounded-lg font-semibold">
                    Client Presentation Tier (React 18 / JavaFX GUI)
                  </div>
                  <div className="text-slate-500 text-xs">↓ REST API Controller (JWT Authentication) ↓</div>
                  <div className="p-2 bg-amber-950/60 border border-amber-800 text-amber-300 rounded-lg font-semibold">
                    Service Business Logic Layer (@Transactional)
                  </div>
                  <div className="text-slate-500 text-xs">↓ Spring Data JPA / JDBC Connection Pool ↓</div>
                  <div className="p-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg font-semibold">
                    Relational Storage (MySQL 8 / PostgreSQL)
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>High-resolution StarUML exports</span>
                  <span className="text-slate-400">Class & Sequence Included</span>
                </div>
              </div>
            )}

            {/* Screen 4: Examiner Viva Voce Card */}
            {activePreviewIndex === 4 && (
              <div className="aspect-[16/9] bg-slate-950 rounded-xl p-5 border border-slate-800 flex flex-col justify-between text-white select-none">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>External Examiner Viva Voce Cheat Sheet</span>
                  </div>
                  <span className="text-purple-400 font-bold text-[11px]">60+ Q&A Bank</span>
                </div>

                <div className="my-auto py-2 space-y-2.5">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                    <div className="font-bold text-amber-300">
                      Examiner Q: How do you prevent SQL injection and ensure transaction ACID compliance?
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      "We enforce parameterized queries via PreparedStatement / Hibernate ORM to isolate SQL grammar from input data, backed by Spring @Transactional boundaries running under READ_COMMITTED isolation."
                    </p>
                  </div>
                  <div className="text-slate-500 text-[10px] font-mono">
                    ✓ Includes model answers covering theoretical, architectural, and edge-case questions.
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>Guaranteed viva confidence</span>
                  <span className="text-slate-400">98.4% Defense Pass Rate</span>
                </div>
              </div>
            )}

            {/* Watch AI Demo Walkthrough Floating Button */}
            <button
              onClick={() => setDemoModalOpen(true)}
              className="absolute bottom-4 left-4 sm:left-6 bg-slate-900/90 hover:bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xl backdrop-blur-md border border-slate-700 hover:border-blue-500 z-20 group/play hover:scale-105"
              title="Watch AI Video Walkthrough"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 group-hover/play:bg-white text-white group-hover/play:text-blue-600 flex items-center justify-center shadow-xs transition-colors">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>Watch Demo</span>
              <span className="text-[10px] bg-slate-800 group-hover/play:bg-blue-700 text-blue-300 group-hover/play:text-white px-1.5 py-0.5 rounded font-mono hidden sm:inline transition-colors">
                AI 1080p
              </span>
            </button>

            {/* Expand Fullscreen Floating Button */}
            <button
              onClick={() => setFullscreenModal(true)}
              className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-md backdrop-blur-xs"
              title="Inspect Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inspect</span>
            </button>
          </div>

          {/* Interactive Screenshot Thumbnails Switcher */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            {previewGalleries.map((item, idx) => {
              const isSelected = activePreviewIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-100 dark:bg-blue-950/40 dark:border-blue-500 dark:ring-blue-900/50 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-900 dark:text-slate-100 truncate">{item.tag}</div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">View 0{idx + 1}</div>
                </button>
              );
            })}
          </div>

          {/* Quick trust metrics below visual */}
          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Standard</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">IEEE 830 SRS</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Downloads</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                {project.downloadsCount}+ kits
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Academic Year</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{project.academicYear}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0B1329] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#1A2846] shadow-sm dark:shadow-xl space-y-6 text-slate-900 dark:text-[#F8FAFC] transition-colors">
          <div>
            {/* Metadata tags */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9AA6C7] mb-2">
              <span className="font-semibold text-[#2F4BFF] dark:text-[#5B7BFF]">{project.category}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
              <span className="text-slate-700 dark:text-[#CBD5E1] font-medium">{project.primaryLanguage}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
              <span className="font-mono text-slate-400 dark:text-[#9AA6C7]">ID: {project.id}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] leading-snug">
                {project.title}
              </h1>
              <button
                onClick={() => toggleWishlist(project.id, project.title)}
                className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                  isWishlisted
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#080E20] text-slate-500 dark:text-[#94A3B8] border-slate-200 dark:border-[#1A2846] hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Ratings & reviews count */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold font-mono ml-1 text-slate-900 dark:text-[#F8FAFC]">{project.rating}</span>
              </div>
              <span className="text-slate-300 dark:text-[#1A2846]">·</span>
              <span className="text-slate-600 dark:text-[#94A3B8] font-medium">
                {project.reviewsCount} verified student reviews
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Categorized Technology Badges */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Verified Technical Stack & Libraries
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium text-slate-700 dark:text-[#BFDBFE] bg-slate-100 dark:bg-[#080E20] rounded-lg border border-slate-200 dark:border-[#1A2846] flex items-center gap-1"
                >
                  <Code2 className="w-3 h-3 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-slate-50 dark:bg-[#080E20] rounded-xl border border-slate-200 dark:border-[#1A2846] flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-medium">Complete Academic Kit Price</div>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono tabular-nums">
                  ₹{project.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 dark:text-[#64748B] line-through font-mono tabular-nums">
                  ₹{project.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100)}% OFF
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-md">
                Instant Access
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2 pt-1">
            {isPurchased ? (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>You own this project kit. Downloads unlocked!</span>
                </div>
                <button
                  onClick={() => downloadProjectKit(project, 'Complete Kit')}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete Project Package (ZIP)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(`/checkout/${project.id}`)}
                className="w-full py-3.5 px-6 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-[0_4px_16px_rgba(47,75,255,0.35)]"
              >
                <span>Buy Project Kit Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Wishlist Action Button */}
            <button
              onClick={() => toggleWishlist(project.id, project.title)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                isWishlisted
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>{isWishlisted ? 'Saved in Your Wishlist' : 'Save Project to Wishlist'}</span>
            </button>

            {/* Watch AI Video Walkthrough CTA Button */}
            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-blue-50 dark:bg-[#16224A] hover:bg-blue-100 dark:hover:bg-[#1E2E5D] text-[#2F4BFF] dark:text-[#5B7BFF] border border-blue-200 dark:border-[#25335F] shadow-xs"
            >
              <div className="w-4 h-4 rounded-full bg-[#2F4BFF] text-white flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
              </div>
              <span>Watch AI Video Walkthrough</span>
              <span className="text-[10px] bg-[#2F4BFF] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                1080p
              </span>
            </button>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
              Demonstration checkout interface with simulated download authorization.
            </p>
          </div>

          {/* Included Kit Summary List */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">What's Included in this Kit:</div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Full clean source code with developer comments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>80+ page IEEE format report (DOCX + PDF)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>MySQL / Postgres database seed dump (.sql)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>60+ viva voce examiner question bank</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>PowerPoint presentation slides for final seminar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Detail Content Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Tab Header Controls */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Overview & Objectives
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'screenshots'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Screenshots & Architecture ({previewGalleries.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'modules'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Features & Modules ({project.modules.length})
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'docs'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Documentation Included
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'setup'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Installation Guide & Requirements
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-10">
          {/* TAB 1: OVERVIEW & OBJECTIVES */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Project Overview</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{project.overview}</p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Problem Statement</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Core Engineering Objectives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.objectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs"
                    >
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Badges Matrix */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Architectural Technology Stack</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.techStack.map((tech) => (
                    <div
                      key={tech}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <Code2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{tech}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">Verified Component</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCREENSHOTS & ARCHITECTURAL PREVIEWS */}
          {activeTab === 'screenshots' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Project Screenshots & Visual Deliverables
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Interactive diagrams, user interface walkthroughs, and viva guides included in this kit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {previewGalleries.map((s) => (
                  <div
                    key={s.id}
                    className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="p-5 aspect-[16/10] bg-slate-950 flex flex-col justify-between border-b border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono text-[10px] bg-slate-800 px-2.5 py-0.5 rounded text-slate-300">
                          {s.tag}
                        </span>
                        <button
                          onClick={() => {
                            setActivePreviewIndex(s.id);
                            setFullscreenModal(true);
                          }}
                          className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>

                      <div className="my-auto py-2 font-mono text-[11px] text-slate-300">
                        <div className="text-blue-400 font-semibold mb-1">{s.title}</div>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{s.caption}</p>
                      </div>

                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        Deliverable 0{s.id + 1} · IEEE Standard Capstone Artifact
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate pr-2">{s.title}</span>
                      <button
                        onClick={() => setActivePreviewIndex(s.id)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 shrink-0"
                      >
                        Preview in Hero &uarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & MODULES */}
          {activeTab === 'modules' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Key Functional Features</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Detailed functional breakdown ready to present in internal college reviews.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Feature 0{idx + 1}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Architectural Modules</h3>
                <div className="space-y-2">
                  {project.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 dark:text-slate-500">MODULE-{idx + 1}</span>
                        <span>{mod}</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        Fully Implemented
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTATION INCLUDED */}
          {activeTab === 'docs' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Complete Documentation Package
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Conforms with IEEE, UGC, and Anna University / VTU / JNTU capstone submission rules.
                </p>
              </div>

              <div className="space-y-3">
                {project.documentationIncluded.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{doc.item}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{doc.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {doc.format}
                      </span>
                      {isPurchased && (
                        <button
                          onClick={() => downloadProjectKit(project, doc.item)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INSTALLATION & REQUIREMENTS */}
          {activeTab === 'setup' && (
            <div className="space-y-8 max-w-4xl">
              {/* System Requirements Grid */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Hardware</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {project.requirements.hardware.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Software Environment</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {project.requirements.software.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Key Libraries</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
                      {project.requirements.dependencies.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step by step installation commands */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Step-by-Step Installation Commands
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Terminal execution steps to run this project kit locally on your development machine.
                </p>

                <div className="space-y-4">
                  {project.installationSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-[11px] font-bold flex items-center justify-center">
                            {step.step}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{step.title}</span>
                        </div>
                        {step.codeCommand && (
                          <button
                            onClick={() => handleCopyCommand(step.codeCommand!, step.step)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                          >
                            {copiedStep === step.step ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {step.codeCommand && (
                        <div className="p-2.5 bg-slate-950 rounded-xl font-mono text-xs text-blue-400 border border-slate-800/80 overflow-x-auto">
                          $ {step.codeCommand}
                        </div>
                      )}

                      <p className="text-xs text-slate-400">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                Complementary Capstones
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Related Projects in {project.category}
              </h3>
            </div>
            <Link
              to={`/projects?category=${encodeURIComponent(project.category)}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all in domain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Inspection Modal */}
      {fullscreenModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFullscreenModal(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-800 p-6 space-y-4 text-white relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs font-semibold text-blue-400 uppercase">
                  {previewGalleries[activePreviewIndex]?.tag}
                </div>
                <h3 className="text-base font-bold text-white">
                  {previewGalleries[activePreviewIndex]?.title}
                </h3>
              </div>
              <button
                onClick={() => setFullscreenModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed space-y-3">
              <p>{previewGalleries[activePreviewIndex]?.caption}</p>
              <div className="text-emerald-400 pt-2 border-t border-slate-800">
                ✓ Included in this project kit as editable vector source files (.xml / .staruml / .sql / .docx).
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setFullscreenModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Buy Bar (appears on small screens, complies with 15% viewport height cap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#080D1A]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#1A2846] px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-medium">Complete Kit</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono tabular-nums">
              ₹{project.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 line-through font-mono tabular-nums">
              ₹{project.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(project.id, project.title)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1A2846] bg-slate-50 dark:bg-[#0B1329] text-slate-600 dark:text-slate-300"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {isPurchased ? (
            <button
              onClick={() => downloadProjectKit(project, 'Complete Kit')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/checkout/${project.id}`)}
              className="px-5 py-2.5 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>Buy Kit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Video Walkthrough Watch Demo Modal */}
      <WatchDemoModal
        project={project}
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
};

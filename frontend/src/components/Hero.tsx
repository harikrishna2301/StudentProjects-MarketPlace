import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../images/hero.png';
import { ArrowRight, Search, X } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { filterAdminProjects } from '../utils/adminProjectFilters';

interface HeroProps {
  onHowItWorksClick?: (e: React.MouseEvent) => void;
}

export const Hero: React.FC<HeroProps> = ({ onHowItWorksClick }) => {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const [heroSearch, setHeroSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const quickMatches = useMemo(() => {
    const trimmed = heroSearch.trim();
    if (!trimmed) return [];
    return filterAdminProjects(projects, trimmed, 'All').slice(0, 5);
  }, [projects, heroSearch]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = heroSearch.trim();
    setDropdownOpen(false);
    if (trimmed) {
      navigate(`/projects?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/projects');
    }
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    if (onHowItWorksClick) {
      onHowItWorksClick(e);
      return;
    }
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const popularCategories = [
    { name: 'Web Apps', query: 'Web Development' },
    { name: 'Java', query: 'Java & Spring Boot' },
    { name: 'Python', query: 'Python Full Stack' },
    { name: 'AI/ML', query: 'AI & Machine Learning' },
    { name: 'IoT', query: 'IoT & Embedded' },
  ];

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B0720] to-[#25134D] scroll-mt-24"
    >
      {/* Full-viewport Hero Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <img
          src={heroImg}
          alt=""
          width={1376}
          height={768}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[70%_center] md:object-center animate-hero-zoom"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Gradient overlays for legibility */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(11,7,32,0.60) 0%, rgba(11,7,32,0.22) 45%, rgba(11,7,32,0.65) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to right, rgba(11,7,32,0.65) 0%, rgba(11,7,32,0.40) 42%, rgba(11,7,32,0.20) 68%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle at 35% 20%, rgba(106,47,200,0.22) 0%, transparent 65%)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[11vh] sm:pt-[14vh] pb-8 flex-1 flex flex-col justify-start">
        <div className="max-w-[580px] text-center lg:text-left mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
          {/* Eyebrow Frosted Pill */}
          <div className="animate-hero-eyebrow mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.12)] border border-[rgba(209,184,255,0.4)] backdrop-blur-[8px] text-[11px] sm:text-xs font-semibold text-[#FFFFFF] tracking-wide shadow-xs">
              Ready-to-submit final year projects
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-heading font-bold text-[clamp(2.1rem,4.8vw,3.25rem)] leading-[1.12] tracking-[-0.025em] text-[#FFFFFF] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] mb-4"
            style={{ textWrap: 'balance' }}
          >
            <span className="animate-word-1 inline-block text-[#FFFFFF] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] mr-2.5">Build.</span>
            <span className="animate-word-2 inline-block text-[#FFFFFF] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] mr-2.5">Submit.</span>
            <span className="animate-word-3 inline-block text-[#D1B8FF] animate-shimmer-succeed [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">Succeed.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-hero-subtext text-sm sm:text-base text-[rgba(255,255,255,0.88)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] leading-relaxed mb-6 max-w-[490px]">
            Verified B.Tech project kits with source code, report and documentation, at student-friendly prices.
          </p>

          {/* Direct Homepage Project Search Bar with Instant Suggestions */}
          <div ref={searchContainerRef} className="w-full max-w-[540px] mb-6 relative z-20 animate-hero-buttons">
            <form
              onSubmit={handleHeroSearchSubmit}
              className="flex items-center bg-[#0B0720]/75 border border-[#D1B8FF]/35 focus-within:border-[#9D71E8] focus-within:shadow-[0_0_24px_rgba(106,47,200,0.45)] backdrop-blur-md rounded-2xl p-1.5 transition-all"
            >
              <div className="relative flex-1 flex items-center min-w-0">
                <Search className="w-4 h-4 text-[#D1B8FF] ml-3 shrink-0 pointer-events-none" />
                <input
                  id="home-hero-project-search"
                  type="text"
                  aria-label="Search projects from home page"
                  value={heroSearch}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(e) => {
                    setHeroSearch(e.target.value);
                    setDropdownOpen(true);
                  }}
                  placeholder="Search projects (e.g. Spring Boot, AI, IoT, React)..."
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none"
                />
                {heroSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearch('');
                      setDropdownOpen(false);
                    }}
                    aria-label="Clear search"
                    className="p-1 mr-1 text-white/60 hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {dropdownOpen && heroSearch.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#140A2E]/95 backdrop-blur-xl border border-[#3A2074] shadow-2xl overflow-hidden text-left z-30">
                {quickMatches.length > 0 ? (
                  <div className="divide-y divide-[#3A2074]/60">
                    {quickMatches.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate(`/projects/${project.id}`);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#25134D]/80 transition-colors text-left cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-[#C5B4E3] truncate mt-0.5">
                            {project.category} · {project.primaryLanguage}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#D1B8FF] shrink-0">
                          {project.isFree || project.price === 0
                            ? 'FREE'
                            : `₹${project.price.toLocaleString('en-IN')}`}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleHeroSearchSubmit}
                      className="w-full px-4 py-2.5 bg-[#25134D]/70 hover:bg-[#6A2FC8]/40 text-xs font-bold text-[#D1B8FF] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>View all results for &ldquo;{heroSearch.trim()}&rdquo;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-4 text-xs text-[#C5B4E3] flex items-center justify-between gap-3">
                    <span>No instant kit match for &ldquo;{heroSearch.trim()}&rdquo;.</span>
                    <button
                      type="button"
                      onClick={handleHeroSearchSubmit}
                      className="text-[#D1B8FF] font-semibold hover:underline shrink-0 cursor-pointer"
                    >
                      Search Full Catalog →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="animate-hero-buttons flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
            <Link
              to="/projects"
              className="w-full sm:w-auto px-6 py-3 bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white text-xs font-semibold rounded-[9px] border border-[rgba(255,255,255,0.25)] shadow-lg shadow-[#6A2FC8]/35 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D71E8] focus-visible:ring-offset-2 min-h-[44px]"
            >
              <span>Browse Projects</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3 bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.22)] border border-[rgba(255,255,255,0.4)] backdrop-blur-md text-[#FFFFFF] text-xs font-semibold rounded-[9px] shadow-xs flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D71E8] focus-visible:ring-offset-2 min-h-[44px]"
            >
              <span>How It Works</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Strip Pinned to Hero */}
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
  );
};

export default Hero;

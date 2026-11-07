import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../images/hero.png';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onHowItWorksClick?: (e: React.MouseEvent) => void;
}

export const Hero: React.FC<HeroProps> = ({ onHowItWorksClick }) => {
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
      className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B1B3F] to-[#16224A] scroll-mt-24"
    >
      {/* Full-viewport Hero Background Image (high-priority, 70% center on mobile, slow subtle zoom) */}
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

      {/* Navy gradient overlays for text readability while keeping subject clearly visible */}
      {/* 1. Vertical Navy Gradient: Keeps text readable while engineer and laptop remain clearly visible */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(7,13,31,0.55) 0%, rgba(7,13,31,0.20) 45%, rgba(7,13,31,0.60) 100%)',
        }}
      />

      {/* 2. Horizontal Left Gradient: Enhances text legibility on desktop while leaving right area open */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to right, rgba(7,13,31,0.55) 0%, rgba(7,13,31,0.35) 40%, rgba(7,13,31,0.20) 65%, transparent 100%)',
        }}
      />

      {/* 3. Subtle ambient indigo glow */}
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
  );
};

export default Hero;

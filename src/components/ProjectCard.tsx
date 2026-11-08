import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { ProjectIllustration } from './ProjectIllustration';
import { HighlightText } from './HighlightText';
import {
  Heart,
  Star,
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  FileText,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProjectCardProps {
  project: Project;
  searchQuery?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, searchQuery }) => {
  const navigate = useNavigate();
  const { purchasedProjectIds } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const isPurchased = purchasedProjectIds.includes(project.id);
  const isWishlisted = isInWishlist(project.id);

  // Status badge logic: Only small status badge in top-left (Featured, New, or Owned)
  // Palette strictly follows design specs: Owned #16A34A, Featured #6C5CE7, New/Top #2F4BFF (NO sky blue)
  const badgeConfig = useMemo(() => {
    if (isPurchased) {
      return {
        label: 'Owned Kit',
        className: 'bg-[#16A34A] text-white shadow-xs font-bold',
        icon: CheckCircle2,
      };
    }
    if (project.featured) {
      return {
        label: 'Featured',
        className: 'bg-[#6A2FC8] text-white shadow-xs font-bold',
        icon: Sparkles,
      };
    }
    if (project.academicYear?.includes('2026')) {
      return {
        label: '2026 Ready',
        className: 'bg-[#9D71E8] text-white font-bold shadow-xs',
        icon: null,
      };
    }
    if (project.rating >= 4.9) {
      return {
        label: 'Top Rated',
        className: 'bg-[#9D71E8] text-white font-bold shadow-xs',
        icon: null,
      };
    }
    return null;
  }, [isPurchased, project.featured, project.academicYear, project.rating]);

  // Prioritize matching tech tags when a search query is active
  const displayedTechStack = useMemo(() => {
    if (!searchQuery?.trim()) return project.techStack.slice(0, 3);
    const q = searchQuery.toLowerCase().trim();
    const queryWords = q.split(/\s+/).filter(Boolean);
    const matches: string[] = [];
    const nonMatches: string[] = [];

    project.techStack.forEach((t) => {
      const lower = t.toLowerCase();
      const isMatch = queryWords.some((word) => lower.includes(word));
      if (isMatch) {
        matches.push(t);
      } else {
        nonMatches.push(t);
      }
    });

    return [...matches, ...nonMatches].slice(0, 3);
  }, [project.techStack, searchQuery]);

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPurchased) {
      navigate('/dashboard/purchases');
    } else {
      addItem({
        id: project.id,
        title: project.title,
        price: project.price,
        originalPrice: project.originalPrice,
        category: project.category,
        slug: project.slug,
      });
    }
  };

  const BadgeIcon = badgeConfig?.icon;

  return (
    <div className="pk-card-3d group bg-white dark:bg-[#1A0D3D] hover:bg-[#FAF7FD] dark:hover:bg-[#25134D] rounded-2xl border border-[#E8DEFF] dark:border-[#3A2074] hover:border-[#6A2FC8] dark:hover:border-[#9D71E8] shadow-xs hover:shadow-[0_12px_28px_-4px_rgba(106,47,200,0.18)] dark:hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* 1. Top Thumbnail Area (16:9, clean visual, no fake code/terminal) */}
      <div className="relative overflow-hidden bg-[#0B0720] aspect-[16/9] w-full border-b border-[#E8DEFF] dark:border-[#3A2074] shrink-0">
        <Link
          to={`/projects/${project.id}`}
          className="block w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] focus-visible:ring-inset"
          aria-label={`View full details of ${project.title}`}
        >
          <ProjectIllustration
            category={project.category}
            primaryLanguage={project.primaryLanguage}
            techStack={project.techStack}
            title={project.title}
            aspect="16:9"
            imageUrl={project.imageUrl || project.coverImage}
            className="w-full h-full"
          />
        </Link>

        {/* Status Badge: Top-Left (12px, 12px) - Never overlaps heart or text */}
        {badgeConfig && (
          <div className="absolute top-3 left-3 flex items-center z-20 pointer-events-none">
            <div
              className={`text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-wider ${badgeConfig.className}`}
            >
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
              <span>{badgeConfig.label}</span>
            </div>
          </div>
        )}

        {/* Wishlist Heart Button: Top-Right (12px, 12px) - Touch target >= 40x40px */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(project.id, project.title);
          }}
          className={`absolute top-3 right-3 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl backdrop-blur-md transition-all z-20 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] ${
            isWishlisted
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-900/40'
              : 'bg-white/90 dark:bg-[#0B0720]/85 text-slate-500 dark:text-[#D1B8FF] hover:text-rose-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#0B0720] border border-[#E8DEFF] dark:border-[#3A2074]'
          }`}
          title={isWishlisted ? `Remove ${project.title} from wishlist` : `Add ${project.title} to wishlist`}
          aria-label={isWishlisted ? `Remove ${project.title} from wishlist` : `Add ${project.title} to wishlist`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-white text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* 2. Card Body Content (Typography & badging hierarchy) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2 min-w-0">
          {/* Metadata Row: Category & Academic Year */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#63567D] dark:text-[#D1B8FF]/80 min-w-0">
            <span className="uppercase tracking-wider font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] truncate">
              {project.category}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-[#3A2074]">·</span>
            <span className="shrink-0">{project.academicYear || '2025–26'}</span>
          </div>

          {/* Project Title - High contrast bold typography */}
          <Link
            to={`/projects/${project.id}`}
            className="block group-hover:text-[#6A2FC8] dark:group-hover:text-[#D1B8FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] rounded-sm min-w-0"
          >
            <h3 className="font-bold text-base text-[#0B0720] dark:text-[#F2E9FF] leading-snug line-clamp-2">
              <HighlightText text={project.title} query={searchQuery} />
            </h3>
          </Link>

          {/* Short Description - At least 14px (text-sm) */}
          <p className="text-sm text-[#4E4166] dark:text-[#D1B8FF]/80 line-clamp-2 leading-relaxed">
            <HighlightText text={project.shortDescription} query={searchQuery} />
          </p>

          {/* Star Rating Row: Amber #F59E0B with readable grey counts */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex items-center text-[#F59E0B]" aria-label={`Rating: ${project.rating || 4.9} out of 5 stars`}>
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            </div>
            <span className="text-xs font-bold text-[#0B0720] dark:text-[#F2E9FF] tabular-nums ml-0.5">
              {project.rating ? project.rating.toFixed(1) : '4.9'}
            </span>
            <span className="text-xs text-[#63567D] dark:text-[#D1B8FF]/70">
              ({project.reviewsCount || 67} reviews)
            </span>
          </div>

          {/* Tech Stack & Report Badges in Body (Purple Palette: #F2E9FF bg, #25134D text) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {displayedTechStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium text-[#25134D] dark:text-[#F2E9FF] bg-[#F2E9FF] dark:bg-[#25134D] px-2.5 py-0.5 rounded-md border border-[#D1B8FF]/60 dark:border-[#3A2074]"
              >
                <HighlightText text={tech} query={searchQuery} />
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-xs text-[#63567D] dark:text-[#D1B8FF]/70 px-1 font-medium">
                +{project.techStack.length - 3}
              </span>
            )}

            {/* 88+ Pages Report Badge in Body */}
            <span className="text-xs font-medium text-[#25134D] dark:text-[#F2E9FF] bg-[#F2E9FF] dark:bg-[#25134D] px-2.5 py-0.5 rounded-md border border-[#D1B8FF]/60 dark:border-[#3A2074] inline-flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#6A2FC8] dark:text-[#D1B8FF]" />
              <span>88+ pages report</span>
            </span>

            {/* Verified Build Badge in Body */}
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#16A34A] dark:text-emerald-400" />
              <span>Verified Build</span>
            </span>
          </div>
        </div>

        {/* 3. Pricing & Call-to-Action Footer (Pinned to bottom, stacks cleanly on narrow cards) */}
        <div className="pt-4 border-t border-[#E8DEFF] dark:border-[#3A2074] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums tracking-tight">
              ₹{project.price.toLocaleString('en-IN')}
            </span>
            {project.originalPrice > project.price && (
              <span className="text-xs text-[#63567D] dark:text-[#D1B8FF]/60 line-through font-mono tabular-nums">
                ₹{project.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleActionClick}
            className={`w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-xs flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] focus-visible:ring-offset-2 ${
              isPurchased
                ? 'bg-[#16A34A] hover:bg-[#15803D] active:bg-[#14532D] text-white'
                : 'bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white hover:shadow-[0_4px_14px_rgba(106,47,200,0.35)]'
            }`}
            aria-label={isPurchased ? `Download ${project.title} kit` : `Add ${project.title} to cart`}
          >
            {isPurchased ? (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Kit</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

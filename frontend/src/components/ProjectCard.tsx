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
  const { purchasedProjectIds, claimedProjectIds, claimFreeKit, isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const isFree = project.isFree || project.accessType === 'FREE' || project.price === 0;
  const isPurchased = purchasedProjectIds.includes(project.id);
  const isClaimed = claimedProjectIds?.includes(project.id);
  const isWishlisted = isInWishlist(project.id);
  const [claiming, setClaiming] = React.useState(false);

  // Status badge logic: Free Kits, Owned Kits, Featured, or Academic Year
  const badgeConfig = useMemo(() => {
    if (isClaimed) {
      return {
        label: 'Claimed Free Kit',
        className: 'bg-emerald-600 text-white shadow-xs font-bold',
        icon: CheckCircle2,
      };
    }
    if (isPurchased) {
      return {
        label: 'Owned Kit',
        className: 'bg-[#16A34A] text-white shadow-xs font-bold',
        icon: CheckCircle2,
      };
    }
    if (isFree) {
      return {
        label: '100% Free Kit',
        className: 'bg-emerald-500 text-white shadow-xs font-bold animate-pulse',
        icon: Sparkles,
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
  }, [isClaimed, isPurchased, isFree, project.featured, project.academicYear, project.rating]);

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

  const handleActionClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isClaimed || isPurchased) {
      navigate('/dashboard');
      return;
    }

    if (isFree) {
      if (!isAuthenticated) {
        navigate(`/login?redirect=${encodeURIComponent(`/projects/${project.id}`)}`);
        return;
      }
      try {
        setClaiming(true);
        await claimFreeKit(project);
      } catch {
        // Handled gracefully by AuthContext fallback
      } finally {
        setClaiming(false);
      }
      return;
    }

    addItem({
      id: project.id,
      title: project.title,
      price: project.price,
      originalPrice: project.originalPrice,
      category: project.category,
      slug: project.slug,
    });
  };

  const BadgeIcon = badgeConfig?.icon;

  return (
    <div className="card pk-card-3d group rounded-[20px] transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* 1. Top Thumbnail Area (16:9, clean visual, no fake code/terminal) */}
      <div className="relative overflow-hidden bg-[#0B0720] aspect-[16/9] w-full border-b border-white/20 shrink-0 rounded-t-[19px]">
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
            <Link
              to={`/projects?category=${encodeURIComponent(project.category)}`}
              onClick={(e) => e.stopPropagation()}
              className="uppercase tracking-wider font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline hover:text-[#5824A8] dark:hover:text-[#F2E9FF] truncate transition-colors"
              title={`View all ${project.category} projects`}
            >
              {project.category}
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-[#3A2074]">·</span>
            <span className="shrink-0">{project.academicYear || '2025–26'}</span>
            {project.difficulty && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#3A2074]">·</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                  project.difficulty === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : project.difficulty === 'Intermediate'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20'
                }`}>
                  {project.difficulty}
                </span>
              </>
            )}
          </div>

          {/* Project Title - High contrast bold typography with fixed 2-line height (Strictly DM Sans Bold 700) */}
          <Link
            to={`/projects/${project.id}`}
            className="block group-hover:text-[#6A2FC8] dark:group-hover:text-[#D1B8FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] rounded-sm min-w-0"
          >
            <h3 className="font-project-title font-bold text-base text-[#0B0720] dark:text-[#F2E9FF] leading-snug line-clamp-2 min-h-[44px]">
              <HighlightText text={project.title} query={searchQuery} />
            </h3>
          </Link>

          {/* Short Description - Controlled 2-line clamp with uniform height (DM Sans 400) */}
          <p className="font-body font-normal text-sm text-[#4E4166] dark:text-[#D1B8FF]/80 line-clamp-2 leading-relaxed min-h-[40px]">
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

          {/* Tech Stack & Report Badges in Body (Clean non-clickable badges) */}
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

        {/* 3. Pricing & Call-to-Action Footer (Pinned to bottom, View Details + Buy Now / Action) */}
        <div className="pt-4 border-t border-[#E8DEFF] dark:border-[#3A2074] flex flex-col gap-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {isFree ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight uppercase">
                    FREE
                  </span>
                  <span className="text-xs text-[#63567D] dark:text-[#D1B8FF]/60 font-medium">
                    (₹0)
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-lg font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums tracking-tight">
                    ₹{project.price.toLocaleString('en-IN')}
                  </span>
                  {project.originalPrice > project.price && (
                    <span className="text-xs text-[#63567D] dark:text-[#D1B8FF]/60 line-through font-mono tabular-nums">
                      ₹{project.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              )}
            </div>
            {isFree && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Instant Access
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* View Details Button */}
            <Link
              to={`/projects/${project.id}`}
              className="min-h-[38px] px-3 py-2 rounded-xl text-xs font-semibold text-center flex items-center justify-center border border-[#D1B8FF]/70 dark:border-[#3A2074] text-[#25134D] dark:text-[#D1B8FF] hover:bg-[#F2E9FF]/50 dark:hover:bg-[#25134D]/60 transition-colors"
            >
              View Details
            </Link>

            {/* Buy Now / Claim / Owned Button */}
            {isClaimed || isPurchased ? (
              <Link
                to={isPurchased ? '/dashboard/purchases' : `/projects/${project.id}`}
                className="min-h-[38px] px-3 py-2 rounded-xl text-xs font-semibold bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isPurchased ? 'Owned' : 'Claimed'}</span>
              </Link>
            ) : isFree ? (
              <button
                type="button"
                onClick={handleActionClick}
                disabled={claiming}
                className="min-h-[38px] px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{claiming ? 'Claiming...' : 'Get Free Kit'}</span>
              </button>
            ) : (
              <Link
                to={`/checkout/${project.id}`}
                className="min-h-[38px] px-3 py-2 rounded-xl text-xs font-semibold bg-[#6A2FC8] hover:bg-[#5824A8] text-white flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(106,47,200,0.35)]"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

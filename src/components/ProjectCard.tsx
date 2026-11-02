import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { ProjectIllustration } from './ProjectIllustration';
import { HighlightText } from './HighlightText';
import { Star, ArrowRight, Download, CheckCircle2, ShieldCheck, FileCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface ProjectCardProps {
  project: Project;
  searchQuery?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, searchQuery }) => {
  const navigate = useNavigate();
  const { purchasedProjectIds } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isPurchased = purchasedProjectIds.includes(project.id);
  const isWishlisted = isInWishlist(project.id);

  // Prioritize matching tech tags in the preview when a search query is active
  const displayedTechStack = useMemo(() => {
    if (!searchQuery?.trim()) return project.techStack.slice(0, 4);
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

    return [...matches, ...nonMatches].slice(0, 4);
  }, [project.techStack, searchQuery]);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400/80 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Top illustration container with strict uniform aspect ratio */}
      <div className="relative overflow-hidden bg-slate-900 aspect-[16/10] w-full">
        <Link
          to={`/projects/${project.id}`}
          className="block w-full h-full"
        >
          <ProjectIllustration
            category={project.category}
            primaryLanguage={project.primaryLanguage}
            techStack={project.techStack}
            title={project.title}
            aspect="16:10"
            className="w-full h-full"
          />
        </Link>

        {isPurchased && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 z-20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Owned Kit</span>
          </div>
        )}

        {/* Interactive Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(project.id, project.title);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-xs transition-all z-20 shadow-md ${
            isWishlisted
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-slate-900/70 text-slate-200 hover:text-white hover:bg-slate-900/90 border border-white/20'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={isWishlisted ? `Remove ${project.title} from Wishlist` : `Save ${project.title} to Wishlist`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-white text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                <HighlightText text={project.category} query={searchQuery} />
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-slate-300">
                <HighlightText text={project.primaryLanguage} query={searchQuery} />
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">{project.academicYear}</span>
          </div>

          {/* Project Title with uniform 2-line height */}
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
              <HighlightText text={project.title} query={searchQuery} />
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            <HighlightText text={project.shortDescription} query={searchQuery} />
          </p>

          {/* Tech stack inline text tags with clean typographic formatting */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-md px-2 py-1 mb-3">
            {displayedTechStack.map((tech, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300 dark:text-slate-600 mx-1">/</span>}
                <HighlightText text={tech} query={searchQuery} />
              </React.Fragment>
            ))}
          </div>

          {/* Verified Kit Features Checklist */}
          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
              <span className="truncate">80p IEEE Report</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
              <span className="truncate">MySQL 3NF Schema</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
              <span className="truncate">60+ Viva Voce Q&A</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
              <span className="truncate">Seminar PPT Deck</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action row aligned strictly to bottom */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                ₹{project.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                ₹{project.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <div className="flex items-center">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-mono tabular-nums ml-1 font-semibold text-slate-800 dark:text-slate-200">{project.rating}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-500">({project.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/projects/${project.id}`}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent dark:border-slate-700"
            >
              <span>Details</span>
            </Link>

            {isPurchased ? (
              <button
                onClick={() => navigate('/dashboard/purchases')}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Kit</span>
              </button>
            ) : (
              <button
                onClick={() => navigate(`/checkout/${project.id}`)}
                className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Buy Kit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


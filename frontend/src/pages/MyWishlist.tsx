import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import { ProjectIllustration } from '../components/ProjectIllustration';
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ExternalLink,
  Star,
  Download,
  CheckCircle2,
  FolderKanban,
  Sparkles,
  BookOpen,
  FileText,
} from 'lucide-react';

export const MyWishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();
  const { projects } = useProjects();
  const { purchasedProjectIds } = useAuth();

  // Find all project items in wishlist
  const wishlistedProjects = projects.filter((p) => wishlistIds.includes(p.id));

  // Top featured fallback if wishlist is empty
  const recommendedProjects = projects.filter((p) => !wishlistIds.includes(p.id)).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#0B1329] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#1A2846] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Saved For Evaluation
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-mono tabular-nums">
              {wishlistedProjects.length} {wishlistedProjects.length === 1 ? 'Kit' : 'Kits'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
            My Academic Wishlist
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 max-w-xl">
            Save and compare candidate project kits for your final year seminar or capstone defense. Review IEEE documentation, architecture, and technology prerequisites before checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {wishlistedProjects.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-[#080E20] hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-[#1A2846] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}

          <Link
            to="/projects"
            className="px-4 py-2 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Explore More Kits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Wishlist Content */}
      {wishlistedProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {wishlistedProjects.map((project) => {
            const isPurchased = purchasedProjectIds.includes(project.id);

            return (
              <div
                key={project.id}
                className="pk-card-3d bg-white dark:bg-[#0F1830] rounded-2xl border border-[#E3E8F2] dark:border-[#25335F] shadow-xs hover:border-[#2F4BFF]/80 dark:hover:border-[#5B7BFF] transition-all flex flex-col justify-between overflow-hidden group hover:shadow-[0_16px_36px_-6px_rgba(47,75,255,0.22)] dark:hover:shadow-[0_16px_36px_-6px_rgba(91,123,255,0.3)]"
              >
                <div>
                  {/* Top Thumbnail & Illustration Header */}
                  <div className="relative aspect-[16/9] w-full bg-[#0B1B3F] overflow-hidden">
                    <ProjectIllustration
                      category={project.category}
                      primaryLanguage={project.primaryLanguage}
                      techStack={project.techStack}
                      title={project.title}
                      aspect="16:9"
                      imageUrl={project.imageUrl || project.coverImage}
                      className="w-full h-full"
                    />

                    {/* Quick Remove Button on Card (40x40 min touch target) */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(project.id, project.title)}
                      className="absolute top-3 right-3 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-900/80 hover:bg-rose-600 text-white shadow-md backdrop-blur-xs transition-colors z-20 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      title="Remove from Wishlist"
                      aria-label={`Remove ${project.title} from Wishlist`}
                    >
                      <Trash2 className="w-4 h-4 text-slate-300 group-hover/btn:text-white" />
                    </button>

                    {isPurchased && (
                      <div className="absolute top-3 left-3 bg-[#16A34A] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 z-20 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Owned Kit</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Metadata line */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9AA6C7]">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-[#2F4BFF] dark:text-[#8FA4FF]">{project.category}</span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
                        <span className="text-slate-700 dark:text-[#CBD5E1]">{project.primaryLanguage}</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-[#9AA6C7] shrink-0 font-medium">
                        Batch {project.academicYear}
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      to={`/projects/${project.id}`}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF] rounded-sm"
                    >
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-[#E8ECFA] group-hover:text-[#2F4BFF] dark:group-hover:text-[#5B7BFF] transition-colors line-clamp-1">
                        {project.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-[#475569] dark:text-[#9AA6C7] line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack in Body */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 text-xs font-medium text-[#1E293B] dark:text-[#E8ECFA] bg-[#EEF2FF] dark:bg-[#16224A] rounded-md border border-[#C7D2FE] dark:border-[#25335F]"
                        >
                          {tech}
                        </span>
                      ))}
                      <span className="text-xs font-medium bg-[#EEF2FF] text-[#1E293B] border border-[#C7D2FE] dark:bg-[#16224A] dark:text-[#E8ECFA] dark:border-[#25335F] px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                        <span>88+ pages report</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="p-5 pt-3 border-t border-[#E3E8F2] dark:border-[#25335F] bg-slate-50/60 dark:bg-[#080E20] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#0F172A] dark:text-[#E8ECFA] font-mono tabular-nums">
                        ₹{project.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-[#9AA6C7] line-through font-mono tabular-nums">
                        ₹{project.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <div className="flex items-center text-[#F59E0B]">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      </div>
                      <span className="font-bold text-[#1E293B] dark:text-[#E8ECFA] tabular-nums">
                        {project.rating}
                      </span>
                      <span className="text-xs text-[#64748B] dark:text-[#9AA6C7]">
                        ({project.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Link
                      to={`/projects/${project.id}`}
                      className="w-1/2 sm:w-auto min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] bg-white dark:bg-[#0B1329] hover:bg-slate-100 dark:hover:bg-[#101C38] rounded-xl border border-[#E3E8F2] dark:border-[#25335F] transition-colors flex items-center justify-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF]"
                    >
                      <span>Full Spec</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-[#94A3B8]" />
                    </Link>

                    {isPurchased ? (
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard/purchases')}
                        className="w-1/2 sm:w-auto min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] active:bg-[#14532D] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Access Kit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate(`/checkout/${project.id}`)}
                        className="w-1/2 sm:w-auto min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF]"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Proceed to Buy</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] p-8 sm:p-14 text-center space-y-6 shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center mx-auto text-rose-500 dark:text-rose-400">
            <Heart className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] leading-relaxed">
              You haven't bookmarked any engineering capstones yet. Browse verified project kits with source code, IEEE reports, and examiner viva sheets to save them here.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Engineering Projects</span>
            </Link>
          </div>

          {/* Quick recommendations */}
          {recommendedProjects.length > 0 && (
            <div className="pt-10 border-t border-slate-200 dark:border-[#1A2846] text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-4">
                Popular Kits You May Like
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-[#1A2846] bg-slate-50/60 dark:bg-[#080E20] hover:border-slate-300 dark:hover:border-[#3B82F6]/50 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="text-[10px] text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold mb-1">
                        {p.category} · {p.primaryLanguage}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-[#E8ECFA] line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7] line-clamp-2 mt-1">
                        {p.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#25335F]">
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-[#E8ECFA] tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        to={`/projects/${p.id}`}
                        className="text-xs font-semibold text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline"
                      >
                        Inspect Kit &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

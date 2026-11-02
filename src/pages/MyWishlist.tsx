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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Saved For Evaluation
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-mono tabular-nums">
              {wishlistedProjects.length} {wishlistedProjects.length === 1 ? 'Kit' : 'Kits'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            My Academic Wishlist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Save and compare candidate project kits for your final year seminar or capstone defense. Review IEEE documentation, architecture, and technology prerequisites before checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {wishlistedProjects.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}

          <Link
            to="/projects"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
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
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Thumbnail & Illustration Header */}
                  <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                    <ProjectIllustration
                      category={project.category}
                      primaryLanguage={project.primaryLanguage}
                      techStack={project.techStack}
                      title={project.title}
                      aspect="16:9"
                      className="w-full h-full"
                    />

                    {/* Quick Remove Button on Card */}
                    <button
                      onClick={() => removeFromWishlist(project.id, project.title)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-red-600 text-white shadow-md backdrop-blur-xs transition-colors z-20 group/btn"
                      title="Remove from Wishlist"
                      aria-label="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4 text-slate-300 group-hover/btn:text-white" />
                    </button>

                    {isPurchased && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 z-20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Owned Kit</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Metadata line */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{project.category}</span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-slate-600 dark:text-slate-300">{project.primaryLanguage}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                        Batch {project.academicYear}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/projects/${project.id}`}>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        ₹{project.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                        ₹{project.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {project.rating} ({project.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/projects/${project.id}`}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                    >
                      <span>Full Spec</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>

                    {isPurchased ? (
                      <button
                        onClick={() => navigate('/dashboard/purchases')}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Access Kit</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/checkout/${project.id}`)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center mx-auto text-rose-500 dark:text-rose-400">
            <Heart className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You haven't bookmarked any engineering capstones yet. Browse verified project kits with source code, IEEE reports, and examiner viva sheets to save them here.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Engineering Projects</span>
            </Link>
          </div>

          {/* Quick recommendations */}
          {recommendedProjects.length > 0 && (
            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Popular Kits You May Like
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mb-1">
                        {p.category} · {p.primaryLanguage}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {p.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        to={`/projects/${p.id}`}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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

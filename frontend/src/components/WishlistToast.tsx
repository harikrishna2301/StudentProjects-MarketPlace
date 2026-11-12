import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart, X, Check, ArrowRight } from 'lucide-react';

export const WishlistToast: React.FC = () => {
  const { toast, dismissToast } = useWishlist();

  if (!toast) return null;

  const isAdded = toast.type === 'added';
  const isRemoved = toast.type === 'removed';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 flex items-start gap-3.5 text-slate-800 dark:text-slate-100">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isAdded
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isAdded ? 'fill-rose-500 text-rose-500' : ''}`} />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{isAdded ? 'Saved to Wishlist' : isRemoved ? 'Removed from Wishlist' : 'Wishlist Updated'}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
            {toast.message}
          </p>

          <div className="mt-2 flex items-center gap-3">
            <Link
              to="/dashboard/wishlist"
              onClick={dismissToast}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>View My Wishlist</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

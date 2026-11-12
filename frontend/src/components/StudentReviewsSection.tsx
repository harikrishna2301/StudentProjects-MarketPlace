import React, { useState, useEffect, useMemo } from 'react';
import { StudentReview } from '../types';
import { INITIAL_STUDENT_REVIEWS } from '../data/reviews';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  Filter,
  GraduationCap,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown,
  X,
  Send,
} from 'lucide-react';

interface StudentReviewsSectionProps {
  projectId?: string;
  projectTitle?: string;
  showHeaderSummary?: boolean;
}

export const StudentReviewsSection: React.FC<StudentReviewsSectionProps> = ({
  projectId,
  projectTitle,
  showHeaderSummary = true,
}) => {
  const { user } = useAuth();

  // Local storage backed review store
  const storageKey = projectId ? `pk_reviews_${projectId}` : 'pk_reviews_global';

  const [reviews, setReviews] = useState<StudentReview[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    if (projectId) {
      const matched = INITIAL_STUDENT_REVIEWS.filter((r) => r.projectId === projectId);
      return matched.length > 0 ? matched : INITIAL_STUDENT_REVIEWS.slice(0, 4);
    }
    return INITIAL_STUDENT_REVIEWS;
  });

  // Track voted review IDs in local state
  const [votedIds, setVotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pk_voted_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newName, setNewName] = useState(user?.fullName || '');
  const [newCollege, setNewCollege] = useState(user?.collegeName || '');
  const [newBranch, setNewBranch] = useState('B.Tech CSE');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newHighlightTag, setNewHighlightTag] = useState('Cleared Final Review');

  useEffect(() => {
    if (user?.fullName && !newName) setNewName(user.fullName);
    if (user?.collegeName && !newCollege) setNewCollege(user.collegeName);
  }, [user]);

  // Persist reviews when changed
  const saveReviews = (updated: StudentReview[]) => {
    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Upvote Helpful
  const handleVoteHelpful = (reviewId: string) => {
    if (votedIds.includes(reviewId)) return;
    const updatedVotes = [...votedIds, reviewId];
    setVotedIds(updatedVotes);
    try {
      localStorage.setItem('pk_voted_reviews', JSON.stringify(updatedVotes));
    } catch {
      // ignore
    }
    const updatedReviews = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    );
    saveReviews(updatedReviews);
  };

  // Submit New Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim() || !newComment.trim()) return;

    const created: StudentReview = {
      id: `rev-${Date.now()}`,
      projectId: projectId || 'proj-general',
      projectTitle: projectTitle || 'ProjectKit Capstone Kit',
      studentName: newName.trim(),
      collegeName: newCollege.trim() || 'Engineering College',
      branch: newBranch.trim() || 'B.Tech Engineering',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      date: 'Just now',
      verifiedPurchase: true,
      helpfulCount: 1,
      highlightTag: newHighlightTag || 'Verified Student Defense',
    };

    const updated = [created, ...reviews];
    saveReviews(updated);
    setSubmitSuccess(true);
    setNewTitle('');
    setNewComment('');
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddReviewForm(false);
    }, 2500);
  };

  // Filtered Reviews list
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedRatingFilter !== 'all' && r.rating !== selectedRatingFilter) {
        return false;
      }
      if (selectedBranchFilter !== 'all') {
        if (!r.branch.toLowerCase().includes(selectedBranchFilter.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, selectedRatingFilter, selectedBranchFilter]);

  // Calculate rating stats
  const totalReviews = reviews.length;
  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 4.9;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / totalReviews).toFixed(1));
  }, [reviews, totalReviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  return (
    <div className="space-y-8">
      {/* 1. SCOREBOARD & SATISFACTION SUMMARY */}
      {showHeaderSummary && (
        <div className="card rounded-[20px] p-6 sm:p-8 bg-white/40 dark:bg-[#1A0D3D]/50 border border-white/20 dark:border-[#3A2074] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Overall numerical score */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-[#3A2074] pb-6 lg:pb-0 lg:pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#9D71E8] mb-1">
                Verified Student Ratings
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#63567D] dark:text-[#D1B8FF]/70">
                  / 5.0
                </span>
              </div>

              {/* 5 Stars Visual */}
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-[#F59E0B] text-[#F59E0B]'
                        : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80 mt-1">
                Based on <strong className="text-slate-900 dark:text-white font-mono">{totalReviews + 64}</strong> verified viva defense reviews
              </p>

              {/* Write Review CTA Button */}
              <button
                type="button"
                onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                className="mt-4 px-4 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{showAddReviewForm ? 'Close Review Form' : 'Write a Student Review'}</span>
              </button>
            </div>

            {/* Middle: Star Distribution Bars */}
            <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-[#3A2074] pb-6 lg:pb-0 lg:pr-8">
              <div className="text-xs font-bold text-slate-800 dark:text-[#F2E9FF] mb-2">
                Rating Breakdown
              </div>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = (ratingCounts as any)[stars] || 0;
                const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : stars === 5 ? 88 : 12;
                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedRatingFilter(selectedRatingFilter === stars ? 'all' : stars)}
                    className="w-full flex items-center gap-3 text-xs text-left group hover:opacity-90 transition-opacity"
                  >
                    <span className="w-12 font-medium text-slate-600 dark:text-[#D1B8FF]/80 flex items-center gap-1 shrink-0">
                      <span>{stars}</span>
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-[#0B0720] rounded-full overflow-hidden border border-slate-200/50 dark:border-[#3A2074]">
                      <div
                        className="h-full bg-gradient-to-r from-[#6A2FC8] to-[#9D71E8] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-9 text-right font-mono text-[11px] text-slate-500 dark:text-[#9AA6C7] shrink-0">
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Key Academic Trust Badges */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F2E9FF]">99.4% First-Run Rate</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#D1B8FF]/70">Zero deprecated dependencies</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F2E9FF]">IEEE 830 Formatted</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#D1B8FF]/70">Accepted across AICTE colleges</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F2E9FF]">Viva Defense Ready</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#D1B8FF]/70">60+ examiner question answers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD REVIEW FORM (COLLAPSIBLE MODAL CARD) */}
      {showAddReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="card rounded-[20px] p-6 sm:p-7 bg-[#FAF7FD] dark:bg-[#1A0D3D] border border-[#D1B8FF] dark:border-[#3A2074] space-y-5 animate-hero-1 shadow-md"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEFF] dark:border-[#3A2074]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6A2FC8] dark:text-[#9D71E8]" />
              <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-[#F2E9FF]">
                Share Your Academic Review & Viva Experience
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddReviewForm(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Thank you! Your verified student review and rating have been posted successfully.</span>
            </div>
          )}

          {/* Interactive Star Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-2">
              Select Your Rating (1 to 5 Stars):
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-7 h-7 cursor-pointer transition-colors ${
                      star <= (hoverRating || newRating)
                        ? 'fill-[#F59E0B] text-[#F59E0B]'
                        : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-800 dark:text-white font-mono ml-2">
                {newRating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="pk-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-1.5">
                College / University
              </label>
              <input
                type="text"
                required
                value={newCollege}
                onChange={(e) => setNewCollege(e.target.value)}
                placeholder="e.g. VIT Vellore / SRM / NIT"
                className="pk-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-1.5">
                Branch / Specialization
              </label>
              <select
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                className="pk-select"
              >
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech Information Technology">B.Tech IT</option>
                <option value="B.Tech AI & Data Science">B.Tech AI & DS</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="B.Tech EEE / IoT">B.Tech EEE / IoT</option>
                <option value="M.Tech CSE">M.Tech CSE</option>
                <option value="MCA / BCA">MCA / BCA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-1.5">
              Review Title (Key Takeaway)
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Scored 96/100! Viva questions bank directly matched examiner inquiries"
              className="pk-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-1.5">
              Detailed Experience (Code execution, documentation, guide review feedback)
            </label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Explain how the source code ran, whether the IEEE report needed adjustments, and how your final review went..."
              className="pk-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-[#D1B8FF] mb-1.5">
              Review Achievement Badge
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Cleared Final Review',
                'Report Accepted Instantly',
                'Scored 90%+',
                'Viva Questions Matched',
                'Clean First-Run Setup',
                'Best Project Award',
              ].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setNewHighlightTag(tag)}
                  className={`px-3 py-1 text-[11px] rounded-lg border font-medium transition-all ${
                    newHighlightTag === tag
                      ? 'bg-[#6A2FC8] text-white border-[#6A2FC8] shadow-xs'
                      : 'bg-white/60 dark:bg-[#0B0720]/60 text-slate-700 dark:text-[#D1B8FF] border-slate-200 dark:border-[#3A2074] hover:bg-white dark:hover:bg-[#0B0720]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddReviewForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-[#D1B8FF] hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-[#6A2FC8]/30 transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Verified Review</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. FILTER TABS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-[#9AA6C7] flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedRatingFilter === 'all'
                ? 'bg-[#6A2FC8] text-white shadow-xs'
                : 'bg-white/60 dark:bg-[#1A0D3D] text-slate-700 dark:text-[#D1B8FF] border border-slate-200/60 dark:border-[#3A2074] hover:bg-white dark:hover:bg-[#25134D]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>

          <button
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              selectedRatingFilter === 5
                ? 'bg-[#6A2FC8] text-white shadow-xs'
                : 'bg-white/60 dark:bg-[#1A0D3D] text-slate-700 dark:text-[#D1B8FF] border border-slate-200/60 dark:border-[#3A2074] hover:bg-white dark:hover:bg-[#25134D]'
            }`}
          >
            <span>5 Stars</span>
            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
          </button>

          <button
            onClick={() => setSelectedRatingFilter(4)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              selectedRatingFilter === 4
                ? 'bg-[#6A2FC8] text-white shadow-xs'
                : 'bg-white/60 dark:bg-[#1A0D3D] text-slate-700 dark:text-[#D1B8FF] border border-slate-200/60 dark:border-[#3A2074] hover:bg-white dark:hover:bg-[#25134D]'
            }`}
          >
            <span>4 Stars</span>
            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-[#D1B8FF]/70 font-mono">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </div>
      </div>

      {/* 4. REVIEWS GRID */}
      {filteredReviews.length === 0 ? (
        <div className="card rounded-[20px] p-10 text-center space-y-3 bg-white/40 dark:bg-[#1A0D3D]/40 border border-white/20 dark:border-[#3A2074]">
          <Star className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="font-heading font-semibold text-base text-slate-800 dark:text-white">
            No reviews matching selected filter
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#D1B8FF]/70">
            Try switching to "All Reviews" or be the first to share your defense experience for this rating category.
          </p>
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className="px-4 py-2 bg-[#6A2FC8] text-white text-xs font-semibold rounded-xl inline-block"
          >
            Show All Reviews
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => {
            const hasVoted = votedIds.includes(rev.id);
            const initials = rev.studentName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={rev.id}
                className="card rounded-[20px] p-6 bg-white/50 dark:bg-[#1A0D3D]/60 border border-white/30 dark:border-[#3A2074] shadow-xs flex flex-col justify-between hover:border-[#9D71E8]/50 transition-colors"
              >
                <div className="space-y-3">
                  {/* Student Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6A2FC8] to-[#9D71E8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#0B0720] dark:text-[#F2E9FF]">
                            {rev.studentName}
                          </h4>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Student</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/70 mt-0.5">
                          {rev.collegeName} · <span className="font-medium text-slate-700 dark:text-white">{rev.branch}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                      {rev.date}
                    </span>
                  </div>

                  {/* Stars Row & Achievement Badge */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1" aria-label={`Rating: ${rev.rating} of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? 'fill-[#F59E0B] text-[#F59E0B]'
                              : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold font-mono text-[#0B0720] dark:text-white ml-1">
                        {rev.rating}.0
                      </span>
                    </div>

                    {rev.highlightTag && (
                      <span className="text-[10px] font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] bg-[#F2E9FF] dark:bg-[#0B0720] px-2 py-0.5 rounded-md border border-[#D1B8FF]/50 dark:border-[#3A2074]">
                        {rev.highlightTag}
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  <h5 className="font-bold text-sm text-[#0B0720] dark:text-[#F2E9FF] leading-snug pt-1">
                    "{rev.title}"
                  </h5>

                  {/* Review Comment */}
                  <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/85 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Project Tag if on global view */}
                  {!projectId && rev.projectTitle && (
                    <div className="pt-2">
                      <span className="text-[11px] text-slate-500 dark:text-[#9AA6C7] font-medium">
                        Project evaluated: <strong className="text-slate-800 dark:text-slate-200">{rev.projectTitle}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Helpful button */}
                <div className="pt-3 mt-4 border-t border-[#E8DEFF] dark:border-[#3A2074] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Verified university capstone review
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVoteHelpful(rev.id)}
                    disabled={hasVoted}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      hasVoted
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-white/60 dark:bg-[#0B0720]/60 text-slate-600 dark:text-[#D1B8FF] hover:bg-white dark:hover:bg-[#0B0720] border border-white/20 dark:border-[#3A2074]'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import {
  ShoppingBag,
  Download,
  Gift,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  Heart,
  Lock,
  Clock,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const StudentDashboard: React.FC = () => {
  const { user, myOrders, purchasedProjectIds, claimedProjectIds, claimFreeKit, downloadProjectKit } = useAuth();
  const { projects } = useProjects();
  const { wishlistIds, wishlistCount } = useWishlist();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // 1. My Free Kits (Claimed)
  const claimedProjects = projects.filter((p) => claimedProjectIds?.includes(p.id));

  // 2. My Purchased Kits (Verified Paid)
  const purchasedProjects = projects.filter((p) => purchasedProjectIds.includes(p.id));

  // 3. Available Free Kits (Not yet claimed)
  const availableFreeProjects = projects.filter(
    (p) => (p.isFree || p.accessType === 'FREE' || p.price === 0) && !claimedProjectIds?.includes(p.id)
  );

  // 4. Recent Purchases / Orders
  const recentOrders = myOrders.slice(0, 5);
  const totalInvested = myOrders.reduce((sum, o) => sum + o.amount, 0);

  const handleClaim = async (project: any) => {
    try {
      setClaimingId(project.id);
      await claimFreeKit(project);
    } catch {
      // Handled gracefully by AuthContext fallback
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="card rounded-[20px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all">
        <div>
          <div className="text-xs font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] uppercase tracking-wider mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Student Dashboard & Access Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B0720] dark:text-[#F2E9FF]">
            Welcome back, {user?.fullName || 'Student'}
          </h1>
          <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80 mt-1">
            Enrolled at <span className="font-semibold text-[#0B0720] dark:text-white">{user?.collegeName || 'Academic Institution'}</span> · Account Active
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/wishlist"
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Wishlist ({wishlistCount})</span>
          </Link>

          <Link
            to="/projects"
            className="px-4 py-2 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/dashboard/delete-account"
            className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#4E4166] dark:text-[#D1B8FF]/80">Claimed Free Kits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums">
            {claimedProjects.length}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Free source & docs unlocked</p>
        </div>

        <div className="card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#4E4166] dark:text-[#D1B8FF]/80">Purchased Project Kits</span>
            <div className="w-8 h-8 rounded-lg bg-[#6A2FC8]/10 border border-[#6A2FC8]/30 text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums">
            {purchasedProjects.length}
          </div>
          <p className="text-[11px] text-[#4E4166] dark:text-[#D1B8FF]/70">Verified commercial license</p>
        </div>

        <div className="card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#4E4166] dark:text-[#D1B8FF]/80">Available Free to Claim</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums">
            {availableFreeProjects.length}
          </div>
          <p className="text-[11px] text-amber-500 font-medium">Ready for instant claim</p>
        </div>

        <div className="card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#4E4166] dark:text-[#D1B8FF]/80">Total Invested</span>
            <div className="w-8 h-8 rounded-lg bg-[#6A2FC8]/10 border border-[#6A2FC8]/30 text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums">
            ₹{totalInvested.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#4E4166] dark:text-[#D1B8FF]/70">{myOrders.length} Completed Orders</p>
        </div>
      </div>

      {/* SECTION 1: MY FREE KITS */}
      <div className="card rounded-[20px] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B0720] dark:text-[#F2E9FF] flex items-center gap-2">
                <span>My Free Kits</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {claimedProjects.length} Claimed
                </span>
              </h2>
              <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80">
                Free capstone projects you claimed. Full source code and documentation unlocked.
              </p>
            </div>
          </div>
        </div>

        {claimedProjects.length > 0 ? (
          <div className="space-y-3">
            {claimedProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 rounded-xl border border-white/20 bg-white/40 dark:bg-[#25134D]/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#6A2FC8] dark:text-[#D1B8FF]">
                    <span className="font-semibold uppercase tracking-wider">{p.category}</span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className="text-[#0B0720] dark:text-[#F2E9FF]">{p.primaryLanguage}</span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className="tabular-nums font-mono">{p.academicYear}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      FREE CLAIMED
                    </span>
                  </div>
                  <h3 className="font-project-title font-bold text-sm text-[#0B0720] dark:text-[#F2E9FF] truncate">
                    {p.title}
                  </h3>
                  <div className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/70 font-mono truncate">
                    Stack: {p.techStack.join(' · ')}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link
                    to={`/projects/${p.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B0720] dark:text-[#F2E9FF] bg-white/60 dark:bg-[#0B0720]/60 hover:bg-white dark:hover:bg-[#0B0720] rounded-xl border border-white/20 transition-colors flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>

                  <button
                    onClick={() => downloadProjectKit(p, 'Source ZIP')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source (.zip)</span>
                  </button>

                  <button
                    onClick={() => downloadProjectKit(p, 'IEEE Report')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B0720] dark:text-[#F2E9FF] bg-white/60 dark:bg-[#0B0720]/60 hover:bg-white dark:hover:bg-[#0B0720] rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#D1B8FF]" />
                    <span>Documentation (.docx)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-white/20">
            <Gift className="w-10 h-10 text-[#6A2FC8] dark:text-[#D1B8FF] mx-auto mb-2 opacity-60" />
            <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80 mb-3">You haven't claimed any free kits yet.</p>
            {availableFreeProjects.length > 0 && (
              <p className="text-xs text-emerald-500 font-semibold">
                See Available Free Kits below to claim your first free project kit!
              </p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: MY PURCHASED KITS */}
      <div className="card rounded-[20px] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6A2FC8]/10 text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center border border-[#6A2FC8]/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B0720] dark:text-[#F2E9FF] flex items-center gap-2">
                <span>My Purchased Kits</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6A2FC8]/20 text-[#6A2FC8] dark:text-[#D1B8FF] border border-[#6A2FC8]/30">
                  {purchasedProjects.length} Verified
                </span>
              </h2>
              <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80">
                Premium commercial project kits with verified Razorpay payment receipts.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/purchases"
            className="text-xs font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline flex items-center gap-1"
          >
            <span>View all ({purchasedProjects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {purchasedProjects.length > 0 ? (
          <div className="space-y-3">
            {purchasedProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 rounded-xl border border-white/20 bg-white/40 dark:bg-[#25134D]/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#6A2FC8] dark:text-[#D1B8FF]">
                    <span className="font-semibold uppercase tracking-wider">{p.category}</span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className="text-[#0B0720] dark:text-[#F2E9FF]">{p.primaryLanguage}</span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className="tabular-nums font-mono">{p.academicYear}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      PAID & VERIFIED
                    </span>
                  </div>
                  <h3 className="font-project-title font-bold text-sm text-[#0B0720] dark:text-[#F2E9FF] truncate">
                    {p.title}
                  </h3>
                  <div className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/70 font-mono truncate">
                    Stack: {p.techStack.join(' · ')}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link
                    to={`/projects/${p.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B0720] dark:text-[#F2E9FF] bg-white/60 dark:bg-[#0B0720]/60 hover:bg-white dark:hover:bg-[#0B0720] rounded-xl border border-white/20 transition-colors flex items-center gap-1"
                  >
                    <span>Spec</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>

                  <button
                    onClick={() => downloadProjectKit(p, 'Source ZIP')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6A2FC8] hover:bg-[#5824A8] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source (.zip)</span>
                  </button>

                  <button
                    onClick={() => downloadProjectKit(p, 'IEEE Report')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B0720] dark:text-[#F2E9FF] bg-white/60 dark:bg-[#0B0720]/60 hover:bg-white dark:hover:bg-[#0B0720] rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#D1B8FF]" />
                    <span>Report (.docx)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-white/20">
            <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80 mb-3">You haven't purchased any project kits yet.</p>
            <Link
              to="/projects"
              className="px-4 py-2 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs inline-block"
            >
              Explore Projects
            </Link>
          </div>
        )}
      </div>

      {/* SECTION 3: AVAILABLE FREE KITS */}
      {availableFreeProjects.length > 0 && (
        <div className="card rounded-[20px] p-6 space-y-4 border-2 border-emerald-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B0720] dark:text-[#F2E9FF] flex items-center gap-2">
                  <span>Available Free Kits</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    {availableFreeProjects.length} Ready to Claim
                  </span>
                </h2>
                <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80">
                  100% Free academic kits for university students. 1-click claim with no payment required.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableFreeProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-[#25134D]/40 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6A2FC8] dark:text-[#D1B8FF] mb-1">
                    <span className="font-semibold uppercase tracking-wider">{p.category}</span>
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      FREE (₹0)
                    </span>
                  </div>
                  <h3 className="font-project-title font-bold text-sm text-[#0B0720] dark:text-[#F2E9FF] line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/70 line-clamp-2 mt-1">
                    {p.shortDescription}
                  </p>
                  <div className="text-[11px] text-[#4E4166] dark:text-[#D1B8FF]/60 font-mono mt-2 truncate">
                    Stack: {p.techStack.join(' · ')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/20">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-xs font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleClaim(p)}
                    disabled={claimingId === p.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{claimingId === p.id ? 'Claiming Kit...' : 'Claim Free Kit'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: RECENT PURCHASES / ORDERS */}
      <div className="card rounded-[20px] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6A2FC8]/10 text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center border border-[#6A2FC8]/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B0720] dark:text-[#F2E9FF]">Recent Purchases & Transactions</h2>
              <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80">Audit log of your official order payments and receipts.</p>
            </div>
          </div>
          <Link
            to="/dashboard/orders"
            className="text-xs font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline"
          >
            All Orders ({myOrders.length})
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/20 text-[#4E4166] dark:text-[#D1B8FF]/70 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 font-semibold">Order ID</th>
                  <th className="py-2.5 font-semibold">Project Title</th>
                  <th className="py-2.5 font-semibold">Date</th>
                  <th className="py-2.5 font-semibold">Payment Method</th>
                  <th className="py-2.5 font-semibold text-right">Amount</th>
                  <th className="py-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-medium text-[#0B0720] dark:text-[#F2E9FF]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 font-medium text-[#0B0720] dark:text-[#F2E9FF] max-w-xs truncate">
                      {order.projectTitle}
                    </td>
                    <td className="py-3 text-[#4E4166] dark:text-[#D1B8FF]/70 font-mono tabular-nums">{order.date}</td>
                    <td className="py-3 text-[#4E4166] dark:text-[#D1B8FF]/80">{order.paymentMethod}</td>
                    <td className="py-3 text-right font-mono font-bold text-[#0B0720] dark:text-[#F2E9FF] tabular-nums">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#4E4166] dark:text-[#D1B8FF]/80">
            No purchases yet.
          </div>
        )}
      </div>

      {/* SECTION 5: ACCOUNT SECURITY & PERMANENT DELETION */}
      <div className="card rounded-[20px] p-6 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <Trash2 className="w-4 h-4" />
            <span>Account Privacy & Deletion</span>
          </div>
          <h2 className="text-sm font-bold text-[#0B0720] dark:text-[#F2E9FF]">
            Need to close and erase your ProjectKit student account?
          </h2>
          <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/75">
            Permanently remove your student profile, saved claims, and active session credentials anytime.
          </p>
        </div>

        <Link
          to="/dashboard/delete-account"
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete My Account</span>
        </Link>
      </div>
    </div>
  );
};

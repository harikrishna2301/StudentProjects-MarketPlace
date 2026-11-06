import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import {
  ShoppingBag,
  Download,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  Terminal,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, myOrders, purchasedProjectIds, downloadProjectKit } = useAuth();
  const { projects } = useProjects();
  const { wishlistIds, wishlistCount } = useWishlist();

  const purchasedProjects = projects.filter((p) => purchasedProjectIds.includes(p.id));
  const wishlistedProjects = projects.filter((p) => wishlistIds.includes(p.id));
  const recentOrders = myOrders.slice(0, 3);

  // Total spent calculation
  const totalInvested = myOrders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#0F1830] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#25335F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="text-xs font-semibold text-[#2F4BFF] dark:text-[#5B7BFF] uppercase tracking-wider mb-1">
            Student Portal Overview
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#E8ECFA]">
            Welcome back, {user?.fullName || 'Rahul'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#9AA6C7] mt-1">
            Enrolled at <span className="font-semibold text-slate-800 dark:text-[#CBD5E1]">{user?.collegeName || 'Vellore Institute of Technology'}</span> · Final Year B.Tech
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
            className="px-4 py-2 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Explore More Kits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#0B1329] p-5 rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Total Kits Owned</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono tabular-nums">
            {purchasedProjects.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#94A3B8]">All downloads permanently active</p>
        </div>

        <Link
          to="/dashboard/wishlist"
          className="bg-white dark:bg-[#0B1329] p-5 rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs space-y-2 hover:border-rose-300 dark:hover:border-rose-900/60 transition-colors block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Saved in Wishlist
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-[#080E20] border border-rose-200 dark:border-[#1A2846] text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono tabular-nums">
            {wishlistCount}
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
            <span>View Wishlist</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        <div className="bg-white dark:bg-[#0B1329] p-5 rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Total Orders Placed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#080E20] border border-emerald-200 dark:border-[#1A2846] text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono tabular-nums">
            {myOrders.length}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Delivery Completed</p>
        </div>

        <div className="bg-white dark:bg-[#0F1830] p-5 rounded-2xl border border-slate-200 dark:border-[#25335F] shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-[#9AA6C7]">Total Invested</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#16224A] border border-blue-200 dark:border-[#25335F] text-[#2F4BFF] dark:text-[#5B7BFF] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#E8ECFA] font-mono tabular-nums">
            ₹{totalInvested.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">Institutional student rate</p>
        </div>

        <div className="bg-white dark:bg-[#0F1830] p-5 rounded-2xl border border-slate-200 dark:border-[#25335F] shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-[#9AA6C7]">IEEE Reports</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-[#16224A] border border-violet-200 dark:border-[#25335F] text-[#6C5CE7] dark:text-[#8C7CFF] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#E8ECFA] font-mono tabular-nums">
            {purchasedProjects.length * 2} Docs
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">Word & PDF formats unlocked</p>
        </div>
      </div>

      {/* Recently Purchased Projects & Instant Downloads */}
      <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] shadow-xs p-6 space-y-6 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#25335F]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">
              Active Project Kits & Source Downloads
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9AA6C7]">
              Direct access to annotated repositories, SQL schemas, and viva documentation.
            </p>
          </div>
          <Link
            to="/dashboard/purchases"
            className="text-xs font-semibold text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline flex items-center gap-1"
          >
            <span>View all ({purchasedProjects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {purchasedProjects.length > 0 ? (
          <div className="space-y-4">
            {purchasedProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-[#25335F] hover:border-[#2F4BFF]/60 dark:hover:border-[#5B7BFF]/60 transition-colors bg-slate-50/70 dark:bg-[#16224A] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9AA6C7]">
                    <span className="font-semibold text-[#2F4BFF] dark:text-[#5B7BFF]">{project.category}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
                    <span className="text-slate-700 dark:text-[#CBD5E1]">{project.primaryLanguage}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
                    <span className="tabular-nums font-mono">{project.academicYear}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA] truncate">
                    {project.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-[#9AA6C7] font-mono truncate">
                    Stack: {project.techStack.join(' · ')}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link
                    to={`/projects/${project.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0F1830] hover:bg-slate-100 dark:hover:bg-[#16224A] rounded-xl border border-slate-200 dark:border-[#25335F] transition-colors flex items-center gap-1"
                  >
                    <span>Guide</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-[#9AA6C7]" />
                  </Link>

                  <button
                    onClick={() => downloadProjectKit(project, 'Source ZIP')}
                    className="pk-btn-primary px-3 py-1.5 text-xs font-semibold text-white bg-[#2F4BFF] hover:bg-[#1E36D6] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source (.zip)</span>
                  </button>

                  <button
                    onClick={() => downloadProjectKit(project, 'IEEE Report')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0F1830] hover:bg-slate-100 dark:hover:bg-[#16224A] rounded-xl border border-slate-200 dark:border-[#25335F] transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#6C5CE7] dark:text-[#8C7CFF]" />
                    <span>Report (.docx)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">No project kits purchased yet.</p>
            <Link
              to="/projects"
              className="px-4 py-2 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              Browse Engineering Kits
            </Link>
          </div>
        )}
      </div>

      {/* Bookmarked in Wishlist Section */}
      {wishlistedProjects.length > 0 && (
        <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1A2846]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                  Saved in Your Wishlist ({wishlistedProjects.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  Projects shortlisted for college review and guide approval.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/wishlist"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Wishlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistedProjects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#1A2846] bg-slate-50/60 dark:bg-[#080E20] hover:border-slate-300 dark:hover:border-[#3B82F6]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                  <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#9AA6C7] mb-1">
                    <span className="text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold">{p.category}</span>
                    <span className="font-mono">{p.primaryLanguage}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-[#E8ECFA] line-clamp-1">{p.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#9AA6C7] line-clamp-2 mt-1">
                    {p.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#25335F]">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-[#E8ECFA] tabular-nums">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF]"
                    >
                      Spec
                    </Link>
                    <Link
                      to={`/checkout/${p.id}`}
                      className="pk-btn-primary px-2.5 py-1 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white rounded-lg text-[11px] font-semibold shadow-xs"
                    >
                      Buy Kit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] shadow-xs p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#25335F]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">Recent Order History</h2>
            <p className="text-xs text-slate-500 dark:text-[#9AA6C7]">Track receipts and payment confirmation references.</p>
          </div>
          <Link
            to="/dashboard/orders"
            className="text-xs font-semibold text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline"
          >
            All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1A2846] text-slate-500 dark:text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-semibold">Order ID</th>
                <th className="py-2.5 font-semibold">Project</th>
                <th className="py-2.5 font-semibold">Date</th>
                <th className="py-2.5 font-semibold">Payment</th>
                <th className="py-2.5 font-semibold text-right">Amount</th>
                <th className="py-2.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1A2846]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-[#101C38]/40 transition-colors">
                  <td className="py-3 font-mono text-slate-700 dark:text-[#CBD5E1] font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 font-medium text-slate-900 dark:text-[#F8FAFC] max-w-xs truncate">
                    {order.projectTitle}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-[#94A3B8] font-mono tabular-nums">{order.date}</td>
                  <td className="py-3 text-slate-600 dark:text-[#CBD5E1]">{order.paymentMethod}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, myOrders, purchasedProjectIds, downloadProjectKit } = useAuth();
  const { projects } = useProjects();

  const purchasedProjects = projects.filter((p) => purchasedProjectIds.includes(p.id));
  const recentOrders = myOrders.slice(0, 3);

  // Total spent calculation
  const totalInvested = myOrders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Student Portal Overview
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.fullName || 'Rahul'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enrolled at <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.collegeName || 'Vellore Institute of Technology'}</span> · Final Year B.Tech
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Explore More Kits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Kits Owned</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {purchasedProjects.length}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">All downloads permanently active</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders Placed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {myOrders.length}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Delivery Completed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Invested</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            ₹{totalInvested.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Institutional student rate</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">IEEE Reports</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {purchasedProjects.length * 2} Docs
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Word & PDF formats unlocked</p>
        </div>
      </div>

      {/* Recently Purchased Projects & Instant Downloads */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Active Project Kits & Source Downloads
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct access to annotated repositories, SQL schemas, and viva documentation.
            </p>
          </div>
          <Link
            to="/dashboard/purchases"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
                className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.primaryLanguage}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{project.academicYear}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {project.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                    Stack: {project.techStack.join(' · ')}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link
                    to={`/projects/${project.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <span>Guide</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>

                  <button
                    onClick={() => downloadProjectKit(project, 'Source ZIP')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source (.zip)</span>
                  </button>

                  <button
                    onClick={() => downloadProjectKit(project, 'IEEE Report')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
            >
              Browse Engineering Kits
            </Link>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Order History</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track receipts and payment confirmation references.</p>
          </div>
          <Link
            to="/dashboard/orders"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-semibold">Order ID</th>
                <th className="py-2.5 font-semibold">Project</th>
                <th className="py-2.5 font-semibold">Date</th>
                <th className="py-2.5 font-semibold">Payment</th>
                <th className="py-2.5 font-semibold text-right">Amount</th>
                <th className="py-2.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono text-slate-700 dark:text-slate-300 font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                    {order.projectTitle}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 font-mono tabular-nums">{order.date}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{order.paymentMethod}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
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

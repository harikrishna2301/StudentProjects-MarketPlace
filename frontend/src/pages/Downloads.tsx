import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import {
  Download,
  FileCode2,
  FileText,
  Database,
  HelpCircle,
  Presentation,
  CheckCircle2,
  FolderArchive,
  ArrowRight,
  Clock,
  ShieldCheck,
  RotateCcw,
  Key,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DownloadLog {
  id: string;
  projectTitle: string;
  assetName: string;
  format: string;
  fileSize: string;
  timestamp: string;
  token: string;
  status: 'Verified' | 'Completed';
}

export const Downloads: React.FC = () => {
  const { purchasedProjectIds, downloadProjectKit } = useAuth();
  const { projects } = useProjects();

  const [activeTab, setActiveTab] = useState<'assets' | 'history'>('assets');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Simulated download history log
  const [downloadHistory, setDownloadHistory] = useState<DownloadLog[]>([
    {
      id: 'dl-log-01',
      projectTitle: 'Online Job Portal & Recruitment System',
      assetName: 'Complete Source Codebase (.zip)',
      format: 'ZIP (Maven / NPM)',
      fileSize: '14.8 MB',
      timestamp: '2026-02-18 14:32:10',
      token: 'pk_dl_jobportal_98a72',
      status: 'Verified',
    },
    {
      id: 'dl-log-02',
      projectTitle: 'Online Job Portal & Recruitment System',
      assetName: 'IEEE 830 Project Report (.docx)',
      format: 'DOCX & PDF (85 Pgs)',
      fileSize: '4.2 MB',
      timestamp: '2026-02-18 14:35:44',
      token: 'pk_dl_jobportal_98a72',
      status: 'Verified',
    },
    {
      id: 'dl-log-03',
      projectTitle: 'Enterprise Student Information & Examination System',
      assetName: 'MySQL 3NF Normalized Schema (.sql)',
      format: 'SQL Script',
      fileSize: '480 KB',
      timestamp: '2026-02-22 09:15:20',
      token: 'pk_dl_studenterp_77c12',
      status: 'Completed',
    },
    {
      id: 'dl-log-04',
      projectTitle: 'Enterprise Student Information & Examination System',
      assetName: 'Examiner Viva Voce Q&A Cheat Sheet (.pdf)',
      format: 'PDF Guide (60 Q&As)',
      fileSize: '1.1 MB',
      timestamp: '2026-02-22 09:20:05',
      token: 'pk_dl_studenterp_77c12',
      status: 'Verified',
    },
  ]);

  const purchasedProjects = projects.filter((p) => purchasedProjectIds.includes(p.id));

  // Flatten download assets across purchased projects
  const downloadItems = purchasedProjects.flatMap((project) => [
    {
      id: `${project.id}-source`,
      project,
      title: `${project.title} - Full Source Archive`,
      type: 'source',
      typeLabel: 'Source Code',
      format: 'ZIP (Maven/NPM)',
      fileSize: '14.8 MB',
      icon: FolderArchive,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: `${project.id}-report`,
      project,
      title: `${project.title} - Complete IEEE Project Report`,
      type: 'report',
      typeLabel: 'IEEE Report',
      format: 'DOCX & PDF (85+ Pages)',
      fileSize: '4.2 MB',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: `${project.id}-sql`,
      project,
      title: `${project.title} - MySQL Normalized Database Dump`,
      type: 'database',
      typeLabel: 'Database Script',
      format: 'SQL File',
      fileSize: '480 KB',
      icon: Database,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: `${project.id}-viva`,
      project,
      title: `${project.title} - Examiner Viva Voce Q&A Cheat Sheet`,
      type: 'viva',
      typeLabel: 'Viva Prep',
      format: 'PDF Guide (60 Q&As)',
      fileSize: '1.1 MB',
      icon: HelpCircle,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: `${project.id}-ppt`,
      project,
      title: `${project.title} - Capstone Seminar Slide Deck`,
      type: 'presentation',
      typeLabel: 'Seminar PPT',
      format: 'PPTX (24 Slides)',
      fileSize: '6.5 MB',
      icon: Presentation,
      color: 'text-rose-600 bg-rose-50',
    },
  ]);

  const filteredItems =
    activeFilter === 'all'
      ? downloadItems
      : downloadItems.filter((item) => item.type === activeFilter);

  const handleDownloadAsset = (project: any, typeLabel: string, format: string, size: string) => {
    downloadProjectKit(project, typeLabel);

    // Record new entry into download history
    const newEntry: DownloadLog = {
      id: `dl-log-${Date.now()}`,
      projectTitle: project.title,
      assetName: `${typeLabel} (${format})`,
      format: format,
      fileSize: size,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      token: `pk_dl_${Math.random().toString(36).substring(2, 8)}`,
      status: 'Verified',
    };
    setDownloadHistory((prev) => [newEntry, ...prev]);

    setDownloadSuccessToast(`Started download: ${project.title} - ${typeLabel}`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-[#1A2846] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
            Downloads & Download History
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
            Access verified source codebundles, IEEE documentation, database dumps, and audit your past download history.
          </p>
        </div>

        {/* View Switcher: Available Assets vs Download History */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'assets'
                ? 'bg-white dark:bg-[#0B1329] text-slate-900 dark:text-[#F8FAFC] shadow-xs border border-slate-200 dark:border-[#1A2846]'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
            }`}
          >
            Available Assets ({downloadItems.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-[#0B1329] text-slate-900 dark:text-[#F8FAFC] shadow-xs border border-slate-200 dark:border-[#1A2846]'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
            }`}
          >
            Download History ({downloadHistory.length})
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {downloadSuccessToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {purchasedProjects.length > 0 ? (
        <>
          {/* TAB 1: AVAILABLE KIT ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              {/* Filter tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg max-w-xl overflow-x-auto">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  All Deliverables ({downloadItems.length})
                </button>
                <button
                  onClick={() => setActiveFilter('source')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'source'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Source Code
                </button>
                <button
                  onClick={() => setActiveFilter('report')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'report'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  IEEE Reports
                </button>
                <button
                  onClick={() => setActiveFilter('database')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'database'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Database Dumps
                </button>
                <button
                  onClick={() => setActiveFilter('viva')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === 'viva'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Viva Guides
                </button>
              </div>

              {/* Downloads List */}
              <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs divide-y divide-slate-100 dark:divide-[#1A2846] transition-colors">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-[#101C38]/40 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color} dark:bg-opacity-20`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#9AA6C7]">
                            <span className="font-semibold text-[#2F4BFF] dark:text-[#5B7BFF]">{item.typeLabel}</span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-[#1A2846]">·</span>
                            <span>{item.project.title}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">{item.title}</h4>
                          <div className="text-[11px] text-slate-400 dark:text-[#94A3B8] font-mono">
                            {item.format} · Size: {item.fileSize}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() =>
                            handleDownloadAsset(
                              item.project,
                              item.typeLabel,
                              item.format,
                              item.fileSize
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Asset</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs overflow-hidden transition-colors">
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1A2846] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">Download Audit Trail</h3>
                  <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                    Timestamped record of all academic packages unlocked and downloaded by your student account.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-[#94A3B8]">
                  {downloadHistory.length} Total Downloads
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#080E20] border-b border-slate-200 dark:border-[#1A2846] text-slate-500 dark:text-[#94A3B8] uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 font-semibold">Timestamp</th>
                      <th className="py-3 px-4 font-semibold">Asset File</th>
                      <th className="py-3 px-4 font-semibold">Project Kit</th>
                      <th className="py-3 px-4 font-semibold">Size</th>
                      <th className="py-3 px-4 font-semibold">Token Reference</th>
                      <th className="py-3 px-4 font-semibold text-center">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1A2846]">
                    {downloadHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-[#101C38]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-[#94A3B8] tabular-nums">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-[#F8FAFC]">
                          {log.assetName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-[#CBD5E1] max-w-xs truncate">
                          {log.projectTitle}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-[#94A3B8]">{log.fileSize}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 dark:text-[#94A3B8] text-[11px]">
                          {log.token}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{log.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              const proj = projects.find((p) => p.title === log.projectTitle) || projects[0];
                              downloadProjectKit(proj, log.assetName);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded text-xs transition-colors font-medium"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Re-download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">No kits downloaded yet.</p>
          <Link
            to="/projects"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
          >
            Explore Project Kits
          </Link>
        </div>
      )}
    </div>
  );
};

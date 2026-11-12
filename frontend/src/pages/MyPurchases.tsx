import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import {
  Download,
  FileText,
  ExternalLink,
  Key,
  Database,
  HelpCircle,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';

export const MyPurchases: React.FC = () => {
  const { purchasedProjectIds, downloadProjectKit } = useAuth();
  const { projects } = useProjects();

  const purchasedProjects = projects.filter((p) => purchasedProjectIds.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          My Purchased Project Kits
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Full academic licenses, source repositories, documentation files, and examiner viva guides.
        </p>
      </div>

      {purchasedProjects.length > 0 ? (
        <div className="space-y-6">
          {purchasedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs p-6 space-y-5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#1A2846]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9AA6C7] mb-1">
                    <span className="font-semibold text-[#2F4BFF] dark:text-[#5B7BFF]">{project.category}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
                    <span className="text-slate-700 dark:text-[#CBD5E1]">{project.primaryLanguage}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-[#25335F]">·</span>
                    <span className="tabular-nums font-mono text-slate-500 dark:text-[#9AA6C7]">Academic Year {project.academicYear}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#E8ECFA]">{project.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] font-mono text-[11px] text-slate-600 dark:text-[#CBD5E1] flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-slate-400 dark:text-[#9AA6C7]" />
                    <span>LIC-PK-{project.id.toUpperCase()}-2026</span>
                  </div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="p-1.5 text-slate-500 dark:text-[#9AA6C7] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] rounded-lg"
                    title="View Full Spec"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Download Assets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => downloadProjectKit(project, 'Source Bundle')}
                  className="pk-card-3d p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-[#16224A] hover:bg-blue-100/60 dark:hover:bg-[#1E2E5D] transition-colors text-left flex items-start justify-between group shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <FolderArchive className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                      <span>Source Code (.zip)</span>
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-[#9AA6C7]">Annotated & tested</div>
                  </div>
                  <Download className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF] group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => downloadProjectKit(project, 'IEEE Report')}
                  className="pk-card-3d p-3.5 rounded-xl border border-slate-200 dark:border-[#25335F] bg-slate-50/70 dark:bg-[#16224A] hover:bg-slate-100 dark:hover:bg-[#1E2E5D] transition-colors text-left flex items-start justify-between group shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-[#E8ECFA] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>IEEE Report (.docx)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">80+ Page university format</div>
                  </div>
                  <Download className="w-4 h-4 text-slate-500 dark:text-[#9AA6C7] group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => downloadProjectKit(project, 'MySQL Database Dump')}
                  className="pk-card-3d p-3.5 rounded-xl border border-slate-200 dark:border-[#25335F] bg-slate-50/70 dark:bg-[#16224A] hover:bg-slate-100 dark:hover:bg-[#1E2E5D] transition-colors text-left flex items-start justify-between group shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-[#E8ECFA] flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Database (.sql)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">Schema + 50 sample rows</div>
                  </div>
                  <Download className="w-4 h-4 text-slate-500 dark:text-[#9AA6C7] group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => downloadProjectKit(project, 'Viva Voce Q&A')}
                  className="pk-card-3d p-3.5 rounded-xl border border-slate-200 dark:border-[#25335F] bg-slate-50/70 dark:bg-[#16224A] hover:bg-slate-100 dark:hover:bg-[#1E2E5D] transition-colors text-left flex items-start justify-between group shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-[#E8ECFA] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Viva Voce (.pdf)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#9AA6C7]">60+ Examiner questions</div>
                  </div>
                  <Download className="w-4 h-4 text-slate-500 dark:text-[#9AA6C7] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Quick Setup Hint */}
              <div className="p-3 rounded-xl bg-slate-900 text-white text-xs font-mono flex items-center justify-between border border-slate-800">
                <span className="text-slate-300 truncate">
                  $ {project.installationSteps[0]?.codeCommand || 'mvn clean install'}
                </span>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline text-[11px] font-sans font-semibold ml-3 shrink-0 flex items-center gap-1"
                >
                  <span>All Setup Commands</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] p-12 text-center max-w-lg mx-auto shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] mb-1">
            You haven't purchased any project kits yet.
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mb-6">
            Explore our curated catalog of final year projects with complete source code, reports, and documentation.
          </p>
          <Link
            to="/projects"
            className="px-4 py-2 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors inline-block"
          >
            Explore Projects
          </Link>
        </div>
      )}
    </div>
  );
};

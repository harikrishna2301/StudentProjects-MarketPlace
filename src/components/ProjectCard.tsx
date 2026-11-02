import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { ProjectIllustration } from './ProjectIllustration';
import { Star, ArrowRight, Download, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { purchasedProjectIds } = useAuth();
  const isPurchased = purchasedProjectIds.includes(project.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Top illustration container with strict uniform aspect ratio */}
      <Link
        to={`/projects/${project.id}`}
        className="block relative overflow-hidden bg-slate-900 aspect-[16/10] w-full"
      >
        <ProjectIllustration
          category={project.category}
          primaryLanguage={project.primaryLanguage}
          techStack={project.techStack}
          title={project.title}
          aspect="16:10"
          className="w-full h-full"
        />
        {isPurchased && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 z-20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Owned Kit</span>
          </div>
        )}
      </Link>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-blue-600 truncate">{project.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">{project.primaryLanguage}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">{project.academicYear}</span>
          </div>

          {/* Project Title with uniform 2-line height */}
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
              {project.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {project.shortDescription}
          </p>

          {/* Tech stack inline text tags with clean typographic formatting */}
          <div className="text-[11px] text-slate-500 truncate font-mono bg-slate-50 border border-slate-100 rounded-md px-2 py-1 mb-3">
            {project.techStack.slice(0, 4).join(' / ')}
          </div>

          {/* Verified Kit Features Checklist */}
          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="truncate">80p IEEE Report</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="truncate">MySQL 3NF Schema</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="truncate">60+ Viva Voce Q&A</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="truncate">Seminar PPT Deck</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action row aligned strictly to bottom */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                ₹{project.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                ₹{project.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
              <div className="flex items-center">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-mono tabular-nums ml-1 font-semibold text-slate-800">{project.rating}</span>
              </div>
              <span className="text-slate-400">({project.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/projects/${project.id}`}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
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

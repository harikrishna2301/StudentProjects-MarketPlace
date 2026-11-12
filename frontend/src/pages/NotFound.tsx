import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, FolderKanban, Search, Mail, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead
        title="404 – Page Not Found — ProjectKit"
        description="The page you requested could not be located in our academic projects catalog."
        noIndex={true}
      />
      <div className="max-w-lg w-full text-center space-y-6 bg-white dark:bg-[#1A0D3D] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-[#3A2074] shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center mx-auto shadow-inner">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#6A2FC8] dark:text-[#D1B8FF]">
            404
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F2E9FF]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C5B4E3] leading-relaxed max-w-sm mx-auto">
            The page or project resource you requested does not exist, has been archived, or was moved to another section.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-xs font-semibold shadow-md shadow-[#6A2FC8]/20 transition-all hover:scale-[1.01]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#25134D] hover:bg-slate-200 dark:hover:bg-[#3A2074] text-slate-800 dark:text-[#F2E9FF] text-xs font-semibold transition-all border border-slate-200 dark:border-[#3A2074]"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Browse All Projects</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-[#3A2074] text-[11px] text-slate-500 dark:text-[#C5B4E3]">
          Need immediate assistance?{' '}
          <Link to="/contact" className="text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline font-semibold">
            Contact Academic Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

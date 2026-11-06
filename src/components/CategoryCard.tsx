import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import {
  Globe,
  Coffee,
  BrainCircuit,
  FileCode2,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  Database,
  Cloud,
  Smartphone,
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getIcon = () => {
    switch (category.iconName) {
      case 'Globe':
        return Globe;
      case 'Coffee':
        return Coffee;
      case 'BrainCircuit':
        return BrainCircuit;
      case 'FileCode2':
        return FileCode2;
      case 'Cpu':
        return Cpu;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Sparkles':
        return Sparkles;
      case 'Database':
        return Database;
      case 'Cloud':
        return Cloud;
      case 'Smartphone':
        return Smartphone;
      default:
        return Layers;
    }
  };

  const getBranches = () => {
    switch (category.slug) {
      case 'java-projects':
        return ['Enterprise Java', 'Spring Boot', 'CSE / IT'];
      case 'python-projects':
        return ['Python 3', 'FastAPI', 'Backend'];
      case 'machine-learning':
        return ['Scikit-Learn', 'Predictive', 'AI & DS'];
      case 'artificial-intelligence':
        return ['Deep Learning', 'PyTorch', 'Robotics'];
      case 'web-development':
        return ['React.js', 'REST APIs', 'Frontend'];
      case 'full-stack-development':
        return ['End-to-End', 'MERN / Java', 'CSE'];
      case 'data-science':
        return ['Analytics', 'Pandas', 'Visualization'];
      case 'cloud-computing':
        return ['Docker', 'Microservices', 'DevOps'];
      case 'iot-projects':
        return ['ESP32', 'Embedded', 'ECE / EEE'];
      case 'android-development':
        return ['Kotlin', 'Compose', 'Mobile'];
      default:
        return ['B.Tech Engineering', 'M.Tech'];
    }
  };

  const IconComponent = getIcon();
  const branches = getBranches();

  return (
    <Link
      to={`/projects?category=${encodeURIComponent(category.name)}`}
      className="group relative pk-card-3d bg-white dark:bg-[#0F1830] hover:bg-slate-50 dark:hover:bg-[#16224A] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] hover:border-[#2F4BFF]/80 dark:hover:border-[#5B7BFF] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-[0_12px_30px_-5px_rgba(47,75,255,0.2)] dark:hover:shadow-[0_12px_30px_-5px_rgba(47,75,255,0.3)]"
    >
      {/* Top accent highlight - Royal Blue to Soft Violet */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2F4BFF] to-[#6C5CE7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#070D1F] border border-slate-200 dark:border-[#25335F] group-hover:border-[#2F4BFF]/60 dark:group-hover:border-[#5B7BFF]/60 flex items-center justify-center text-[#2F4BFF] dark:text-[#5B7BFF] group-hover:scale-105 transition-all shadow-inner">
            <IconComponent className="w-6 h-6 transition-colors" />
          </div>

          <span className="text-xs font-mono font-medium text-slate-700 dark:text-[#E8ECFA] bg-slate-100 dark:bg-[#070D1F] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#25335F] tabular-nums">
            {category.projectCount} kits
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA] group-hover:text-[#2F4BFF] dark:group-hover:text-[#5B7BFF] transition-colors mb-2">
          {category.name}
        </h3>

        <p className="text-xs text-slate-600 dark:text-[#9AA6C7] leading-relaxed line-clamp-2 mb-4">
          {category.description}
        </p>

        {/* Academic focus tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {branches.map((b) => (
            <span
              key={b}
              className="text-[10px] font-medium text-slate-700 dark:text-[#CBD5E1] bg-slate-100 dark:bg-[#070D1F] px-2 py-0.5 rounded border border-slate-200/80 dark:border-[#25335F]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200/80 dark:border-[#25335F] flex items-center justify-between text-xs font-semibold text-[#2F4BFF] dark:text-[#5B7BFF] group-hover:text-[#1E36D6] dark:group-hover:text-[#7C95FF] transition-colors">
        <span>Explore Category</span>
        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};


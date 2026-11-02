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
      default:
        return Layers;
    }
  };

  const getBranches = () => {
    switch (category.slug) {
      case 'web-development':
        return ['CSE', 'IT', 'Software Eng'];
      case 'java-spring-boot':
        return ['Enterprise', 'CSE', 'Distributed Sys'];
      case 'ai-machine-learning':
        return ['AI & DS', 'CSE', 'Robotics'];
      case 'python-data-science':
        return ['Data Science', 'IT', 'Analytics'];
      case 'iot-embedded':
        return ['ECE', 'EEE', 'IoT & Automation'];
      case 'cybersecurity-cloud':
        return ['Cyber Security', 'Cloud Computing', 'IT'];
      default:
        return ['B.Tech Engineering', 'M.Tech'];
    }
  };

  const IconComponent = getIcon();
  const branches = getBranches();

  return (
    <Link
      to={`/projects?category=${encodeURIComponent(category.name)}`}
      className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-blue-600 transition-colors" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <IconComponent className="w-6 h-6" />
          </div>

          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 tabular-nums">
            {category.projectCount} kits
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
          {category.name}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {category.description}
        </p>

        {/* Academic Branches tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {branches.map((b) => (
            <span
              key={b}
              className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
        <span>Browse Domain Kits</span>
        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

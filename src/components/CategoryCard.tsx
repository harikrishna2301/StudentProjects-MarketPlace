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
      className="group relative category-card-beam-container flex flex-col justify-between"
    >
      {/* Animated Purple Palette Perimeter Beam */}
      <div className="category-card-beam-spinner" aria-hidden="true" />

      {/* Main Card Surface (Masks center of beam to reveal only the perimeter border) */}
      <div className="relative z-10 w-full h-full bg-white dark:bg-[#1A0D3D] hover:bg-[#FAF7FD] dark:hover:bg-[#25134D] p-6 rounded-[15px] flex flex-col justify-between transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] border border-[#D1B8FF]/60 dark:border-[#3A2074] group-hover:border-[#9D71E8] flex items-center justify-center text-[#6A2FC8] dark:text-[#D1B8FF] transition-colors duration-200 shadow-inner">
              <IconComponent className="w-6 h-6 transition-colors duration-200" />
            </div>

            <span className="text-xs font-mono font-medium text-[#25134D] dark:text-[#F2E9FF] bg-[#F2E9FF] dark:bg-[#0B0720] px-2.5 py-1 rounded-lg border border-[#D1B8FF]/60 dark:border-[#3A2074] tabular-nums">
              {category.projectCount} kits
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0B0720] dark:text-[#F2E9FF] group-hover:text-[#6A2FC8] dark:group-hover:text-[#D1B8FF] transition-colors duration-200 mb-2">
            {category.name}
          </h3>

          <p className="text-xs text-[#4E4166] dark:text-[#D1B8FF]/80 leading-relaxed line-clamp-2 mb-4">
            {category.description}
          </p>

          {/* Academic focus tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {branches.map((b) => (
              <span
                key={b}
                className="text-[10px] font-medium text-[#25134D] dark:text-[#D1B8FF] bg-[#F2E9FF] dark:bg-[#0B0720] px-2 py-0.5 rounded border border-[#D1B8FF]/50 dark:border-[#3A2074]"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8DEFF] dark:border-[#3A2074] flex items-center justify-between text-xs font-semibold text-[#6A2FC8] dark:text-[#9D71E8] transition-colors duration-200">
          <span>Explore Category</span>
          <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
};


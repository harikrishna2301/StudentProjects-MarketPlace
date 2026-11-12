import React from 'react';
import {
  Briefcase,
  Server,
  Brain,
  Cpu,
  Shield,
  Layers,
  Terminal,
  Smartphone,
} from 'lucide-react';

interface ProjectIllustrationProps {
  category: string;
  primaryLanguage?: string;
  techStack?: string[];
  title: string;
  aspect?: '4:3' | '16:9' | '16:10' | 'banner';
  className?: string;
  imageUrl?: string;
}

export const ProjectIllustration: React.FC<ProjectIllustrationProps> = ({
  category,
  title,
  aspect = '16:9',
  className = '',
  imageUrl,
}) => {
  const getCategoryIcon = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('web')) return Briefcase;
    if (c.includes('java') || c.includes('spring') || c.includes('server')) return Server;
    if (c.includes('ai') || c.includes('machine learning') || c.includes('deep learning')) return Brain;
    if (c.includes('iot') || c.includes('embedded') || c.includes('hardware') || c.includes('robot')) return Cpu;
    if (c.includes('cyber') || c.includes('security') || c.includes('cloud')) return Shield;
    if (c.includes('python')) return Terminal;
    if (c.includes('mobile') || c.includes('android') || c.includes('flutter')) return Smartphone;
    return Layers;
  };

  const IconComponent = getCategoryIcon(category);

  const aspectClass =
    aspect === '16:9'
      ? 'aspect-[16/9]'
      : aspect === 'banner'
      ? 'h-64 sm:h-80 w-full'
      : aspect === '4:3'
      ? 'aspect-[4/3]'
      : 'aspect-[16/10]';

  // If real screenshot/cover image exists, display clean lazy-loaded image
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden w-full ${aspectClass} ${className} bg-[#0B1B3F]`}>
        <img
          src={imageUrl}
          alt={`${title} project preview`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Premium navy gradient panel with subtle dot pattern and large centered category icon
  return (
    <div
      className={`relative overflow-hidden w-full ${aspectClass} ${className} bg-gradient-to-br from-[#0B1B3F] to-[#16224A] flex flex-col items-center justify-center p-4 sm:p-5 text-white select-none`}
    >
      {/* Subtle blueprint dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Centered Large Category Icon */}
      <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center justify-center text-white shadow-lg mb-2.5">
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>

      {/* Project Title Below Icon in Pure White */}
      <div className="relative z-10 text-center px-3 max-w-[90%]">
        <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug drop-shadow-xs">
          {title}
        </p>
      </div>
    </div>
  );
};

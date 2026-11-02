import React from 'react';
import {
  Code,
  Terminal,
  Cpu,
  Database,
  Shield,
  Activity,
  Server,
  Briefcase,
  GitBranch,
  Layers,
  FileText,
} from 'lucide-react';

interface ProjectIllustrationProps {
  category: string;
  primaryLanguage: string;
  techStack: string[];
  title: string;
  aspect?: '4:3' | '16:9' | '16:10' | 'banner';
  className?: string;
}

export const ProjectIllustration: React.FC<ProjectIllustrationProps> = ({
  category,
  primaryLanguage,
  techStack,
  title,
  aspect = '16:10',
  className = '',
}) => {
  const getTheme = () => {
    switch (category) {
      case 'Web Development':
        return {
          bg: 'bg-slate-900',
          accent: 'text-blue-400',
          accentBg: 'bg-blue-500/10',
          border: 'border-slate-800',
          chipBg: 'bg-blue-900/30 text-blue-300 border-blue-800/50',
          icon: Briefcase,
          label: 'Full-Stack Web App',
          codeLine: 'export default defineApp({ framework: "react" });',
        };
      case 'Java & Spring Boot':
        return {
          bg: 'bg-slate-900',
          accent: 'text-amber-400',
          accentBg: 'bg-amber-500/10',
          border: 'border-slate-800',
          chipBg: 'bg-amber-900/30 text-amber-300 border-amber-800/50',
          icon: Server,
          label: 'Spring Boot 3 Enterprise',
          codeLine: '@SpringBootApplication public class Application {}',
        };
      case 'AI & Machine Learning':
        return {
          bg: 'bg-slate-900',
          accent: 'text-purple-400',
          accentBg: 'bg-purple-500/10',
          border: 'border-slate-800',
          chipBg: 'bg-purple-900/30 text-purple-300 border-purple-800/50',
          icon: Cpu,
          label: 'ML Pipeline & Computer Vision',
          codeLine: 'model = pipeline("classification", model=bert_model)',
        };
      case 'IoT & Embedded':
        return {
          bg: 'bg-slate-900',
          accent: 'text-orange-400',
          accentBg: 'bg-orange-500/10',
          border: 'border-slate-800',
          chipBg: 'bg-orange-900/30 text-orange-300 border-orange-800/50',
          icon: Activity,
          label: 'ESP32 IoT Telemetry',
          codeLine: 'client.publish("telemetry/soil", payload=sensor_val)',
        };
      case 'Cybersecurity & Cloud':
        return {
          bg: 'bg-slate-900',
          accent: 'text-cyan-400',
          accentBg: 'bg-cyan-500/10',
          border: 'border-slate-800',
          chipBg: 'bg-cyan-900/30 text-cyan-300 border-cyan-800/50',
          icon: Shield,
          label: 'Cryptography & Smart Contracts',
          codeLine: 'function verifyCredential(bytes32 hash) public view',
        };
      default:
        return {
          bg: 'bg-slate-900',
          accent: 'text-emerald-400',
          accentBg: 'bg-emerald-500/10',
          border: 'border-slate-800',
          chipBg: 'bg-emerald-900/30 text-emerald-300 border-emerald-800/50',
          icon: Code,
          label: 'Academic Engineering Kit',
          codeLine: 'mvn clean install && mvn test --coverage',
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  const aspectClass =
    aspect === '16:9'
      ? 'aspect-[16/9]'
      : aspect === 'banner'
      ? 'h-64 sm:h-80 w-full'
      : aspect === '4:3'
      ? 'aspect-[4/3]'
      : 'aspect-[16/10]';

  return (
    <div
      className={`relative overflow-hidden ${theme.border} ${theme.bg} ${aspectClass} ${className} flex flex-col justify-between p-4 sm:p-5 text-white select-none transition-transform group-hover:scale-[1.01] duration-200`}
    >
      {/* Blueprint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top window control bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/90 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-700" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 pl-1 font-medium">
            {primaryLanguage.toLowerCase()}-runtime
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Verified Build</span>
        </div>
      </div>

      {/* Center diagram visualization */}
      <div className="relative z-10 my-auto py-1.5 space-y-2.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${theme.accentBg} border border-slate-700/60 flex items-center justify-center shrink-0`}
          >
            <IconComponent className={`w-5 h-5 ${theme.accent}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold truncate">
              {theme.label}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
              {title}
            </h4>
          </div>
        </div>

        {/* Realistic code preview terminal */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 font-mono text-[10px] text-slate-300 leading-relaxed overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[9px] mb-1">
            <span className="flex items-center gap-1">
              <GitBranch className="w-2.5 h-2.5 text-blue-400" />
              <span>spec/architecture.yml</span>
            </span>
            <span className="text-slate-400">IEEE 830</span>
          </div>
          <div className="text-blue-300 truncate font-mono">
            {theme.codeLine}
          </div>
        </div>
      </div>

      {/* Bottom technical specs line */}
      <div className="relative z-10 pt-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate pr-2">
          <Database className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{techStack.slice(0, 3).join(' · ')}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-300 font-mono text-[9px] shrink-0 bg-slate-800/70 px-2 py-0.5 rounded">
          <FileText className="w-2.5 h-2.5 text-blue-400" />
          <span>80+ Pgs</span>
        </div>
      </div>
    </div>
  );
};

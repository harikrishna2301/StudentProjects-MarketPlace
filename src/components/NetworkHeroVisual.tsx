import React from 'react';
import {
  FolderCode,
  FileCheck2,
  BookOpen,
  Layers,
  Sparkles,
  Terminal,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface NetworkHeroVisualProps {
  onExploreClick?: () => void;
}

export const NetworkHeroVisual: React.FC<NetworkHeroVisualProps> = ({ onExploreClick }) => {
  return (
    <div className="relative w-full aspect-[16/11] max-w-2xl mx-auto flex items-center justify-center select-none overflow-visible">
      {/* Background Soft Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2F4BFF]/25 via-[#6C5CE7]/15 to-transparent rounded-3xl filter blur-3xl -z-10 pointer-events-none" />

      {/* SVG Network Canvas with Geodesic Lines, Worldwide Map & Glowing Nodes */}
      <div className="relative w-full h-full rounded-2xl bg-[#070D1F] border border-[#25335F] overflow-hidden shadow-[0_20px_50px_rgba(7,13,31,0.95)]">
        {/* Reference Image Blend Layer */}
        <div
          className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none transition-opacity"
          style={{
            backgroundImage: 'url(/assets/aistudio/Screenshot_20261103_231844_3861bbba.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(125%) brightness(90%) hue-rotate(200deg)',
          }}
        />

        {/* Ambient Dark Navy Gradient Overlays to seamlessly blend edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1F] via-transparent to-[#070D1F]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D1F]/70 via-transparent to-[#070D1F]/70 pointer-events-none" />

        {/* Interactive Glowing Constellation SVG Overlay */}
        <svg
          viewBox="0 0 600 400"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="netLineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F4BFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="netLineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5B7BFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8C7CFF" stopOpacity="0.4" />
            </linearGradient>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#5B7BFF" floodOpacity="0.95" />
            </filter>
            <filter id="sapphireGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2F4BFF" floodOpacity="1" />
            </filter>
            <filter id="centerFlare" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Central Radiant Glow Flare */}
          <circle cx="300" cy="210" r="45" fill="#2F4BFF" opacity="0.2" filter="url(#centerFlare)" />

          {/* Interconnected Network Lines */}
          <g strokeWidth="1.4" opacity="0.75">
            {/* Main Spine Lines */}
            <path d="M70 200 L160 140 L280 180 L390 120 L510 170" stroke="url(#netLineGrad1)" />
            <path d="M160 140 L230 260 L330 290 L440 220 L510 170" stroke="url(#netLineGrad2)" />
            <path d="M280 180 L330 290 L390 120" stroke="url(#netLineGrad1)" />
            <path d="M70 200 L130 280 L230 260" stroke="url(#netLineGrad2)" />
            <path d="M390 120 L480 90 L550 140 L510 170" stroke="url(#netLineGrad1)" />
            <path d="M160 140 L190 80 L310 90 L390 120" stroke="url(#netLineGrad2)" />
            <path d="M330 290 L420 330 L490 280 L440 220" stroke="url(#netLineGrad1)" />

            {/* Finer cross-mesh lines */}
            <path d="M190 80 L280 180 L130 280" stroke="#5B7BFF" strokeOpacity="0.4" strokeDasharray="3 3" />
            <path d="M310 90 L440 220" stroke="#6C5CE7" strokeOpacity="0.35" strokeDasharray="4 4" />
            <path d="M230 260 L390 120" stroke="#8C7CFF" strokeOpacity="0.4" strokeDasharray="2 3" />
            <path d="M480 90 L440 220 L550 250" stroke="#2F4BFF" strokeOpacity="0.35" />
          </g>

          {/* Glowing Network Constellation Nodes with Halos */}
          {/* Node 1 */}
          <circle cx="160" cy="140" r="5" fill="#5B7BFF" filter="url(#nodeGlow)" />
          <circle cx="160" cy="140" r="2" fill="#FFFFFF" />

          {/* Node 2 */}
          <circle cx="280" cy="180" r="5.5" fill="#2F4BFF" filter="url(#sapphireGlow)" />
          <circle cx="280" cy="180" r="2" fill="#FFFFFF" />

          {/* Node 3: Center Dominant Hub */}
          <circle cx="390" cy="120" r="7" fill="#5B7BFF" filter="url(#nodeGlow)" />
          <circle cx="390" cy="120" r="12" stroke="#5B7BFF" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="390" cy="120" r="2.5" fill="#FFFFFF" />

          {/* Node 4 */}
          <circle cx="510" cy="170" r="5" fill="#6C5CE7" filter="url(#nodeGlow)" />
          <circle cx="510" cy="170" r="2" fill="#FFFFFF" />

          {/* Secondary Nodes */}
          <circle cx="70" cy="200" r="3.5" fill="#5B7BFF" opacity="0.85" />
          <circle cx="130" cy="280" r="3.5" fill="#2F4BFF" opacity="0.85" />
          <circle cx="230" cy="260" r="4.5" fill="#6C5CE7" filter="url(#nodeGlow)" />
          <circle cx="330" cy="290" r="4.5" fill="#5B7BFF" opacity="0.9" />
          <circle cx="440" cy="220" r="5" fill="#2F4BFF" filter="url(#sapphireGlow)" />
          <circle cx="190" cy="80" r="3.5" fill="#5B7BFF" opacity="0.85" />
          <circle cx="310" cy="90" r="4" fill="#8C7CFF" opacity="0.85" />
          <circle cx="480" cy="90" r="4" fill="#5B7BFF" opacity="0.85" />
          <circle cx="420" cy="330" r="3.5" fill="#6C5CE7" opacity="0.8" />
          <circle cx="490" cy="280" r="4" fill="#5B7BFF" opacity="0.85" />
        </svg>

        {/* Center Codebase Blueprint Window */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 bg-[#0F1830]/95 backdrop-blur-md rounded-xl border border-[#25335F] p-4 shadow-[0_15px_40px_rgba(7,13,31,0.85)] space-y-3">
          <div className="flex items-center justify-between border-b border-[#25335F] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              <span className="text-[11px] font-mono text-[#E8ECFA] ml-1 font-semibold">ProjectKit.bundle</span>
            </div>
            <span className="text-[10px] font-mono text-[#5B7BFF] bg-[#16224A] px-2 py-0.5 rounded border border-[#25335F]">
              Verified IEEE
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-[#9AA6C7]">
              <span className="text-[#5B7BFF]">src/main/java/</span>
              <span className="text-[#E8ECFA]">Clean Architecture</span>
            </div>
            <div className="flex items-center justify-between text-[#9AA6C7]">
              <span className="text-[#6C5CE7]">docs/ieee_report.docx</span>
              <span className="text-[#E8ECFA]">85+ Pages</span>
            </div>
            <div className="flex items-center justify-between text-[#9AA6C7]">
              <span className="text-[#2F4BFF]">schema/projectkit.sql</span>
              <span className="text-[#E8ECFA]">MySQL 8 DDL/DML</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#25335F] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Source & Reports</span>
            </div>
            <span className="text-[10px] font-mono text-[#9AA6C7]">JDK 17 + Python 3.11</span>
          </div>
        </div>
      </div>

      {/* Floating Card 1: 500+ Project Ideas (Top Left) */}
      <div className="absolute -top-4 -left-3 sm:-left-6 bg-white/95 dark:bg-[#0F1830]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-[#25335F] shadow-lg shadow-indigo-950/10 dark:shadow-[0_10px_25px_rgba(7,13,31,0.7)] flex items-center gap-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#16224A] border border-blue-200 dark:border-[#2F4BFF]/50 flex items-center justify-center text-[#2F4BFF] dark:text-[#5B7BFF]">
          <FolderCode className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">500+ Project Ideas</div>
          <div className="text-[10px] text-slate-600 dark:text-[#9AA6C7]">Curated Academic Catalog</div>
        </div>
      </div>

      {/* Floating Card 2: Multiple Technology Categories (Top Right) */}
      <div className="absolute -top-3 -right-3 sm:-right-6 bg-white/95 dark:bg-[#0F1830]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-[#25335F] shadow-lg shadow-indigo-950/10 dark:shadow-[0_10px_25px_rgba(7,13,31,0.7)] flex items-center gap-3 transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#16224A] border border-violet-200 dark:border-[#6C5CE7]/50 flex items-center justify-center text-[#6C5CE7] dark:text-[#8C7CFF]">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">10 Tech Categories</div>
          <div className="text-[10px] text-slate-600 dark:text-[#9AA6C7]">Java, Python, AI, Web, Cloud</div>
        </div>
      </div>

      {/* Floating Card 3: Source Code and Documentation (Bottom Left) */}
      <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-white/95 dark:bg-[#0F1830]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-[#25335F] shadow-lg shadow-indigo-950/10 dark:shadow-[0_10px_25px_rgba(7,13,31,0.7)] flex items-center gap-3 transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#16224A] border border-blue-200 dark:border-[#2F4BFF]/50 flex items-center justify-center text-[#2F4BFF] dark:text-[#5B7BFF]">
          <FileCheck2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">Code & Documentation</div>
          <div className="text-[10px] text-slate-600 dark:text-[#9AA6C7]">IEEE Report, UML & Viva Q&A</div>
        </div>
      </div>

      {/* Floating Card 4: Student-Friendly Learning Resources (Bottom Right) */}
      <div className="absolute -bottom-4 -right-3 sm:-right-5 bg-white/95 dark:bg-[#0F1830]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-[#25335F] shadow-lg shadow-indigo-950/10 dark:shadow-[0_10px_25px_rgba(7,13,31,0.7)] flex items-center gap-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#16224A] border border-violet-200 dark:border-[#6C5CE7]/50 flex items-center justify-center text-[#6C5CE7] dark:text-[#8C7CFF]">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">Student-Friendly</div>
          <div className="text-[10px] text-slate-600 dark:text-[#9AA6C7]">Setup Guides & Viva Voce Prep</div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHeroVisual;

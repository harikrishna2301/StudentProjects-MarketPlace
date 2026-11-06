import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'stacked';
  tagline?: boolean | string;
  className?: string;
  to?: string;
  onClick?: () => void;
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  tagline = false,
  className = '',
  to = '/',
  onClick,
  lightText = false,
}) => {
  // Dimension mappings
  const dimensions = {
    xs: { icon: 24, text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 30, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 60, text: 'text-3xl', sub: 'text-sm' },
  }[size];

  // SVG Geometric Icon: Graduation cap + Laptop with </> coding brackets + Book wings + Golden tassel
  const IconMark = (
    <div
      style={{ width: dimensions.icon, height: dimensions.icon }}
      className="relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(59,130,246,0.35)]"
      >
        <defs>
          {/* Royal Blue to Soft Violet Gradient */}
          <linearGradient id="pk-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F4BFF" />
            <stop offset="60%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>

          {/* Deep Navy Surface Gradient */}
          <linearGradient id="pk-surface-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#16224A" />
            <stop offset="100%" stopColor="#0B1B3F" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="pk-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2F4BFF" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Foundation Book/Wings Base */}
        <path
          d="M18 78C30 73 42 76 50 82C58 76 70 73 82 78C82 82 70 77 50 86C30 77 18 82 18 78Z"
          fill="#4F46E5"
          opacity="0.85"
        />
        <path
          d="M14 74C28 68 40 71 50 78C60 71 72 68 86 74C86 77 72 72 50 81C28 72 14 77 14 74Z"
          fill="url(#pk-primary-grad)"
        />

        {/* Laptop Base & Keyboard Shelf */}
        <path
          d="M26 68L74 68C76 68 78 70 77 72L73 76C72 77 70 78 68 78L32 78C30 78 28 77 27 76L23 72C22 70 24 68 26 68Z"
          fill="#0B1B3F"
          stroke="#2F4BFF"
          strokeWidth="1.5"
        />

        {/* Laptop Screen Body */}
        <rect
          x="28"
          y="38"
          width="44"
          height="28"
          rx="3.5"
          fill="url(#pk-surface-grad)"
          stroke="#4F46E5"
          strokeWidth="1.8"
        />

        {/* Illuminated Screen Center */}
        <rect
          x="31"
          y="41"
          width="38"
          height="22"
          rx="2"
          fill="#070D1F"
        />

        {/* </> Code Symbol on Screen */}
        <path
          d="M44 48L39 52L44 56"
          stroke="#8C7CFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56 48L61 52L56 56"
          stroke="#8C7CFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M52 47L48 57"
          stroke="#5B7BFF"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Graduation Cap Mortarboard Top */}
        <polygon
          points="50,14 84,27 50,38 16,27"
          fill="url(#pk-primary-grad)"
          filter="url(#pk-glow)"
        />
        {/* Cap skull cap under rim */}
        <path
          d="M28 31V40C28 45.5 37.8 50 50 50C62.2 50 72 45.5 72 40V31"
          fill="none"
          stroke="#2F4BFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Golden Tassel Button & Cord */}
        <circle cx="50" cy="26" r="2.5" fill="#F59E0B" />
        <path
          d="M50 26C65 24 74 34 76 43"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tassel Fringe */}
        <rect x="74" y="42" width="4.5" height="7" rx="1.5" fill="#F59E0B" />
      </svg>
    </div>
  );

  const defaultTaglineText = typeof tagline === 'string' ? tagline : 'Build. Learn. Launch.';

  // Text Lockup
  const TextContent = (
    <div className={`flex flex-col ${variant === 'stacked' ? 'items-center text-center mt-2' : 'justify-center'}`}>
      <div className={`font-extrabold tracking-tight ${dimensions.text} leading-none flex items-center`}>
        <span className={`${lightText ? 'text-white' : 'text-[#0B1B3F] dark:text-[#E8ECFA]'} transition-colors`}>Project</span>
        <span className="bg-gradient-to-r from-[#2F4BFF] via-[#4F46E5] to-[#6C5CE7] dark:from-[#5B7BFF] dark:to-[#8C7CFF] bg-clip-text text-transparent ml-0.5">
          Kit
        </span>
      </div>
      {tagline && (
        <span className={`${dimensions.sub} font-semibold uppercase tracking-wider ${lightText ? 'text-white/80' : 'text-[#5B6478] dark:text-[#9AA6C7]'} mt-1`}>
          {defaultTaglineText}
        </span>
      )}
    </div>
  );

  const content = (
    <div
      className={`group inline-flex ${
        variant === 'stacked' ? 'flex-col items-center' : 'items-center gap-2.5'
      } select-none ${className}`}
      onClick={onClick}
    >
      {IconMark}
      {variant !== 'icon-only' && TextContent}
    </div>
  );

  if (to && to.trim() !== '') {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

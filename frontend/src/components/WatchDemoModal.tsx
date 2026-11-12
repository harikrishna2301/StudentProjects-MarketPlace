import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Captions,
  Sparkles,
  Clock,
  Check,
  Copy,
  Terminal,
  Database,
  Layers,
  HelpCircle,
  X,
  ChevronRight,
  Download,
  Code2,
  Laptop,
  Radio,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface WatchDemoModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

interface DemoChapter {
  id: number;
  title: string;
  subtitle: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  type: 'terminal' | 'ui' | 'logic' | 'database' | 'viva';
  icon: any;
  narration: string;
}

export const WatchDemoModal: React.FC<WatchDemoModalProps> = ({ project, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { purchasedProjectIds, downloadProjectKit } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isPurchased = purchasedProjectIds.includes(project.id);
  const isWishlisted = isInWishlist(project.id);

  // Focus mode
  const [focusMode, setFocusMode] = useState<'full' | 'backend' | 'viva'>('full');

  // Video playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [enableVoiceNarration, setEnableVoiceNarration] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<any>(null);

  // Generate tailored functional chapters based on the project's tech and category
  const chapters: DemoChapter[] = [
    {
      id: 1,
      title: '01. System Boot & Runtime Initialization',
      subtitle: `${project.primaryLanguage} server boot, dependencies verification & database connection`,
      startTime: 0,
      duration: 35,
      type: 'terminal',
      icon: Terminal,
      narration: `Welcome to the verified walkthrough of ${project.title}. We begin by initializing the runtime environment with ${project.primaryLanguage} and loading required libraries. Notice the database connection pool successfully establishing zero-latency socket connections.`,
    },
    {
      id: 2,
      title: '02. Dual-Role Authentication & Access Control',
      subtitle: 'JWT token lifecycle, role-based dashboard routing & input validation',
      startTime: 35,
      duration: 45,
      type: 'ui',
      icon: Laptop,
      narration: `Next, we demonstrate secure authentication with role-based routing. The system validates credentials, issues cryptographic JSON Web Tokens, and dynamically displays role-tailored dashboards with real-time UI state synchronization.`,
    },
    {
      id: 3,
      title: `03. Core Workflow: ${project.modules[0] || 'Functional Processing'}`,
      subtitle: `Executing core business logic: ${project.features[0]?.title || 'System Operation'}`,
      startTime: 80,
      duration: 55,
      type: 'logic',
      icon: Layers,
      narration: `Now executing the primary academic innovation: ${project.features[0]?.title || 'Core Functional Module'}. Observe automated input verification, transaction dispatch, and real-time response generation without blocking main event loops.`,
    },
    {
      id: 4,
      title: '04. Relational Database & Invariant State',
      subtitle: '3NF normalized schema, foreign key cascade integrity & SQL transaction commits',
      startTime: 135,
      duration: 40,
      type: 'database',
      icon: Database,
      narration: `Inspecting database persistence layer. The normalized schema enforces referential integrity constraints, automated audit timestamps, and indexing optimizations tailored for university viva voce scrutiny.`,
    },
    {
      id: 5,
      title: '05. External Examiner Viva Voce & Defense',
      subtitle: 'Model examiner defense answers, architecture defense & IEEE compliance summary',
      startTime: 175,
      duration: 45,
      type: 'viva',
      icon: HelpCircle,
      narration: `Finally, reviewing capstone defense readiness. We review top external examiner viva questions regarding algorithm complexity, database normalization, and multi-tier decoupled architecture. Ready for 100% defense confidence.`,
    },
  ];

  const totalDuration = chapters.reduce((sum, c) => sum + c.duration, 0); // 220 seconds total

  // Determine active chapter based on currentTime
  const currentChapterIndex = chapters.findIndex((c, i) => {
    const nextChapter = chapters[i + 1];
    return currentTime >= c.startTime && (!nextChapter || currentTime < nextChapter.startTime);
  });

  const currentChapter = chapters[currentChapterIndex >= 0 ? currentChapterIndex : 0];

  // Handle Playback Interval
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return Math.min(prev + 0.25 * playbackRate, totalDuration);
        });
      }, 250);
    } else {
      clearInterval(playIntervalRef.current);
    }

    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, playbackRate, totalDuration, isOpen]);

  // Handle Voice Narration with Web Speech API
  useEffect(() => {
    if (!enableVoiceNarration || !isPlaying || isMuted || typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChapter.narration);
      utterance.rate = playbackRate;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentChapter.id, enableVoiceNarration, isPlaying, isMuted, playbackRate]);

  // Keyboard accessibility (Space to play/pause, Esc to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const target = Math.max(0, Math.min(pos * totalDuration, totalDuration));
    setCurrentTime(target);
  };

  const jumpToChapter = (chapter: DemoChapter) => {
    setCurrentTime(chapter.startTime);
    setIsPlaying(true);
  };

  const handleCopyReproCommands = () => {
    const command = `# ${project.title} Quick Reproduction
git clone https://github.com/projectkit/${project.slug}.git
cd ${project.slug}
${project.installationSteps.map((s) => s.codeCommand).filter(Boolean).join('\n')}`;
    navigator.clipboard.writeText(command);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={videoContainerRef}
        onClick={(e) => e.stopPropagation()}
        className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden text-white my-auto ${
          isFullscreen ? 'h-full max-w-none rounded-none border-none' : 'max-h-[94vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-blue-400 truncate">{project.category}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono text-[11px] truncate">{project.primaryLanguage}</span>
                <span className="text-slate-600">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/80 uppercase tracking-wider hidden sm:inline">
                  AI Synthesized Demo
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {project.title} — Real-World Functional Walkthrough
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Focus mode switchers */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-[11px] border border-slate-700/60">
              <button
                onClick={() => setFocusMode('full')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  focusMode === 'full' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Full End-to-End
              </button>
              <button
                onClick={() => {
                  setFocusMode('backend');
                  jumpToChapter(chapters[2]);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  focusMode === 'backend' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Backend & SQL
              </button>
              <button
                onClick={() => {
                  setFocusMode('viva');
                  jumpToChapter(chapters[4]);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  focusMode === 'viva' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Examiner Viva
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close walkthrough"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Video Stage (Left) + Interactive Chapter Index (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* VIDEO STAGE AREA */}
          <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative select-none">
            {/* Top Video Status Overlay */}
            <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 backdrop-blur-xs z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-200 font-semibold">{currentChapter.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 hidden sm:inline">1080p · 60 FPS</span>
                <span className="text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900/60">
                  {currentChapter.type.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Dynamic Interactive Visual Screen Simulation */}
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative font-mono">
              {/* Background watermark badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none text-8xl font-black">
                {project.primaryLanguage}
              </div>

              {/* SCENE 1: TERMINAL & SYSTEM BOOT */}
              {currentChapter.type === 'terminal' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">bash — dev-server@projectkit:~/{project.slug}</span>
                    </div>
                    <span className="text-emerald-400 text-[11px]">PORT 8080 LISTENING</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 overflow-y-auto py-2">
                    <div className="text-blue-400">$ npm run start:backend || mvn spring-boot:run</div>
                    <div className="text-slate-400">[INFO] Initializing Spring / Express runtime v3.2.4...</div>
                    <div className="text-emerald-400">[SUCCESS] HikariCP Connection Pool: connected to MySQL 8.0</div>
                    <div className="text-slate-400">[DEBUG] Scanning entity mappings for {project.category}...</div>
                    <div className="text-slate-300">
                      [INFO] REST endpoints initialized: /api/v1/auth, /api/v1/projects, /api/v1/execute
                    </div>
                    <div className="text-amber-400">
                      [SECURITY] JWT Secret verification active · HMAC-SHA256 initialized
                    </div>
                    <div className="text-slate-400">[READY] Server started on http://localhost:8080 (384ms)</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Architecture Health: 100% Operational</span>
                    <span className="text-emerald-400 font-bold">Memory: 142 MB / 512 MB</span>
                  </div>
                </div>
              )}

              {/* SCENE 2: DUAL-ROLE AUTHENTICATION & UI WORKFLOW */}
              {currentChapter.type === 'ui' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">Browser Viewport · https://localhost:3000/portal</span>
                    </div>
                    <span className="text-blue-400 font-bold">React 18 Reactive UI</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Current Role</div>
                      <div className="text-xs font-bold text-white">Student / Lead Dev</div>
                      <div className="text-[9px] text-emerald-400">Authenticated</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Session Token</div>
                      <div className="text-xs font-bold text-purple-400">Bearer eyJhbGci...</div>
                      <div className="text-[9px] text-slate-400">Expires in 24h</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-400">Security Invariant</div>
                      <div className="text-xs font-bold text-amber-400">CORS & CSRF Safe</div>
                      <div className="text-[9px] text-emerald-400">HttpOnly Cookies</div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-xs text-blue-300">
                    <span className="font-bold">Automated Form Validation:</span> Clean error handling for missing academic inputs, CGPA boundaries, and file format restrictions.
                  </div>
                </div>
              )}

              {/* SCENE 3: CORE FUNCTIONAL EXECUTION */}
              {currentChapter.type === 'logic' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300">Core Pipeline Execution: {project.title}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Latency: 18ms</span>
                  </div>

                  <div className="my-auto space-y-2.5">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{project.features[0]?.title || 'System Computation'}</span>
                        <span className="text-emerald-400 font-bold">100% Verified</span>
                      </div>
                      <p className="text-slate-300 text-xs font-sans leading-relaxed">
                        {project.features[0]?.description || project.shortDescription}
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <span>Stack Modules: {project.techStack.slice(0, 3).join(' · ')}</span>
                      <span className="text-purple-400 font-semibold font-mono">Status: COMPLETED</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Algorithm Complexity: O(N log N) optimized</span>
                    <span className="text-slate-400">IEEE 830 Conformance</span>
                  </div>
                </div>
              )}

              {/* SCENE 4: DATABASE INVARIANTS & 3NF SCHEMA */}
              {currentChapter.type === 'database' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">MySQL 8.0 Query Inspector — {project.slug}_db</span>
                    </div>
                    <span className="text-amber-400 font-bold">InnoDB Engine</span>
                  </div>

                  <div className="my-auto space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-blue-300 font-mono text-[11px]">
                      SELECT u.id, u.email, t.status, t.created_at FROM users u JOIN transactions t ON u.id = t.user_id WHERE t.status = 'CONFIRMED' LIMIT 5;
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1">
                      <div className="text-slate-400 flex justify-between pb-1 border-b border-slate-800 font-bold text-[10px]">
                        <span>ID</span>
                        <span>ACCOUNT</span>
                        <span>TRANSACTION STATE</span>
                        <span>LATENCY</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>#1001</span>
                        <span>john.doe@mit.edu</span>
                        <span className="text-emerald-400">COMPLETED</span>
                        <span>1.2ms</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>#1002</span>
                        <span>anita.sharma@nit.edu</span>
                        <span className="text-emerald-400">COMPLETED</span>
                        <span>0.9ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Third Normal Form (3NF) Foreign Key Cascade Checked</span>
                    <span className="text-emerald-400 font-bold">Zero Orphan Records</span>
                  </div>
                </div>
              )}

              {/* SCENE 5: EXAMINER VIVA VOCE DEFENSE */}
              {currentChapter.type === 'viva' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-300">External Examiner Viva Voce Simulation Sheet</span>
                    </div>
                    <span className="text-purple-400 font-bold">98.4% Defense Pass Rate</span>
                  </div>

                  <div className="my-auto p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-300 font-sans">
                      Examiner Question: "Why did you choose {project.techStack[0]} over alternative frameworks for this project?"
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      "We selected {project.techStack[0]} for its non-blocking asynchronous event loop and robust component modularity, which reduces memory footprint during concurrent capstone evaluation while complying with IEEE standards."
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>Full 60+ Question Bank included in Kit</span>
                      <span className="text-emerald-400 font-bold">Anna / VTU / JNTU Standard</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>IEEE Capstone Deliverables Fully Verified</span>
                    <span className="text-blue-400 font-bold">Ready for Grade A Defense</span>
                  </div>
                </div>
              )}

              {/* Subtitles Overlay Bar */}
              {showCaptions && (
                <div className="mt-auto pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 font-sans leading-relaxed backdrop-blur-md shadow-lg flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <p className="line-clamp-2 italic">{currentChapter.narration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-2.5 z-20">
              {/* Scrubber Progress Bar */}
              <div
                onClick={handleSeek}
                className="h-2 w-full bg-slate-800 hover:h-3 rounded-full cursor-pointer relative transition-all group/scrub"
                title="Click to seek"
              >
                <div
                  className="h-full bg-blue-600 rounded-full relative"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white absolute right-0 top-1/2 -translate-y-1/2 shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-3 text-xs">
                {/* Left: Play / Pause, Rewind, Time */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Rewind 10 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="font-mono text-xs text-slate-300 tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-400">{formatTime(totalDuration)}</span>
                  </div>
                </div>

                {/* Right: Audio narration toggle, Speed, Captions, Fullscreen */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Voice Narration toggle */}
                  <button
                    onClick={() => setEnableVoiceNarration(!enableVoiceNarration)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors border ${
                      enableVoiceNarration
                        ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title="Toggle AI Speech Narration"
                  >
                    <Radio className={`w-3.5 h-3.5 ${enableVoiceNarration ? 'text-white animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">Voiceover</span>
                  </button>

                  {/* Mute toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Playback speed selector */}
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2.0x</option>
                  </select>

                  {/* Subtitles toggle */}
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      showCaptions ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-white'
                    }`}
                    title="Toggle Subtitles"
                  >
                    <Captions className="w-4 h-4" />
                  </button>

                  {/* Fullscreen toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: CHAPTER JUMP INDEX & REAL-WORLD SPEC */}
          <div className="lg:col-span-4 bg-slate-900 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Walkthrough Chapters ({chapters.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">Jump to specific verification phases</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900/60">
                  Total {formatTime(totalDuration)}
                </span>
              </div>

              {/* Chapters List */}
              <div className="space-y-2">
                {chapters.map((ch, idx) => {
                  const isActive = currentChapter.id === ch.id;
                  const Icon = ch.icon;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToChapter(ch)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        isActive
                          ? 'bg-blue-600/15 border-blue-500/80 text-white shadow-xs'
                          : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-700/80 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {ch.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                            {formatTime(ch.startTime)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ch.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Reproduction Script helper */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-300">Run Demo Locally</span>
                  <button
                    onClick={handleCopyReproCommands}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Clone repository, initialize dependencies, and start local development server in 3 simple terminal commands.
                </p>
              </div>
            </div>

            {/* Bottom Actions for Project */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-400">Kit Price:</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  ₹{project.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isPurchased ? (
                  <button
                    onClick={() => {
                      onClose();
                      downloadProjectKit(project, 'Complete Kit');
                    }}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Kit (.zip)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/checkout/${project.id}`);
                    }}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Proceed to Buy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(project.id, project.title)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

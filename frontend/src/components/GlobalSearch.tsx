import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { Project } from '../types';
import { HighlightText } from './HighlightText';
import {
  Search,
  X,
  Code2,
  FolderKanban,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Check,
  Tag,
  Laptop,
} from 'lucide-react';

export type SearchFilterType = 'all' | 'title' | 'category' | 'skill';

interface GlobalSearchProps {
  variant?: 'navbar' | 'compact' | 'modal';
  onCloseModal?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  variant = 'navbar',
  onCloseModal,
  className = '',
  autoFocus = false,
}) => {
  const { projects, categories } = useProjects();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(variant === 'modal');
  const [filterType, setFilterType] = useState<SearchFilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Extract all distinct technical skills across all projects
  const popularSkills = useMemo(() => {
    const skillCount = new Map<string, number>();
    projects.forEach((p) => {
      p.techStack.forEach((t) => {
        skillCount.set(t, (skillCount.get(t) || 0) + 1);
      });
      if (p.primaryLanguage) {
        skillCount.set(p.primaryLanguage, (skillCount.get(p.primaryLanguage) || 0) + 1);
      }
    });

    // Top 10 most common skills
    return Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill)
      .slice(0, 10);
  }, [projects]);

  // Global hotkey: Cmd+K or Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is already typing in another input/textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (onCloseModal) onCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCloseModal]);

  // Handle click outside to close dropdown in navbar mode
  useEffect(() => {
    if (variant === 'modal') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  // Compute matched projects and match diagnostics
  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      // When no query is typed, show 4 featured/top projects as suggestions
      return projects.slice(0, 4).map((p) => ({
        project: p,
        matchesTitle: false,
        matchesCategory: false,
        matchedSkills: [] as string[],
        isDefaultSuggestion: true,
      }));
    }

    return projects
      .map((project) => {
        const matchesTitle = project.title.toLowerCase().includes(cleanQuery);
        const matchesCategory = project.category.toLowerCase().includes(cleanQuery);
        
        // Find matching technical skills in techStack and primaryLanguage
        const matchedSkills = [
          ...project.techStack.filter((t) => t.toLowerCase().includes(cleanQuery)),
          ...(project.primaryLanguage.toLowerCase().includes(cleanQuery) &&
          !project.techStack.some((t) => t.toLowerCase() === project.primaryLanguage.toLowerCase())
            ? [project.primaryLanguage]
            : []),
        ];

        const matchesSkill = matchedSkills.length > 0;

        let isMatch = false;
        if (filterType === 'all') {
          isMatch = matchesTitle || matchesCategory || matchesSkill;
        } else if (filterType === 'title') {
          isMatch = matchesTitle;
        } else if (filterType === 'category') {
          isMatch = matchesCategory;
        } else if (filterType === 'skill') {
          isMatch = matchesSkill;
        }

        return {
          project,
          matchesTitle,
          matchesCategory,
          matchedSkills,
          isMatch,
          isDefaultSuggestion: false,
        };
      })
      .filter((item) => item.isMatch);
  }, [projects, query, filterType]);

  // Reset selectedIndex whenever query or results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, filterType]);

  // Handle keyboard navigation (ArrowDown, ArrowUp, Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        navigateToProject(searchResults[selectedIndex].project.id);
      } else if (query.trim()) {
        executeGlobalSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      if (onCloseModal) onCloseModal();
    }
  };

  const navigateToProject = (id: string) => {
    setIsOpen(false);
    if (onCloseModal) onCloseModal();
    navigate(`/projects/${id}`);
  };

  const executeGlobalSearch = () => {
    setIsOpen(false);
    if (onCloseModal) onCloseModal();
    
    // Format parameters based on filterType
    const cleanQ = query.trim();
    if (filterType === 'skill') {
      navigate(`/projects?tech=${encodeURIComponent(cleanQ)}`);
    } else if (filterType === 'category') {
      navigate(`/projects?category=${encodeURIComponent(cleanQ)}`);
    } else {
      navigate(`/projects?search=${encodeURIComponent(cleanQ)}`);
    }
  };

  const handleSelectSkillPill = (skill: string) => {
    setQuery(skill);
    setFilterType('skill');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleSelectCategoryPill = (catName: string) => {
    setQuery(catName);
    setFilterType('category');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const clearQuery = () => {
    setQuery('');
    setFilterType('all');
    inputRef.current?.focus();
  };

  const isModal = variant === 'modal';

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isModal ? 'max-w-2xl mx-auto' : 'max-w-xs md:max-w-sm lg:max-w-md'} ${className}`}
    >
      {/* Search Input Container */}
      <div
        className={`relative flex items-center w-full transition-all duration-200 rounded-xl border ${
          isOpen
            ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
            : 'bg-slate-100/90 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 shadow-xs'
        }`}
      >
        <div className="pl-3 pr-2 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus || isModal}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by title, category, or skill..."
          aria-label="Global search projects, skills and categories"
          className="w-full py-2 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none pr-14 truncate font-normal"
        />

        {/* Clear button & Shortcut indicator */}
        <div className="absolute right-2 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-700/60 border border-slate-300/60 dark:border-slate-600/60 rounded">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Menu / Suggestions Popover */}
      {isOpen && (
        <div
          ref={listRef}
          className={`absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all animate-in fade-in duration-150 ${
            isModal ? 'relative mt-3 max-h-[70vh]' : 'max-h-[520px]'
          } flex flex-col`}
        >
          {/* Header Filter Selector Tabs: All | Title | Category | Technical Skill */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-3 h-3 mr-0.5" />
              <span>Filter by:</span>
            </div>

            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'all', label: 'All Fields' },
                  { id: 'title', label: 'Title' },
                  { id: 'category', label: 'Category' },
                  { id: 'skill', label: 'Skill / Tech' },
                ] as const
              ).map((tab) => {
                const isActive = filterType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setFilterType(tab.id);
                      inputRef.current?.focus();
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Skill & Category discovery chips (shown on empty query or when requested) */}
          {!query.trim() && (
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20 space-y-2.5">
              {/* Popular Technical Skills */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  <Code2 className="w-3 h-3 text-blue-500" />
                  <span>Popular Technical Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSelectSkillPill(skill)}
                      className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 rounded-full transition-colors flex items-center gap-1"
                    >
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  <FolderKanban className="w-3 h-3 text-indigo-500" />
                  <span>Explore Domains</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategoryPill(cat.name)}
                      className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List Section */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {searchResults.length > 0 ? (
              <div className="p-2 space-y-1">
                {query.trim() ? (
                  <div className="px-2.5 py-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span>
                      {searchResults.length} {searchResults.length === 1 ? 'project' : 'projects'} found
                      {filterType !== 'all' ? ` in ${filterType}` : ''}
                    </span>
                    <span className="text-[10px] text-slate-400">Press ↵ to view first</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Featured Academic Project Kits</span>
                  </div>
                )}

                {searchResults.map((item, idx) => {
                  const { project, matchesTitle, matchesCategory, matchedSkills, isDefaultSuggestion } = item;
                  const isHighlighted = selectedIndex === idx;

                  return (
                    <div
                      key={project.id}
                      role="option"
                      aria-selected={isHighlighted}
                      onClick={() => navigateToProject(project.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group cursor-pointer p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                        isHighlighted
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      {/* Project Icon / Thumbnail visual */}
                      <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-blue-200/60 dark:border-slate-700">
                        {project.primaryLanguage ? project.primaryLanguage.slice(0, 2).toUpperCase() : 'PK'}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isHighlighted
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          >
                            <HighlightText text={project.title} query={query} />
                          </h4>
                          <span className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                            ₹{project.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Badges row: Category + Match indicators */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              matchesCategory
                                ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-400/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <FolderKanban className="w-2.5 h-2.5 mr-1 shrink-0" />
                            <HighlightText text={project.category} query={query} />
                          </span>

                          {/* Highlight matched technical skills */}
                          {matchedSkills.length > 0 && (
                            <div className="flex items-center gap-1">
                              {matchedSkills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/30"
                                >
                                  <Code2 className="w-2.5 h-2.5 mr-0.5" />
                                  Skill:&nbsp;
                                  <HighlightText text={skill} query={query} />
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Fallback display of project primary language if not already matched */}
                          {matchedSkills.length === 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              <Code2 className="w-2.5 h-2.5 mr-1" />
                              {project.primaryLanguage}
                            </span>
                          )}

                          {matchesTitle && query.trim() && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              Title Match
                            </span>
                          )}

                          <span className="flex items-center text-[10px] text-amber-500 ml-auto shrink-0 font-medium">
                            <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                            {project.rating}
                          </span>
                        </div>

                        {/* Short description preview */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                          {project.shortDescription}
                        </p>
                      </div>

                      {/* Right Chevron */}
                      <div className="self-center text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state with helpful suggestions */
              <div className="p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-2">
                  <Search className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  No projects match "{query}" {filterType !== 'all' ? `in ${filterType}` : ''}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try searching for technical skills like <span className="font-semibold text-blue-600 dark:text-blue-400">Spring Boot</span>, <span className="font-semibold text-blue-600 dark:text-blue-400">React</span>, <span className="font-semibold text-blue-600 dark:text-blue-400">Python</span>, or browse by domain.
                </p>

                {filterType !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className="mt-3 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Reset filter to "All Fields"
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer bar with full catalog link & shortcut guidelines */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between text-[11px]">
            <div className="hidden sm:flex items-center gap-3 text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[9px]">
                  ↑
                </kbd>
                <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[9px]">
                  ↓
                </kbd>{' '}
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[9px]">
                  ↵
                </kbd>{' '}
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[9px]">
                  Esc
                </kbd>{' '}
                Close
              </span>
            </div>

            <button
              type="button"
              onClick={executeGlobalSearch}
              className="w-full sm:w-auto ml-auto px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Explore all results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

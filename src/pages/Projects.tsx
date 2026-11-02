import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { ProjectCard } from '../components/ProjectCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Code2,
  Tags,
  Check,
  CheckCircle2,
  DollarSign,
  Layers,
  ChevronDown,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, categories } = useProjects();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedTech, setSelectedTech] = useState<string>(searchParams.get('tech') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('price') || 'All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'oldest'>(
    (searchParams.get('sort') as any) || 'newest'
  );

  // Mobile filters drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if URL search parameters change
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) setSearchQuery(query);
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
    const tech = searchParams.get('tech');
    if (tech !== null) setSelectedTech(tech);
    const lang = searchParams.get('lang');
    if (lang !== null) setSelectedLanguage(lang);
    const price = searchParams.get('price');
    if (price !== null) setSelectedPriceRange(price);
    const sort = searchParams.get('sort');
    if (sort !== null) setSortBy(sort as any);
  }, [searchParams]);

  // Reset to page 1 when any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedTech, selectedPriceRange, sortBy]);

  // List of popular technology filters
  const popularTechs = [
    'All',
    'Spring Boot',
    'React',
    'Java',
    'MySQL',
    'Python',
    'OpenCV',
    'Node.js',
    'MongoDB',
    'Solidity',
    'ESP32',
    'BERT',
  ];

  // Unique programming languages
  const programmingLanguages = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.primaryLanguage));
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter and sort computation
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // 1. Search filter across title, shortDescription, overview, techStack, primaryLanguage, and category
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = project.title.toLowerCase().includes(q);
          const matchDesc = project.shortDescription.toLowerCase().includes(q);
          const matchOverview = project.overview.toLowerCase().includes(q);
          const matchTech = project.techStack.some((t) => t.toLowerCase().includes(q));
          const matchLang = project.primaryLanguage.toLowerCase().includes(q);
          const matchCat = project.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchOverview && !matchTech && !matchLang && !matchCat) {
            return false;
          }
        }

        // 2. Category filter
        if (selectedCategory !== 'All') {
          if (project.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // 3. Technology filter
        if (selectedTech !== 'All') {
          const matchesTech = project.techStack.some((t) =>
            t.toLowerCase().includes(selectedTech.toLowerCase())
          );
          if (!matchesTech) return false;
        }

        // 4. Programming language filter
        if (selectedLanguage !== 'All') {
          if (project.primaryLanguage.toLowerCase() !== selectedLanguage.toLowerCase()) {
            return false;
          }
        }

        // 5. Price range filter
        if (selectedPriceRange === 'under-2000') {
          if (project.price >= 2000) return false;
        } else if (selectedPriceRange === '2000-2499') {
          if (project.price < 2000 || project.price > 2499) return false;
        } else if (selectedPriceRange === '2500-plus') {
          if (project.price < 2500) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // default newest-first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, searchQuery, selectedCategory, selectedTech, selectedLanguage, selectedPriceRange, sortBy]);

  // Pagination calculation
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTech('All');
    setSelectedLanguage('All');
    setSelectedPriceRange('All');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedTech !== 'All' ||
    selectedLanguage !== 'All' ||
    selectedPriceRange !== 'All' ||
    sortBy !== 'newest';

  // Count projects per category helper
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') return projects.length;
    return projects.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            Verified Academic Repository
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Engineering Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse complete capstone kits with production-grade code, IEEE reports, MySQL database dumps, and viva defense guides.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Marketplace Grid: Sidebar Filters (Left) + Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SIDEBAR FILTERS (Desktop persistent, Mobile drawer) */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-slate-950/60 p-4 flex flex-col justify-end lg:static lg:bg-transparent lg:p-0'
              : 'hidden lg:block'
          }`}
        >
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-6 max-h-[85vh] lg:max-h-none overflow-y-auto">
            {/* Mobile drawer header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 lg:hidden">
              <span className="font-bold text-sm text-slate-900">Filter Projects</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Section 1: Categories / Disciplines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Domain / Category
                </span>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {projects.length}
                  </span>
                </button>

                {categories.map((c) => {
                  const isSelected = selectedCategory.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{c.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {getCategoryCount(c.name)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Section 2: Frameworks & Technologies */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Framework / Technology
                </span>
                {selectedTech !== 'All' && (
                  <button
                    onClick={() => setSelectedTech('All')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {popularTechs.map((tech) => {
                  const isSelected = selectedTech === tech;
                  return (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(isSelected ? 'All' : tech)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Section 3: Programming Language */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Programming Language
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              >
                {programmingLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'All' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Section 4: Price Budget */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Price Budget
              </span>
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === 'All'}
                    onChange={() => setSelectedPriceRange('All')}
                    className="text-blue-600"
                  />
                  <span>All Price Tiers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === 'under-2000'}
                    onChange={() => setSelectedPriceRange('under-2000')}
                    className="text-blue-600"
                  />
                  <span>Under ₹2,000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === '2000-2499'}
                    onChange={() => setSelectedPriceRange('2000-2499')}
                    className="text-blue-600"
                  />
                  <span>₹2,000 – ₹2,499</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === '2500-plus'}
                    onChange={() => setSelectedPriceRange('2500-plus')}
                    className="text-blue-600"
                  />
                  <span>₹2,500 and above</span>
                </label>
              </div>
            </div>

            {/* Reset All Filters button */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: MAIN CONTENT AREA */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Search & Sorting Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Functional Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, tech stack (Spring Boot, MERN, Python, Java)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
              <div className="relative min-w-[170px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white pr-7 appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First (2026)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
              </span>
              <span>of {totalItems} academic kits</span>
            </div>

            {/* Active chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                  <span>Domain: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTech !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                  <span>Tech: {selectedTech}</span>
                  <button onClick={() => setSelectedTech('All')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedPriceRange !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                  <span>Price: {selectedPriceRange}</span>
                  <button onClick={() => setSelectedPriceRange('All')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline ml-1"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Project Cards Grid */}
          {paginatedProjects.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-medium">
                    Page <span className="font-bold text-slate-800 font-mono">{currentPage}</span> of{' '}
                    <span className="font-bold text-slate-800 font-mono">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNum = index + 1;
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-colors ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No project kits match your criteria
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Try relaxing your search keywords, exploring other technology frameworks, or resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

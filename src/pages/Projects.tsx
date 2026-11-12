import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { ProjectCard } from '../components/ProjectCard';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  LayoutGrid,
  List,
  Check,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Star,
  FileText,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProjectIllustration } from '../components/ProjectIllustration';
import { HighlightText } from '../components/HighlightText';
import { SEOHead } from '../components/SEOHead';

const ITEMS_PER_PAGE = 9;

export const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { projects, categories } = useProjects();
  const { wishlistIds, wishlistCount } = useWishlist();
  const { purchasedProjectIds } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedTechs, setSelectedTechs] = useState<string[]>(() => {
    const tech = searchParams.get('tech');
    return tech && tech !== 'All' ? [tech] : [];
  });
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'All');
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minPrice') || '');
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxPrice') || '');
  const [pricePreset, setPricePreset] = useState(searchParams.get('pricePreset') || 'All');
  const [showWishlistOnly, setShowWishlistOnly] = useState(searchParams.get('wishlist') === 'true');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'oldest'>(
    (searchParams.get('sort') as any) || 'featured'
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
    if (tech !== null) setSelectedTechs(tech !== 'All' ? [tech] : []);
    const minP = searchParams.get('minPrice');
    if (minP !== null) setMinPriceInput(minP);
    const maxP = searchParams.get('maxPrice');
    if (maxP !== null) setMaxPriceInput(maxP);
    const sort = searchParams.get('sort');
    if (sort !== null) setSortBy(sort as any);
  }, [searchParams]);

  // Reset to page 1 when any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedTechs, minPriceInput, maxPriceInput, pricePreset, sortBy, showWishlistOnly]);

  // Curated list of popular technology brands/stacks matching Screenshot 3
  const allAvailableTechs = [
    'Spring Boot',
    'React',
    'Java',
    'MySQL',
    'Python',
    'OpenCV',
    'Node.js',
    'MongoDB',
    'Docker',
    'ESP32',
    'FastAPI',
    'PostgreSQL',
    'TensorFlow',
    'Tailwind CSS',
    'JWT',
  ];

  // Toggle tech selection
  const handleToggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  // Filter and sort computation
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Wishlist filter
        if (showWishlistOnly && !wishlistIds.includes(project.id)) {
          return false;
        }

        // Category filter
        if (
          selectedCategory !== 'All' &&
          project.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Language filter
        if (
          selectedLanguage !== 'All' &&
          project.primaryLanguage.toLowerCase() !== selectedLanguage.toLowerCase()
        ) {
          return false;
        }

        // Selected Techs filter (match any selected)
        if (selectedTechs.length > 0) {
          const hasMatchingTech = selectedTechs.some((selected) =>
            project.techStack.some((t) => t.toLowerCase().includes(selected.toLowerCase()))
          );
          if (!hasMatchingTech) return false;
        }

        // Price range numeric filter
        if (minPriceInput) {
          const min = parseFloat(minPriceInput);
          if (!isNaN(min) && project.price < min) return false;
        }
        if (maxPriceInput) {
          const max = parseFloat(maxPriceInput);
          if (!isNaN(max) && project.price > max) return false;
        }

        // Price preset filter
        if (pricePreset !== 'All') {
          if (pricePreset === 'under-2000' && project.price >= 2000) return false;
          if (
            pricePreset === '2000-2499' &&
            (project.price < 2000 || project.price > 2499)
          )
            return false;
          if (pricePreset === '2500-plus' && project.price < 2500) return false;
        }

        // Search text filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = project.title.toLowerCase().includes(q);
          const matchesCategory = project.category.toLowerCase().includes(q);
          const matchesDesc = project.shortDescription.toLowerCase().includes(q);
          const matchesLang = project.primaryLanguage.toLowerCase().includes(q);
          const matchesTech = project.techStack.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesLang && !matchesTech) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 5.0) - (a.rating || 5.0);
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'rating') return (b.rating || 5.0) - (a.rating || 5.0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    projects,
    searchQuery,
    selectedCategory,
    selectedLanguage,
    selectedTechs,
    minPriceInput,
    maxPriceInput,
    pricePreset,
    sortBy,
    showWishlistOnly,
    wishlistIds,
  ]);

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
    setSelectedTechs([]);
    setSelectedLanguage('All');
    setMinPriceInput('');
    setMaxPriceInput('');
    setPricePreset('All');
    setShowWishlistOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleApplyFilters = () => {
    setMobileFilterOpen(false);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedTechs.length > 0 ||
    selectedLanguage !== 'All' ||
    minPriceInput !== '' ||
    maxPriceInput !== '' ||
    pricePreset !== 'All' ||
    showWishlistOnly ||
    sortBy !== 'featured';

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') return projects.length;
    return projects.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-50 dark:bg-[#060B18] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <SEOHead
        title={selectedCategory !== 'All' ? `${selectedCategory} Project Kits — Source Code & IEEE Reports` : 'Browse Academic Project Kits — Source Code, IEEE Docs & DB Dumps'}
        description={`Explore verified ${selectedCategory !== 'All' ? selectedCategory : 'engineering'} capstone project kits with full source code, IEEE reports, circuit schematics, and viva cheat sheets.`}
        canonicalPath="/projects"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://projectkit.in/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Projects",
              "item": "https://projectkit.in/projects"
            }
          ]
        }}
      />
      {/* =========================================================================
          TOP SEARCH BAR (Full Width spanning columns, matching Screenshot 3)
          ========================================================================= */}
      <div className="w-full">
        <div className="relative w-full bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200/90 dark:border-[#1A2846] shadow-xs flex items-center transition-all focus-within:border-[#2563EB] focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.18)]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-5 pr-12 py-3.5 text-sm bg-transparent rounded-2xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            aria-label="Search products"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-[#F8FAFC]"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Search className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle & Quick Header */}
      <div className="flex items-center justify-between lg:hidden pb-1">
        <div className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
          {totalItems} Projects
        </div>
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="px-4 py-2 bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846] rounded-xl text-xs font-semibold text-slate-800 dark:text-[#CBD5E1] flex items-center gap-2 shadow-xs"
          aria-label="Open filter sidebar"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
          <span>Filters {hasActiveFilters && '(Active)'}</span>
        </button>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN MARKETPLACE GRID: FILTERS (LEFT) + PRODUCTS (RIGHT)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FILTERS PANEL (Matching Screenshot 3) */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-slate-950/70 dark:bg-[#060B18]/90 backdrop-blur-sm p-4 flex flex-col justify-end lg:static lg:bg-transparent lg:p-0'
              : 'hidden lg:block'
          }`}
        >
          <div className="card p-5 space-y-5 max-h-[88vh] lg:max-h-none overflow-y-auto">
            {/* Header: "Filters" matching Screenshot 3 */}
            <div className="flex items-center justify-between pb-3 border-b border-white/20 dark:border-[#3A2074]">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-[#F8FAFC] tracking-tight">
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sort By dropdown inside Filters card */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-[#E8ECFA] outline-none focus:border-[#2F4BFF] pr-8 appearance-none cursor-pointer"
                >
                  <option value="featured" className="bg-white dark:bg-[#0F1830] text-slate-900 dark:text-slate-100">Featured</option>
                  <option value="price-asc" className="bg-white dark:bg-[#0F1830] text-slate-900 dark:text-slate-100">Price: Low to High</option>
                  <option value="price-desc" className="bg-white dark:bg-[#0F1830] text-slate-900 dark:text-slate-100">Price: High to Low</option>
                  <option value="rating" className="bg-white dark:bg-[#0F1830] text-slate-900 dark:text-slate-100">Highest Rated</option>
                  <option value="newest" className="bg-white dark:bg-[#0F1830] text-slate-900 dark:text-slate-100">Newest (2026)</option>
                  <option value="oldest" className="bg-white dark:bg-[#0F1830] text-slate-900 dark:text-slate-100">Oldest First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-3" />
              </div>
            </div>

            {/* Category list with radio buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#25335F]">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <div className="space-y-1.5 text-xs">
                {/* All Categories Option */}
                <label className="flex items-center justify-between cursor-pointer group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="categoryGroup"
                      checked={selectedCategory === 'All'}
                      onChange={() => setSelectedCategory('All')}
                      className="text-[#2F4BFF] accent-[#2F4BFF] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`transition-colors ${selectedCategory === 'All' ? 'font-bold text-[#2F4BFF] dark:text-[#5B7BFF]' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      All Categories
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {getCategoryCount('All')}
                  </span>
                </label>

                {/* Specific Categories */}
                {categories.map((c) => {
                  const isSelected = selectedCategory.toLowerCase() === c.name.toLowerCase();
                  return (
                    <label key={c.id} className="flex items-center justify-between cursor-pointer group py-0.5">
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <input
                          type="radio"
                          name="categoryGroup"
                          checked={isSelected}
                          onChange={() => setSelectedCategory(c.name)}
                          className="text-[#2F4BFF] accent-[#2F4BFF] w-3.5 h-3.5 cursor-pointer shrink-0"
                        />
                        <span className={`truncate transition-colors ${isSelected ? 'font-bold text-[#2F4BFF] dark:text-[#5B7BFF]' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                          {c.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                        {getCategoryCount(c.name)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range with Min / Max inputs (Matching Screenshot 3) */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#1A2846]">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={minPriceInput}
                    onChange={(e) => {
                      setMinPriceInput(e.target.value);
                      setPricePreset('All');
                    }}
                    placeholder="Min"
                    className="w-full bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={maxPriceInput}
                    onChange={(e) => {
                      setMaxPriceInput(e.target.value);
                      setPricePreset('All');
                    }}
                    placeholder="Max"
                    className="w-full bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <input
                    type="radio"
                    name="pricePreset"
                    checked={pricePreset === 'under-2000'}
                    onChange={() => {
                      setPricePreset('under-2000');
                      setMinPriceInput('');
                      setMaxPriceInput('');
                    }}
                    className="accent-[#2563EB]"
                  />
                  <span>Under ₹2,000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <input
                    type="radio"
                    name="pricePreset"
                    checked={pricePreset === '2000-2499'}
                    onChange={() => {
                      setPricePreset('2000-2499');
                      setMinPriceInput('');
                      setMaxPriceInput('');
                    }}
                    className="accent-[#2563EB]"
                  />
                  <span>₹2,000 – ₹2,499</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <input
                    type="radio"
                    name="pricePreset"
                    checked={pricePreset === '2500-plus'}
                    onChange={() => {
                      setPricePreset('2500-plus');
                      setMinPriceInput('');
                      setMaxPriceInput('');
                    }}
                    className="accent-[#2563EB]"
                  />
                  <span>₹2,500 and above</span>
                </label>
              </div>
            </div>

              {/* Brand / Tech Stack with scrollbar */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#25335F]">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Brand / Tech Stack
                </label>
                {selectedTechs.length > 0 && (
                  <button
                    onClick={() => setSelectedTechs([])}
                    className="text-[10px] text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline"
                  >
                    Clear ({selectedTechs.length})
                  </button>
                )}
              </div>

              {/* Scrollable Checkbox List */}
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin text-xs">
                {allAvailableTechs.map((tech) => {
                  const isChecked = selectedTechs.includes(tech);
                  return (
                    <label
                      key={tech}
                      className="flex items-center justify-between cursor-pointer group py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#16224A] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTech(tech)}
                          className="w-3.5 h-3.5 rounded text-[#2F4BFF] accent-[#2F4BFF] cursor-pointer"
                        />
                        <span className={`transition-colors ${isChecked ? 'font-bold text-[#2F4BFF] dark:text-[#5B7BFF]' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                          {tech}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="pt-3 border-t border-slate-200 dark:border-[#25335F]">
              <button
                onClick={handleApplyFilters}
                className="pk-btn-primary w-full py-2.5 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(47,75,255,0.35)] flex items-center justify-center gap-1.5"
              >
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#25335F]">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
                {totalItems} Projects
              </h1>
              {hasActiveFilters && (
                <span className="text-xs text-slate-500 dark:text-[#9AA6C7]">
                  (Filtered)
                </span>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-[#9AA6C7] font-medium hidden sm:inline">
                View:
              </span>
              <div className="flex items-center p-0.5 bg-white dark:bg-[#0F1830] rounded-xl border border-slate-200 dark:border-[#25335F] shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#2F4BFF] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#2F4BFF] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="List View"
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Items: Grid vs List Layout */}
          {paginatedProjects.length > 0 ? (
            viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} searchQuery={searchQuery} />
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {paginatedProjects.map((project) => {
                  const isPurchased = purchasedProjectIds.includes(project.id);
                  return (
                    <div
                      key={project.id}
                      className="pk-card-3d group bg-white dark:bg-[#0F1830] rounded-2xl border border-[#E3E8F2] dark:border-[#25335F] hover:border-[#2F4BFF]/80 dark:hover:border-[#5B7BFF] p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all hover:shadow-[0_16px_36px_-6px_rgba(47,75,255,0.22)] dark:hover:shadow-[0_16px_36px_-6px_rgba(91,123,255,0.3)]"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-28 sm:w-36 aspect-[16/9] rounded-xl overflow-hidden bg-[#0B1B3F] shrink-0 border border-[#E3E8F2] dark:border-[#25335F]">
                          <ProjectIllustration
                            category={project.category}
                            primaryLanguage={project.primaryLanguage}
                            techStack={project.techStack}
                            title={project.title}
                            aspect="16:9"
                            imageUrl={project.imageUrl || project.coverImage}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="flex items-center text-[#F59E0B]">
                              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            </div>
                            <span className="font-bold text-[#1E293B] dark:text-[#E8ECFA]">
                              {project.rating ? project.rating.toFixed(1) : '4.9'}
                            </span>
                            <span className="text-xs text-[#64748B] dark:text-[#9AA6C7]">
                              ({project.reviewsCount || 67} reviews)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="text-left font-bold text-sm sm:text-base text-[#0F172A] dark:text-[#E8ECFA] group-hover:text-[#2F4BFF] dark:group-hover:text-[#5B7BFF] transition-colors truncate block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF] rounded-sm"
                          >
                            <HighlightText text={project.title} query={searchQuery} />
                          </button>
                          <p className="text-sm text-[#475569] dark:text-[#9AA6C7] line-clamp-2 leading-relaxed">
                            <HighlightText text={project.shortDescription} query={searchQuery} />
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.techStack.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                className="text-xs font-medium bg-[#EEF2FF] text-[#1E293B] border border-[#C7D2FE] dark:bg-[#16224A] dark:text-[#E8ECFA] dark:border-[#25335F] px-2.5 py-0.5 rounded-md"
                              >
                                {t}
                              </span>
                            ))}
                            <span className="text-xs font-medium bg-[#EEF2FF] text-[#1E293B] border border-[#C7D2FE] dark:bg-[#16224A] dark:text-[#E8ECFA] dark:border-[#25335F] px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                              <FileText className="w-3 h-3 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                              <span>88+ pages report</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8DEFF] dark:border-[#3A2074] gap-3 shrink-0">
                        <div className="text-left sm:text-right">
                          <div className="text-lg font-extrabold text-[#0B0720] dark:text-[#F2E9FF] font-mono tabular-nums">
                            {project.isFree || project.price === 0 ? 'FREE' : `₹${project.price.toLocaleString('en-IN')}`}
                          </div>
                          {project.originalPrice > project.price && (
                            <div className="text-xs text-[#63567D] dark:text-[#D1B8FF]/60 line-through font-mono tabular-nums">
                              ₹{project.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="min-h-[38px] px-3 py-2 rounded-xl text-xs font-semibold border border-[#D1B8FF]/70 dark:border-[#3A2074] text-[#25134D] dark:text-[#D1B8FF] hover:bg-[#F2E9FF]/50 dark:hover:bg-[#25134D]/60 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isPurchased) navigate('/dashboard/purchases');
                              else navigate(`/checkout/${project.id}`);
                            }}
                            className={`min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-xs flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A2FC8] ${
                              isPurchased
                                ? 'bg-[#16A34A] hover:bg-[#15803D] text-white'
                                : 'bg-[#6A2FC8] hover:bg-[#5824A8] text-white hover:shadow-[0_4px_14px_rgba(106,47,200,0.35)]'
                            }`}
                          >
                            {isPurchased ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Owned</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Buy Now</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-[#F8FAFC]">
                  No project kits match your criteria
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Try clearing some filters or searching for broader terms like "Java", "Python", "React", or "Spring Boot".
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-[#1A2846] flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846] rounded-xl text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-[#101C38]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#2F4BFF] text-white shadow-xs'
                        : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#101C38]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846] rounded-xl text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-[#101C38]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

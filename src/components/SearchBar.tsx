import React, { useState } from 'react';
import { Search, X, ArrowRight, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string, category?: string) => void;
  placeholder?: string;
  size?: 'normal' | 'large';
  className?: string;
  showCategoryDropdown?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Search by project name, tech stack (e.g. Spring Boot, MERN, Python, Java)...',
  size = 'normal',
  className = '',
  showCategoryDropdown = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');

  const categories = [
    'All Domains',
    'Java & Spring Boot',
    'Web Development',
    'AI & Machine Learning',
    'IoT & Embedded',
    'Cybersecurity & Cloud',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim(), category === 'All Domains' ? undefined : category);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('', category === 'All Domains' ? undefined : category);
  };

  const isLarge = size === 'large';

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100/60 transition-all ${
        isLarge ? 'p-1.5 sm:p-2' : 'p-1'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* Category selector on large search bar */}
        {showCategoryDropdown && isLarge && (
          <div className="relative shrink-0 sm:w-44 py-1 px-3 sm:py-0 flex items-center">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2 shrink-0 hidden sm:block" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                onSearch(query.trim(), e.target.value === 'All Domains' ? undefined : e.target.value);
              }}
              className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-4 appearance-none py-1.5"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3" />
          </div>
        )}

        {/* Search input field */}
        <div className="flex items-center flex-1 min-w-0 px-3 py-1 sm:py-0">
          <Search className={isLarge ? 'w-5 h-5 text-slate-400 shrink-0 mr-2.5' : 'w-4 h-4 text-slate-400 shrink-0 mr-2'} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value, category === 'All Domains' ? undefined : category);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-xs sm:text-sm outline-none py-1.5 truncate"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md shrink-0 ml-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2 sm:pt-0 sm:pl-2 shrink-0">
          <button
            type="submit"
            className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
              isLarge ? 'px-6 py-3 text-xs sm:text-sm' : 'px-3.5 py-2 text-xs'
            }`}
          >
            <span>Search Kits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

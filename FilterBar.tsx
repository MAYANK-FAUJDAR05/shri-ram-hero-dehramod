import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MainFilter, VehicleCategory, HeroVehicle } from '../types';
import {
  Search,
  Bike,
  Zap,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  Flame,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_VEHICLES } from '../data/vehicles';
import { getVehiclePriceEstimate, formatINR } from '../utils/finance';

interface FilterBarProps {
  mainFilter: MainFilter;
  setMainFilter: (filter: MainFilter) => void;
  subCategory: 'all' | VehicleCategory;
  setSubCategory: (cat: 'all' | VehicleCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  vehicles?: HeroVehicle[];
  onSelectVehicle?: (vehicle: HeroVehicle) => void;
}

const POPULAR_VEHICLE_IDS = [
  'splendor-plus',
  'xtreme-125r',
  'xpulse-200-4v',
  'karizma-xmr',
  'destini-125-xtec',
  'vida-v1-pro',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  mainFilter,
  setMainFilter,
  subCategory,
  setSubCategory,
  searchQuery,
  setSearchQuery,
  totalCount,
  vehicles = HERO_VEHICLES,
  onSelectVehicle,
}) => {
  const { t, language } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMainTabChange = (filter: MainFilter) => {
    setMainFilter(filter);
    if (filter === 'all') setSubCategory('all');
    else if (filter === 'scooters') setSubCategory('scooter');
    else if (filter === 'ev') setSubCategory('ev');
    else if (filter === 'bikes') setSubCategory('all');
  };

  // Close dropdown on clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut: Press "/" to focus search input
  useEffect(() => {
    const handleGlobalSlash = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsDropdownOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalSlash);
    return () => window.removeEventListener('keydown', handleGlobalSlash);
  }, []);

  // Compute predictive suggestions in real-time
  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const all = vehicles || HERO_VEHICLES;

    if (!query) {
      // Show curated popular vehicles when empty
      return POPULAR_VEHICLE_IDS.map((id) => all.find((v) => v.id === id)).filter(
        Boolean
      ) as HeroVehicle[];
    }

    // Score candidates by relevance
    const scored = all.map((vehicle) => {
      let score = 0;
      const nameLower = vehicle.name.toLowerCase();
      const cleanName = nameLower.replace(/^hero\s+/, '');
      const taglineLower = vehicle.tagline.toLowerCase();
      const engineLower = vehicle.specs.engine.toLowerCase();
      const categoryLower = vehicle.category.toLowerCase();

      // Highest score: starts with query
      if (nameLower.startsWith(query) || cleanName.startsWith(query)) {
        score += 120;
      } else if (nameLower.includes(` ${query}`) || cleanName.includes(` ${query}`)) {
        // Word boundary match inside name (e.g. "125" in "Hero Xtreme 125R")
        score += 90;
      } else if (nameLower.includes(query)) {
        score += 70;
      }

      // Displacement & engine match
      if (engineLower.includes(query)) {
        score += 45;
      }

      // Tagline or category match
      if (taglineLower.includes(query)) {
        score += 30;
      }
      if (categoryLower.includes(query)) {
        score += 25;
      }

      // Features or mileage match
      if (vehicle.specs.mileage.toLowerCase().includes(query)) {
        score += 20;
      }
      if (vehicle.features.some((f) => f.toLowerCase().includes(query))) {
        score += 15;
      }

      return { vehicle, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.vehicle)
      .slice(0, 6);
  }, [searchQuery, vehicles]);

  // Highlight query text in results
  const renderHighlightedName = (text: string, query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return text;

    try {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);

      return (
        <span>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <span
                key={i}
                className="text-[#D6181F] font-black underline decoration-[#D6181F]/40 underline-offset-2"
              >
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </span>
      );
    } catch {
      return text;
    }
  };

  const handleSelectSuggestion = (vehicle: HeroVehicle) => {
    // Fill the search query with the vehicle's full name
    setSearchQuery(vehicle.name);

    // Auto-adjust tabs so the selected vehicle isn't filtered out by a conflicting category
    if (mainFilter !== 'all' && vehicle.mainType !== mainFilter) {
      setMainFilter('all');
    }
    if (subCategory !== 'all' && vehicle.category !== subCategory) {
      setSubCategory('all');
    }

    setIsDropdownOpen(false);
    setSelectedIndex(-1);

    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsDropdownOpen(true);
      return;
    }

    if (!isDropdownOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        setIsDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="w-full space-y-3 mb-6">
      {/* Top Primary Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#111] p-2 sm:p-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            id="tab-all-vehicles"
            type="button"
            onClick={() => handleMainTabChange('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mainFilter === 'all'
                ? 'bg-[#D6181F] text-white shadow-lg shadow-[#D6181F]/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.filter.allVehicles}
          </button>

          <button
            id="tab-bikes"
            type="button"
            onClick={() => handleMainTabChange('bikes')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mainFilter === 'bikes'
                ? 'bg-[#D6181F] text-white shadow-lg shadow-[#D6181F]/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            {t.filter.bikes}
          </button>

          <button
            id="tab-scooters"
            type="button"
            onClick={() => handleMainTabChange('scooters')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mainFilter === 'scooters'
                ? 'bg-[#D6181F] text-white shadow-lg shadow-[#D6181F]/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {t.filter.scooters}
          </button>

          <button
            id="tab-ev"
            type="button"
            onClick={() => handleMainTabChange('ev')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mainFilter === 'ev'
                ? 'bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/30 font-black'
                : 'text-[#00FF88] hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t.filter.vidaEv}
          </button>
        </div>

        {/* Real-time Predictive Search Box */}
        <div
          ref={searchContainerRef}
          className="relative w-full md:w-80 lg:w-96"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          <input
            id="input-search-vehicles"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="predictive-search-dropdown"
            aria-activedescendant={
              selectedIndex >= 0 && suggestions[selectedIndex]
                ? `predictive-item-${suggestions[selectedIndex].id}`
                : undefined
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={t.filter.searchPlaceholder}
            className="w-full pl-9 pr-14 py-2 bg-black/60 border border-white/10 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#D6181F] focus:ring-1 focus:ring-[#D6181F]/40 transition-all"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                id="btn-clear-search"
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="text-[10px] font-bold text-gray-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
            {!searchQuery && (
              <kbd className="hidden sm:inline-block text-[9px] font-mono text-gray-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Predictive Search Suggestions Dropdown */}
          {isDropdownOpen && (
            <div
              id="predictive-search-dropdown"
              role="listbox"
              className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#161616] border border-white/15 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {/* Dropdown Header */}
              <div className="px-3.5 py-2 bg-black/50 border-b border-white/10 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 text-gray-300">
                  {searchQuery.trim() ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#D6181F]" />
                      <span>{t.filter.suggestedModels}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                        {suggestions.length}
                      </span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{t.filter.popularSearches}</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-mono hidden sm:inline-block normal-case">
                  {language === 'hi' ? '↑↓ नेविगेट • ↵ चयन' : '↑↓ to navigate • ↵ select'}
                </span>
              </div>

              {/* Suggestions List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10">
                {suggestions.length > 0 ? (
                  suggestions.map((vehicle, idx) => {
                    const isSelected = selectedIndex === idx;
                    const priceEstimate = getVehiclePriceEstimate(vehicle.id);
                    const engineDisplay = vehicle.specs.engine.split(',')[0];
                    const mileageDisplay = vehicle.specs.mileage.split('(')[0].trim();

                    return (
                      <div
                        key={vehicle.id}
                        id={`predictive-item-${vehicle.id}`}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => handleSelectSuggestion(vehicle)}
                        className={`px-3.5 py-2.5 flex items-center gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#D6181F]/15 text-white pl-4 border-l-2 border-[#D6181F]'
                            : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        {/* Vehicle Thumbnail */}
                        <div className="w-12 h-9 rounded-md overflow-hidden bg-black/60 border border-white/10 shrink-0 flex items-center justify-center">
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Vehicle Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs sm:text-[13px] truncate">
                              {renderHighlightedName(vehicle.name, searchQuery)}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                                vehicle.category === 'ev'
                                  ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30 font-black'
                                  : 'bg-white/10 text-gray-300 border border-white/5'
                              }`}
                            >
                              {vehicle.category === 'ev' ? 'Vida EV' : vehicle.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 truncate">
                            <span className="truncate">{engineDisplay}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-[#00FF88] font-medium shrink-0">
                              {mileageDisplay}
                            </span>
                          </div>
                        </div>

                        {/* Price & Selection Prompt */}
                        <div className="text-right shrink-0 flex flex-col items-end">
                          <span className="text-xs font-bold text-[#D6181F] font-['Rajdhani'] tracking-wide">
                            Price = Best Price
                          </span>
                          <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                            {language === 'hi' ? 'सर्वश्रेष्ठ ऑफर' : 'Authorized Offer'}
                          </span>
                          {isSelected && (
                            <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] font-mono text-[#D6181F] bg-[#D6181F]/20 px-1.5 py-0.5 rounded">
                              <span>{language === 'hi' ? 'चुनें' : 'Select'}</span>
                              <CornerDownLeft className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Zero results state */
                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-gray-400">
                      <Search className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-xs font-bold text-white mb-1">
                      {t.filter.noVehiclesFound} &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-[11px] text-gray-400 max-w-xs mx-auto mb-3">
                      {t.filter.tryDifferentSearch}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs text-gray-200 font-semibold transition-colors cursor-pointer"
                    >
                      {language === 'hi' ? 'खोज रीसेट करें' : 'Clear search'}
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              {suggestions.length > 0 && searchQuery.trim() && (
                <div className="px-3.5 py-2 bg-black/50 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 truncate max-w-[200px] sm:max-w-none">
                    {language === 'hi'
                      ? `"${searchQuery}" के लिए शीर्ष परिणाम`
                      : `Top matches for "${searchQuery}"`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-[#D6181F] hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>{language === 'hi' ? 'ग्रिड में देखें' : 'View in showroom'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subcategory Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#D6181F]" /> {t.filter.categoryLabel}
          </span>

          <button
            id="pill-cat-all"
            type="button"
            onClick={() => setSubCategory('all')}
            className={`text-[11px] px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              subCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {t.filter.allCategories}
          </button>

          {(mainFilter === 'all' || mainFilter === 'bikes') && (
            <>
              <button
                id="pill-cat-commuter"
                type="button"
                onClick={() => setSubCategory('commuter')}
                className={`text-[11px] px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  subCategory === 'commuter'
                    ? 'bg-[#D6181F] text-white'
                    : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {t.filter.commuterBikes}
              </button>

              <button
                id="pill-cat-premium"
                type="button"
                onClick={() => setSubCategory('premium')}
                className={`text-[11px] px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  subCategory === 'premium'
                    ? 'bg-[#D6181F] text-white'
                    : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {t.filter.premiumCommuter}
              </button>

              <button
                id="pill-cat-sports"
                type="button"
                onClick={() => setSubCategory('sports')}
                className={`text-[11px] px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  subCategory === 'sports'
                    ? 'bg-[#D6181F] text-white'
                    : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {t.filter.sportsPerformance}
              </button>
            </>
          )}

          {(mainFilter === 'all' || mainFilter === 'scooters') && (
            <button
              id="pill-cat-scooters"
              type="button"
              onClick={() => setSubCategory('scooter')}
              className={`text-[11px] px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                subCategory === 'scooter'
                  ? 'bg-[#D6181F] text-white'
                  : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {t.filter.scooters}
            </button>
          )}

          {(mainFilter === 'all' || mainFilter === 'ev') && (
            <button
              id="pill-cat-ev"
              type="button"
              onClick={() => setSubCategory('ev')}
              className={`text-[11px] px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                subCategory === 'ev'
                  ? 'bg-[#00FF88] text-black font-bold'
                  : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {t.filter.vidaEv}
            </button>
          )}
        </div>

        {/* Vehicle count indicator */}
        <div className="text-[11px] text-gray-400 font-medium">
          {language === 'hi' ? (
            <>
              दिखाए जा रहे हैं: <span className="font-bold text-white">{totalCount}</span> मॉडल
            </>
          ) : (
            <>
              Showing <span className="font-bold text-white">{totalCount}</span> Models
            </>
          )}
        </div>
      </div>
    </div>
  );
};


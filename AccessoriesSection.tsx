import React, { useState, useMemo } from 'react';
import {
  Wrench,
  ShieldCheck,
  Search,
  Check,
  Sparkles,
  PhoneCall,
  Award,
  ChevronRight,
  Bike,
  X,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Tag,
  RotateCcw,
  Gift
} from 'lucide-react';
import { HeroAccessory, AccessoryCategory } from '../types';
import { HERO_ACCESSORIES } from '../data/accessories';
import { useLanguage } from '../context/LanguageContext';
import {
  VEHICLE_COMPATIBILITY_OPTIONS,
  checkAccessoryVehicleCompatibility,
  getAccessoryFitmentLabel,
  isUniversalAccessory,
} from '../utils/accessoryCompatibility';

interface AccessoriesSectionProps {
  onSelectAccessory: (accessory: HeroAccessory, vehicleModel?: string) => void;
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({
  onSelectAccessory,
}) => {
  const { t, language } = useLanguage();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [includeUniversal, setIncludeUniversal] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'featured' | 'name'>('featured');

  // Popular quick-filter models for fast 1-tap switching
  const quickVehiclePills = useMemo(
    () => [
      { id: 'all', label: language === 'hi' ? 'सभी मॉडल' : 'All Models', icon: '🏍️' },
      { id: 'splendor', label: 'Splendor+', icon: '⚡' },
      { id: 'xpulse', label: 'XPulse 200', icon: '⛰️' },
      { id: 'xtreme', label: 'Xtreme 160R', icon: '🏁' },
      { id: 'destini', label: 'Destini 125', icon: '🛵' },
      { id: 'pleasure', label: 'Pleasure+', icon: '✨' },
      { id: 'karizma', label: 'Karizma XMR', icon: '🚀' },
      { id: 'universal', label: language === 'hi' ? 'यूनिवर्सल' : 'Universal Fits', icon: '🌐' },
    ],
    [language]
  );

  // Quick preset keyword search tags
  const quickSearchTags = useMemo(
    () => [
      { label: language === 'hi' ? '🪖 हेलमेट' : '🪖 Helmets', query: 'helmet' },
      { label: language === 'hi' ? '🛡️ लेग गार्ड' : '🛡️ Leg Guards', query: 'guard' },
      { label: language === 'hi' ? '💺 सीट कवर' : '💺 Seat Cover', query: 'seat' },
      { label: language === 'hi' ? '🌧️ बाइक कवर' : '🌧️ Bike Cover', query: 'cover' },
      { label: language === 'hi' ? '📱 मोबाइल चार्जर' : '📱 Mobile Charger', query: 'mobile' },
      { label: language === 'hi' ? '💡 LED फॉग लाइट' : '💡 LED Fog Light', query: 'fog' },
      { label: language === 'hi' ? '🔒 एंटी-थेफ्ट अलार्म' : '🔒 Anti-Theft', query: 'alarm' },
      { label: language === 'hi' ? '🛢️ 4T इंजन ऑयल' : '🛢️ 4T Engine Oil', query: 'oil' },
    ],
    [language]
  );

  // Dynamic Category definitions with live counts based on vehicle filter
  const categories = useMemo(() => {
    const getCount = (catId: AccessoryCategory) => {
      return HERO_ACCESSORIES.filter((item) => {
        const matchesCat = catId === 'all' || item.category === catId;
        const matchesVeh = checkAccessoryVehicleCompatibility(item, selectedVehicle, includeUniversal);
        return matchesCat && matchesVeh;
      }).length;
    };

    return [
      {
        id: 'all' as const,
        label: language === 'hi' ? 'सभी असली पार्ट्स' : 'All Categories',
        count: getCount('all'),
      },
      {
        id: 'helmets' as const,
        label: language === 'hi' ? 'हेलमेट और राइडर सुरक्षा' : 'Helmets & Rider Safety',
        count: getCount('helmets'),
      },
      {
        id: 'guards' as const,
        label: language === 'hi' ? 'क्रैश और बॉडी सुरक्षा' : 'Crash & Body Protection',
        count: getCount('guards'),
      },
      {
        id: 'comfort' as const,
        label: language === 'hi' ? 'सीट कवर और कम्फर्ट' : 'Seat Covers & Comfort',
        count: getCount('comfort'),
      },
      {
        id: 'touring' as const,
        label: language === 'hi' ? 'टूरिंग और लगेज' : 'Touring & Luggage',
        count: getCount('touring'),
      },
      {
        id: 'care' as const,
        label: language === 'hi' ? 'रखरखाव और सुरक्षा' : 'Maintenance & Security',
        count: getCount('care'),
      },
    ];
  }, [language, selectedVehicle, includeUniversal]);

  // Main filtered accessories list
  const filteredAccessories = useMemo(() => {
    const list = HERO_ACCESSORIES.filter((item) => {
      // 1. Category Filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      // 2. Compatible Vehicle Model Filter
      const matchesVehicle = checkAccessoryVehicleCompatibility(
        item,
        selectedVehicle,
        includeUniversal
      );
      if (!matchesVehicle) return false;

      // 3. Search Query Filter (Searches part name, Hindi name, part #, compatibility, features, description)
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        (item.hindiTitle && item.hindiTitle.toLowerCase().includes(q)) ||
        item.partNumber.toLowerCase().includes(q) ||
        item.compatibility.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.features.some((f) => f.toLowerCase().includes(q));

      return matchesSearch;
    });

    // Sorting
    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [selectedCategory, selectedVehicle, includeUniversal, searchQuery, sortBy]);

  // Selected vehicle option object
  const activeVehicleOption = useMemo(
    () => VEHICLE_COMPATIBILITY_OPTIONS.find((v) => v.id === selectedVehicle),
    [selectedVehicle]
  );

  // Active category object
  const activeCategoryObj = useMemo(
    () => categories.find((c) => c.id === selectedCategory),
    [categories, selectedCategory]
  );

  // Reset all filters to default
  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedVehicle('all');
    setIncludeUniversal(true);
    setSortBy('featured');
  };

  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedVehicle !== 'all' ||
    !includeUniversal;

  return (
    <section id="dealership-accessories-section" className="py-14 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6181F]/15 border border-[#D6181F]/30 text-[#D6181F] text-[10px] font-bold uppercase tracking-widest mb-2">
              <Wrench className="w-3 h-3" />
              {language === 'hi'
                ? 'श्री राम हीरो • असली सहायक उपकरण एवं पुर्जे विभाग'
                : 'Shri Ram Hero • Genuine Accessories & Spares Department'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani']">
              {language === 'hi' ? 'हीरो जेन्युइन' : 'HERO GENUINE'}{' '}
              <span className="text-[#D6181F]">
                {language === 'hi' ? 'एक्सेसरीज (HGA)' : 'ACCESSORIES (HGA)'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'हीरो मोटोकॉर्प द्वारा प्रमाणित 100% असली सहायक उपकरण। अपनी बाइक या स्कूटर के मॉडल के अनुसार सही पार्ट्स तुरंत खोजें।'
                : 'Explore 100% factory-certified Hero Genuine Accessories (HGA). Search and filter by category or compatible two-wheeler model for guaranteed precision fitment.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#141414] border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs">
              <Award className="w-5 h-5 text-[#00FF88] shrink-0" />
              <div>
                <div className="font-bold text-white uppercase text-[11px] font-['Rajdhani']">
                  100% HGA Certified
                </div>
                <div className="text-[10px] text-gray-400">
                  Precision Factory Fit & Warranty
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FREE DELIVERY ACCESSORIES KIT SHOWCASE BANNER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#161616] to-[#121212] border border-emerald-500/35 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5" />
                <span>
                  {language === 'hi'
                    ? 'प्रत्येक नए वाहन के साथ 100% मुफ्त एक्सेसरीज किट'
                    : '100% FREE Delivery Accessories Kit Included With Every Vehicle'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase font-['Rajdhani']">
                {language === 'hi'
                  ? 'फ्री एक्सेसरीज़: हेलमेट, सीट कवर, साइलेंसर कवर, साइड मिरर, फर्स्ट एड किट, टूल किट आदि।'
                  : 'Free Accessories: Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.'}
              </h3>
              <p className="text-xs text-gray-300">
                {language === 'hi'
                  ? 'श्री राम हीरो, देहरा मोड़, नदबई (भरतपुर) में प्रत्येक नई बाइक या स्कूटर की डिलीवरी पर सभी आवश्यक ओरिजिनल किट बिल्कुल मुफ्त दिए जाते हैं।'
                  : 'Delivered free with each new Hero vehicle at Shri Ram Hero, Dehra Mod, Nadbai, Bharatpur, Raj.'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setSearchQuery('free')}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'फ्री किट पार्ट्स देखें' : 'View Free Kit Items'}
              </button>
              <a
                href="tel:8890992086"
                className="px-4 py-2 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#D6181F]/30"
              >
                Agency: 8890992086
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE SEARCH & FILTER COMMAND CONTROL CENTER */}
        {/* ========================================================================= */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5 shadow-2xl">
          {/* Row 1: Search Input + Compatible Vehicle Dropdown + Universal Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
            {/* Search Input Box */}
            <div className="lg:col-span-6 relative">
              <label htmlFor="accessory-search-input" className="sr-only">
                Search accessories by part name or bike model
              </label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="accessory-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'पार्ट नाम, बाइक मॉडल या पार्ट # खोजें (जैसे स्प्लेंडर, एक्सपल्स, हेलमेट)...'
                    : 'Search by part name, vehicle model (e.g. Splendor, XPulse, Destini, Helmet)...'
                }
                className="w-full pl-10 pr-20 py-3 bg-[#181818] border border-white/15 focus:border-[#D6181F] rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D6181F] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    id="btn-clear-accessory-search"
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-500 hidden sm:inline uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                    ESC
                  </span>
                )}
              </div>
            </div>

            {/* Compatible Vehicle Model Filter Dropdown */}
            <div className="lg:col-span-4 relative">
              <label
                htmlFor="accessory-vehicle-filter"
                className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1 flex items-center gap-1"
              >
                <Bike className="w-3 h-3 text-[#D6181F]" />
                <span>
                  {language === 'hi' ? 'अनुकूल वाहन मॉडल:' : 'Compatible Vehicle Model:'}
                </span>
              </label>
              <div className="relative">
                <select
                  id="accessory-vehicle-filter"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full py-2.5 px-3.5 pr-8 bg-[#181818] border border-white/15 focus:border-[#D6181F] rounded-xl text-xs sm:text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#D6181F] appearance-none cursor-pointer"
                >
                  <option value="all">
                    {language === 'hi' ? '🚗 सभी हीरो वाहन (सभी पार्ट्स)' : '🏍️ All Vehicles (All Accessories)'}
                  </option>
                  <option value="universal">
                    🌐 {language === 'hi' ? 'यूनिवर्सल फिटमेंट (सभी 2-व्हीलर्स)' : 'Universal Fit (All 2-Wheelers)'}
                  </option>
                  <optgroup label="Popular Commuters">
                    <option value="splendor">⚡ Splendor+ & Splendor XTEC</option>
                    <option value="hf-deluxe">🏍️ HF Deluxe</option>
                    <option value="passion">🏍️ Passion+ & Passion XTEC</option>
                    <option value="glamour">🏍️ Glamour & Glamour XTEC</option>
                  </optgroup>
                  <optgroup label="Adventure & Performance">
                    <option value="xpulse">⛰️ XPulse 200 4V / 200T</option>
                    <option value="xtreme">🏁 Xtreme 160R / 250R</option>
                    <option value="karizma">🚀 Karizma XMR 210</option>
                    <option value="mavrick">🛡️ Mavrick 440</option>
                  </optgroup>
                  <optgroup label="Scooters & Electric EV">
                    <option value="destini">🛵 Destini 125 & XTEC</option>
                    <option value="pleasure">🛵 Pleasure+ & XTEC</option>
                    <option value="xoom">🛵 Xoom 110 & Combat</option>
                    <option value="vida">⚡ VIDA V1 Electric Scooter</option>
                  </optgroup>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2">
              <label
                htmlFor="accessory-sort-filter"
                className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1"
              >
                {language === 'hi' ? 'क्रमबद्ध करें:' : 'Sort By:'}
              </label>
              <select
                id="accessory-sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-[#181818] border border-white/15 focus:border-[#D6181F] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="featured">{language === 'hi' ? 'लोकप्रिय (फीचर्ड)' : 'Featured'}</option>
                <option value="name">{language === 'hi' ? 'नाम (A-Z)' : 'Name (A-Z)'}</option>
              </select>
            </div>
          </div>

          {/* Row 2: Quick Vehicle Model Pills + Include Universal Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#D6181F]" />
                <span className="hidden sm:inline">{language === 'hi' ? 'त्वरित मॉडल:' : 'Quick Model:'}</span>
              </span>
              {quickVehiclePills.map((pill) => {
                const isSelected = selectedVehicle === pill.id;
                return (
                  <button
                    key={pill.id}
                    id={`quick-vehicle-${pill.id}`}
                    type="button"
                    onClick={() => setSelectedVehicle(pill.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-sm shadow-[#D6181F]/30'
                        : 'bg-[#181818] text-gray-300 border-white/10 hover:text-white hover:border-white/25 hover:bg-[#222]'
                    }`}
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Universal Accessories Checkbox Toggle (active only when a specific vehicle is selected) */}
            {selectedVehicle !== 'all' && selectedVehicle !== 'universal' && (
              <label
                htmlFor="toggle-include-universal"
                className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer shrink-0 select-none bg-[#181818] px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                title="Universal accessories (like helmets, mobile chargers, body covers) fit all Hero two-wheelers"
              >
                <input
                  id="toggle-include-universal"
                  type="checkbox"
                  checked={includeUniversal}
                  onChange={(e) => setIncludeUniversal(e.target.checked)}
                  className="rounded border-white/20 text-[#D6181F] focus:ring-[#D6181F] bg-black cursor-pointer accent-[#D6181F]"
                />
                <span className="text-[11px] font-medium">
                  {language === 'hi'
                    ? 'यूनिवर्सल पार्ट्स भी शामिल करें (हेलमेट, चार्जर आदि)'
                    : 'Include Universal Parts (Helmets, Chargers, etc.)'}
                </span>
              </label>
            )}
          </div>

          {/* Row 3: Category Filter Pills with dynamic counts */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#D6181F]" />
                <span>{language === 'hi' ? 'श्रेणी अनुसार फ़िल्टर करें:' : 'Filter by Accessory Category:'}</span>
              </span>
              <span className="text-[11px] text-gray-400">
                {filteredAccessories.length} {language === 'hi' ? 'पार्ट्स उपलब्ध' : 'Parts Available'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-filter-btn-${cat.id}`}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-md shadow-[#D6181F]/30'
                        : 'bg-[#181818] text-gray-400 border-white/10 hover:text-white hover:border-white/20 hover:bg-[#202020]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Quick Search Keyword Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mr-1">
              {language === 'hi' ? 'त्वरित खोज:' : 'Quick Tags:'}
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag.query}
                type="button"
                onClick={() => setSearchQuery(tag.query)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                  searchQuery.toLowerCase().includes(tag.query.toLowerCase())
                    ? 'bg-[#D6181F]/20 text-white border-[#D6181F]/50 font-bold'
                    : 'bg-[#181818] text-gray-400 hover:text-white border-white/5 hover:border-white/15'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Row 5: Active Filters Bar (when any filter is active) */}
          {isAnyFilterActive && (
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2.5 bg-[#0e0e0e] -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-3 sm:px-6 rounded-b-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-gray-400">
                  {language === 'hi' ? 'सक्रिय फ़िल्टर:' : 'Active Filters:'}
                </span>

                {/* Search query chip */}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f1f1f] border border-white/15 text-xs text-white">
                    <span className="text-gray-400">Keyword:</span>
                    <span className="font-bold">"{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-[#D6181F] cursor-pointer"
                      title="Remove keyword filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Vehicle model chip */}
                {selectedVehicle !== 'all' && activeVehicleOption && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f1f1f] border border-white/15 text-xs text-white">
                    <span className="text-gray-400">Vehicle:</span>
                    <span className="font-bold text-[#D6181F]">{activeVehicleOption.label}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedVehicle('all')}
                      className="hover:text-[#D6181F] cursor-pointer"
                      title="Remove vehicle filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Category chip */}
                {selectedCategory !== 'all' && activeCategoryObj && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f1f1f] border border-white/15 text-xs text-white">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-bold text-white">{activeCategoryObj.label}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="hover:text-[#D6181F] cursor-pointer"
                      title="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Model Specific only chip (if universal is toggled off) */}
                {selectedVehicle !== 'all' && !includeUniversal && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
                    <span>Model-Specific Only</span>
                    <button
                      type="button"
                      onClick={() => setIncludeUniversal(true)}
                      className="hover:text-white cursor-pointer"
                      title="Include universal accessories"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Reset All Button & Result Summary */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium">
                  {filteredAccessories.length} of {HERO_ACCESSORIES.length} parts
                </span>
                <button
                  id="btn-reset-all-accessory-filters"
                  type="button"
                  onClick={handleResetAllFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-white/10"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset All'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ACCESSORIES PRODUCT GRID SHOWCASE */}
        {/* ========================================================================= */}
        {filteredAccessories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAccessories.map((acc) => {
              const savings = acc.originalPrice ? acc.originalPrice - acc.price : 0;
              const fitment = getAccessoryFitmentLabel(acc, selectedVehicle);

              return (
                <div
                  key={acc.id}
                  id={`accessory-card-${acc.id}`}
                  className="bg-[#141414] border border-white/10 hover:border-[#D6181F]/50 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col group shadow-lg hover:shadow-2xl hover:shadow-[#D6181F]/10"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-44 bg-[#0a0a0a] overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={acc.image}
                      alt={acc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      {acc.badge && (
                        <span className="bg-[#D6181F] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                          {acc.badge}
                        </span>
                      )}
                    </div>

                    {/* Compatibility Fitment Tag on Image */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md border ${
                          fitment.type === 'exact'
                            ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        {fitment.label}
                      </span>
                    </div>

                    {/* Part Number Badge */}
                    <span className="absolute bottom-2 left-3 text-[10px] font-mono text-gray-300 bg-black/75 px-2 py-0.5 rounded border border-white/15">
                      {acc.partNumber}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#D6181F] uppercase tracking-wider">
                        <span>{acc.categoryLabel}</span>
                        {acc.inStock && (
                          <span className="text-[#00FF88] flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                            In Stock
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wide line-clamp-2 mt-1 group-hover:text-[#D6181F] transition-colors leading-snug">
                        {acc.name}
                      </h3>

                      {acc.hindiTitle && (
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {acc.hindiTitle}
                        </p>
                      )}

                      {/* Explicit Compatibility Pill Box */}
                      <div className="mt-2.5 text-[10px] text-gray-300 bg-[#0d0d0d] p-2 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                            Compatible With:
                          </span>
                          {isUniversalAccessory(acc) ? (
                            <span className="text-[9px] font-semibold text-blue-400">Universal Hero Fit</span>
                          ) : (
                            <span className="text-[9px] font-semibold text-amber-400">Model Specific</span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-gray-300 font-medium">
                          {acc.compatibility}
                        </p>
                      </div>

                      {/* Top Features List */}
                      <ul className="mt-2.5 space-y-1">
                        {acc.features.slice(0, 2).map((feat, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-gray-400 flex items-start gap-1.5 line-clamp-1"
                          >
                            <Check className="w-3 h-3 text-[#00FF88] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & Reservation CTA */}
                    <div className="pt-2.5 border-t border-white/5">
                      <div className="flex items-baseline justify-between mb-2.5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#D6181F] uppercase font-['Rajdhani'] tracking-wider">
                            Price = Best Price
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-white font-['Rajdhani']">
                              ₹{acc.price.toLocaleString()}
                            </span>
                            {acc.originalPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{acc.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {savings > 0 && (
                          <span className="text-[10px] text-[#00FF88] font-bold bg-[#00FF88]/10 px-1.5 py-0.5 rounded border border-[#00FF88]/25">
                            Save ₹{savings}
                          </span>
                        )}
                      </div>

                      <button
                        id={`btn-reserve-acc-${acc.id}`}
                        type="button"
                        onClick={() => {
                          const preferredModel =
                            selectedVehicle !== 'all' && selectedVehicle !== 'universal' && activeVehicleOption
                              ? activeVehicleOption.label
                              : undefined;
                          onSelectAccessory(acc, preferredModel);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#222] hover:bg-[#D6181F] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:bg-[#D6181F]"
                      >
                        <span>{t.accessories.reserveAtDealership}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search & Filter State */
          <div className="text-center py-14 bg-[#141414] rounded-2xl border border-white/10 space-y-4 max-w-2xl mx-auto p-6 shadow-xl">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[#D6181F]">
              <Wrench className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                {language === 'hi' ? 'कोई मेल खाने वाला पार्ट नहीं मिला' : 'No Compatible Accessories Found'}
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? `We couldn't find any accessories matching "${searchQuery}"`
                  : 'No accessories found'}
                {selectedVehicle !== 'all' && activeVehicleOption
                  ? ` for ${activeVehicleOption.label}`
                  : ''}
                {selectedCategory !== 'all' && activeCategoryObj
                  ? ` in "${activeCategoryObj.label}"`
                  : ''}
                .
              </p>
            </div>

            {/* Quick Action Buttons to Loosen Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-2 rounded-lg bg-[#222] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Clear Search Keyword
                </button>
              )}

              {selectedVehicle !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedVehicle('all')}
                  className="px-3.5 py-2 rounded-lg bg-[#222] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Show All Vehicles
                </button>
              )}

              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-3.5 py-2 rounded-lg bg-[#222] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Show All Categories
                </button>
              )}

              <button
                type="button"
                onClick={handleResetAllFilters}
                className="px-4 py-2 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase transition-all shadow-md shadow-[#D6181F]/30 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>

            {/* Spares Hotline Callout in Empty State */}
            <div className="pt-4 border-t border-white/5 text-xs text-gray-400 flex items-center justify-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#00FF88]" />
              <span>
                Need a specific Hero spare part? Call Shri Ram Hero Spares Desk directly:{' '}
                <a
                  href="tel:8890992086"
                  className="text-white font-bold hover:text-[#D6181F] underline"
                >
                  8890992086
                </a>
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEALERSHIP FITTING & ASSURANCE BADGES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5 flex items-start gap-3.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/30 flex items-center justify-center text-[#D6181F] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-['Rajdhani']">
                100% Genuine Hero Quality
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                Direct factory parts with zero compromise on tensile strength, materials, and safety certification.
              </p>
            </div>
          </div>

          <div className="bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5 flex items-start gap-3.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/25 flex items-center justify-center text-[#00FF88] shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-['Rajdhani']">
                Expert Dealership Installation
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                Installed by certified technicians at Shri Ram Hero service centers. Preserves your factory vehicle warranty.
              </p>
            </div>
          </div>

          <div className="bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5 flex items-start gap-3.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-['Rajdhani']">
                Agency Spares Helpline
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                Need a specific Hero spare part or bolt? Call Shri Ram Hero Spares Desk directly at 8890992086.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

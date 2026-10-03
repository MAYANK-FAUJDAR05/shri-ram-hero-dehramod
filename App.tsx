/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { HERO_VEHICLES } from './data/vehicles';
import { HeroVehicle, MainFilter, VehicleCategory, HeroAccessory } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { BestPriceModal } from './components/BestPriceModal';
import { FinancialCalculatorModal } from './components/FinancialCalculatorModal';
import { AccessoriesSection } from './components/AccessoriesSection';
import { AccessoryInquiryModal } from './components/AccessoryInquiryModal';
import { GeminiChatModal } from './components/GeminiChatModal';
import { VehicleCompareModal } from './components/VehicleCompareModal';
import { DealershipFaqs } from './components/DealershipFaqs';
import { WishlistModal } from './components/WishlistModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AgencyFooter } from './components/AgencyFooter';
import { Sparkles, Bike, Zap, Calendar, ArrowRight, Wrench, Calculator, Bot, GitCompare, HelpCircle, Heart, RotateCw, Package, Lock, Shield, Tag } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useWishlist } from './context/WishlistContext';
import { HeroGenuinePartsStock } from './components/parts/HeroGenuinePartsStock';
import { AdminLogin } from './components/AdminLogin';

export default function App() {
  const { t, language } = useLanguage();
  const { favoritesCount } = useWishlist();
  const [activeAppView, setActiveAppView] = useState<'showroom' | 'parts_stock' | 'vehicle_stock'>('showroom');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [mainFilter, setMainFilter] = useState<MainFilter>('all');
  const [subCategory, setSubCategory] = useState<'all' | VehicleCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [selectedVehicleForVirtualTour, setSelectedVehicleForVirtualTour] = useState<HeroVehicle | null>(null);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState<boolean>(false);
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<HeroVehicle | null>(null);
  const [selectedVehicleForBestPrice, setSelectedVehicleForBestPrice] = useState<HeroVehicle | null>(null);
  const [isBestPriceOpen, setIsBestPriceOpen] = useState<boolean>(false);
  const [selectedAccessoryForInquiry, setSelectedAccessoryForInquiry] = useState<HeroAccessory | null>(null);
  const [selectedAccessoryVehicleModel, setSelectedAccessoryVehicleModel] = useState<string | undefined>(undefined);
  const [selectedVehicleForFinancialCalculator, setSelectedVehicleForFinancialCalculator] = useState<HeroVehicle | null>(null);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState<boolean>(false);
  const [vehicleForGeminiChat, setVehicleForGeminiChat] = useState<HeroVehicle | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareVehicle1, setCompareVehicle1] = useState<HeroVehicle | null>(null);
  const [compareVehicle2, setCompareVehicle2] = useState<HeroVehicle | null>(null);

  const handleOpenGeminiChat = (vehicle?: HeroVehicle | null) => {
    setVehicleForGeminiChat(vehicle || null);
    setIsGeminiChatOpen(true);
  };

  const handleOpenCompare = (v1?: HeroVehicle | null, v2?: HeroVehicle | null) => {
    const first = v1 || HERO_VEHICLES[0];
    const second = v2 || (first.id === HERO_VEHICLES[0].id ? HERO_VEHICLES[1] : HERO_VEHICLES[0]);
    setCompareVehicle1(first);
    setCompareVehicle2(second);
    setIsCompareOpen(true);
  };

  const handleOpenVirtualTour = (vehicle: HeroVehicle) => {
    setSelectedVehicleForVirtualTour(vehicle);
    setIsVirtualTourOpen(true);
  };

  const vehiclesSectionRef = useRef<HTMLDivElement>(null);
  const accessoriesSectionRef = useRef<HTMLDivElement>(null);
  const faqsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToVehicles = () => {
    if (vehiclesSectionRef.current) {
      vehiclesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAccessories = () => {
    if (accessoriesSectionRef.current) {
      accessoriesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFaqs = () => {
    if (faqsSectionRef.current) {
      faqsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFinancialCalculator = (vehicle: HeroVehicle) => {
    setSelectedVehicleForFinancialCalculator(vehicle);
  };

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return HERO_VEHICLES.filter((vehicle) => {
      // Main filter (all, bikes, scooters, ev)
      if (mainFilter === 'bikes' && vehicle.mainType !== 'bikes') return false;
      if (mainFilter === 'scooters' && vehicle.mainType !== 'scooters') return false;
      if (mainFilter === 'ev' && vehicle.mainType !== 'ev') return false;

      // Subcategory filter (commuter, premium, sports, scooter, ev)
      if (subCategory !== 'all' && vehicle.category !== subCategory) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = vehicle.name.toLowerCase().includes(query);
        const matchesTagline = vehicle.tagline.toLowerCase().includes(query);
        const matchesEngine = vehicle.specs.engine.toLowerCase().includes(query);
        const matchesFeatures = vehicle.features.some((f) => f.toLowerCase().includes(query));
        const matchesColors = vehicle.specs.colours.some((c) => c.toLowerCase().includes(query));
        return matchesName || matchesTagline || matchesEngine || matchesFeatures || matchesColors;
      }

      return true;
    });
  }, [mainFilter, subCategory, searchQuery]);

  // Modal handlers
  const handleViewDetails = (vehicle: HeroVehicle) => {
    setSelectedVehicleForDetail(vehicle);
  };

  const handleContactBestPrice = (vehicle: HeroVehicle) => {
    setSelectedVehicleForBestPrice(vehicle);
    setIsBestPriceOpen(true);
  };

  // Compute active filter name for display
  const activeFilterName = useMemo(() => {
    if (searchQuery.trim()) return `${language === 'hi' ? 'खोज' : 'Search'}: "${searchQuery}"`;
    if (subCategory === 'commuter') return language === 'hi' ? 'कम्यूटर बाइक्स' : 'Commuter Bikes';
    if (subCategory === 'premium') return language === 'hi' ? 'प्रीमियम कम्यूटर' : 'Premium Commuter';
    if (subCategory === 'sports') return language === 'hi' ? 'स्पोर्ट्स / परफॉरमेंस' : 'Sports / Performance';
    if (subCategory === 'scooter' || mainFilter === 'scooters') return language === 'hi' ? 'सभी स्कूटर' : 'All Scooters';
    if (subCategory === 'ev' || mainFilter === 'ev') return 'Vida EV';
    if (mainFilter === 'bikes') return language === 'hi' ? 'सभी मोटरसाइकिलें' : 'All Motorcycles';
    return language === 'hi' ? 'सभी हीरो वाहन' : 'All Hero Vehicles';
  }, [mainFilter, subCategory, searchQuery, language]);

  // If user selected Hero Genuine Parts Stock or Vehicle Stock dedicated module
  if (activeAppView === 'parts_stock' || activeAppView === 'vehicle_stock') {
    return (
      <HeroGenuinePartsStock
        onBackToShowroom={() => setActiveAppView('showroom')}
        initialTab={activeAppView === 'vehicle_stock' ? 'vehicle_stock' : 'master_list'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#D6181F] selection:text-white font-sans">
      {/* Top Navbar */}
      <Header
        onGetBestPriceClick={() => handleContactBestPrice(filteredVehicles[0] || HERO_VEHICLES[0])}
        onScrollToVehicles={scrollToVehicles}
        onScrollToAccessories={scrollToAccessories}
        onScrollToFaqs={scrollToFaqs}
        onOpenFinanceCalculator={() => handleOpenFinancialCalculator(filteredVehicles[0] || HERO_VEHICLES[0])}
        onOpenGeminiChat={() => handleOpenGeminiChat(null)}
        onOpenCompare={() => handleOpenCompare()}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenVirtualTour={() => handleOpenVirtualTour(filteredVehicles[0] || HERO_VEHICLES[0])}
        onOpenVehicleStock={() => setActiveAppView('vehicle_stock')}
        isVehicleStockActive={activeAppView === 'vehicle_stock'}
        onOpenPartsStock={() => setActiveAppView('parts_stock')}
        isPartsStockActive={activeAppView === 'parts_stock'}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Hero Agency Banner */}
      <HeroBanner
        onSelectCategory={(tab) => {
          setMainFilter(tab);
          if (tab === 'bikes') setSubCategory('all');
          else if (tab === 'scooters') setSubCategory('scooter');
          else if (tab === 'ev') setSubCategory('ev');
          else setSubCategory('all');
          scrollToVehicles();
        }}
      />

      {/* Main Showcase Section */}
      <main
        ref={vehiclesSectionRef}
        id="our-hero-vehicles-section"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6181F]/15 border border-[#D6181F]/30 text-[#D6181F] text-[10px] font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" />
              {language === 'hi' ? 'संपूर्ण टू-व्हीलर शोरूम' : 'Complete Two-Wheeler Showroom'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-['Rajdhani']">
              {language === 'hi' ? 'हमारे हीरो' : 'OUR HERO'}{' '}
              <span className="text-[#D6181F]">{language === 'hi' ? 'वाहन' : 'VEHICLES'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl leading-relaxed">
              {language === 'hi'
                ? 'प्रामाणिक विनिर्देशों, मॉडल-विशिष्ट विशेषताओं की जांच करने या टेस्ट राइड बुक करने के लिए नीचे किसी भी हीरो मोटरसाइकिल, स्कूटर या इलेक्ट्रिक वाहन का चयन करें।'
                : 'Select any Hero motorcycle, scooter, or electric vehicle below to inspect authentic specifications, model-specific features, or book a test ride.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="showroom-btn-virtual-tour"
              onClick={() => handleOpenVirtualTour(filteredVehicles[0] || HERO_VEHICLES[0])}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm relative group"
              title="Launch 360° Interactive Virtual Tour"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#D6181F] group-hover:rotate-180 transition-transform duration-500" />
              <span>360° {language === 'hi' ? 'वर्चुअल टूर' : 'Virtual Tour'}</span>
            </button>
            <button
              id="showroom-btn-wishlist"
              onClick={() => setIsWishlistOpen(true)}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm relative group"
              title="View Saved Vehicles"
            >
              <Heart className="w-3.5 h-3.5 text-[#D6181F] fill-[#D6181F]/40 group-hover:fill-[#D6181F] transition-all" />
              <span>{language === 'hi' ? 'सहेजे गए' : 'Saved'}</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#D6181F] text-white text-[9px] font-mono font-bold leading-tight">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              id="btn-open-vehicle-compare"
              onClick={() => handleOpenCompare(filteredVehicles[0] || HERO_VEHICLES[0])}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-gray-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Compare any two Hero vehicles side-by-side"
            >
              <GitCompare className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>{t.header.compare}</span>
            </button>
            <button
              onClick={() => handleOpenGeminiChat(filteredVehicles[0] || HERO_VEHICLES[0])}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-[#D6181F] text-xs font-bold uppercase tracking-wider border border-[#D6181F]/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>{language === 'hi' ? 'AI सलाहकार' : 'Ask AI Advisor'}</span>
            </button>
            <button
              onClick={() => handleOpenFinancialCalculator(filteredVehicles[0] || HERO_VEHICLES[0])}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-yellow-400 text-xs font-bold uppercase tracking-wider border border-yellow-400/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t.header.emiCalc}</span>
            </button>
            <button
              onClick={scrollToAccessories}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t.header.accessories}</span>
            </button>
            <button
              id="showroom-btn-parts-stock"
              onClick={() => setActiveAppView('parts_stock')}
              className="px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-amber-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-amber-400/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Hero Genuine Parts Master List (Categories 1 to 45)"
            >
              <Package className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>{language === 'hi' ? 'हीरो पार्ट्स मास्टर लिस्ट (1-45)' : 'Parts Master List (1-45)'}</span>
            </button>
            <button
              onClick={() => handleContactBestPrice(filteredVehicles[0] || HERO_VEHICLES[0])}
              className="px-4 py-2 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'hi' ? 'कीमत = सर्वश्रेष्ठ कीमत' : 'Price = Best Price'}</span>
            </button>
          </div>
        </div>

        {/* Layout with Sidebar & Content matching Immersive UI */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Immersive UI Desktop Sidebar */}
          <aside className="hidden lg:flex w-64 bg-[#111] border border-white/5 rounded-2xl flex-col p-6 shrink-0 sticky top-24 self-start shadow-2xl">
            <h2 className="text-[10px] font-bold text-[#D6181F] uppercase tracking-[0.2em] mb-6">
              Categories
            </h2>

            <div className="flex flex-col gap-6 text-xs">
              {/* All Vehicles */}
              <div>
                <button
                  onClick={() => {
                    setMainFilter('all');
                    setSubCategory('all');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left border-l-2 py-1 transition-all cursor-pointer ${
                    mainFilter === 'all' && subCategory === 'all'
                      ? 'border-[#D6181F] pl-3 text-white font-bold bg-white/[0.03] rounded-r'
                      : 'border-transparent pl-3 text-gray-400 hover:text-white'
                  }`}
                >
                  All Vehicles ({HERO_VEHICLES.length})
                </button>
              </div>

              {/* Motorcycles */}
              <div>
                <span className="text-gray-500 uppercase tracking-widest text-[9px] block mb-2 font-bold">
                  Motorcycles
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setMainFilter('bikes');
                      setSubCategory('all');
                      setSearchQuery('');
                    }}
                    className={`text-left border-l-2 py-1 transition-all cursor-pointer ${
                      mainFilter === 'bikes' && subCategory === 'all'
                        ? 'border-[#D6181F] pl-3 text-white font-bold bg-white/[0.03] rounded-r'
                        : 'border-transparent pl-3 text-gray-400 hover:text-white'
                    }`}
                  >
                    All Motorcycles
                  </button>

                  <button
                    onClick={() => {
                      setMainFilter('bikes');
                      setSubCategory('commuter');
                      setSearchQuery('');
                    }}
                    className={`text-left border-l-2 py-1 transition-all cursor-pointer ${
                      subCategory === 'commuter'
                        ? 'border-[#D6181F] pl-3 text-white font-bold bg-white/[0.03] rounded-r'
                        : 'border-transparent pl-3 text-gray-400 hover:text-white'
                    }`}
                  >
                    Commuter Bikes
                  </button>

                  <button
                    onClick={() => {
                      setMainFilter('bikes');
                      setSubCategory('premium');
                      setSearchQuery('');
                    }}
                    className={`text-left border-l-2 py-1 transition-all cursor-pointer ${
                      subCategory === 'premium'
                        ? 'border-[#D6181F] pl-3 text-white font-bold bg-white/[0.03] rounded-r'
                        : 'border-transparent pl-3 text-gray-400 hover:text-white'
                    }`}
                  >
                    Premium Commuter
                  </button>

                  <button
                    onClick={() => {
                      setMainFilter('bikes');
                      setSubCategory('sports');
                      setSearchQuery('');
                    }}
                    className={`text-left border-l-2 py-1 transition-all cursor-pointer ${
                      subCategory === 'sports'
                        ? 'border-[#D6181F] pl-3 text-white font-bold bg-white/[0.03] rounded-r'
                        : 'border-transparent pl-3 text-gray-400 hover:text-white'
                    }`}
                  >
                    Sports / Performance
                  </button>
                </div>
              </div>

              {/* Scooters */}
              <div>
                <span className="text-gray-500 uppercase tracking-widest text-[9px] block mb-2 font-bold">
                  Scooters
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setMainFilter('scooters');
                      setSubCategory('scooter');
                      setSearchQuery('');
                    }}
                    className={`text-left border-l-2 py-1 transition-all cursor-pointer ${
                      mainFilter === 'scooters' || subCategory === 'scooter'
                        ? 'border-[#D6181F] pl-3 text-white font-bold bg-white/[0.03] rounded-r'
                        : 'border-transparent pl-3 text-gray-400 hover:text-white'
                    }`}
                  >
                    All Scooter Models
                  </button>
                </div>
              </div>

              {/* Electric */}
              <div>
                <span className="text-gray-500 uppercase tracking-widest text-[9px] block mb-2 font-bold">
                  Electric
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setMainFilter('ev');
                      setSubCategory('ev');
                      setSearchQuery('');
                    }}
                    className={`text-left border-l-2 py-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                      mainFilter === 'ev' || subCategory === 'ev'
                        ? 'border-[#00FF88] pl-3 text-[#00FF88] font-bold bg-white/[0.03] rounded-r'
                        : 'border-transparent pl-3 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                    Vida EV Series
                  </button>
                </div>
              </div>

              {/* Dealership Spares & Accessories */}
              <div>
                <span className="text-gray-500 uppercase tracking-widest text-[9px] block mb-2 font-bold">
                  Dealership Spares
                </span>
                <button
                  type="button"
                  onClick={scrollToAccessories}
                  className="w-full text-left border-l-2 border-yellow-400/80 pl-3 py-1.5 text-xs text-yellow-400 hover:text-white font-bold bg-yellow-400/10 rounded-r flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    Hero Accessories
                  </span>
                  <span className="text-[9px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-mono">
                    HGA
                  </span>
                </button>

                <button
                  type="button"
                  id="sidebar-btn-parts-stock"
                  onClick={() => setActiveAppView('parts_stock')}
                  className="w-full text-left border-l-2 border-[#D6181F] pl-3 py-1.5 mt-1.5 text-xs text-white hover:text-white font-bold bg-[#D6181F]/15 hover:bg-[#D6181F]/25 rounded-r flex items-center justify-between transition-colors cursor-pointer group"
                  title="Admin Portal • Hero Genuine Parts Stock"
                >
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#D6181F] group-hover:scale-110 transition-transform" />
                    <span>Admin • Parts Stock</span>
                  </span>
                  <span className="text-[9px] bg-[#D6181F] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    ADMIN
                  </span>
                </button>
              </div>

              {/* Vehicle Comparison Tool & FAQs & Wishlist */}
              <div>
                <span className="text-gray-500 uppercase tracking-widest text-[9px] block mb-2 font-bold">
                  Evaluation Tools
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    id="sidebar-btn-wishlist"
                    onClick={() => setIsWishlistOpen(true)}
                    className="w-full text-left border-l-2 border-[#D6181F] pl-3 py-1.5 text-xs text-gray-200 hover:text-white font-bold bg-white/[0.04] rounded-r flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#D6181F] fill-[#D6181F]/40 group-hover:fill-[#D6181F] transition-all" />
                      <span>{language === 'hi' ? 'सहेजे गए वाहन' : 'Saved Vehicles'}</span>
                    </span>
                    <span className="text-[9px] bg-[#D6181F]/20 text-[#D6181F] px-1.5 py-0.5 rounded font-mono font-bold">
                      {favoritesCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCompare(filteredVehicles[0] || HERO_VEHICLES[0])}
                    className="w-full text-left border-l-2 border-[#D6181F] pl-3 py-1.5 text-xs text-gray-200 hover:text-white font-bold bg-white/[0.04] rounded-r flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <GitCompare className="w-3.5 h-3.5 text-[#D6181F]" />
                      Compare Specs
                    </span>
                    <span className="text-[9px] bg-[#D6181F]/20 text-[#D6181F] px-1.5 py-0.5 rounded font-mono font-bold">
                      VS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={scrollToFaqs}
                    className="w-full text-left border-l-2 border-emerald-500/80 pl-3 py-1.5 text-xs text-emerald-400 hover:text-white font-bold bg-emerald-500/10 rounded-r flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Dealership FAQs
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      NEW
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Immersive UI Sidebar Promo Card */}
            <div className="mt-8 p-4 bg-[#D6181F]/10 border border-[#D6181F]/20 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-[#D6181F] block uppercase tracking-wider">
                Festive Benefits
              </span>
              <p className="text-[11px] text-gray-400 leading-normal">
                Low 8.5% interest rates & instant exchange approvals.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenFinancialCalculator(filteredVehicles[0] || HERO_VEHICLES[0])}
                  className="flex-1 bg-black/60 text-yellow-400 border border-yellow-400/30 text-[10px] font-bold py-2 rounded uppercase hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  EMI Calc
                </button>
                <button
                  type="button"
                  onClick={() => handleContactBestPrice(filteredVehicles[0] || HERO_VEHICLES[0])}
                  className="flex-1 bg-[#D6181F] text-white text-[10px] font-bold py-2 rounded uppercase hover:bg-[#b5141a] transition-colors cursor-pointer shadow-md shadow-[#D6181F]/20"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 min-w-0 flex flex-col">
            {/* Filter Bar with Tabs & Search */}
            <FilterBar
              mainFilter={mainFilter}
              setMainFilter={setMainFilter}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalCount={filteredVehicles.length}
            />

            {/* Vehicle Cards Grid */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onViewDetails={handleViewDetails}
                    onContactBestPrice={handleContactBestPrice}
                    onOpenFinancialCalculator={handleOpenFinancialCalculator}
                    onCompare={(v) => handleOpenCompare(v, null)}
                    onOpenVirtualTour={handleOpenVirtualTour}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="text-center py-16 px-4 bg-[#111] rounded-2xl border border-white/5 space-y-4">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase">
                    No Hero Vehicles Found
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    We couldn't find any vehicle matching "{searchQuery}". Try searching for Splendor, Xtreme, Karizma, Xoom, Destini, or Vida.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMainFilter('all');
                    setSubCategory('all');
                  }}
                  className="px-4 py-2 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Reset Filters & Show All Vehicles
                </button>
              </div>
            )}

            {/* Consultation Banner */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#D6181F]/20 via-[#181818] to-[#111] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-[10px] font-bold text-[#D6181F] uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
                  <span>🏷️</span> Best Deal Assurance
                </div>
                <h3 className="text-xl font-bold text-white font-['Rajdhani'] uppercase">
                  Looking for corporate fleet or multiple two-wheelers?
                </h3>
                <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                  Our Hero Authorized Sales Consultants offer personalized on-road price estimates, finance packages through Hero FinCorp, and guaranteed exchange bonuses.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleContactBestPrice(HERO_VEHICLES[0])}
                  className="px-5 py-2.5 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer"
                >
                  {language === 'hi' ? 'कीमत = सर्वश्रेष्ठ कीमत' : 'Price = Best Price'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Hero Genuine Accessories Section */}
      <div ref={accessoriesSectionRef}>
        <AccessoriesSection
          onSelectAccessory={(accessory, vehicleModel) => {
            setSelectedAccessoryForInquiry(accessory);
            setSelectedAccessoryVehicleModel(vehicleModel);
          }}
        />
      </div>

      {/* Dealership FAQs Section: Servicing, Insurance & Warranty */}
      <div ref={faqsSectionRef}>
        <DealershipFaqs
          onOpenAiAdvisor={() => handleOpenGeminiChat(null)}
          onOpenContactBestPrice={() => handleContactBestPrice(HERO_VEHICLES[0])}
        />
      </div>

      {/* Interactive Modals */}
      {selectedVehicleForDetail && (
        <VehicleDetailModal
          vehicle={selectedVehicleForDetail}
          onClose={() => setSelectedVehicleForDetail(null)}
          onContactBestPrice={handleContactBestPrice}
          onSelectAccessory={(accessory) => setSelectedAccessoryForInquiry(accessory)}
          onOpenFinancialCalculator={handleOpenFinancialCalculator}
          onOpenGeminiChat={handleOpenGeminiChat}
          onOpenCompare={(v) => handleOpenCompare(v, null)}
          onOpenVirtualTour={handleOpenVirtualTour}
        />
      )}

      {/* Vehicle Specification Comparison Modal */}
      {isCompareOpen && (
        <VehicleCompareModal
          initialVehicle1={compareVehicle1}
          initialVehicle2={compareVehicle2}
          onClose={() => setIsCompareOpen(false)}
          onContactBestPrice={handleContactBestPrice}
          onOpenFinancialCalculator={(vehicle) => {
            setIsCompareOpen(false);
            handleOpenFinancialCalculator(vehicle);
          }}
          onViewDetails={(vehicle) => {
            setIsCompareOpen(false);
            handleViewDetails(vehicle);
          }}
          onOpenGeminiChat={(vehicle) => {
            setIsCompareOpen(false);
            handleOpenGeminiChat(vehicle);
          }}
        />
      )}

      {selectedVehicleForFinancialCalculator && (
        <FinancialCalculatorModal
          vehicle={selectedVehicleForFinancialCalculator}
          onClose={() => setSelectedVehicleForFinancialCalculator(null)}
        />
      )}

      {isBestPriceOpen && (
        <BestPriceModal
          initialVehicle={selectedVehicleForBestPrice}
          onClose={() => setIsBestPriceOpen(false)}
        />
      )}

      {selectedAccessoryForInquiry && (
        <AccessoryInquiryModal
          accessory={selectedAccessoryForInquiry}
          initialVehicleModel={selectedAccessoryVehicleModel}
          onClose={() => {
            setSelectedAccessoryForInquiry(null);
            setSelectedAccessoryVehicleModel(undefined);
          }}
        />
      )}

      {/* Gemini Multi-turn Chatbot Modal */}
      <GeminiChatModal
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        initialVehicle={vehicleForGeminiChat}
      />

      {/* Floating Wishlist Trigger Button */}
      <button
        id="floating-wishlist-btn"
        type="button"
        onClick={() => setIsWishlistOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#141414]/95 hover:bg-[#1c1c1c] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-[#D6181F]/30 hover:border-[#D6181F]/60 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20 backdrop-blur-md group cursor-pointer"
        aria-label="View Saved Vehicles (Wishlist)"
      >
        <div className="relative flex items-center justify-center">
          <Heart className="w-5 h-5 text-[#D6181F] fill-[#D6181F] group-hover:scale-110 transition-transform" />
          {favoritesCount > 0 && (
            <span
              id="floating-wishlist-badge"
              className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-[#D6181F] text-white text-[9px] font-black rounded-full flex items-center justify-center font-mono border border-black shadow"
            >
              {favoritesCount}
            </span>
          )}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider font-['Rajdhani'] leading-tight">
            {language === 'hi' ? 'सहेजे गए वाहन' : 'Saved Vehicles'}
          </span>
          <span className="text-[9px] text-gray-400 font-medium leading-none">
            {favoritesCount} {language === 'hi' ? 'मॉडल' : favoritesCount === 1 ? 'model' : 'models'}
          </span>
        </div>
      </button>

      {/* Floating Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onViewDetails={(vehicle) => {
          setSelectedVehicleForDetail(vehicle);
          setIsWishlistOpen(false);
        }}
        onContactBestPrice={(vehicle) => {
          handleContactBestPrice(vehicle);
          setIsWishlistOpen(false);
        }}
        onCompare={(v1, v2) => {
          handleOpenCompare(v1, v2);
          setIsWishlistOpen(false);
        }}
        onOpenVirtualTour={(vehicle) => {
          handleOpenVirtualTour(vehicle);
          setIsWishlistOpen(false);
        }}
        onExploreVehicles={() => {
          scrollToVehicles();
        }}
      />

      {/* 360° Interactive Virtual Tour Modal */}
      <VirtualTourModal
        isOpen={isVirtualTourOpen}
        vehicle={selectedVehicleForVirtualTour}
        onClose={() => setIsVirtualTourOpen(false)}
        onContactBestPrice={(vehicle) => {
          setIsVirtualTourOpen(false);
          handleContactBestPrice(vehicle);
        }}
        onViewDetails={(vehicle) => {
          setIsVirtualTourOpen(false);
          handleViewDetails(vehicle);
        }}
      />

      {/* Floating Hero AI Consultation Trigger */}
      <button
        id="floating-gemini-chat-btn"
        onClick={() => handleOpenGeminiChat(null)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#D6181F] to-[#b5141a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-[#D6181F]/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20 group cursor-pointer"
        aria-label="Open Hero AI Advisor Chat"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00FF88] rounded-full border-2 border-black animate-pulse" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[11px] font-black uppercase tracking-wider font-['Rajdhani'] leading-tight">
            Hero AI Advisor
          </span>
          <span className="text-[9px] text-white/80 font-medium leading-none">
            Ask specs & EMI
          </span>
        </div>
      </button>

      {/* Dealership Footer with filter status */}
      <AgencyFooter
        activeFilterName={activeFilterName}
        shownCount={filteredVehicles.length}
        totalCount={HERO_VEHICLES.length}
        onScrollToFaqs={scrollToFaqs}
      />

      {/* Central Admin Authentication Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setActiveAppView('parts_stock');
        }}
        variant="modal"
      />
    </div>
  );
}

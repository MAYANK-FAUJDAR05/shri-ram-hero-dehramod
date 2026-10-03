import React from 'react';
import { Phone, Clock, Tag, Sparkles, Wrench, Calculator, Bot, GitCompare, Globe, HelpCircle, Heart, RotateCw, Package, Lock, Bike } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  onGetBestPriceClick?: () => void;
  onScrollToVehicles: () => void;
  onScrollToAccessories?: () => void;
  onScrollToFaqs?: () => void;
  onOpenFinanceCalculator?: () => void;
  onOpenGeminiChat?: () => void;
  onOpenCompare?: () => void;
  onOpenWishlist?: () => void;
  onOpenVirtualTour?: () => void;
  onOpenVehicleStock?: () => void;
  isVehicleStockActive?: boolean;
  onOpenPartsStock?: () => void;
  isPartsStockActive?: boolean;
  onOpenAdminLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGetBestPriceClick,
  onScrollToVehicles,
  onScrollToAccessories,
  onScrollToFaqs,
  onOpenFinanceCalculator,
  onOpenGeminiChat,
  onOpenCompare,
  onOpenWishlist,
  onOpenVirtualTour,
  onOpenVehicleStock,
  isVehicleStockActive = false,
  onOpenPartsStock,
  isPartsStockActive = false,
  onOpenAdminLogin,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { favoritesCount } = useWishlist();

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-white/10">
      {/* Top Announcement Bar */}
      <div className="bg-[#111] border-b border-white/5 text-gray-300 text-xs font-semibold py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate text-[11px]">
            <span className="bg-[#D6181F] text-white text-[9px] uppercase font-black px-2 py-0.5 rounded tracking-widest shrink-0">
              {t.header.officialLineup}
            </span>
            <span className="truncate text-gray-400">
              {t.header.dealershipSub}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] shrink-0 text-gray-400">
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#D6181F]" /> {t.header.showroomHours}
            </span>
            <a
              href="tel:8890992086"
              className="hidden sm:flex items-center gap-1.5 font-bold text-white hover:text-[#D6181F] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D6181F]" /> {t.header.tollFree}
            </a>

            {/* Compact language switcher in top bar for quick mobile access */}
            <div className="flex items-center gap-1 bg-[#1c1c1c] px-1.5 py-0.5 rounded border border-white/10 text-[10px]">
              <Globe className="w-2.5 h-2.5 text-gray-400" />
              <button
                id="header-top-lang-en"
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1 rounded font-bold cursor-pointer transition-colors ${
                  language === 'en' ? 'text-[#D6181F]' : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-gray-600">|</span>
              <button
                id="header-top-lang-hi"
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1 rounded font-bold cursor-pointer transition-colors ${
                  language === 'hi' ? 'text-[#D6181F]' : 'text-gray-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar matching Immersive UI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo matching Immersive UI */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={onScrollToVehicles}>
          <div className="h-8 w-8 bg-[#D6181F] rounded-sm transform -skew-x-12 shrink-0 shadow-lg shadow-[#D6181F]/30 flex items-center justify-center">
            <span className="text-white font-black text-lg transform skew-x-12 font-['Rajdhani']">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white font-['Rajdhani'] uppercase leading-none">
              {language === 'hi' ? (
                <>श्री राम <span className="text-[#D6181F]">हीरो</span></>
              ) : (
                <>SHRI RAM <span className="text-[#D6181F]">HERO</span></>
              )}
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.16em] leading-tight mt-0.5">
              {t.header.brandTagline}
            </span>
          </div>
        </div>

        {/* Center Navigation Links matching Immersive UI */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-bold uppercase tracking-wider text-gray-400">
          <button
            onClick={onScrollToVehicles}
            className="text-[#D6181F] border-b-2 border-[#D6181F] pb-1 hover:text-white transition-colors cursor-pointer"
          >
            {t.header.ourVehicles}
          </button>
          <button
            onClick={onScrollToVehicles}
            className="hover:text-white transition-colors cursor-pointer pb-1 border-b-2 border-transparent"
          >
            {t.header.motorcycles}
          </button>
          <button
            onClick={onScrollToVehicles}
            className="hover:text-white transition-colors cursor-pointer pb-1 border-b-2 border-transparent"
          >
            {t.header.scooters}
          </button>
          <button
            onClick={onScrollToVehicles}
            className="text-[#00FF88] hover:text-white transition-colors cursor-pointer flex items-center gap-1 pb-1 border-b-2 border-transparent"
          >
            <Sparkles className="w-3 h-3 text-[#00FF88]" />
            {t.header.vidaEv}
          </button>
          <button
            onClick={onScrollToAccessories}
            className="hover:text-white text-yellow-400 transition-colors cursor-pointer flex items-center gap-1 pb-1 border-b-2 border-transparent"
          >
            <Wrench className="w-3 h-3 text-yellow-400" />
            {t.header.accessories}
          </button>
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 pb-1 border-b-2 border-transparent"
            >
              <GitCompare className="w-3 h-3 text-[#D6181F]" />
              {t.header.compare}
            </button>
          )}
          {onScrollToFaqs && (
            <button
              id="header-nav-btn-faqs"
              type="button"
              onClick={onScrollToFaqs}
              className="hover:text-white text-gray-300 transition-colors cursor-pointer flex items-center gap-1 pb-1 border-b-2 border-transparent"
            >
              <HelpCircle className="w-3 h-3 text-[#D6181F]" />
              <span>{language === 'hi' ? 'एफएक्यू' : 'FAQs'}</span>
            </button>
          )}
          {onOpenFinanceCalculator && (
            <button
              onClick={onOpenFinanceCalculator}
              className="hover:text-white text-gray-300 transition-colors cursor-pointer flex items-center gap-1 pb-1 border-b-2 border-transparent"
            >
              <Calculator className="w-3 h-3 text-yellow-400" />
              {t.header.emiCalc}
            </button>
          )}
          {onOpenPartsStock && (
            <button
              id="header-nav-btn-parts-stock"
              onClick={onOpenPartsStock}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 pb-1 border-b-2 font-bold ${
                isPartsStockActive
                  ? 'text-[#D6181F] border-[#D6181F]'
                  : 'text-amber-400 hover:text-white border-transparent'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>{language === 'hi' ? 'हीरो पार्ट्स (मास्टर लिस्ट)' : 'Genuine Parts (Master List)'}</span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-[#D6181F] text-white rounded font-bold">
                1-45
              </span>
            </button>
          )}
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="text-[#D6181F] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 pb-1 border-b-2 border-transparent"
            >
              <Bot className="w-3.5 h-3.5 text-[#D6181F]" />
              {t.header.heroAiChat}
            </button>
          )}
        </nav>

        {/* Right CTA & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary Language Switcher Control */}
          <div
            id="header-language-switcher"
            className="flex items-center p-0.5 bg-[#181818] border border-white/15 rounded-lg shadow-inner"
            title="Switch Language / भाषा बदलें"
          >
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-[#D6181F] text-white shadow-md shadow-[#D6181F]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              <span>EN</span>
            </button>
            <button
              id="lang-btn-hi"
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                language === 'hi'
                  ? 'bg-[#D6181F] text-white shadow-md shadow-[#D6181F]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="हिंदी में बदलें"
            >
              <span>हिंदी</span>
            </button>
          </div>

          {onOpenWishlist && (
            <button
              id="header-btn-wishlist"
              type="button"
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/40 transition-colors cursor-pointer shadow-sm relative group"
              title={language === 'hi' ? 'सहेजे गए वाहन (विशलिस्ट)' : 'Saved Vehicles (Wishlist)'}
            >
              <Heart className="w-3.5 h-3.5 text-[#D6181F] fill-[#D6181F]/40 group-hover:fill-[#D6181F] transition-all" />
              <span className="hidden md:inline">{language === 'hi' ? 'विशलिस्ट' : 'Saved'}</span>
              {favoritesCount > 0 && (
                <span
                  id="header-wishlist-count-badge"
                  className="px-1.5 py-0.5 rounded-full bg-[#D6181F] text-white text-[9px] font-mono font-bold leading-none shadow-sm"
                >
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {onOpenVirtualTour && (
            <button
              id="header-btn-virtual-tour"
              type="button"
              onClick={onOpenVirtualTour}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-gray-300 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/40 transition-colors cursor-pointer shadow-sm group"
              title="360° Interactive Virtual Tour"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#D6181F] group-hover:rotate-180 transition-transform duration-500" />
              <span>360° {language === 'hi' ? 'टूर' : 'Tour'}</span>
            </button>
          )}

          {onOpenCompare && (
            <button
              id="header-btn-compare"
              type="button"
              onClick={onOpenCompare}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-gray-300 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer shadow-sm"
              title="Compare Hero 2-Wheelers Side-by-Side"
            >
              <GitCompare className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>{t.header.compare}</span>
            </button>
          )}

          {onOpenVehicleStock && (
            <button
              id="header-btn-vehicle-stock-top"
              type="button"
              onClick={onOpenVehicleStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm border ${
                isVehicleStockActive
                  ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-lg shadow-[#D6181F]/30'
                  : 'bg-[#181818] hover:bg-[#222] text-emerald-400 hover:text-white border-emerald-400/30'
              }`}
              title="Admin Portal • Vehicle Stock Management"
            >
              <Bike className="w-3.5 h-3.5 text-[#D6181F]" />
              <span className="hidden sm:inline">{language === 'hi' ? 'वाहन स्टॉक' : 'Vehicle Stock'}</span>
              <span className="sm:hidden">Vehicles</span>
            </button>
          )}

          {onOpenPartsStock && (
            <button
              id="header-btn-parts-stock-top"
              type="button"
              onClick={onOpenPartsStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm border ${
                isPartsStockActive
                  ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-lg shadow-[#D6181F]/30'
                  : 'bg-[#181818] hover:bg-[#222] text-amber-400 hover:text-white border-amber-400/30'
              }`}
              title="Admin Portal • Hero Genuine Parts Stock (Admin ID: admin)"
            >
              <Package className="w-3.5 h-3.5 text-[#D6181F]" />
              <span className="hidden sm:inline">{language === 'hi' ? 'पार्ट्स मास्टर लिस्ट' : 'Parts Master List'}</span>
              <span className="sm:hidden">Parts (1-45)</span>
            </button>
          )}

          {onOpenAdminLogin && (
            <button
              id="header-btn-admin-auth"
              type="button"
              onClick={onOpenAdminLogin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-gray-300 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/40 transition-colors cursor-pointer shadow-sm"
              title="Central Admin Login (Protected by Environment-Variable Logic)"
            >
              <Lock className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>Admin Login</span>
            </button>
          )}

          {onOpenGeminiChat && (
            <button
              id="header-btn-gemini-chat"
              type="button"
              onClick={onOpenGeminiChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-[#D6181F] hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-[#D6181F]/30 transition-colors cursor-pointer shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-[#D6181F]" />
              <span className="hidden sm:inline">{t.header.askAi}</span>
            </button>
          )}

          <div className="hidden xl:flex flex-col text-right">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{language === 'hi' ? 'एजेंसी नं.' : 'Agency No.'}</span>
            <a
              href="tel:8890992086"
              className="text-xs font-bold text-white hover:text-[#D6181F] font-mono transition-colors"
            >
              8890992086
            </a>
          </div>

          {onGetBestPriceClick && (
            <button
              id="header-btn-get-price-quote"
              type="button"
              onClick={onGetBestPriceClick}
              className="px-3.5 sm:px-4 py-2 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/25 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'कीमत = सर्वश्रेष्ठ कीमत' : 'Price = Best Price'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

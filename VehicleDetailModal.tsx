import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { HeroVehicle, HeroAccessory } from '../types';
import { 
  X, 
  Check, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Zap, 
  Fuel, 
  Gauge, 
  Award, 
  Calculator, 
  Wrench, 
  ChevronRight, 
  Bot, 
  GitCompare, 
  Heart, 
  RotateCw,
  Palette,
  ChevronLeft,
  Play,
  Pause,
  Sparkles,
  Gift,
  AlertCircle
} from 'lucide-react';
import { HERO_ACCESSORIES } from '../data/accessories';
import { PerformanceRadarChart } from './PerformanceRadarChart';
import { useWishlist } from '../context/WishlistContext';
import { useVehicleStock } from '../context/VehicleStockContext';
import { getColorProfile, ColorProfile } from '../utils/colorPalette';
import { checkAccessoryVehicleCompatibility } from '../utils/accessoryCompatibility';

interface VehicleDetailModalProps {
  vehicle: HeroVehicle | null;
  onClose: () => void;
  onContactBestPrice: (vehicle: HeroVehicle) => void;
  onSelectAccessory?: (accessory: HeroAccessory) => void;
  onOpenFinancialCalculator?: (vehicle: HeroVehicle) => void;
  onOpenGeminiChat?: (vehicle: HeroVehicle) => void;
  onOpenCompare?: (vehicle: HeroVehicle) => void;
  onOpenVirtualTour?: (vehicle: HeroVehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onContactBestPrice,
  onSelectAccessory,
  onOpenFinancialCalculator,
  onOpenGeminiChat,
  onOpenCompare,
  onOpenVirtualTour,
}) => {
  if (!vehicle) return null;

  const { isFavorite, toggleFavorite } = useWishlist();
  const { publicAvailability } = useVehicleStock();
  const isFav = isFavorite(vehicle.id);
  const [selectedColor, setSelectedColor] = useState<string>(vehicle.specs.colours[0] || '');
  const [isColorAutoPlaying, setIsColorAutoPlaying] = useState<boolean>(false);
  const [sheenKey, setSheenKey] = useState<number>(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stockInfo = useMemo(() => {
    if (!publicAvailability) return null;
    const cleanName = vehicle.name.toLowerCase().trim();
    const withoutPrefix = cleanName.replace(/^hero\s+/i, '');

    const foundKey = Object.keys(publicAvailability).find((k) => {
      const lowerK = k.toLowerCase().trim();
      return (
        lowerK === cleanName ||
        lowerK.includes(withoutPrefix) ||
        cleanName.includes(lowerK)
      );
    });

    if (foundKey && publicAvailability[foundKey]) {
      return publicAvailability[foundKey];
    }

    if (Object.keys(publicAvailability).length > 0) {
      return {
        modelName: vehicle.name,
        availableQty: 0,
        inStock: false,
        statusText: 'Currently Out of Stock',
        variants: [],
        colours: [],
      };
    }
    return null;
  }, [publicAvailability, vehicle.name]);

  // Sync selectedColor when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setSelectedColor(vehicle.specs.colours[0] || '');
      setIsColorAutoPlaying(false);
    }
  }, [vehicle?.id]);

  // Trigger sheen animation on color change
  useEffect(() => {
    setSheenKey((prev) => prev + 1);
  }, [selectedColor]);

  // Handle color carousel auto-play
  useEffect(() => {
    if (isColorAutoPlaying && vehicle && vehicle.specs.colours.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setSelectedColor((prev) => {
          const colors = vehicle.specs.colours;
          const curIdx = Math.max(0, colors.indexOf(prev));
          const nextIdx = (curIdx + 1) % colors.length;
          return colors[nextIdx];
        });
      }, 3200);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isColorAutoPlaying, vehicle]);

  const activeColorIndex = Math.max(
    0,
    vehicle.specs.colours.findIndex((c) => c === selectedColor)
  );

  const currentProfile: ColorProfile = getColorProfile(
    selectedColor || vehicle.specs.colours[0] || 'Sports Red'
  );

  const handlePrevColor = () => {
    const colors = vehicle.specs.colours;
    if (colors.length <= 1) return;
    const prevIndex = (activeColorIndex - 1 + colors.length) % colors.length;
    setSelectedColor(colors[prevIndex]);
  };

  const handleNextColor = () => {
    const colors = vehicle.specs.colours;
    if (colors.length <= 1) return;
    const nextIndex = (activeColorIndex + 1) % colors.length;
    setSelectedColor(colors[nextIndex]);
  };

  const [loanTenure, setLoanTenure] = useState<number>(36);
  const [downPayment, setDownPayment] = useState<number>(15000);

  // Estimated baseline for interactive EMI estimator
  const baseEstimatedPrice = vehicle.category === 'ev' ? 125000 : vehicle.category === 'sports' ? 140000 : vehicle.category === 'premium' ? 95000 : 75000;
  const loanAmount = Math.max(10000, baseEstimatedPrice - downPayment);
  const interestRate = 0.085 / 12; // 8.5% annual
  const monthlyEmi = Math.round(
    (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) /
      (Math.pow(1 + interestRate, loanTenure) - 1)
  );

  const modelKey = vehicle.name.toLowerCase().includes('splendor')
    ? 'splendor'
    : vehicle.name.toLowerCase().includes('xpulse')
    ? 'xpulse'
    : vehicle.name.toLowerCase().includes('destini')
    ? 'destini'
    : vehicle.name.toLowerCase().includes('pleasure')
    ? 'pleasure'
    : vehicle.name.toLowerCase().includes('xoom')
    ? 'xoom'
    : vehicle.name.toLowerCase().includes('xtreme')
    ? 'xtreme'
    : vehicle.name.toLowerCase().includes('karizma')
    ? 'karizma'
    : vehicle.name.toLowerCase().includes('glamour')
    ? 'glamour'
    : vehicle.name.toLowerCase().includes('passion')
    ? 'passion'
    : vehicle.name.toLowerCase().includes('hf deluxe')
    ? 'hf-deluxe'
    : vehicle.name.toLowerCase().includes('mavrick')
    ? 'mavrick'
    : vehicle.name.toLowerCase().includes('vida')
    ? 'vida'
    : 'all';

  const recommendedAccessories = useMemo(() => {
    const list = HERO_ACCESSORIES.filter((acc) =>
      checkAccessoryVehicleCompatibility(acc, modelKey, true)
    );
    return list.slice(0, 3);
  }, [modelKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-6 bg-[#D6181F] rounded-sm" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                  {vehicle.name}
                </h2>
                {stockInfo && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                      stockInfo.inStock
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {stockInfo.inStock ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Available at Shri Ram Hero</span>
                        <span className="font-mono text-emerald-300">({stockInfo.availableQty} in stock)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span>Currently Out of Stock</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 italic mt-0.5">{vehicle.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id={`modal-btn-wishlist-${vehicle.id}`}
              type="button"
              onClick={() => toggleFavorite(vehicle)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isFav
                  ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-md shadow-[#D6181F]/30'
                  : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
              }`}
              title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform ${
                  isFav ? 'fill-white text-white scale-110' : 'text-gray-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isFav ? 'Saved' : 'Bookmark'}
              </span>
            </button>
            <button
              id="btn-close-detail-modal"
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Banner with Image & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0a0a0a] rounded-2xl p-4 sm:p-6 border border-white/10">
            {/* Dynamic Interactive Vehicle Showcase Stage */}
            <div className="md:col-span-7 flex flex-col justify-between relative min-h-[290px] sm:min-h-[330px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#141414] to-[#080808] p-4 border border-white/10 group/stage select-none shadow-2xl">
              {/* Dynamic Studio Ambient Spotlight & Floor Underglow */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
                style={{
                  background: `radial-gradient(ellipse 75% 55% at 50% 82%, ${currentProfile.glowColor} 0%, rgba(0,0,0,0) 70%)`,
                }}
              />

              {/* Ambient Top Glow matching selected paint */}
              <div
                className="absolute top-0 inset-x-0 h-20 pointer-events-none transition-all duration-700 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${currentProfile.primaryHex} 0%, transparent 70%)`,
                }}
              />

              {/* Top Controls on Stage: Badge, Current Active Color Pill, Auto-Cycle, 360 */}
              <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {vehicle.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#D6181F] text-white shadow-md uppercase tracking-wider">
                      {vehicle.badge}
                    </span>
                  )}
                  {/* Current Active Color Chip */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-gray-200">
                    <span
                      className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0"
                      style={{
                        background: currentProfile.secondaryHex
                          ? `linear-gradient(135deg, ${currentProfile.primaryHex} 50%, ${currentProfile.secondaryHex} 50%)`
                          : currentProfile.primaryHex,
                      }}
                    />
                    <span className="font-bold text-white tracking-wide">{currentProfile.name}</span>
                    <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                      {currentProfile.finish}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {vehicle.specs.colours.length > 1 && (
                    <button
                      id="detail-btn-color-auto-play"
                      type="button"
                      onClick={() => setIsColorAutoPlaying((prev) => !prev)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                        isColorAutoPlaying
                          ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-md shadow-[#D6181F]/30'
                          : 'bg-black/60 text-gray-300 hover:text-white border-white/15 hover:bg-white/10'
                      }`}
                      title={isColorAutoPlaying ? 'Pause automatic color cycle' : 'Auto-preview all factory colors'}
                    >
                      {isColorAutoPlaying ? (
                        <>
                          <Pause className="w-2.5 h-2.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Auto Play</span>
                        </>
                      )}
                    </button>
                  )}

                  {onOpenVirtualTour && (
                    <button
                      id="detail-modal-btn-virtual-tour"
                      type="button"
                      onClick={() => onOpenVirtualTour(vehicle)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 hover:bg-[#D6181F] text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider border border-white/15 hover:border-[#D6181F] transition-all cursor-pointer group/tour"
                      title="Launch 360° Virtual Tour"
                    >
                      <RotateCw className="w-2.5 h-2.5 text-[#D6181F] group-hover/tour:text-white group-hover/tour:rotate-180 transition-transform duration-500" />
                      <span>360° Tour</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Center Vehicle Image Display with dynamic color filter & Prev/Next buttons */}
              <div className="relative my-auto py-2 sm:py-3 flex items-center justify-center min-h-[190px] sm:min-h-[220px]">
                {vehicle.specs.colours.length > 1 && (
                  <>
                    <button
                      id="detail-color-prev-btn"
                      type="button"
                      onClick={handlePrevColor}
                      className="absolute left-0 sm:left-1 z-20 p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-[#D6181F] text-white border border-white/15 hover:border-[#D6181F] backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                      title="Previous Factory Color"
                      aria-label="Previous Factory Color"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="detail-color-next-btn"
                      type="button"
                      onClick={handleNextColor}
                      className="absolute right-0 sm:right-1 z-20 p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-[#D6181F] text-white border border-white/15 hover:border-[#D6181F] backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                      title="Next Factory Color"
                      aria-label="Next Factory Color"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="relative max-h-56 w-full flex items-center justify-center overflow-hidden">
                  <motion.img
                    key={`${vehicle.image}-${selectedColor}`}
                    initial={{ opacity: 0.85, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    src={vehicle.image}
                    alt={`${vehicle.name} in ${selectedColor}`}
                    referrerPolicy="no-referrer"
                    className="max-h-52 sm:max-h-56 w-auto object-contain filter transition-all duration-500 select-none"
                    style={{
                      filter: `${currentProfile.filterCss} drop-shadow(0 15px 15px rgba(0,0,0,0.85)) drop-shadow(0 0 22px ${currentProfile.glowColor})`,
                    }}
                  />

                  {/* Subtle color blend aura over fairing highlights */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-color opacity-25 transition-all duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${currentProfile.primaryHex} 0%, transparent 65%)`,
                    }}
                  />

                  {/* Dynamic Sheen light sweep on color change */}
                  <motion.div
                    key={`detail-sheen-${sheenKey}`}
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '100%', opacity: [0, 0.45, 0] }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg]"
                  />
                </div>
              </div>

              {/* Bottom Quick-Swatch Dots */}
              <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/10 bg-black/40 backdrop-blur-xs -mx-4 -mb-4 p-2.5 px-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-gray-400 mr-1 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-[#D6181F]" />
                    <span>Colors:</span>
                  </span>
                  {vehicle.specs.colours.map((c, i) => {
                    const prof = getColorProfile(c);
                    const isSel = selectedColor === c;
                    return (
                      <button
                        key={i}
                        id={`quick-color-dot-${i}`}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`group/dot relative p-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                          isSel ? 'ring-2 ring-[#D6181F] scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                        title={c}
                      >
                        <div
                          className="w-4 h-4 rounded-full shadow-inner ring-1 ring-white/20"
                          style={{
                            background: prof.secondaryHex
                              ? `linear-gradient(135deg, ${prof.primaryHex} 50%, ${prof.secondaryHex} 50%)`
                              : prof.primaryHex,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-gray-400 italic hidden sm:inline truncate max-w-[190px]">
                  {currentProfile.finishLabel}
                </div>
              </div>
            </div>

            {/* Price & Highlight Pills */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Official Showroom Pricing
                </span>
                <div className="p-3.5 bg-[#181818] rounded-xl border border-white/10">
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-[#D6181F]" />
                    🏷️ SHOWROOM PRICING
                  </div>
                  <div className="text-2xl font-black text-[#D6181F] font-['Rajdhani'] mt-1 tracking-wide">
                    Price = Best Price
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Includes current seasonal exchange bonus, festive cashback & low-downpayment schemes.
                  </p>
                </div>

                {/* Free Delivery Accessories Package */}
                <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-[#161616] to-[#121212] rounded-xl border border-emerald-500/30 space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      <span>🎁 FREE ACCESSORIES INCLUDED</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px] font-mono font-bold text-emerald-300">
                      ₹0 EXTRA
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-200 leading-relaxed font-medium">
                    Free with vehicle: Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-gray-400">
                    <span>📍 Dehra Mod, Nadbai, Bharatpur, Raj.</span>
                    <span>•</span>
                    <a href="tel:8890992086" className="text-white hover:text-[#D6181F] font-bold underline">
                      📞 Agency: 8890992086
                    </a>
                  </div>
                </div>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-2 gap-2">
                {vehicle.highlights.map((item, idx) => (
                  <div key={idx} className="bg-[#181818] p-2.5 rounded-lg border border-white/5">
                    <div className="text-[9px] uppercase font-bold text-gray-400">{item.label}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Selected Color Confirmation Chip */}
              <div className="flex items-center justify-between text-[11px] px-3 py-2 rounded-lg bg-[#181818] border border-white/10">
                <span className="text-gray-400 font-medium">Selected Paint Shade:</span>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0"
                    style={{
                      background: currentProfile.secondaryHex
                        ? `linear-gradient(135deg, ${currentProfile.primaryHex} 50%, ${currentProfile.secondaryHex} 50%)`
                        : currentProfile.primaryHex,
                    }}
                  />
                  <span>{currentProfile.name}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  id="modal-btn-contact-price"
                  type="button"
                  onClick={() => {
                    onClose();
                    onContactBestPrice(vehicle);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider text-center shadow-lg shadow-[#D6181F]/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Get Best On-Road Price Quote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D6181F] font-['Rajdhani']">
              About {vehicle.name}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed bg-[#0d0d0d] p-4 rounded-xl border border-white/5">
              {vehicle.description}
            </p>
          </div>

          {/* Key Features (All 5-8 features displayed prominently) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-['Rajdhani'] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D6181F]" />
              Complete Model-Specific Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {vehicle.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0d0d0d] border border-white/5 text-xs text-gray-200"
                >
                  <Check className="w-3.5 h-3.5 text-[#D6181F] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Specifications Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-['Rajdhani'] flex items-center gap-2">
              <span className="text-[#D6181F]">⚙️</span>
              Comprehensive Technical Specifications
            </h3>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0d0d0d]">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400 w-1/3">
                      ⚙️ Engine / Motor
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{vehicle.specs.engine}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      ⛽ Mileage / Range
                    </td>
                    <td className="px-4 py-3 font-bold text-[#00FF88]">{vehicle.specs.mileage}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      🔥 Maximum Power
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{vehicle.specs.power}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      🛢 {vehicle.category === 'ev' ? 'Battery Pack' : 'Fuel Tank Capacity'}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{vehicle.specs.fuelTank}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      🔄 Transmission / Gearbox
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{vehicle.specs.transmission}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      🛑 Braking System
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{vehicle.specs.brakes}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      🎨 Available Colours
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-300">
                      {vehicle.specs.colours.join(', ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 'Color Palette' Interactive Previewer */}
          <div className="space-y-3.5 bg-[#0d0d0d] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#D6181F]/20 text-[#D6181F]">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-['Rajdhani'] flex items-center gap-2">
                    Official Factory Color Palette
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-normal font-sans">
                      {vehicle.specs.colours.length} Shades Available
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Tap any factory color below to dynamically update the vehicle showcase display above
                  </p>
                </div>
              </div>

              {/* Active Color Swatch Info */}
              <div className="flex items-center gap-2 bg-[#181818] px-3 py-1.5 rounded-xl border border-white/10">
                <div
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shrink-0"
                  style={{
                    background: currentProfile.secondaryHex
                      ? `linear-gradient(135deg, ${currentProfile.primaryHex} 50%, ${currentProfile.secondaryHex} 50%)`
                      : currentProfile.primaryHex,
                  }}
                />
                <span className="text-xs font-bold text-white">{currentProfile.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-bold uppercase">
                  {currentProfile.finish}
                </span>
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {vehicle.specs.colours.map((colorName, idx) => {
                const profile = getColorProfile(colorName);
                const isSelected = selectedColor === colorName;

                return (
                  <button
                    key={colorName}
                    id={`palette-btn-swatch-${idx}`}
                    type="button"
                    onClick={() => setSelectedColor(colorName)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#1c1c1c] border-[#D6181F] shadow-lg shadow-[#D6181F]/25 ring-1 ring-[#D6181F]'
                        : 'bg-[#141414] hover:bg-[#181818] border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    {/* Swatch circle */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-9 h-9 rounded-full shadow-inner ring-2 transition-transform duration-200 ${
                          isSelected
                            ? 'ring-white scale-110 shadow-md'
                            : 'ring-white/20 group-hover:scale-105'
                        }`}
                        style={{
                          background: profile.secondaryHex
                            ? `linear-gradient(135deg, ${profile.primaryHex} 50%, ${profile.secondaryHex} 50%)`
                            : profile.primaryHex,
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 rounded-full p-0.5 backdrop-blur-xs">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-white' : 'text-gray-200'
                          }`}
                        >
                          {profile.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-gray-400 shrink-0">
                          {profile.finish}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {profile.finishLabel}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D6181F] rounded-full shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Shade Details & Factory Paint Warranty info */}
            <div className="p-3.5 bg-[#141414] rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Paint Formulation: {currentProfile.finishLabel}</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xl">
                  {currentProfile.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 text-[11px] text-[#00FF88] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>5-Yr Duraguard Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Variants */}
          {vehicle.variants && vehicle.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white font-['Rajdhani']">
                Available Model Variants
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.variants.map((variant, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-3.5 rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <div className="font-bold text-xs text-white uppercase tracking-wide">
                      {variant.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {variant.difference}
                    </div>
                    <div className="text-[10px] font-bold text-[#D6181F] mt-2 uppercase tracking-wider">
                      Variant Dependent Pricing
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Radar Benchmark Chart */}
          <PerformanceRadarChart vehicle={vehicle} />

          {/* Interactive Loan & EMI Calculator */}
          <div className="space-y-3 bg-gradient-to-br from-[#0d0d0d] to-[#181818] p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 font-['Rajdhani']">
                <Calculator className="w-4 h-4 text-[#D6181F]" />
                Hero Easy Finance & Estimated Monthly EMI
              </h3>
              <span className="text-[10px] text-[#00FF88] font-bold bg-[#00FF88]/10 px-2.5 py-1 rounded border border-[#00FF88]/30">
                Interest from 8.5% p.a.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">
                  Down Payment: <span className="text-white font-bold">₹{downPayment.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="2500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#D6181F]"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>₹5,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">
                  Tenure: <span className="text-white font-bold">{loanTenure} Months</span>
                </label>
                <div className="flex gap-2">
                  {[12, 24, 36, 48].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLoanTenure(m)}
                      className={`flex-1 py-1.5 text-xs rounded-md font-semibold border cursor-pointer ${
                        loanTenure === m
                          ? 'bg-[#D6181F] border-[#D6181F] text-white'
                          : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-white/10 flex flex-col justify-center text-center">
                <div className="text-[10px] uppercase font-bold text-gray-400">Estimated EMI</div>
                <div className="text-xl font-black text-[#D6181F] font-['Rajdhani']">
                  ₹{monthlyEmi.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ month</span>
                </div>
              </div>
            </div>

            {onOpenFinancialCalculator && (
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[11px] text-gray-400">
                  Want custom bank interest rates, flexible loan tenures & amortization schedules?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFinancialCalculator(vehicle);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#D6181F]/15 hover:bg-[#D6181F]/25 text-[#D6181F] hover:text-white border border-[#D6181F]/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Open Full Financial Calculator &rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* Recommended Genuine Accessories for this Model */}
          <div className="space-y-3 bg-[#0d0d0d] p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 font-['Rajdhani']">
                  <Wrench className="w-4 h-4 text-yellow-400" />
                  Recommended Genuine Hero Accessories (HGA)
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Available for immediate fitment at Shri Ram Hero dealership counter
                </p>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-[#00FF88] font-bold bg-[#00FF88]/10 px-2 py-0.5 rounded border border-[#00FF88]/30">
                100% Factory Fit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {recommendedAccessories.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-[#141414] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-white/20 transition-colors"
                >
                  <div>
                    <div className="text-[9px] font-bold text-[#D6181F] uppercase tracking-wider mb-1">
                      {acc.categoryLabel}
                    </div>
                    <div className="text-xs font-bold text-white font-['Rajdhani'] line-clamp-1">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                      Part: {acc.partNumber}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-['Rajdhani']">
                      ₹{acc.price.toLocaleString()}
                    </span>
                    {onSelectAccessory && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectAccessory(acc);
                        }}
                        className="text-[10px] text-[#D6181F] hover:text-white font-bold uppercase flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Reserve</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="p-4 border-t border-white/10 bg-[#0d0d0d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-400 text-center sm:text-left">
            Shri Ram Hero &bull; Authorized Dealership Warranty & 24x7 Roadside Assistance included.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenCompare && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCompare(vehicle);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title={`Compare ${vehicle.name} with another Hero vehicle`}
              >
                <GitCompare className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>Compare</span>
              </button>
            )}
            {onOpenGeminiChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGeminiChat(vehicle);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-md bg-[#181818] hover:bg-[#222] text-[#D6181F] hover:text-white text-xs font-bold uppercase tracking-wider border border-[#D6181F]/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>Ask AI Advisor</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-md bg-[#222] hover:bg-[#2a2a2a] text-gray-300 text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onContactBestPrice(vehicle);
              }}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Price = Best Price</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

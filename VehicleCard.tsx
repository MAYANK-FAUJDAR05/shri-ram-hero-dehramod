import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { HeroVehicle } from '../types';
import { ArrowRight, Calendar, Sparkles, Tag, ShieldCheck, Calculator, GitCompare, Heart, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getVehiclePriceEstimate, calculateEmi, formatINR } from '../utils/finance';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { useVehicleStock } from '../context/VehicleStockContext';

interface VehicleCardProps {
  vehicle: HeroVehicle;
  onViewDetails: (vehicle: HeroVehicle) => void;
  onContactBestPrice: (vehicle: HeroVehicle) => void;
  onOpenFinancialCalculator: (vehicle: HeroVehicle) => void;
  onCompare?: (vehicle: HeroVehicle) => void;
  onOpenVirtualTour?: (vehicle: HeroVehicle) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (vehicle: HeroVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onContactBestPrice,
  onOpenFinancialCalculator,
  onCompare,
  onOpenVirtualTour,
  isWishlisted: propIsWishlisted,
  onToggleWishlist,
}) => {
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [imageError, setImageError] = useState(false);

  const isFav = propIsWishlisted !== undefined ? propIsWishlisted : isFavorite(vehicle.id);
  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(vehicle);
    } else {
      toggleFavorite(vehicle);
    }
  };

  // Baseline price & starting EMI estimation
  const pricing = useMemo(() => getVehiclePriceEstimate(vehicle), [vehicle]);
  const startingEmi = useMemo(() => {
    const loan = Math.max(5000, pricing.onRoadPrice - pricing.defaultDownPayment);
    return calculateEmi(loan, 8.5, 36);
  }, [pricing]);

  const { publicAvailability } = useVehicleStock();

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

  // Clean name without prefix for watermark
  const shortModelName = vehicle.name.replace(/^Hero\s+/i, '');

  return (
    <motion.div
      id={`vehicle-card-${vehicle.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex flex-col bg-[#181818] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D6181F]/50 transition-all duration-300 shadow-2xl"
    >
      {/* ================================================================= */}
      {/* 1. PHOTO with Stylized Watermark (Immersive UI) */}
      {/* ================================================================= */}
      <div className="relative w-full h-48 sm:h-52 bg-gradient-to-b from-[#222] to-[#181818] overflow-hidden flex items-center justify-center p-4">
        {/* Giant Stylized Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-6xl sm:text-7xl font-black italic pointer-events-none uppercase tracking-tighter text-white select-none truncate px-3">
          {shortModelName}
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6181F]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D6181F]/20 transition-all duration-500" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {vehicle.badge && (
            <span
              id={`badge-${vehicle.id}`}
              className="text-[9px] font-bold tracking-widest px-2.5 py-1 rounded uppercase shadow-md flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            >
              <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
              {vehicle.badge}
            </span>
          )}
          {vehicle.category === 'ev' && (
            <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30 uppercase">
              100% ELECTRIC
            </span>
          )}
        </div>

        {/* Category Pill & Wishlist Heart Button */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-black/70 text-gray-300 border border-white/10 backdrop-blur-sm">
            {vehicle.category === 'commuter' && (language === 'hi' ? 'कम्यूटर' : 'Commuter')}
            {vehicle.category === 'premium' && (language === 'hi' ? 'प्रीमियम' : 'Premium')}
            {vehicle.category === 'sports' && (language === 'hi' ? 'स्पोर्ट्स' : 'Sports')}
            {vehicle.category === 'scooter' && (language === 'hi' ? 'स्कूटर' : 'Scooter')}
            {vehicle.category === 'ev' && 'Vida EV'}
          </span>

          <button
            id={`btn-wishlist-${vehicle.id}`}
            type="button"
            onClick={handleToggleFav}
            title={isFav ? t.card.removeFromWishlist : t.card.addToWishlist}
            aria-label={isFav ? t.card.removeFromWishlist : t.card.addToWishlist}
            className={`w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg group/heart ${
              isFav
                ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-[#D6181F]/40 scale-105 hover:bg-[#b5141a]'
                : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90 border-white/20 hover:border-white/40 hover:scale-110'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                isFav
                  ? 'fill-white text-white scale-110'
                  : 'group-hover/heart:text-[#D6181F] group-hover/heart:fill-[#D6181F]/30'
              }`}
            />
          </button>
        </div>

        {/* Vehicle Photo or Fallback */}
        {!imageError ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain object-center z-10 transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.85)]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 z-10">
            <div className="w-14 h-14 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center mb-2">
              <span className="font-extrabold text-2xl text-[#D6181F] font-['Rajdhani']">HERO</span>
            </div>
            <p className="text-sm font-bold text-white">{vehicle.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Hero MotoCorp Official Lineup</p>
          </div>
        )}

        {/* 360° Virtual Tour Floating Badge */}
        {onOpenVirtualTour && (
          <button
            id={`btn-virtual-tour-${vehicle.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenVirtualTour(vehicle);
            }}
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 hover:bg-[#D6181F] text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 hover:border-[#D6181F] shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer group/tour active:scale-95"
            title={language === 'hi' ? `${vehicle.name} का 360° वर्चुअल टूर` : `360° Virtual Tour for ${vehicle.name}`}
          >
            <RotateCw className="w-3 h-3 text-[#D6181F] group-hover/tour:text-white group-hover/tour:rotate-180 transition-transform duration-500" />
            <span>360° {language === 'hi' ? 'वर्चुअल टूर' : 'Tour'}</span>
          </button>
        )}

        {/* Bottom accent glow strip */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6181F] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-3.5">
        {/* ================================================================= */}
        {/* 2. MODEL NAME */}
        {/* ================================================================= */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3
              id={`model-name-${vehicle.id}`}
              className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#D6181F] transition-colors font-['Rajdhani']"
            >
              {vehicle.name}
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0 mt-0.5">
              {vehicle.specs.engine.split(' ')[0]}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 line-clamp-1 italic">
            {vehicle.tagline}
          </p>

          {/* Real-time Dealership Stock Status Badge */}
          {stockInfo && (
            <div className="pt-2">
              <span
                id={`stock-status-${vehicle.id}`}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                  stockInfo.inStock
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/15 text-red-400 border-red-500/30'
                }`}
              >
                {stockInfo.inStock ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Available at Shri Ram Hero</span>
                    <span className="font-mono text-emerald-300">({stockInfo.availableQty})</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <span>Currently Out of Stock</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 3. BEST PRICE & EMI ESTIMATOR */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Price = Best Price Box */}
          <div
            id={`best-price-box-${vehicle.id}`}
            onClick={() => onContactBestPrice(vehicle)}
            className="cursor-pointer bg-black/40 hover:bg-black/60 border border-white/5 hover:border-[#D6181F]/40 rounded-lg p-2.5 flex items-center justify-between transition-colors group/price"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Tag className="w-3.5 h-3.5 text-[#D6181F] shrink-0" />
              <div className="text-[11px] text-gray-300 truncate">
                <span className="font-extrabold text-white text-xs block font-['Rajdhani'] tracking-wide">
                  Price = Best Price
                </span>
                <span className="text-[#D6181F] text-[10px] font-bold">
                  {language === 'hi' ? 'डीलरशिप गारंटी' : 'Dealership Offer'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#D6181F] group-hover/price:text-white px-2 py-0.5 rounded bg-[#111] border border-white/10 whitespace-nowrap">
              {language === 'hi' ? 'ऑफर' : 'Offer'} &rarr;
            </span>
          </div>

          {/* EMI Estimator Box */}
          <div
            id={`emi-box-${vehicle.id}`}
            onClick={() => onOpenFinancialCalculator(vehicle)}
            className="cursor-pointer bg-black/40 hover:bg-black/60 border border-white/5 hover:border-yellow-400/40 rounded-lg p-2.5 flex items-center justify-between transition-colors group/emi"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Calculator className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <div className="text-[11px] text-gray-300 truncate">
                <span className="font-bold text-white uppercase text-[9px] block">🧮 Monthly EMI</span>
                <span className="text-yellow-400 font-bold text-xs font-mono">~{formatINR(startingEmi)}/m*</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 group-hover/emi:text-yellow-400 px-2 py-0.5 rounded bg-[#111] border border-white/10 whitespace-nowrap">
              Calc &rarr;
            </span>
          </div>
        </div>

        {/* Free Delivery Accessories Kit Callout */}
        <div className="bg-emerald-950/30 border border-emerald-500/25 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[10px] text-emerald-300">
          <span className="font-semibold flex items-center gap-1 min-w-0">
            <span className="shrink-0">🎁</span>
            <span className="shrink-0 font-bold">{language === 'hi' ? 'फ्री एक्सेसरीज़:' : 'Free Accessories:'}</span>
            <span className="text-gray-300 truncate">Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid & Tool Kit</span>
          </span>
          <span className="font-bold text-emerald-400 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 shrink-0 ml-1.5 border border-emerald-500/20">
            ₹0 Free
          </span>
        </div>

        {/* ================================================================= */}
        {/* 4. KEY FEATURES (5 to 8 actual, model-specific features) */}
        {/* ================================================================= */}
        <div className="space-y-1.5 flex-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#D6181F]" />
              KEY FEATURES:
            </span>
            <span className="text-[9px] text-gray-500 font-medium">
              {vehicle.features.length} Highlights
            </span>
          </div>

          <ul className="space-y-1">
            {vehicle.features.map((feature, idx) => (
              <li
                key={idx}
                className="text-[11px] text-gray-300 flex items-start gap-1.5 leading-tight"
              >
                <span className="text-[#D6181F] font-bold shrink-0 mt-0.5 text-xs">✓</span>
                <span className="text-gray-200">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ================================================================= */}
        {/* 5. SPECIFICATIONS */}
        {/* ================================================================= */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 border-b border-white/5 pb-1">
            <span>⚙️</span>
            {t.card.specifications}:
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 bg-black/30 p-2.5 rounded-lg border border-white/5 text-[10px]">
            {/* Engine / Motor */}
            <div>
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold">
                ⚙️ {t.card.engineMotor}
              </span>
              <span className="font-bold text-white text-[11px] block truncate">
                {vehicle.specs.engine}
              </span>
            </div>

            {/* Mileage / Range */}
            <div>
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold">
                ⛽ {t.card.mileageRange}
              </span>
              <span className="font-bold text-[#00FF88] text-[11px] block truncate">
                {vehicle.specs.mileage}
              </span>
            </div>

            {/* Maximum Power */}
            <div>
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold">
                🔥 {t.card.maxPower}
              </span>
              <span className="font-bold text-white text-[11px] block truncate">
                {vehicle.specs.power}
              </span>
            </div>

            {/* Fuel Tank / Battery */}
            <div>
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold">
                🛢 {vehicle.category === 'ev' ? t.card.batteryPack : t.card.fuelTank}
              </span>
              <span className="font-bold text-white text-[11px] block truncate">
                {vehicle.specs.fuelTank}
              </span>
            </div>

            {/* Transmission */}
            <div>
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold">
                🔄 {t.card.transmission}
              </span>
              <span className="font-bold text-white text-[11px] block truncate">
                {vehicle.specs.transmission}
              </span>
            </div>

            {/* Brakes */}
            <div>
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold">
                🛑 {t.card.brakes}
              </span>
              <span className="font-bold text-white text-[11px] block truncate">
                {vehicle.specs.brakes}
              </span>
            </div>

            {/* Available Colours */}
            <div className="col-span-2 pt-1 border-t border-white/5">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-semibold mb-1">
                🎨 {t.card.availableColours}
              </span>
              <div className="flex flex-wrap gap-1">
                {vehicle.specs.colours.map((colour, cIdx) => (
                  <span
                    key={cIdx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 border border-white/5 text-gray-300"
                  >
                    {colour}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. BUTTONS: [ VIEW FULL DETAILS ] [ BOOK A TEST RIDE ] + [ EMI ] */}
        {/* ================================================================= */}
        <div className="pt-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              id={`btn-view-details-${vehicle.id}`}
              type="button"
              onClick={() => onViewDetails(vehicle)}
              className="flex-1 bg-white text-black text-[10px] sm:text-xs font-bold py-2.5 rounded-md uppercase hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
            >
              {t.card.viewDetails}
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              id={`btn-get-best-price-${vehicle.id}`}
              type="button"
              onClick={() => onContactBestPrice(vehicle)}
              className="flex-1 bg-[#D6181F] text-white text-[10px] sm:text-xs font-bold py-2.5 rounded-md uppercase hover:bg-[#b5141a] transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-lg shadow-[#D6181F]/20"
            >
              <Tag className="w-3 h-3" />
              {t.card.getBestPrice}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              id={`btn-calc-emi-${vehicle.id}`}
              type="button"
              onClick={() => onOpenFinancialCalculator(vehicle)}
              className="flex-1 bg-[#1e1e1e] hover:bg-[#252525] text-gray-200 hover:text-white text-[10px] sm:text-xs font-bold py-2 rounded-md uppercase border border-white/10 hover:border-yellow-400/40 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm group"
            >
              <Calculator className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span>{t.card.estimateMonthlyEmi} (~{formatINR(startingEmi)}/m)</span>
            </button>
            {onOpenVirtualTour && (
              <button
                id={`btn-tour-action-${vehicle.id}`}
                type="button"
                onClick={() => onOpenVirtualTour(vehicle)}
                className="px-2.5 sm:px-3 bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 hover:text-white text-[10px] sm:text-xs font-bold py-2 rounded-md uppercase border border-white/10 hover:border-[#D6181F]/50 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm group"
                title={`Launch 360° Virtual Tour for ${vehicle.name}`}
              >
                <RotateCw className="w-3.5 h-3.5 text-[#D6181F] group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden xs:inline">360°</span>
              </button>
            )}
            {onCompare && (
              <button
                id={`btn-compare-${vehicle.id}`}
                type="button"
                onClick={() => onCompare(vehicle)}
                className="px-3 bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 hover:text-white text-[10px] sm:text-xs font-bold py-2 rounded-md uppercase border border-white/10 hover:border-[#D6181F]/50 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                title={`Compare ${vehicle.name} with another Hero vehicle`}
              >
                <GitCompare className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>{t.card.compare}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

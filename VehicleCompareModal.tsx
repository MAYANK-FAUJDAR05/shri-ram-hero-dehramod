import React, { useState, useEffect, useMemo } from 'react';
import { HeroVehicle } from '../types';
import { HERO_VEHICLES } from '../data/vehicles';
import { getVehiclePriceEstimate, calculateEmi, formatINR } from '../utils/finance';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  ArrowLeftRight,
  Tag,
  Calculator,
  Check,
  Zap,
  Fuel,
  Gauge,
  ShieldCheck,
  Palette,
  ExternalLink,
  Bot,
  Copy,
  Sparkles,
  GitCompare,
  TrendingUp,
} from 'lucide-react';

interface VehicleCompareModalProps {
  initialVehicle1?: HeroVehicle | null;
  initialVehicle2?: HeroVehicle | null;
  onClose: () => void;
  onContactBestPrice?: (vehicle: HeroVehicle) => void;
  onOpenFinancialCalculator: (vehicle: HeroVehicle) => void;
  onViewDetails: (vehicle: HeroVehicle) => void;
  onOpenGeminiChat?: (vehicle: HeroVehicle) => void;
}

interface QuickComparePreset {
  label: string;
  id1: string;
  id2: string;
  tag: string;
}

const PRESET_COMPARISONS: QuickComparePreset[] = [
  {
    label: 'Splendor+ vs Splendor+ XTEC',
    id1: 'splendor-plus',
    id2: 'splendor-plus-xtec',
    tag: 'Commuter Classic vs Digital Tech',
  },
  {
    label: 'Splendor+ vs HF Deluxe',
    id1: 'splendor-plus',
    id2: 'hf-deluxe',
    tag: '100cc Commuter Showdown',
  },
  {
    label: 'Glamour XTEC vs Xtreme 125R',
    id1: 'glamour-xtec',
    id2: 'xtreme-125r',
    tag: '125cc Executive vs Sporty ABS',
  },
  {
    label: 'Xtreme 160R 4V vs Karizma XMR',
    id1: 'xtreme-160r-4v',
    id2: 'karizma-xmr',
    tag: 'Streetfighter vs Supersport',
  },
  {
    label: 'Destini 125 vs Xoom 110',
    id1: 'destini-125',
    id2: 'xoom-110',
    tag: 'Family Comfort vs Sporty Agility',
  },
  {
    label: 'Destini 125 vs Pleasure+',
    id1: 'destini-125',
    id2: 'pleasure-plus',
    tag: '125cc Luxury vs 110cc Lightweight',
  },
  {
    label: 'Vida V1 Pro vs Vida V1 Plus',
    id1: 'vida-v1-pro',
    id2: 'vida-v1-plus',
    tag: 'Flagship EV vs Smart Urban EV',
  },
  {
    label: 'Mavrick 440 vs Karizma XMR',
    id1: 'mavrick-440',
    id2: 'karizma-xmr',
    tag: '440cc Roadster vs 210cc Sport',
  },
];

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  initialVehicle1,
  initialVehicle2,
  onClose,
  onContactBestPrice,
  onOpenFinancialCalculator,
  onViewDetails,
  onOpenGeminiChat,
}) => {
  const { t, language } = useLanguage();

  // Determine initial selections
  const defaultV1 = initialVehicle1 || HERO_VEHICLES[0];
  const defaultV2 =
    initialVehicle2 ||
    (initialVehicle1 && initialVehicle1.id === HERO_VEHICLES[0].id
      ? HERO_VEHICLES[1]
      : HERO_VEHICLES[1]);

  const [vehicleId1, setVehicleId1] = useState<string>(defaultV1.id);
  const [vehicleId2, setVehicleId2] = useState<string>(defaultV2.id);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync if initial props change
  useEffect(() => {
    if (initialVehicle1) setVehicleId1(initialVehicle1.id);
    if (initialVehicle2) setVehicleId2(initialVehicle2.id);
  }, [initialVehicle1, initialVehicle2]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const v1 = useMemo(() => {
    return HERO_VEHICLES.find((v) => v.id === vehicleId1) || HERO_VEHICLES[0];
  }, [vehicleId1]);

  const v2 = useMemo(() => {
    return HERO_VEHICLES.find((v) => v.id === vehicleId2) || HERO_VEHICLES[1];
  }, [vehicleId2]);

  // Pricing & EMI info
  const p1 = useMemo(() => getVehiclePriceEstimate(v1.id), [v1.id]);
  const p2 = useMemo(() => getVehiclePriceEstimate(v2.id), [v2.id]);

  const emi1 = useMemo(() => {
    const loan = p1.onRoadPrice - p1.defaultDownPayment;
    return calculateEmi(loan, 9.5, 48);
  }, [p1]);

  const emi2 = useMemo(() => {
    const loan = p2.onRoadPrice - p2.defaultDownPayment;
    return calculateEmi(loan, 9.5, 48);
  }, [p2]);

  // Swap vehicles
  const handleSwap = () => {
    const temp = vehicleId1;
    setVehicleId1(vehicleId2);
    setVehicleId2(temp);
  };

  // Select preset
  const handleApplyPreset = (preset: QuickComparePreset) => {
    setVehicleId1(preset.id1);
    setVehicleId2(preset.id2);
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const summary = `=== SHRI RAM HERO: VEHICLE COMPARISON ===
Dealership: Shri Ram Hero, Dehra Mod, Nadbai, Bharatpur, Raj.
Agency No: 8890992086
Free Accessories: Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.

[1] ${v1.name} (${v1.category.toUpperCase()})
- Tagline: ${v1.tagline}
- Est. On-Road Price: ${formatINR(p1.onRoadPrice)}
- Starting EMI: ~${formatINR(emi1)}/mo
- Engine / Battery: ${v1.specs.engine}
- Power Output: ${v1.specs.power}
- Mileage / Range: ${v1.specs.mileage}
- Fuel / Battery: ${v1.specs.fuelTank}
- Transmission: ${v1.specs.transmission}
- Brakes: ${v1.specs.brakes}

[2] ${v2.name} (${v2.category.toUpperCase()})
- Tagline: ${v2.tagline}
- Est. On-Road Price: ${formatINR(p2.onRoadPrice)}
- Starting EMI: ~${formatINR(emi2)}/mo
- Engine / Battery: ${v2.specs.engine}
- Power Output: ${v2.specs.power}
- Mileage / Range: ${v2.specs.mileage}
- Fuel / Battery: ${v2.specs.fuelTank}
- Transmission: ${v2.specs.transmission}
- Brakes: ${v2.specs.brakes}

Price Difference: ${Math.abs(p1.onRoadPrice - p2.onRoadPrice) === 0 ? 'Identical pricing' : `${v1.name} is ${formatINR(Math.abs(p1.onRoadPrice - p2.onRoadPrice))} ${p1.onRoadPrice < p2.onRoadPrice ? 'more economical' : 'more premium'} than ${v2.name}`}
----------------------------------------
Get Best Price & Dealership Inquiries at Shri Ram Hero (Agency No): 8890992086`;

    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  // Helper to extract numbers for visual comparison
  const parsePower = (powerStr: string): number => {
    const match = powerStr.match(/([0-9]+\.?[0-9]*)\s*(?:PS|bhp|kW)/i);
    return match ? parseFloat(match[1]) : 0;
  };

  const powerVal1 = parsePower(v1.specs.power);
  const powerVal2 = parsePower(v2.specs.power);

  return (
    <div
      id="vehicle-compare-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="vehicle-compare-modal-content"
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* ================================================================= */}
        {/* MODAL HEADER */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#141414] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/15 border border-[#D6181F]/30 flex items-center justify-center text-[#D6181F] shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black uppercase text-white font-['Rajdhani'] tracking-wide">
                  {language === 'hi' ? 'वाहन विनिर्देश' : 'VEHICLE SPECIFICATION'}{' '}
                  <span className="text-[#D6181F]">{language === 'hi' ? 'तुलना' : 'COMPARISON'}</span>
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[10px] font-mono uppercase">
                  {language === 'hi' ? 'आमने-सामने' : 'Side-by-Side'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {language === 'hi'
                  ? 'पावर, माइलेज, कीमत, ब्रेक और फीचर्स की आमने-सामने तुलना करें।'
                  : 'Compare power, mileage, pricing, brakes, and engineering highlights head-to-head.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-comparison-summary"
              type="button"
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Copy comparison summary to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00FF88]" />
                  <span className="text-[#00FF88]">{language === 'hi' ? 'कॉपी किया गया!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>{language === 'hi' ? 'सारांश कॉपी करें' : 'Copy Summary'}</span>
                </>
              )}
            </button>

            <button
              id="btn-close-vehicle-compare"
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Comparison Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* QUICK PRESETS CAROUSEL / CHIPS */}
        {/* ================================================================= */}
        <div className="px-4 py-2.5 bg-[#0e0e0e] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-400" /> Popular Matches:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {PRESET_COMPARISONS.map((preset, idx) => {
              const isSelected =
                (vehicleId1 === preset.id1 && vehicleId2 === preset.id2) ||
                (vehicleId1 === preset.id2 && vehicleId2 === preset.id1);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-sm'
                      : 'bg-[#181818] text-gray-300 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* SCROLLABLE COMPARISON BODY */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* VEHICLE SELECTOR & HERO SHOWCASE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* CENTRAL SWAP BUTTON (DESKTOP) */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-[#1e1e1e] border-2 border-white/20 text-white hover:bg-[#D6181F] hover:border-[#D6181F] transition-all flex items-center justify-center shadow-2xl cursor-pointer hover:rotate-180 duration-300"
                title="Swap Vehicle 1 and Vehicle 2"
                aria-label="Swap Vehicles"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-extrabold bg-black/80 px-2 py-0.5 rounded-full text-yellow-400 border border-white/10 uppercase tracking-widest">
                VS
              </span>
            </div>

            {/* ----------------- VEHICLE 1 COLUMN ----------------- */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-4 flex flex-col space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#D6181F] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D6181F]" /> Vehicle 1
                </span>
                <span className="text-[10px] font-semibold text-gray-400 capitalize px-2 py-0.5 bg-black/40 rounded border border-white/5">
                  {v1.category}
                </span>
              </div>

              {/* Selector dropdown */}
              <select
                id="select-compare-vehicle-1"
                value={vehicleId1}
                onChange={(e) => setVehicleId1(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-[#D6181F] outline-none cursor-pointer"
              >
                <optgroup label="🏍️ Commuter Motorcycles">
                  {HERO_VEHICLES.filter((v) => v.category === 'commuter').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="⚡ Premium Motorcycles">
                  {HERO_VEHICLES.filter((v) => v.category === 'premium').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏁 Sports Motorcycles">
                  {HERO_VEHICLES.filter((v) => v.category === 'sports').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🛵 Scooters">
                  {HERO_VEHICLES.filter((v) => v.category === 'scooter').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🔋 Electric (Vida EV)">
                  {HERO_VEHICLES.filter((v) => v.category === 'ev').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Vehicle 1 Visual Showcase */}
              <div className="relative h-44 sm:h-52 bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] rounded-lg p-2 flex items-center justify-center overflow-hidden border border-white/5">
                <img
                  src={v1.image}
                  alt={v1.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-105"
                />
                {v1.badge && (
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                      v1.badgeColor || 'bg-[#D6181F] text-white'
                    }`}
                  >
                    {v1.badge}
                  </span>
                )}
              </div>

              {/* Vehicle 1 Quick Summary */}
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white font-['Rajdhani'] uppercase tracking-wide truncate">
                  {v1.name}
                </h3>
                <p className="text-xs text-gray-400 italic line-clamp-1">{v1.tagline}</p>
              </div>

              {/* Quick Pricing */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                    Showroom Price
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-[#D6181F] font-['Rajdhani'] tracking-wide">
                    Price = Best Price
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                    Starting EMI
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-yellow-400 font-mono">
                    ~{formatINR(emi1)}/mo*
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {onContactBestPrice && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContactBestPrice(v1);
                    }}
                    className="bg-[#D6181F] hover:bg-[#b5141a] text-white text-[10px] sm:text-[11px] font-bold py-2 rounded uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-[#D6181F]/20"
                  >
                    <Tag className="w-3 h-3" />
                    <span>Get Quote</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenFinancialCalculator(v1)}
                  className="bg-[#222] hover:bg-[#2a2a2a] text-yellow-400 text-[10px] sm:text-[11px] font-bold py-2 rounded uppercase border border-yellow-400/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calculator className="w-3 h-3" />
                  <span>Calc EMI</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewDetails(v1)}
                  className="bg-white/10 hover:bg-white/15 text-gray-200 text-[10px] sm:text-[11px] font-bold py-2 rounded uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Details</span>
                </button>
              </div>
            </div>

            {/* ----------------- VEHICLE 2 COLUMN ----------------- */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-4 flex flex-col space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#00FF88] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00FF88]" /> Vehicle 2
                </span>
                <span className="text-[10px] font-semibold text-gray-400 capitalize px-2 py-0.5 bg-black/40 rounded border border-white/5">
                  {v2.category}
                </span>
              </div>

              {/* Selector dropdown */}
              <select
                id="select-compare-vehicle-2"
                value={vehicleId2}
                onChange={(e) => setVehicleId2(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-[#D6181F] outline-none cursor-pointer"
              >
                <optgroup label="🏍️ Commuter Motorcycles">
                  {HERO_VEHICLES.filter((v) => v.category === 'commuter').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="⚡ Premium Motorcycles">
                  {HERO_VEHICLES.filter((v) => v.category === 'premium').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏁 Sports Motorcycles">
                  {HERO_VEHICLES.filter((v) => v.category === 'sports').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🛵 Scooters">
                  {HERO_VEHICLES.filter((v) => v.category === 'scooter').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🔋 Electric (Vida EV)">
                  {HERO_VEHICLES.filter((v) => v.category === 'ev').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Vehicle 2 Visual Showcase */}
              <div className="relative h-44 sm:h-52 bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] rounded-lg p-2 flex items-center justify-center overflow-hidden border border-white/5">
                <img
                  src={v2.image}
                  alt={v2.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-105"
                />
                {v2.badge && (
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                      v2.badgeColor || 'bg-[#D6181F] text-white'
                    }`}
                  >
                    {v2.badge}
                  </span>
                )}
              </div>

              {/* Vehicle 2 Quick Summary */}
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white font-['Rajdhani'] uppercase tracking-wide truncate">
                  {v2.name}
                </h3>
                <p className="text-xs text-gray-400 italic line-clamp-1">{v2.tagline}</p>
              </div>

              {/* Quick Pricing */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                    Showroom Price
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-[#D6181F] font-['Rajdhani'] tracking-wide">
                    Price = Best Price
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                    Starting EMI
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-yellow-400 font-mono">
                    ~{formatINR(emi2)}/mo*
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {onContactBestPrice && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContactBestPrice(v2);
                    }}
                    className="bg-[#D6181F] hover:bg-[#b5141a] text-white text-[10px] sm:text-[11px] font-bold py-2 rounded uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-[#D6181F]/20"
                  >
                    <Tag className="w-3 h-3" />
                    <span>Get Quote</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenFinancialCalculator(v2)}
                  className="bg-[#222] hover:bg-[#2a2a2a] text-yellow-400 text-[10px] sm:text-[11px] font-bold py-2 rounded uppercase border border-yellow-400/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calculator className="w-3 h-3" />
                  <span>Calc EMI</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewDetails(v2)}
                  className="bg-white/10 hover:bg-white/15 text-gray-200 text-[10px] sm:text-[11px] font-bold py-2 rounded uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Swap on Mobile */}
          <div className="md:hidden flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="px-4 py-2 rounded-full bg-[#222] border border-white/20 text-xs font-bold text-white flex items-center gap-2"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#D6181F]" />
              <span>Swap Vehicles (V1 &harr; V2)</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* QUICK COMPARISON TAKEAWAY CALLOUT */}
          {/* ================================================================= */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D6181F]/15 via-black to-[#00FF88]/10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Price Delta: </span>
                <span className="text-gray-300">
                  {p1.onRoadPrice === p2.onRoadPrice
                    ? 'Both vehicles share identical on-road pricing.'
                    : p1.onRoadPrice < p2.onRoadPrice
                    ? `${v1.name} is ${formatINR(p2.onRoadPrice - p1.onRoadPrice)} more affordable than ${v2.name}.`
                    : `${v2.name} is ${formatINR(p1.onRoadPrice - p2.onRoadPrice)} more affordable than ${v1.name}.`}
                </span>
              </div>
            </div>
            {onOpenGeminiChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGeminiChat(v1);
                }}
                className="shrink-0 px-3 py-1.5 rounded-md bg-[#D6181F]/20 hover:bg-[#D6181F]/30 text-[#D6181F] hover:text-white border border-[#D6181F]/30 font-bold uppercase text-[10px] tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3 h-3" />
                <span>Ask AI to analyze this matchup</span>
              </button>
            )}
          </div>

          {/* ================================================================= */}
          {/* TECHNICAL SPECIFICATION TABLE */}
          {/* ================================================================= */}
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#141414]">
            <div className="p-3 bg-black/50 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#D6181F]" />
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-['Rajdhani']">
                  Detailed Technical Specifications
                </h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                Authentic Shri Ram Hero OEM Specs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#1c1c1c] text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3 sm:px-4 w-1/3 font-bold">Specification Parameter</th>
                    <th className="py-3 px-3 sm:px-4 w-1/3 font-bold text-white border-l border-white/5 bg-[#D6181F]/10">
                      {v1.name}
                    </th>
                    <th className="py-3 px-3 sm:px-4 w-1/3 font-bold text-white border-l border-white/5 bg-[#00FF88]/10">
                      {v2.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Category / Ride Purpose */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400">
                      Vehicle Segment / Category
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium capitalize border-l border-white/5">
                      {v1.category === 'ev' ? 'Electric Vehicle (EV)' : `${v1.category} motorcycle`}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium capitalize border-l border-white/5">
                      {v2.category === 'ev' ? 'Electric Vehicle (EV)' : `${v2.category} motorcycle`}
                    </td>
                  </tr>

                  {/* Engine / Powertrain */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-gray-500" />
                      <span>{v1.category === 'ev' || v2.category === 'ev' ? 'Powertrain / Motor' : 'Engine & Displacement'}</span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-bold border-l border-white/5">
                      {v1.specs.engine}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-bold border-l border-white/5">
                      {v2.specs.engine}
                    </td>
                  </tr>

                  {/* Maximum Power Output */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Max Power Output</span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-bold border-l border-white/5">
                      <div className="flex items-center justify-between">
                        <span>{v1.specs.power}</span>
                        {powerVal1 > powerVal2 && powerVal2 > 0 && (
                          <span className="text-[9px] bg-[#00FF88]/20 text-[#00FF88] px-1.5 py-0.5 rounded font-bold uppercase">
                            Higher
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-bold border-l border-white/5">
                      <div className="flex items-center justify-between">
                        <span>{v2.specs.power}</span>
                        {powerVal2 > powerVal1 && powerVal1 > 0 && (
                          <span className="text-[9px] bg-[#00FF88]/20 text-[#00FF88] px-1.5 py-0.5 rounded font-bold uppercase">
                            Higher
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Fuel Economy / Certified Range */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400 flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span>{v1.category === 'ev' || v2.category === 'ev' ? 'Certified IDC Range' : 'Fuel Efficiency / Mileage'}</span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-mono font-bold border-l border-white/5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {v1.specs.mileage}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-mono font-bold border-l border-white/5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {v2.specs.mileage}
                      </span>
                    </td>
                  </tr>

                  {/* Fuel Tank / Battery Pack */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400">
                      {v1.category === 'ev' || v2.category === 'ev' ? 'Battery Pack / Storage' : 'Fuel Tank Capacity'}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium border-l border-white/5">
                      {v1.specs.fuelTank}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium border-l border-white/5">
                      {v2.specs.fuelTank}
                    </td>
                  </tr>

                  {/* Transmission / Gearbox */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400">
                      Transmission & Clutch
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium border-l border-white/5">
                      {v1.specs.transmission}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium border-l border-white/5">
                      {v2.specs.transmission}
                    </td>
                  </tr>

                  {/* Braking System */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Braking System & Safety</span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium border-l border-white/5">
                      {v1.specs.brakes}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white font-medium border-l border-white/5">
                      {v2.specs.brakes}
                    </td>
                  </tr>

                  {/* Colours Available */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-purple-400" />
                      <span>Available Factory Colours</span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white border-l border-white/5">
                      <div className="flex flex-wrap gap-1">
                        {v1.specs.colours.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-gray-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-white border-l border-white/5">
                      <div className="flex flex-wrap gap-1">
                        {v2.specs.colours.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-gray-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* On-Road Price & EMI */}
                  <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400">
                      Showroom Dealership Price
                    </td>
                    <td className="py-3 px-3 sm:px-4 border-l border-white/5">
                      <span className="text-sm font-extrabold text-[#D6181F] font-['Rajdhani'] block tracking-wide">
                        Price = Best Price
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Official Dealership Guarantee
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 border-l border-white/5">
                      <span className="text-sm font-extrabold text-[#D6181F] font-['Rajdhani'] block tracking-wide">
                        Price = Best Price
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Official Dealership Guarantee
                      </span>
                    </td>
                  </tr>

                  {/* Monthly EMI Estimate */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-400">
                      Monthly Finance EMI (48 Mo.)
                    </td>
                    <td className="py-3 px-3 sm:px-4 border-l border-white/5 font-mono">
                      <span className="text-yellow-400 font-bold block">
                        ~{formatINR(emi1)} / month
                      </span>
                      <span className="text-[10px] text-gray-400">
                        w/ {formatINR(p1.defaultDownPayment)} down payment
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 border-l border-white/5 font-mono">
                      <span className="text-yellow-400 font-bold block">
                        ~{formatINR(emi2)} / month
                      </span>
                      <span className="text-[10px] text-gray-400">
                        w/ {formatINR(p2.defaultDownPayment)} down payment
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SIDE-BY-SIDE ENGINEERING HIGHLIGHTS & VARIANTS */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle 1 Highlights */}
            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-['Rajdhani']">
                <span className="w-2 h-2 rounded-full bg-[#D6181F]" />
                {v1.name} Key Engineered Highlights
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {v1.highlights.map((h, idx) => (
                  <div key={idx} className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block truncate">
                      {h.label}
                    </span>
                    <span className="text-xs font-extrabold text-white block mt-0.5 truncate">
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                  Available Trims & Variants:
                </span>
                <ul className="space-y-1.5">
                  {v1.variants.map((variant, vIdx) => (
                    <li
                      key={vIdx}
                      className="text-xs p-2 rounded bg-white/[0.02] border border-white/5 flex flex-col"
                    >
                      <span className="font-bold text-white text-[11px]">{variant.name}</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-0.5">
                        {variant.difference}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vehicle 2 Highlights */}
            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-['Rajdhani']">
                <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
                {v2.name} Key Engineered Highlights
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {v2.highlights.map((h, idx) => (
                  <div key={idx} className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block truncate">
                      {h.label}
                    </span>
                    <span className="text-xs font-extrabold text-white block mt-0.5 truncate">
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                  Available Trims & Variants:
                </span>
                <ul className="space-y-1.5">
                  {v2.variants.map((variant, vIdx) => (
                    <li
                      key={vIdx}
                      className="text-xs p-2 rounded bg-white/[0.02] border border-white/5 flex flex-col"
                    >
                      <span className="font-bold text-white text-[11px]">{variant.name}</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-0.5">
                        {variant.difference}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* FEATURES COMPARISON CHECKLIST */}
          {/* ================================================================= */}
          <div className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-['Rajdhani'] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D6181F]" />
              Patented Features & Core Capabilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#D6181F] uppercase tracking-wider block">
                  {v1.name} Capabilities:
                </span>
                <ul className="space-y-1">
                  {v1.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-[#D6181F] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#00FF88] uppercase tracking-wider block">
                  {v2.name} Capabilities:
                </span>
                <ul className="space-y-1">
                  {v2.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-[#00FF88] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MODAL FOOTER */}
        {/* ================================================================= */}
        <div className="p-4 border-t border-white/10 bg-[#0e0e0e] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-400 text-center sm:text-left">
            Need customized exchange appraisal or on-road price quotes? Shri Ram Hero provides instant dealership offers.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="sm:hidden flex-1 px-3 py-2 rounded-md bg-[#222] text-gray-300 text-xs font-bold uppercase transition-colors"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-md bg-[#222] hover:bg-[#2c2c2c] text-gray-300 text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            {onContactBestPrice && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onContactBestPrice(v1);
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? `${v1.name.split(' ')[1] || 'वाहन'} का ऑफर` : `Quote for ${v1.name.split(' ')[1] || 'Vehicle'}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

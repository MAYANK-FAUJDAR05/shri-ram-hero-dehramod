import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Check, 
  RotateCw,
  Info,
  Maximize2
} from 'lucide-react';
import { getColorProfile, ColorProfile } from '../utils/colorPalette';

interface ColorPalettePreviewerProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  vehicleName: string;
  vehicleImage: string;
  badge?: string;
  onOpenVirtualTour?: () => void;
}

export const ColorPalettePreviewer: React.FC<ColorPalettePreviewerProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  vehicleName,
  vehicleImage,
  badge,
  onOpenVirtualTour,
}) => {
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [sheenKey, setSheenKey] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeIndex = Math.max(
    0,
    colors.findIndex((c) => c === selectedColor)
  );

  const currentProfile: ColorProfile = getColorProfile(selectedColor || colors[0] || 'Sports Red');

  // Trigger sheen animation whenever color changes
  useEffect(() => {
    setSheenKey((prev) => prev + 1);
  }, [selectedColor]);

  // Handle auto-playing carousel of colors
  useEffect(() => {
    if (isAutoPlaying && colors.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % colors.length;
        onSelectColor(colors[nextIndex]);
      }, 3200);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, activeIndex, colors, onSelectColor]);

  const handlePrevColor = () => {
    const prevIndex = (activeIndex - 1 + colors.length) % colors.length;
    onSelectColor(colors[prevIndex]);
  };

  const handleNextColor = () => {
    const nextIndex = (activeIndex + 1) % colors.length;
    onSelectColor(colors[nextIndex]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ------------------------------------------------------------- */}
      {/* 1. DYNAMIC VEHICLE STAGE WITH COLOR TINT & SHOWROOM UNDERGLOW */}
      {/* ------------------------------------------------------------- */}
      <div 
        className="relative w-full rounded-2xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-6 min-h-[290px] sm:min-h-[340px] flex flex-col justify-between group/stage select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Dynamic Studio Ambient Spotlight & Floor Underglow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 80%, ${currentProfile.glowColor} 0%, rgba(0,0,0,0) 75%)`,
          }}
        />

        {/* Ambient Top Rim Highlight matching paint */}
        <div 
          className="absolute top-0 inset-x-0 h-24 pointer-events-none transition-all duration-700 opacity-25"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${currentProfile.primaryHex} 0%, transparent 70%)`,
          }}
        />

        {/* Top Control Bar over Image */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Badge & Color Index */}
          <div className="flex items-center gap-2 flex-wrap">
            {badge && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#D6181F] text-white shadow-md uppercase tracking-wider">
                {badge}
              </span>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-gray-200">
              <span 
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0"
                style={{ backgroundColor: currentProfile.primaryHex }}
              />
              <span className="font-bold text-white tracking-wide">{currentProfile.name}</span>
              <span className="text-gray-400 text-[10px]">
                ({activeIndex + 1}/{colors.length})
              </span>
            </div>
          </div>

          {/* Action Buttons: Auto-Cycle & Virtual Tour */}
          <div className="flex items-center gap-1.5">
            {colors.length > 1 && (
              <button
                id="btn-color-auto-play"
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                  isAutoPlaying
                    ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-lg shadow-[#D6181F]/40'
                    : 'bg-black/60 text-gray-300 hover:text-white border-white/15 hover:bg-white/10'
                }`}
                title={isAutoPlaying ? 'Pause automatic color cycle' : 'Auto-preview all factory colors'}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Auto Cycle</span>
                  </>
                )}
              </button>
            )}

            {onOpenVirtualTour && (
              <button
                id="btn-stage-virtual-tour"
                type="button"
                onClick={onOpenVirtualTour}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 hover:bg-[#D6181F] text-gray-300 hover:text-white border border-white/15 hover:border-[#D6181F] text-[11px] font-bold transition-all cursor-pointer group/tour"
                title="Launch 360° Virtual Tour"
              >
                <RotateCw className="w-3 h-3 text-[#D6181F] group-hover/tour:text-white group-hover/tour:rotate-180 transition-transform duration-500" />
                <span>360° Tour</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Vehicle Image Display with Dynamic Color Tinting */}
        <div className="relative my-auto py-2 sm:py-4 flex items-center justify-center min-h-[190px] sm:min-h-[230px]">
          {/* Previous / Next Arrow Controls */}
          {colors.length > 1 && (
            <>
              <button
                id="btn-color-prev"
                type="button"
                onClick={handlePrevColor}
                className="absolute left-0 sm:left-2 z-20 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-[#D6181F] text-white border border-white/15 hover:border-[#D6181F] backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                title="Previous Factory Color"
                aria-label="Previous Factory Color"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                id="btn-color-next"
                type="button"
                onClick={handleNextColor}
                className="absolute right-0 sm:right-2 z-20 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-[#D6181F] text-white border border-white/15 hover:border-[#D6181F] backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                title="Next Factory Color"
                aria-label="Next Factory Color"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}

          {/* Vehicle Main Image with dynamic color filter */}
          <div className="relative max-h-56 sm:max-h-64 w-full flex items-center justify-center overflow-hidden">
            <motion.img
              key={`${vehicleImage}-${selectedColor}`}
              initial={{ opacity: 0.85, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              src={vehicleImage}
              alt={`${vehicleName} in ${currentProfile.name}`}
              referrerPolicy="no-referrer"
              className="max-h-52 sm:max-h-60 w-auto object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.85)] transition-all duration-500 select-none"
              style={{
                filter: `${currentProfile.filterCss} drop-shadow(0 15px 20px rgba(0,0,0,0.85)) drop-shadow(0 0 25px ${currentProfile.glowColor})`,
              }}
            />

            {/* Subtle Color Accent Overlay for dynamic tone reflections on the bike fairings */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-color opacity-25 transition-all duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${currentProfile.primaryHex} 0%, transparent 65%)`,
              }}
            />

            {/* Sheen light sweep on color change */}
            <motion.div
              key={`sheen-${sheenKey}`}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
            />
          </div>
        </div>

        {/* Bottom Floating Paint Details Strip */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-white/10 bg-black/40 backdrop-blur-sm -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10">
              {currentProfile.finishLabel}
            </span>
            <span className="text-xs text-gray-300 italic hidden md:inline truncate max-w-sm">
              {currentProfile.description}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#00FF88] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hero Duraguard UV Anti-Fade Clearcoat</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. INTERACTIVE COLOR PALETTE TOGGLE SWATCHES */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0d0d0d] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#D6181F]/20 text-[#D6181F]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-['Rajdhani']">
                Official Factory Color Palette
              </h3>
              <p className="text-[11px] text-gray-400">
                Tap any shade to dynamically update showroom display
              </p>
            </div>
          </div>

          {/* Active Color Name with Paint Swatch */}
          <div className="flex items-center gap-2 bg-[#181818] px-3 py-1.5 rounded-xl border border-white/10">
            <div 
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shrink-0"
              style={{
                background: currentProfile.secondaryHex 
                  ? `linear-gradient(135deg, ${currentProfile.primaryHex} 50%, ${currentProfile.secondaryHex} 50%)`
                  : currentProfile.primaryHex
              }}
            />
            <span className="text-xs font-bold text-white">{currentProfile.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-bold uppercase">
              {currentProfile.finish}
            </span>
          </div>
        </div>

        {/* Swatch Grid / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {colors.map((colorName, idx) => {
            const profile = getColorProfile(colorName);
            const isSelected = selectedColor === colorName;

            return (
              <button
                key={colorName}
                id={`btn-color-swatch-${idx}`}
                type="button"
                onClick={() => onSelectColor(colorName)}
                className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer group ${
                  isSelected
                    ? 'bg-[#1e1e1e] border-[#D6181F] shadow-lg shadow-[#D6181F]/20 ring-1 ring-[#D6181F]'
                    : 'bg-[#141414] hover:bg-[#1a1a1a] border-white/10 hover:border-white/25 text-gray-300'
                }`}
              >
                {/* Circular Color Swatch */}
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

                {/* Color Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
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

                {/* Subtle active border indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D6181F] rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Shade Highlight Details Card */}
        <div className="mt-2 p-3 bg-[#141414] rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Paint Specification: {currentProfile.finishLabel}</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {currentProfile.description}
            </p>
          </div>

          <div className="text-[10px] uppercase font-bold text-gray-400 bg-black/40 px-2.5 py-1 rounded-md border border-white/10 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            <span>Ready in Showroom Inventory</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Calendar,
  Tag,
  GitCompare,
  ArrowRight,
  Trash2,
  Sparkles,
  ShieldCheck,
  Zap,
  Bike,
  RotateCw
} from 'lucide-react';
import { HeroVehicle } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { getVehiclePriceEstimate, calculateEmi, formatINR } from '../utils/finance';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (vehicle: HeroVehicle) => void;
  onContactBestPrice: (vehicle: HeroVehicle) => void;
  onCompare?: (vehicle1: HeroVehicle, vehicle2: HeroVehicle) => void;
  onOpenVirtualTour?: (vehicle: HeroVehicle) => void;
  onExploreVehicles?: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onViewDetails,
  onContactBestPrice,
  onCompare,
  onOpenVirtualTour,
  onExploreVehicles,
}) => {
  const { favoriteVehicles, removeFavorite, clearWishlist, favoritesCount } = useWishlist();
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const handleCompareAll = () => {
    if (favoriteVehicles.length >= 2 && onCompare) {
      onCompare(favoriteVehicles[0], favoriteVehicles[1]);
      onClose();
    }
  };

  const handleExplore = () => {
    onClose();
    if (onExploreVehicles) {
      onExploreVehicles();
    }
  };

  return (
    <AnimatePresence>
      <div
        id="wishlist-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="wishlist-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#141414] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D6181F]/15 border border-[#D6181F]/30 flex items-center justify-center text-[#D6181F]">
                <Heart className="w-5 h-5 fill-[#D6181F]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white font-['Rajdhani'] uppercase tracking-wide">
                    {language === 'hi' ? 'सहेजे गए वाहन (विशलिस्ट)' : 'Saved Vehicles'}
                  </h2>
                  <span
                    id="wishlist-count-badge"
                    className="px-2 py-0.5 rounded-full bg-[#D6181F] text-white text-[11px] font-bold font-mono shadow-sm"
                  >
                    {favoritesCount}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {language === 'hi'
                    ? 'आपके द्वारा चुने गए पसंदीदा मॉडल — यहाँ से सीधे तुलना करें या टेस्ट राइड बुक करें'
                    : 'Your shortlisted Hero two-wheelers — compare, request price quotes, or book rides'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {favoritesCount > 0 && (
                <button
                  id="btn-clear-wishlist"
                  type="button"
                  onClick={clearWishlist}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 text-xs font-semibold border border-white/5 transition-colors cursor-pointer"
                  title="Clear all saved vehicles"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सभी हटाएं' : 'Clear All'}</span>
                </button>
              )}
              <button
                id="btn-close-wishlist-modal"
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close wishlist modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions Strip (if items saved) */}
          {favoritesCount > 0 && (
            <div className="bg-[#181818] border-b border-white/5 px-5 py-2.5 flex items-center justify-between text-xs text-gray-400 gap-3 flex-wrap">
              <span className="text-[11px]">
                {language === 'hi'
                  ? `आपकी विशलिस्ट में ${favoritesCount} मॉडल सुरक्षित हैं`
                  : `${favoritesCount} Hero model${favoritesCount > 1 ? 's' : ''} saved for easy access`}
              </span>

              <div className="flex items-center gap-2">
                {favoritesCount >= 2 && onCompare && (
                  <button
                    id="btn-wishlist-compare-top"
                    type="button"
                    onClick={handleCompareAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#D6181F]/20 hover:bg-[#D6181F]/30 text-[#D6181F] hover:text-white border border-[#D6181F]/40 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    <GitCompare className="w-3 h-3" />
                    <span>{language === 'hi' ? 'शीर्ष 2 की तुलना करें' : 'Compare Top 2'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="sm:hidden text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
                >
                  {language === 'hi' ? 'खाली करें' : 'Clear All'}
                </button>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {favoritesCount === 0 ? (
              /* Empty Wishlist State */
              <div className="py-14 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D6181F]/10 border border-[#D6181F]/20 flex items-center justify-center mx-auto text-[#D6181F]">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                    {language === 'hi' ? 'आपकी विशलिस्ट खाली है' : 'No Saved Vehicles Yet'}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {language === 'hi'
                      ? 'अपनी पसंदीदा मोटरसाइकिल या स्कूटर कार्ड पर दिए गए हार्ट (दिल) आइकन पर क्लिक करें। आपके पसंदीदा मॉडल यहाँ सुरक्षित रहेंगे।'
                      : 'Tap the heart icon on any motorcycle or scooter card to save your top picks here. You can then quickly compare specs, estimate EMIs, and book test rides.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    id="btn-wishlist-explore-empty"
                    type="button"
                    onClick={handleExplore}
                    className="px-5 py-2.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Bike className="w-4 h-4" />
                    <span>{language === 'hi' ? 'सभी मॉडल देखें' : 'Explore Hero Vehicles'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Saved Vehicles List */
              <div className="space-y-3">
                {favoriteVehicles.map((vehicle) => {
                  const pricing = getVehiclePriceEstimate(vehicle);
                  const startingEmi = calculateEmi(Math.max(5000, pricing.onRoadPrice - pricing.defaultDownPayment), 8.5, 36);

                  return (
                    <motion.div
                      key={vehicle.id}
                      id={`saved-vehicle-item-${vehicle.id}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#181818] border border-white/10 hover:border-white/20 rounded-xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 group"
                    >
                      {/* Left: Image & Details */}
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                        <div
                          onClick={() => {
                            onViewDetails(vehicle);
                            onClose();
                          }}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-b from-[#252525] to-[#1a1a1a] border border-white/10 p-2 shrink-0 flex items-center justify-center cursor-pointer hover:border-[#D6181F]/50 transition-colors"
                        >
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 text-gray-300 border border-white/10">
                              {vehicle.category}
                            </span>
                            {vehicle.category === 'ev' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30">
                                EV
                              </span>
                            )}
                            {vehicle.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                                {vehicle.badge}
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => {
                              onViewDetails(vehicle);
                              onClose();
                            }}
                            className="text-base sm:text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-tight truncate hover:text-[#D6181F] transition-colors cursor-pointer"
                          >
                            {vehicle.name}
                          </h3>

                          <div className="flex items-center gap-3 text-xs flex-wrap">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[10px] text-gray-400 uppercase font-semibold">Price:</span>
                              <span className="text-[#D6181F] font-black font-['Rajdhani'] text-xs tracking-wide">
                                Price = Best Price
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-[10px] text-yellow-400 font-semibold uppercase">EMI from:</span>
                              <span className="text-yellow-300 font-bold font-mono">
                                {formatINR(startingEmi)}/mo
                              </span>
                            </div>
                          </div>

                          {/* Quick specs pill */}
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium pt-0.5">
                            <span>{vehicle.specs.engine}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">{vehicle.specs.mileage}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="flex items-center gap-1.5 w-full sm:w-auto">
                          {onOpenVirtualTour && (
                            <button
                              id={`saved-btn-tour-${vehicle.id}`}
                              type="button"
                              onClick={() => {
                                onOpenVirtualTour(vehicle);
                                onClose();
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#111] hover:bg-[#222] text-gray-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#D6181F]/50 transition-colors cursor-pointer flex items-center gap-1"
                              title="360° Virtual Tour"
                            >
                              <RotateCw className="w-3 h-3 text-[#D6181F]" />
                              <span>360°</span>
                            </button>
                          )}

                          <button
                            id={`saved-btn-details-${vehicle.id}`}
                            type="button"
                            onClick={() => {
                              onViewDetails(vehicle);
                              onClose();
                            }}
                            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                          >
                            {language === 'hi' ? 'विवरण' : 'Details'}
                          </button>

                          <button
                            id={`saved-btn-pricequote-${vehicle.id}`}
                            type="button"
                            onClick={() => {
                              onContactBestPrice(vehicle);
                              onClose();
                            }}
                            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#D6181F]/30 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{language === 'hi' ? 'ऑफर पाएं' : 'Get Quote'}</span>
                          </button>

                          <button
                            id={`saved-btn-remove-${vehicle.id}`}
                            type="button"
                            onClick={() => removeFavorite(vehicle.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer"
                            title="Remove from saved vehicles"
                            aria-label={`Remove ${vehicle.name} from saved vehicles`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3.5 border-t border-white/10 bg-[#0d0d0d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-400 text-[11px] text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'सहेजे गए वाहन आपके ब्राउज़र में सुरक्षित हैं • कभी भी कोटेशन प्राप्त करें'
                  : 'Shortlisted models are stored locally • Ready to get the best on-road price?'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>

              {favoritesCount > 0 && (
                <button
                  id="btn-wishlist-book-first"
                  type="button"
                  onClick={() => {
                    if (favoriteVehicles.length > 0) {
                      onContactBestPrice(favoriteVehicles[0]);
                      onClose();
                    }
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'ऑन-रोड कोटेशन प्राप्त करें' : 'Get On-Road Quote'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

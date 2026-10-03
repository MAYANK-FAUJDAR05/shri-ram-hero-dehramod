import React from 'react';
import { ShieldCheck, Award, Fuel, Zap, Gift, MapPin, Clock, Phone } from 'lucide-react';
import { MainFilter } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroBannerProps {
  onSelectCategory: (tab: MainFilter) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory: _onSelectCategory }) => {
  const { language, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] pt-8 pb-10 border-b border-white/10">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-[radial-gradient(ellipse_at_top,rgba(214,24,31,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D6181F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-6">
        {/* Title Group */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6181F]/15 border border-[#D6181F]/30 text-[#D6181F] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6181F] animate-pulse" />
            {t.heroBanner.badge}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-['Rajdhani'] leading-none">
            {t.heroBanner.titleMain} <span className="text-[#D6181F]">{t.heroBanner.titleHighlight}</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroBanner.description}
          </p>
        </div>

        {/* Free Accessories & Dealership Operational Banner */}
        <div className="bg-gradient-to-r from-[#1b1b1b] via-[#221314] to-[#1b1b1b] border border-[#D6181F]/40 rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wide">
                <Gift className="w-3.5 h-3.5" />
                <span>
                  {language === 'hi'
                    ? '🎁 प्रत्येक नए वाहन के साथ मुफ्त एक्सेसरीज किट'
                    : '🎁 Free Delivery Accessories Kit with Every New Vehicle'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {language === 'hi'
                  ? 'फ्री सामान: हेलमेट, सीट कवर, साइलेंसर कवर, साइड मिरर, फर्स्ट एड किट, टूल किट आदि।'
                  : 'Free Accessories: Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                {['Helmet', 'Seat Cover', 'Silencer Cover', 'Side Mirror', 'First Aid Kit', 'Tool Kit'].map(
                  (item, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-black/60 border border-emerald-500/30 text-emerald-300 font-medium"
                    >
                      ✓ {item}
                    </span>
                  )
                )}
                <span className="text-gray-400 font-bold">& etc.</span>
              </div>
            </div>

            {/* Dealership Info Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <div className="bg-black/60 border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6181F] shrink-0" />
                <div className="text-left">
                  <div className="text-[9px] font-bold uppercase text-gray-400">Address</div>
                  <div className="text-xs font-bold text-white whitespace-nowrap">
                    Dehra Mod, Nadbai, Bharatpur, Raj.
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-[9px] font-bold uppercase text-gray-400">Showroom Hours</div>
                  <div className="text-xs font-bold text-white whitespace-nowrap">8:00 AM - 6:00 PM</div>
                </div>
              </div>

              <a
                href="tel:8890992086"
                className="bg-[#D6181F] hover:bg-[#b5141a] px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs transition-colors whitespace-nowrap shadow-lg shadow-[#D6181F]/30"
              >
                <Phone className="w-4 h-4" />
                <span>Agency No: 8890992086</span>
              </a>
            </div>
          </div>
        </div>

        {/* Agency Trust Badges Bar matching Immersive UI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#181818] border border-white/10 hover:border-[#D6181F]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/15 border border-[#D6181F]/30 flex items-center justify-center text-[#D6181F] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase font-['Rajdhani']">{t.heroBanner.ridersTitle}</div>
              <div className="text-[10px] text-gray-400">{t.heroBanner.ridersSub}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#181818] border border-white/10 hover:border-[#D6181F]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/15 border border-[#D6181F]/30 flex items-center justify-center text-[#D6181F] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase font-['Rajdhani']">{t.heroBanner.warrantyTitle}</div>
              <div className="text-[10px] text-gray-400">{t.heroBanner.warrantySub}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#181818] border border-white/10 hover:border-[#D6181F]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/15 border border-[#D6181F]/30 flex items-center justify-center text-[#D6181F] shrink-0">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase font-['Rajdhani']">{t.heroBanner.xsensTitle}</div>
              <div className="text-[10px] text-gray-400">{t.heroBanner.xsensSub}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#181818] border border-white/10 hover:border-[#00FF88]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase font-['Rajdhani']">{t.heroBanner.vidaTitle}</div>
              <div className="text-[10px] text-gray-400">{t.heroBanner.vidaSub}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

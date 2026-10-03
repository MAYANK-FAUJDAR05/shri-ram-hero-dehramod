import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Mail, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DealershipWeatherWidget } from './DealershipWeatherWidget';

interface AgencyFooterProps {
  activeFilterName?: string;
  shownCount?: number;
  totalCount?: number;
  onScrollToFaqs?: () => void;
}

export const AgencyFooter: React.FC<AgencyFooterProps> = ({
  activeFilterName = 'All Vehicles',
  shownCount = 18,
  totalCount = 18,
  onScrollToFaqs,
}) => {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const percent = totalCount > 0 ? Math.round((shownCount / totalCount) * 100) : 100;

  return (
    <footer className="bg-black border-t border-white/10 text-gray-400 text-xs">
      {/* Immersive UI Bottom Status Strip */}
      <div className="bg-[#0c0c0c] border-b border-white/5 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {t.footer.filterActive} <span className="text-[#D6181F]">{activeFilterName}</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 sm:w-32 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D6181F] rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                {shownCount}/{totalCount}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              {language === 'hi'
                ? `दिखाए जा रहे हैं: ${totalCount} में से ${shownCount} हीरो मोटोकॉर्प मॉडल`
                : `${t.footer.showing} ${shownCount} ${t.footer.of} ${totalCount} ${t.footer.models}`}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#D6181F]" />
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-[#D6181F] rounded-sm transform -skew-x-12 flex items-center justify-center text-white font-['Rajdhani'] font-black text-base shadow-md shadow-[#D6181F]/30">
                <span className="transform skew-x-12">H</span>
              </div>
              <span className="font-['Rajdhani'] font-black text-xl text-white tracking-tight uppercase">
                {language === 'hi' ? 'श्री राम हीरो' : 'SHRI RAM HERO'}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.footer.brandDesc}
            </p>
            <div className="flex items-center gap-2 text-[#00FF88] font-semibold pt-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.footer.genuinePartsNote}</span>
            </div>
            {/* Free Delivery Accessories Perk Card */}
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px]">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <span>🎁 Free Accessories Kit</span>
              </div>
              <p className="text-gray-300 text-[10px] mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'प्रत्येक वाहन के साथ फ्री: हेलमेट, सीट कवर, साइलेंसर कवर, साइड मिरर, फर्स्ट एड किट, टूल किट आदि।'
                  : 'Free with every two-wheeler: Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.'}
              </p>
            </div>
            {onScrollToFaqs && (
              <button
                id="footer-btn-faqs"
                type="button"
                onClick={onScrollToFaqs}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
              >
                <span>{language === 'hi' ? 'वारंटी व सर्विसिंग एफएक्यू' : 'Warranty & Service FAQs'}</span>
                <span className="text-[#D6181F]">→</span>
              </button>
            )}
          </div>

          {/* Showroom & Service Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D6181F] font-['Rajdhani'] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {t.footer.showroomHoursTitle}
            </h4>
            <ul className="space-y-1.5 text-gray-300 text-[11px]">
              <li className="flex justify-between">
                <span>{t.footer.monSat}</span>
                <span className="font-semibold text-white">{t.footer.monSatHours}</span>
              </li>
              <li className="flex justify-between">
                <span>{t.footer.sun}</span>
                <span className="font-semibold text-white">{t.footer.sunHours}</span>
              </li>
              <li className="flex justify-between pt-1 border-t border-white/5 text-gray-400">
                <span>{t.footer.serviceCenter}</span>
                <span className="font-medium text-gray-200">{t.footer.serviceCenterHours}</span>
              </li>
            </ul>
          </div>

          {/* Dealership Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D6181F] font-['Rajdhani'] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {t.footer.locationsTitle}
            </h4>
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="font-semibold text-white">{t.footer.flagship}</div>
                <div className="text-[10px] text-gray-400">{t.footer.flagshipDesc}</div>
              </div>
              <div>
                <div className="font-semibold text-white">{t.footer.workshop}</div>
                <div className="text-[10px] text-gray-400">{t.footer.workshopDesc}</div>
              </div>
              <div>
                <div className="font-semibold text-white">{t.footer.vidaHub}</div>
                <div className="text-[10px] text-gray-400">{t.footer.vidaHubDesc}</div>
              </div>
            </div>

            {/* Weather Widget near Dealership Location for Scheduling Test Rides */}
            <DealershipWeatherWidget />
          </div>

          {/* Contact & Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D6181F] font-['Rajdhani'] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {t.footer.helplineTitle}
            </h4>
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="text-[10px] text-gray-400">{t.footer.salesBooking}</div>
                <a href="tel:8890992086" className="font-bold text-white hover:text-[#D6181F] text-sm font-mono transition-colors">
                  8890992086
                </a>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">{t.footer.rsaTitle}</div>
                <a href="tel:8890992086" className="font-bold text-[#D6181F] hover:underline text-sm font-mono transition-colors">
                  8890992086
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1 text-gray-300">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[11px]">contact@shriramhero.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

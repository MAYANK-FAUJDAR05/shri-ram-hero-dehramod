import React, { useState } from 'react';
import { HeroVehicle, PriceInquiryFormData } from '../types';
import { HERO_VEHICLES } from '../data/vehicles';
import { X, Tag, CheckCircle2, Phone, User, MapPin, Sparkles, Percent, ShieldCheck } from 'lucide-react';

interface BestPriceModalProps {
  initialVehicle: HeroVehicle | null;
  onClose: () => void;
}

export const BestPriceModal: React.FC<BestPriceModalProps> = ({
  initialVehicle,
  onClose,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialVehicle ? initialVehicle.id : HERO_VEHICLES[0].id
  );

  const currentVehicle =
    HERO_VEHICLES.find((v) => v.id === selectedVehicleId) || HERO_VEHICLES[0];

  const [formData, setFormData] = useState<PriceInquiryFormData>({
    fullName: '',
    mobile: '',
    city: 'New Delhi / NCR',
    modelId: selectedVehicleId,
    modelName: currentVehicle.name,
    wantExchange: false,
    financeRequired: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile) return;
    const generated = `HERO-QUOTE-${Math.floor(100000 + Math.random() * 900000)}`;
    setQuoteId(generated);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Price = Best Price
              </h2>
              <p className="text-xs text-gray-400">
                Shri Ram Hero &bull; Authorized Lowest Price Guarantee & Offers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            {/* Vehicle Card Header */}
            <div className="flex items-center gap-3 bg-[#0d0d0d] p-3 rounded-xl border border-white/5">
              <img
                src={currentVehicle.image}
                alt={currentVehicle.name}
                referrerPolicy="no-referrer"
                className="w-16 h-12 object-contain"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Inquiring Best Price For</span>
                <h4 className="text-base font-bold text-white truncate font-['Rajdhani'] uppercase">
                  {currentVehicle.name}
                </h4>
                <div className="text-xs text-[#D6181F] font-bold font-['Rajdhani'] tracking-wide">🏷️ Price = Best Price</div>
              </div>
            </div>

            {/* Current Active Offers Banner */}
            <div className="bg-gradient-to-r from-[#D6181F]/20 via-[#0d0d0d] to-[#0d0d0d] p-3.5 rounded-xl border border-[#D6181F]/30 text-xs text-gray-300 space-y-1">
              <div className="font-bold text-[#D6181F] flex items-center gap-1 font-['Rajdhani'] uppercase tracking-wider text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D6181F]" />
                Active Showroom Exclusive Benefits:
              </div>
              <ul className="text-[11px] text-gray-300 list-disc list-inside space-y-0.5">
                <li className="text-emerald-300 font-semibold">
                  🎁 Free Accessories: Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.
                </li>
                <li>Instant Exchange Bonus up to ₹3,000 on any old two-wheeler</li>
                <li>Low Down Payment scheme starting at just ₹999</li>
                <li>Hero FinCorp 0% Processing Fee & Pre-approved Instant Sanction</li>
                <li>5-Year Hero MotoCorp Genuine Warranty included</li>
              </ul>
            </div>

            {/* Model Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Vehicle Model
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value);
                  const found = HERO_VEHICLES.find((v) => v.id === e.target.value);
                  if (found) {
                    setFormData((prev) => ({ ...prev, modelId: found.id, modelName: found.name }));
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-[#D6181F]"
              >
                {HERO_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#181818] text-white">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Details */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-[#D6181F] placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      pattern="[0-9]{10}"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-[#D6181F] placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    City / RTO Zone
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-[#D6181F] placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wantExchange}
                    onChange={(e) => setFormData({ ...formData, wantExchange: e.target.checked })}
                    className="accent-[#D6181F] rounded"
                  />
                  <span>I want to exchange my old two-wheeler for an Exchange Bonus.</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financeRequired}
                    onChange={(e) => setFormData({ ...formData, financeRequired: e.target.checked })}
                    className="accent-[#D6181F] rounded"
                  />
                  <span>Need low-interest Hero FinCorp EMI / Loan assistance.</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Request Best On-Road Price
              </button>
              <p className="text-[11px] text-gray-500 text-center mt-2">
                Guaranteed genuine dealership quote with all current promotional discounts.
              </p>
            </div>
          </form>
        ) : (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#D6181F]/15 border border-[#D6181F]/30 rounded-full flex items-center justify-center mx-auto text-[#D6181F]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#D6181F] uppercase tracking-widest">
                Quote Request Received
              </span>
              <h3 className="text-2xl font-bold text-white font-['Rajdhani']">
                OFFICIAL DEALERSHIP QUOTATION
              </h3>
              <p className="text-xs text-gray-400">
                Inquiry Reference:{' '}
                <span className="font-mono text-[#D6181F] font-bold bg-[#0d0d0d] px-2 py-0.5 rounded border border-white/10">
                  {quoteId}
                </span>
              </p>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Vehicle:</span>
                <span className="font-bold text-white">{currentVehicle.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Customer:</span>
                <span className="font-bold text-white">{formData.fullName} ({formData.mobile})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Zone:</span>
                <span className="font-bold text-white">{formData.city}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Dealership:</span>
                <span className="font-bold text-white text-right">Dehra Mod, Nadbai, Bharatpur, Raj.</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Agency No:</span>
                <a href="tel:8890992086" className="font-bold text-[#D6181F] underline">8890992086</a>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Showroom Hours:</span>
                <span className="font-semibold text-white">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-400">Free Inclusions:</span>
                <span className="font-bold text-emerald-400 text-right">Helmet, Seat Cover, Silencer Cover, Side Mirror, First Aid Kit, Tool Kit etc.</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Our Senior Relationship Manager at Shri Ram Hero will contact you shortly with the best on-road pricing, breakdown of taxes, and applicable festive schemes.
            </p>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#D6181F]/30 transition-all cursor-pointer"
              >
                Close & Return to Showroom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

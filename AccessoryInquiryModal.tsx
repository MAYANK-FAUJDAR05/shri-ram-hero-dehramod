import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Wrench, Phone, User, Tag, Sparkles } from 'lucide-react';
import { HeroAccessory } from '../types';
import { HERO_VEHICLES } from '../data/vehicles';

interface AccessoryInquiryModalProps {
  accessory: HeroAccessory;
  initialVehicleModel?: string;
  onClose: () => void;
}

export const AccessoryInquiryModal: React.FC<AccessoryInquiryModalProps> = ({
  accessory,
  initialVehicleModel,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    vehicleModel: initialVehicleModel || HERO_VEHICLES[0].name,
    dealershipBranch: 'Shri Ram Hero - Flagship Showroom (Ring Road)',
    installationRequired: true,
    quantity: 1,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'SRH-ACC-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const totalPrice = accessory.price * formData.quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Shri Ram Hero Genuine Accessories
              </h2>
              <p className="text-[11px] text-gray-400">
                100% Genuine Hero MotoCorp Part (HGA Certified)
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
            {/* Product Summary Card */}
            <div className="flex items-center gap-3.5 bg-[#0d0d0d] p-3.5 rounded-xl border border-white/5">
              <img
                src={accessory.image}
                alt={accessory.name}
                className="w-20 h-16 object-cover rounded-lg border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-[#D6181F] uppercase tracking-wider bg-[#D6181F]/15 px-2 py-0.5 rounded">
                    {accessory.categoryLabel}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Part: {accessory.partNumber}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-1">
                  {accessory.name}
                </h4>
                {accessory.hindiTitle && (
                  <p className="text-[10px] text-gray-400 truncate">{accessory.hindiTitle}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-black text-white font-['Rajdhani']">
                    ₹{accessory.price.toLocaleString()}
                  </span>
                  {accessory.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{accessory.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] text-[#00FF88] font-bold">
                    Dealership In-Stock
                  </span>
                </div>
              </div>
            </div>

            {/* Dealership Fitting Assurance */}
            <div className="bg-gradient-to-r from-[#D6181F]/15 via-[#0d0d0d] to-[#0d0d0d] p-3 rounded-xl border border-[#D6181F]/20 text-xs text-gray-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5 font-['Rajdhani'] uppercase tracking-wider text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D6181F]" />
                Shri Ram Hero Fitment Promise
              </div>
              <p className="text-[11px] text-gray-400">
                Fitted by certified Hero MotoCorp master technicians using OEM torque specifications. Preserves your factory vehicle warranty completely.
              </p>
            </div>

            {/* Vehicle Model & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Your Two-Wheeler Model *
                </label>
                <select
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-[#D6181F]"
                >
                  {HERO_VEHICLES.map((v) => (
                    <option key={v.id} value={v.name} className="bg-[#181818] text-white">
                      {v.name}
                    </option>
                  ))}
                  <option value="Other Hero Two-Wheeler" className="bg-[#181818] text-white">
                    Other Hero Two-Wheeler
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Quantity
                </label>
                <select
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-[#D6181F]"
                >
                  <option value={1}>1 Unit</option>
                  <option value={2}>2 Units</option>
                  <option value={3}>3 Units</option>
                  <option value={4}>4 Units</option>
                </select>
              </div>
            </div>

            {/* Dealership Pickup Branch */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Dealership Collection Branch *
              </label>
              <select
                value={formData.dealershipBranch}
                onChange={(e) => setFormData({ ...formData, dealershipBranch: e.target.value })}
                className="w-full px-3 py-2 bg-[#0d0d0d] border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-[#D6181F]"
              >
                <option value="Shri Ram Hero - Flagship Showroom (Ring Road)">
                  Shri Ram Hero - Flagship Showroom (Ring Road, Prime City)
                </option>
                <option value="Shri Ram Hero - Workshop & Spares Center (Auto Complex)">
                  Shri Ram Hero - Workshop & Spares Center (Sector 18)
                </option>
                <option value="Shri Ram Hero - VIDA Electric Experience Hub">
                  Shri Ram Hero - VIDA Electric Experience Hub (City Centre)
                </option>
              </select>
            </div>

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#0d0d0d] border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-[#D6181F] placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#0d0d0d] border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-[#D6181F] placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Installation Option */}
            <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.installationRequired}
                onChange={(e) => setFormData({ ...formData, installationRequired: e.target.checked })}
                className="accent-[#D6181F] rounded"
              />
              <span>I want technician installation at Shri Ram Hero service bay (Free fitment assistance).</span>
            </label>

            {/* Total & Submit Button */}
            <div className="pt-2">
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 mb-3">
                <span className="text-xs text-gray-400">Total Dealership Price:</span>
                <span className="text-lg font-black text-white font-['Rajdhani']">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Reserve Accessory at Dealership
              </button>
              <p className="text-[10px] text-gray-500 text-center mt-2">
                No advance payment needed online. Pay at dealership counter upon inspection and fitting.
              </p>
            </div>
          </form>
        ) : (
          /* Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#00FF88]/15 border border-[#00FF88]/30 rounded-full flex items-center justify-center mx-auto text-[#00FF88]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#00FF88] uppercase tracking-widest">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl font-bold text-white font-['Rajdhani']">
                Accessory Ready for Pickup
              </h3>
              <p className="text-xs text-gray-400">
                Reservation Reference Number:{' '}
                <span className="font-mono text-[#D6181F] font-bold bg-[#0d0d0d] px-2 py-0.5 rounded border border-white/10">
                  {bookingRef}
                </span>
              </p>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Item:</span>
                <span className="font-bold text-white text-right truncate ml-2">{accessory.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Vehicle:</span>
                <span className="font-bold text-white">{formData.vehicleModel}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Customer:</span>
                <span className="font-bold text-white">{formData.fullName} ({formData.mobile})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Amount Due:</span>
                <span className="font-bold text-[#00FF88]">₹{totalPrice.toLocaleString()} (Pay at Counter)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Showroom:</span>
                <span className="font-bold text-white text-right truncate ml-2">{formData.dealershipBranch}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400 max-w-sm mx-auto flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
              <span>Our Spares & Accessories Manager will keep this reserved for 48 hours.</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-md bg-[#222] hover:bg-[#2a2a2a] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done / Back to Showroom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

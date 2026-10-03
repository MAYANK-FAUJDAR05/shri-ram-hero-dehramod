import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroVehicle, FinanceApplicationData } from '../types';
import {
  getVehiclePriceEstimate,
  computeFinancialDetails,
  generateAmortizationSchedule,
  PARTNER_BANKS,
  formatINR,
} from '../utils/finance';
import {
  X,
  Calculator,
  Percent,
  Calendar,
  IndianRupee,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FinancialCalculatorModalProps {
  vehicle: HeroVehicle | null;
  onClose: () => void;
}

export const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({
  vehicle,
  onClose,
}) => {
  if (!vehicle) return null;

  const initialPricing = useMemo(() => getVehiclePriceEstimate(vehicle), [vehicle]);

  // States
  const [onRoadPrice, setOnRoadPrice] = useState<number>(initialPricing.onRoadPrice);
  const [downPayment, setDownPayment] = useState<number>(initialPricing.defaultDownPayment);
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% Hero FinCorp standard
  const [tenureMonths, setTenureMonths] = useState<number>(36); // 36 months default
  const [selectedBankId, setSelectedBankId] = useState<string>('herofincorp');
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [showApplicationForm, setShowApplicationForm] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Application form fields
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantMobile, setApplicantMobile] = useState<string>('');
  const [applicantCity, setApplicantCity] = useState<string>('Aligarh');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed' | 'farmer' | 'student'>('salaried');
  const [preferredBank, setPreferredBank] = useState<string>('Hero FinCorp (Instant)');
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);
  const [submittedRefId, setSubmittedRefId] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Re-sync if vehicle changes
  useEffect(() => {
    setOnRoadPrice(initialPricing.onRoadPrice);
    setDownPayment(initialPricing.defaultDownPayment);
    setInterestRate(8.5);
    setTenureMonths(36);
    setSelectedBankId('herofincorp');
    setShowApplicationForm(false);
    setApplicationSubmitted(false);
    setFormError('');
  }, [vehicle, initialPricing]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Live calculation
  const calc = useMemo(() => {
    return computeFinancialDetails(
      vehicle,
      onRoadPrice,
      downPayment,
      interestRate,
      tenureMonths
    );
  }, [vehicle, onRoadPrice, downPayment, interestRate, tenureMonths]);

  // Down Payment Percentage
  const downPaymentPercent = Math.round((calc.downPayment / onRoadPrice) * 100);

  // Amortization Table
  const amortizationRows = useMemo(() => {
    return generateAmortizationSchedule(calc.loanAmount, calc.interestRate, calc.tenureMonths);
  }, [calc.loanAmount, calc.interestRate, calc.tenureMonths]);

  // Quick preset handlers
  const handleBankSelect = (bank: (typeof PARTNER_BANKS)[0]) => {
    setSelectedBankId(bank.id);
    setInterestRate(bank.rate);
    setPreferredBank(bank.name);
  };

  const handlePercentageDownPayment = (percent: number) => {
    const calculated = Math.round((onRoadPrice * percent) / 100);
    // Round to nearest 500
    const rounded = Math.round(calculated / 500) * 500;
    setDownPayment(rounded);
  };

  // Copy loan summary
  const handleCopySummary = () => {
    const summary = `Shri Ram Hero - Loan & EMI Estimate
Model: ${vehicle.name}
On-Road Price: ${formatINR(calc.onRoadPrice)}
Down Payment: ${formatINR(calc.downPayment)} (${downPaymentPercent}%)
Loan Amount: ${formatINR(calc.loanAmount)}
Interest Rate: ${calc.interestRate}% p.a.
Tenure: ${calc.tenureMonths} Months (${(calc.tenureMonths / 12).toFixed(1)} Years)
----------------------------------------
ESTIMATED EMI: ${formatINR(calc.monthlyEmi)} / month
Total Interest: ${formatINR(calc.totalInterest)}
Total Repayable: ${formatINR(calc.totalAmountPayable)}
----------------------------------------
Dealership: Shri Ram Hero, Dehra Mod, Nadbai, Bharatpur, Raj.
Agency No: 8890992086`;

    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  // Submit finance application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    const cleanMobile = applicantMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    setFormError('');
    const randomRef = 'SRH-FIN-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedRefId(randomRef);

    const applicationPayload: FinanceApplicationData = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      onRoadPrice: calc.onRoadPrice,
      loanAmount: calc.loanAmount,
      downPayment: calc.downPayment,
      tenureMonths: calc.tenureMonths,
      interestRate: calc.interestRate,
      monthlyEmi: calc.monthlyEmi,
      fullName: applicantName.trim(),
      mobile: cleanMobile,
      city: applicantCity.trim(),
      employmentType,
      preferredBank,
    };

    // Store in localStorage for audit persistence
    try {
      const existing = JSON.parse(localStorage.getItem('shri_ram_hero_finance_inquiries') || '[]');
      existing.push({
        ...applicationPayload,
        referenceId: randomRef,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('shri_ram_hero_finance_inquiries', JSON.stringify(existing));
    } catch {
      // ignore storage failure
    }

    setApplicationSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        id={`financial-calculator-modal-${vehicle.id}`}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#0c0c0c] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/15 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                  Hero Financial & EMI Calculator
                </h2>
                <span className="hidden sm:inline-block text-[10px] text-[#00FF88] font-bold bg-[#00FF88]/10 px-2 py-0.5 rounded border border-[#00FF88]/30">
                  Instant Dealership Desk
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Custom loan quotes, down payment adjustment & monthly EMI projections for{' '}
                <span className="text-white font-semibold">{vehicle.name}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-close-finance-modal"
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Vehicle Summary Card */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-20 h-14 bg-black/40 rounded-lg p-1 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-contain filter drop-shadow"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase">
                    {vehicle.name}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-gray-300 border border-white/10">
                    {vehicle.category}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 italic line-clamp-1">{vehicle.tagline}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  Est. On-Road Price (Aligarh)
                </span>
                <span className="text-lg font-bold text-white font-['Rajdhani']">
                  {formatINR(onRoadPrice)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black border border-white/10 hover:border-white/20 text-xs text-gray-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy EMI Summary"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00FF88]" />
                    <span className="text-[#00FF88] text-[11px] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[11px]">Copy Quote</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main 2-Column Grid: Controls Left, Live Financial Output Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ========================================================================= */}
            {/* LEFT COLUMN: Interactive Sliders & Inputs (7 cols) */}
            {/* ========================================================================= */}
            <div className="lg:col-span-7 space-y-5 bg-[#101010] p-4 sm:p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5 font-['Rajdhani']">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6181F]" />
                  Configure Loan Parameters
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOnRoadPrice(initialPricing.onRoadPrice);
                    setDownPayment(initialPricing.defaultDownPayment);
                    setInterestRate(8.5);
                    setTenureMonths(36);
                    setSelectedBankId('herofincorp');
                  }}
                  className="text-[10px] text-gray-400 hover:text-[#D6181F] transition-colors underline cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>

              {/* 1. On-Road Vehicle Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-300 font-semibold flex items-center gap-1">
                    <span>1. Vehicle On-Road Price</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      (Includes Ex-Showroom, RTO & Insurance)
                    </span>
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 font-mono text-xs">₹</span>
                    <input
                      id="input-on-road-price"
                      type="number"
                      min={50000}
                      max={350000}
                      step={1000}
                      value={onRoadPrice}
                      onChange={(e) => {
                        const val = Math.max(40000, Number(e.target.value));
                        setOnRoadPrice(val);
                        if (downPayment >= val) {
                          setDownPayment(Math.round(val * 0.2));
                        }
                      }}
                      className="w-28 bg-[#1a1a1a] text-right text-white font-bold font-mono px-2 py-1 rounded border border-white/10 text-xs focus:border-[#D6181F] outline-none"
                    />
                  </div>
                </div>

                <input
                  id="slider-on-road-price"
                  type="range"
                  min={50000}
                  max={280000}
                  step={1000}
                  value={onRoadPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOnRoadPrice(val);
                    if (downPayment >= val) {
                      setDownPayment(Math.round(val * 0.2));
                    }
                  }}
                  className="w-full accent-[#D6181F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>₹50,000 (Entry)</span>
                  <span>{formatINR(onRoadPrice)}</span>
                  <span>₹2,80,000 (Premium)</span>
                </div>
              </div>

              {/* 2. Down Payment */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <label className="text-gray-300 font-semibold block">
                      2. Down Payment (Cash Paid at Showroom)
                    </label>
                    <span className="text-[10px] text-gray-400">
                      Minimum recommended: {formatINR(initialPricing.minDownPayment)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#00FF88] bg-[#00FF88]/10 px-1.5 py-0.5 rounded">
                      {downPaymentPercent}% of On-Road
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 font-mono text-xs">₹</span>
                      <input
                        id="input-down-payment"
                        type="number"
                        min={5000}
                        max={onRoadPrice - 5000}
                        step={500}
                        value={downPayment}
                        onChange={(e) => setDownPayment(Math.max(5000, Number(e.target.value)))}
                        className="w-24 bg-[#1a1a1a] text-right text-white font-bold font-mono px-2 py-1 rounded border border-white/10 text-xs focus:border-[#D6181F] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <input
                  id="slider-down-payment"
                  type="range"
                  min={5000}
                  max={Math.round(onRoadPrice * 0.75)}
                  step={1000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#D6181F] cursor-pointer"
                />

                {/* Quick percentage buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-medium mr-1">Quick Select:</span>
                  {[10, 15, 20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentageDownPayment(pct)}
                      className={`text-[10px] px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                        downPaymentPercent === pct
                          ? 'bg-[#D6181F] text-white'
                          : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Resulting Principal Loan Amount */}
              <div className="bg-black/50 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-[#00FF88]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Principal Loan Amount Required
                    </span>
                    <span className="text-xs text-gray-400">
                      (On-Road Price minus Down Payment)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-bold text-[#00FF88] font-mono">
                    {formatINR(calc.loanAmount)}
                  </span>
                </div>
              </div>

              {/* 4. Interest Rate (% p.a.) & Bank Selection */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-300 font-semibold flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-[#D6181F]" />
                    3. Annual Interest Rate (% p.a.)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id="input-interest-rate"
                      type="number"
                      min={6.0}
                      max={18.0}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => {
                        setInterestRate(Number(e.target.value));
                        setSelectedBankId('custom');
                      }}
                      className="w-16 bg-[#1a1a1a] text-right text-white font-bold font-mono px-2 py-1 rounded border border-white/10 text-xs focus:border-[#D6181F] outline-none"
                    />
                    <span className="text-gray-400 font-mono text-xs">%</span>
                  </div>
                </div>

                <input
                  id="slider-interest-rate"
                  type="range"
                  min={6.5}
                  max={16.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => {
                    setInterestRate(Number(e.target.value));
                    setSelectedBankId('custom');
                  }}
                  className="w-full accent-[#D6181F] cursor-pointer"
                />

                {/* Partner Banks Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Select Dealership Finance Partner Scheme:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PARTNER_BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => handleBankSelect(bank)}
                        className={`p-2 rounded-lg text-left border cursor-pointer transition-all ${
                          selectedBankId === bank.id
                            ? 'bg-[#D6181F]/15 border-[#D6181F] text-white shadow-sm'
                            : 'bg-[#181818] border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold truncate">{bank.name.split(' ')[0]}</span>
                          <span className="text-[10px] font-bold text-[#00FF88] font-mono">
                            {bank.rate}%
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">
                          {bank.badge}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Loan Tenure (Months) */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-300 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D6181F]" />
                    4. Loan Tenure (Duration)
                  </label>
                  <span className="text-xs font-bold text-white font-mono bg-[#1a1a1a] px-2 py-0.5 rounded border border-white/10">
                    {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} Years)
                  </span>
                </div>

                <input
                  id="slider-tenure-months"
                  type="range"
                  min={6}
                  max={60}
                  step={6}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full accent-[#D6181F] cursor-pointer"
                />

                {/* Quick Tenure Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {[12, 24, 36, 48, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-1.5 text-xs rounded-lg font-bold border transition-colors cursor-pointer text-center ${
                        tenureMonths === m
                          ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md shadow-[#D6181F]/20'
                          : 'bg-[#181818] border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                      }`}
                    >
                      {m}M
                      <span className="block text-[9px] font-normal opacity-80">
                        {m / 12} {m === 12 ? 'Yr' : 'Yrs'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: Live Monthly EMI & Payment Breakdown (5 cols) */}
            {/* ========================================================================= */}
            <div className="lg:col-span-5 space-y-4">
              {/* Giant Monthly EMI Highlight Card */}
              <div className="bg-gradient-to-br from-[#1a1010] via-[#141414] to-[#0a0a0a] rounded-2xl border-2 border-[#D6181F]/60 p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6181F]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6181F] font-['Rajdhani'] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Estimated Monthly Payment
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase font-mono">
                    {tenureMonths} EMIs
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Rajdhani'] tracking-tight">
                    {formatINR(calc.monthlyEmi)}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold uppercase">/ month*</span>
                </div>

                <p className="text-[11px] text-gray-400 mt-1">
                  Calculated at <span className="text-white font-bold">{calc.interestRate}% p.a.</span> for a loan amount of{' '}
                  <span className="text-[#00FF88] font-bold">{formatINR(calc.loanAmount)}</span>.
                </p>

                {/* Breakdown Tiles */}
                <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-white/10 text-xs">
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                      Total Interest
                    </span>
                    <span className="text-sm font-bold text-yellow-400 font-mono">
                      {formatINR(calc.totalInterest)}
                    </span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                      Total Repayable
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {formatINR(calc.totalAmountPayable)}
                    </span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                      Down Payment
                    </span>
                    <span className="text-sm font-bold text-[#00FF88] font-mono">
                      {formatINR(calc.downPayment)}
                    </span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                      Total On-Road Cost
                    </span>
                    <span className="text-sm font-bold text-gray-200 font-mono">
                      {formatINR(calc.downPayment + calc.totalAmountPayable)}
                    </span>
                  </div>
                </div>

                {/* Ratio Bar: Principal vs Interest */}
                <div className="pt-4 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
                      Principal: {calc.principalPercentage}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      Interest: {calc.interestPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#222] overflow-hidden flex">
                    <div
                      style={{ width: `${calc.principalPercentage}%` }}
                      className="bg-[#00FF88] h-full transition-all duration-300"
                    />
                    <div
                      style={{ width: `${calc.interestPercentage}%` }}
                      className="bg-yellow-400 h-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Action CTA inside Result Box */}
                <div className="pt-4 mt-2 flex flex-col gap-2">
                  {!showApplicationForm && !applicationSubmitted && (
                    <button
                      id="btn-apply-finance-now"
                      type="button"
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#D6181F]/30 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Lock This EMI & Pre-Approve</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dealership Finance Desk Perks */}
              <div className="bg-[#121212] border border-white/5 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-['Rajdhani']">
                  <Building2 className="w-4 h-4 text-[#D6181F]" />
                  Shri Ram Hero Dealership Finance Advantages
                </div>
                <ul className="text-[11px] text-gray-300 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88] shrink-0 mt-0.5" />
                    <span>
                      <strong>Instant Spot Approval:</strong> On-spot sanction within 15 minutes at showroom desk.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88] shrink-0 mt-0.5" />
                    <span>
                      <strong>Low Documentation:</strong> Only Aadhaar Card, PAN Card & Bank Passbook required.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88] shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero Down Payment Options:</strong> Available for select pre-approved profiles & credit scores.
                    </span>
                  </li>
                </ul>

                {/* Direct Phone to Finance Desk */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">
                    Agency Helpline:
                  </span>
                  <a
                    href="tel:8890992086"
                    className="text-[#D6181F] hover:underline font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>8890992086</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APPLICATION FORM OR CONFIRMATION STATE */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {showApplicationForm && !applicationSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#181818] border border-[#D6181F]/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase font-['Rajdhani'] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D6181F]" />
                      Dealership Finance Pre-Approval Application
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Submit for instant approval verification with{' '}
                      <span className="text-[#00FF88] font-semibold">{formatINR(calc.monthlyEmi)}/mo</span> on{' '}
                      <span className="text-white font-semibold">{vehicle.name}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="text-xs text-gray-400 hover:text-white p-1"
                  >
                    Cancel
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#D6181F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        10-Digit Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="8890992086"
                        value={applicantMobile}
                        onChange={(e) => setApplicantMobile(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#D6181F] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        City / Tehsil
                      </label>
                      <input
                        type="text"
                        value={applicantCity}
                        onChange={(e) => setApplicantCity(e.target.value)}
                        placeholder="Aligarh"
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#D6181F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Employment Status
                      </label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as any)}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D6181F] outline-none"
                      >
                        <option value="salaried">Salaried (Private / Govt)</option>
                        <option value="self_employed">Self-Employed / Shop Owner</option>
                        <option value="farmer">Agricultural / Farmer</option>
                        <option value="student">Student / First-Time Buyer</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-gray-400">
                      No commitment required. Our Shri Ram Hero finance officer will call with pre-approved zero/low down payment options.
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Submit Finance Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {applicationSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0e1e14] border border-[#00FF88]/40 rounded-2xl p-5 sm:p-6 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40 flex items-center justify-center mx-auto text-[#00FF88]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase">
                  Finance Inquiry Received! Reference #{submittedRefId}
                </h3>
                <p className="text-xs text-gray-300 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{applicantName}</strong>! Your estimated loan of{' '}
                  <strong className="text-[#00FF88]">{formatINR(calc.loanAmount)}</strong> at{' '}
                  <strong className="text-white">{formatINR(calc.monthlyEmi)}/mo</strong> for the{' '}
                  <strong className="text-white">{vehicle.name}</strong> has been assigned to Shri Ram Hero’s in-house loan desk.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="tel:8890992086"
                    className="px-4 py-2 rounded-lg bg-[#00FF88] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#00e67a] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Agency: 8890992086</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setApplicationSubmitted(false);
                      setShowApplicationForm(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-gray-300 hover:text-white font-medium cursor-pointer"
                  >
                    Recalculate Another Plan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* YEARLY AMORTIZATION SCHEDULE ACCORDION */}
          {/* ========================================================================= */}
          <div className="bg-[#101010] border border-white/10 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D6181F]" />
                <span className="text-xs font-bold uppercase text-white font-['Rajdhani']">
                  Year-by-Year Amortization Schedule ({amortizationRows.length} Years)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{showAmortization ? 'Hide Details' : 'View Schedule'}</span>
                {showAmortization ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {showAmortization && (
              <div className="p-4 border-t border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-gray-400 uppercase font-mono">
                      <th className="py-2 px-2">Year</th>
                      <th className="py-2 px-2">Opening Balance</th>
                      <th className="py-2 px-2 text-[#00FF88]">Principal Paid</th>
                      <th className="py-2 px-2 text-yellow-400">Interest Paid</th>
                      <th className="py-2 px-2">Total Annual Payment</th>
                      <th className="py-2 px-2 text-right">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {amortizationRows.map((row) => (
                      <tr key={row.year} className="hover:bg-white/5">
                        <td className="py-2 px-2 font-bold text-white">Year {row.year}</td>
                        <td className="py-2 px-2 text-gray-400">{formatINR(row.openingBalance)}</td>
                        <td className="py-2 px-2 text-[#00FF88] font-semibold">{formatINR(row.principalPaid)}</td>
                        <td className="py-2 px-2 text-yellow-400 font-semibold">{formatINR(row.interestPaid)}</td>
                        <td className="py-2 px-2 text-white">{formatINR(row.totalPayment)}</td>
                        <td className="py-2 px-2 text-right text-gray-300 font-semibold">
                          {formatINR(row.closingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-[#0c0c0c] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>
              *EMIs are indicative and subject to individual credit profile & bank sanction terms.
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {isCopied ? 'Copied to Clipboard!' : 'Share Quote'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-lg bg-white text-black text-xs font-bold uppercase hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

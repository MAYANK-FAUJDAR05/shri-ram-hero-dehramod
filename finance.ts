import { HeroVehicle, FinancialCalculation } from '../types';

export interface VehiclePriceEstimate {
  exShowroom: number;
  rtoInsurance: number;
  onRoadPrice: number;
  minDownPayment: number;
  defaultDownPayment: number;
}

// Approximate on-road pricing in INR for Hero models at Shri Ram Hero dealership
export const MODEL_PRICING: Record<string, VehiclePriceEstimate> = {
  'splendor-plus': {
    exShowroom: 76306,
    rtoInsurance: 13200,
    onRoadPrice: 89500,
    minDownPayment: 9000,
    defaultDownPayment: 15000,
  },
  'splendor-plus-xtec': {
    exShowroom: 79911,
    rtoInsurance: 14000,
    onRoadPrice: 93900,
    minDownPayment: 10000,
    defaultDownPayment: 16000,
  },
  'hf-deluxe': {
    exShowroom: 62568,
    rtoInsurance: 11500,
    onRoadPrice: 74000,
    minDownPayment: 7500,
    defaultDownPayment: 12000,
  },
  'passion-plus': {
    exShowroom: 77918,
    rtoInsurance: 13600,
    onRoadPrice: 91500,
    minDownPayment: 9000,
    defaultDownPayment: 15000,
  },
  'passion-xtec': {
    exShowroom: 81538,
    rtoInsurance: 14400,
    onRoadPrice: 95900,
    minDownPayment: 10000,
    defaultDownPayment: 16000,
  },
  'glamour': {
    exShowroom: 83598,
    rtoInsurance: 14900,
    onRoadPrice: 98500,
    minDownPayment: 10000,
    defaultDownPayment: 18000,
  },
  'glamour-xtec': {
    exShowroom: 88748,
    rtoInsurance: 15700,
    onRoadPrice: 104400,
    minDownPayment: 11000,
    defaultDownPayment: 20000,
  },
  'super-splendor': {
    exShowroom: 80848,
    rtoInsurance: 14300,
    onRoadPrice: 95100,
    minDownPayment: 10000,
    defaultDownPayment: 16000,
  },
  'super-splendor-xtec': {
    exShowroom: 85178,
    rtoInsurance: 15300,
    onRoadPrice: 100500,
    minDownPayment: 10500,
    defaultDownPayment: 18000,
  },
  'xtreme-125r': {
    exShowroom: 95000,
    rtoInsurance: 17000,
    onRoadPrice: 112000,
    minDownPayment: 12000,
    defaultDownPayment: 22000,
  },
  'xtreme-160r-4v': {
    exShowroom: 127300,
    rtoInsurance: 22500,
    onRoadPrice: 149800,
    minDownPayment: 15000,
    defaultDownPayment: 30000,
  },
  'xtreme-200s-4v': {
    exShowroom: 141250,
    rtoInsurance: 24750,
    onRoadPrice: 166000,
    minDownPayment: 18000,
    defaultDownPayment: 35000,
  },
  'karizma-xmr': {
    exShowroom: 179900,
    rtoInsurance: 30100,
    onRoadPrice: 210000,
    minDownPayment: 22000,
    defaultDownPayment: 45000,
  },
  'mavrick-440': {
    exShowroom: 199000,
    rtoInsurance: 33000,
    onRoadPrice: 232000,
    minDownPayment: 25000,
    defaultDownPayment: 50000,
  },
  'xpulse-200-4v': {
    exShowroom: 147391,
    rtoInsurance: 25600,
    onRoadPrice: 173000,
    minDownPayment: 18000,
    defaultDownPayment: 35000,
  },
  'xpulse-200t-4v': {
    exShowroom: 140246,
    rtoInsurance: 24750,
    onRoadPrice: 165000,
    minDownPayment: 18000,
    defaultDownPayment: 35000,
  },
  'pleasure-plus-xtec': {
    exShowroom: 71213,
    rtoInsurance: 12800,
    onRoadPrice: 84000,
    minDownPayment: 8500,
    defaultDownPayment: 15000,
  },
  'destini-125-xtec': {
    exShowroom: 80048,
    rtoInsurance: 14450,
    onRoadPrice: 94500,
    minDownPayment: 10000,
    defaultDownPayment: 18000,
  },
  'destini-prime': {
    exShowroom: 71499,
    rtoInsurance: 12700,
    onRoadPrice: 84200,
    minDownPayment: 8500,
    defaultDownPayment: 15000,
  },
  'xoom-110': {
    exShowroom: 75911,
    rtoInsurance: 13600,
    onRoadPrice: 89500,
    minDownPayment: 9000,
    defaultDownPayment: 16000,
  },
  'xoom-125r': {
    exShowroom: 88000,
    rtoInsurance: 15500,
    onRoadPrice: 103500,
    minDownPayment: 11000,
    defaultDownPayment: 20000,
  },
  'xoom-160': {
    exShowroom: 130000,
    rtoInsurance: 23000,
    onRoadPrice: 153000,
    minDownPayment: 16000,
    defaultDownPayment: 30000,
  },
  'vida-v1-plus': {
    exShowroom: 102700,
    rtoInsurance: 12300,
    onRoadPrice: 115000,
    minDownPayment: 12000,
    defaultDownPayment: 25000,
  },
  'vida-v1-pro': {
    exShowroom: 130200,
    rtoInsurance: 14800,
    onRoadPrice: 145000,
    minDownPayment: 15000,
    defaultDownPayment: 30000,
  },
  'vida-v1-lite': {
    exShowroom: 89900,
    rtoInsurance: 11100,
    onRoadPrice: 101000,
    minDownPayment: 10000,
    defaultDownPayment: 20000,
  },
};

export function getVehiclePriceEstimate(vehicle: HeroVehicle): VehiclePriceEstimate {
  if (MODEL_PRICING[vehicle.id]) {
    return MODEL_PRICING[vehicle.id];
  }

  // Category based defaults
  switch (vehicle.category) {
    case 'ev':
      return {
        exShowroom: 115000,
        rtoInsurance: 13000,
        onRoadPrice: 128000,
        minDownPayment: 12000,
        defaultDownPayment: 25000,
      };
    case 'sports':
      return {
        exShowroom: 148000,
        rtoInsurance: 25000,
        onRoadPrice: 173000,
        minDownPayment: 18000,
        defaultDownPayment: 35000,
      };
    case 'premium':
      return {
        exShowroom: 95000,
        rtoInsurance: 17000,
        onRoadPrice: 112000,
        minDownPayment: 12000,
        defaultDownPayment: 22000,
      };
    case 'scooter':
      return {
        exShowroom: 78000,
        rtoInsurance: 14000,
        onRoadPrice: 92000,
        minDownPayment: 9000,
        defaultDownPayment: 16000,
      };
    default:
      return {
        exShowroom: 76000,
        rtoInsurance: 13500,
        onRoadPrice: 89500,
        minDownPayment: 9000,
        defaultDownPayment: 15000,
      };
  }
}

/**
 * Standard EMI Formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where:
 * P = Principal loan amount
 * r = Monthly rate of interest (annualRate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEmi(
  loanAmount: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  if (loanAmount <= 0 || tenureMonths <= 0) return 0;
  if (annualInterestRate <= 0) {
    return Math.round(loanAmount / tenureMonths);
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;

  if (denominator === 0) return Math.round(loanAmount / tenureMonths);
  return Math.round(numerator / denominator);
}

export function computeFinancialDetails(
  vehicle: HeroVehicle,
  onRoadPrice: number,
  downPayment: number,
  interestRate: number,
  tenureMonths: number
): FinancialCalculation {
  const safeDownPayment = Math.min(downPayment, onRoadPrice - 5000);
  const loanAmount = Math.max(5000, onRoadPrice - safeDownPayment);
  const monthlyEmi = calculateEmi(loanAmount, interestRate, tenureMonths);
  const totalAmountPayable = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalAmountPayable - loanAmount);

  const totalFinancedCost = loanAmount + totalInterest;
  const principalPercentage = totalFinancedCost > 0 ? Math.round((loanAmount / totalFinancedCost) * 100) : 100;
  const interestPercentage = Math.max(0, 100 - principalPercentage);

  return {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    onRoadPrice,
    downPayment: safeDownPayment,
    loanAmount,
    interestRate,
    tenureMonths,
    monthlyEmi,
    totalInterest,
    totalAmountPayable,
    principalPercentage,
    interestPercentage,
  };
}

export interface AmortizationRow {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  closingBalance: number;
}

export function generateAmortizationSchedule(
  loanAmount: number,
  annualRate: number,
  tenureMonths: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEmi(loanAmount, annualRate, tenureMonths);
  const rows: AmortizationRow[] = [];

  let balance = loanAmount;
  const totalYears = Math.ceil(tenureMonths / 12);

  for (let year = 1; year <= totalYears; year++) {
    const openingBalance = balance;
    let yearPrincipal = 0;
    let yearInterest = 0;

    const monthsInThisYear = Math.min(12, tenureMonths - (year - 1) * 12);

    for (let m = 0; m < monthsInThisYear; m++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      let principalForMonth = emi - interestForMonth;
      if (principalForMonth > balance) {
        principalForMonth = balance;
      }
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance = Math.max(0, balance - principalForMonth);
    }

    rows.push({
      year,
      openingBalance: Math.round(openingBalance),
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      totalPayment: Math.round(yearPrincipal + yearInterest),
      closingBalance: Math.round(balance),
    });
  }

  return rows;
}

export const PARTNER_BANKS = [
  {
    id: 'herofincorp',
    name: 'Hero FinCorp',
    badge: 'Dealership Desk Partner',
    rate: 8.5,
    tag: 'Lowest Paperwork & Instant Sanction',
    description: 'Direct financing from Hero MotoCorp subsidiary with zero hidden charges.',
  },
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    badge: 'Nationalized Bank',
    rate: 9.75,
    tag: 'Low Processing Fee',
    description: 'Long tenure up to 5 years, trusted government banking partner.',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    badge: 'Fast Track Approval',
    rate: 10.5,
    tag: 'Pre-Approved for Account Holders',
    description: '100% on-road funding scheme available on selected Hero models.',
  },
  {
    id: 'indusind',
    name: 'IndusInd / L&T Finance',
    badge: 'Zero CIBIL / Low-Doc',
    rate: 11.9,
    tag: 'Rural & Farmer Special',
    description: 'Special hassle-free financing designed for rural customers and farmers.',
  },
];

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

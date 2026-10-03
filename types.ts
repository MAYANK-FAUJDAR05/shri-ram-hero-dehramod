export type VehicleCategory = 'commuter' | 'premium' | 'sports' | 'scooter' | 'ev';
export type MainFilter = 'all' | 'bikes' | 'scooters' | 'ev';

export interface VehicleSpec {
  engine: string;
  mileage: string;
  power: string;
  fuelTank: string;
  transmission: string;
  brakes: string;
  colours: string[];
}

export interface VehicleVariant {
  name: string;
  priceNote?: string;
  difference: string;
}

export interface HeroVehicle {
  id: string;
  name: string;
  tagline: string;
  category: VehicleCategory;
  mainType: 'bikes' | 'scooters' | 'ev';
  badge?: string;
  badgeColor?: string;
  image: string;
  fallbackColor?: string;
  features: string[];
  specs: VehicleSpec;
  variants: VehicleVariant[];
  description: string;
  highlights: { label: string; value: string }[];
  isNewLaunch?: boolean;
  isBestSeller?: boolean;
  isFlexFuel?: boolean;
}

export interface PriceInquiryFormData {
  fullName: string;
  mobile: string;
  city: string;
  modelId: string;
  modelName: string;
  wantExchange: boolean;
  financeRequired: boolean;
}

export type AccessoryCategory = 'all' | 'helmets' | 'guards' | 'comfort' | 'touring' | 'care';

export interface HeroAccessory {
  id: string;
  name: string;
  hindiTitle?: string;
  partNumber: string;
  category: 'helmets' | 'guards' | 'comfort' | 'touring' | 'care';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  compatibility: string;
  description: string;
  features: string[];
  inStock: boolean;
  warranty: string;
  badge?: string;
  hgaCertified: boolean;
}

export interface AccessoryInquiryData {
  accessoryId: string;
  accessoryName: string;
  partNumber: string;
  price: number;
  customerName: string;
  mobile: string;
  vehicleModel: string;
  dealershipLocation: string;
  installationRequired: boolean;
}

export interface FinancialCalculation {
  vehicleId: string;
  vehicleName: string;
  onRoadPrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalAmountPayable: number;
  principalPercentage: number;
  interestPercentage: number;
}

export interface FinanceApplicationData {
  vehicleId: string;
  vehicleName: string;
  onRoadPrice: number;
  loanAmount: number;
  downPayment: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  fullName: string;
  mobile: string;
  city: string;
  employmentType: 'salaried' | 'self_employed' | 'farmer' | 'student';
  preferredBank: string;
  notes?: string;
}

export type FaqCategory = 'all' | 'servicing' | 'insurance' | 'warranty' | 'finance';

export interface DealershipFaq {
  id: string;
  category: 'servicing' | 'insurance' | 'warranty' | 'finance';
  question: {
    en: string;
    hi: string;
  };
  answer: {
    en: string;
    hi: string;
  };
  keyTakeaway?: {
    en: string;
    hi: string;
  };
  tags: string[];
  popular?: boolean;
}

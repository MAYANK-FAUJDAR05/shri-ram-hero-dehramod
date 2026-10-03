import { HeroAccessory } from '../types';

export interface VehicleCompatibilityOption {
  id: string;
  label: string;
  hindiLabel: string;
  badge?: string;
  category: 'all' | 'popular' | 'motorcycles' | 'scooters' | 'universal';
  keywords: string[];
}

export const VEHICLE_COMPATIBILITY_OPTIONS: VehicleCompatibilityOption[] = [
  {
    id: 'all',
    label: 'All Vehicles (Show All)',
    hindiLabel: 'सभी वाहन (सभी सहायक उपकरण)',
    category: 'all',
    keywords: [],
  },
  {
    id: 'universal',
    label: 'Universal (Fits All Hero Models)',
    hindiLabel: 'यूनिवर्सल (सभी हीरो मॉडल्स के लिए)',
    badge: 'Universal',
    category: 'universal',
    keywords: ['universal', 'all hero', 'any 22mm', 'all open and closed', 'all 4-stroke'],
  },
  {
    id: 'splendor',
    label: 'Splendor+ & Splendor XTEC',
    hindiLabel: 'स्प्लेंडर+ और स्प्लेंडर XTEC',
    badge: 'Commuter',
    category: 'popular',
    keywords: ['splendor'],
  },
  {
    id: 'hf-deluxe',
    label: 'HF Deluxe',
    hindiLabel: 'एचएफ डीलक्स',
    badge: 'Commuter',
    category: 'motorcycles',
    keywords: ['hf deluxe'],
  },
  {
    id: 'glamour',
    label: 'Glamour & Glamour XTEC',
    hindiLabel: 'ग्लैमर और ग्लैमर XTEC',
    badge: 'Executive',
    category: 'motorcycles',
    keywords: ['glamour'],
  },
  {
    id: 'passion',
    label: 'Passion+ & Passion XTEC',
    hindiLabel: 'पैशन+ और पैशन XTEC',
    badge: 'Commuter',
    category: 'motorcycles',
    keywords: ['passion'],
  },
  {
    id: 'xpulse',
    label: 'XPulse 200 4V / 200T',
    hindiLabel: 'एक्सपल्स 200 4V / 200T',
    badge: 'Adventure',
    category: 'popular',
    keywords: ['xpulse'],
  },
  {
    id: 'xtreme',
    label: 'Xtreme 160R / 250R',
    hindiLabel: 'एक्सट्रीम 160R / 250R',
    badge: 'Sports',
    category: 'popular',
    keywords: ['xtreme'],
  },
  {
    id: 'karizma',
    label: 'Karizma XMR 210',
    hindiLabel: 'करिज्मा XMR 210',
    badge: 'Premium Flagship',
    category: 'motorcycles',
    keywords: ['karizma'],
  },
  {
    id: 'mavrick',
    label: 'Mavrick 440',
    hindiLabel: 'मैवरिक 440',
    badge: '440cc Roadster',
    category: 'motorcycles',
    keywords: ['mavrick'],
  },
  {
    id: 'destini',
    label: 'Destini 125 & Destini XTEC',
    hindiLabel: 'डेस्टिनी 125 & XTEC',
    badge: 'Family Scooter',
    category: 'scooters',
    keywords: ['destini', 'scooter'],
  },
  {
    id: 'pleasure',
    label: 'Pleasure+ & Pleasure XTEC',
    hindiLabel: 'प्लेजर+ & XTEC',
    badge: 'Urban Scooter',
    category: 'scooters',
    keywords: ['pleasure', 'scooter'],
  },
  {
    id: 'xoom',
    label: 'Xoom 110 & Xoom Combat',
    hindiLabel: 'ज़ूम 110 & कॉम्बैट',
    badge: 'Sporty Scooter',
    category: 'scooters',
    keywords: ['xoom', 'scooter'],
  },
  {
    id: 'vida',
    label: 'VIDA V1 Electric',
    hindiLabel: 'विदा V1 इलेक्ट्रिक',
    badge: 'Electric EV',
    category: 'scooters',
    keywords: ['vida', 'scooter'],
  },
];

/**
 * Checks whether an accessory is universal.
 */
export function isUniversalAccessory(accessory: HeroAccessory): boolean {
  const compat = accessory.compatibility.toLowerCase();
  return (
    compat.includes('universal') ||
    compat.includes('all hero') ||
    compat.includes('all open and closed') ||
    compat.includes('all 4-stroke') ||
    compat.includes('any 22mm')
  );
}

/**
 * Checks whether an accessory is compatible with a vehicle filter.
 */
export function checkAccessoryVehicleCompatibility(
  accessory: HeroAccessory,
  vehicleFilterId: string,
  includeUniversal: boolean = true
): boolean {
  if (!vehicleFilterId || vehicleFilterId === 'all') return true;

  const compatLower = accessory.compatibility.toLowerCase();
  const isUniversal = isUniversalAccessory(accessory);

  if (vehicleFilterId === 'universal') {
    return isUniversal;
  }

  const option = VEHICLE_COMPATIBILITY_OPTIONS.find((opt) => opt.id === vehicleFilterId);
  if (!option) return true;

  // Check if specifically compatible with this vehicle
  const matchesSpecific = option.keywords.some((kw) => compatLower.includes(kw));

  if (matchesSpecific) return true;

  // If user allows universal accessories, universal items fit all models
  if (includeUniversal && isUniversal) {
    // If the option is a scooter, some universal motorcycle parts (e.g., chain cleaner/lube)
    // might not fit scooters since scooters use CVT belts. Let's make sure!
    if (option.category === 'scooters' && compatLower.includes('chain hero motorcycles')) {
      return false;
    }
    // Mobile mount fits handlebars
    return true;
  }

  return false;
}

/**
 * Get fitment badge description for an accessory given an active vehicle filter
 */
export function getAccessoryFitmentLabel(
  accessory: HeroAccessory,
  vehicleFilterId: string
): { label: string; type: 'exact' | 'universal' | 'general' } {
  if (!vehicleFilterId || vehicleFilterId === 'all') {
    if (isUniversalAccessory(accessory)) {
      return { label: 'Universal Fitment', type: 'universal' };
    }
    return { label: 'Model Specific', type: 'exact' };
  }

  const option = VEHICLE_COMPATIBILITY_OPTIONS.find((opt) => opt.id === vehicleFilterId);
  const compatLower = accessory.compatibility.toLowerCase();

  if (option && option.keywords.some((kw) => compatLower.includes(kw))) {
    return { label: `Direct Fit: ${option.label.split('&')[0].trim()}`, type: 'exact' };
  }

  if (isUniversalAccessory(accessory)) {
    return { label: 'Universal Fitment', type: 'universal' };
  }

  return { label: 'Compatible', type: 'general' };
}

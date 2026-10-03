import { HeroVehicle, VehicleCategory } from '../types';

export interface VehiclePerformanceScore {
  power: number; // 0-100
  comfort: number; // 0-100
  fuelEfficiency: number; // 0-100
  handling: number; // 0-100
}

export interface RadarDataPoint {
  metric: string;
  vehicleScore: number;
  categoryAvg: number;
  difference: number;
  fullMark: number;
  keyHighlight: string;
}

export interface CategoryAverageProfile {
  category: VehicleCategory;
  categoryLabel: string;
  power: number;
  comfort: number;
  fuelEfficiency: number;
  handling: number;
}

// Handcrafted, factory-accurate baseline scores for Hero models
const VEHICLE_PERFORMANCE_SCORES: Record<string, VehiclePerformanceScore> = {
  // Commuters
  'splendor-plus': { power: 58, comfort: 84, fuelEfficiency: 96, handling: 80 },
  'splendor-plus-xtec': { power: 60, comfort: 85, fuelEfficiency: 98, handling: 81 },
  'splendor-plus-xtec-2': { power: 60, comfort: 85, fuelEfficiency: 98, handling: 81 },
  'splendor-plus-flex': { power: 61, comfort: 84, fuelEfficiency: 95, handling: 80 },
  'hf-deluxe': { power: 56, comfort: 81, fuelEfficiency: 96, handling: 82 },
  'hf-deluxe-flex': { power: 57, comfort: 81, fuelEfficiency: 95, handling: 82 },
  'hf-100': { power: 55, comfort: 79, fuelEfficiency: 97, handling: 83 },
  'passion-plus': { power: 62, comfort: 85, fuelEfficiency: 92, handling: 82 },

  // Premium / Executive / Adventure
  'super-splendor': { power: 72, comfort: 85, fuelEfficiency: 82, handling: 81 },
  'super-splendor-xtec': { power: 74, comfort: 86, fuelEfficiency: 84, handling: 83 },
  'glamour': { power: 75, comfort: 85, fuelEfficiency: 80, handling: 84 },
  'glamour-xtec': { power: 77, comfort: 87, fuelEfficiency: 82, handling: 85 },
  'mavrick-440': { power: 95, comfort: 88, fuelEfficiency: 62, handling: 86 },
  'xpulse-200-4v': { power: 84, comfort: 92, fuelEfficiency: 70, handling: 92 },

  // Sports
  'xtreme-125r': { power: 78, comfort: 78, fuelEfficiency: 80, handling: 90 },
  'xtreme-160r': { power: 86, comfort: 74, fuelEfficiency: 68, handling: 92 },
  'xtreme-160r-4v': { power: 89, comfort: 76, fuelEfficiency: 67, handling: 94 },
  'xtreme-250r': { power: 94, comfort: 73, fuelEfficiency: 61, handling: 95 },
  'karizma-xmr': { power: 97, comfort: 71, fuelEfficiency: 58, handling: 97 },

  // Scooters
  'pleasure-plus': { power: 58, comfort: 86, fuelEfficiency: 82, handling: 86 },
  'xoom-110': { power: 65, comfort: 83, fuelEfficiency: 79, handling: 88 },
  'xoom-125r': { power: 72, comfort: 85, fuelEfficiency: 75, handling: 90 },
  'xoom-160': { power: 80, comfort: 89, fuelEfficiency: 71, handling: 91 },
  'destini-125': { power: 68, comfort: 93, fuelEfficiency: 78, handling: 82 },

  // Electric Vehicles (VIDA)
  'vida-v1-pro': { power: 85, comfort: 89, fuelEfficiency: 95, handling: 85 },
  'vida-v1-plus': { power: 81, comfort: 88, fuelEfficiency: 93, handling: 84 },
  'vida-v1-lite': { power: 76, comfort: 86, fuelEfficiency: 90, handling: 83 },
};

// Benchmark category averages based on typical 2-wheeler segments in India
export const CATEGORY_AVERAGES: Record<VehicleCategory, CategoryAverageProfile> = {
  commuter: {
    category: 'commuter',
    categoryLabel: 'Commuter Segment Avg',
    power: 58,
    comfort: 82,
    fuelEfficiency: 95,
    handling: 81,
  },
  premium: {
    category: 'premium',
    categoryLabel: 'Premium / Adv Segment Avg',
    power: 79,
    comfort: 85,
    fuelEfficiency: 77,
    handling: 85,
  },
  sports: {
    category: 'sports',
    categoryLabel: 'Sports Segment Avg',
    power: 89,
    comfort: 74,
    fuelEfficiency: 67,
    handling: 94,
  },
  scooter: {
    category: 'scooter',
    categoryLabel: 'Scooter Segment Avg',
    power: 69,
    comfort: 87,
    fuelEfficiency: 77,
    handling: 85,
  },
  ev: {
    category: 'ev',
    categoryLabel: 'EV Segment Avg',
    power: 81,
    comfort: 88,
    fuelEfficiency: 93,
    handling: 84,
  },
};

/**
 * Get performance ratings for any vehicle, falling back to algorithmic evaluation if needed
 */
export function getVehiclePerformanceScores(vehicle: HeroVehicle): VehiclePerformanceScore {
  if (VEHICLE_PERFORMANCE_SCORES[vehicle.id]) {
    return VEHICLE_PERFORMANCE_SCORES[vehicle.id];
  }

  // Fallback estimation using specs and category
  const catAvg = CATEGORY_AVERAGES[vehicle.category] || CATEGORY_AVERAGES.commuter;
  let power = catAvg.power;
  let comfort = catAvg.comfort;
  let fuelEfficiency = catAvg.fuelEfficiency;
  let handling = catAvg.handling;

  if (vehicle.specs.power.includes('25') || vehicle.specs.power.includes('210')) {
    power = 95;
  } else if (vehicle.specs.power.includes('16') || vehicle.specs.power.includes('160')) {
    power = 88;
  } else if (vehicle.specs.power.includes('125')) {
    power = 74;
  }

  if (vehicle.specs.mileage.includes('70') || vehicle.specs.mileage.includes('73')) {
    fuelEfficiency = 96;
  }

  return { power, comfort, fuelEfficiency, handling };
}

/**
 * Generates technical context highlight for each metric axis based on vehicle features
 */
function getMetricHighlight(metric: string, vehicle: HeroVehicle, score: number): string {
  switch (metric) {
    case 'Power':
      if (vehicle.category === 'ev') return 'Instant torque with 6kW peak PMSM motor';
      if (score >= 90) return 'High-revving 4-Valve DOHC engine with crisp throttle response';
      if (score >= 75) return 'Punchy low-end torque for effortless city overtakes';
      return 'Tuned xSens engine optimized for reliable stop-go urban commuting';

    case 'Comfort':
      if (vehicle.category === 'scooter') return 'Step-through floorboard with cushioned dual-tone seat';
      if (vehicle.id.includes('xpulse')) return 'Long-travel plush suspension (190mm front / 170mm rear)';
      if (score >= 85) return 'Long contoured seat with 5-step adjustable hydraulic rear shocks';
      return 'Relaxed upright ergonomics with balanced rider posture';

    case 'Fuel Efficiency':
      if (vehicle.category === 'ev') return 'High efficiency battery pack with intelligent regen braking';
      if (score >= 90) return 'Class-leading economy boosted by patented Hero i3S Start-Stop system';
      if (score >= 75) return 'Optimized programmed fuel injection delivering strong real-world kmpl';
      return 'Balanced power-to-mileage ratio for performance riding';

    case 'Handling':
      if (vehicle.category === 'sports') return 'Rigid lightweight diamond/trellis chassis with wide radial tires';
      if (vehicle.category === 'ev') return 'Low center of gravity with balanced battery pack weight distribution';
      if (score >= 88) return 'Precise cornering stability and responsive telescopic front geometry';
      return 'Ultra-light kerb weight allowing effortless nimble traffic filtering';

    default:
      return 'Factory-tuned engineering by Hero MotoCorp';
  }
}

/**
 * Builds the complete radar dataset for Recharts comparing vehicle with category average
 */
export function buildPerformanceRadarData(vehicle: HeroVehicle): {
  radarData: RadarDataPoint[];
  categoryProfile: CategoryAverageProfile;
  overallRating: number;
  strongestTrait: { metric: string; difference: number };
} {
  const scores = getVehiclePerformanceScores(vehicle);
  const categoryProfile = CATEGORY_AVERAGES[vehicle.category] || CATEGORY_AVERAGES.commuter;

  const metricsConfig = [
    {
      metric: 'Power',
      vehicleScore: scores.power,
      categoryAvg: categoryProfile.power,
    },
    {
      metric: 'Comfort',
      vehicleScore: scores.comfort,
      categoryAvg: categoryProfile.comfort,
    },
    {
      metric: 'Fuel Efficiency',
      vehicleScore: scores.fuelEfficiency,
      categoryAvg: categoryProfile.fuelEfficiency,
    },
    {
      metric: 'Handling',
      vehicleScore: scores.handling,
      categoryAvg: categoryProfile.handling,
    },
  ];

  const radarData: RadarDataPoint[] = metricsConfig.map((item) => ({
    metric: item.metric,
    vehicleScore: item.vehicleScore,
    categoryAvg: item.categoryAvg,
    difference: item.vehicleScore - item.categoryAvg,
    fullMark: 100,
    keyHighlight: getMetricHighlight(item.metric, vehicle, item.vehicleScore),
  }));

  // Overall index (average of the 4 dimensions)
  const overallRating = Math.round(
    (scores.power + scores.comfort + scores.fuelEfficiency + scores.handling) / 4
  );

  // Strongest relative trait
  const sortedByAdvantage = [...radarData].sort((a, b) => b.difference - a.difference);
  const strongestTrait = {
    metric: sortedByAdvantage[0].metric,
    difference: sortedByAdvantage[0].difference,
  };

  return {
    radarData,
    categoryProfile,
    overallRating,
    strongestTrait,
  };
}

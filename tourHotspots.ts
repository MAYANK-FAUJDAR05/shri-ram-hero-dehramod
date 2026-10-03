import { HeroVehicle } from '../types';

export interface VehicleTourHotspot {
  id: string;
  title: string;
  subtitle: string;
  category: 'engine' | 'technology' | 'brakes' | 'design' | 'comfort' | 'battery';
  angleMin: number;
  angleMax: number;
  xPercent: number; // 0-100 on stage
  yPercent: number; // 0-100 on stage
  description: string;
  metricLabel: string;
  metricValue: string;
}

export function getVehicleTourHotspots(vehicle: HeroVehicle): VehicleTourHotspot[] {
  const isEv = vehicle.category === 'ev' || vehicle.id.includes('vida');
  const isScooter = vehicle.category === 'scooter';
  const isSport = vehicle.category === 'sports';

  if (isEv) {
    return [
      {
        id: 'vida-battery',
        title: 'Removable Dual Li-Ion Battery Pack',
        subtitle: 'IP67 Waterproof & Dustproof',
        category: 'battery',
        angleMin: 45,
        angleMax: 150,
        xPercent: 48,
        yPercent: 54,
        description: 'Two lightweight portable lithium-ion batteries that can be charged at home via standard 5A sockets or fast-charged at public stations.',
        metricLabel: 'Battery Capacity',
        metricValue: vehicle.specs.fuelTank || '3.94 kWh'
      },
      {
        id: 'vida-motor',
        title: 'Permanent Magnet Synchronous Motor',
        subtitle: 'Instant Torque Vectoring',
        category: 'engine',
        angleMin: 120,
        angleMax: 240,
        xPercent: 62,
        yPercent: 66,
        description: 'High-efficiency IP68 sealed electric motor delivering punchy 0-40 km/h acceleration with custom Riding Modes (Eco, Ride, Sport, Custom).',
        metricLabel: 'Peak Power',
        metricValue: vehicle.specs.power
      },
      {
        id: 'vida-console',
        title: '7-inch Full-Color TFT Touchscreen',
        subtitle: 'Smart Connected Cockpit',
        category: 'technology',
        angleMin: 320,
        angleMax: 40,
        xPercent: 42,
        yPercent: 28,
        description: 'Interactive touchscreen with 4G connectivity, turn-by-turn navigation, geofencing, ride telemetry, and OTA cloud updates.',
        metricLabel: 'Display Size',
        metricValue: '7.0" TFT Touch'
      },
      {
        id: 'vida-headlamp',
        title: 'Class-D LED Projector Headlamp',
        subtitle: 'Integrated Daytime Running Lights',
        category: 'design',
        angleMin: 300,
        angleMax: 50,
        xPercent: 32,
        yPercent: 38,
        description: 'Signature automotive-grade projector cluster with broad throw illumination and distinct Vida illuminated accent strip.',
        metricLabel: 'Lighting',
        metricValue: 'Full LED Spec'
      },
      {
        id: 'vida-brakes',
        title: 'Regenerative Braking + Front Disc',
        subtitle: 'Dual Brake Energy Recovery',
        category: 'brakes',
        angleMin: 220,
        angleMax: 320,
        xPercent: 30,
        yPercent: 68,
        description: 'Electronic braking regenerates charge into the battery while front disc and rear drum ensure progressive, safe stopping.',
        metricLabel: 'Brake Setup',
        metricValue: vehicle.specs.brakes
      }
    ];
  }

  // ICE Motorcycles and Scooters
  const hotspots: VehicleTourHotspot[] = [
    {
      id: 'hotspot-engine',
      title: isScooter ? 'Programmed FI Engine with i3S' : 'xSens Programmed FI Engine',
      subtitle: `${vehicle.specs.engine.split(',')[0]} Powertrain`,
      category: 'engine',
      angleMin: 40,
      angleMax: 145,
      xPercent: 50,
      yPercent: 56,
      description: `Equipped with Hero's smart 9-sensor xSens electronic fuel injection for instant throttle response, all-weather starting, and optimal fuel burn.`,
      metricLabel: 'Engine Output',
      metricValue: vehicle.specs.power.split('|')[0].trim()
    },
    {
      id: 'hotspot-console',
      title: isSport ? 'Bluetooth Digital Cockpit with Turn-by-Turn' : 'Smart Digital-Analog Console',
      subtitle: 'Instrumentation Cluster',
      angleMin: 315,
      angleMax: 45,
      xPercent: 44,
      yPercent: 26,
      category: 'technology',
      description: 'Provides real-time mileage indicator (RTMI), side-stand indicator, service due reminder, and smartphone pairing alerts.',
      metricLabel: 'Connectivity',
      metricValue: isSport ? 'Hero Connect App' : 'i3S + Sensor Array'
    },
    {
      id: 'hotspot-brakes',
      title: vehicle.specs.brakes.includes('ABS') ? 'Anti-Lock Braking System (ABS)' : 'Integrated Braking System (IBS)',
      subtitle: 'Precision Stopping Power',
      angleMin: 215,
      angleMax: 325,
      xPercent: 28,
      yPercent: 68,
      category: 'brakes',
      description: 'Distributes braking force between front and rear wheels seamlessly, preventing wheel lock-ups and wheel slippage on wet asphalt.',
      metricLabel: 'Brakes',
      metricValue: vehicle.specs.brakes.split('|')[0].trim()
    },
    {
      id: 'hotspot-tank',
      title: isScooter ? 'External Fuel Filler & Storage' : 'Sculpted Fuel Tank & Decals',
      subtitle: `${vehicle.specs.fuelTank} High-Capacity`,
      angleMin: 40,
      angleMax: 150,
      xPercent: 42,
      yPercent: 38,
      category: 'comfort',
      description: isScooter
        ? 'Convenient external fuel cap with large under-seat boot storage and mobile charging port.'
        : `Ergonomically contoured tank with muscular knee recesses, 3D Hero badging, and ${vehicle.specs.fuelTank} volume for extended range.`,
      metricLabel: isScooter ? 'Fuel Tank' : 'Tank Capacity',
      metricValue: vehicle.specs.fuelTank
    },
    {
      id: 'hotspot-exhaust',
      title: isScooter ? 'Euro-5 Tuned Exhaust & Heat Shield' : 'Stainless Exhaust with Catalytic Converter',
      subtitle: 'Eco-Compliant OBD-2B',
      angleMin: 120,
      angleMax: 220,
      xPercent: 65,
      yPercent: 65,
      category: 'design',
      description: 'Tuned for low exhaust emissions and a refined, crisp exhaust note with durable protective chrome/matte heat guard.',
      metricLabel: 'Fuel Efficiency',
      metricValue: vehicle.specs.mileage
    },
    {
      id: 'hotspot-headlamp',
      title: 'Signature LED Headlamp & Position Lamp',
      subtitle: 'High-Luminance Beam',
      angleMin: 290,
      angleMax: 60,
      xPercent: 26,
      yPercent: 38,
      category: 'design',
      description: 'Crisp, wide-spread light throw ensures commanding night visibility and sharp daylight road presence.',
      metricLabel: 'Illumination',
      metricValue: 'All-Weather LED'
    }
  ];

  return hotspots;
}

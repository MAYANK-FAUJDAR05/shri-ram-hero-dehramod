import { HeroVehicle } from '../types';

import splendorImg from '../assets/images/hero_splendor_bike_1788605409528.jpg';
import glamourImg from '../assets/images/hero_glamour_bike_1788605544690.jpg';
import mavrickImg from '../assets/images/hero_mavrick_roadster_1788605469750.jpg';
import xpulseImg from '../assets/images/hero_xpulse_adventure_1788605427600.jpg';
import xtremeImg from '../assets/images/hero_xtreme_sport_1788605442335.jpg';
import karizmaImg from '../assets/images/hero_karizma_xmr_1788605456302.jpg';
import destiniImg from '../assets/images/hero_destini_scooter_1788605486097.jpg';
import xoomImg from '../assets/images/hero_xoom_scooter_1788605502434.jpg';
import pleasureImg from '../assets/images/hero_pleasure_scooter_1788605529585.jpg';
import vidaImg from '../assets/images/hero_vida_electric_1788605515841.jpg';

export const HERO_VEHICLES: HeroVehicle[] = [
  // =========================================================================
  // COMMUTER BIKES
  // =========================================================================
  {
    id: 'splendor-plus',
    name: 'Hero Splendor+',
    tagline: 'Lage Raho Hero - India’s Most Trusted Motorcycle',
    category: 'commuter',
    mainType: 'bikes',
    isBestSeller: true,
    badge: 'India’s #1 Commuter',
    badgeColor: 'bg-red-600 text-white',
    image: splendorImg,
    features: [
      'Iconic 97.2cc Programmed Fuel Injection (xSens Technology) engine with 9 sensors',
      'Hero patented i3S (Idle Stop-Start System) for unmatched real-world fuel savings',
      'Integrated Braking System (IBS) ensures balanced and skid-free stopping',
      'High-tensile tubular double cradle frame engineered for extreme durability',
      'Maintenance-free battery with side-stand engine cut-off sensor for rider safety',
      '5-step pre-load adjustable hydraulic rear shock absorbers for bumpy roads',
      'Long comfortable contoured seat offering relaxed upright posture for daily commute',
      'All-weather puncture-resistant tubeless tires mounted on cast alloy wheels'
    ],
    specs: {
      engine: '97.2 cc, Air-cooled, 4-stroke Single Cylinder OHC',
      mileage: '~70 kmpl (Variant dependent, with i3S)',
      power: '8.02 PS (5.9 kW) @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.8 Litres (Reserve: 1.0 Litre)',
      transmission: '4-speed Constant Mesh, Wet Multiplate Clutch',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with Integrated Braking System (IBS)',
      colours: ['Black with Silver', 'Black with Purple', 'Black with Sports Red', 'Heavy Grey with Green']
    },
    variants: [
      { name: 'Splendor+ Self Start Alloy Wheel', difference: 'Self start motor, alloy wheels, i3S system' },
      { name: 'Splendor+ Black and Accent Edition', difference: 'All-black engine, exhaust, rim finish with customizable graphic decals' },
      { name: 'Splendor+ Matt Shield Gold', difference: 'Exclusive premium matte gold finish with 3D chrome emblem' }
    ],
    description: 'The Hero Splendor+ is the legendary backbone of Indian commuting. Celebrated for over three decades, it pairs bulletproof mechanical reliability with modern xSens Programmed FI and i3S technology for maximum fuel savings.',
    highlights: [
      { label: 'Fuel Economy', value: '70+ kmpl (i3S)' },
      { label: 'Kerb Weight', value: '112 kg' },
      { label: 'Ground Clearance', value: '165 mm' },
      { label: 'Seat Height', value: '785 mm' }
    ]
  },
  {
    id: 'splendor-plus-xtec',
    name: 'Hero Splendor+ XTEC',
    tagline: 'The Tech-Loaded Commuter with Full Digital Console',
    category: 'commuter',
    mainType: 'bikes',
    badge: 'Bluetooth Connected',
    badgeColor: 'bg-blue-600 text-white',
    image: splendorImg,
    features: [
      'Segment-first Segmented Full Digital LCD Speedometer with high-contrast display',
      'Bluetooth smartphone connectivity with incoming call and SMS alert notifications',
      'Real-Time Mileage Indicator (RTMI) display and intelligent low-fuel warning',
      'Integrated USB fast-charging port located conveniently adjacent to handlebar',
      'Signature High Intensity Position Lamp (HIPL) LED strip above the headlight cowl',
      'Side-stand engine cut-off sensor with prominent digital dashboard warning',
      'Advanced xSens Fuel Injection with 9 precision sensors for instantaneous cold-starts',
      'Hero i3S Idle Stop-Start system automatically cuts idle engine at traffic signals'
    ],
    specs: {
      engine: '97.2 cc, Air-cooled, 4-stroke Single Cylinder Programmed FI',
      mileage: '~73 kmpl (Class-leading digital economy)',
      power: '8.02 PS (5.9 kW) @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.8 Litres with digital fuel sensor',
      transmission: '4-speed Constant Mesh, Wet Multi-plate Clutch',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with IBS safety system',
      colours: ['Canvas Black', 'Pearl White', 'Tornado Grey', 'Sparkling Beta Blue']
    },
    variants: [
      { name: 'Splendor+ XTEC Drum Alloy', difference: 'Full digital cluster, Bluetooth, LED HIPL, USB port' },
      { name: 'Splendor+ XTEC Black Edition', difference: 'Total dark stealth treatment with gloss 3D badging' }
    ],
    description: 'Hero Splendor+ XTEC elevates India’s favorite commuter into the digital age. It combines smartphone connectivity, real-time mileage monitoring, and USB device charging with Splendor’s unbeatable efficiency.',
    highlights: [
      { label: 'Display', value: 'Full Digital LCD' },
      { label: 'Connectivity', value: 'Bluetooth & SMS Alerts' },
      { label: 'Charging', value: 'Built-in USB Port' },
      { label: 'Engine Tech', value: 'xSens FI + i3S' }
    ]
  },
  {
    id: 'splendor-plus-xtec-2',
    name: 'Hero Splendor+ XTEC 2.0',
    tagline: 'Evolution of an Icon with Full LED Headlamp & Hazard Switch',
    category: 'commuter',
    mainType: 'bikes',
    isNewLaunch: true,
    badge: 'All-New 2.0 Edition',
    badgeColor: 'bg-emerald-600 text-white',
    image: splendorImg,
    features: [
      'Next-Gen bright Full LED Headlamp with signature H-shaped LED Daytime Running Lamp',
      'Dedicated hazard light flasher switch for elevated highway safety in low visibility',
      'Dual-tone contoured seat with premium contrast stitching and ergonomic support',
      'Upgraded full-digital LCD instrument cluster featuring eco-ride efficiency indicator',
      'Smartphone Bluetooth sync with caller name, battery status, and message alerts',
      'Weather-sealed USB charging socket with protective rubberized flap',
      'Larger rear luggage carrier and pillion grab rail with integrated tie-down hooks',
      'Advanced xSens Fuel Injection with idle stop-start system for 73+ kmpl efficiency'
    ],
    specs: {
      engine: '97.2 cc, Air-cooled, 4-stroke Single Cylinder with xSens Fi',
      mileage: '~73 kmpl (Certified optimal fuel efficiency)',
      power: '8.02 PS @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.8 Litres with anti-rust internal treatment',
      transmission: '4-speed Constant Mesh with smooth shifting linkages',
      brakes: 'Front: 130 mm Drum with IBS | Rear: 130 mm Drum with Integrated Braking',
      colours: ['Dual Tone Black Red', 'Gloss Black Gold', 'Pearl White Gloss']
    },
    variants: [
      { name: 'Splendor+ XTEC 2.0 Standard', difference: 'Full LED H-headlight, hazard switch, digital console' }
    ],
    description: 'The Splendor+ XTEC 2.0 represents the ultimate pinnacle of the Splendor family, bringing modern full-LED lighting, hazard flashers, and premium two-tone craftsmanship to everyday commuting.',
    highlights: [
      { label: 'Headlamp', value: 'Full LED + H-DRL' },
      { label: 'Safety', value: 'Hazard Light Switch' },
      { label: 'Seat', value: 'Dual-Tone Premium' },
      { label: 'Fuel Tech', value: 'xSens + i3S' }
    ]
  },
  {
    id: 'splendor-plus-flex',
    name: 'Hero Splendor+ FLEX',
    tagline: 'India’s Pioneer Eco-Friendly Flex-Fuel Commuter',
    category: 'commuter',
    mainType: 'bikes',
    isFlexFuel: true,
    badge: 'Flex-Fuel Ready (E20 - E85)',
    badgeColor: 'bg-green-600 text-white',
    image: splendorImg,
    features: [
      'Advanced Flex-Fuel internal combustion engine compatible with ethanol blends from E20 up to E85',
      'Ethanol-resistant fuel tank internal anti-corrosion lining, special rubber hoses, and valves',
      'High-flow specialized fuel injectors tuned for varied ethanol-to-petrol blend ratios',
      'Intelligent closed-loop ECU mapping that auto-detects ethanol percentage in real time',
      'Significant reduction in greenhouse tailpipe emissions with green mobility emblem',
      'Hero i3S Idle Stop-Start technology for maximum urban energy conservation',
      'Integrated Braking System (IBS) delivering uniform stopping control on wet roads',
      'All-weather durable tubeless tires engineered for low rolling resistance'
    ],
    specs: {
      engine: '97.2 cc, Single Cylinder, 4-stroke Flex-Fuel (Ethanol Blend E20 to E85 Capable)',
      mileage: '~68 kmpl (Green eco-mobility calibration)',
      power: '7.91 PS @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.8 Litres with anti-corrosive ethanol lining',
      transmission: '4-speed Constant Mesh, Wet Multiplate Clutch',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with IBS',
      colours: ['Eco Matte Green', 'Pearl White Flex', 'Techno Silver']
    },
    variants: [
      { name: 'Splendor+ FLEX Standard', difference: 'E20-E85 multi-fuel compliant engine and fuel management' }
    ],
    description: 'Designed for the future of sustainable Indian mobility, the Splendor+ FLEX is capable of running on up to 85% ethanol blend fuel, cutting down fuel expenses and carbon footprints without losing trademark Splendor reliability.',
    highlights: [
      { label: 'Fuel Compatibility', value: 'E20 to E85 Ethanol' },
      { label: 'Emissions', value: 'Ultra-low Carbon' },
      { label: 'ECU Tech', value: 'Ethanol Auto-Sensor' },
      { label: 'Stopping', value: 'IBS Integrated' }
    ]
  },
  {
    id: 'hf-deluxe',
    name: 'Hero HF Deluxe',
    tagline: 'Har Gaon Ki Shaan - Dependable Power & Economy',
    category: 'commuter',
    mainType: 'bikes',
    isBestSeller: true,
    badge: 'Heavy Duty Value',
    badgeColor: 'bg-red-600 text-white',
    image: splendorImg,
    features: [
      'Sturdy 97.2cc xSens Fuel Injected engine with 10 intelligent monitoring sensors',
      'Patented Hero i3S Idle Stop-Start System automatically restarts with clutch pull',
      'Side-stand engine cut-off sensor prevents engine ignition when side stand is engaged',
      'Longest-in-class plush cushioned seat providing superior comfort for rider and pillion',
      'Heavy-duty 5-step adjustable rear shock absorbers built for rural and rough terrains',
      'Integrated Braking System (IBS) links front and rear brakes for short stopping distance',
      'Low friction engine architecture delivering ultra-low maintenance and repair costs',
      'Aerodynamic front cowl with high-luminosity clear-lens multi-reflector headlamp'
    ],
    specs: {
      engine: '97.2 cc, Air-cooled, 4-stroke Single Cylinder OHC',
      mileage: '~65 - 70 kmpl (Variant dependent, with i3S)',
      power: '8.02 PS (5.9 kW) @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.6 Litres',
      transmission: '4-speed Constant Mesh, Wet Multi-plate Clutch',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with Integrated Braking System',
      colours: ['Techno Blue', 'Heavy Grey with Black', 'Black with Red', 'Candy Blazing Red']
    },
    variants: [
      { name: 'HF Deluxe Kick Start Drum Alloy', difference: 'Kick start, cast alloy wheels' },
      { name: 'HF Deluxe Self Start Drum Alloy', difference: 'Electric starter, alloy wheels, IBS' },
      { name: 'HF Deluxe i3S Self Start Alloy', difference: 'Self start, i3S engine stop-start technology, dual-tone decals' }
    ],
    description: 'The Hero HF Deluxe is built tough for daily workhorses across town and country. Known for phenomenal fuel mileage and minimal maintenance, it keeps businesses, farmers, and daily commuters moving reliably.',
    highlights: [
      { label: 'Efficiency', value: '~70 kmpl' },
      { label: 'Sensors', value: '10 xSens Sensors' },
      { label: 'Ground Clearance', value: '165 mm' },
      { label: 'Suspension', value: '5-step Adjustable' }
    ]
  },
  {
    id: 'hf-deluxe-flex',
    name: 'Hero HF Deluxe FLEX',
    tagline: 'Sustainable Commuting Engineered for Real India',
    category: 'commuter',
    mainType: 'bikes',
    isFlexFuel: true,
    badge: 'Flex-Fuel Ready',
    badgeColor: 'bg-green-600 text-white',
    image: splendorImg,
    features: [
      'Flex-Fuel compliant engine capable of operating on ethanol blends ranging from E20 to E85',
      'Reinforced corrosion-resistant fuel pump, fuel lines, and catalytic converter',
      'Proprietary xSens ECU calibration for smooth combustion across varying ethanol ratios',
      'Hero i3S Idle Stop-Start technology for automatic engine restart at traffic halts',
      'Rugged metal grab rail and heavy-duty chassis engineered to carry utility loads',
      'Integrated Braking System (IBS) ensuring skid-resistant stopping in rainy conditions',
      'Low total cost of ownership with green mobility tax benefits and ethanol cost savings'
    ],
    specs: {
      engine: '97.2 cc, Single Cylinder, 4-stroke Flex-Fuel (E20 - E85 Ethanol Compatible)',
      mileage: '~66 kmpl',
      power: '7.91 PS @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.6 Litres with flex-fuel compliant treatment',
      transmission: '4-speed Constant Mesh, Wet Multiplate',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with IBS',
      colours: ['Forest Green Flex', 'Dual Tone Silver Black', 'Classic Red']
    },
    variants: [
      { name: 'HF Deluxe FLEX Self Alloy', difference: 'Electric starter, Flex-Fuel engine, alloy wheels' }
    ],
    description: 'The HF Deluxe FLEX combines the beloved ruggedness of the HF Deluxe with flex-fuel readiness, giving riders the freedom to utilize economical ethanol fuels while preserving proven reliability.',
    highlights: [
      { label: 'Fuel Range', value: 'E20 to E85 Ethanol' },
      { label: 'Starting', value: 'Self & Kick Start' },
      { label: 'Braking', value: 'IBS Integrated' },
      { label: 'Chassis', value: 'High-Tensile Steel' }
    ]
  },
  {
    id: 'hf-100',
    name: 'Hero HF 100',
    tagline: 'India’s Most Affordable & Dependable Commuter',
    category: 'commuter',
    mainType: 'bikes',
    badge: 'Most Affordable',
    badgeColor: 'bg-neutral-700 text-white',
    image: splendorImg,
    features: [
      'Most economical commuter motorcycle in the Hero MotoCorp lineup with lowest running cost',
      'Programmed Fuel Injection with xSens advanced multi-sensor system for reliable cold starts',
      'Rugged solid metal pillion grab rail with integrated flat utility luggage carrier',
      'Generous 165mm ground clearance built to tackle potholes and village roads with ease',
      'Low-friction engine internals delivering exceptional mileage and minimal wear',
      'Heavy-duty dual hydraulic shock absorbers designed for heavy daily utility carrying',
      'Long lasting metal exhaust with stylish chrome heat shield for leg safety',
      'Integrated Braking System (IBS) for coordinated, stable front and rear deceleration'
    ],
    specs: {
      engine: '97.2 cc, Air-cooled, 4-stroke Single Cylinder OHC',
      mileage: '~70 kmpl (India’s highest fuel economy commuter)',
      power: '8.02 PS (5.9 kW) @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '9.1 Litres',
      transmission: '4-speed Constant Mesh, Wet Multi-plate',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with IBS',
      colours: ['Nexus Blue', 'Black with Red']
    },
    variants: [
      { name: 'HF 100 Kick Start Alloy', difference: 'Kick start, durable cast alloy wheels, heavy duty carrier' }
    ],
    description: 'Hero HF 100 is engineered for hardworking individuals who demand maximum mileage, minimal maintenance, and unmatched durability at the most accessible price point in India.',
    highlights: [
      { label: 'Economy', value: '70+ kmpl' },
      { label: 'Weight', value: '110 kg' },
      { label: 'Payload Carrier', value: 'Heavy Duty Metal' },
      { label: 'Fuel Tech', value: 'Programmed FI' }
    ]
  },
  {
    id: 'passion-plus',
    name: 'Hero Passion+',
    tagline: 'Style Ka Naya Andaaz - Modern Design Meets Splendor Reliability',
    category: 'commuter',
    mainType: 'bikes',
    badge: 'Stylish Commuter',
    badgeColor: 'bg-amber-600 text-white',
    image: glamourImg,
    features: [
      'Bold contemporary styling with iconic Passion 3D badging and aerodynamic bodywork',
      'Digi-Analog instrument console with integrated Real-Time Mileage Indicator (RTMI)',
      'Convenient mobile USB charging port positioned directly on the handlebar cowl',
      'Signature aerodynamic front visor with chrome-tipped accents and powerful headlamp',
      'Plush ribbed dual-tone seat offering optimal lumbar support during daily traffic jams',
      'Patented Hero i3S technology for automated engine switch-off at red lights',
      'Wide 18-inch tubeless tires providing excellent stability on wet and greasy city roads',
      'Integrated Braking System (IBS) for smooth, panic-free progressive stopping'
    ],
    specs: {
      engine: '97.2 cc, Air-cooled, 4-stroke Single Cylinder OHC',
      mileage: '~65 kmpl (Tested city commute economy)',
      power: '8.02 PS (5.9 kW) @ 8,000 rpm | Torque: 8.05 Nm @ 6,000 rpm',
      fuelTank: '11.0 Litres (Longest range in 100cc segment)',
      transmission: '4-speed Constant Mesh, Wet Multi-plate',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with Integrated Braking System',
      colours: ['Sports Red', 'Black Nexus Blue', 'Black Heavy Grey']
    },
    variants: [
      { name: 'Passion+ Self Drum Alloy', difference: 'Electric starter, digi-analog console, mobile charger, i3S' }
    ],
    description: 'Hero Passion+ brings youthfulness, premium graphics, and modern amenities like mobile charging to the proven 100cc platform. Ideal for college students and executive commuters who refuse to compromise on style.',
    highlights: [
      { label: 'Fuel Tank', value: '11.0 Litres (Long Range)' },
      { label: 'Charging', value: 'Built-in Mobile Port' },
      { label: 'Console', value: 'Digi-Analog with RTMI' },
      { label: 'Technology', value: 'i3S Stop-Start' }
    ]
  },

  // =========================================================================
  // PREMIUM COMMUTER / STREET BIKES
  // =========================================================================
  {
    id: 'super-splendor',
    name: 'Hero Super Splendor',
    tagline: 'Kamai Ka Hero - 125cc Power with 5-Speed Transmission',
    category: 'premium',
    mainType: 'bikes',
    badge: '125cc Segment Favorite',
    badgeColor: 'bg-red-600 text-white',
    image: glamourImg,
    features: [
      'Refined 124.7cc engine delivering punchy 10.84 PS power for effortless highway overtaking',
      'Smooth 5-speed transmission engineered for relaxed, vibration-free cruising at 70+ km/h',
      'Front 240mm disc brake option providing decisive stopping power in emergency maneuvers',
      'Generous 12-litre sculpted fuel tank delivering an astounding 700+ km touring range',
      '180mm high ground clearance engineered to glide over steep speed bumps and broken roads',
      'Analogue-digital speedometer with side-stand indicator, service due reminder, and RTMI',
      'Hero i3S Idle Stop-Start system maximizing fuel economy in stop-and-go metro traffic',
      'Wide 90/90 rear tubeless tire providing superior grip and cornering stability'
    ],
    specs: {
      engine: '124.7 cc, Air-cooled, 4-stroke Single Cylinder with xSens Fi',
      mileage: '~60 kmpl (Variant dependent)',
      power: '10.84 PS (7.97 kW) @ 7,500 rpm | Torque: 10.6 Nm @ 6,000 rpm',
      fuelTank: '12.0 Litres',
      transmission: '5-speed Constant Mesh (1 Down, 4 Up)',
      brakes: 'Front: 240 mm Disc / 130 mm Drum (Variant dependent) | Rear: 130 mm Drum with IBS',
      colours: ['Heavy Grey', 'Candy Blazing Red', 'Black with Silver', 'Dusky Black']
    },
    variants: [
      { name: 'Super Splendor Drum Alloy', difference: '130mm front drum brake, alloy wheels, i3S, IBS' },
      { name: 'Super Splendor Disc Alloy', difference: 'Front 240mm disc brake, alloy wheels, i3S, premium decals' }
    ],
    description: 'Hero Super Splendor is India’s beloved 125cc commuter that pairs the unshakeable reliability of the Splendor badge with more power, a 5th gear for effortless highways, and optional front disc braking.',
    highlights: [
      { label: 'Displacement', value: '125 cc (10.84 PS)' },
      { label: 'Gears', value: '5-Speed Transmission' },
      { label: 'Ground Clearance', value: '180 mm' },
      { label: 'Braking Option', value: '240mm Front Disc' }
    ]
  },
  {
    id: 'super-splendor-xtec',
    name: 'Hero Super Splendor XTEC',
    tagline: 'Smart Connectivity Meets 125cc Performance',
    category: 'premium',
    mainType: 'bikes',
    badge: 'Bluetooth & Full Digital',
    badgeColor: 'bg-blue-600 text-white',
    image: glamourImg,
    features: [
      'Full Digital LCD Speedometer cluster with Bluetooth smartphone synchronization',
      'Real-time incoming call alerts, SMS notification popups, and phone battery percentage',
      'Full LED headlamp with distinct high-intensity LED Daytime Running Light (DRL) bar',
      'Integrated USB fast-charging socket located directly beneath the instrument console',
      'Real-Time Mileage Indicator (RTMI) along with digital low-fuel warning alert',
      'Hero i3S Idle Stop-Start technology for superior fuel management in metro traffic',
      'Optional 240mm front hydraulic disc brake with Integrated Braking System (IBS)',
      'xSens Programmed Fuel Injection with 9 sensors for optimal combustion and throttle response'
    ],
    specs: {
      engine: '124.7 cc, Air-cooled, 4-stroke Single Cylinder FI',
      mileage: '~62 kmpl (Class-leading 125cc economy)',
      power: '10.84 PS (7.97 kW) @ 7,500 rpm | Torque: 10.6 Nm @ 6,000 rpm',
      fuelTank: '12.0 Litres',
      transmission: '5-speed Constant Mesh (1 Down, 4 Up)',
      brakes: 'Front: 240 mm Disc / 130 mm Drum (Variant dependent) | Rear: 130 mm Drum with IBS',
      colours: ['Gloss Black', 'Candy Blazing Red', 'Matte Axis Grey']
    },
    variants: [
      { name: 'Super Splendor XTEC Drum', difference: 'Full digital console, Bluetooth, LED headlight, USB port, drum brakes' },
      { name: 'Super Splendor XTEC Disc', difference: 'Front 240mm hydraulic disc brake, full digital Bluetooth cluster, LED headlight' }
    ],
    description: 'The Super Splendor XTEC adds advanced tech features including full Bluetooth connectivity, an all-LED headlamp, and a digital console to Hero’s benchmark 125cc executive commuter.',
    highlights: [
      { label: 'Cluster', value: 'Full Digital LCD' },
      { label: 'Lighting', value: 'Full LED + DRL' },
      { label: 'Connectivity', value: 'Bluetooth Call/SMS' },
      { label: 'Brakes', value: 'Disc / Drum (Variant)' }
    ]
  },
  {
    id: 'glamour',
    name: 'Hero Glamour',
    tagline: 'Leading with Style - Muscular Stance with 125cc Agility',
    category: 'premium',
    mainType: 'bikes',
    badge: 'Dynamic Styling',
    badgeColor: 'bg-red-600 text-white',
    image: glamourImg,
    features: [
      'Chiseled muscular fuel tank with aggressive aerodynamic tank extensions and dual-tone graphics',
      'Responsive 124.7cc air-cooled engine tuned for punchy low and mid-range torque delivery',
      'Digi-Analog instrument console featuring Real-Time Mileage Indicator (RTMI) & gear position',
      'Wide 100/80 section rear tubeless tire providing exceptional cornering grip and stance',
      'Smooth 5-speed transmission for refined highway cruising and effortless overtakes',
      'Hero patented i3S technology ensuring intelligent engine cut-off at traffic intersections',
      'Comfortable upright riding posture with ergonomic handlebar and plush dual-density seat',
      'Front 240mm disc brake option linked with Integrated Braking System for confident stops'
    ],
    specs: {
      engine: '124.7 cc, Air-cooled, 4-stroke Single Cylinder OHC',
      mileage: '~55 - 60 kmpl (Variant dependent)',
      power: '10.53 PS @ 7,500 rpm | Torque: 10.4 Nm @ 6,000 rpm',
      fuelTank: '10.0 Litres',
      transmission: '5-speed Constant Mesh, Wet Multi-plate',
      brakes: 'Front: 240 mm Disc / 130 mm Drum (Variant dependent) | Rear: 130 mm Drum with IBS',
      colours: ['Techno Blue-Black', 'Sports Red-Black', 'Black Metallic']
    },
    variants: [
      { name: 'Glamour Drum Alloy', difference: '130mm drum brakes front & rear, alloy wheels, i3S, RTMI' },
      { name: 'Glamour Disc Alloy', difference: '240mm front disc brake, alloy wheels, i3S, premium graphics' }
    ],
    description: 'Hero Glamour is designed for youthful riders who desire commuter fuel efficiency wrapped in a bold, sporty, muscular aesthetic. Its wide rear tire and 5-speed gearbox make every city ride thrilling.',
    highlights: [
      { label: 'Rear Tire', value: '100/80 Wide Tubeless' },
      { label: 'Power', value: '10.53 PS' },
      { label: 'Gearbox', value: '5-Speed Constant Mesh' },
      { label: 'Front Brake', value: '240mm Disc (Variant)' }
    ]
  },
  {
    id: 'glamour-xtec',
    name: 'Hero Glamour XTEC',
    tagline: 'The Hi-Tech Street 125cc with Turn-by-Turn Navigation',
    category: 'premium',
    mainType: 'bikes',
    badge: 'Turn-by-Turn GPS Nav',
    badgeColor: 'bg-indigo-600 text-white',
    image: glamourImg,
    features: [
      'Segment-first Turn-by-Turn Google GPS Navigation displayed on full digital instrument console',
      'Bluetooth smartphone pairing with caller ID, missed call alert, and incoming SMS notifications',
      'Segment-first Bank Angle Sensor that cuts off the engine immediately during accidental tip-overs',
      'Distinctive H-shaped LED headlamp with bright integrated LED daytime running position lamps',
      'Integrated USB mobile phone charging port positioned directly beside the dashboard',
      'Gear Position Indicator and Real-Time Mileage Indicator on high-contrast negative LCD',
      '5-speed gearbox paired with Hero i3S Idle Stop-Start system for optimized fuel efficiency',
      'Wide 100/80 tubeless rear tire mounted on 5-spoke split alloy wheels for superior traction'
    ],
    specs: {
      engine: '124.7 cc, Air-cooled, 4-stroke Single Cylinder Programmed FI',
      mileage: '~60 kmpl (High-efficiency xSens fuel management)',
      power: '10.84 PS (7.97 kW) @ 7,500 rpm | Torque: 10.6 Nm @ 6,000 rpm',
      fuelTank: '10.0 Litres',
      transmission: '5-speed Constant Mesh, Wet Multi-plate',
      brakes: 'Front: 240 mm Disc / 130 mm Drum (Variant dependent) | Rear: 130 mm Drum with IBS',
      colours: ['Nexus Blue', 'Candy Blazing Red', 'Glossy Black', 'Matte Axis Grey']
    },
    variants: [
      { name: 'Glamour XTEC Drum Alloy', difference: 'Turn-by-Turn GPS, Bluetooth, LED headlamp, drum brakes' },
      { name: 'Glamour XTEC Disc Alloy', difference: 'Front 240mm disc brake, Turn-by-Turn GPS, Bluetooth, Bank Angle Sensor' }
    ],
    description: 'Hero Glamour XTEC stands at the technology forefront of the 125cc segment, packing Turn-by-Turn GPS navigation, a Bank Angle tilt safety sensor, and Bluetooth connectivity into a fierce street package.',
    highlights: [
      { label: 'GPS Assist', value: 'Turn-by-Turn Nav' },
      { label: 'Safety Sensor', value: 'Bank Angle Cut-off' },
      { label: 'Lighting', value: 'H-Shaped Full LED' },
      { label: 'Connectivity', value: 'Bluetooth & Caller ID' }
    ]
  },
  {
    id: 'mavrick-440',
    name: 'Hero Mavrick 440',
    tagline: 'Pure Muscle - Hero’s Flagship 440cc TorqX Roadster',
    category: 'premium',
    mainType: 'bikes',
    badge: 'Hero Flagship 440cc',
    badgeColor: 'bg-neutral-900 text-amber-400 border border-amber-500/30',
    image: mavrickImg,
    features: [
      'Massive 440cc TorqX air/oil-cooled powertrain churning out 36 Nm torque with 90% available from 2,000 rpm',
      'Assist and Slipper Clutch for feather-light clutch lever action and smooth aggressive downshifts',
      'Dual-Channel ABS with oversized 320mm front disc and 240mm rear disc for track-grade stopping',
      'Interactive Negative LCD console with Bluetooth smartphone pairing, eSIM telematics & turn-by-turn navigation',
      'Distinctive all-metal muscular roadster fuel tank with brushed metal tank shrouds',
      'Full round LED projector headlamp with signature H-shaped LED daytime running lights',
      'Beefy 43mm telescopic front forks paired with 7-step pre-load adjustable dual rear gas-charged shocks',
      'Wide 150-section rear radial tire mounted on lightweight diamond-cut alloy wheels'
    ],
    specs: {
      engine: '440 cc, Air/Oil-cooled, Single Cylinder 2-Valve SOHC TorqX Engine',
      mileage: '~30 - 32 kmpl (Variant dependent)',
      power: '27.36 PS @ 6,000 rpm | Torque: 36 Nm @ 4,000 rpm (High low-end punch)',
      fuelTank: '13.5 Litres all-metal sculptured tank',
      transmission: '6-speed Gearbox with Assist & Slipper Clutch',
      brakes: 'Front: 320 mm Disc | Rear: 240 mm Disc with Dual-Channel ABS',
      colours: ['Phantom Black', 'Enigma Black', 'Buffing Arctic White', 'Fearless Red', 'Celestial Blue']
    },
    variants: [
      { name: 'Mavrick 440 Base', difference: 'Spoke wheels, Arctic White colour, Dual-Channel ABS' },
      { name: 'Mavrick 440 Mid', difference: 'Cast alloy wheels, Fearless Red / Celestial Blue, Dual-Channel ABS' },
      { name: 'Mavrick 440 Top', difference: 'Machined diamond-cut alloy wheels, 3D badging, e-SIM connected suite, Phantom Black' }
    ],
    description: 'The Hero Mavrick 440 is Hero MotoCorp’s flagship roadster, engineered for raw torque and effortless highway touring. Its 440cc TorqX motor delivers an authoritative low-end rumble and thrilling acceleration.',
    highlights: [
      { label: 'Torque', value: '36 Nm @ 4,000 rpm' },
      { label: 'Clutch', value: 'Assist & Slipper' },
      { label: 'Gearbox', value: '6-Speed' },
      { label: 'Safety', value: 'Dual-Channel ABS' }
    ]
  },
  {
    id: 'xpulse-200-4v',
    name: 'Hero XPulse 200 4V',
    tagline: 'Make New Tracks - The World-Renowned Adventure Dual-Sport',
    category: 'premium',
    mainType: 'bikes',
    badge: 'Adventure Dual-Sport',
    badgeColor: 'bg-orange-600 text-white',
    image: xpulseImg,
    features: [
      'High-revving 199.6cc 4-Valve oil-cooled engine producing 19.17 PS for superior trail performance',
      'Dual-Sport 3-Mode ABS (Road, Off-Road, and Rally) allowing rider to disable rear ABS for dirt slides',
      'Extreme off-road terrain capability with 220mm ground clearance and high-mounted exhaust',
      'Long-travel suspension: 190mm front stroke and 10-step adjustable 170mm rear monoshock',
      'Large 21-inch front spoke wheel and 18-inch rear wheel clad with dual-purpose knobby tires',
      'Class-D LED projector headlamp with 230% brighter beam spread and protective knuckle guards',
      'Full digital LCD display with Bluetooth Turn-by-Turn GPS navigation and gear position indicator',
      'High-strength steel bash plate protecting the crankcase from jagged rocks and boulders'
    ],
    specs: {
      engine: '199.6 cc, Oil-cooled, 4-stroke 4-Valve Single Cylinder OHC',
      mileage: '~35 - 40 kmpl (Variant dependent)',
      power: '19.17 PS @ 8,500 rpm | Torque: 17.35 Nm @ 6,500 rpm',
      fuelTank: '13.0 Litres',
      transmission: '5-speed Constant Mesh, Multi-plate Wet Clutch',
      brakes: 'Front: 276 mm Petal Disc (3-Mode ABS: Road/Off-road/Rally) | Rear: 220 mm Petal Disc',
      colours: ['Nexus Blue', 'Techno Blue', 'Matte Nexus Blue', 'Black Sports Red']
    },
    variants: [
      { name: 'XPulse 200 4V Standard', difference: '3-mode ABS, 4V engine, projector LED, turn-by-turn navigation' },
      { name: 'XPulse 200 4V Pro Edition', difference: 'Fully adjustable front & rear suspension, handlebar risers, taller bench seat, max ground clearance 270mm' }
    ],
    description: 'The Hero XPulse 200 4V is India’s premier adventure motorcycle, trusted by rally racers and globetrotters alike. Its 4-valve oil-cooled heart, switchable ABS, and 21-inch front wheel let you conquer any mountain or desert.',
    highlights: [
      { label: 'Ground Clearance', value: '220 mm (Pro: 270mm)' },
      { label: 'Suspension Travel', value: '190mm Front / 170mm Rear' },
      { label: 'ABS Modes', value: 'Road / Off-Road / Rally' },
      { label: 'Wheels', value: '21" Front / 18" Rear' }
    ]
  },

  // =========================================================================
  // SPORTS / PERFORMANCE BIKES
  // =========================================================================
  {
    id: 'xtreme-125r',
    name: 'Hero Xtreme 125R',
    tagline: 'Challenge the Fast - Segment-First ABS Streetfighter',
    category: 'sports',
    mainType: 'bikes',
    isNewLaunch: true,
    badge: 'Segment-First ABS',
    badgeColor: 'bg-red-600 text-white',
    image: xtremeImg,
    features: [
      'Segment-first Single-Channel ABS paired with a massive 276mm front petal disc brake',
      'SPRINT-EBT 125cc engine delivering blistering 0 to 60 km/h acceleration in just 5.9 seconds',
      'Predator-inspired full LED projector headlamp with sinister eyebrow LED DRLs and LED winkers',
      'Heavy-duty 37mm Showa front telescopic suspension and 7-step pre-load adjustable rear monoshock',
      'Super-wide 120/80 section rear radial tubeless tire for extreme high-speed cornering stability',
      'Sporty split-seat design with textured fabric, aerodynamic tail cowl, and split pillion grab handles',
      'Negative LCD instrument cluster with gear shift timer, gear indicator, and real-time fuel efficiency',
      'Chiseled 10-litre sculpted fuel tank with aggressive knee recesses for track-ready ergonomics'
    ],
    specs: {
      engine: '124.7 cc, Air-cooled, 4-stroke Single Cylinder SPRINT Engine',
      mileage: '~66 kmpl (SPRINT EBT high efficiency)',
      power: '11.55 PS (8.5 kW) @ 8,250 rpm | Torque: 10.5 Nm @ 6,000 rpm',
      fuelTank: '10.0 Litres',
      transmission: '5-speed Constant Mesh, Wet Multi-plate',
      brakes: 'Front: 276 mm Petal Disc with Single-Channel ABS (Segment First) | Rear: 130 mm Drum',
      colours: ['Cobalt Blue', 'Firestorm Red', 'Stallion Black']
    },
    variants: [
      { name: 'Xtreme 125R IBS', difference: 'Integrated Braking System (IBS), 240mm front disc, full LED, split seat' },
      { name: 'Xtreme 125R ABS', difference: 'Single-Channel ABS, larger 276mm front petal disc, full LED, Showa suspension' }
    ],
    description: 'The Hero Xtreme 125R is a game-changer in the 125cc segment. Featuring genuine streetfighter styling, segment-first ABS, and 0-60 km/h in 5.9s, it delivers performance thrills with everyday fuel economy.',
    highlights: [
      { label: '0-60 km/h', value: '5.9 Seconds' },
      { label: 'Safety', value: 'Single-Channel ABS' },
      { label: 'Rear Tire', value: '120/80 Wide Radial' },
      { label: 'Front Forks', value: '37mm Showa' }
    ]
  },
  {
    id: 'xtreme-160r',
    name: 'Hero Xtreme 160R',
    tagline: 'Boom - The 0 to 60 in 4.7s City Street Weapon',
    category: 'sports',
    mainType: 'bikes',
    badge: '0-60 in 4.7 Seconds',
    badgeColor: 'bg-red-600 text-white',
    image: xtremeImg,
    features: [
      'Class-dominating drag acceleration: 0 to 60 km/h sprint achieved in a blistering 4.7 seconds',
      'Ultra-lightweight rigid tubular diamond frame delivering razor-sharp street flickability',
      'All-LED lighting setup including smoked LED tail lamp with signature 3D H-shaped light guide',
      'Inverted negative LCD instrument console with 5 levels of custom brightness adjustment',
      'Hazard warning flasher switch for rapid emergency notification during inclement weather',
      'Single-Channel ABS with 276mm front petal disc brake for sharp, fade-free stopping',
      'Auto-Sail technology allowing smooth clutch release without stalling in crawl city traffic',
      'Wide 130/70 radial rear tire ensuring tenacious grip through high-speed sweeping corners'
    ],
    specs: {
      engine: '163 cc, Air-cooled, 4-stroke 2-Valve Single Cylinder OHC',
      mileage: '~48 - 50 kmpl (Variant dependent)',
      power: '15.2 PS @ 8,500 rpm | Torque: 14 Nm @ 6,500 rpm',
      fuelTank: '12.0 Litres',
      transmission: '5-speed Constant Mesh, Wet Multi-plate',
      brakes: 'Front: 276 mm Petal Disc with Single-Channel ABS | Rear: 220 mm Petal Disc / 130 mm Drum (Variant dependent)',
      colours: ['Pearl Silver White', 'Vibrant Blue', 'Sports Red']
    },
    variants: [
      { name: 'Xtreme 160R Single Disc', difference: 'Front 276mm disc with ABS, rear 130mm drum' },
      { name: 'Xtreme 160R Dual Disc', difference: 'Front 276mm disc with ABS, rear 220mm petal disc' },
      { name: 'Xtreme 160R Stealth Edition', difference: 'Matte black livery, 3D dark chrome emblem, gear position indicator' }
    ],
    description: 'Hero Xtreme 160R is engineered for urban adrenaline. With its agile chassis and 4.7-second 0-60 launch, it effortlessly slices through city traffic while turning heads with its streetfighter silhouette.',
    highlights: [
      { label: '0-60 km/h', value: '4.7 Seconds' },
      { label: 'Kerb Weight', value: '138.5 kg (Nimble)' },
      { label: 'Rear Tire', value: '130/70 Radial' },
      { label: 'Safety', value: 'Single-Channel ABS' }
    ]
  },
  {
    id: 'xtreme-160r-4v',
    name: 'Hero Xtreme 160R 4V',
    tagline: 'Unleash the 4-Valve Beast with Golden KYB USD Forks',
    category: 'sports',
    mainType: 'bikes',
    badge: 'KYB USD Forks & 4V',
    badgeColor: 'bg-yellow-500 text-black font-bold',
    image: xtremeImg,
    features: [
      'Track-grade 37mm KYB upside-down (USD) golden front forks for pinpoint cornering precision',
      'High-revving 163.2cc 4-Valve oil-cooled powertrain generating a class-topping 16.9 PS power',
      'Dual-Channel ABS option with radial-mount petal disc calipers for track-grade stopping',
      'Split sporty racer seat with aerodynamic rear pillion cowl and lower center of gravity',
      'Bluetooth connected digital speedometer featuring 20+ telematics and call/SMS functions',
      'Aggressive predator streetfighter headlamp cowl with twin high-intensity LED light guides',
      '7-step pre-load adjustable gas-charged rear monoshock tuned specifically for track days',
      'Wide 130-section zero-degree steel-belted radial rear tire for maximum lean angle grip'
    ],
    specs: {
      engine: '163.2 cc, Oil-cooled, 4-stroke 4-Valve Single Cylinder OHC',
      mileage: '~45 - 48 kmpl (Class-topping power-to-weight ratio)',
      power: '16.9 PS (12.4 kW) @ 8,500 rpm | Torque: 14.6 Nm @ 6,500 rpm',
      fuelTank: '12.0 Litres',
      transmission: '5-speed Constant Mesh, Wet Multiplate',
      brakes: 'Front: 276 mm Petal Disc with Dual-Channel / Single-Channel ABS (Variant dependent) | Rear: 220 mm Petal Disc',
      colours: ['Blazing Sports Red', 'Neon Shooting Star', 'Matte Slate Black']
    },
    variants: [
      { name: 'Xtreme 160R 4V Standard', difference: 'Telescopic front suspension, single-channel ABS, 4V engine' },
      { name: 'Xtreme 160R 4V Connected', difference: 'Telescopic suspension, Bluetooth telematics suite, single-channel ABS' },
      { name: 'Xtreme 160R 4V Pro', difference: '37mm KYB Golden USD forks, dual-tone split seat, Dual-Channel ABS, Bluetooth' }
    ],
    description: 'The Xtreme 160R 4V redefines the sub-200cc streetfighter class with 4-valve oil-cooled performance and premium 37mm KYB inverted forks, making it the most lethal corner-carver on Indian roads.',
    highlights: [
      { label: 'Front Suspension', value: '37mm KYB USD Forks' },
      { label: 'Power', value: '16.9 PS (4-Valve)' },
      { label: 'Cooling', value: 'Oil-Cooled System' },
      { label: 'Braking', value: 'Dual-Channel ABS (Pro)' }
    ]
  },
  {
    id: 'xtreme-250r',
    name: 'Hero Xtreme 250R',
    tagline: 'The Quarter-Litre Apex Predator with Liquid Cooling',
    category: 'sports',
    mainType: 'bikes',
    isNewLaunch: true,
    badge: '250cc Liquid-Cooled',
    badgeColor: 'bg-red-700 text-white',
    image: xtremeImg,
    features: [
      'High-performance 249.03cc DOHC 4-Valve liquid-cooled engine producing an impressive 29.5 PS power',
      '43mm premium upside-down (USD) front suspension paired with a gas-charged monoshock',
      '6-speed close-ratio transmission equipped with an Assist and Slipper clutch for seamless shifts',
      'Dual-Channel Switchable ABS with dedicated Track and Urban braking intervention modes',
      'Sharp predator-themed full-LED projector headlights with aerodynamic winglet-inspired tank cowls',
      'Full-colour multi-mode LCD instrument screen with Turn-by-Turn navigation and lap timer',
      'Lightweight trellis-derived chassis offering telepathic corner entry and high-speed stability',
      'Radial-mounted 300mm front disc brake with sintered brake pads for maximum bite'
    ],
    specs: {
      engine: '249.03 cc, Liquid-cooled, 4-stroke 4-Valve DOHC Single Cylinder',
      mileage: '~32 - 35 kmpl (High-performance quarter-litre calibration)',
      power: '29.5 PS @ 9,250 rpm | Torque: 25 Nm @ 7,250 rpm',
      fuelTank: '12.5 Litres',
      transmission: '6-speed Gearbox with Slipper Clutch',
      brakes: 'Front: 300 mm Disc | Rear: 230 mm Disc with Dual-Channel Switchable ABS',
      colours: ['Stealth Carbon Grey', 'Racing Red', 'Metallic White']
    },
    variants: [
      { name: 'Xtreme 250R ABS Pro', difference: 'Dual-channel ABS, 43mm USD forks, slipper clutch, full digital cluster' }
    ],
    description: 'The Hero Xtreme 250R is Hero’s quarter-litre naked street fighter built for outright speed and agility. Armed with a 29.5 PS liquid-cooled DOHC motor and 43mm USD forks, it dominates street and circuit alike.',
    highlights: [
      { label: 'Max Power', value: '29.5 PS @ 9,250 rpm' },
      { label: 'Engine Type', value: 'DOHC 4V Liquid-Cooled' },
      { label: 'Suspension', value: '43mm USD Forks' },
      { label: 'Safety', value: 'Dual-Channel ABS' }
    ]
  },
  {
    id: 'karizma-xmr',
    name: 'Hero Karizma XMR',
    tagline: 'Born to Legend - 210cc DOHC Liquid-Cooled Supersport',
    category: 'sports',
    mainType: 'bikes',
    badge: 'Supersport Flagship',
    badgeColor: 'bg-amber-500 text-black font-extrabold',
    image: karizmaImg,
    features: [
      'Hero’s first-ever 210cc DOHC 4-Valve liquid-cooled powerplant generating 25.5 PS high-revving power',
      'Segment-first First-in-class Adjustable Aerodynamic Clip-On Windscreen with dual height modes',
      '6-speed close-ratio transmission coupled with a Slip & Assist Clutch for effortless downshifts',
      'Dual-Channel ABS paired with lightweight 300mm front petal disc and 230mm rear petal disc',
      'Inverted LCD digital speedometer console with turn-by-turn navigation and ambient auto-brightness',
      'Intelligent Class-D dual LED projector headlights with integrated auto-illuminating light sensors',
      'Lightweight steel trellis frame delivering rock-solid highway stability and racetrack precision',
      'Lightweight clip-on handlebars positioned for aggressive yet fatigue-free sports touring ergonomics'
    ],
    specs: {
      engine: '210 cc, Liquid-cooled, 4-stroke 4-Valve DOHC Single Cylinder',
      mileage: '~35 kmpl (Variant dependent)',
      power: '25.5 PS (19.2 kW) @ 9,250 rpm | Torque: 20.4 Nm @ 7,250 rpm',
      fuelTank: '11.0 Litres',
      transmission: '6-speed Gearbox with Slip & Assist Clutch',
      brakes: 'Front: 300 mm Petal Disc | Rear: 230 mm Petal Disc with Dual-Channel ABS',
      colours: ['Iconic Yellow', 'Turbo Red', 'Matte Phantom Black']
    },
    variants: [
      { name: 'Karizma XMR 210 Dual Channel ABS', difference: 'DOHC liquid-cooled engine, 6-speed slip-assist clutch, adjustable windscreen, dual ABS' }
    ],
    description: 'The Hero Karizma XMR resurrects India’s legendary performance brand in an all-new full-faired avatar. Powered by a high-revving 210cc DOHC liquid-cooled motor, it blends race-track aggression with all-day touring comfort.',
    highlights: [
      { label: 'Engine', value: '210cc DOHC 4V Liquid-Cooled' },
      { label: 'Windscreen', value: 'Adjustable Aerodynamic' },
      { label: 'Clutch', value: 'Slip & Assist 6-Speed' },
      { label: 'Lighting', value: 'Dual LED Projector' }
    ]
  },

  // =========================================================================
  // SCOOTER CATEGORY
  // =========================================================================
  {
    id: 'pleasure-plus',
    name: 'Hero Pleasure+',
    tagline: 'Why Should Boys Have All the Fun - Lightweight & Connected',
    category: 'scooter',
    mainType: 'scooters',
    badge: 'Lightweight & Agile',
    badgeColor: 'bg-pink-600 text-white',
    image: pleasureImg,
    features: [
      'Ultra-lightweight 106kg kerb weight with a low 765mm seat height for confidence and easy maneuvering',
      'Full LED Projector Headlamp offering 25% longer illumination throw with premium chrome bezel',
      'Bluetooth connectivity on XTEC variant with incoming call alerts, SMS notices, and battery status',
      'Hero i3S Idle Stop-Start technology delivering superior city scooter fuel economy',
      'Pillion backrest with luxury textured dual-tone seat for unmatched passenger comfort',
      'Integrated front mobile USB charging socket with convenient glove box and dual bag hooks',
      'Integrated Braking System (IBS) for stable and skid-free stopping on city streets',
      'Side-stand engine cut-off sensor preventing accidental scooter throttle operation'
    ],
    specs: {
      engine: '110.9 cc, Air-cooled, 4-stroke Single Cylinder with xSens Fi',
      mileage: '~50 - 55 kmpl (Class-leading scooter efficiency)',
      power: '8.1 PS (6 kW) @ 7,000 rpm | Torque: 8.7 Nm @ 5,500 rpm',
      fuelTank: '4.8 Litres',
      transmission: 'Variomatic Drive (Fully Automatic CVT)',
      brakes: 'Front: 130 mm Drum | Rear: 130 mm Drum with Integrated Braking System (IBS)',
      colours: ['Jubilant Yellow', 'Matte Vernier Grey', 'Polestar Blue', 'Pearl Silver White']
    },
    variants: [
      { name: 'Pleasure+ LX Drum', difference: 'Standard halogen light, drum brakes, tubeless tires' },
      { name: 'Pleasure+ VX Drum', difference: 'Alloy wheels, chrome styling package, i3S technology' },
      { name: 'Pleasure+ XTEC Connected', difference: 'Projector LED headlamp, Bluetooth call/SMS alerts, pillion backrest, dual-tone seat' }
    ],
    description: 'Hero Pleasure+ is the effortlessly stylish, featherweight automatic scooter built for urban commutes. Equipped with modern LED lighting, Bluetooth connectivity, and i3S technology, it is beloved across generations.',
    highlights: [
      { label: 'Kerb Weight', value: '106 kg (Ultra Light)' },
      { label: 'Seat Height', value: '765 mm' },
      { label: 'Headlamp', value: 'Projector LED (XTEC)' },
      { label: 'Comfort', value: 'Pillion Backrest' }
    ]
  },
  {
    id: 'xoom-110',
    name: 'Hero Xoom 110',
    tagline: 'Go Big. Go Xoom - Industry-First Corner Bending Lights',
    category: 'scooter',
    mainType: 'scooters',
    badge: 'Corner Bending Lights',
    badgeColor: 'bg-red-600 text-white',
    image: xoomImg,
    features: [
      'Industry-first Corner Bending Lights that automatically illuminate blind corners when leaning into a turn',
      'Futuristic full LED projector headlamp with distinctive aerodynamic H-shaped LED daytime running lights',
      'Wide 100/80 diamond-cut alloy wheels fitted with large 12-inch tubeless tires for maximum grip',
      'Fully digital speedometer console with Bluetooth pairing, caller alert, and real-time mileage display',
      'Front 190mm petal disc brake option paired with Integrated Braking System (IBS)',
      'Front apron utility compartments with dual USB charging ports and illuminated underseat storage boot',
      'Hero i3S Idle Stop-Start technology for automatic engine restart during city signals',
      'Aerodynamic sporty rear spoiler grab rail with dual-chamber LED tail lamp'
    ],
    specs: {
      engine: '110.9 cc, Air-cooled, 4-stroke Single Cylinder with xSens Fi',
      mileage: '~50 kmpl (Variant dependent)',
      power: '8.15 PS @ 7,250 rpm | Torque: 8.7 Nm @ 5,750 rpm',
      fuelTank: '5.2 Litres',
      transmission: 'Variomatic Drive (CVT Automatic)',
      brakes: 'Front: 190 mm Disc / 130 mm Drum (Variant dependent) | Rear: 130 mm Drum with IBS',
      colours: ['Sports Red', 'Black', 'Pearl White', 'Polestar Blue', 'Matt Abrax Orange']
    },
    variants: [
      { name: 'Xoom LX Sheet Drum', difference: 'Steel sheet wheels, drum brakes, digital-analog console' },
      { name: 'Xoom VX Cast Drum', difference: 'Cast alloy wheels, full digital speedometer, corner bending lights, USB port' },
      { name: 'Xoom ZX Cast Disc', difference: 'Front 190mm petal disc, diamond-cut alloys, corner bending lights, Bluetooth cluster' }
    ],
    description: 'The Hero Xoom 110 brings revolutionary innovation to scooters with its active corner bending lights, bold aerodynamic lines, and full digital cockpit, making every urban turn safer and more stylish.',
    highlights: [
      { label: 'Innovation', value: 'Active Cornering Lights' },
      { label: 'Lighting', value: 'Full LED Projector' },
      { label: 'Wheels', value: '12" Diamond-Cut Alloys' },
      { label: 'Front Brake', value: '190mm Petal Disc (ZX)' }
    ]
  },
  {
    id: 'xoom-125r',
    name: 'Hero Xoom 125R',
    tagline: 'Aggressive 125cc Sport Scooter with 14-Inch Alloy Wheels',
    category: 'scooter',
    mainType: 'scooters',
    isNewLaunch: true,
    badge: '14-Inch Wheels & Sequential LED',
    badgeColor: 'bg-red-700 text-white',
    image: xoomImg,
    features: [
      'Segment-first large 14-inch alloy wheels providing motorcycle-like high-speed straight-line stability',
      'Sequential LED turn indicators with dynamic sweeping animation seen in luxury sports cars',
      'Advanced Corner Bending Lights illuminating night turns dynamically according to scooter lean angle',
      'Punchy 124.6cc engine producing 9.5 PS power for snappy overtaking and swift highway acceleration',
      'Full digital instrument cluster featuring Turn-by-Turn GPS navigation and Bluetooth caller ID',
      'Front 220mm petal disc brake with Integrated Braking System for instantaneous stopping power',
      'External fuel filler lid operated remotely via a single multi-function ignition key lock',
      'Sharp streetfighter-inspired split LED taillights and aerodynamic side winglets'
    ],
    specs: {
      engine: '124.6 cc, Air-cooled, 4-stroke Single Cylinder with eSP & xSens',
      mileage: '~48 kmpl (Class-leading 125cc sports tune)',
      power: '9.5 PS @ 7,500 rpm | Torque: 10.14 Nm @ 6,000 rpm',
      fuelTank: '5.5 Litres (External Fuel Cap)',
      transmission: 'Variomatic Drive (CVT Automatic)',
      brakes: 'Front: 220 mm Petal Disc | Rear: 130 mm Drum with IBS',
      colours: ['Nitro Crimson Red', 'Stealth Black', 'Blizzard White']
    },
    variants: [
      { name: 'Xoom 125R Disc', difference: '14-inch wheels, sequential LEDs, turn-by-turn navigation, 220mm disc' }
    ],
    description: 'The Hero Xoom 125R is engineered for performance scooter enthusiasts, sporting massive 14-inch alloy wheels, animated sequential turn signals, and motorcycle-level road manners.',
    highlights: [
      { label: 'Wheel Size', value: '14-inch Alloy Wheels' },
      { label: 'Indicators', value: 'Sequential Dynamic LED' },
      { label: 'Navigation', value: 'Turn-by-Turn GPS' },
      { label: 'Front Brake', value: '220mm Petal Disc' }
    ]
  },
  {
    id: 'xoom-160',
    name: 'Hero Xoom 160',
    tagline: 'Hero’s Flagship All-Terrain Adventure Maxi-Scooter',
    category: 'scooter',
    mainType: 'scooters',
    isNewLaunch: true,
    badge: '160cc Liquid-Cooled Maxi',
    badgeColor: 'bg-neutral-900 text-amber-400 border border-amber-500/30',
    image: xoomImg,
    features: [
      'Hero’s first-ever adventure maxi-scooter with tall touring windscreen and dual aerodynamic LED headlights',
      'Potent 156cc liquid-cooled 4-Valve engine generating 14 PS power for comfortable highway cruising',
      'Rugged 14-inch dual-sport block-pattern tires engineered to glide over broken roads and gravel tracks',
      'Smart Key system with remote keyless ignition, remote seat unlock, and answer-back vehicle locator',
      'Dual-Channel ABS with front 240mm disc and rear 220mm disc brakes for total emergency confidence',
      'Cavernous illuminated underseat storage space capable of swallowing a full-face helmet plus riding gear',
      'Ergonomic center spine frame with forward highway footboards for fatigue-free long touring trips',
      'Hero i3S Idle Stop-Start system paired with a silent ACG starter motor for quiet effortless starts'
    ],
    specs: {
      engine: '156 cc, Liquid-cooled, 4-stroke 4-Valve Single Cylinder',
      mileage: '~40 - 42 kmpl',
      power: '14 PS @ 8,000 rpm | Torque: 13.7 Nm @ 6,500 rpm',
      fuelTank: '7.0 Litres (Long-distance touring capacity)',
      transmission: 'CVT Automatic with Centrifugal Clutch',
      brakes: 'Front: 240 mm Disc | Rear: 220 mm Disc with Dual-Channel ABS',
      colours: ['Desert Gold', 'Canyon Red', 'Stealth Matte Grey']
    },
    variants: [
      { name: 'Xoom 160 Maxi Pro', difference: 'Smart Key, 14-inch dual sport wheels, liquid cooling, Dual-Channel ABS' }
    ],
    description: 'The Hero Xoom 160 introduces the adventure maxi-scooter category to Indian riders. With liquid-cooling, a smart key, dual-channel ABS, and dual-purpose 14-inch tires, it bridges the gap between daily city commutes and weekend highway getaways.',
    highlights: [
      { label: 'Displacement', value: '156cc Liquid-Cooled 4V' },
      { label: 'Key System', value: 'Keyless Smart Key' },
      { label: 'Wheels', value: '14" Dual-Sport Tires' },
      { label: 'Braking', value: 'Dual-Channel ABS' }
    ]
  },
  {
    id: 'destini-125',
    name: 'Hero Destini 125',
    tagline: 'The All-New Neo-Classic Family Scooter with Sofa Seat',
    category: 'scooter',
    mainType: 'scooters',
    isBestSeller: true,
    badge: 'Neo-Classic Luxury',
    badgeColor: 'bg-emerald-700 text-white',
    image: destiniImg,
    features: [
      'Completely redesigned neo-classic retro body styling with rich metallic paint finishes and chrome surrounds',
      'Longest-in-class dual-tone plush sofa seat with built-in ergonomic lumbar cushion for whole-family comfort',
      'Full Projector LED Headlamp with signature copper/chrome bezel and bright integrated LED position lamps',
      'High-contrast digital speedometer with Bluetooth smartphone pairing and turn-by-turn navigation',
      'External fuel filler lid with remote one-touch key operation on the multi-function ignition lock',
      'Convenient front mobile charging USB socket and brightly illuminated underseat luggage boot',
      'Hero i3S Idle Stop-Start technology for automatic engine restart and class-leading city mileage',
      'Front 190mm disc brake option with Integrated Braking System (IBS) for smooth deceleration'
    ],
    specs: {
      engine: '124.6 cc, Air-cooled, 4-stroke Single Cylinder with xSens Fi',
      mileage: '~50 kmpl (Optimized family commute economy)',
      power: '9.12 PS @ 7,000 rpm | Torque: 10.4 Nm @ 5,500 rpm',
      fuelTank: '5.3 Litres (External Fuel Lid)',
      transmission: 'Variomatic Drive (CVT Automatic)',
      brakes: 'Front: 190 mm Disc / 130 mm Drum (Variant dependent) | Rear: 130 mm Drum with IBS',
      colours: ['Eternal White', 'Regal Black', 'Mystique Magenta', 'Cosmic Red', 'Groovy Red']
    },
    variants: [
      { name: 'Destini 125 VX Drum', difference: 'Halogen headlight, drum brakes, external fuel filler, i3S' },
      { name: 'Destini 125 ZX Disc', difference: 'Projector LED headlight, 190mm front disc, alloy wheels, chrome package' },
      { name: 'Destini 125 XTEC Connected', difference: 'Projector LED, Bluetooth Turn-by-Turn GPS, dual-tone sofa seat, pillion backrest' }
    ],
    description: 'The All-New Hero Destini 125 combines timeless neo-classic elegance with modern family comfort. Its plush sofa seat, external fuel cap, and smooth 125cc xSens engine deliver effortless everyday travel.',
    highlights: [
      { label: 'Seat', value: 'Longest Dual-Tone Sofa Seat' },
      { label: 'Fuel Cap', value: 'External One-Touch' },
      { label: 'Lighting', value: 'Full Projector LED' },
      { label: 'Connectivity', value: 'Bluetooth & GPS Assist' }
    ]
  },

  // =========================================================================
  // ELECTRIC VEHICLES (VIDA - Powered by Hero MotoCorp)
  // =========================================================================
  {
    id: 'vida-v1-pro',
    name: 'Hero Vida V1 Pro',
    tagline: 'Electric Mobility Perfected - Powered by Hero MotoCorp',
    category: 'ev',
    mainType: 'ev',
    isBestSeller: true,
    badge: '165 km IDC Range | Fast DC Charge',
    badgeColor: 'bg-emerald-600 text-white',
    image: vidaImg,
    features: [
      'Dual removable high-density lithium-ion batteries (3.94 kWh) with IP67 water/dust proofing',
      'Fast DC charging compatible with 2,500+ Vida and partner charging stations (0 to 80% in 65 mins)',
      '7-inch full-colour interactive TFT touchscreen with customizable widgets, 4G eSIM & OTA updates',
      'Custom Riding Mode in addition to Sport, Ride, and Eco modes with adjustable regenerative braking',
      'Keyless ignition with smart NFC key-fob band and remote smartphone vehicle control',
      'Electronic 2-way throttle with reverse assist mode for effortless parking in tight spots',
      'Hero SOS emergency alert button with real-time GPS live tracking and geofencing anti-theft',
      'Cruise control for fatigue-free highway touring and 26-litre modular split underseat storage'
    ],
    specs: {
      engine: 'PMSM Electric Motor | Peak Power: 6.0 kW (8.15 PS) | Instant Torque: 25 Nm',
      mileage: '165 km (Certified IDC Range) | 110 km True Real-World Range',
      power: '6.0 kW Peak Power | Top Speed: 80 km/h | 0 to 40 km/h in 3.2s',
      fuelTank: '3.94 kWh Removable Dual Battery Pack (IP67 certified)',
      transmission: 'Direct Drive Automatic with Reverse Mode',
      brakes: 'Front: 190 mm Disc | Rear: 130 mm Drum with Combined Braking System (CBS) & Electronic Regen',
      colours: ['Matte White', 'Matte Sports Red', 'Matte Abrax Orange', 'Gloss Black']
    },
    variants: [
      { name: 'Vida V1 Pro Flagship', difference: '3.94 kWh battery, 165 km range, 7" TFT touchscreen, fast charging, keyless start' }
    ],
    description: 'The Hero Vida V1 Pro is Hero MotoCorp’s premium electric flagship. Featuring dual removable batteries that can be charged inside your apartment, a 7-inch connected touchscreen, and blistering 0-40 km/h in 3.2s.',
    highlights: [
      { label: 'Certified Range', value: '165 km IDC (110 km Real)' },
      { label: '0-40 km/h', value: '3.2 Seconds' },
      { label: 'Battery Pack', value: '3.94 kWh Dual Removable' },
      { label: 'Fast Charge', value: '0-80% in 65 mins' }
    ]
  },
  {
    id: 'vida-v1-plus',
    name: 'Hero Vida V1 Plus',
    tagline: 'Smart Clean Electric Commuting with Removable Batteries',
    category: 'ev',
    mainType: 'ev',
    badge: '143 km Certified Range',
    badgeColor: 'bg-teal-600 text-white',
    image: vidaImg,
    features: [
      'Dual removable modular lithium-ion battery system (3.44 kWh) for easy home socket charging',
      'Fast DC charging capability providing 0 to 80% charge in just 55 minutes at public fast chargers',
      '7-inch responsive TFT interactive display with smartphone Bluetooth sync and 4G telematics',
      '3 distinct riding modes: Eco, Ride, and Sport with regenerative deceleration coasting',
      'Reverse assist mode allowing easy backward parking on inclines and crowded parking lots',
      'Follow-me-home LED projector headlights with ambient light detection and LED position guides',
      '26-litre illuminated split underseat storage capacity accommodating groceries and helmets',
      'High-strength lightweight steel trellis chassis offering responsive handling and 170mm ground clearance'
    ],
    specs: {
      engine: 'PMSM High-Efficiency Electric Motor | Peak Power: 6.0 kW | Instant Torque: 25 Nm',
      mileage: '143 km (Certified IDC Range) | 100 km True Real-World Range',
      power: '6.0 kW Peak Power | Top Speed: 80 km/h | 0 to 40 km/h in 3.4s',
      fuelTank: '3.44 kWh Removable Dual Battery Pack (IP67 certified)',
      transmission: 'Direct Drive Automatic with Reverse Assist',
      brakes: 'Front: 190 mm Disc | Rear: 130 mm Drum with CBS & Regenerative Braking',
      colours: ['Matte White', 'Sports Red', 'Gloss Black']
    },
    variants: [
      { name: 'Vida V1 Plus Standard', difference: '3.44 kWh dual removable batteries, 143 km IDC range, 7" TFT display' }
    ],
    description: 'The Hero Vida V1 Plus delivers accessible premium electric performance. Dual removable batteries mean you never need a dedicated ground-floor parking charger—simply bring the battery pack to any standard 15A wall socket.',
    highlights: [
      { label: 'Certified Range', value: '143 km IDC (100 km Real)' },
      { label: 'Top Speed', value: '80 km/h' },
      { label: 'Battery Capacity', value: '3.44 kWh Dual Removable' },
      { label: 'Fast Charge', value: '0-80% in 55 mins' }
    ]
  },
  {
    id: 'vida-v1-lite',
    name: 'Hero Vida V1 Lite / V2',
    tagline: 'Everyday Urban Electric Mobility by Hero MotoCorp',
    category: 'ev',
    mainType: 'ev',
    isNewLaunch: true,
    badge: 'Affordable EV Mobility',
    badgeColor: 'bg-cyan-700 text-white',
    image: vidaImg,
    features: [
      'Accessible urban electric mobility engineered on Hero’s proven, durable electric vehicle architecture',
      'Compact removable 2.9 kWh high-density lithium-ion battery pack for convenient home socket charging',
      'Digital instrument console with Bluetooth smartphone pairing and navigation assistance',
      'Regenerative braking system recapturing kinetic energy during city deceleration to extend range',
      'Sturdy high-tensile steel frame with generous 170mm ground clearance built for Indian roads',
      'Multiple riding modes (Eco & City) tailored for optimized battery longevity and range',
      'All-LED lighting package with signature front daytime running lights and wide tail lamp',
      'Comprehensive 5-year battery warranty and 3-year vehicle warranty supported by Hero dealer network'
    ],
    specs: {
      engine: 'PMSM High-Efficiency Motor | Peak Power: 5.2 kW | Torque: 20 Nm',
      mileage: '120 km (Certified IDC Range) | 85 km True Real-World Range',
      power: '5.2 kW Peak Power | Top Speed: 75 km/h | 0 to 40 km/h in 3.9s',
      fuelTank: '2.9 kWh High-Density Lithium-Ion Pack (IP67 certified)',
      transmission: 'Direct Drive Automatic',
      brakes: 'Front: 190 mm Disc | Rear: 130 mm Drum with Combined Braking System (CBS)',
      colours: ['Cyber White', 'Neon Red', 'Graphite Grey']
    },
    variants: [
      { name: 'Vida V1 Lite / V2 Standard', difference: '2.9 kWh removable pack, 120 km IDC range, digital cluster, CBS' }
    ],
    description: 'The Vida V1 Lite brings Hero MotoCorp’s electric engineering into the mainstream price territory. With a durable removable battery and low operational running costs of under ₹0.25 per km, it is the smart choice for daily city commutes.',
    highlights: [
      { label: 'Certified Range', value: '120 km IDC (85 km Real)' },
      { label: 'Running Cost', value: '< ₹0.25 / km' },
      { label: 'Warranty', value: '5-Year Battery Warranty' },
      { label: 'Charging', value: 'Standard 15A Home Socket' }
    ]
  }
];

export const CATEGORY_LABELS: Record<string, { title: string; subtitle: string }> = {
  all: {
    title: 'All Hero Vehicles',
    subtitle: 'Explore the complete world-class motorcycle and scooter lineup from Hero MotoCorp.'
  },
  bikes: {
    title: 'Hero Motorcycles',
    subtitle: 'From India’s most trusted 100cc commuters to 440cc roadsters and supersports.'
  },
  scooters: {
    title: 'Hero Scooters',
    subtitle: 'Feature-packed, stylish automatic scooters built for maximum comfort and agility.'
  },
  ev: {
    title: 'Hero Electric Vehicles (VIDA)',
    subtitle: 'Zero-emission smart electric two-wheelers powered by Hero MotoCorp engineering.'
  },
  commuter: {
    title: 'Commuter Motorcycles',
    subtitle: 'Everyday reliability, proven xSens fuel injection, and unmatched fuel efficiency.'
  },
  premium: {
    title: 'Premium & Street Motorcycles',
    subtitle: '125cc to 440cc street roadsters with Bluetooth connectivity and superior highway cruising.'
  },
  sports: {
    title: 'Sports & Performance Motorcycles',
    subtitle: 'Aggressive streetfighters and supersports tuned for lightning acceleration and track handling.'
  }
};

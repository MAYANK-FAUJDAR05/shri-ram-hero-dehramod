import { HERO_MASTER_CATEGORIES, HeroMasterPartItem } from './heroMasterPartsCategories';

export interface CategoryFamilyDef {
  catId: number;
  catName: string;
  prefix: string;
  families: string[];
}

export const CATEGORY_DEFINITIONS: CategoryFamilyDef[] = [
  {
    catId: 1,
    catName: 'Engine & Performance',
    prefix: '01',
    families: [
      'Piston', 'Piston Ring Set', 'Cylinder Block', 'Crankshaft', 'Crank Case',
      'Camshaft', 'Cam Chain / Timing Chain', 'Rocker Arm', 'Engine Valves',
      'Oil Pump Assembly', 'Engine Bearing', 'Gasket', 'Spark Plug',
      'Air Cleaner / Air Filter', 'Engine-related Fasteners', 'Other verified engine parts'
    ],
  },
  {
    catId: 2,
    catName: 'Transmission & Drive',
    prefix: '02',
    families: [
      'Main Shaft Gear', 'Counter Shaft Gear', 'Primary Drive Gear', 'Gear Shift Fork',
      'Gear Shift Spindle', 'Kickstarter Spindle', 'Transmission Bearing Kit',
      'Shift Drum Assembly', 'Drive Sprocket', 'Other transmission parts'
    ],
  },
  {
    catId: 3,
    catName: 'Brakes & Wheels',
    prefix: '03',
    families: [
      'Brake Shoe Set', 'Brake Pad Set (Front Disc)', 'Brake Drum Rear', 'Brake Disc Plate',
      'Rear Brake Panel', 'Brake Cam & Lever', 'Brake Return Spring', 'Wheel Hub Front',
      'Wheel Hub Rear', 'Wheel Rim / Alloy Wheel', 'Axle Shaft', 'Wheel Bearing Kit'
    ],
  },
  {
    catId: 4,
    catName: 'Electrical, Lighting & Horns',
    prefix: '04',
    families: [
      'Wiring Harness', 'Ignition Coil / Cap', 'RR Unit / Regulator Rectifier', 'CDI / ECU Unit',
      'Starter Motor Assembly', 'Starter Relay', 'Stator Coil Plate', 'Battery 12V Maintenance Free',
      'Headlight Assembly', 'Tail Light Assembly', 'Winker / Indicator (Set/Individual)',
      'Horn Assembly 12V', 'Neutral / Gear Position Switch', 'Other electrical components'
    ],
  },
  {
    catId: 5,
    catName: 'Suspension & Steering',
    prefix: '05',
    families: [
      'Front Fork Pipe (Inner/Outer)', 'Fork Oil Seal Kit', 'Fork Spring', 'Ball Racer Kit (Steering Head)',
      'Steering Stem Under Bracket', 'Handle Weight & Bar', 'Rear Shock Absorber / Cushion Assembly',
      'Swing Arm Assembly', 'Swing Arm Bush Kit', 'Rear Damper Rubber Kit'
    ],
  },
  {
    catId: 6,
    catName: 'Fuel & Lubrication System',
    prefix: '06',
    families: [
      'Engine Oil 4T Plus 10W-30', 'Oil Filter / Strainer Screen', 'Centrifugal Oil Filter Rotor',
      'Engine Oil Dipstick & O-Ring', 'Oil Drain Bolt & Washer', 'Breather Tube Assembly',
      'Lubrication Oil Pipe', 'Oil Seal Kit Complete'
    ],
  },
  {
    catId: 7,
    catName: 'Fuel System',
    prefix: '07',
    families: [
      'Carburetor Assembly', 'Carburetor Repair / Jet Kit', 'Fuel Cock Assembly (Petcock)',
      'Fuel Feed Hose / Pipe', 'Fuel Filter Inline', 'Throttle Body Fi Assembly',
      'Fuel Injector Nozzle', 'Charcoal Canister / EVAP Purge Valve'
    ],
  },
  {
    catId: 8,
    catName: 'Exhaust System',
    prefix: '08',
    families: [
      'Silencer / Muffler Assembly', 'Silencer Cover / Heat Shield', 'Exhaust Muffler Gasket',
      'Exhaust Pipe Stud & Nut', 'Catalytic Converter Joint Pipe', 'Silencer Rubber Mounting Buffer'
    ],
  },
  {
    catId: 9,
    catName: 'Body Parts',
    prefix: '09',
    families: [
      'Front Visor / Cowl', 'Headlight Fairing Mask', 'Fuel Tank Side Shrouds', 'Side Cover LH',
      'Side Cover RH', 'Tail Cowl / Rear Fairing Center', 'Chain Case / Cover Assembly',
      'Tool Box / Battery Box Cover', 'Rear Inner Fender', 'Front Number Plate Bracket',
      'Rear License Plate Bracket', 'Storage Box Assembly'
    ],
  },
  {
    catId: 10,
    catName: 'Styling & Protection',
    prefix: '10',
    families: [
      'Leg Guard / Crash Guard', 'Saree Guard LH', 'Rear Luggage Carrier / Grab Rail',
      'Tank Pad Protector', 'Grip Cover Set', 'Seat Assembly Complete', 'Seat Cover Genuine',
      'All-Weather Bike Body Cover'
    ],
  },
  {
    catId: 11,
    catName: 'Cables',
    prefix: '11',
    families: [
      'Clutch Cable', 'Throttle / Accelerator Cable', 'Front Brake Cable', 'Rear Brake Cable',
      'Speedometer Cable', 'Choke Cable', 'Seat Lock Cable', 'Reverse / Sensor Wiring Cable'
    ],
  },
  {
    catId: 12,
    catName: 'Gears & Gear Shift Parts',
    prefix: '12',
    families: [
      'Gear Shift Pedal / Lever', 'Gear Shift Spindle Shaft', 'Gear Shift Return Spring',
      'Gear Shift Fork (Right/Left)', 'Shift Cam / Drum Stopper', '1st & 2nd Main Gear',
      '3rd & 4th Counter Gear', 'Reverse Drive Gear (Scooters)'
    ],
  },
  {
    catId: 13,
    catName: 'Clutch Parts',
    prefix: '13',
    families: [
      'Clutch Plate Set (Friction)', 'Clutch Steel Plate Set', 'Clutch Center Hub',
      'Clutch Pressure Plate', 'Clutch Outer Housing (Basket)', 'Clutch Spring Set',
      'Clutch Release Bearing & Lifter Pin', 'Centrifugal Clutch Shoe (Scooters)'
    ],
  },
  {
    catId: 14,
    catName: 'Chain & Sprocket Parts',
    prefix: '14',
    families: [
      'Drive Chain (Roll/Loop)', 'Rear Driven Sprocket', 'Front Engine Drive Sprocket',
      'Chain Sprocket Kit Complete', 'Chain Master Link Clip', 'Chain Adjuster Bolt LH/RH',
      'Chain Guide Slider Rubber', 'Drive Belt V-Belt (Scooters)'
    ],
  },
  {
    catId: 15,
    catName: 'Engine Valves',
    prefix: '15',
    families: [
      'Intake Valve', 'Exhaust Valve', 'Valve Spring Set (Inner/Outer)',
      'Valve Stem Oil Seal', 'Valve Cotter / Lock Pair', 'Valve Guide (Intake/Exhaust)'
    ],
  },
  {
    catId: 16,
    catName: 'Camshaft & Cam Chain',
    prefix: '16',
    families: [
      'Camshaft Assembly', 'Cam Sprocket Timing Wheel', 'Cam Chain / Timing Chain Loop',
      'Cam Chain Tensioner Assembly', 'Cam Chain Tensioner Lifter', 'Cam Chain Guide Roller & Slipper'
    ],
  },
  {
    catId: 17,
    catName: 'Crankshaft & Crank Case',
    prefix: '17',
    families: [
      'Crankshaft Assembly Complete', 'Connecting Rod Kit', 'Crankcase LH', 'Crankcase RH',
      'Crankshaft Main Ball Bearing', 'Crankcase Breather Plate'
    ],
  },
  {
    catId: 18,
    catName: 'Cylinder & Piston Parts',
    prefix: '18',
    families: [
      'Cylinder Block Body', 'Piston Standard Size', 'Piston Oversize (0.25/0.50)',
      'Piston Ring Set Std', 'Piston Gudgeon Pin', 'Piston Pin Circlip Pair'
    ],
  },
  {
    catId: 19,
    catName: 'Gasket & Sealing Parts',
    prefix: '19',
    families: [
      'Cylinder Head Gasket', 'Cylinder Base Gasket', 'Clutch Cover Gasket',
      'Magneto / Generator Cover Gasket', 'Crankcase Center Gasket', 'Tappet / Valve Cover O-Ring',
      'Complete Engine Gasket Kit', 'Oil Seal Kit (Full Engine Set)'
    ],
  },
  {
    catId: 20,
    catName: 'Bearing Parts',
    prefix: '20',
    families: [
      'Crankshaft Main Bearing', 'Gearbox Countershaft Bearing', 'Clutch Release Bearing',
      'Wheel Bearing 6301/6201', 'Steering Cone & Ball Bearing Set', 'Needle Roller Bearing',
      'Swing Arm Pivot Bush Bearing', 'Engine Bearing Kit Complete'
    ],
  },
  {
    catId: 21,
    catName: 'Filter Parts',
    prefix: '21',
    families: [
      'Air Cleaner Element (Foam/Paper)', 'Secondary Air Filter Sponge', 'Engine Oil Strainer Screen',
      'Fuel Tank In-Line Mesh Filter', 'Air Cleaner Filter Kit Complete', 'High-Flow Air Cleaner Duct'
    ],
  },
  {
    catId: 22,
    catName: 'Fuel Pump & Fuel Tank Parts',
    prefix: '22',
    families: [
      'Electric Fuel Pump Assembly (Fi)', 'Fuel Pump Sub-Assembly Unit', 'Fuel Tank Cap with Key',
      'Fuel Tank Sensor / Gauge Unit', 'Fuel Cock Assembly (Res/On/Off)', 'Fuel Tank Mounting Rubber Damper',
      'Fuel Tank Spill Tube', 'Fuel Filler Neck Gasket'
    ],
  },
  {
    catId: 23,
    catName: 'Alternator / Generator Parts',
    prefix: '23',
    families: [
      'Magneto Flywheel Rotor', 'Stator Coil Comp (Alternator)', 'Pulsar / Pickup Coil Unit',
      'Starter One-Way Clutch Assembly', 'Generator Cover LH', 'Rotor Holding Bolt & Key'
    ],
  },
  {
    catId: 24,
    catName: 'Battery & Electrical Parts',
    prefix: '24',
    families: [
      '12V 4Ah Maintenance-Free Battery', '12V 5Ah Maintenance-Free Battery', 'Starter Solenoid Relay Switch',
      'Main Fuse Box & 10A/15A Fuses', 'Spark Plug Cap Water-Proof', 'High-Tension Ignition Wire',
      'Side Stand Engine Cut-Off Relay', 'i3S Stop-Start Smart Unit'
    ],
  },
  {
    catId: 25,
    catName: 'Switches & Sensors',
    prefix: '25',
    families: [
      'Handlebar Switch Assembly LH (Dimmer/Horn/Winker)', 'Handlebar Switch Assembly RH (Self/i3S/Kill)',
      'Front Stop Light Switch', 'Rear Brake Pedal Stop Switch', 'Neutral Gear Switch',
      'Engine Oil Temperature Sensor (Fi)', 'O2 Oxygen Sensor (Exhaust)', 'Speedometer Speed Sensor'
    ],
  },
  {
    catId: 26,
    catName: 'Lights & Indicators',
    prefix: '26',
    families: [
      'Headlight Sealed Beam / LED Reflector', 'Headlamp Halogen Bulb 12V 35/35W', 'Tail Light Lens Red',
      'Tail/Stop Lamp Bulb 12V 21/5W', 'Front Indicator Assembly LH/RH', 'Rear Indicator Assembly LH/RH',
      'Indicator Amber Bulb 12V 10W', 'License Number Plate Illumination Lamp'
    ],
  },
  {
    catId: 27,
    catName: 'Horn Parts',
    prefix: '27',
    families: [
      'Electric Horn 12V Low Tone', 'Electric Horn 12V High Tone',
      'Horn Mounting Bracket', 'Horn Terminal Connecting Harness'
    ],
  },
  {
    catId: 28,
    catName: 'Lock & Security Parts',
    prefix: '28',
    families: [
      'Ignition Key Switch with Shutter', 'Steering Handle Lock', 'Fuel Tank Cap Key Lock',
      'Side Cover / Tool Box Lock', 'Seat Latch & Key Lock Assembly', 'Complete Key Lock Set (Matched)'
    ],
  },
  {
    catId: 29,
    catName: 'Mirror Parts',
    prefix: '29',
    families: [
      'Rear View Mirror Left Hand', 'Rear View Mirror Right Hand (Reverse Thread)',
      'Mirror Adapter Nut LH/RH', 'Mirror Rubber Boot Collar'
    ],
  },
  {
    catId: 30,
    catName: 'Handle / Steering Parts',
    prefix: '30',
    families: [
      'Steering Handle Pipe Bare', 'Clutch Lever with Pivot Bracket', 'Front Brake Lever Alloy',
      'Throttle Grip Rubber RH', 'Handle Dummy Grip Rubber LH', 'Handle Bar Balance Weight (Pair)',
      'Handle Upper Clamp Holder Set', 'Steering Stem Nut & Washer'
    ],
  },
  {
    catId: 31,
    catName: 'Fork & Front Suspension Parts',
    prefix: '31',
    families: [
      'Front Fork Pipe LH', 'Front Fork Pipe RH', 'Front Fork Oil Seal Pair',
      'Front Fork Dust Seal Pair', 'Front Cushion Spring Inner', 'Front Fork Bottom Case LH/RH',
      'Front Fork Piston Ring & Seat', 'Front Fork Complete Set'
    ],
  },
  {
    catId: 32,
    catName: 'Rear Suspension / Shock Absorber Parts',
    prefix: '32',
    families: [
      'Rear Shock Absorber / Cushion LH', 'Rear Shock Absorber / Cushion RH',
      'Rear Cushion Upper Bush', 'Rear Cushion Lower Mount Bolt',
      '5-Step Adjustable Preload Tool', 'Rear Monoshock Assembly (Xpulse/Xtreme)'
    ],
  },
  {
    catId: 33,
    catName: 'Mudguard / Fender Parts',
    prefix: '33',
    families: [
      'Front Mudguard Fender (Color Match)', 'Front Mudguard Fender Support Stay',
      'Rear Mudguard Fender Upper (Painted)', 'Rear Mudguard Fender Lower (Matte Black)',
      'Front Mudflap Rubber Extension', 'Mudguard Grommet & Bolt Kit'
    ],
  },
  {
    catId: 34,
    catName: 'Footrest Parts',
    prefix: '34',
    families: [
      'Rider Main Footrest Bar', 'Rider Footrest Rubber LH', 'Rider Footrest Rubber RH',
      'Pillion Foldable Step LH', 'Pillion Foldable Step RH', 'Pillion Footrest Hanger Bracket'
    ],
  },
  {
    catId: 35,
    catName: 'Stand Parts',
    prefix: '35',
    families: [
      'Centre Stand / Main Stand Comp', 'Side Stand / Kickstand Comp',
      'Main Stand Pivot Shaft', 'Main Stand Dual Spring', 'Side Stand Return Spring',
      'Side Stand Engine Cut-Off Magnetic Sensor'
    ],
  },
  {
    catId: 36,
    catName: 'Wheel Parts',
    prefix: '36',
    families: [
      'Alloy Wheel Front (Black/Silver)', 'Alloy Wheel Rear (Black/Silver)', 'Spoke Wheel Front Assembly',
      'Wheel Axle Bolt Front with Castle Nut', 'Wheel Axle Bolt Rear with Castle Nut',
      'Wheel Bearing Distance Spacer', 'Tubeless Tyre Valve Stem Rubber', 'Spoke & Nipple Set Complete'
    ],
  },
  {
    catId: 37,
    catName: 'Brake Shoe / Brake Pad Parts',
    prefix: '37',
    families: [
      'Front Brake Shoe Kit with Springs', 'Rear Brake Shoe Kit with Springs',
      'Front Disc Brake Pad Set Sintered', 'Rear Disc Brake Pad Set',
      'Brake Disc Rotor Mounting Bolt Kit', 'Brake Shoe / Brake Pad Kit Complete'
    ],
  },
  {
    catId: 38,
    catName: 'Brake Cable & Brake Control Parts',
    prefix: '38',
    families: [
      'Front Drum Brake Cable Assembly', 'Rear Brake Rod with Wing Nut',
      'Integrated Braking System (IBS) Equalizer Link', 'IBS Delay Valve Spring Assembly',
      'Disc Brake Master Cylinder Major Kit', 'Disc Brake Caliper Piston & Seal Kit'
    ],
  },
  {
    catId: 39,
    catName: 'Speedometer Parts',
    prefix: '39',
    families: [
      'Speedometer Meter Assembly (Analog)', 'Speedometer Digilog LCD Cluster (XTEC)',
      'Speedometer Glass Lens Cover', 'Speedometer Gearbox Drive Gear (Wheel Hub)',
      'Speedometer Cable Inner Core', 'Meter Illumination Bulb Socket'
    ],
  },
  {
    catId: 40,
    catName: 'Silencer / Exhaust Parts',
    prefix: '40',
    families: [
      'Silencer Pipe Assembly Matt Black', 'Muffler Shield Chrome Plated',
      'Exhaust Joint Clamping Band', 'O2 Sensor Threaded Boss Ring',
      'Exhaust Gasket Copper Beaded Ring', 'Silencer Tail Cap Accent Trim'
    ],
  },
  {
    catId: 41,
    catName: 'Wiring Harness & Electrical Wiring',
    prefix: '41',
    families: [
      'Main Wiring Harness Loom', 'Sub-Harness Headlight & Meter',
      'Sub-Harness Tail Lamp & Indicators', 'Battery Earth Ground Cable',
      'ECU / Sensor Coupler Adapter', 'Waterproof Heatshrink Wiring Repair Kit'
    ],
  },
  {
    catId: 42,
    catName: 'Fasteners',
    prefix: '42',
    families: [
      'Flange Hex Bolt M6x12 to M6x35 Assortment', 'Flange Hex Bolt M8x20 to M8x50 Assortment',
      'Crankcase Specialty Stud Bolt Set', 'Phillips Pan Head Screw Set',
      'Self-Tapping Body Cowl Screws with Washers', 'U-Nut Clip 4mm/5mm Set',
      'Alloy Wheel Disc Rotor Torx Bolts', 'Exhaust Stud Nut Brass/Steel'
    ],
  },
  {
    catId: 43,
    catName: 'Kits & Assemblies',
    prefix: '43',
    families: [
      'Chain Sprocket Kit (Drive Chain + Front/Rear Sprocket)', 'Brake Shoe / Brake Pad Kit Complete',
      'Ball Racer Kit (Top/Bottom Cones & Bearing Balls)', 'Air Cleaner Filter Kit',
      'Complete Engine Gasket Overhaul Kit', 'Engine Oil Seal Full Dealership Kit',
      'Clutch Overhaul Kit (Friction + Steel Plates)', 'Key Lock Set Matched Assembly'
    ],
  },
  {
    catId: 44,
    catName: 'Engine Repair Kits',
    prefix: '44',
    families: [
      'Engine Cylinder Block Kit (Block + Piston + Rings)', 'Cam Chain Kit (Chain + Tensioner + Guides)',
      'Engine Valve Overhaul Kit (Valves + Springs + Seals)', 'Crankshaft Overhaul Bearing Kit',
      'Oil Pump Rebuild Kit', 'Decompressor Camshaft Assembly Kit'
    ],
  },
  {
    catId: 45,
    catName: 'Other Genuine Spare Parts',
    prefix: '45',
    families: [
      'Genuine Hero Engine Oil 4T Plus 900ml', 'Hero Chain Lube Spray Can 150ml',
      'Hero Chain Cleaner Spray Can 150ml', 'Dot-4 Brake Fluid Can 100ml',
      'Front Fork Shocker Oil Can 175ml', 'Hero Touch-up Paint Pen & Polish'
    ],
  },
];

// Generate the complete numbered master parts list
export function generateHeroMasterPartsList(): HeroMasterPartItem[] {
  const list: HeroMasterPartItem[] = [];
  let globalSrNo = 1;

  for (const cat of CATEGORY_DEFINITIONS) {
    cat.families.forEach((familyName, index) => {
      const familyCode = (index + 1).toString().padStart(2, '0');
      const categoryNo = `${cat.prefix}.${familyCode}`;

      // Default rack assignments based on category prefix
      const rackShelf = `A-${cat.prefix}`;

      list.push({
        srNo: globalSrNo,
        categoryNo,
        categoryName: cat.catName,
        categoryId: cat.catId,
        partName: familyName,
        partFamily: familyName,
        modelCompatibility: 'Model specific',
        verifiedPartNumber: '-', // Rule: Never invent unverified SKUs. Show '-' until verified from e-catalogue.
        stockQty: 0,
        minimumStock: 1,
        rackShelfNo: rackShelf,
        status: 'Out of Stock',
        notes: '-',
      });

      globalSrNo++;
    });
  }

  return list;
}

export const INITIAL_HERO_MASTER_PARTS = generateHeroMasterPartsList();

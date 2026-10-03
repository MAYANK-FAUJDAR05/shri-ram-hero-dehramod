export interface HeroMasterPartItem {
  srNo: number;
  categoryNo: string; // e.g., "01.01"
  categoryName: string; // e.g., "Engine & Performance"
  categoryId: number; // 1 to 45
  partName: string;
  partFamily: string;
  modelCompatibility: string;
  verifiedPartNumber: string; // "-" or verified Hero SKU e.g. 17211-KCC-9000
  stockQty: number;
  minimumStock: number;
  rackShelfNo: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  notes: string;
}

export const HERO_MASTER_CATEGORIES: { id: number; name: string; prefix: string; count: number }[] = [
  { id: 1, name: 'Engine & Performance', prefix: '01', count: 16 },
  { id: 2, name: 'Transmission & Drive', prefix: '02', count: 10 },
  { id: 3, name: 'Brakes & Wheels', prefix: '03', count: 12 },
  { id: 4, name: 'Electrical, Lighting & Horns', prefix: '04', count: 14 },
  { id: 5, name: 'Suspension & Steering', prefix: '05', count: 10 },
  { id: 6, name: 'Fuel & Lubrication System', prefix: '06', count: 8 },
  { id: 7, name: 'Fuel System', prefix: '07', count: 8 },
  { id: 8, name: 'Exhaust System', prefix: '08', count: 6 },
  { id: 9, name: 'Body Parts', prefix: '09', count: 12 },
  { id: 10, name: 'Styling & Protection', prefix: '10', count: 8 },
  { id: 11, name: 'Cables', prefix: '11', count: 8 },
  { id: 12, name: 'Gears & Gear Shift Parts', prefix: '12', count: 8 },
  { id: 13, name: 'Clutch Parts', prefix: '13', count: 8 },
  { id: 14, name: 'Chain & Sprocket Parts', prefix: '14', count: 8 },
  { id: 15, name: 'Engine Valves', prefix: '15', count: 6 },
  { id: 16, name: 'Camshaft & Cam Chain', prefix: '16', count: 6 },
  { id: 17, name: 'Crankshaft & Crank Case', prefix: '17', count: 6 },
  { id: 18, name: 'Cylinder & Piston Parts', prefix: '18', count: 6 },
  { id: 19, name: 'Gasket & Sealing Parts', prefix: '19', count: 8 },
  { id: 20, name: 'Bearing Parts', prefix: '20', count: 8 },
  { id: 21, name: 'Filter Parts', prefix: '21', count: 6 },
  { id: 22, name: 'Fuel Pump & Fuel Tank Parts', prefix: '22', count: 8 },
  { id: 23, name: 'Alternator / Generator Parts', prefix: '23', count: 6 },
  { id: 24, name: 'Battery & Electrical Parts', prefix: '24', count: 8 },
  { id: 25, name: 'Switches & Sensors', prefix: '25', count: 8 },
  { id: 26, name: 'Lights & Indicators', prefix: '26', count: 8 },
  { id: 27, name: 'Horn Parts', prefix: '27', count: 4 },
  { id: 28, name: 'Lock & Security Parts', prefix: '28', count: 6 },
  { id: 29, name: 'Mirror Parts', prefix: '29', count: 4 },
  { id: 30, name: 'Handle / Steering Parts', prefix: '30', count: 8 },
  { id: 31, name: 'Fork & Front Suspension Parts', prefix: '31', count: 8 },
  { id: 32, name: 'Rear Suspension / Shock Absorber Parts', prefix: '32', count: 6 },
  { id: 33, name: 'Mudguard / Fender Parts', prefix: '33', count: 6 },
  { id: 34, name: 'Footrest Parts', prefix: '34', count: 6 },
  { id: 35, name: 'Stand Parts', prefix: '35', count: 6 },
  { id: 36, name: 'Wheel Parts', prefix: '36', count: 8 },
  { id: 37, name: 'Brake Shoe / Brake Pad Parts', prefix: '37', count: 6 },
  { id: 38, name: 'Brake Cable & Brake Control Parts', prefix: '38', count: 6 },
  { id: 39, name: 'Speedometer Parts', prefix: '39', count: 6 },
  { id: 40, name: 'Silencer / Exhaust Parts', prefix: '40', count: 6 },
  { id: 41, name: 'Wiring Harness & Electrical Wiring', prefix: '41', count: 6 },
  { id: 42, name: 'Fasteners', prefix: '42', count: 8 },
  { id: 43, name: 'Kits & Assemblies', prefix: '43', count: 8 },
  { id: 44, name: 'Engine Repair Kits', prefix: '44', count: 6 },
  { id: 45, name: 'Other Genuine Spare Parts', prefix: '45', count: 6 },
];

export type VehicleType = 'Motorcycle' | 'Scooter';

export type VehicleStatus =
  | 'In Stock'
  | 'Reserved'
  | 'Sold'
  | 'Delivered'
  | 'On Hold'
  | 'Demo Vehicle'
  | 'Service / Workshop'
  | 'Transfer Pending';

export interface VehicleRecord {
  id: string;
  stockId: string; // e.g. "VH-0001", permanently unique, never reused
  vehicleType: VehicleType;
  modelName: string;
  variant: string;
  colour: string;
  modelYear: number;
  chassisNumber: string; // SENSITIVE - Admin only
  engineNumber: string; // SENSITIVE - Admin only
  keyNumber: string; // SENSITIVE - Admin only
  quantity: number; // 1 for individual vehicle
  arrivalDate: string; // YYYY-MM-DD
  purchaseDate: string; // YYYY-MM-DD (Stock entry date)
  status: VehicleStatus;
  storageLocation: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface VehicleStockHistoryRecord {
  id: string;
  vehicleId: string;
  stockId: string;
  modelName: string;
  variant: string;
  colour: string;
  oldStatus: VehicleStatus | 'NEW_ENTRY' | 'DELETED';
  newStatus: VehicleStatus | 'DELETED';
  reason: string;
  adminUser: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  timestamp: string; // ISO
}

export interface VehicleModelSettingRecord {
  id: string;
  modelName: string;
  variant?: string;
  minimumStock: number;
  updatedAt: string;
  updatedBy: string;
}

export interface ModelStockSummary {
  modelName: string;
  variant: string;
  colour: string;
  vehicleType: VehicleType;
  totalCount: number;
  availableQty: number; // Status === 'In Stock'
  reservedQty: number;
  soldQty: number;
  deliveredQty: number;
  demoQty: number;
  onHoldQty: number;
  minimumStock: number;
  stockStatus: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
}

export interface VehicleStockStats {
  totalVehicles: number;
  inStock: number;
  reserved: number;
  sold: number;
  delivered: number;
  demo: number;
  onHold: number;
  serviceOrTransfer: number;
  motorcycles: number;
  scooters: number;
}

export interface PublicVehicleAvailability {
  modelName: string;
  availableQty: number;
  inStock: boolean;
  statusText: string;
}

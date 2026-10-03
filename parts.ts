export type UserRole = 'admin' | 'staff';

export type StockTransactionType =
  | 'stock_in'
  | 'stock_out'
  | 'adjustment'
  | 'customer_return'
  | 'supplier_return'
  | 'damage'
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'ADJUSTMENT'
  | 'CUSTOMER_RETURN'
  | 'SUPPLIER_RETURN'
  | 'DAMAGE';

export interface HeroPart {
  id: string;
  partNumber: string; // Official Hero Part No, e.g., 17211-KCC-9000
  partName: string; // e.g. Air Cleaner Filter
  category: string; // e.g. Engine Parts, Nut & Bolt, Brake, etc.
  subcategory: string; // e.g. Filter, Fasteners, Disc Pad
  applicableModels: string[]; // e.g. ["Splendor+", "HF Deluxe", "Glamour"]
  applicableModelVariant: string; // e.g. "All Variants", "BS6 Fi", "Drum / Cast"
  mrp: number | null; // Important: If null, displayed as "MRP Not Added". Never invent prices.
  purchasePrice: number | null;
  sellingPrice: number | null;
  openingStock: number;
  currentStock: number; // Calculated: Opening + In - Out + Adjustments
  minStockLevel: number;
  unit: string; // Pcs, Set, Pkt, Litre, Metre, Box
  rackNumber: string; // Rack A, Rack B, A-03
  shelfNumber: string; // Shelf 1, Shelf 2, Bin 12
  supplier: string;
  dateAdded: string; // YYYY-MM-DD
  lastUpdated: string; // YYYY-MM-DD HH:MM
  notes: string;
  partImage?: string;
  isArchived?: boolean;
}

export interface StockTransaction {
  id: string;
  partId: string;
  partNumber: string;
  partName: string;
  type: StockTransactionType;
  quantity: number; // Quantity transacted
  previousStock: number;
  newStock: number;
  user: string; // e.g. "Admin (Showroom Manager)" or "Staff (Counter 1)"
  userRole: UserRole;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  referenceNumber?: string; // Invoice / Delivery Challan / Job Card
  customerName?: string;
  vehicleRegNo?: string;
  jobCardNumber?: string;
  supplier?: string;
  purchasePrice?: number | null;
  sellingPrice?: number | null;
  reason?: string; // Reason for adjustment/return/damage
  notes?: string;
}

export interface PartCategory {
  id: string;
  name: string;
  description?: string;
  itemCount?: number;
}

export interface PartSupplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  gstNumber?: string;
  contactPerson?: string;
  notes?: string;
  dateAdded: string;
}

export type StockStatusFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'archived';

export interface PartImportRow {
  partNumber: string;
  partName: string;
  category: string;
  subcategory?: string;
  model?: string;
  variant?: string;
  mrp?: string | number;
  purchasePrice?: string | number;
  sellingPrice?: string | number;
  openingStock?: string | number;
  minimumStock?: string | number;
  unit?: string;
  rack?: string;
  shelf?: string;
  supplier?: string;
  notes?: string;
  status: 'valid' | 'invalid' | 'duplicate';
  errors: string[];
}

export interface BikeRecord {
  id: string;
  registrationNumber: string; // e.g. RJ05AB1234 (normalized uppercase, no spaces)
  chassisNumber: string;
  engineNumber: string;
  bikeModel: string;
  customerName: string;
  customerMobile: string;
  jobCardNumber?: string;
  odometerReading?: number;
  lastServiceDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartInstallation {
  id: string;
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  bikeId?: string;
  registrationNumber: string;
  chassisNumber?: string;
  engineNumber?: string;
  bikeModel: string;
  customerName: string;
  customerMobile: string;
  jobCardNumber: string;
  installationTimestamp: string; // ISO 8601
  installationDate: string; // YYYY-MM-DD
  installationTime: string; // HH:MM:SS
  mechanicName: string;
  odometerReading?: number;
  remarks?: string;
  enteredById: string;
  enteredByName: string;
  sellingPrice?: number | null;
  idempotencyKey?: string;
  createdAt: string;
}

export interface MechanicRecord {
  id: string;
  name: string;
  mobile: string;
  specialization?: string;
  isActive: boolean;
  createdAt: string;
}

export type MovementType =
  | 'PURCHASE'
  | 'INSTALLATION'
  | 'MANUAL_ADJUSTMENT'
  | 'RETURN'
  | 'CORRECTION';

export interface StockMovementRecord {
  id: string;
  partId: string;
  partNumber: string;
  partName: string;
  movementType: MovementType;
  quantityChange: number; // Positive or negative
  previousStock: number;
  newStock: number;
  referenceId?: string;
  jobCardNumber?: string;
  bikeRegistration?: string;
  mechanicName?: string;
  reason?: string;
  performedById: string;
  performedByName: string;
  createdAt: string;
}

export interface AntiTheftAuditLog {
  id: string;
  userId?: string;
  userName: string;
  userRole: string;
  actionType:
    | 'PART_ADDED'
    | 'PART_EDITED'
    | 'STOCK_INCREASED'
    | 'PART_INSTALLED'
    | 'STOCK_REDUCED'
    | 'INSTALLATION_EDITED'
    | 'RECORD_ARCHIVED'
    | 'SUPPLIER_CHANGED'
    | 'CORRECTION_ADJUSTMENT'
    | 'SYSTEM_INITIALIZATION'
    | 'ADMIN_LOGIN_2FA'
    | 'LOGIN_FAILED';
  partId?: string;
  partNumber?: string;
  partName?: string;
  oldQuantity?: number;
  newQuantity?: number;
  quantityDifference?: number;
  bikeNumber?: string;
  jobCardNumber?: string;
  reason?: string;
  timestamp: string;
  ip?: string;
  device?: string;
}


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useRef,
} from 'react';
import {
  HeroPart,
  StockTransaction,
  PartCategory,
  PartSupplier,
  UserRole,
  PartImportRow,
  BikeRecord,
  PartInstallation,
  MechanicRecord,
  StockMovementRecord,
} from '../types/parts';
import {
  INITIAL_HERO_PARTS,
  INITIAL_STOCK_TRANSACTIONS,
  INITIAL_SUPPLIERS,
  HERO_PART_CATEGORIES,
} from '../data/heroPartsData';
import * as XLSX from 'xlsx';

export interface UserSession {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  username: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

interface AddPartInput
  extends Omit<HeroPart, 'id' | 'currentStock' | 'dateAdded' | 'lastUpdated'> {
  openingStock: number;
}

interface StockInPayload {
  partId: string;
  quantity: number;
  purchasePrice?: number | null;
  supplier?: string;
  invoiceNumber?: string;
  date?: string;
  notes?: string;
}

interface StockOutPayload {
  partId: string;
  quantity: number;
  customerName?: string;
  vehicleRegNo?: string;
  jobCardNumber?: string;
  invoiceNumber?: string;
  sellingPrice?: number | null;
  date?: string;
  notes?: string;
}

interface StockAdjustmentPayload {
  partId: string;
  newQuantity: number;
  reason: string;
  date?: string;
  notes?: string;
}

interface ReturnPayload {
  partId: string;
  quantity: number;
  type: 'customer_return' | 'supplier_return';
  invoiceNumber?: string;
  reason: string;
  date?: string;
  notes?: string;
}

export interface InstallPartPayload {
  partId: string;
  quantity: number;
  bikeModel: string;
  registrationNumber: string;
  chassisNumber?: string;
  engineNumber?: string;
  customerName: string;
  customerMobile: string;
  jobCardNumber: string;
  installationDate?: string;
  installationTime?: string;
  mechanicName: string;
  odometerReading?: number;
  remarks?: string;
  sellingPrice?: number | null;
  idempotencyKey?: string;
}

interface PartsInventoryContextType {
  parts: HeroPart[];
  transactions: StockTransaction[];
  categories: string[];
  suppliers: PartSupplier[];
  auditLogs: AuditLog[];
  bikes: BikeRecord[];
  installations: PartInstallation[];
  stockMovements: StockMovementRecord[];
  mechanics: MechanicRecord[];

  currentUser: UserSession | null;
  token: string | null;
  userRole: UserRole;
  isAdmin: boolean;
  isStaff: boolean;
  isLoggedIn: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ) => Promise<{ success: boolean; error?: string }>;

  setUserRole: (role: UserRole) => void;

  isLiveConnected: boolean;
  lastSyncedAt: string;
  serverVersion: number;

  refreshInventory: () => Promise<void>;

  addPart: (
    input: AddPartInput
  ) => Promise<{ success: boolean; error?: string; part?: HeroPart }>;

  updatePart: (
    id: string,
    updates: Partial<HeroPart>
  ) => Promise<{ success: boolean; error?: string }>;

  archivePart: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;

  unarchivePart: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;

  stockIn: (
    payload: StockInPayload
  ) => Promise<{ success: boolean; error?: string }>;

  stockOut: (
    payload: StockOutPayload
  ) => Promise<{ success: boolean; error?: string }>;

  adjustStock: (
    payload: StockAdjustmentPayload
  ) => Promise<{ success: boolean; error?: string }>;

  correctStock: (
    partId: string,
    newQuantity: number,
    reason: string
  ) => Promise<{ success: boolean; error?: string }>;

  processReturn: (
    payload: ReturnPayload
  ) => Promise<{ success: boolean; error?: string }>;

  installPart: (
    payload: InstallPartPayload
  ) => Promise<{
    success: boolean;
    error?: string;
    installation?: PartInstallation;
  }>;

  fetchBikeHistory: (
    regNo: string
  ) => Promise<{
    success: boolean;
    bike?: BikeRecord;
    installations?: PartInstallation[];
    totalInstalledParts?: number;
    error?: string;
  }>;

  fetchPartHistory: (
    partId: string
  ) => Promise<{
    success: boolean;
    part?: HeroPart;
    installations?: PartInstallation[];
    movements?: StockMovementRecord[];
    transactions?: StockTransaction[];
    error?: string;
  }>;

  addMechanic: (
    name: string,
    mobile: string,
    specialization?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    mechanic?: MechanicRecord;
  }>;

  fetchReports: () => Promise<any>;

  getSupabaseStatus: () => Promise<any>;

  addCategory: (
    name: string
  ) => Promise<{ success: boolean; error?: string }>;

  deleteCategory: (
    name: string
  ) => Promise<{ success: boolean; error?: string }>;

  addSupplier: (
    supplier: Omit<PartSupplier, 'id' | 'dateAdded'>
  ) => Promise<{ success: boolean; error?: string }>;

  updateSupplier: (
    id: string,
    updates: Partial<PartSupplier>
  ) => Promise<{ success: boolean; error?: string }>;

  deleteSupplier: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;

  importPartsBatch: (
    rows: PartImportRow[],
    duplicateAction: 'update' | 'skip' | 'duplicate'
  ) => Promise<{
    importedCount: number;
    updatedCount: number;
    skippedCount: number;
    error?: string;
  }>;

  exportToExcel: (
    data: any[],
    fileName: string,
    sheetName?: string
  ) => void;

  exportToCsv: (data: any[], fileName: string) => void;

  backupDatabase: () => Promise<{
    success: boolean;
    error?: string;
    data?: any;
  }>;

  restoreDatabase: (
    jsonString: string
  ) => Promise<{ success: boolean; error?: string }>;

  resetToDefaults: () => Promise<void>;

  metrics: {
    totalParts: number;
    totalUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    stockInToday: number;
    stockOutToday: number;
    stockValuationMRP: number;
    stockValuationPurchase: number;
  };
}

const PartsInventoryContext =
  createContext<PartsInventoryContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'shri_ram_hero_auth_token_v3';

export const PartsInventoryProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [parts, setParts] =
    useState<HeroPart[]>(INITIAL_HERO_PARTS);

  const [transactions, setTransactions] =
    useState<StockTransaction[]>(INITIAL_STOCK_TRANSACTIONS);

  const [categories, setCategories] =
    useState<string[]>(HERO_PART_CATEGORIES);

  const [suppliers, setSuppliers] =
    useState<PartSupplier[]>(INITIAL_SUPPLIERS);

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([]);

  const [bikes, setBikes] =
    useState<BikeRecord[]>([]);

  const [installations, setInstallations] =
    useState<PartInstallation[]>([]);

  const [stockMovements, setStockMovements] =
    useState<StockMovementRecord[]>([]);

  const [mechanics, setMechanics] =
    useState<MechanicRecord[]>([]);

  const [serverVersion, setServerVersion] =
    useState<number>(1);

  const [lastSyncedAt, setLastSyncedAt] =
    useState<string>('Just now');

  const [isLiveConnected, setIsLiveConnected] =
    useState<boolean>(false);

  const [token, setToken] =
    useState<string | null>(() => {
      try {
        return sessionStorage.getItem(AUTH_STORAGE_KEY);
      } catch {
        return null;
      }
    });

  const [currentUser, setCurrentUser] =
    useState<UserSession | null>(null);

  const serverVersionRef =
    useRef<number>(1);

  serverVersionRef.current = serverVersion;

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  // 1. Fetch current user if token exists
  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    let isMounted = true;

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Session invalid');
        }

        return res.json();
      })
      .then((data) => {
        if (isMounted && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setToken(null);
          setCurrentUser(null);

          try {
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
          } catch {}
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // 2. Fetch authoritative inventory from central server
  const fetchAuthoritativeInventory = async (
    sinceVersion?: number
  ) => {
    try {
      const url =
        sinceVersion !== undefined
          ? `/api/inventory/sync?sinceVersion=${sinceVersion}`
          : '/api/inventory/sync';

      const res = await fetch(url);

      if (res.status === 304) {
        return;
      }

      if (!res.ok) {
        throw new Error(
          'Failed to sync from central database'
        );
      }

      const data = await res.json();

      if (data && Array.isArray(data.parts)) {
        setParts(data.parts);

        if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }

        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }

        if (Array.isArray(data.suppliers)) {
          setSuppliers(data.suppliers);
        }

        if (Array.isArray(data.auditLogs)) {
          setAuditLogs(data.auditLogs);
        }

        if (Array.isArray(data.bikes)) {
          setBikes(data.bikes);
        }

        if (Array.isArray(data.installations)) {
          setInstallations(data.installations);
        }

        if (Array.isArray(data.stockMovements)) {
          setStockMovements(data.stockMovements);
        }

        if (Array.isArray(data.mechanics)) {
          setMechanics(data.mechanics);
        }

        if (typeof data.version === 'number') {
          setServerVersion(data.version);
        }

        setLastSyncedAt(
          new Date().toLocaleTimeString()
        );
      }
    } catch (err) {
      console.warn(
        'Central sync error:',
        err
      );
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchAuthoritativeInventory();
  }, []);

  // 3. Real-Time Synchronization
  useEffect(() => {
    let eventSource: EventSource | null = null;

    let fallbackInterval:
      ReturnType<typeof setInterval> | null = null;

    try {
      eventSource =
        new EventSource('/api/inventory/sse');

      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(
            event.data
          );

          if (
            data &&
            (
              data.type === 'inventory_sync' ||
              data.type === 'connected'
            )
          ) {
            setIsLiveConnected(true);

            fetchAuthoritativeInventory();
          }
        } catch {
          // Ignore parse errors
        }
      };

      eventSource.onerror = () => {
        setIsLiveConnected(false);

        if (!fallbackInterval) {
          fallbackInterval = setInterval(() => {
            fetchAuthoritativeInventory(
              serverVersionRef.current
            );
          }, 3000);
        }
      };
    } catch {
      setIsLiveConnected(false);

      fallbackInterval = setInterval(() => {
        fetchAuthoritativeInventory(
          serverVersionRef.current
        );
      }, 3000);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }

      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, []);

  // 4. Authentication
  const login = async (
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Invalid credentials',
        };
      }

      setToken(data.token);
      setCurrentUser(data.user);

      try {
        sessionStorage.setItem(
          AUTH_STORAGE_KEY,
          data.token
        );
      } catch {}

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Login network error',
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(
          '/api/auth/logout',
          {
            method: 'POST',
            headers: getAuthHeaders(),
          }
        );
      }
    } catch {}

    setToken(null);
    setCurrentUser(null);

    try {
      sessionStorage.removeItem(
        AUTH_STORAGE_KEY
      );
    } catch {}
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/auth/change-password',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to update password',
        };
      }

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error updating password',
      };
    }
  };

  // 5. Stock
  const stockIn = async (
    payload: StockInPayload
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/stock-in',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to record stock in',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error during Stock In',
      };
    }
  };

  const stockOut = async (
    payload: StockOutPayload
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/stock-out',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.message ||
            data.error ||
            'INSUFFICIENT STOCK',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error during Stock Out',
      };
    }
  };

  const adjustStock = async (
    payload: StockAdjustmentPayload
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/adjust',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to adjust stock',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error during stock adjustment',
      };
    }
  };

  const processReturn = async (
    payload: ReturnPayload
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/return',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to process return',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error processing return',
      };
    }
  };

  // 6. Parts CRUD
  const addPart = async (
    input: AddPartInput
  ): Promise<{
    success: boolean;
    error?: string;
    part?: HeroPart;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/parts',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(input),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to create part',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
        part: data.part,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error creating part',
      };
    }
  };

  const updatePart = async (
    id: string,
    updates: Partial<HeroPart>
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        `/api/inventory/parts/${id}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to update part',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error updating part',
      };
    }
  };

  const archivePart = async (
    id: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        `/api/inventory/parts/${id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to archive part',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error archiving part',
      };
    }
  };

  const unarchivePart = async (
    id: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    return updatePart(id, {
      isArchived: false,
    });
  };

  // 7. Categories & Suppliers
  const addCategory = async (
    name: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    const clean = name.trim();

    if (!clean) {
      return {
        success: false,
        error:
          'Category name cannot be empty.',
      };
    }

    if (categories.includes(clean)) {
      return {
        success: false,
        error:
          'Category already exists.',
      };
    }

    setCategories((prev) => [
      ...prev,
      clean,
    ]);

    return {
      success: true,
    };
  };

  const deleteCategory = async (
    name: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setCategories((prev) =>
      prev.filter((c) => c !== name)
    );

    return {
      success: true,
    };
  };

  const addSupplier = async (
    supplier: Omit<
      PartSupplier,
      'id' | 'dateAdded'
    >
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    const newSup: PartSupplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
      dateAdded:
        new Date()
          .toISOString()
          .split('T')[0],
    };

    setSuppliers((prev) => [
      ...prev,
      newSup,
    ]);

    return {
      success: true,
    };
  };

  const updateSupplier = async (
    id: string,
    updates: Partial<PartSupplier>
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, ...updates }
          : s
      )
    );

    return {
      success: true,
    };
  };

  const deleteSupplier = async (
    id: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setSuppliers((prev) =>
      prev.filter((s) => s.id !== id)
    );

    return {
      success: true,
    };
  };

  // 8. Batch Import
  const importPartsBatch = async (
    rows: PartImportRow[],
    duplicateAction:
      | 'update'
      | 'skip'
      | 'duplicate'
  ): Promise<{
    importedCount: number;
    updatedCount: number;
    skippedCount: number;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/parts/batch-import',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            rows,
            duplicateAction,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          importedCount: 0,
          updatedCount: 0,
          skippedCount: 0,
          error:
            data.error ||
            'Import failed',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        importedCount:
          data.importedCount,
        updatedCount:
          data.updatedCount,
        skippedCount:
          data.skippedCount,
      };
    } catch (err: any) {
      return {
        importedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        error:
          err?.message ||
          'Network error during batch import',
      };
    }
  };

  // 9. Anti-Theft Installation
  const installPart = async (
    payload: InstallPartPayload
  ): Promise<{
    success: boolean;
    error?: string;
    installation?: PartInstallation;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/installations',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to record installation.',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
        installation:
          data.installation,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error during part installation',
      };
    }
  };

  const fetchBikeHistory = async (
    regNo: string
  ) => {
    try {
      const res = await fetch(
        `/api/inventory/bikes/${encodeURIComponent(
          regNo
        )}/history`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      return data;
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Failed to fetch bike history',
      };
    }
  };

  const fetchPartHistory = async (
    partId: string
  ) => {
    try {
      const res = await fetch(
        `/api/inventory/parts/${encodeURIComponent(
          partId
        )}/history`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      return data;
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Failed to fetch part history',
      };
    }
  };

  const correctStock = async (
    partId: string,
    newQuantity: number,
    reason: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/stock-movements/correction',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            partId,
            newQuantity,
            reason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to record stock correction',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error during stock correction',
      };
    }
  };

  const addMechanic = async (
    name: string,
    mobile: string,
    specialization?: string
  ): Promise<{
    success: boolean;
    error?: string;
    mechanic?: MechanicRecord;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/mechanics',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name,
            mobile,
            specialization,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to add mechanic',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
        mechanic: data.mechanic,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error adding mechanic',
      };
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(
        '/api/inventory/reports',
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      return data;
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Failed to load reports',
      };
    }
  };

  const getSupabaseStatus = async () => {
    try {
      const res = await fetch(
        '/api/inventory/supabase-status'
      );

      return await res.json();
    } catch (err: any) {
      return {
        connected: false,
        error: err?.message,
      };
    }
  };

  // 10. Export
  const exportToExcel = (
    data: any[],
    fileName: string,
    sheetName: string = 'Parts Inventory'
  ) => {
    try {
      const worksheet =
        XLSX.utils.json_to_sheet(data);

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        sheetName
      );

      XLSX.writeFile(
        workbook,
        `${fileName}.xlsx`
      );
    } catch (e) {
      console.error(
        'Error exporting to Excel',
        e
      );
    }
  };

  const exportToCsv = (
    data: any[],
    fileName: string
  ) => {
    try {
      const worksheet =
        XLSX.utils.json_to_sheet(data);

      const csvOutput =
        XLSX.utils.sheet_to_csv(
          worksheet
        );

      const blob = new Blob(
        [csvOutput],
        {
          type: 'text/csv;charset=utf-8;',
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.setAttribute(
        'download',
        `${fileName}.csv`
      );

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(
        'Error exporting to CSV',
        e
      );
    }
  };

  // 11. Backup & Restore
  const backupDatabase = async (): Promise<{
    success: boolean;
    error?: string;
    data?: any;
  }> => {
    try {
      const res = await fetch(
        '/api/inventory/backup',
        {
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        return {
          success: false,
          error:
            'Backup failed on central server.',
        };
      }

      const data = await res.json();

      const jsonStr = JSON.stringify(
        data,
        null,
        2
      );

      const blob = new Blob(
        [jsonStr],
        {
          type: 'application/json',
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.setAttribute(
        'download',
        `Hero_Genuine_Parts_Backup_${new Date()
          .toISOString()
          .split('T')[0]}.json`
      );

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return {
        success: true,
        data,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Network error backing up database',
      };
    }
  };

  const restoreDatabase = async (
    jsonString: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const parsed =
        JSON.parse(jsonString);

      const res = await fetch(
        '/api/inventory/restore',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(parsed),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error:
            data.error ||
            'Failed to restore database on server',
        };
      }

      await fetchAuthoritativeInventory();

      return {
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Invalid JSON format',
      };
    }
  };

  const resetToDefaults = async () => {
    setParts(INITIAL_HERO_PARTS);
    setTransactions(
      INITIAL_STOCK_TRANSACTIONS
    );
    setCategories(
      HERO_PART_CATEGORIES
    );
    setSuppliers(INITIAL_SUPPLIERS);
  };

  // User role
  const userRole: UserRole =
    currentUser
      ? currentUser.role
      : 'staff';

  const isAdmin =
    currentUser?.role === 'admin';

  const isStaff =
    currentUser?.role === 'staff' ||
    !currentUser;

  const isLoggedIn =
    Boolean(currentUser);

  const setUserRole = (
    role: UserRole
  ) => {
    if (!currentUser) {
      if (role === 'admin') {
        // Admin role requires server login
      }
    }
  };

  // Real-time Metrics
  const metrics = useMemo(() => {
    const today =
      new Date()
        .toISOString()
        .split('T')[0];

    const activeParts =
      parts.filter(
        (p) => !p.isArchived
      );

    let totalUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let stockValuationMRP = 0;
    let stockValuationPurchase = 0;

    activeParts.forEach((p) => {
      totalUnits += p.currentStock;

      if (p.currentStock === 0) {
        outOfStockCount++;
      } else if (
        p.currentStock <=
        p.minStockLevel
      ) {
        lowStockCount++;
      }

      if (p.mrp) {
        stockValuationMRP +=
          p.currentStock * p.mrp;
      }

      if (p.purchasePrice) {
        stockValuationPurchase +=
          p.currentStock *
          p.purchasePrice;
      }
    });

    let stockInToday = 0;
    let stockOutToday = 0;

    transactions.forEach((tx) => {
      if (tx.date === today) {
        const t =
          (tx.type || '').toUpperCase();

        if (
          t === 'STOCK_IN' ||
          t === 'CUSTOMER_RETURN'
        ) {
          stockInToday +=
            tx.quantity;
        } else if (
          t === 'STOCK_OUT' ||
          t === 'SUPPLIER_RETURN' ||
          t === 'DAMAGE'
        ) {
          stockOutToday +=
            tx.quantity;
        }
      }
    });

    return {
      totalParts:
        activeParts.length,
      totalUnits,
      lowStockCount,
      outOfStockCount,
      stockInToday,
      stockOutToday,
      stockValuationMRP,
      stockValuationPurchase,
    };
  }, [parts, transactions]);

  return (
    <PartsInventoryContext.Provider
      value={{
        parts,
        transactions,
        categories,
        suppliers,
        auditLogs,
        bikes,
        installations,
        stockMovements,
        mechanics,
        currentUser,
        token,
        userRole,
        isAdmin,
        isStaff,
        isLoggedIn,
        login,
        logout,
        changePassword,
        setUserRole,
        isLiveConnected,
        lastSyncedAt,
        serverVersion,
        refreshInventory:
          fetchAuthoritativeInventory,
        addPart,
        updatePart,
        archivePart,
        unarchivePart,
        stockIn,
        stockOut,
        adjustStock,
        correctStock,
        processReturn,
        installPart,
        fetchBikeHistory,
        fetchPartHistory,
        addMechanic,
        fetchReports,
        getSupabaseStatus,
        addCategory,
        deleteCategory,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        importPartsBatch,
        exportToExcel,
        exportToCsv,
        backupDatabase,
        restoreDatabase,
        resetToDefaults,
        metrics,
      }}
    >
      {children}
    </PartsInventoryContext.Provider>
  );
};

export const usePartsInventory =
  (): PartsInventoryContextType => {
    const context = useContext(
      PartsInventoryContext
    );

    if (!context) {
      throw new Error(
        'usePartsInventory must be used within a PartsInventoryProvider'
      );
    }

    return context;
  };
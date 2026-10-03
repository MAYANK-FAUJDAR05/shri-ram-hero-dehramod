import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  VehicleRecord,
  VehicleStatus,
  VehicleStockHistoryRecord,
  VehicleModelSettingRecord,
  ModelStockSummary,
  VehicleStockStats,
  PublicVehicleAvailability,
} from '../types/vehicleStock';
import { usePartsInventory } from './PartsInventoryContext';

interface VehicleStockContextType {
  vehicles: VehicleRecord[];
  modelSummary: ModelStockSummary[];
  stats: VehicleStockStats;
  history: VehicleStockHistoryRecord[];
  modelSettings: VehicleModelSettingRecord[];
  publicAvailability: Record<string, PublicVehicleAvailability>;
  loading: boolean;
  error: string | null;
  fetchVehicles: (filters?: { q?: string; type?: string; status?: string; model?: string; colour?: string }) => Promise<void>;
  fetchModelSummary: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchHistory: (filters?: { stockId?: string; model?: string }) => Promise<void>;
  fetchPublicAvailability: () => Promise<void>;
  addVehicle: (data: Partial<VehicleRecord>) => Promise<{ success: boolean; vehicle?: VehicleRecord; error?: string }>;
  updateVehicle: (
    id: string,
    data: Partial<VehicleRecord>,
    changeReason?: string
  ) => Promise<{ success: boolean; vehicle?: VehicleRecord; error?: string }>;
  changeStatus: (id: string, newStatus: VehicleStatus, reason: string) => Promise<{ success: boolean; error?: string }>;
  deleteVehicle: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateModelSetting: (
    modelName: string,
    minimumStock: number,
    variant?: string
  ) => Promise<{ success: boolean; error?: string }>;
  seedSampleVehicles: () => Promise<{ success: boolean; count?: number; error?: string }>;
}

const defaultStats: VehicleStockStats = {
  totalVehicles: 0,
  inStock: 0,
  reserved: 0,
  sold: 0,
  delivered: 0,
  demo: 0,
  onHold: 0,
  serviceOrTransfer: 0,
  motorcycles: 0,
  scooters: 0,
};

const VehicleStockContext = createContext<VehicleStockContextType | undefined>(undefined);

export const VehicleStockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isLoggedIn } = usePartsInventory();

  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [modelSummary, setModelSummary] = useState<ModelStockSummary[]>([]);
  const [stats, setStats] = useState<VehicleStockStats>(defaultStats);
  const [history, setHistory] = useState<VehicleStockHistoryRecord[]>([]);
  const [modelSettings, setModelSettings] = useState<VehicleModelSettingRecord[]>([]);
  const [publicAvailability, setPublicAvailability] = useState<Record<string, PublicVehicleAvailability>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(() => {
    const currentToken = token || sessionStorage.getItem('shri_ram_hero_auth_token_v3');
    return {
      'Content-Type': 'application/json',
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    };
  }, [token]);

  // 1. Fetch Public Website Availability (No credentials needed)
  const fetchPublicAvailability = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/public-availability');
      const data = await res.json();
      if (data.success && data.availability) {
        setPublicAvailability(data.availability);
      }
    } catch (err: any) {
      console.warn('Failed to load public vehicle availability:', err.message);
    }
  }, []);

  // 2. Fetch Full Vehicle Records (Admin/Staff)
  const fetchVehicles = useCallback(
    async (filters?: { q?: string; type?: string; status?: string; model?: string; colour?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (filters?.q) queryParams.set('q', filters.q);
        if (filters?.type) queryParams.set('type', filters.type);
        if (filters?.status) queryParams.set('status', filters.status);
        if (filters?.model) queryParams.set('model', filters.model);
        if (filters?.colour) queryParams.set('colour', filters.colour);

        const url = `/api/vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();

        if (res.ok && data.success) {
          setVehicles(data.vehicles || []);
        } else {
          setError(data.error || 'Failed to fetch vehicles');
        }
      } catch (err: any) {
        setError(err.message || 'Network error fetching vehicles');
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  // 3. Fetch Model Summary Table (Admin/Staff)
  const fetchModelSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/model-summary', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        setModelSummary(data.summary || []);
      }
    } catch (err: any) {
      console.warn('Failed to load model summary:', err.message);
    }
  }, [getAuthHeaders]);

  // 4. Fetch Dashboard Summary Stats (Admin/Staff)
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/stats', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.warn('Failed to load vehicle stats:', err.message);
    }
  }, [getAuthHeaders]);

  // 5. Fetch Stock History Records (Admin/Staff)
  const fetchHistory = useCallback(
    async (filters?: { stockId?: string; model?: string }) => {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.stockId) queryParams.set('stockId', filters.stockId);
        if (filters?.model) queryParams.set('model', filters.model);

        const url = `/api/vehicles/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data.success) {
          setHistory(data.history || []);
        }
      } catch (err: any) {
        console.warn('Failed to load vehicle stock history:', err.message);
      }
    },
    [getAuthHeaders]
  );

  // 6. Fetch Model Settings
  const fetchModelSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/model-settings', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        setModelSettings(data.settings || []);
      }
    } catch (err: any) {
      console.warn('Failed to load model settings:', err.message);
    }
  }, [getAuthHeaders]);

  // Reload all authenticated vehicle data
  const reloadAll = useCallback(async () => {
    await Promise.all([
      fetchVehicles(),
      fetchModelSummary(),
      fetchStats(),
      fetchHistory(),
      fetchModelSettings(),
      fetchPublicAvailability(),
    ]);
  }, [fetchVehicles, fetchModelSummary, fetchStats, fetchHistory, fetchModelSettings, fetchPublicAvailability]);

  // Initial load
  useEffect(() => {
    fetchPublicAvailability();
  }, [fetchPublicAvailability]);

  // When admin logs in, load full vehicle stock
  useEffect(() => {
    if (isLoggedIn) {
      reloadAll();
    }
  }, [isLoggedIn, reloadAll]);

  // SSE Real-time Synchronization Listener
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/inventory/sse');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.action && payload.action.startsWith('VEHICLE')) {
            fetchPublicAvailability();
            if (isLoggedIn) {
              fetchVehicles();
              fetchModelSummary();
              fetchStats();
              fetchHistory();
            }
          }
        } catch {}
      };
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [isLoggedIn, fetchPublicAvailability, fetchVehicles, fetchModelSummary, fetchStats, fetchHistory]);

  // 7. Add Vehicle
  const addVehicle = async (data: Partial<VehicleRecord>) => {
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to add vehicle.' };
      }

      await reloadAll();
      return { success: true, vehicle: result.vehicle };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error adding vehicle.' };
    }
  };

  // 8. Update Vehicle
  const updateVehicle = async (id: string, data: Partial<VehicleRecord>, changeReason?: string) => {
    try {
      const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...data, changeReason }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to update vehicle.' };
      }

      await reloadAll();
      return { success: true, vehicle: result.vehicle };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating vehicle.' };
    }
  };

  // 9. Quick Status Change
  const changeStatus = async (id: string, newStatus: VehicleStatus, reason: string) => {
    try {
      const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus, reason }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to update vehicle status.' };
      }

      await reloadAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error changing status.' };
    }
  };

  // 10. Delete Vehicle
  const deleteVehicle = async (id: string) => {
    try {
      const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to delete vehicle.' };
      }

      await reloadAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error deleting vehicle.' };
    }
  };

  // 11. Update Model Minimum Stock Setting
  const updateModelSetting = async (modelName: string, minimumStock: number, variant?: string) => {
    try {
      const res = await fetch('/api/vehicles/model-settings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ modelName, minimumStock, variant }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to update model settings.' };
      }

      await reloadAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating settings.' };
    }
  };

  // 12. Seed Sample Dealership Vehicles
  const seedSampleVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles/seed', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to seed sample stock.' };
      }

      await reloadAll();
      return { success: true, count: result.vehicles?.length };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error seeding stock.' };
    }
  };

  return (
    <VehicleStockContext.Provider
      value={{
        vehicles,
        modelSummary,
        stats,
        history,
        modelSettings,
        publicAvailability,
        loading,
        error,
        fetchVehicles,
        fetchModelSummary,
        fetchStats,
        fetchHistory,
        fetchPublicAvailability,
        addVehicle,
        updateVehicle,
        changeStatus,
        deleteVehicle,
        updateModelSetting,
        seedSampleVehicles,
      }}
    >
      {children}
    </VehicleStockContext.Provider>
  );
};

export const useVehicleStock = (): VehicleStockContextType => {
  const context = useContext(VehicleStockContext);
  if (!context) {
    throw new Error('useVehicleStock must be used within a VehicleStockProvider');
  }
  return context;
};

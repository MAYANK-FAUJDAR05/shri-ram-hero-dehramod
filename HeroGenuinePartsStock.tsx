import React, { useState, useMemo } from 'react';
import { HeroPart, StockStatusFilter, StockTransaction } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { HERO_MODELS_LIST } from '../../data/heroPartsData';
import { StockInModal } from './StockInModal';
import { StockOutModal } from './StockOutModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { AddEditPartModal } from './AddEditPartModal';
import { PartDetailModal } from './PartDetailModal';
import { ImportPartsModal } from './ImportPartsModal';
import { SuppliersModal } from './SuppliersModal';
import { ReturnModal } from './ReturnModal';
import { PrintLabelModal } from './PrintLabelModal';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminLogin } from '../AdminLogin';
import { ChangePasswordModal } from './ChangePasswordModal';
import { StockSummaryTable } from './StockSummaryTable';
import { AuditLogViewer } from './AuditLogViewer';
import { InstallPartModal } from './InstallPartModal';
import { BikeHistoryModal } from './BikeHistoryModal';
import { StockMovementLedger } from './StockMovementLedger';
import { StockCorrectionModal } from './StockCorrectionModal';
import { MechanicsModal } from './MechanicsModal';
import { SupabaseSyncModal } from './SupabaseSyncModal';
import { ReportsViewer } from './ReportsViewer';
import { HeroMasterPartsSection } from './HeroMasterPartsSection';
import { VehicleStockMaster } from '../vehicles/VehicleStockMaster';
import { useVehicleStock } from '../../context/VehicleStockContext';
import {
  Package,
  Layers,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Database,
  Building2,
  AlertTriangle,
  CheckCircle2,
  History,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  MapPin,
  TrendingUp,
  Tag,
  Boxes,
  FileSpreadsheet,
  AlertOctagon,
  Eye,
  FileText,
  Calendar,
  X,
  ExternalLink,
  Lock,
  LogOut,
  KeyRound,
  Settings,
  Wifi,
  WifiOff,
  Calculator,
  ShieldAlert,
  Clock,
  Sparkles,
  Wrench,
  Bike,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface HeroGenuinePartsStockProps {
  onBackToShowroom: () => void;
  initialTab?: ActiveTab;
}

type ActiveTab =
  | 'vehicle_stock'
  | 'dashboard'
  | 'master_list'
  | 'catalog'
  | 'movements'
  | 'summary'
  | 'history'
  | 'low_stock'
  | 'racks'
  | 'audit_log'
  | 'reports';

export const HeroGenuinePartsStock: React.FC<HeroGenuinePartsStockProps> = ({
  onBackToShowroom,
  initialTab = 'master_list',
}) => {
  const { stats: vehicleStats } = useVehicleStock();
  const {
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
    userRole,
    isAdmin,
    isStaff,
    isLoggedIn,
    logout,
    isLiveConnected,
    lastSyncedAt,
    serverVersion,
    refreshInventory,
    metrics,
    exportToExcel,
    exportToCsv,
    backupDatabase,
    restoreDatabase,
    resetToDefaults,
  } = usePartsInventory();

  // Navigation Sub-tab (Default: Master List 1-45 as requested)
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [stockStatus, setStockStatus] = useState<StockStatusFilter>('all');
  const [selectedRack, setSelectedRack] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  // Modals state
  const [stockInModalOpen, setStockInModalOpen] = useState<boolean>(false);
  const [stockOutModalOpen, setStockOutModalOpen] = useState<boolean>(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState<boolean>(false);
  const [addPartModalOpen, setAddPartModalOpen] = useState<boolean>(false);
  const [editingPart, setEditingPart] = useState<HeroPart | null>(null);
  const [detailPart, setDetailPart] = useState<HeroPart | null>(null);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [suppliersModalOpen, setSuppliersModalOpen] = useState<boolean>(false);
  const [returnModalOpen, setReturnModalOpen] = useState<boolean>(false);
  const [printLabelPart, setPrintLabelPart] = useState<HeroPart | null>(null);
  const [backupModalOpen, setBackupModalOpen] = useState<boolean>(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState<boolean>(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // New Dealership & Anti-Theft Modals
  const [installPartModalOpen, setInstallPartModalOpen] = useState<boolean>(false);
  const [bikeHistoryModalOpen, setBikeHistoryModalOpen] = useState<boolean>(false);
  const [selectedBikeReg, setSelectedBikeReg] = useState<string>('');
  const [correctionModalOpen, setCorrectionModalOpen] = useState<boolean>(false);
  const [mechanicsModalOpen, setMechanicsModalOpen] = useState<boolean>(false);
  const [supabaseSyncModalOpen, setSupabaseSyncModalOpen] = useState<boolean>(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thisMonthStr = useMemo(() => todayStr.slice(0, 7), [todayStr]);

  const partsInstalledToday = useMemo(() => {
    return (installations || [])
      .filter((i) => i.installationDate === todayStr)
      .reduce((sum, i) => sum + (i.quantity || 1), 0);
  }, [installations, todayStr]);

  const partsInstalledThisMonth = useMemo(() => {
    return (installations || [])
      .filter((i) => (i.installationDate || '').startsWith(thisMonthStr))
      .reduce((sum, i) => sum + (i.quantity || 1), 0);
  }, [installations, thisMonthStr]);

  const [restoreJsonInput, setRestoreJsonInput] = useState<string>('');
  const [restoreStatus, setRestoreStatus] = useState<string>('');

  // Target part for quick actions
  const [targetActionPart, setTargetActionPart] = useState<HeroPart | null>(null);

  // Available racks extracted dynamically
  const uniqueRacks = useMemo(() => {
    const set = new Set<string>();
    parts.forEach((p) => {
      if (p.rackNumber) set.add(p.rackNumber);
    });
    return Array.from(set).sort();
  }, [parts]);

  // Filtered Parts calculation with fast indexing
  const filteredParts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return parts.filter((p) => {
      // Archived filter
      if (stockStatus === 'archived') {
        if (!p.isArchived) return false;
      } else {
        if (p.isArchived) return false;
      }

      // Stock Status filter
      if (stockStatus === 'in_stock' && (p.currentStock <= p.minStockLevel || p.currentStock === 0)) {
        return false;
      }
      if (stockStatus === 'low_stock' && (p.currentStock === 0 || p.currentStock > p.minStockLevel)) {
        return false;
      }
      if (stockStatus === 'out_of_stock' && p.currentStock > 0) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Hero Model filter
      if (selectedModel !== 'all') {
        const fits =
          p.applicableModels.includes(selectedModel) ||
          p.applicableModels.includes('Universal / All Hero Models');
        if (!fits) return false;
      }

      // Rack filter
      if (selectedRack !== 'all' && p.rackNumber !== selectedRack) {
        return false;
      }

      // Supplier filter
      if (selectedSupplier !== 'all' && !p.supplier?.toLowerCase().includes(selectedSupplier.toLowerCase())) {
        return false;
      }

      // Global Search
      if (q) {
        const matchName = p.partName.toLowerCase().includes(q);
        const matchNumber = p.partNumber.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchSubcat = p.subcategory?.toLowerCase().includes(q);
        const matchRack = p.rackNumber?.toLowerCase().includes(q);
        const matchSupplier = p.supplier?.toLowerCase().includes(q);
        const matchModels = p.applicableModels.some((m) => m.toLowerCase().includes(q));
        if (
          !matchName &&
          !matchNumber &&
          !matchCat &&
          !matchSubcat &&
          !matchRack &&
          !matchSupplier &&
          !matchModels
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    parts,
    searchQuery,
    selectedCategory,
    selectedModel,
    stockStatus,
    selectedRack,
    selectedSupplier,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage) || 1;
  const paginatedParts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParts.slice(start, start + itemsPerPage);
  }, [filteredParts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Manual live sync refresh button
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshInventory();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Quick Action Handlers
  const handleOpenStockIn = (part?: HeroPart) => {
    setTargetActionPart(part || null);
    setStockInModalOpen(true);
  };

  const handleOpenStockOut = (part?: HeroPart) => {
    setTargetActionPart(part || null);
    setStockOutModalOpen(true);
  };

  const handleOpenAdjust = (part?: HeroPart) => {
    if (!isAdmin) {
      setAdminLoginModalOpen(true);
      return;
    }
    setTargetActionPart(part || null);
    setAdjustModalOpen(true);
  };

  const handleOpenReturn = (part?: HeroPart) => {
    setTargetActionPart(part || null);
    setReturnModalOpen(true);
  };

  const handleOpenEdit = (part: HeroPart) => {
    if (!isAdmin) {
      setAdminLoginModalOpen(true);
      return;
    }
    setEditingPart(part);
    setAddPartModalOpen(true);
  };

  const handleOpenDetails = (part: HeroPart) => {
    setDetailPart(part);
  };

  // Export handlers
  const handleExportAllParts = (format: 'xlsx' | 'csv') => {
    const data = parts.map((p) => ({
      'Part Number': p.partNumber,
      'Part Name': p.partName,
      'Category': p.category,
      'Subcategory': p.subcategory,
      'Compatible Models': p.applicableModels.join(', '),
      'Variant': p.applicableModelVariant,
      'MRP': p.mrp !== null ? p.mrp : 'MRP Not Added',
      'Purchase Price': p.purchasePrice || '',
      'Selling Price': p.sellingPrice || '',
      'Opening Stock': p.openingStock,
      'Current Stock': p.currentStock,
      'Min Stock Level': p.minStockLevel,
      'Unit': p.unit,
      'Rack': p.rackNumber,
      'Shelf': p.shelfNumber,
      'Supplier': p.supplier,
      'Last Updated': p.lastUpdated,
      'Status': p.isArchived
        ? 'Archived'
        : p.currentStock === 0
        ? 'Out of Stock'
        : p.currentStock <= p.minStockLevel
        ? 'Low Stock'
        : 'In Stock',
    }));

    if (format === 'xlsx') {
      exportToExcel(data, `Hero_Genuine_Parts_Full_Catalog_${new Date().toISOString().split('T')[0]}`);
    } else {
      exportToCsv(data, `Hero_Genuine_Parts_Full_Catalog_${new Date().toISOString().split('T')[0]}`);
    }
  };

  const handleExportFiltered = (format: 'xlsx' | 'csv') => {
    const data = filteredParts.map((p) => ({
      'Part Number': p.partNumber,
      'Part Name': p.partName,
      'Category': p.category,
      'Current Stock': p.currentStock,
      'Unit': p.unit,
      'MRP': p.mrp !== null ? p.mrp : 'MRP Not Added',
      'Rack': p.rackNumber,
      'Shelf': p.shelfNumber,
      'Supplier': p.supplier,
    }));

    if (format === 'xlsx') {
      exportToExcel(data, `Hero_Parts_Filtered_${new Date().toISOString().split('T')[0]}`);
    } else {
      exportToCsv(data, `Hero_Parts_Filtered_${new Date().toISOString().split('T')[0]}`);
    }
  };

  const handleExportTransactions = (format: 'xlsx' | 'csv') => {
    const data = transactions.map((t) => ({
      'Date': t.date,
      'Time': t.time,
      'Part Number': t.partNumber,
      'Part Name': t.partName,
      'Transaction Type': t.type,
      'Quantity': t.quantity,
      'Previous Stock': t.previousStock,
      'New Stock': t.newStock,
      'Reference / Invoice': t.referenceNumber || '',
      'Job Card': t.jobCardNumber || '',
      'Customer / Vehicle': t.customerName || t.vehicleRegNo || '',
      'User': t.user,
      'Reason / Notes': t.reason || t.notes || '',
    }));

    if (format === 'xlsx') {
      exportToExcel(data, `Hero_Parts_Transaction_History_${new Date().toISOString().split('T')[0]}`);
    } else {
      exportToCsv(data, `Hero_Parts_Transaction_History_${new Date().toISOString().split('T')[0]}`);
    }
  };

  const handleExportLowStock = (format: 'xlsx' | 'csv') => {
    const data = parts
      .filter((p) => !p.isArchived && p.currentStock <= p.minStockLevel)
      .map((p) => ({
        'Part Number': p.partNumber,
        'Part Name': p.partName,
        'Category': p.category,
        'Current Stock': p.currentStock,
        'Min Level': p.minStockLevel,
        'Unit': p.unit,
        'Rack': p.rackNumber,
        'Shelf': p.shelfNumber,
        'Supplier': p.supplier,
        'Deficit': p.minStockLevel - p.currentStock,
      }));

    if (format === 'xlsx') {
      exportToExcel(data, `Hero_Low_Stock_Indent_Report_${new Date().toISOString().split('T')[0]}`);
    } else {
      exportToCsv(data, `Hero_Low_Stock_Indent_Report_${new Date().toISOString().split('T')[0]}`);
    }
  };

  // Dashboard Chart Data
  const stockFlowChartData = useMemo(() => {
    const map: { [d: string]: { date: string; inQty: number; outQty: number } } = {};
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    last7Days.forEach((d) => {
      map[d] = { date: d.slice(5), inQty: 0, outQty: 0 };
    });

    transactions.forEach((tx) => {
      if (map[tx.date]) {
        const t = (tx.type || '').toUpperCase();
        if (t === 'STOCK_IN' || t === 'CUSTOMER_RETURN') {
          map[tx.date].inQty += tx.quantity;
        } else if (t === 'STOCK_OUT' || t === 'SUPPLIER_RETURN' || t === 'DAMAGE') {
          map[tx.date].outQty += tx.quantity;
        }
      }
    });

    return Object.values(map);
  }, [transactions]);

  // Recently Added Parts
  const recentlyAddedParts = useMemo(() => {
    return [...parts]
      .filter((p) => !p.isArchived)
      .sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''))
      .slice(0, 5);
  }, [parts]);

  // Top fast-moving parts based on stock out
  const topMovingParts = useMemo(() => {
    const countMap: { [partNumber: string]: { count: number; name: string } } = {};
    transactions.forEach((t) => {
      const type = (t.type || '').toUpperCase();
      if (type === 'STOCK_OUT') {
        if (!countMap[t.partNumber]) {
          countMap[t.partNumber] = { count: 0, name: t.partName };
        }
        countMap[t.partNumber].count += t.quantity;
      }
    });
    return Object.entries(countMap)
      .map(([number, val]) => ({ number, name: val.name, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [transactions]);

  // Gated: Parts Stock is located strictly inside the Admin Page (Admin ID = admin)
  if (!isAdmin) {
    return (
      <AdminLogin
        variant="page"
        onBackToShowroom={onBackToShowroom}
        title="Admin Portal • Hero Genuine Parts Stock"
        subtitle="Sign in with Admin ID: admin to access inventory management"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-sans selection:bg-[#D6181F] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Section Identity */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#D6181F] rounded transform -skew-x-12 shrink-0 shadow-lg shadow-[#D6181F]/30 flex items-center justify-center">
              <span className="text-white font-black text-xl transform skew-x-12 font-['Rajdhani']">H</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white font-['Rajdhani'] uppercase tracking-tight leading-none">
                  Admin Portal <span className="text-[#D6181F]">• {activeTab === 'vehicle_stock' ? 'Vehicle Stock Management' : 'Hero Genuine Parts Stock'}</span>
                </h1>
                {/* Central Database Real-Time Sync Indicator */}
                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono"
                  title="Central Authoritative Database Synchronization"
                >
                  {isLiveConnected ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 font-bold hidden sm:inline">LIVE SYNC</span>
                      <span className="text-gray-400 font-bold">v{serverVersion}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-amber-400 font-bold hidden sm:inline">POLLING</span>
                    </>
                  )}
                  <button
                    onClick={handleManualRefresh}
                    className="text-gray-400 hover:text-white ml-0.5"
                    title="Manual Refresh from Central Database"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                Shri Ram Hero • Dehra Mod, Nadbai, Bharatpur, Raj. • Agency: 8890992086
              </p>
            </div>
          </div>

          {/* Quick Actions & Auth Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* User Session Status */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-[#1c1c1c] border border-white/15 px-2.5 py-1 rounded-lg text-xs">
                <span className="flex items-center gap-1 font-bold text-white">
                  {isAdmin ? <Shield className="w-3.5 h-3.5 text-[#D6181F]" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{currentUser?.name}</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#D6181F]/20 text-[#D6181F] border border-[#D6181F]/30 px-1.5 py-0.2 rounded font-bold">
                  Admin: {currentUser?.username || 'admin'}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => setChangePasswordModalOpen(true)}
                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white ml-1"
                    title="Change Admin Password"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
                  </button>
                )}

                <button
                  onClick={() => logout()}
                  className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAdminLoginModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#D6181F]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Quick Dealership & Anti-Theft Actions */}
            <button
              id="admin-btn-install-part"
              onClick={() => setInstallPartModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
              title="Install Part into Bike with Anti-Theft Vehicle Record"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Install Part</span>
            </button>

            <button
              id="admin-btn-bike-history"
              onClick={() => {
                setSelectedBikeReg('');
                setBikeHistoryModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              title="Search Bike History by Registration, Chassis or Engine Number"
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bike History</span>
            </button>

            {/* Quick Stock In / Out */}
            <button
              onClick={() => handleOpenStockIn()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Stock In</span>
            </button>

            <button
              onClick={() => handleOpenStockOut()}
              className="px-3 py-1.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-[#D6181F]/20 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Stock Out</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingPart(null);
                  setAddPartModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#2c2c2c] text-white border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D6181F]" />
                <span className="hidden sm:inline">Add Part</span>
              </button>
            )}

            {/* Supabase Cloud Connection Status */}
            <button
              onClick={() => setSupabaseSyncModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="View Supabase Cloud Database & RLS Migration Status"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Supabase</span>
            </button>

            {/* Return to Showroom Switcher */}
            <button
              onClick={onBackToShowroom}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Vehicle Showroom"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Showroom</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar matching Dealership Requirements */}
        <div className="bg-[#181818] border-t border-white/5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-2">
            <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>Admin Dashboard</span>
              </button>

              {/* USER REQUIREMENT: Vehicle Stock Management */}
              <button
                id="admin-tab-vehicle-stock"
                onClick={() => setActiveTab('vehicle_stock')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeTab === 'vehicle_stock'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-emerald-400 hover:text-white'
                }`}
                title="Vehicle Stock Master - Maintain physical Hero motorcycles and scooters"
              >
                <Bike className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>Vehicle Stock ({vehicleStats.totalVehicles})</span>
              </button>

              {/* PROMPT REQUIREMENT: Numbered Master List (Categories 1 to 45) */}
              <button
                id="parts-tab-master-list"
                onClick={() => setActiveTab('master_list')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeTab === 'master_list'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-amber-400 hover:text-white'
                }`}
                title="Numbered Master List of Hero Genuine Spare Parts (Categories 1 to 45)"
              >
                <Tag className="w-3.5 h-3.5 text-yellow-400" />
                <span>Numbered Master List (1-45)</span>
              </button>

              <button
                onClick={() => {
                  setStockStatus('all');
                  setActiveTab('catalog');
                }}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'catalog' && stockStatus === 'all'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Parts ({metrics.totalParts})</span>
              </button>

              <button
                onClick={() => setActiveTab('movements')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'movements'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Stock Movements ({stockMovements.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reports'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reports & CSV</span>
              </button>

              <button
                onClick={() => setActiveTab('summary')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'summary'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Stock Summary</span>
              </button>

              <button
                onClick={() => {
                  setStockStatus('low_stock');
                  setActiveTab('catalog');
                }}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'catalog' && stockStatus === 'low_stock'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-gray-400 hover:text-amber-400'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Low Stock ({metrics.lowStockCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5 text-blue-400" />
                <span>Transactions ({transactions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('racks')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'racks'
                    ? 'border-[#D6181F] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Racks ({uniqueRacks.length})</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveTab('audit_log')}
                  className={`pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'audit_log'
                      ? 'border-[#D6181F] text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span>Audit Log ({auditLogs.length})</span>
                </button>
              )}
            </div>

            {/* Quick Tools & Admin Functions */}
            <div className="flex items-center gap-2 pl-4 shrink-0">
              <button
                onClick={() => {
                  setSelectedBikeReg('');
                  setBikeHistoryModalOpen(true);
                }}
                className="text-xs text-purple-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 cursor-pointer"
                title="Search Bike History"
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Bikes</span>
              </button>

              <button
                onClick={() => setMechanicsModalOpen(true)}
                className="text-xs text-blue-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 cursor-pointer"
                title="Workshop Mechanics & Technicians"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Mechanics</span>
              </button>

              <button
                onClick={() => setSuppliersModalOpen(true)}
                className="text-xs text-yellow-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Suppliers</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="text-xs text-emerald-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import</span>
                  </button>

                  <button
                    onClick={() => setBackupModalOpen(true)}
                    className="text-xs text-gray-300 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-blue-400" />
                    <span>Settings</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* TAB 0: VEHICLE STOCK MANAGEMENT (Prompt Requirement) */}
        {activeTab === 'vehicle_stock' && (
          <VehicleStockMaster />
        )}

        {/* TAB 1: ADMIN DASHBOARD (Prompt #10 Requirement) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 6 Core Dealership KPI Cards matching Requirement 10 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Card 1: Total Parts */}
              <div
                onClick={() => {
                  setStockStatus('all');
                  setActiveTab('catalog');
                }}
                className="p-4 bg-[#161616] border border-white/10 hover:border-white/20 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL PARTS</span>
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-white">
                    {metrics.totalParts}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Catalog SKUs</span>
                </div>
              </div>

              {/* Card 2: Total Stock Items */}
              <div
                onClick={() => setActiveTab('summary')}
                className="p-4 bg-[#161616] border border-white/10 hover:border-blue-500/30 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL STOCK ITEMS</span>
                  <Boxes className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-blue-400">
                    {metrics.totalUnits}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Physical units in storage</span>
                </div>
              </div>

              {/* Card 3: Low Stock Parts (CLEARLY HIGHLIGHTED) */}
              <div
                onClick={() => {
                  setStockStatus('low_stock');
                  setActiveTab('catalog');
                }}
                className={`p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all ${
                  metrics.lowStockCount > 0
                    ? 'bg-amber-950/20 border-2 border-amber-500 shadow-lg shadow-amber-500/10 hover:bg-amber-950/30'
                    : 'bg-[#161616] border border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">LOW STOCK PARTS</span>
                  <AlertTriangle className={`w-4 h-4 ${metrics.lowStockCount > 0 ? 'animate-bounce text-amber-400' : 'text-gray-400'}`} />
                </div>
                <div className="mt-2">
                  <span className={`text-2xl font-black font-mono ${metrics.lowStockCount > 0 ? 'text-amber-400' : 'text-gray-300'}`}>
                    {metrics.lowStockCount}
                  </span>
                  <span className="text-[10px] text-amber-300/90 font-medium block mt-0.5">
                    {metrics.lowStockCount > 0 ? 'Action required!' : 'Stock levels normal'}
                  </span>
                </div>
              </div>

              {/* Card 4: Parts Installed Today */}
              <div
                onClick={() => setActiveTab('movements')}
                className="p-4 bg-[#161616] border border-blue-500/30 hover:border-blue-500/50 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-blue-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">INSTALLED TODAY</span>
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-blue-400">
                    {partsInstalledToday}
                  </span>
                  <span className="text-[10px] text-blue-300/80 block mt-0.5">Fitted in bikes today</span>
                </div>
              </div>

              {/* Card 5: Parts Installed This Month */}
              <div
                onClick={() => setActiveTab('reports')}
                className="p-4 bg-[#161616] border border-purple-500/30 hover:border-purple-500/50 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-purple-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">INSTALLED THIS MONTH</span>
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-purple-400">
                    {partsInstalledThisMonth}
                  </span>
                  <span className="text-[10px] text-purple-300/80 block mt-0.5">Month-to-date total</span>
                </div>
              </div>

              {/* Card 6: Stock Added Today */}
              <div
                onClick={() => handleOpenStockIn()}
                className="p-4 bg-[#161616] border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">STOCK ADDED TODAY</span>
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    +{metrics.stockInToday}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block mt-0.5">Purchases / inward</span>
                </div>
              </div>
            </div>

            {/* Low-Stock Warning Alert Banner (Requirement 10: Clearly highlight low-stock parts) */}
            {metrics.lowStockCount > 0 && (
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-black/40 border border-amber-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Low Stock Warning: {metrics.lowStockCount} Parts Below Safety Minimum!
                    </h4>
                    <p className="text-xs text-amber-200/80">
                      These parts have fallen below the configured minimum reorder threshold. Reorder from Hero depot soon to avoid service bottlenecks.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setStockStatus('low_stock');
                      setActiveTab('catalog');
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    View Low Stock List
                  </button>
                  <button
                    onClick={() => handleOpenStockIn()}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Add Stock (Inward)
                  </button>
                </div>
              </div>
            )}

            {/* Today's Stock Movement & Charts Row (Prompt #4) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily In vs Out Bar Chart */}
              <div className="lg:col-span-2 p-5 bg-[#151515] border border-white/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                      Today's Stock Movement & Weekly Flow
                    </h3>
                    <p className="text-[11px] text-gray-400">Central database real-time stock turnover</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> In (+{metrics.stockInToday} today)
                    </span>
                    <span className="flex items-center gap-1.5 text-[#D6181F]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D6181F]" /> Out (-{metrics.stockOutToday} today)
                    </span>
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockFlowChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                      <YAxis stroke="#666" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="inQty" name="Stock In" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outQty" name="Stock Out" fill="#D6181F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* High Demand Moving Parts */}
              <div className="p-5 bg-[#151515] border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                      Top Used Spare Parts
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-mono">Counter & Jobs</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Highest inventory turnover</p>
                </div>

                <div className="space-y-2 my-2">
                  {topMovingParts.map((item, idx) => (
                    <div
                      key={item.number}
                      className="p-2.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-[10px] text-gray-300">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-mono text-[11px] font-bold text-white">{item.number}</div>
                          <div className="text-gray-300 text-[10px] truncate max-w-[150px]">{item.name}</div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {item.count} units
                      </span>
                    </div>
                  ))}
                  {topMovingParts.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No stock movements recorded yet.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Authoritative Valuation:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{metrics.stockValuationMRP.toLocaleString('en-IN')} (MRP)
                  </span>
                </div>
              </div>
            </div>

            {/* Requirement 10: Recent Stock Movements, Recent Installations, and Recent Audit Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Recent Stock Movements */}
              <div className="p-5 bg-[#151515] border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                        Recent Stock Movements
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('movements')}
                      className="text-[11px] text-cyan-400 hover:underline font-bold"
                    >
                      Ledger ({stockMovements.length})
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Purchases, installs, adjustments & returns</p>
                </div>

                <div className="space-y-2 my-2">
                  {stockMovements.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate max-w-[170px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-bold uppercase">
                            {m.movementType}
                          </span>
                          <span className="font-mono text-[10px] text-gray-400">{m.createdAt.slice(11, 16)}</span>
                        </div>
                        <div className="text-white font-semibold truncate mt-0.5">{m.partName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {m.bikeRegistration ? `Bike: ${m.bikeRegistration}` : m.reason || m.partNumber}
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold text-sm ${
                            m.quantityChange > 0 ? 'text-emerald-400' : 'text-[#D6181F]'
                          }`}
                        >
                          {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                        </span>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {m.previousStock} → {m.newStock}
                        </div>
                      </div>
                    </div>
                  ))}
                  {stockMovements.length === 0 && (
                    <div className="p-6 text-center text-xs text-gray-500">
                      No stock movements recorded yet.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('movements')}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Open Full Movement Ledger</span>
                </button>
              </div>

              {/* Card 2: Recent Vehicle Installations */}
              <div className="p-5 bg-[#151515] border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                        Recent Installations
                      </h3>
                    </div>
                    <button
                      onClick={() => setInstallPartModalOpen(true)}
                      className="text-[11px] text-blue-400 hover:underline font-bold"
                    >
                      + Install Part
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Parts fitted to customer bikes in workshop</p>
                </div>

                <div className="space-y-2 my-2">
                  {installations.slice(0, 5).map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => {
                        setSelectedBikeReg(inst.registrationNumber);
                        setBikeHistoryModalOpen(true);
                      }}
                      className="p-2.5 bg-black/40 border border-white/5 hover:border-blue-500/40 rounded-xl flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
                    >
                      <div className="truncate max-w-[170px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-white bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded">
                            {inst.registrationNumber}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">JC: {inst.jobCardNumber}</span>
                        </div>
                        <div className="text-white font-semibold truncate mt-0.5">{inst.partName}</div>
                        <div className="text-[10px] text-gray-400">
                          Mech: <span className="text-gray-300 font-medium">{inst.mechanicName}</span>
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-400 text-sm">
                          {inst.quantity} fitted
                        </span>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {inst.installationDate}
                        </div>
                      </div>
                    </div>
                  ))}
                  {installations.length === 0 && (
                    <div className="p-6 text-center text-xs text-gray-500">
                      No part installations recorded yet.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedBikeReg('');
                    setBikeHistoryModalOpen(true);
                  }}
                  className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Search Vehicle History</span>
                </button>
              </div>

              {/* Card 3: Recent Audit Activities */}
              <div className="p-5 bg-[#151515] border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                        Recent Audit Activities
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('audit_log')}
                      className="text-[11px] text-red-400 hover:underline font-bold"
                    >
                      Audit Trail ({auditLogs.length})
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Permanent anti-theft security event records</p>
                </div>

                <div className="space-y-2 my-2">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate max-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </span>
                        </div>
                        <div className="text-gray-300 text-[11px] truncate mt-0.5">{log.details}</div>
                        <div className="text-[10px] text-gray-500 font-mono">User: {log.username}</div>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="p-6 text-center text-xs text-gray-500">
                      No security audit events recorded.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('audit_log')}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>View Full Anti-Theft Audit Trail</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PARTS CATALOG (Prompt #9 & #10) */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="p-4 bg-[#141414] border border-white/10 rounded-2xl space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by Part Name, Part Number (e.g. 17211, clutch, nut, CB), Model, Rack..."
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D6181F] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportFiltered('xlsx')}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export Current Filter to Excel"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>XLSX</span>
                  </button>

                  <button
                    onClick={() => handleExportFiltered('csv')}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export Current Filter to CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-yellow-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs pt-1">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  >
                    <option value="all">All Categories ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Hero Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  >
                    <option value="all">All Hero Models</option>
                    {HERO_MODELS_LIST.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Stock Status</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => {
                      setStockStatus(e.target.value as StockStatusFilter);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  >
                    <option value="all">All Active Stock</option>
                    <option value="in_stock">In Stock (&gt; Min Level)</option>
                    <option value="low_stock">Low Stock Alert</option>
                    <option value="out_of_stock">Out of Stock (Zero)</option>
                    <option value="archived">Archived Master Parts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Rack Location</label>
                  <select
                    value={selectedRack}
                    onChange={(e) => {
                      setSelectedRack(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  >
                    <option value="all">All Racks</option>
                    {uniqueRacks.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Page Size</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  >
                    <option value={25}>25 parts / page</option>
                    <option value={50}>50 parts / page</option>
                    <option value={100}>100 parts / page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inventory Results Table */}
            <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-xl">
              <div className="px-5 py-3 bg-[#191919] border-b border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium">
                  Showing <span className="font-bold text-white">{filteredParts.length}</span> matching parts
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </span>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>Page {currentPage} of {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Part Number</th>
                      <th className="py-3 px-4">Part Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Hero Fitment</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-right">MRP (₹)</th>
                      <th className="py-3 px-4 text-center">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedParts.map((part) => {
                      const isZero = part.currentStock === 0;
                      const isLow = !isZero && part.currentStock <= part.minStockLevel;

                      return (
                        <tr
                          key={part.id}
                          className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                          onClick={() => handleOpenDetails(part)}
                        >
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-mono font-black text-white bg-black/60 px-2 py-1 rounded border border-white/10 group-hover:border-[#D6181F]/50 transition-colors">
                              {part.partNumber}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-white leading-snug">{part.partName}</div>
                            {part.subcategory && (
                              <div className="text-[10px] text-gray-500">{part.subcategory}</div>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-300 font-medium">
                              {part.category}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-gray-400 text-[11px] max-w-xs truncate">
                            {part.applicableModels.join(', ')}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-gray-300">
                            {part.rackNumber} • {part.shelfNumber}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {part.mrp !== null && part.mrp !== undefined ? (
                              <span className="font-mono font-bold text-white">
                                ₹{part.mrp.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                                MRP Not Added
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {isZero ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                                OUT OF STOCK (0)
                              </span>
                            ) : isLow ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                LOW ({part.currentStock} {part.unit})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {part.currentStock} {part.unit}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  setTargetActionPart(part);
                                  setInstallPartModalOpen(true);
                                }}
                                disabled={part.currentStock <= 0}
                                className={`p-1.5 rounded-lg transition-colors border cursor-pointer ${
                                  part.currentStock <= 0
                                    ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                                    : 'bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500/30'
                                }`}
                                title="Install Part into Bike (Anti-Theft Record)"
                              >
                                <Wrench className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenStockIn(part)}
                                className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors border border-emerald-500/30 cursor-pointer"
                                title="Stock In (Inward Receipt)"
                              >
                                <ArrowDownRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenStockOut(part)}
                                disabled={part.currentStock <= 0}
                                className={`p-1.5 rounded-lg transition-colors border cursor-pointer ${
                                  part.currentStock <= 0
                                    ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                                    : 'bg-[#D6181F]/20 hover:bg-[#D6181F] text-[#D6181F] hover:text-white border-[#D6181F]/30'
                                }`}
                                title="Stock Out (Workshop Dispense)"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    setTargetActionPart(part);
                                    setCorrectionModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white transition-colors border border-purple-500/30 cursor-pointer"
                                  title="Stock Correction (Mandatory Reason & Audit Log)"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenDetails(part)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                                title="View Part Details & Historical Installations"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setPrintLabelPart(part)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors border border-white/10 cursor-pointer"
                                title="Print Bin Label"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredParts.length === 0 && (
                <div className="py-16 text-center space-y-3 bg-[#111]">
                  <Package className="w-12 h-12 text-gray-500 mx-auto" />
                  <h4 className="text-base font-bold text-white font-['Rajdhani'] uppercase">
                    No Genuine Spare Parts Found
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    No parts match your search query "{searchQuery}" and active filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedModel('all');
                      setStockStatus('all');
                      setSelectedRack('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#D6181F] text-white text-xs font-bold uppercase transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Bottom Pagination controls */}
              <div className="px-5 py-3 bg-[#191919] border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>
                  Showing {paginatedParts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredParts.length)} of {filteredParts.length} parts
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 font-mono text-white">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: STOCK MOVEMENT LEDGER (Prompt #9 Requirement) */}
        {activeTab === 'movements' && (
          <StockMovementLedger onOpenCorrectionModal={() => setCorrectionModalOpen(true)} />
        )}

        {/* TAB: DEALERSHIP & ANTI-THEFT REPORTS (Prompt #16 Requirement) */}
        {activeTab === 'reports' && <ReportsViewer />}

        {/* TAB 3: STOCK SUMMARY (Prompt #7) */}
        {activeTab === 'summary' && <StockSummaryTable />}

        {/* TAB 4: TRANSACTIONS (Prompt #8) */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141414] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Permanent Stock Transaction Audit Log
                </h3>
                <p className="text-xs text-gray-400">
                  Every stock movement is recorded permanently in the central database with timestamp, reference, and author
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportTransactions('xlsx')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export History XLSX</span>
                </button>
                <button
                  onClick={() => handleExportTransactions('csv')}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-yellow-400" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* History Table */}
            <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Part Number</th>
                      <th className="py-3 px-4">Part Name</th>
                      <th className="py-3 px-4">Transaction Type</th>
                      <th className="py-3 px-4 text-center">Quantity</th>
                      <th className="py-3 px-4">Prev → New</th>
                      <th className="py-3 px-4">Reference / Job Card</th>
                      <th className="py-3 px-4">User & Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                          {tx.date} <span className="text-gray-500 text-[10px]">{tx.time}</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                          {tx.partNumber}
                        </td>
                        <td className="py-2.5 px-4 text-gray-200 max-w-xs truncate">{tx.partName}</td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          {tx.type === 'STOCK_IN' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Stock In
                            </span>
                          )}
                          {tx.type === 'STOCK_OUT' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6181F]/20 text-[#D6181F] border border-[#D6181F]/30">
                              Stock Out
                            </span>
                          )}
                          {tx.type === 'ADJUSTMENT' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Adjustment
                            </span>
                          )}
                          {tx.type === 'CUSTOMER_RETURN' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              Customer Ret
                            </span>
                          )}
                          {tx.type === 'SUPPLIER_RETURN' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              Supplier Ret
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold whitespace-nowrap">
                          {tx.type === 'STOCK_IN' || tx.type === 'CUSTOMER_RETURN' ? (
                            <span className="text-emerald-400">+{tx.quantity}</span>
                          ) : (
                            <span className="text-[#D6181F]">-{tx.quantity}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-gray-400 whitespace-nowrap text-[11px]">
                          {tx.previousStock} → <span className="text-white font-bold">{tx.newStock}</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-gray-300 text-[11px] whitespace-nowrap">
                          {tx.referenceNumber || '-'}
                          {tx.jobCardNumber && <div className="text-[10px] text-gray-400">{tx.jobCardNumber}</div>}
                          {tx.customerName && <div className="text-[10px] text-gray-400">{tx.customerName}</div>}
                        </td>
                        <td className="py-2.5 px-4 text-gray-300 max-w-sm truncate text-[11px]">
                          <span className="text-gray-400">{tx.user}</span>
                          {(tx.reason || tx.notes) && (
                            <div className="text-[10px] text-gray-500 truncate">{tx.reason || tx.notes}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RACKS & STORAGE BINS */}
        {activeTab === 'racks' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141414] border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Physical Storage Racks & Shelf Map
                </h3>
                <p className="text-xs text-gray-400">
                  Locate fasteners, nuts, bolts, gaskets, cables, and assemblies by warehouse bin
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueRacks.map((rack) => {
                const rackParts = parts.filter((p) => !p.isArchived && p.rackNumber === rack);
                return (
                  <div
                    key={rack}
                    className="p-5 bg-[#161616] border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#D6181F]" />
                          <h4 className="text-base font-bold text-white font-mono">{rack}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-300">
                          {rackParts.length} parts stored
                        </span>
                      </div>

                      <div className="mt-3 divide-y divide-white/5 max-h-48 overflow-y-auto">
                        {rackParts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleOpenDetails(p)}
                            className="py-2 flex items-center justify-between text-xs hover:text-[#D6181F] cursor-pointer"
                          >
                            <div className="truncate max-w-[180px]">
                              <div className="font-mono text-[11px] font-bold text-white">{p.partNumber}</div>
                              <div className="text-[10px] text-gray-400 truncate">{p.partName}</div>
                            </div>
                            <div className="text-right font-mono text-[11px] text-gray-400">
                              <div>{p.shelfNumber}</div>
                              <div className="text-emerald-400">{p.currentStock} {p.unit}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRack(rack);
                        setActiveTab('catalog');
                      }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Filter Catalog by {rack}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOG (Prompt #17) */}
        {activeTab === 'audit_log' && <AuditLogViewer />}

        {/* TAB: NUMBERED MASTER LIST OF HERO GENUINE SPARE PARTS (CATEGORIES 1 to 45) */}
        {activeTab === 'master_list' && <HeroMasterPartsSection />}
      </main>

      {/* Admin Settings Modal (Backup, Restore, Password, Reset) */}
      {backupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Admin System Settings & Database Tools
                </h3>
              </div>
              <button onClick={() => setBackupModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Change Password Card */}
              <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Change Admin Password
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Update administrator password hashed securely on central backend.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBackupModalOpen(false);
                    setChangePasswordModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#D6181F] hover:bg-[#b5141a] rounded-lg text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </div>

              {/* Backup Card */}
              <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Backup Full Central Database
                </h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Creates an authoritative JSON snapshot containing parts, categories, suppliers, transactions, and audit trails.
                </p>
                <button
                  onClick={() => backupDatabase()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Complete Database Backup
                </button>
              </div>

              {/* Restore Card */}
              <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Restore Central Database
                </h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Paste the JSON backup file contents below to restore parts and transactions to the server.
                </p>
                <textarea
                  rows={4}
                  value={restoreJsonInput}
                  onChange={(e) => setRestoreJsonInput(e.target.value)}
                  placeholder="Paste database JSON snapshot here..."
                  className="w-full bg-[#141414] border border-white/15 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
                {restoreStatus && (
                  <div className="text-xs text-amber-300 font-medium">{restoreStatus}</div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!restoreJsonInput.trim()) return;
                      if (confirm('Warning: Restoring will overwrite the current central database. Proceed?')) {
                        const res = await restoreDatabase(restoreJsonInput);
                        if (res.success) {
                          setRestoreStatus('✓ Database restored successfully on central server!');
                          setTimeout(() => setBackupModalOpen(false), 1200);
                        } else {
                          setRestoreStatus(`Error: ${res.error}`);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Confirm & Restore Database
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Reset to factory default Hero Genuine Parts catalog?')) {
                        resetToDefaults();
                        setBackupModalOpen(false);
                      }
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />

      {/* Stock In Modal */}
      {stockInModalOpen && (
        <StockInModal
          initialPart={targetActionPart}
          onClose={() => {
            setStockInModalOpen(false);
            setTargetActionPart(null);
          }}
          onOpenAddNewPart={() => {
            if (!isAdmin) {
              setAdminLoginModalOpen(true);
              return;
            }
            setEditingPart(null);
            setAddPartModalOpen(true);
          }}
        />
      )}

      {/* Stock Out Modal */}
      {stockOutModalOpen && (
        <StockOutModal
          initialPart={targetActionPart}
          onClose={() => {
            setStockOutModalOpen(false);
            setTargetActionPart(null);
          }}
        />
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && (
        <StockAdjustmentModal
          initialPart={targetActionPart}
          onClose={() => {
            setAdjustModalOpen(false);
            setTargetActionPart(null);
          }}
        />
      )}

      {/* Return Modal */}
      {returnModalOpen && (
        <ReturnModal
          initialPart={targetActionPart}
          onClose={() => {
            setReturnModalOpen(false);
            setTargetActionPart(null);
          }}
        />
      )}

      {/* Add / Edit Part Modal */}
      {addPartModalOpen && (
        <AddEditPartModal
          partToEdit={editingPart}
          onClose={() => {
            setAddPartModalOpen(false);
            setEditingPart(null);
          }}
        />
      )}

      {/* Part Detail Modal */}
      {detailPart && (
        <PartDetailModal
          part={detailPart}
          onClose={() => setDetailPart(null)}
          onStockIn={(p) => {
            setDetailPart(null);
            handleOpenStockIn(p);
          }}
          onStockOut={(p) => {
            setDetailPart(null);
            handleOpenStockOut(p);
          }}
          onAdjustStock={(p) => {
            setDetailPart(null);
            handleOpenAdjust(p);
          }}
          onEditPart={(p) => {
            setDetailPart(null);
            handleOpenEdit(p);
          }}
          onReturnPart={(p) => {
            setDetailPart(null);
            handleOpenReturn(p);
          }}
          onPrintLabel={(p) => {
            setPrintLabelPart(p);
          }}
        />
      )}

      {/* Import Parts Modal */}
      {importModalOpen && (
        <ImportPartsModal onClose={() => setImportModalOpen(false)} />
      )}

      {/* Suppliers Management Modal */}
      {suppliersModalOpen && (
        <SuppliersModal onClose={() => setSuppliersModalOpen(false)} />
      )}

      {/* Print Bin Label Modal */}
      {printLabelPart && (
        <PrintLabelModal
          part={printLabelPart}
          onClose={() => setPrintLabelPart(null)}
        />
      )}

      {/* Part Installation Modal (Requirement 4: Part Installation Entry) */}
      <InstallPartModal
        isOpen={installPartModalOpen}
        onClose={() => {
          setInstallPartModalOpen(false);
          setTargetActionPart(null);
        }}
        preselectedPart={targetActionPart}
      />

      {/* Bike History Modal (Requirement 6: Bike-Wise Part History) */}
      <BikeHistoryModal
        isOpen={bikeHistoryModalOpen}
        onClose={() => {
          setBikeHistoryModalOpen(false);
          setSelectedBikeReg('');
        }}
        preselectedRegNo={selectedBikeReg}
      />

      {/* Stock Correction Modal (Requirement 8: No Silent Deletion) */}
      <StockCorrectionModal
        isOpen={correctionModalOpen}
        onClose={() => {
          setCorrectionModalOpen(false);
          setTargetActionPart(null);
        }}
        preselectedPart={targetActionPart}
      />

      {/* Workshop Mechanics Management Modal */}
      <MechanicsModal
        isOpen={mechanicsModalOpen}
        onClose={() => setMechanicsModalOpen(false)}
      />

      {/* Supabase Cloud Connection & Schema Migration Modal (Requirement 12 & 13) */}
      <SupabaseSyncModal
        isOpen={supabaseSyncModalOpen}
        onClose={() => setSupabaseSyncModalOpen(false)}
      />
    </div>
  );
};

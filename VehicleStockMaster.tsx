import React, { useState, useMemo } from 'react';
import {
  Bike,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  KeyRound,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Sliders,
  History,
  Layers,
  ChevronDown,
  Warehouse,
  Check,
} from 'lucide-react';
import { VehicleRecord, VehicleType, VehicleStatus } from '../../types/vehicleStock';
import { useVehicleStock } from '../../context/VehicleStockContext';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { AddVehicleModal } from './AddVehicleModal';
import { EditVehicleModal } from './EditVehicleModal';
import { StatusChangeModal } from './StatusChangeModal';
import { DeleteVehicleModal } from './DeleteVehicleModal';
import { ModelSettingsModal } from './ModelSettingsModal';
import { StockHistoryView } from './StockHistoryView';

export const VehicleStockMaster: React.FC = () => {
  const {
    vehicles,
    modelSummary,
    stats,
    history,
    loading,
    fetchVehicles,
    fetchModelSummary,
    fetchStats,
    seedSampleVehicles,
  } = useVehicleStock();

  const { isAdmin } = usePartsInventory();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<'individual' | 'summary' | 'history'>('individual');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');

  // Sensitive Field Masking Toggle (Chassis & Engine Numbers)
  const [revealSensitive, setRevealSensitive] = useState<boolean>(false);

  // Modals State
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<VehicleRecord | null>(null);
  const [vehicleToChangeStatus, setVehicleToChangeStatus] = useState<VehicleRecord | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleRecord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedNotice, setSeedNotice] = useState<string>('');

  // Extract unique models for filter dropdown
  const uniqueModels = useMemo(() => {
    const set = new Set<string>();
    for (const v of vehicles) {
      if (v.modelName) set.add(v.modelName);
    }
    return Array.from(set).sort();
  }, [vehicles]);

  // Filtered individual vehicle records
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedType !== 'all' && v.vehicleType !== selectedType) return false;
      if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
      if (selectedModel !== 'all' && v.modelName !== selectedModel) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesStockId = v.stockId?.toLowerCase().includes(q);
        const matchesModel = v.modelName?.toLowerCase().includes(q);
        const matchesVariant = v.variant?.toLowerCase().includes(q);
        const matchesColour = v.colour?.toLowerCase().includes(q);
        const matchesChassis = v.chassisNumber?.toLowerCase().includes(q);
        const matchesEngine = v.engineNumber?.toLowerCase().includes(q);
        const matchesKey = v.keyNumber?.toLowerCase().includes(q);
        const matchesLoc = v.storageLocation?.toLowerCase().includes(q);
        const matchesNotes = v.notes?.toLowerCase().includes(q);

        return (
          matchesStockId ||
          matchesModel ||
          matchesVariant ||
          matchesColour ||
          matchesChassis ||
          matchesEngine ||
          matchesKey ||
          matchesLoc ||
          matchesNotes
        );
      }
      return true;
    });
  }, [vehicles, selectedType, selectedStatus, selectedModel, searchQuery]);

  // Export Individual Stock to CSV
  const handleExportCsv = () => {
    if (vehicles.length === 0) return;
    const headers = [
      'Sr No',
      'Stock ID',
      'Vehicle Type',
      'Model Name',
      'Variant',
      'Colour',
      'Model Year',
      'Chassis / VIN Number',
      'Engine Number',
      'Key Number',
      'Quantity',
      'Arrival Date',
      'Stock Entry Date',
      'Status',
      'Storage Location',
      'Notes',
    ];

    const rows = vehicles.map((v, i) => [
      i + 1,
      v.stockId,
      v.vehicleType,
      `"${v.modelName.replace(/"/g, '""')}"`,
      `"${(v.variant || '').replace(/"/g, '""')}"`,
      `"${(v.colour || '').replace(/"/g, '""')}"`,
      v.modelYear,
      v.chassisNumber,
      v.engineNumber,
      v.keyNumber || '',
      1,
      v.arrivalDate || '',
      v.purchaseDate || '',
      v.status,
      `"${(v.storageLocation || '').replace(/"/g, '""')}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Shri_Ram_Hero_Vehicle_Stock_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedNotice('');
    const res = await seedSampleVehicles();
    setIsSeeding(false);
    if (res.success) {
      setSeedNotice(`Successfully seeded ${res.count} genuine Hero vehicles into physical stock!`);
      setTimeout(() => setSeedNotice(''), 4000);
    }
  };

  const getStatusBadgeClass = (status: VehicleStatus) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Reserved':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Sold':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Delivered':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Demo Vehicle':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'On Hold':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Service / Workshop':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Transfer Pending':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP DASHBOARD SUMMARY CARDS                                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {/* Total Vehicles */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Total Stock</span>
            <Warehouse className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-white font-['Rajdhani']">
              {stats.totalVehicles}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">units</span>
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-[#141414] border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
            <span>In Stock</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-['Rajdhani']">
              {stats.inStock}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-mono">available</span>
          </div>
        </div>

        {/* Reserved */}
        <div className="bg-[#141414] border border-yellow-500/30 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-yellow-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Reserved</span>
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-yellow-400 font-['Rajdhani']">
              {stats.reserved}
            </span>
            <span className="text-[10px] text-yellow-500/80 font-mono">booked</span>
          </div>
        </div>

        {/* Sold */}
        <div className="bg-[#141414] border border-blue-500/30 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-blue-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Sold</span>
            <Check className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-blue-400 font-['Rajdhani']">
              {stats.sold}
            </span>
            <span className="text-[10px] text-blue-500/80 font-mono">invoiced</span>
          </div>
        </div>

        {/* Demo Vehicles */}
        <div className="bg-[#141414] border border-cyan-500/30 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-cyan-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Demo</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-['Rajdhani']">
              {stats.demo}
            </span>
            <span className="text-[10px] text-cyan-500/80 font-mono">test rides</span>
          </div>
        </div>

        {/* On Hold */}
        <div className="bg-[#141414] border border-orange-500/30 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-orange-400 text-[10px] uppercase font-bold tracking-wider">
            <span>On Hold</span>
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-orange-400 font-['Rajdhani']">
              {stats.onHold}
            </span>
            <span className="text-[10px] text-orange-500/80 font-mono">pending</span>
          </div>
        </div>

        {/* Motorcycles */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Bikes</span>
            <Bike className="w-3.5 h-3.5 text-[#D6181F]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-white font-['Rajdhani']">
              {stats.motorcycles}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">bikes</span>
          </div>
        </div>

        {/* Scooters */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Scooters</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-white font-['Rajdhani']">
              {stats.scooters}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">scooters</span>
          </div>
        </div>
      </div>

      {seedNotice && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{seedNotice}</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 2. SUB-SECTION CONTROLS & ACTION BAR                                */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'individual'
                  ? 'bg-[#D6181F] text-white shadow-md shadow-[#D6181F]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Individual Vehicles ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-[#D6181F] text-white shadow-md shadow-[#D6181F]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Model-Level Stock ({modelSummary.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#D6181F] text-white shadow-md shadow-[#D6181F]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Stock History ({history.length})</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Reveal/Hide Sensitive Chassis & Engine Numbers */}
            <button
              onClick={() => setRevealSensitive(!revealSensitive)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                revealSensitive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Toggle reveal of confidential vehicle VIN and Engine Numbers"
            >
              {revealSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{revealSensitive ? 'Mask VIN' : 'Reveal VIN'}</span>
            </button>

            {/* Model Minimum Stock Thresholds Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Configure minimum stock level for models"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Low Stock Settings</span>
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportCsv}
              disabled={vehicles.length === 0}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
              title="Export vehicle stock to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Export CSV</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print stock list"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Print</span>
            </button>

            {/* + Add Vehicle Button (Primary) */}
            <button
              id="btn-add-vehicle"
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar (Active in individual and summary view) */}
        {activeTab !== 'history' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-white/5 text-xs">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Stock ID, Model, Variant, Colour, VIN, Engine, Key..."
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F]"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#D6181F]"
              >
                <option value="all">All Types (Bikes & Scooters)</option>
                <option value="Motorcycle">Motorcycles Only</option>
                <option value="Scooter">Scooters Only</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#D6181F]"
              >
                <option value="all">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
                <option value="Delivered">Delivered</option>
                <option value="Demo Vehicle">Demo Vehicle</option>
                <option value="On Hold">On Hold</option>
                <option value="Service / Workshop">Service / Workshop</option>
                <option value="Transfer Pending">Transfer Pending</option>
              </select>
            </div>

            {/* Model Filter */}
            <div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#D6181F]"
              >
                <option value="all">All Hero Models</option>
                {uniqueModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. MAIN CONTENT: INDIVIDUAL VEHICLES TABLE                          */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'individual' && (
        <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#181818] border-b border-white/10 text-gray-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3.5 text-center">Sr.</th>
                  <th className="py-3 px-3.5">Stock ID</th>
                  <th className="py-3 px-3.5">Type</th>
                  <th className="py-3 px-3.5">Model & Variant</th>
                  <th className="py-3 px-3.5">Colour</th>
                  <th className="py-3 px-3.5 text-center">Year</th>
                  <th className="py-3 px-3.5">Chassis / VIN No.</th>
                  <th className="py-3 px-3.5">Engine No.</th>
                  <th className="py-3 px-3.5">Key No.</th>
                  <th className="py-3 px-3.5">Storage Location</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-14 text-center text-gray-400">
                      <Bike className="w-12 h-12 mx-auto text-gray-600 mb-3 opacity-50" />
                      <p className="font-bold text-base text-gray-200 font-['Rajdhani'] uppercase tracking-wider">
                        {vehicles.length === 0
                          ? 'No Vehicles Registered in Physical Dealership Stock'
                          : 'No vehicles match current search or filters'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                        {vehicles.length === 0
                          ? 'Click "+ Add Vehicle" to manually register your physical stock with unique VIN/chassis and engine numbers.'
                          : 'Try changing your search terms or resetting the status/model filter dropdowns.'}
                      </p>

                      {vehicles.length === 0 && (
                        <div className="mt-5 flex items-center justify-center gap-3">
                          <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-4 py-2 bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase rounded-xl shadow-lg shadow-[#D6181F]/30 cursor-pointer"
                          >
                            + Add First Vehicle
                          </button>
                          <button
                            onClick={handleSeed}
                            disabled={isSeeding}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-bold uppercase rounded-xl border border-white/15 cursor-pointer disabled:opacity-50"
                          >
                            {isSeeding ? 'Seeding...' : 'Load Sample Dealership Stock'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((v, index) => {
                    return (
                      <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* 1. Sr. No. */}
                        <td className="py-3 px-3.5 text-center font-mono text-gray-500 text-[11px]">
                          {index + 1}
                        </td>

                        {/* 2. Stock ID */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="font-mono font-black text-white bg-black/60 px-2 py-0.5 rounded border border-[#D6181F]/40 text-xs text-[#D6181F]">
                            {v.stockId}
                          </span>
                        </td>

                        {/* 3. Type */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                            {v.vehicleType}
                          </span>
                        </td>

                        {/* 4. Model & Variant */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-white font-['Rajdhani'] text-sm tracking-wide">
                            {v.modelName}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium">
                            {v.variant || 'Standard'}
                          </div>
                        </td>

                        {/* 5. Colour */}
                        <td className="py-3 px-3.5 whitespace-nowrap text-gray-300 text-xs font-medium">
                          {v.colour}
                        </td>

                        {/* 6. Year */}
                        <td className="py-3 px-3.5 text-center font-mono text-gray-400 text-xs">
                          {v.modelYear}
                        </td>

                        {/* 7. Chassis / VIN Number (Sensitive) */}
                        <td className="py-3 px-3.5 font-mono text-xs text-gray-300 whitespace-nowrap">
                          {revealSensitive ? (
                            <span className="text-white font-bold select-all">{v.chassisNumber}</span>
                          ) : (
                            <span className="text-gray-500 tracking-wider">
                              {v.chassisNumber.slice(0, 5)}••••••{v.chassisNumber.slice(-4)}
                            </span>
                          )}
                        </td>

                        {/* 8. Engine Number (Sensitive) */}
                        <td className="py-3 px-3.5 font-mono text-xs text-gray-300 whitespace-nowrap">
                          {revealSensitive ? (
                            <span className="text-white font-bold select-all">{v.engineNumber}</span>
                          ) : (
                            <span className="text-gray-500 tracking-wider">
                              {v.engineNumber.slice(0, 3)}•••••{v.engineNumber.slice(-3)}
                            </span>
                          )}
                        </td>

                        {/* 9. Key Number */}
                        <td className="py-3 px-3.5 font-mono text-xs text-gray-400 whitespace-nowrap">
                          {v.keyNumber || '—'}
                        </td>

                        {/* 10. Storage Location */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-gray-300 text-[11px]">
                            <MapPin className="w-3 h-3 text-[#D6181F] shrink-0" />
                            <span>{v.storageLocation || 'Showroom'}</span>
                          </div>
                        </td>

                        {/* 11. Status */}
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setVehicleToChangeStatus(v)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border transition-transform hover:scale-105 cursor-pointer ${getStatusBadgeClass(
                              v.status
                            )}`}
                            title="Click to quickly transition vehicle status"
                          >
                            {v.status}
                          </button>
                        </td>

                        {/* 12. Actions */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick Status Change */}
                            <button
                              type="button"
                              onClick={() => setVehicleToChangeStatus(v)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-yellow-400 hover:text-white transition-colors cursor-pointer"
                              title="Update Status (In Stock -> Reserved -> Sold -> Delivered)"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Vehicle */}
                            <button
                              type="button"
                              onClick={() => setVehicleToEdit(v)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 hover:text-white transition-colors cursor-pointer"
                              title="Edit Vehicle Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Vehicle */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => setVehicleToDelete(v)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                title="Permanently Delete Vehicle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 4. MODEL-LEVEL STOCK SUMMARY TABLE                                  */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'summary' && (
        <div className="space-y-3">
          <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#181818] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-['Rajdhani'] tracking-wider">
                  Model-Wise Physical Stock Aggregation
                </h3>
                <p className="text-[11px] text-gray-400">
                  Model | Variant | Colour | Available Qty | Reserved | Sold | Minimum Stock | Stock Status
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#D6181F]/20 hover:bg-[#D6181F]/30 text-[#D6181F] border border-[#D6181F]/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Minimums</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#181818] border-b border-white/10 text-gray-400 font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Model Name</th>
                    <th className="py-3 px-4">Variant</th>
                    <th className="py-3 px-4">Colour</th>
                    <th className="py-3 px-4 text-center">Available Qty</th>
                    <th className="py-3 px-4 text-center">Reserved</th>
                    <th className="py-3 px-4 text-center">Sold / Deliv</th>
                    <th className="py-3 px-4 text-center">Demo / Hold</th>
                    <th className="py-3 px-4 text-center">Min Stock</th>
                    <th className="py-3 px-4 text-center">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {modelSummary.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <Layers className="w-10 h-10 mx-auto text-gray-600 mb-2 opacity-50" />
                        <p className="font-bold text-sm text-gray-300 font-['Rajdhani'] uppercase">
                          No model stock aggregated yet
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Add vehicles to inventory to generate model-wise stock totals automatically.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    modelSummary.map((item, idx) => {
                      const isLowStock = item.stockStatus === 'LOW STOCK';
                      const isOutOfStock = item.stockStatus === 'OUT OF STOCK';

                      return (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-bold text-white font-['Rajdhani'] text-sm tracking-wide">
                            {item.modelName}
                          </td>
                          <td className="py-3 px-4 text-gray-300 text-xs">{item.variant}</td>
                          <td className="py-3 px-4 text-gray-300 text-xs">{item.colour}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-base text-white">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg border ${
                                item.availableQty > 0
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}
                            >
                              {item.availableQty}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-yellow-400">
                            {item.reservedQty}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-blue-400">
                            {item.soldQty + item.deliveredQty}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-cyan-400">
                            {item.demoQty + item.onHoldQty}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-gray-400">
                            {item.minimumStock}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                isOutOfStock
                                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                  : isLowStock
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {item.stockStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 5. STOCK MOVEMENT HISTORY VIEW                                      */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'history' && <StockHistoryView />}

      {/* ------------------------------------------------------------------- */}
      {/* 6. MODALS                                                           */}
      {/* ------------------------------------------------------------------- */}
      <AddVehicleModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          fetchVehicles();
          fetchModelSummary();
          fetchStats();
        }}
      />

      <EditVehicleModal
        isOpen={Boolean(vehicleToEdit)}
        vehicle={vehicleToEdit}
        onClose={() => setVehicleToEdit(null)}
        onSuccess={() => {
          fetchVehicles();
          fetchModelSummary();
          fetchStats();
        }}
      />

      <StatusChangeModal
        isOpen={Boolean(vehicleToChangeStatus)}
        vehicle={vehicleToChangeStatus}
        onClose={() => setVehicleToChangeStatus(null)}
        onSuccess={() => {
          fetchVehicles();
          fetchModelSummary();
          fetchStats();
        }}
      />

      <DeleteVehicleModal
        isOpen={Boolean(vehicleToDelete)}
        vehicle={vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onSuccess={() => {
          fetchVehicles();
          fetchModelSummary();
          fetchStats();
        }}
      />

      <ModelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          fetchModelSummary();
        }}
      />
    </div>
  );
};

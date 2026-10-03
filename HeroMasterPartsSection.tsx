import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Minus,
  Edit3,
  Download,
  Printer,
  Shield,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  RotateCcw,
  Tag,
  MapPin,
  FileSpreadsheet,
  X,
  SlidersHorizontal,
  Check,
  Bike,
} from 'lucide-react';
import {
  HERO_MASTER_CATEGORIES,
  HeroMasterPartItem,
} from '../../data/heroMasterPartsCategories';
import {
  INITIAL_HERO_MASTER_PARTS,
  CATEGORY_DEFINITIONS,
} from '../../data/heroMasterPartsData';
import { HERO_MODELS_LIST } from '../../data/heroPartsData';

const LOCAL_STORAGE_KEY = 'shri_ram_hero_master_parts_v1';

export const HeroMasterPartsSection: React.FC = () => {
  // Master Parts State (with local persistence for dealership edits)
  const [parts, setParts] = useState<HeroMasterPartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved master parts list:', e);
    }
    return INITIAL_HERO_MASTER_PARTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parts));
    } catch (e) {
      console.warn('Failed to save master parts list:', e);
    }
  }, [parts]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockStatus, setStockStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);

  // Edit Stock Modal
  const [editingItem, setEditingItem] = useState<HeroMasterPartItem | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editMinStock, setEditMinStock] = useState<number>(1);
  const [editRack, setEditRack] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editPartNumber, setEditPartNumber] = useState<string>('');
  const [editModelCompatibility, setEditModelCompatibility] = useState<string>('Model specific');

  // Quick Notification
  const [toastMsg, setToastMsg] = useState<string>('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Stock status helper
  const calculateStatus = (qty: number, min: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
    if (qty <= 0) return 'Out of Stock';
    if (qty <= min) return 'Low Stock';
    return 'In Stock';
  };

  // Quick +1 / -1 Stock Quantity Handlers
  const handleQuickAdd = (srNo: number) => {
    setParts((prev) =>
      prev.map((item) => {
        if (item.srNo === srNo) {
          const newQty = item.stockQty + 1;
          return {
            ...item,
            stockQty: newQty,
            status: calculateStatus(newQty, item.minimumStock),
          };
        }
        return item;
      })
    );
    showToast(`Stock increased for Sr #${srNo}`);
  };

  const handleQuickReduce = (srNo: number) => {
    setParts((prev) =>
      prev.map((item) => {
        if (item.srNo === srNo) {
          const newQty = Math.max(0, item.stockQty - 1);
          return {
            ...item,
            stockQty: newQty,
            status: calculateStatus(newQty, item.minimumStock),
          };
        }
        return item;
      })
    );
    showToast(`Stock reduced for Sr #${srNo}`);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: HeroMasterPartItem) => {
    setEditingItem(item);
    setEditQty(item.stockQty);
    setEditMinStock(item.minimumStock);
    setEditRack(item.rackShelfNo || '');
    setEditNotes(item.notes === '-' ? '' : item.notes);
    setEditPartNumber(item.verifiedPartNumber === '-' ? '' : item.verifiedPartNumber);
    setEditModelCompatibility(item.modelCompatibility);
  };

  // Save Modal Edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const qty = Math.max(0, Number(editQty) || 0);
    const min = Math.max(0, Number(editMinStock) || 1);

    setParts((prev) =>
      prev.map((item) => {
        if (item.srNo === editingItem.srNo) {
          return {
            ...item,
            stockQty: qty,
            minimumStock: min,
            rackShelfNo: editRack.trim() || item.rackShelfNo,
            notes: editNotes.trim() || '-',
            verifiedPartNumber: editPartNumber.trim() ? editPartNumber.trim().toUpperCase() : '-',
            modelCompatibility: editModelCompatibility.trim() || 'Model specific',
            status: calculateStatus(qty, min),
          };
        }
        return item;
      })
    );

    setEditingItem(null);
    showToast(`Updated stock details for Sr #${editingItem.srNo}`);
  };

  // Reset to Factory Default Master List
  const handleResetDefaults = () => {
    if (confirm('Reset entire master inventory list to default stock counts? (Serial numbers will remain permanent).')) {
      setParts(INITIAL_HERO_MASTER_PARTS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast('Master inventory list reset to default template.');
    }
  };

  // Filtered & Searched Parts
  const filteredParts = useMemo(() => {
    return parts.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catId = Number(selectedCategory);
        if (item.categoryId !== catId) return false;
      }

      // Stock status filter
      if (stockStatus !== 'all') {
        if (stockStatus === 'in_stock' && item.status !== 'In Stock') return false;
        if (stockStatus === 'low_stock' && item.status !== 'Low Stock') return false;
        if (stockStatus === 'out_of_stock' && item.status !== 'Out of Stock') return false;
      }

      // Hero Model filter
      if (selectedModel !== 'all') {
        const queryModel = selectedModel.toLowerCase();
        const compat = item.modelCompatibility.toLowerCase();
        if (compat !== 'model specific' && !compat.includes(queryModel)) {
          return false;
        }
      }

      // Search Query: srNo, categoryNo, partName, partFamily, verifiedPartNumber, rackShelfNo
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSr = item.srNo.toString() === q;
        const matchCatNo = item.categoryNo.toLowerCase().includes(q);
        const matchName = item.partName.toLowerCase().includes(q);
        const matchFamily = item.partFamily.toLowerCase().includes(q);
        const matchPartNo = item.verifiedPartNumber.toLowerCase().includes(q);
        const matchRack = item.rackShelfNo.toLowerCase().includes(q);
        const matchModel = item.modelCompatibility.toLowerCase().includes(q);

        if (!matchSr && !matchCatNo && !matchName && !matchFamily && !matchPartNo && !matchRack && !matchModel) {
          return false;
        }
      }

      return true;
    });
  }, [parts, selectedCategory, stockStatus, selectedModel, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = parts.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalStockUnits = 0;

    parts.forEach((p) => {
      totalStockUnits += p.stockQty;
      if (p.status === 'In Stock') inStock++;
      else if (p.status === 'Low Stock') lowStock++;
      else outOfStock++;
    });

    return { total, inStock, lowStock, outOfStock, totalStockUnits };
  }, [parts]);

  // Paginated Parts
  const totalPages = Math.ceil(filteredParts.length / pageSize) || 1;
  const paginatedParts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredParts.slice(start, start + pageSize);
  }, [filteredParts, currentPage, pageSize]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'Sr. No.',
      'Category No.',
      'Category Name',
      'Part Name',
      'Part Family',
      'Hero Model Compatibility',
      'Verified Part Number',
      'Stock Qty',
      'Minimum Stock',
      'Rack/Shelf No.',
      'Status',
      'Notes',
    ];

    const rows = filteredParts.map((p) => [
      p.srNo,
      p.categoryNo,
      `"${p.categoryName}"`,
      `"${p.partName}"`,
      `"${p.partFamily}"`,
      `"${p.modelCompatibility}"`,
      `"${p.verifiedPartNumber}"`,
      p.stockQty,
      p.minimumStock,
      `"${p.rackShelfNo}"`,
      `"${p.status}"`,
      `"${p.notes}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ShriRamHero_Master_Parts_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV inventory list successfully.');
  };

  // Print Inventory List
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#0d0d0d] text-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e1e] border-2 border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="p-6 bg-gradient-to-r from-red-950/40 via-[#141414] to-[#121212] border border-white/10 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D6181F] text-white text-[10px] font-mono font-black tracking-widest uppercase">
                  Hero MotoCorp Associate Dealership
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono font-bold">
                  Dehramod Nadbai
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Rajdhani'] uppercase tracking-tight">
                Hero Genuine Spare Parts • <span className="text-[#D6181F]">Master Inventory List</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
                Official numbered master directory covering all 45 Hero MotoCorp spare part categories and verified product families for physical showroom & workshop inventory control.
              </p>
            </div>

            {/* Actions: Export / Print */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export filtered list to Excel/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print master stock sheet"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print List</span>
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
                title="Reset to factory template"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Important Dealership Rule Mandatory Banner */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Important Dealership Rule & Verification Guidelines:</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              The Serial Number (<strong>Sr. No.</strong>) and <strong>Category No.</strong> (e.g., 01.01, 01.02) are <strong>INTERNAL INVENTORY REFERENCE NUMBERS</strong> for rack bin labeling and stock audit. They must <strong>NOT</strong> be confused with Hero MotoCorp's official part numbers.
            </p>
            <p className="text-[11px] text-amber-200/80 font-medium">
              “Part compatibility and official part numbers should always be verified through the Hero MotoCorp Genuine Parts / E-Catalogue before ordering or issuing a part.”
            </p>
          </div>

          {/* 4 Summary Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 bg-black/50 border border-white/10 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Master Families</span>
              <span className="text-xl font-black text-white font-mono">{stats.total}</span>
              <span className="text-[10px] text-gray-500 block">Across 45 Categories</span>
            </div>
            <div className="p-3 bg-black/50 border border-white/10 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Physical Stock Units</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{stats.totalStockUnits}</span>
              <span className="text-[10px] text-gray-500 block">Total Units in Racks</span>
            </div>
            <div className="p-3 bg-black/50 border border-emerald-500/30 rounded-xl">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">In Stock</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{stats.inStock}</span>
              <span className="text-[10px] text-gray-500 block">Above Minimum Level</span>
            </div>
            <div className="p-3 bg-black/50 border border-amber-500/30 rounded-xl">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Low Stock</span>
              <span className="text-xl font-black text-amber-400 font-mono">{stats.lowStock}</span>
              <span className="text-[10px] text-gray-500 block">Below Reorder Level</span>
            </div>
            <div className="p-3 bg-black/50 border border-red-500/30 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider block">Out of Stock</span>
              <span className="text-xl font-black text-red-400 font-mono">{stats.outOfStock}</span>
              <span className="text-[10px] text-gray-500 block">Requires Procurement</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#141414] border border-white/10 rounded-2xl shadow-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input: Sr No, Part Name, Part No, Rack */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search Sr #, Name, Part #, Rack..."
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown (All 45 Categories) */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors cursor-pointer appearance-none"
              >
                <option value="all">All 45 Categories (Full Catalog)</option>
                {HERO_MASTER_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.prefix}. {cat.name} ({cat.count} items)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Stock Status Filter */}
            <div className="relative">
              <select
                value={stockStatus}
                onChange={(e) => {
                  setStockStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors cursor-pointer appearance-none"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock (&gt; Minimum)</option>
                <option value="low_stock">Low Stock (Needs Reorder)</option>
                <option value="out_of_stock">Out of Stock (Zero Units)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Hero Model Compatibility Filter */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors cursor-pointer appearance-none"
              >
                <option value="all">All Hero Motorcycle Models</option>
                {HERO_MODELS_LIST.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Info */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-1 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span>Showing <strong>{filteredParts.length}</strong> of <strong>{parts.length}</strong> master part families</span>
              {(selectedCategory !== 'all' || stockStatus !== 'all' || selectedModel !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setStockStatus('all');
                    setSelectedModel('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#D6181F] hover:underline font-bold ml-2 cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Quick Page Size selection */}
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Rows per page:</span>
              {[25, 50, 100, 300].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    setPageSize(sz);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    pageSize === sz ? 'bg-[#D6181F] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Inventory Table matching prompt requirements */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1c1c1c] border-b border-white/10 text-gray-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-16 text-center">Sr. No.</th>
                  <th className="py-3 px-3 w-24">Category No.</th>
                  <th className="py-3 px-4 min-w-[200px]">Part Name</th>
                  <th className="py-3 px-3 min-w-[140px]">Part Family</th>
                  <th className="py-3 px-3 min-w-[140px]">Hero Model Compatibility</th>
                  <th className="py-3 px-3 min-w-[140px]">Part Number</th>
                  <th className="py-3 px-3 w-28 text-center">Stock Qty</th>
                  <th className="py-3 px-2 w-20 text-center">Min. Stock</th>
                  <th className="py-3 px-3 w-24 text-center">Rack/Shelf</th>
                  <th className="py-3 px-3 w-28 text-center">Status</th>
                  <th className="py-3 px-3 min-w-[100px]">Notes</th>
                  <th className="py-3 px-3 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {paginatedParts.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="font-bold text-sm text-gray-300">No matching spare parts found</p>
                      <p className="text-xs text-gray-500 mt-1">Try adjusting your search terms or category filters.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedParts.map((item) => (
                    <tr
                      key={item.srNo}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Sr. No. (Permanent internal reference number) */}
                      <td className="py-2.5 px-3 font-mono font-bold text-center text-gray-300 bg-black/20">
                        {item.srNo}
                      </td>

                      {/* Category No. e.g. 01.01 */}
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                        {item.categoryNo}
                      </td>

                      {/* Part Name */}
                      <td className="py-2.5 px-4 font-bold text-white leading-snug">
                        {item.partName}
                      </td>

                      {/* Part Family */}
                      <td className="py-2.5 px-3 text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                          {item.partFamily}
                        </span>
                      </td>

                      {/* Hero Model Compatibility */}
                      <td className="py-2.5 px-3 text-gray-300">
                        <span className="text-[11px] text-gray-400 italic">
                          {item.modelCompatibility}
                        </span>
                      </td>

                      {/* Part Number (Verified SKU or '-') */}
                      <td className="py-2.5 px-3 font-mono">
                        {item.verifiedPartNumber === '-' ? (
                          <span className="text-gray-500 italic text-[11px]">-</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                            {item.verifiedPartNumber}
                          </span>
                        )}
                      </td>

                      {/* Stock Qty (+ / - quick controls) */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickReduce(item.srNo)}
                            className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                            title="Reduce 1 unit (used/sold)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-black text-sm w-7 text-center text-white">
                            {item.stockQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(item.srNo)}
                            className="w-5 h-5 rounded bg-[#D6181F] hover:bg-[#b5141a] text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                            title="Add 1 unit to stock"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Minimum Stock */}
                      <td className="py-2.5 px-2 text-center font-mono text-gray-400">
                        {item.minimumStock}
                      </td>

                      {/* Rack/Shelf No. */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-300">
                        <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[11px]">
                          {item.rackShelfNo}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center">
                        {item.status === 'In Stock' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase">
                            In Stock
                          </span>
                        )}
                        {item.status === 'Low Stock' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px] uppercase">
                            Low Stock
                          </span>
                        )}
                        {item.status === 'Out of Stock' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-bold text-[10px] uppercase">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="py-2.5 px-3 text-gray-400 truncate max-w-[120px]" title={item.notes}>
                        {item.notes}
                      </td>

                      {/* Actions: Edit Stock Modal */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-bold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                          title="Edit stock count, rack location, and verified part number"
                        >
                          <Edit3 className="w-3 h-3 text-[#D6181F]" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-[#181818] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
              <div>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (Total {filteredParts.length} items)
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded flex items-center justify-center cursor-pointer transition-colors ${
                          currentPage === pageNum ? 'bg-[#D6181F] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Quick Selector Cards (all 45 numbered categories) */}
        <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D6181F]" />
              <h2 className="text-base sm:text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                Hero MotoCorp Master Categories (1 to 45)
              </h2>
            </div>
            <span className="text-xs text-gray-400">Click any category to filter the list</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 text-xs">
            {HERO_MASTER_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id.toString();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'all' : cat.id.toString());
                    setCurrentPage(1);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-lg shadow-[#D6181F]/30'
                      : 'bg-black/40 hover:bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[10px] opacity-80">{cat.prefix}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'}`}>
                      {cat.count} items
                    </span>
                  </div>
                  <span className="font-bold text-[11px] leading-tight truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* EDIT MODAL DIALOG */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    Sr #{editingItem.srNo} • Cat #{editingItem.categoryNo}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-gray-300 uppercase">
                    {editingItem.categoryName}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wider mt-0.5">
                  Edit Stock: {editingItem.partName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Current Stock */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Stock Quantity (Units) <span className="text-[#D6181F]">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editQty}
                    onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Minimum Stock Level */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Minimum Stock (Reorder Point)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editMinStock}
                    onChange={(e) => setEditMinStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Rack / Shelf Bin Location */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Rack / Shelf Bin Number
                </label>
                <input
                  type="text"
                  value={editRack}
                  onChange={(e) => setEditRack(e.target.value)}
                  placeholder="e.g. A-01, Rack B-3, Bin 12"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] font-mono"
                />
              </div>

              {/* Verified Official Hero Part Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                    Verified Hero Part Number (SKU)
                  </label>
                  <span className="text-[10px] text-gray-400">Leave '-' if not verified</span>
                </div>
                <input
                  type="text"
                  value={editPartNumber}
                  onChange={(e) => setEditPartNumber(e.target.value)}
                  placeholder="e.g. 17211-KCC-9000 (from official e-catalogue)"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono uppercase"
                />
              </div>

              {/* Model Compatibility */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Hero Model Compatibility
                </label>
                <input
                  type="text"
                  value={editModelCompatibility}
                  onChange={(e) => setEditModelCompatibility(e.target.value)}
                  placeholder="e.g. Model specific, Splendor+, HF Deluxe, Passion+"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Inventory Notes & Remarks
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. OEM supplier batch #4812, invoice details..."
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-lg shadow-[#D6181F]/30 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Inventory Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

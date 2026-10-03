import React, { useState, useMemo } from 'react';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { HeroPart } from '../../types/parts';
import {
  Calculator,
  Search,
  Download,
  Package,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const StockSummaryTable: React.FC = () => {
  const { parts, transactions, categories, exportToExcel, exportToCsv } = usePartsInventory();
  const [search, setSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  // Compute breakdown per part
  const summaryData = useMemo(() => {
    // Map transaction totals per part
    const partStats: {
      [partId: string]: {
        totalIn: number;
        totalOut: number;
        returnsIn: number;
        returnsOut: number;
        adjustments: number;
      };
    } = {};

    transactions.forEach((tx) => {
      const id = tx.partId;
      if (!partStats[id]) {
        partStats[id] = { totalIn: 0, totalOut: 0, returnsIn: 0, returnsOut: 0, adjustments: 0 };
      }
      const t = (tx.type || '').toUpperCase();
      if (t === 'STOCK_IN') {
        partStats[id].totalIn += tx.quantity;
      } else if (t === 'STOCK_OUT') {
        partStats[id].totalOut += tx.quantity;
      } else if (t === 'CUSTOMER_RETURN') {
        partStats[id].returnsIn += tx.quantity;
      } else if (t === 'SUPPLIER_RETURN') {
        partStats[id].returnsOut += tx.quantity;
      } else if (t === 'ADJUSTMENT') {
        // Net adjustment difference
        const diff = tx.newStock - tx.previousStock;
        partStats[id].adjustments += diff;
      }
    });

    return parts
      .filter((p) => !p.isArchived)
      .map((p) => {
        const stats = partStats[p.id] || {
          totalIn: 0,
          totalOut: 0,
          returnsIn: 0,
          returnsOut: 0,
          adjustments: 0,
        };

        return {
          part: p,
          partId: p.id,
          partNumber: p.partNumber,
          partName: p.partName,
          category: p.category,
          mrp: p.mrp,
          unit: p.unit,
          openingStock: p.openingStock,
          totalIn: stats.totalIn,
          totalOut: stats.totalOut,
          returnsIn: stats.returnsIn,
          returnsOut: stats.returnsOut,
          adjustments: stats.adjustments,
          currentStock: p.currentStock,
        };
      });
  }, [parts, transactions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return summaryData.filter((item) => {
      if (selectedCat !== 'all' && item.category !== selectedCat) return false;
      if (q) {
        return (
          item.partName.toLowerCase().includes(q) ||
          item.partNumber.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [summaryData, search, selectedCat]);

  const handleExport = (format: 'xlsx' | 'csv') => {
    const exportData = filtered.map((row) => ({
      'Part Number': row.partNumber,
      'Part Name': row.partName,
      'Category': row.category,
      'MRP (₹)': row.mrp !== null ? row.mrp : 'MRP Not Added',
      'Opening Stock': row.openingStock,
      'Total Stock In': row.totalIn,
      'Total Stock Out': row.totalOut,
      'Customer Returns': row.returnsIn,
      'Supplier Returns': row.returnsOut,
      'Adjustments': row.adjustments,
      'Current Authoritative Stock': row.currentStock,
      'Unit': row.unit,
    }));

    if (format === 'xlsx') {
      exportToExcel(exportData, `Hero_Stock_Summary_Audit_${new Date().toISOString().split('T')[0]}`);
    } else {
      exportToCsv(exportData, `Hero_Stock_Summary_Audit_${new Date().toISOString().split('T')[0]}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-[#141414] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
              Comprehensive Stock Calculation Summary
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Formula: Opening Stock + Total Stock In - Total Stock Out + Returns ± Adjustments = Current Stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('xlsx')}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export XLSX</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-yellow-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search summary by Part Number, Part Name..."
            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          />
        </div>
        <div className="sm:w-60">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Table */}
      <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Part Number</th>
                <th className="py-3 px-4">Part Name</th>
                <th className="py-3 px-4">MRP (₹)</th>
                <th className="py-3 px-3 text-center">Opening</th>
                <th className="py-3 px-3 text-center text-emerald-400">Total In</th>
                <th className="py-3 px-3 text-center text-[#D6181F]">Total Out</th>
                <th className="py-3 px-3 text-center text-blue-400">Returns</th>
                <th className="py-3 px-3 text-center text-amber-400">Adjustments</th>
                <th className="py-3 px-4 text-center font-black text-white bg-black/40">CURRENT STOCK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((row) => (
                <tr key={row.partId} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                    {row.partNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-200">
                    <div className="font-semibold leading-tight">{row.partName}</div>
                    <div className="text-[10px] text-gray-500">{row.category}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono">
                    {row.mrp !== null && row.mrp !== undefined ? (
                      <span className="text-white font-bold">₹{row.mrp.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-amber-400 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        MRP Not Added
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-gray-300">
                    {row.openingStock}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">
                    +{row.totalIn}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[#D6181F] font-bold">
                    -{row.totalOut}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-blue-400">
                    {row.returnsIn > 0 ? `+${row.returnsIn}` : '0'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-amber-400">
                    {row.adjustments > 0 ? `+${row.adjustments}` : row.adjustments}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-base font-black bg-black/40 whitespace-nowrap">
                    <span
                      className={
                        row.currentStock === 0
                          ? 'text-red-500 animate-pulse'
                          : row.currentStock <= row.part.minStockLevel
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {row.currentStock} {row.unit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

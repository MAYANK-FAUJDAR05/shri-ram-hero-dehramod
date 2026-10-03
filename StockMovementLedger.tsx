import React, { useState } from 'react';
import { StockMovementRecord, MovementType } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  SlidersHorizontal,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  FileText,
  ShieldCheck,
  Calendar,
  User,
  Plus,
  Wrench,
  Bike,
  Download,
} from 'lucide-react';

interface StockMovementLedgerProps {
  onOpenCorrectionModal?: () => void;
}

export const StockMovementLedger: React.FC<StockMovementLedgerProps> = ({
  onOpenCorrectionModal,
}) => {
  const { stockMovements, parts, exportToCsv } = usePartsInventory();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredMovements = stockMovements.filter((m) => {
    if (filterType !== 'all' && m.movementType !== filterType) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        m.partName.toLowerCase().includes(q) ||
        m.partNumber.toLowerCase().includes(q) ||
        (m.bikeRegistration && m.bikeRegistration.toLowerCase().includes(q)) ||
        (m.jobCardNumber && m.jobCardNumber.toLowerCase().includes(q)) ||
        (m.mechanicName && m.mechanicName.toLowerCase().includes(q)) ||
        (m.reason && m.reason.toLowerCase().includes(q)) ||
        (m.performedByName && m.performedByName.toLowerCase().includes(q));

      if (!match) return false;
    }

    if (startDate && m.createdAt < startDate) return false;
    if (endDate && m.createdAt > `${endDate}T23:59:59`) return false;

    return true;
  });

  const getMovementBadge = (type: MovementType) => {
    switch (type) {
      case 'PURCHASE':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>PURCHASE</span>
          </span>
        );
      case 'INSTALLATION':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            <span>INSTALLATION</span>
          </span>
        );
      case 'CORRECTION':
        return (
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>CORRECTION</span>
          </span>
        );
      case 'MANUAL_ADJUSTMENT':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>ADJUSTMENT</span>
          </span>
        );
      case 'RETURN':
        return (
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span>RETURN</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-300 border border-gray-500/30 text-[10px] font-mono font-bold uppercase">
            {type}
          </span>
        );
    }
  };

  const handleExportLedger = () => {
    const data = filteredMovements.map((m) => ({
      'Date & Time': m.createdAt,
      'Type': m.movementType,
      'Part Name': m.partName,
      'Part Number': m.partNumber,
      'Quantity Change': m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange,
      'Previous Stock': m.previousStock,
      'New Stock': m.newStock,
      'Bike No': m.bikeRegistration || '--',
      'Job Card': m.jobCardNumber || '--',
      'Mechanic': m.mechanicName || '--',
      'Reason': m.reason || '--',
      'Performed By': m.performedByName,
    }));

    exportToCsv(data, 'Stock_Movement_Ledger');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#141414] border border-white/10 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
              Stock Movement Ledger
            </h2>
            <p className="text-[11px] text-gray-400">
              Double-entry audit trail tracking all arrivals, bike installations, corrections, and returns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCorrectionModal && (
            <button
              onClick={onOpenCorrectionModal}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-purple-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Record Stock Correction</span>
            </button>
          )}

          <button
            onClick={handleExportLedger}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-[#141414] border border-white/10 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by part, bike no, job card, mechanic, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F] transition-colors"
            />
          </div>

          {/* Movement Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors"
            >
              <option value="all">All Movement Types</option>
              <option value="PURCHASE">PURCHASE (Stock In)</option>
              <option value="INSTALLATION">INSTALLATION (In Bike)</option>
              <option value="CORRECTION">CORRECTION (Audit Fix)</option>
              <option value="MANUAL_ADJUSTMENT">MANUAL_ADJUSTMENT</option>
              <option value="RETURN">RETURN</option>
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors font-mono"
            />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
        {filteredMovements.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No stock movements found matching selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 border-b border-white/10 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Part Details</th>
                  <th className="py-2.5 px-3 text-center">Change</th>
                  <th className="py-2.5 px-3 text-center">Stock Balance</th>
                  <th className="py-2.5 px-3">Bike / Reference</th>
                  <th className="py-2.5 px-3">Reason / Details</th>
                  <th className="py-2.5 px-3">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#121212]">
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-gray-300 text-[11px]">
                      <div>{m.createdAt ? m.createdAt.split('T')[0] : '--'}</div>
                      <div className="text-[10px] text-gray-500">
                        {m.createdAt ? m.createdAt.split('T')[1]?.slice(0, 8) : ''}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getMovementBadge(m.movementType)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white max-w-[200px] truncate" title={m.partName}>
                        {m.partName}
                      </div>
                      <div className="font-mono text-[11px] text-gray-400">
                        {m.partNumber}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold whitespace-nowrap">
                      {m.quantityChange > 0 ? (
                        <span className="text-emerald-400">+{m.quantityChange}</span>
                      ) : m.quantityChange < 0 ? (
                        <span className="text-red-400">{m.quantityChange}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono whitespace-nowrap text-[11px]">
                      <span className="text-gray-500">{m.previousStock}</span>
                      <span className="text-gray-600 mx-1">→</span>
                      <strong className="text-white font-bold">{m.newStock}</strong>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {m.bikeRegistration ? (
                        <div>
                          <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono font-bold text-[10px]">
                            {m.bikeRegistration}
                          </span>
                          {m.jobCardNumber && (
                            <span className="block text-[10px] font-mono text-amber-400 mt-0.5">
                              JC: {m.jobCardNumber}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 font-mono text-[11px]">--</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 max-w-[220px] text-gray-300 text-[11px]">
                      <div className="truncate" title={m.reason}>
                        {m.reason || '--'}
                      </div>
                      {m.mechanicName && (
                        <div className="text-[10px] text-gray-500">
                          Tech: <span className="text-gray-300">{m.mechanicName}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-gray-400 font-mono text-[11px]">
                      {m.performedByName || 'Admin'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

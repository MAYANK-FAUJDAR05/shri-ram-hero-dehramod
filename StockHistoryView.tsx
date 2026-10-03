import React, { useState } from 'react';
import { History, Search, ArrowRight, ShieldCheck, Download, Calendar, User, FileSpreadsheet } from 'lucide-react';
import { useVehicleStock } from '../../context/VehicleStockContext';
import { VehicleStatus } from '../../types/vehicleStock';

export const StockHistoryView: React.FC = () => {
  const { history } = useVehicleStock();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredHistory = history.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      item.stockId.toLowerCase().includes(q) ||
      item.modelName.toLowerCase().includes(q) ||
      item.reason.toLowerCase().includes(q) ||
      item.adminUser.toLowerCase().includes(q) ||
      item.oldStatus.toLowerCase().includes(q) ||
      item.newStatus.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: VehicleStatus | 'NEW_ENTRY' | 'DELETED') => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Reserved':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Sold':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Delivered':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'On Hold':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Demo Vehicle':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'NEW_ENTRY':
        return 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40';
      case 'DELETED':
        return 'bg-red-600/30 text-red-300 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const exportHistoryCsv = () => {
    if (history.length === 0) return;
    const headers = ['Sr No', 'Date', 'Time', 'Stock ID', 'Model', 'Variant', 'Colour', 'Old Status', 'New Status', 'Reason', 'Admin User'];
    const rows = history.map((h, i) => [
      i + 1,
      h.date,
      h.time,
      h.stockId,
      h.modelName,
      h.variant || '',
      h.colour || '',
      h.oldStatus,
      h.newStatus,
      `"${(h.reason || '').replace(/"/g, '""')}"`,
      h.adminUser || 'admin',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hero_Vehicle_Stock_Movement_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141414] p-4 rounded-xl border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock history by Stock ID, Model, Reason, User..."
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            Total Movements: <strong className="text-white">{history.length}</strong>
          </span>

          <button
            onClick={exportHistoryCsv}
            disabled={history.length === 0}
            className="px-3 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Export full vehicle stock history to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export History CSV</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#181818] border-b border-white/10 text-gray-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3.5 text-center">Sr.</th>
                <th className="py-3 px-3.5">Date & Time</th>
                <th className="py-3 px-3.5">Stock ID</th>
                <th className="py-3 px-3.5">Vehicle Model</th>
                <th className="py-3 px-3.5 text-center">Status Transition</th>
                <th className="py-3 px-3.5">Movement Reason</th>
                <th className="py-3 px-3.5">Admin / User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <History className="w-10 h-10 mx-auto text-gray-600 mb-2 opacity-50" />
                    <p className="font-bold text-sm text-gray-300 font-['Rajdhani'] uppercase">
                      No stock movement history recorded yet
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Whenever vehicles are added, sold, reserved or delivered, an immutable record will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3.5 text-center font-mono text-gray-500 text-[11px]">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-300">
                        <Calendar className="w-3 h-3 text-gray-500 shrink-0" />
                        <span>{item.date}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400">{item.time}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 font-mono font-bold text-white text-xs">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#D6181F]">
                        {item.stockId}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white">{item.modelName}</div>
                      {(item.variant || item.colour) && (
                        <div className="text-[10px] text-gray-400">
                          {item.variant} • {item.colour}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded border uppercase ${getStatusBadge(item.oldStatus)}`}>
                          {item.oldStatus}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                        <span className={`px-2 py-0.5 rounded border uppercase ${getStatusBadge(item.newStatus)}`}>
                          {item.newStatus}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 max-w-xs truncate text-gray-300 text-[11px]">
                      {item.reason}
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-300 font-mono text-[11px]">
                        <User className="w-3 h-3 text-[#D6181F]" />
                        <span>{item.adminUser}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

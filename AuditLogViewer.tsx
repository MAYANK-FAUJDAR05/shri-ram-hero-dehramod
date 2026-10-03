import React, { useState, useMemo } from 'react';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  User,
  Activity,
  Terminal,
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = usePartsInventory();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const actionsList = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => set.add(l.action));
    return Array.from(set).sort();
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return auditLogs.filter((log) => {
      if (filterAction !== 'all' && log.action !== filterAction) return false;
      if (q) {
        return (
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.username.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, filterAction, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 bg-[#141414] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
              Server Authoritative Audit Log
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Immutable security trail recording every authentication, stock change, price modification, and user action
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-gray-300">
          {auditLogs.length} Total Events Recorded
        </span>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by user, action, details..."
            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          />
        </div>
        <div className="sm:w-60">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          >
            <option value="all">All Audit Actions ({actionsList.length})</option>
            {actionsList.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details / Impact</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 text-[11px] text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="text-white font-bold">{log.username}</span>
                    <span className="text-[10px] text-gray-500 ml-1">({log.userRole})</span>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('FAIL')
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : log.action.includes('PASSWORD')
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : log.action.includes('OUT')
                          ? 'bg-[#D6181F]/20 text-[#D6181F] border border-[#D6181F]/30'
                          : log.action.includes('IN')
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-gray-300 font-sans text-xs max-w-md break-words">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[11px] text-gray-500 whitespace-nowrap">
                    {log.ip || '127.0.0.1'}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-sans text-xs">
                    No audit records matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

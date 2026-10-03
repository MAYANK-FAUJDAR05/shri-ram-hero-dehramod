import React, { useState, useEffect } from 'react';
import { BikeRecord, PartInstallation } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  Bike,
  Search,
  Calendar,
  Wrench,
  User,
  ShieldCheck,
  FileText,
  Phone,
  Gauge,
  X,
  Clock,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

interface BikeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRegNo?: string;
}

export const BikeHistoryModal: React.FC<BikeHistoryModalProps> = ({
  isOpen,
  onClose,
  preselectedRegNo,
}) => {
  const { bikes, installations, fetchBikeHistory, exportToCsv } = usePartsInventory();
  const [selectedReg, setSelectedReg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [bikeRecord, setBikeRecord] = useState<BikeRecord | null>(null);
  const [bikeInstallations, setBikeInstallations] = useState<PartInstallation[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (preselectedRegNo) {
        setSelectedReg(preselectedRegNo.toUpperCase().replace(/\s+/g, ''));
      } else if (bikes.length > 0 && !selectedReg) {
        setSelectedReg(bikes[0].registrationNumber);
      }
    }
  }, [isOpen, preselectedRegNo, bikes]);

  useEffect(() => {
    if (selectedReg) {
      loadHistory(selectedReg);
    }
  }, [selectedReg, installations]);

  const loadHistory = async (reg: string) => {
    setLoading(true);
    const res = await fetchBikeHistory(reg);
    setLoading(false);
    if (res.success) {
      setBikeRecord(res.bike || null);
      setBikeInstallations(res.installations || []);
    } else {
      // Local fallback
      const localBike = bikes.find((b) => b.registrationNumber === reg) || null;
      const localInst = installations.filter((i) => i.registrationNumber === reg);
      setBikeRecord(localBike);
      setBikeInstallations(localInst);
    }
  };

  if (!isOpen) return null;

  const filteredBikes = bikes.filter((b) => {
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase().replace(/\s+/g, '');
    return (
      b.registrationNumber.toLowerCase().includes(s) ||
      (b.chassisNumber && b.chassisNumber.toLowerCase().includes(s)) ||
      (b.engineNumber && b.engineNumber.toLowerCase().includes(s)) ||
      b.customerName.toLowerCase().includes(s) ||
      b.customerMobile.includes(s)
    );
  });

  const handleExportBikeHistory = () => {
    const data = bikeInstallations.map((i) => ({
      'Registration No': i.registrationNumber,
      'Bike Model': i.bikeModel,
      'Chassis No': i.chassisNumber || '--',
      'Engine No': i.engineNumber || '--',
      'Part Name': i.partName,
      'Part No': i.partNumber,
      'Quantity': i.quantity,
      'Job Card': i.jobCardNumber,
      'Customer Name': i.customerName,
      'Customer Mobile': i.customerMobile,
      'Mechanic': i.mechanicName,
      'Installation Date': i.installationDate,
      'Installation Time': i.installationTime,
      'Odometer (KM)': i.odometerReading || '--',
      'Entered By': i.enteredByName,
      'Remarks': i.remarks || '--',
    }));

    exportToCsv(data, `Bike_History_${selectedReg || 'All'}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Vehicle-Wise Parts Installation Ledger
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-mono font-bold uppercase">
                  Bike History
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Track full chronological history of parts installed in any customer bike by Registration, Chassis, or Engine No.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto font-sans">
          {/* Top Bar: Search & Select Bike */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search bike by Reg No, Chassis, Engine No, or Customer Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <select
                value={selectedReg}
                onChange={(e) => setSelectedReg(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono font-bold"
              >
                {filteredBikes.map((b) => (
                  <option key={b.id} value={b.registrationNumber}>
                    {b.registrationNumber} — {b.bikeModel} ({b.customerName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bike Profile Card */}
          {bikeRecord ? (
            <div className="p-4 bg-gradient-to-r from-blue-950/30 via-[#181818] to-[#161616] border border-blue-500/30 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-black/60 border border-blue-500/40 rounded-lg text-sm font-mono font-black text-white tracking-widest">
                    {bikeRecord.registrationNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                      {bikeRecord.bikeModel}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Owner: <strong className="text-white">{bikeRecord.customerName}</strong> • Mobile: {bikeRecord.customerMobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportBikeHistory}
                    disabled={bikeInstallations.length === 0}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export History (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Technical Identifiers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px]">
                <div className="p-2 bg-black/30 rounded-lg">
                  <span className="text-gray-500 block text-[10px] uppercase">Chassis No / VIN</span>
                  <span className="font-mono text-gray-200 font-bold">{bikeRecord.chassisNumber || '--'}</span>
                </div>
                <div className="p-2 bg-black/30 rounded-lg">
                  <span className="text-gray-500 block text-[10px] uppercase">Engine Number</span>
                  <span className="font-mono text-gray-200 font-bold">{bikeRecord.engineNumber || '--'}</span>
                </div>
                <div className="p-2 bg-black/30 rounded-lg">
                  <span className="text-gray-500 block text-[10px] uppercase">Last Job Card</span>
                  <span className="font-mono text-amber-400 font-bold">{bikeRecord.jobCardNumber || '--'}</span>
                </div>
                <div className="p-2 bg-black/30 rounded-lg">
                  <span className="text-gray-500 block text-[10px] uppercase">Odometer</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {bikeRecord.odometerReading ? `${bikeRecord.odometerReading.toLocaleString()} KM` : '--'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-gray-400">
              No registered bike selected. Search or choose from the dropdown above.
            </div>
          )}

          {/* Historical Installations Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>Historical Parts Installed on {selectedReg || 'Bike'} ({bikeInstallations.length} records)</span>
              </span>
              <span className="text-[11px] text-gray-400">
                Total Parts Installed: <strong className="text-emerald-400 font-mono">{bikeInstallations.reduce((acc, curr) => acc + (curr.quantity || 1), 0)} Pcs</strong>
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading bike history...</div>
            ) : bikeInstallations.length === 0 ? (
              <div className="py-8 text-center bg-black/40 border border-white/5 rounded-xl text-xs text-gray-500">
                No parts have been recorded as installed on {selectedReg} yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1c] text-gray-400 border-b border-white/10 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Part Name</th>
                      <th className="py-2.5 px-3">Part No</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3">Job Card</th>
                      <th className="py-2.5 px-3">Mechanic</th>
                      <th className="py-2.5 px-3">Entered By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#121212]">
                    {bikeInstallations.map((inst) => (
                      <tr key={inst.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-gray-300 text-[11px]">
                          <div>{inst.installationDate}</div>
                          <div className="text-[10px] text-gray-500">{inst.installationTime}</div>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-white max-w-[200px] truncate" title={inst.partName}>
                          {inst.partName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-gray-300 text-[11px]">
                          {inst.partNumber}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">
                          {inst.quantity}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-400 text-[11px]">
                          {inst.jobCardNumber}
                        </td>
                        <td className="py-2.5 px-3 text-gray-200">
                          {inst.mechanicName}
                        </td>
                        <td className="py-2.5 px-3 text-gray-400 text-[11px]">
                          {inst.enteredByName || 'Admin'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#121212] border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">
            Shri Ram Hero Dealership Anti-Theft Protection • All Installations Digitally Signed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

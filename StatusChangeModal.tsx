import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { VehicleRecord, VehicleStatus } from '../../types/vehicleStock';
import { useVehicleStock } from '../../context/VehicleStockContext';

interface StatusChangeModalProps {
  isOpen: boolean;
  vehicle: VehicleRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const STATUS_TRANSITIONS: {
  status: VehicleStatus;
  badgeClass: string;
  defaultReason: string;
}[] = [
  { status: 'In Stock', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', defaultReason: 'Returned to physical showroom inventory' },
  { status: 'Reserved', badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', defaultReason: 'Customer booking advance received' },
  { status: 'Sold', badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40', defaultReason: 'Sale invoice and payment completed' },
  { status: 'Delivered', badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40', defaultReason: 'Vehicle physically delivered to customer' },
  { status: 'On Hold', badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40', defaultReason: 'Hold pending finance document verification' },
  { status: 'Demo Vehicle', badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', defaultReason: 'Designated as dealership test ride display unit' },
  { status: 'Service / Workshop', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40', defaultReason: 'Sent to workshop for accessory fitment or PDI check' },
  { status: 'Transfer Pending', badgeClass: 'bg-gray-500/20 text-gray-300 border-gray-500/40', defaultReason: 'Transfer pending between godown and branch' },
];

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onSuccess,
}) => {
  const { changeStatus } = useVehicleStock();

  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus>('Reserved');
  const [reason, setReason] = useState<string>('Customer booking advance received');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !vehicle) return null;

  const handleSelectStatus = (st: VehicleStatus, defReason: string) => {
    setSelectedStatus(st);
    setReason(defReason);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for status change.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await changeStatus(vehicle.id, selectedStatus, reason.trim());
    setLoading(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to update vehicle status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                Change Vehicle Status
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                {vehicle.stockId} • {vehicle.modelName} ({vehicle.colour})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Status Banner */}
          <div className="p-3.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                Current Status
              </span>
              <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                {vehicle.status}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                New Target Status
              </span>
              <span className="text-sm font-bold text-[#D6181F] font-mono mt-0.5 block">
                {selectedStatus}
              </span>
            </div>
          </div>

          {/* Select New Status */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
              Select New Stock Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_TRANSITIONS.map((st) => (
                <button
                  key={st.status}
                  type="button"
                  onClick={() => handleSelectStatus(st.status, st.defaultReason)}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer flex items-center justify-between ${
                    selectedStatus === st.status
                      ? 'border-[#D6181F] bg-[#D6181F]/15 text-white shadow-md'
                      : 'border-white/10 bg-[#191919] text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-xs">{st.status}</span>
                  {selectedStatus === st.status && (
                    <span className="w-2 h-2 rounded-full bg-[#D6181F]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Movement Reason (Recorded into history) */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              Reason / Remarks for Status Change <span className="text-[#D6181F]">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer booking, Delivery, Sale completed"
              className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">
              This entry is permanently saved into the vehicle's Stock Movement History log.
            </p>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Recording...' : 'Record Status Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

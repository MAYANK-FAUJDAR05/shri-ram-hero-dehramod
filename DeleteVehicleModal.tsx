import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { VehicleRecord } from '../../types/vehicleStock';
import { useVehicleStock } from '../../context/VehicleStockContext';

interface DeleteVehicleModalProps {
  isOpen: boolean;
  vehicle: VehicleRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onSuccess,
}) => {
  const { deleteVehicle } = useVehicleStock();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !vehicle) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    const res = await deleteVehicle(vehicle.id);
    setLoading(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to delete vehicle.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-red-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-red-950/60 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                Permanent Vehicle Removal
              </h2>
              <p className="text-[11px] text-red-300 font-mono">
                Stock ID: {vehicle.stockId}
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
        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-red-300 text-xs">
              {error}
            </div>
          )}

          <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase font-['Rajdhani'] tracking-wide">
                Confirmation Required
              </h4>
              <p className="text-xs text-gray-200 font-medium">
                Are you sure you want to permanently remove this vehicle from stock?
              </p>
            </div>
          </div>

          {/* Vehicle Snapshot */}
          <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Stock ID:</span>
              <span className="font-mono font-bold text-white">{vehicle.stockId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Model:</span>
              <span className="font-bold text-white">{vehicle.modelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Variant & Colour:</span>
              <span className="text-gray-300">{vehicle.variant} - {vehicle.colour}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Chassis No:</span>
              <span className="font-mono text-gray-300">{vehicle.chassisNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Engine No:</span>
              <span className="font-mono text-gray-300">{vehicle.engineNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="font-bold text-amber-400">{vehicle.status}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Note: The Stock ID (<strong className="text-white">{vehicle.stockId}</strong>) will be retired and will <span className="text-red-400 font-bold">never be reused</span> for another vehicle. A permanent record will be stored in the Audit Log and Stock Movement History.
          </p>

          {/* Action buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Deleting...' : 'Yes, Permanently Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

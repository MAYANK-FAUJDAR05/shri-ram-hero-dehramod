import React, { useState } from 'react';
import { HeroPart } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  Package,
  SlidersHorizontal,
} from 'lucide-react';

interface StockCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPart?: HeroPart | null;
}

export const StockCorrectionModal: React.FC<StockCorrectionModalProps> = ({
  isOpen,
  onClose,
  preselectedPart,
}) => {
  const { parts, correctStock } = usePartsInventory();
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      setReason('');
      if (preselectedPart) {
        setSelectedPartId(preselectedPart.id);
        setNewQuantity(preselectedPart.currentStock);
      } else if (parts.length > 0 && !selectedPartId) {
        setSelectedPartId(parts[0].id);
        setNewQuantity(parts[0].currentStock);
      }
    }
  }, [isOpen, preselectedPart, parts]);

  if (!isOpen) return null;

  const currentPart = parts.find((p) => p.id === selectedPartId);
  const diff = currentPart ? newQuantity - currentPart.currentStock : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPart) {
      setError('Please select a part to correct.');
      return;
    }

    if (newQuantity < 0) {
      setError('New stock quantity cannot be negative.');
      return;
    }

    if (diff === 0) {
      setError('New quantity is identical to current stock. No correction needed.');
      return;
    }

    if (!reason || reason.trim().length < 8) {
      setError('Mandatory Anti-Theft Requirement: Please provide a detailed explanation of at least 8 characters explaining the stock correction reason.');
      return;
    }

    setLoading(true);
    const res = await correctStock(currentPart.id, newQuantity, reason.trim());
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to apply stock correction.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                Authorized Stock Correction
              </h2>
              <p className="text-[11px] text-gray-400">
                Preserves previous stock, audit reason, and administrator identity
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-3 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <strong className="block text-white text-sm font-['Rajdhani'] uppercase">
                  Stock Correction Recorded!
                </strong>
                <span>The correction has been logged immutably in the stock movement ledger and anti-theft audit trail.</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Select Part <span className="text-[#D6181F]">*</span>
            </label>
            <select
              value={selectedPartId}
              onChange={(e) => {
                setSelectedPartId(e.target.value);
                const p = parts.find((x) => x.id === e.target.value);
                if (p) setNewQuantity(p.currentStock);
              }}
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              required
            >
              {parts.filter((p) => !p.isArchived).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.partName} [{p.partNumber}] — Current: {p.currentStock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          {currentPart && (
            <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 rounded-xl border border-white/10 text-center font-mono">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Previous Stock</span>
                <span className="text-sm font-bold text-white">{currentPart.currentStock}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Difference</span>
                <span className={`text-sm font-bold ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {diff > 0 ? `+${diff}` : diff}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">New Stock</span>
                <span className="text-sm font-bold text-purple-400">{newQuantity}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Verified Physical Quantity <span className="text-[#D6181F]">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Mandatory Correction Reason <span className="text-[#D6181F]">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Physical inventory count discrepancy identified during monthly audit. 2 units found on shelf B-03."
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              Min. 8 characters. Explanations are permanent and accessible in anti-theft audit reports.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || diff === 0 || reason.trim().length < 8}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Recording...' : 'Apply Anti-Theft Correction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

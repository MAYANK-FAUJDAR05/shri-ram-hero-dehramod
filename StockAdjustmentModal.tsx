import React, { useState } from 'react';
import { HeroPart } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { X, SlidersHorizontal, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface StockAdjustmentModalProps {
  initialPart?: HeroPart | null;
  onClose: () => void;
}

const COMMON_REASONS = [
  'Physical Count Audit (Physical inventory variance)',
  'Damaged Parts (Cracked, dented, or broken in storage)',
  'Missing / Untraced Parts during quarterly stock audit',
  'Counting Mistake / Invoicing Correction',
  'Supplier Short Dispatch Resolution',
  'Warranty Rejection / OEM Scrapped Item',
  'Returned Parts Restocking',
  'Other / Custom Reason',
];

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  initialPart,
  onClose,
}) => {
  const { parts, adjustStock, userRole } = usePartsInventory();
  const activeParts = parts.filter((p) => !p.isArchived);

  const [selectedPartId, setSelectedPartId] = useState<string>(
    initialPart?.id || (activeParts.length > 0 ? activeParts[0].id : '')
  );

  const selectedPart = activeParts.find((p) => p.id === selectedPartId);

  const [newQuantity, setNewQuantity] = useState<string>(
    selectedPart ? String(selectedPart.currentStock) : '0'
  );
  const [reasonCategory, setReasonCategory] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handlePartChange = (partId: string) => {
    setSelectedPartId(partId);
    const p = activeParts.find((item) => item.id === partId);
    if (p) {
      setNewQuantity(String(p.currentStock));
    }
  };

  const oldStock = selectedPart ? selectedPart.currentStock : 0;
  const parsedNewStock = parseInt(newQuantity, 10);
  const isValidNewStock = !isNaN(parsedNewStock) && parsedNewStock >= 0;
  const difference = isValidNewStock ? parsedNewStock - oldStock : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userRole !== 'admin') {
      setError('Unauthorized: Stock adjustment is strictly restricted to Admin users.');
      return;
    }

    if (!selectedPartId) {
      setError('Please select a part.');
      return;
    }

    if (!isValidNewStock) {
      setError('New stock quantity cannot be negative.');
      return;
    }

    if (difference === 0) {
      setError('New stock quantity is identical to existing quantity. No adjustment detected.');
      return;
    }

    const finalReason =
      reasonCategory === 'Other / Custom Reason'
        ? customReason.trim()
        : `${reasonCategory}${customReason.trim() ? ` - ${customReason.trim()}` : ''}`;

    if (!finalReason) {
      setError('Reason is mandatory for stock adjustment audits.');
      return;
    }

    const res = await adjustStock({
      partId: selectedPartId,
      newQuantity: parsedNewStock,
      reason: finalReason,
      date,
      notes: notes.trim() || undefined,
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to adjust stock.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                  Stock Adjustment (Physical Audit)
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Correct stock discrepancies, damaged or missing parts with audit trail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Rajdhani']">
              Stock Adjustment Logged!
            </h3>
            <p className="text-xs text-gray-300">
              Updated stock for <span className="text-white font-semibold">{selectedPart?.partName}</span>.
              <br />
              Adjustment: <span className={`font-mono font-bold ${difference > 0 ? 'text-emerald-400' : 'text-[#D6181F]'}`}>
                {difference > 0 ? `+${difference}` : difference} {selectedPart?.unit}
              </span>.
              <br />
              New Current Stock: <span className="text-white font-bold font-mono">{parsedNewStock} {selectedPart?.unit}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Part */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Select Part for Adjustment <span className="text-[#D6181F]">*</span>
              </label>
              <select
                value={selectedPartId}
                onChange={(e) => handlePartChange(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              >
                <option value="" disabled>
                  -- Select a Hero Part --
                </option>
                {activeParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.partNumber}] {p.partName} (Current: {p.currentStock} {p.unit}) - {p.rackNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Current vs New Quantity comparison */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-[#191919] border border-white/10 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Old Quantity</span>
                <div className="text-lg font-bold font-mono text-gray-300 mt-1">
                  {oldStock} <span className="text-xs font-normal text-gray-500">{selectedPart?.unit}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase block">New Quantity</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full bg-[#242424] border border-amber-500/40 rounded-lg px-2.5 py-1 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-400 mt-0.5"
                  required
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Difference</span>
                <div
                  className={`text-lg font-bold font-mono mt-1 ${
                    difference > 0
                      ? 'text-emerald-400'
                      : difference < 0
                      ? 'text-[#D6181F]'
                      : 'text-gray-400'
                  }`}
                >
                  {difference > 0 ? `+${difference}` : difference}{' '}
                  <span className="text-xs font-normal text-gray-500">{selectedPart?.unit}</span>
                </div>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Audit Reason <span className="text-[#D6181F]">*</span>
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 mb-2"
              >
                {COMMON_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Specific audit details or supervisor explanation..."
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Date & Admin User */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Audit Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Authorized Admin
                </label>
                <div className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin (Permanent Audit Log)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValidNewStock || difference === 0}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  !isValidNewStock || difference === 0
                    ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Apply Adjustment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

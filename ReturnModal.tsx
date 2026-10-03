import React, { useState } from 'react';
import { HeroPart } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { X, RotateCcw, CheckCircle2, AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface ReturnModalProps {
  initialPart?: HeroPart | null;
  onClose: () => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  initialPart,
  onClose,
}) => {
  const { parts, processReturn } = usePartsInventory();
  const activeParts = parts.filter((p) => !p.isArchived);

  const [returnType, setReturnType] = useState<'customer_return' | 'supplier_return'>('customer_return');
  const [selectedPartId, setSelectedPartId] = useState<string>(
    initialPart?.id || (activeParts.length > 0 ? activeParts[0].id : '')
  );
  const [quantity, setQuantity] = useState<string>('1');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [reason, setReason] = useState<string>('Customer Purchased Wrong Variant / Unopened');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const selectedPart = activeParts.find((p) => p.id === selectedPartId);
  const parsedQty = Math.max(0, parseInt(quantity, 10) || 0);
  const currentStock = selectedPart ? selectedPart.currentStock : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPartId) {
      setError('Please select a part.');
      return;
    }

    if (parsedQty <= 0) {
      setError('Return quantity must be greater than 0.');
      return;
    }

    if (returnType === 'supplier_return' && parsedQty > currentStock) {
      setError(`Cannot return more than available stock (${currentStock} ${selectedPart?.unit}) to supplier.`);
      return;
    }

    if (!reason.trim()) {
      setError('Return reason is required.');
      return;
    }

    const res = await processReturn({
      partId: selectedPartId,
      quantity: parsedQty,
      type: returnType,
      invoiceNumber: invoiceNumber.trim() || undefined,
      reason: reason.trim(),
      date,
      notes: notes.trim() || undefined,
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to process return.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Returns Processing
              </h2>
              <p className="text-[11px] text-gray-400">
                Customer Return (Adds to Stock) or Supplier Return (Reduces Stock)
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
              {returnType === 'customer_return' ? 'Customer Return Accepted!' : 'Supplier Return Dispatched!'}
            </h3>
            <p className="text-xs text-gray-300">
              {returnType === 'customer_return'
                ? `Added +${parsedQty} ${selectedPart?.unit} back to inventory.`
                : `Deducted -${parsedQty} ${selectedPart?.unit} from inventory for OEM return.`}
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

            {/* Return Type Selector */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-[#1a1a1a] rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setReturnType('customer_return')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  returnType === 'customer_return'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Customer Return (+Stock)
              </button>
              <button
                type="button"
                onClick={() => setReturnType('supplier_return')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  returnType === 'supplier_return'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Supplier Return (-Stock)
              </button>
            </div>

            {/* Select Part */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Select Part <span className="text-[#D6181F]">*</span>
              </label>
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled>
                  -- Select a Hero Part --
                </option>
                {activeParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.partNumber}] {p.partName} (Current: {p.currentStock} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Return Quantity <span className="text-[#D6181F]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-400 font-medium">
                    {selectedPart?.unit || 'Pcs'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Invoice / Reference
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-904"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase font-mono"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Reason for Return <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Customer cancelled fitting / Manufacturing defect / Wrong part issued"
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional remarks"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
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
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Process Return
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HeroPart } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { X, ArrowDownRight, Package, Calendar, FileText, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

interface StockInModalProps {
  initialPart?: HeroPart | null;
  onClose: () => void;
  onOpenAddNewPart?: () => void;
}

export const StockInModal: React.FC<StockInModalProps> = ({
  initialPart,
  onClose,
  onOpenAddNewPart,
}) => {
  const { parts, suppliers, stockIn } = usePartsInventory();
  const activeParts = parts.filter((p) => !p.isArchived);

  const [selectedPartId, setSelectedPartId] = useState<string>(
    initialPart?.id || (activeParts.length > 0 ? activeParts[0].id : '')
  );
  const [quantity, setQuantity] = useState<string>('1');
  const [purchasePrice, setPurchasePrice] = useState<string>(
    initialPart?.purchasePrice !== null && initialPart?.purchasePrice !== undefined
      ? String(initialPart.purchasePrice)
      : ''
  );
  const [supplier, setSupplier] = useState<string>(
    initialPart?.supplier || (suppliers[0]?.name || 'Hero MotoCorp Regional Spares Depot (North India)')
  );
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const selectedPart = activeParts.find((p) => p.id === selectedPartId);

  const handlePartChange = (partId: string) => {
    setSelectedPartId(partId);
    const p = activeParts.find((item) => item.id === partId);
    if (p) {
      if (p.purchasePrice) setPurchasePrice(String(p.purchasePrice));
      if (p.supplier) setSupplier(p.supplier);
    }
  };

  const parsedQty = Math.max(0, parseInt(quantity, 10) || 0);
  const currentStock = selectedPart ? selectedPart.currentStock : 0;
  const newStock = currentStock + parsedQty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPartId) {
      setError('Please select a part to stock in.');
      return;
    }

    if (parsedQty <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }

    const res = await stockIn({
      partId: selectedPartId,
      quantity: parsedQty,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
      supplier,
      invoiceNumber: invoiceNumber.trim() || undefined,
      date,
      notes,
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to complete stock in.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Stock In (Goods Receipt)
              </h2>
              <p className="text-[11px] text-gray-400">
                Receive new genuine spare parts consignment into inventory
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
              Stock In Successfully Recorded!
            </h3>
            <p className="text-xs text-gray-300">
              Added <span className="text-emerald-400 font-bold font-mono">+{parsedQty}</span> units to{' '}
              <span className="text-white font-semibold">{selectedPart?.partName}</span>.
              <br />
              New Current Stock: <span className="text-white font-bold font-mono">{newStock} {selectedPart?.unit}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Part */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Select Genuine Part <span className="text-[#D6181F]">*</span>
                </label>
                {onOpenAddNewPart && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddNewPart();
                    }}
                    className="text-[11px] text-[#D6181F] hover:underline font-semibold"
                  >
                    + Create New Part Master
                  </button>
                )}
              </div>
              <select
                value={selectedPartId}
                onChange={(e) => handlePartChange(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              >
                <option value="" disabled>
                  -- Select a Hero Part --
                </option>
                {activeParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.partNumber}] {p.partName} (Curr: {p.currentStock} {p.unit}) - {p.rackNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Part Quick Summary Card */}
            {selectedPart && (
              <div className="p-3 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Part Information</span>
                  <div className="font-mono font-bold text-emerald-400 text-xs">{selectedPart.partNumber}</div>
                  <div className="text-white font-medium truncate max-w-[280px]">{selectedPart.partName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Storage Bin</span>
                  <div className="text-white font-semibold">
                    {selectedPart.rackNumber} • {selectedPart.shelfNumber}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Category: <span className="text-gray-200">{selectedPart.category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity & Stock Calculation Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Stock In Quantity <span className="text-[#D6181F]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter units received"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">
                    {selectedPart?.unit || 'Pcs'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Unit Purchase Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400">₹</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="e.g. 205"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-7 pr-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Preview Banner */}
            {selectedPart && parsedQty > 0 && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Stock Calculation:</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-gray-400">{currentStock}</span>
                  <span className="text-emerald-400 font-bold mx-1.5">+{parsedQty}</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-white font-bold ml-1.5 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    {newStock} {selectedPart.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Supplier & Invoice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Supplier
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Hero Spares Depot / Vendor"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Invoice / Challan Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-HMCL-2026-901"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-mono"
                />
              </div>
            </div>

            {/* Date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                  placeholder="e.g. Regular monthly restock"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Stock In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

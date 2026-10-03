import React, { useState } from 'react';
import { HeroPart } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { X, ArrowUpRight, AlertOctagon, CheckCircle2, AlertCircle, FileSpreadsheet, Wrench, User, Hash } from 'lucide-react';

interface StockOutModalProps {
  initialPart?: HeroPart | null;
  onClose: () => void;
}

export const StockOutModal: React.FC<StockOutModalProps> = ({
  initialPart,
  onClose,
}) => {
  const { parts, stockOut } = usePartsInventory();
  const activeParts = parts.filter((p) => !p.isArchived);

  const [selectedPartId, setSelectedPartId] = useState<string>(
    initialPart?.id || (activeParts.length > 0 ? activeParts[0].id : '')
  );
  const [quantity, setQuantity] = useState<string>('1');
  const [customerName, setCustomerName] = useState<string>('');
  const [vehicleRegNo, setVehicleRegNo] = useState<string>('');
  const [jobCardNumber, setJobCardNumber] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>(
    initialPart?.sellingPrice !== null && initialPart?.sellingPrice !== undefined
      ? String(initialPart.sellingPrice)
      : initialPart?.mrp !== null && initialPart?.mrp !== undefined
      ? String(initialPart.mrp)
      : ''
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const selectedPart = activeParts.find((p) => p.id === selectedPartId);

  const handlePartChange = (partId: string) => {
    setSelectedPartId(partId);
    const p = activeParts.find((item) => item.id === partId);
    if (p) {
      if (p.sellingPrice) setSellingPrice(String(p.sellingPrice));
      else if (p.mrp) setSellingPrice(String(p.mrp));
      else setSellingPrice('');
    }
  };

  const parsedQty = Math.max(0, parseInt(quantity, 10) || 0);
  const currentStock = selectedPart ? selectedPart.currentStock : 0;
  const isInsufficient = parsedQty > currentStock;
  const remainingStock = Math.max(0, currentStock - parsedQty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPartId) {
      setError('Please select a part to issue/sell.');
      return;
    }

    if (parsedQty <= 0) {
      setError('Stock Out quantity must be greater than 0.');
      return;
    }

    if (isInsufficient) {
      setError(`Insufficient Stock! Available: ${currentStock} ${selectedPart?.unit}, requested: ${parsedQty} ${selectedPart?.unit}.`);
      return;
    }

    const res = await stockOut({
      partId: selectedPartId,
      quantity: parsedQty,
      customerName: customerName.trim() || undefined,
      vehicleRegNo: vehicleRegNo.trim() || undefined,
      jobCardNumber: jobCardNumber.trim() || undefined,
      invoiceNumber: invoiceNumber.trim() || undefined,
      sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
      date,
      notes: notes.trim() || undefined,
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to complete stock out.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Stock Out (Dispense / Job Card Sale)
              </h2>
              <p className="text-[11px] text-gray-400">
                Issue genuine spare part for workshop servicing or counter sale
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
              Stock Out Successfully Issued!
            </h3>
            <p className="text-xs text-gray-300">
              Dispensed <span className="text-[#D6181F] font-bold font-mono">-{parsedQty}</span> units of{' '}
              <span className="text-white font-semibold">{selectedPart?.partName}</span>.
              <br />
              Remaining Stock: <span className="text-emerald-400 font-bold font-mono">{remainingStock} {selectedPart?.unit}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium">
                <AlertOctagon className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Part */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Select Genuine Part <span className="text-[#D6181F]">*</span>
              </label>
              <select
                value={selectedPartId}
                onChange={(e) => handlePartChange(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors"
                required
              >
                <option value="" disabled>
                  -- Select a Hero Part --
                </option>
                {activeParts.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.currentStock <= 0}>
                    [{p.partNumber}] {p.partName} - Available: {p.currentStock} {p.unit}{' '}
                    {p.currentStock <= 0 ? '(OUT OF STOCK)' : `(${p.rackNumber})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Part Quick Summary Card */}
            {selectedPart && (
              <div className="p-3 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-mono font-bold text-[#D6181F] text-xs">{selectedPart.partNumber}</div>
                  <div className="text-white font-medium truncate max-w-[260px]">{selectedPart.partName}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Location: <span className="text-white font-semibold">{selectedPart.rackNumber} • {selectedPart.shelfNumber}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Available Stock</span>
                  <div className={`text-base font-black font-mono ${selectedPart.currentStock === 0 ? 'text-red-500' : selectedPart.currentStock <= selectedPart.minStockLevel ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedPart.currentStock} {selectedPart.unit}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    MRP: <span className="text-white">{selectedPart.mrp ? `₹${selectedPart.mrp}` : 'MRP Not Added'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Input with Live Insufficient Stock Warning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Issue Quantity <span className="text-[#D6181F]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity to issue"
                    className={`w-full bg-[#1c1c1c] border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition-colors ${
                      isInsufficient
                        ? 'border-red-500 ring-2 ring-red-500/20'
                        : 'border-white/15 focus:border-[#D6181F]'
                    }`}
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">
                    {selectedPart?.unit || 'Pcs'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Selling Price per Unit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400">₹</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder={selectedPart?.mrp ? String(selectedPart.mrp) : 'MRP Not Added'}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-7 pr-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>
            </div>

            {/* Insufficient Stock Alert */}
            {isInsufficient && (
              <div className="p-3 bg-red-950/80 border-2 border-red-500 rounded-xl flex items-center justify-between text-xs animate-pulse">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="font-extrabold uppercase tracking-wide">
                    Insufficient Stock
                  </span>
                </div>
                <div className="text-red-300 text-right">
                  Only <span className="font-bold text-white font-mono">{currentStock}</span> available. Cannot issue {parsedQty}.
                </div>
              </div>
            )}

            {/* Live Calculation Preview Banner */}
            {selectedPart && !isInsufficient && parsedQty > 0 && (
              <div className="p-3 bg-[#181818] border border-white/10 rounded-xl flex items-center justify-between text-xs">
                <span className="text-gray-300">Remaining Balance:</span>
                <div className="font-mono text-xs">
                  <span className="text-gray-400">{currentStock}</span>
                  <span className="text-[#D6181F] font-bold mx-1.5">-{parsedQty}</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-white font-bold ml-1.5 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    {remainingStock} {selectedPart.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Workshop & Customer Reference Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Job Card Number (Optional)
                </label>
                <div className="relative">
                  <Wrench className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={jobCardNumber}
                    onChange={(e) => setJobCardNumber(e.target.value)}
                    placeholder="e.g. JC-2026-081"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Vehicle Reg. Number (Optional)
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={vehicleRegNo}
                    onChange={(e) => setVehicleRegNo(e.target.value)}
                    placeholder="e.g. RJ05-AB-1234"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Customer / Mechanic Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Invoice / Bill Number (Optional)
                </label>
                <div className="relative">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. INV-SRH-2026-441"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Notes / Work Description
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Periodic 10,000km general service"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
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
                disabled={isInsufficient || parsedQty <= 0 || currentStock <= 0}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isInsufficient || parsedQty <= 0 || currentStock <= 0
                    ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-[#D6181F] hover:bg-[#b5141a] shadow-lg shadow-[#D6181F]/30'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Confirm Stock Out
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

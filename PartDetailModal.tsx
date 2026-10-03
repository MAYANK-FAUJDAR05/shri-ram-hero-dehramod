import React, { useState } from 'react';
import { HeroPart, StockTransaction } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  X,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  Edit3,
  Archive,
  RotateCcw,
  Printer,
  Package,
  MapPin,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  Tag,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface PartDetailModalProps {
  part: HeroPart;
  onClose: () => void;
  onStockIn: (part: HeroPart) => void;
  onStockOut: (part: HeroPart) => void;
  onAdjustStock: (part: HeroPart) => void;
  onEditPart: (part: HeroPart) => void;
  onReturnPart: (part: HeroPart) => void;
  onPrintLabel: (part: HeroPart) => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  onClose,
  onStockIn,
  onStockOut,
  onAdjustStock,
  onEditPart,
  onReturnPart,
  onPrintLabel,
}) => {
  const { transactions, installations, stockMovements, userRole, archivePart, unarchivePart } = usePartsInventory();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  // Filter installations and movements for this part
  const partInstallations = (installations || []).filter(
    (i) => i.partId === part.id || i.partNumber === part.partNumber
  );
  const partMovements = (stockMovements || []).filter(
    (m) => m.partId === part.id || m.partNumber === part.partNumber
  );
  const partTransactions = transactions.filter((t) => t.partId === part.id || t.partNumber === part.partNumber);

  const isOutOfStock = part.currentStock === 0;
  const isLowStock = !isOutOfStock && part.currentStock <= part.minStockLevel;

  const [showArchiveConfirm, setShowArchiveConfirm] = useState<boolean>(false);

  const handleArchiveToggle = () => {
    if (part.isArchived) {
      unarchivePart(part.id);
      setShowArchiveConfirm(false);
    } else {
      setShowArchiveConfirm(true);
    }
  };

  const confirmArchive = () => {
    archivePart(part.id);
    setShowArchiveConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-[#191919] to-[#141414] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-black text-white bg-[#D6181F] px-2.5 py-0.5 rounded tracking-wider shadow">
                {part.partNumber}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {part.category}
              </span>
              {part.isArchived && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-600">
                  Archived Master
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Rajdhani'] uppercase tracking-wide">
              {part.partName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintLabel(part)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
              title="Print Hero Genuine Parts Bin Barcode Label"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="px-6 py-3 bg-[#181818] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Status:</span>
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  OUT OF STOCK
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  LOW STOCK ({part.currentStock} {part.unit})
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  IN STOCK ({part.currentStock} {part.unit})
                </span>
              )}
            </div>
            <div className="hidden sm:block text-xs text-gray-400">
              Min Reorder Level: <span className="text-white font-mono font-bold">{part.minStockLevel} {part.unit}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onStockIn(part)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              Stock In
            </button>
            <button
              onClick={() => onStockOut(part)}
              disabled={part.currentStock <= 0}
              className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm cursor-pointer ${
                part.currentStock <= 0
                  ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                  : 'bg-[#D6181F] hover:bg-[#b5141a]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Stock Out
            </button>

            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => onAdjustStock(part)}
                  className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] text-amber-400 hover:text-white border border-amber-500/30 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                  title="Admin Stock Adjustment"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Adjust
                </button>
                <button
                  onClick={() => onEditPart(part)}
                  className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] text-gray-200 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </>
            )}

            <button
              onClick={() => onReturnPart(part)}
              className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return
            </button>

            {userRole === 'admin' && (
              <button
                onClick={handleArchiveToggle}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                title={part.isArchived ? 'Restore Part to Active' : 'Archive Part safely'}
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Inline Archive Confirmation */}
        {showArchiveConfirm && (
          <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-3 text-xs">
            <span className="text-amber-200">
              Archive part <strong className="font-mono text-white">{part.partNumber}</strong>? It will be safely hidden while preserving transaction history.
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={confirmArchive}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold uppercase text-[10px]"
              >
                Confirm Archive
              </button>
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 rounded font-bold uppercase text-[10px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-white/10 flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#D6181F] text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Part Overview & Fitment
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#D6181F] text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Stock History ({partTransactions.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Pricing Cards - Rule: Clearly distinguish MRP, Purchase Price, Selling Price. If MRP unknown, show "MRP Not Added" */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                  Dealership Price Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* MRP */}
                  <div className="p-4 rounded-xl bg-[#191919] border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Official OEM MRP
                    </span>
                    <div className="mt-2">
                      {part.mrp !== null && part.mrp !== undefined ? (
                        <div className="text-xl font-black font-mono text-white">
                          ₹{part.mrp.toLocaleString('en-IN')}
                        </div>
                      ) : (
                        <div className="inline-block px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-bold font-mono border border-amber-500/30">
                          MRP Not Added
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Hero MotoCorp official circular</span>
                  </div>

                  {/* Purchase Price */}
                  <div className="p-4 rounded-xl bg-[#191919] border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Dealer Purchase Price
                    </span>
                    <div className="mt-2">
                      {part.purchasePrice !== null && part.purchasePrice !== undefined ? (
                        <div className="text-xl font-black font-mono text-emerald-400">
                          ₹{part.purchasePrice.toLocaleString('en-IN')}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs font-mono">Not set</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Ex-warehouse landing cost</span>
                  </div>

                  {/* Selling Price */}
                  <div className="p-4 rounded-xl bg-[#191919] border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Selling Price (Job / Counter)
                    </span>
                    <div className="mt-2">
                      {part.sellingPrice !== null && part.sellingPrice !== undefined ? (
                        <div className="text-xl font-black font-mono text-white">
                          ₹{part.sellingPrice.toLocaleString('en-IN')}
                        </div>
                      ) : part.mrp ? (
                        <div className="text-xl font-black font-mono text-white">
                          ₹{part.mrp.toLocaleString('en-IN')}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs font-mono">Same as MRP</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Dealership billing price</span>
                  </div>
                </div>
              </div>

              {/* Physical Storage Location & Stock Balances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location Card */}
                <div className="p-4 bg-[#191919] border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                    <MapPin className="w-4 h-4 text-[#D6181F]" />
                    <span>Storage Location & Bin</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-center min-w-24">
                      <span className="text-[9px] font-bold text-gray-500 uppercase block">Rack</span>
                      <span className="text-base font-extrabold text-white font-mono">{part.rackNumber}</span>
                    </div>
                    <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-center min-w-24">
                      <span className="text-[9px] font-bold text-gray-500 uppercase block">Shelf / Bin</span>
                      <span className="text-base font-extrabold text-white font-mono">{part.shelfNumber}</span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <div>Supplier: <span className="text-white font-semibold">{part.supplier}</span></div>
                      <div>Unit: <span className="text-white font-semibold">{part.unit}</span></div>
                    </div>
                  </div>
                </div>

                {/* Stock Audit Balance */}
                <div className="p-4 bg-[#191919] border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>Inventory Quantities</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-black/50 rounded-lg">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Opening</span>
                      <span className="text-sm font-bold font-mono text-gray-300">{part.openingStock}</span>
                    </div>
                    <div className="p-2 bg-black/50 rounded-lg">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Current</span>
                      <span className={`text-sm font-black font-mono ${part.currentStock === 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                        {part.currentStock}
                      </span>
                    </div>
                    <div className="p-2 bg-black/50 rounded-lg">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Min Alert</span>
                      <span className="text-sm font-bold font-mono text-amber-400">{part.minStockLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatible Hero Models */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                  Compatible Hero Two-Wheelers ({part.applicableModels.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {part.applicableModels.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-gray-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                {part.applicableModelVariant && (
                  <p className="text-xs text-gray-400 mt-2">
                    Fitment Variant: <span className="text-white font-medium">{part.applicableModelVariant}</span>
                  </p>
                )}
              </div>

              {/* Notes & Timestamp */}
              {part.notes && (
                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Workshop & Technical Notes
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">{part.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-white/10">
                <span>Date Added: {part.dateAdded}</span>
                <span>Last Updated: {part.lastUpdated}</span>
              </div>
            </div>
          ) : (
            /* Stock History Log */
            <div className="space-y-6">
              {/* SECTION A: BIKE INSTALLATIONS HISTORY (PROMPT #5 REQUIREMENT) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Bike Installation History ({partInstallations.length} installs)
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Which bike, mechanic, job card & admin used this part
                  </span>
                </div>

                {partInstallations.length > 0 ? (
                  <div className="border border-white/10 rounded-xl overflow-x-auto shadow-md">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1c1c1c] text-gray-300 uppercase text-[10px] font-bold border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Time</th>
                          <th className="py-2.5 px-3">Bike No.</th>
                          <th className="py-2.5 px-3">Bike Model</th>
                          <th className="py-2.5 px-3">Job Card</th>
                          <th className="py-2.5 px-3 text-center">Quantity</th>
                          <th className="py-2.5 px-3">Mechanic</th>
                          <th className="py-2.5 px-3">Entered By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#141414]">
                        {partInstallations.map((inst) => (
                          <tr key={inst.id} className="hover:bg-white/[0.03]">
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-gray-300 text-[11px]">
                              {inst.installationDate}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-gray-400 text-[11px]">
                              {inst.installationTime}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/15">
                                {inst.registrationNumber}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-200 font-medium whitespace-nowrap">
                              {inst.bikeModel}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-amber-400">
                              {inst.jobCardNumber}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-400">
                              {inst.quantity} {part.unit}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-gray-300 font-medium">
                              {inst.mechanicName}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-gray-400 text-[11px]">
                              {inst.enteredByName || 'Admin'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5 text-gray-500 text-xs bg-black/40 rounded-xl border border-white/5">
                    No bike installation recorded yet for this part.
                  </div>
                )}
              </div>

              {/* SECTION B: DOUBLE-ENTRY STOCK MOVEMENTS & PURCHASES */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Purchases & Ledger History ({partTransactions.length})
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Stock ins, supplier receipts & physical adjustments
                  </span>
                </div>

                {partTransactions.length > 0 ? (
                  <div className="border border-white/10 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-3">Date / Time</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Qty</th>
                          <th className="py-2.5 px-3">Prev → New</th>
                          <th className="py-2.5 px-3">Reference / Job</th>
                          <th className="py-2.5 px-3">User / Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {partTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-3 whitespace-nowrap text-gray-400 font-mono text-[11px]">
                              {tx.date} <span className="text-gray-500 text-[10px]">{tx.time}</span>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              {tx.type === 'stock_in' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Stock In
                                </span>
                              )}
                              {tx.type === 'stock_out' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6181F]/20 text-[#D6181F] border border-[#D6181F]/30">
                                  Stock Out
                                </span>
                              )}
                              {tx.type === 'adjustment' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  Adjustment
                                </span>
                              )}
                              {tx.type === 'customer_return' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  Customer Ret
                                </span>
                              )}
                              {tx.type === 'supplier_return' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                  Supplier Ret
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold">
                              {tx.type === 'stock_in' || tx.type === 'customer_return' ? (
                                <span className="text-emerald-400">+{tx.quantity}</span>
                              ) : (
                                <span className="text-[#D6181F]">-{tx.quantity}</span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono text-gray-400 whitespace-nowrap text-[11px]">
                              {tx.previousStock} → <span className="text-white font-bold">{tx.newStock}</span>
                            </td>
                            <td className="py-2 px-3 text-gray-300 font-mono text-[11px]">
                              {tx.referenceNumber || '-'}
                              {tx.jobCardNumber && <div className="text-[10px] text-gray-400">{tx.jobCardNumber}</div>}
                            </td>
                            <td className="py-2 px-3 text-gray-300 max-w-xs truncate">
                              <span className="text-gray-400">{tx.user}</span>
                              {(tx.reason || tx.notes) && (
                                <div className="text-[10px] text-gray-500 truncate">{tx.reason || tx.notes}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5 text-gray-500 text-xs bg-black/40 rounded-xl border border-white/5">
                    No stock transactions recorded yet for this part.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

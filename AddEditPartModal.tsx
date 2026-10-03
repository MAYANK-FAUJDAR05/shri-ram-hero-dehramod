import React, { useState } from 'react';
import { HeroPart } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import { HERO_MODELS_LIST } from '../../data/heroPartsData';
import { X, Plus, Edit3, CheckCircle2, AlertCircle, Sparkles, Building, Layers } from 'lucide-react';

interface AddEditPartModalProps {
  partToEdit?: HeroPart | null;
  onClose: () => void;
}

const COMMON_UNITS = ['Pcs', 'Set', 'Pkt', 'Litre', 'Metre', 'Box', 'Roll', 'Kg'];
const COMMON_RACKS = ['Rack A', 'Rack B', 'Rack C', 'Rack D', 'Rack E', 'Rack F', 'Rack G', 'Rack H'];
const COMMON_SHELVES = ['Shelf 1', 'Shelf 2', 'Shelf 3', 'Shelf 4', 'Bin 01', 'Bin 02', 'Bin 05', 'Pallet 1'];

export const AddEditPartModal: React.FC<AddEditPartModalProps> = ({
  partToEdit,
  onClose,
}) => {
  const { categories, suppliers, addPart, updatePart, userRole } = usePartsInventory();
  const isEditing = Boolean(partToEdit);

  const [partNumber, setPartNumber] = useState<string>(partToEdit?.partNumber || '');
  const [partName, setPartName] = useState<string>(partToEdit?.partName || '');
  const [category, setCategory] = useState<string>(partToEdit?.category || categories[0] || 'Engine Parts');
  const [subcategory, setSubcategory] = useState<string>(partToEdit?.subcategory || '');
  const [selectedModels, setSelectedModels] = useState<string[]>(
    partToEdit?.applicableModels || ['Splendor+', 'HF Deluxe']
  );
  const [applicableModelVariant, setApplicableModelVariant] = useState<string>(
    partToEdit?.applicableModelVariant || 'All Variants'
  );

  // Price fields - rule: do NOT guess prices. If unknown, leave null and display "MRP Not Added"
  const [isMRPUnknown, setIsMRPUnknown] = useState<boolean>(partToEdit ? partToEdit.mrp === null : false);
  const [mrp, setMrp] = useState<string>(
    partToEdit?.mrp !== null && partToEdit?.mrp !== undefined ? String(partToEdit.mrp) : ''
  );
  const [purchasePrice, setPurchasePrice] = useState<string>(
    partToEdit?.purchasePrice !== null && partToEdit?.purchasePrice !== undefined
      ? String(partToEdit.purchasePrice)
      : ''
  );
  const [sellingPrice, setSellingPrice] = useState<string>(
    partToEdit?.sellingPrice !== null && partToEdit?.sellingPrice !== undefined
      ? String(partToEdit.sellingPrice)
      : ''
  );

  const [openingStock, setOpeningStock] = useState<string>(
    partToEdit ? String(partToEdit.openingStock) : '10'
  );
  const [minStockLevel, setMinStockLevel] = useState<string>(
    partToEdit ? String(partToEdit.minStockLevel) : '5'
  );
  const [unit, setUnit] = useState<string>(partToEdit?.unit || 'Pcs');
  const [rackNumber, setRackNumber] = useState<string>(partToEdit?.rackNumber || 'Rack A');
  const [shelfNumber, setShelfNumber] = useState<string>(partToEdit?.shelfNumber || 'Shelf 1');
  const [supplier, setSupplier] = useState<string>(
    partToEdit?.supplier || (suppliers[0]?.name || 'Hero MotoCorp Regional Spares Depot')
  );
  const [notes, setNotes] = useState<string>(partToEdit?.notes || '');
  const [partImage, setPartImage] = useState<string>(partToEdit?.partImage || '');

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      if (selectedModels.length === 1) return; // Keep at least one
      setSelectedModels((prev) => prev.filter((m) => m !== model));
    } else {
      setSelectedModels((prev) => [...prev, model]);
    }
  };

  const handleSelectAllModels = () => {
    setSelectedModels(['Universal / All Hero Models']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userRole !== 'admin') {
      setError('Unauthorized: Only Admin can add or edit parts.');
      return;
    }

    if (!partNumber.trim()) {
      setError('Hero Part Number is mandatory (e.g. 17211-KCC-9000).');
      return;
    }

    if (!partName.trim()) {
      setError('Part Name is mandatory.');
      return;
    }

    const parsedMRP = isMRPUnknown || !mrp.trim() ? null : parseFloat(mrp);
    const parsedPurchase = !purchasePrice.trim() ? null : parseFloat(purchasePrice);
    const parsedSelling = !sellingPrice.trim() ? null : parseFloat(sellingPrice);
    const parsedOpening = Math.max(0, parseInt(openingStock, 10) || 0);
    const parsedMinStock = Math.max(1, parseInt(minStockLevel, 10) || 5);

    if (isEditing && partToEdit) {
      const res = await updatePart(partToEdit.id, {
        partNumber: partNumber.trim().toUpperCase(),
        partName: partName.trim(),
        category,
        subcategory: subcategory.trim() || category,
        applicableModels: selectedModels,
        applicableModelVariant: applicableModelVariant.trim() || 'All Variants',
        mrp: parsedMRP,
        purchasePrice: parsedPurchase,
        sellingPrice: parsedSelling,
        minStockLevel: parsedMinStock,
        unit,
        rackNumber,
        shelfNumber,
        supplier,
        notes: notes.trim(),
        partImage: partImage.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 1000);
      } else {
        setError(res.error || 'Failed to update part.');
      }
    } else {
      const res = await addPart({
        partNumber: partNumber.trim().toUpperCase(),
        partName: partName.trim(),
        category,
        subcategory: subcategory.trim() || category,
        applicableModels: selectedModels,
        applicableModelVariant: applicableModelVariant.trim() || 'All Variants',
        mrp: parsedMRP,
        purchasePrice: parsedPurchase,
        sellingPrice: parsedSelling,
        openingStock: parsedOpening,
        minStockLevel: parsedMinStock,
        unit,
        rackNumber,
        shelfNumber,
        supplier,
        notes: notes.trim(),
        partImage: partImage.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 1000);
      } else {
        setError(res.error || 'Failed to add part.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                {isEditing ? 'Edit Hero Genuine Part' : 'Add New Hero Genuine Part'}
              </h2>
              <p className="text-[11px] text-gray-400">
                Official OEM spare part master catalog entry
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
              {isEditing ? 'Part Master Successfully Updated!' : 'New Genuine Part Added!'}
            </h3>
            <p className="text-xs text-gray-300">
              {partName} ({partNumber.toUpperCase()}) is now saved in the system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Hero Part Number <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g. 17211-KCC-9000 / 90306-KST-941"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Part Name <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. Air Cleaner Filter / Hex Nut M10"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Category <span className="text-[#D6181F]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Fasteners / Filter Element / Disc Pad"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>
            </div>

            {/* Applicable Hero Models Multi-Select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Compatible Hero Models <span className="text-[#D6181F]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllModels}
                  className="text-[11px] text-[#D6181F] hover:underline font-semibold"
                >
                  Set Universal (Fits All Models)
                </button>
              </div>
              <div className="p-3 bg-[#1a1a1a] border border-white/10 rounded-xl max-h-36 overflow-y-auto flex flex-wrap gap-1.5">
                {HERO_MODELS_LIST.map((model) => {
                  const isChecked = selectedModels.includes(model);
                  return (
                    <button
                      key={model}
                      type="button"
                      onClick={() => toggleModel(model)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        isChecked
                          ? 'bg-[#D6181F] text-white shadow-sm'
                          : 'bg-[#252525] text-gray-400 hover:text-white hover:bg-[#303030]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {model}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Variant */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Applicable Model Variant / Fitment Notes
              </label>
              <input
                type="text"
                value={applicableModelVariant}
                onChange={(e) => setApplicableModelVariant(e.target.value)}
                placeholder="e.g. All BS6 Fi Commuters / Front Disc Models / 97.2cc OHC Engine"
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
              />
            </div>

            {/* Pricing Section - Rules: Distinguish MRP, Purchase Price, Selling Price. Do NOT invent MRP. */}
            <div className="p-4 bg-[#181818] border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Price Specification (Official Dealership Master)
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                  <input
                    type="checkbox"
                    checked={isMRPUnknown}
                    onChange={(e) => {
                      setIsMRPUnknown(e.target.checked);
                      if (e.target.checked) setMrp('');
                    }}
                    className="rounded border-white/20 text-[#D6181F] focus:ring-0"
                  />
                  <span>MRP Unknown (Show "MRP Not Added")</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    Official MRP (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-gray-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      disabled={isMRPUnknown}
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      placeholder={isMRPUnknown ? 'MRP Not Added' : 'Official MRP'}
                      className="w-full bg-[#202020] border border-white/15 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-yellow-400 disabled:opacity-40 disabled:bg-[#151515]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    Purchase Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-gray-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="Dealer cost price"
                      className="w-full bg-[#202020] border border-white/15 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    Selling Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-gray-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="Counter / Job price"
                      className="w-full bg-[#202020] border border-white/15 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Levels & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {!isEditing && (
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                    Opening Stock <span className="text-[#D6181F]">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={openingStock}
                    onChange={(e) => setOpeningStock(e.target.value)}
                    placeholder="Initial units in hand"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D6181F]"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Minimum Stock Level <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={minStockLevel}
                  onChange={(e) => setMinStockLevel(e.target.value)}
                  placeholder="Low stock threshold"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Unit of Measurement
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                >
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Storage Rack & Shelf */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Rack Number
                </label>
                <input
                  type="text"
                  list="rack-suggestions"
                  value={rackNumber}
                  onChange={(e) => setRackNumber(e.target.value)}
                  placeholder="e.g. Rack A / A-03"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
                <datalist id="rack-suggestions">
                  {COMMON_RACKS.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Shelf / Bin Number
                </label>
                <input
                  type="text"
                  list="shelf-suggestions"
                  value={shelfNumber}
                  onChange={(e) => setShelfNumber(e.target.value)}
                  placeholder="e.g. Shelf 1 / Bin 04"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
                <datalist id="shelf-suggestions">
                  {COMMON_SHELVES.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Supplier / Vendor
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Official Spares Depot"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Technical Specifications & Bin Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Material spec, torque rating, thread size, or OEM circular info..."
                className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D6181F]"
              />
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
                className="px-6 py-2.5 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isEditing ? 'Save Changes' : 'Save Genuine Part'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

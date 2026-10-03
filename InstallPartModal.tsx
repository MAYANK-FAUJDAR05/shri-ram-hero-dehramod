import React, { useState, useEffect } from 'react';
import { HeroPart, MechanicRecord } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  Wrench,
  Bike,
  User,
  Phone,
  FileText,
  Calendar,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  ShieldAlert,
  Sparkles,
  Package,
} from 'lucide-react';

interface InstallPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPart?: HeroPart | null;
  onSuccess?: () => void;
}

export const InstallPartModal: React.FC<InstallPartModalProps> = ({
  isOpen,
  onClose,
  preselectedPart,
  onSuccess,
}) => {
  const { parts, mechanics, installPart } = usePartsInventory();

  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [partSearch, setPartSearch] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [bikeModel, setBikeModel] = useState<string>('Splendor+ XTEC');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [chassisNumber, setChassisNumber] = useState<string>('');
  const [engineNumber, setEngineNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerMobile, setCustomerMobile] = useState<string>('');
  const [jobCardNumber, setJobCardNumber] = useState<string>('');
  const [installationDate, setInstallationDate] = useState<string>('');
  const [installationTime, setInstallationTime] = useState<string>('');
  const [mechanicName, setMechanicName] = useState<string>('');
  const [odometerReading, setOdometerReading] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setInstallationDate(now.toISOString().split('T')[0]);
      setInstallationTime(now.toTimeString().split(' ')[0].slice(0, 5));
      setError('');
      setSuccess(false);
      setQuantity(1);

      if (preselectedPart) {
        setSelectedPartId(preselectedPart.id);
        if (preselectedPart.applicableModels && preselectedPart.applicableModels.length > 0) {
          setBikeModel(preselectedPart.applicableModels[0]);
        }
      } else if (parts.length > 0 && !selectedPartId) {
        const inStockPart = parts.find((p) => !p.isArchived && p.currentStock > 0);
        if (inStockPart) {
          setSelectedPartId(inStockPart.id);
        }
      }

      if (mechanics.length > 0 && !mechanicName) {
        setMechanicName(mechanics[0].name);
      }
    }
  }, [isOpen, preselectedPart, parts, mechanics]);

  if (!isOpen) return null;

  const currentPart = parts.find((p) => p.id === selectedPartId);

  const filteredParts = parts
    .filter((p) => !p.isArchived)
    .filter((p) => {
      if (!partSearch.trim()) return true;
      const s = partSearch.toLowerCase();
      return (
        p.partName.toLowerCase().includes(s) ||
        p.partNumber.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s)
      );
    });

  const handleSelectPart = (p: HeroPart) => {
    setSelectedPartId(p.id);
    if (p.applicableModels && p.applicableModels.length > 0) {
      setBikeModel(p.applicableModels[0]);
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPart) {
      setError('Please select a genuine Hero part.');
      return;
    }

    if (quantity <= 0) {
      setError('Installation quantity must be at least 1.');
      return;
    }

    if (currentPart.currentStock < quantity) {
      setError(
        `Insufficient stock! Only ${currentPart.currentStock} units available for ${currentPart.partName}. Cannot install ${quantity} units.`
      );
      return;
    }

    const cleanReg = registrationNumber.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanReg || cleanReg.length < 5) {
      setError('Please provide a valid Vehicle Registration Number (e.g., RJ05AB1234).');
      return;
    }

    const cleanJobCard = jobCardNumber.trim().toUpperCase();
    if (!cleanJobCard) {
      setError('Job Card Number is mandatory for anti-theft workshop tracking.');
      return;
    }

    if (!customerName.trim()) {
      setError('Customer Name is mandatory.');
      return;
    }

    if (!customerMobile.trim() || customerMobile.trim().length < 10) {
      setError('Please provide a valid 10-digit Customer Mobile Number.');
      return;
    }

    if (!mechanicName.trim()) {
      setError('Please select or specify the installing mechanic / technician.');
      return;
    }

    setLoading(true);
    const idempotencyKey = `install-${currentPart.id}-${cleanReg}-${cleanJobCard}-${Date.now()}`;

    const res = await installPart({
      partId: currentPart.id,
      quantity,
      bikeModel,
      registrationNumber: cleanReg,
      chassisNumber: chassisNumber.trim().toUpperCase(),
      engineNumber: engineNumber.trim().toUpperCase(),
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      jobCardNumber: cleanJobCard,
      installationDate,
      installationTime: installationTime ? `${installationTime}:00` : undefined,
      mechanicName: mechanicName.trim(),
      odometerReading: odometerReading ? parseInt(odometerReading, 10) : undefined,
      remarks: remarks.trim(),
      idempotencyKey,
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to submit part installation entry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shadow-lg shadow-[#D6181F]/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Record Part Installation Entry
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                  Anti-Theft Active
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Atomically deducts inventory stock and creates permanent bike-part service ledger
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto font-sans">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-3 font-medium animate-in fade-in duration-150">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <strong className="block text-white text-sm font-['Rajdhani'] uppercase">
                  Part Installation Recorded Successfully!
                </strong>
                <span>
                  Inventory stock atomically updated, stock movement ledger recorded, and linked to bike registration.
                </span>
              </div>
            </div>
          )}

          {/* Section 1: Part Selection & Stock Check */}
          <div className="p-4 bg-[#191919] border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#D6181F]" />
                <span>1. Select Part to Install</span>
              </span>
              {currentPart && (
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    currentPart.currentStock > currentPart.minStockLevel
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : currentPart.currentStock > 0
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  Available Stock: {currentPart.currentStock} {currentPart.unit}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Choose Hero Part <span className="text-[#D6181F]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedPartId}
                    onChange={(e) => {
                      const p = parts.find((x) => x.id === e.target.value);
                      if (p) handleSelectPart(p);
                    }}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors"
                    required
                  >
                    {filteredParts.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.currentStock <= 0}>
                        {p.partName} [{p.partNumber}] — Stock: {p.currentStock} {p.unit}
                        {p.currentStock <= 0 ? ' (OUT OF STOCK)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Quantity Installed <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={currentPart ? currentPart.currentStock : 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors font-mono font-bold"
                  required
                />
              </div>
            </div>

            {currentPart && (
              <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-[11px] flex flex-wrap items-center justify-between gap-2 text-gray-300">
                <div>
                  <span className="text-gray-500">Part No:</span>{' '}
                  <strong className="font-mono text-white">{currentPart.partNumber}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>{' '}
                  <span className="text-gray-200">{currentPart.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>{' '}
                  <span className="text-amber-400 font-mono">
                    {currentPart.rackNumber || 'Rack A'} - {currentPart.shelfNumber || 'Bin 01'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">MRP:</span>{' '}
                  <strong className="text-emerald-400 font-mono">₹{currentPart.mrp || currentPart.sellingPrice || '--'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Bike Details */}
          <div className="p-4 bg-[#191919] border border-white/10 rounded-xl space-y-3">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-blue-400" />
              <span>2. Bike / Vehicle Record</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Registration Number (Bike No.) <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. RJ05AB1234"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors font-mono font-bold tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Bike Model <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Splendor+ XTEC, HF Deluxe"
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Job Card Number <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. JC-2026-104"
                  value={jobCardNumber}
                  onChange={(e) => setJobCardNumber(e.target.value.toUpperCase())}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Chassis Number (Optional / VIN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBLHAW112P..."
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Engine Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HA11EPC..."
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-gray-400" />
                  <span>Odometer Reading (KM)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 14500"
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Customer & Workshop Details */}
          <div className="p-4 bg-[#191919] border border-white/10 rounded-xl space-y-3">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-yellow-400" />
              <span>3. Customer & Workshop Personnel</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Customer Name <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Customer Mobile <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98290XXXXX"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Mechanic / Technician <span className="text-[#D6181F]">*</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={mechanicName}
                    onChange={(e) => setMechanicName(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors"
                    required
                  >
                    {mechanics.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.specialization || 'Technician'})
                      </option>
                    ))}
                    <option value="Other Workshop Worker">Other / Custom Technician</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>Installation Date</span>
                </label>
                <input
                  type="date"
                  value={installationDate}
                  onChange={(e) => setInstallationDate(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>Installation Time</span>
                </label>
                <input
                  type="time"
                  value={installationTime}
                  onChange={(e) => setInstallationTime(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] transition-colors font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1">
                  Technician Remarks / Service Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Worn out old part, replaced during 10k service"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D6181F] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Anti-Theft Protection Notice */}
          <div className="p-3 bg-red-950/30 border border-[#D6181F]/30 rounded-xl text-[11px] text-gray-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#D6181F] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Anti-Theft Enforcement:</strong> Submitting this installation entry creates an immutable audit record and permanently links this part to bike{' '}
              <span className="text-white font-mono">{registrationNumber || 'RJ05...'}</span>. Quantity will be atomically decremented from inventory stock.
            </p>
          </div>

          {/* Actions */}
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
              disabled={loading || !currentPart || currentPart.currentStock < quantity}
              className="px-6 py-2 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Recording Installation...' : 'Confirm Part Installation & Deduct Stock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

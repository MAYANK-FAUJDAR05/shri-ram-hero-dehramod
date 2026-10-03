import React, { useState, useEffect } from 'react';
import { X, Bike, ShieldCheck, Calendar, MapPin, KeyRound, AlertCircle, Edit3 } from 'lucide-react';
import { VehicleRecord, VehicleType, VehicleStatus } from '../../types/vehicleStock';
import { useVehicleStock } from '../../context/VehicleStockContext';

interface EditVehicleModalProps {
  isOpen: boolean;
  vehicle: VehicleRecord | null;
  onClose: () => void;
  onSuccess?: (vehicle: VehicleRecord) => void;
}

const STATUS_OPTIONS: VehicleStatus[] = [
  'In Stock',
  'Reserved',
  'Sold',
  'Delivered',
  'On Hold',
  'Demo Vehicle',
  'Service / Workshop',
  'Transfer Pending',
];

const STORAGE_LOCATIONS = [
  'Showroom Floor A-01',
  'Showroom Floor A-02',
  'Showroom Floor A-03',
  'Showroom Floor B-01',
  'Showroom Scooter Wing S-01',
  'Showroom Premium Stage',
  'Godown Bay 1',
  'Godown Bay 2',
  'Godown Bay 3',
  'Delivery Bay B-01',
  'Test Ride Parking Bay',
  'Service Yard Gate 2',
  'Basement Holding Bay',
];

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onSuccess,
}) => {
  const { updateVehicle } = useVehicleStock();

  const [vehicleType, setVehicleType] = useState<VehicleType>('Motorcycle');
  const [modelName, setModelName] = useState<string>('');
  const [variant, setVariant] = useState<string>('');
  const [colour, setColour] = useState<string>('');
  const [modelYear, setModelYear] = useState<number>(2026);
  const [chassisNumber, setChassisNumber] = useState<string>('');
  const [engineNumber, setEngineNumber] = useState<string>('');
  const [keyNumber, setKeyNumber] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [status, setStatus] = useState<VehicleStatus>('In Stock');
  const [storageLocation, setStorageLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [changeReason, setChangeReason] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (vehicle) {
      setVehicleType(vehicle.vehicleType);
      setModelName(vehicle.modelName);
      setVariant(vehicle.variant);
      setColour(vehicle.colour);
      setModelYear(vehicle.modelYear);
      setChassisNumber(vehicle.chassisNumber);
      setEngineNumber(vehicle.engineNumber);
      setKeyNumber(vehicle.keyNumber || '');
      setArrivalDate(vehicle.arrivalDate || '');
      setPurchaseDate(vehicle.purchaseDate || '');
      setStatus(vehicle.status);
      setStorageLocation(vehicle.storageLocation || '');
      setNotes(vehicle.notes || '');
      setChangeReason('');
      setError('');
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const isStatusChanged = status !== vehicle.status;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!modelName.trim()) {
      setError('Model name cannot be empty.');
      return;
    }

    if (!chassisNumber.trim()) {
      setError('Chassis / VIN number is required.');
      return;
    }

    if (!engineNumber.trim()) {
      setError('Engine number is required.');
      return;
    }

    setLoading(true);
    const res = await updateVehicle(
      vehicle.id,
      {
        vehicleType,
        modelName: modelName.trim(),
        variant: variant.trim() || 'Standard',
        colour: colour.trim() || 'Standard',
        modelYear: Number(modelYear) || vehicle.modelYear,
        chassisNumber: chassisNumber.trim().toUpperCase(),
        engineNumber: engineNumber.trim().toUpperCase(),
        keyNumber: keyNumber.trim().toUpperCase() || 'N/A',
        arrivalDate,
        purchaseDate,
        status,
        storageLocation: storageLocation.trim() || 'Showroom Floor A-01',
        notes: notes.trim(),
      },
      changeReason.trim()
    );
    setLoading(false);

    if (res.success && res.vehicle) {
      if (onSuccess) onSuccess(res.vehicle);
      onClose();
    } else {
      setError(res.error || 'Failed to update vehicle.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shadow-lg shadow-[#D6181F]/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Edit Vehicle Record: <span className="text-[#D6181F] font-mono">{vehicle.stockId}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-mono font-bold uppercase">
                  Stock ID Locked
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Stock ID is immutable. All other parameters can be edited by authorized administrator.
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Stock ID Display Banner */}
          <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between text-xs">
            <span className="text-gray-400 uppercase tracking-wider text-[11px] font-bold">
              Permanent Dealership Stock ID:
            </span>
            <span className="font-mono text-sm font-black text-[#D6181F] bg-[#1a1a1a] px-3 py-1 rounded border border-[#D6181F]/40">
              {vehicle.stockId}
            </span>
          </div>

          {/* Type, Model, Variant */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Vehicle Type <span className="text-[#D6181F]">*</span>
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
              >
                <option value="Motorcycle">Motorcycle</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Model Name <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Variant <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                required
              />
            </div>
          </div>

          {/* Colour & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Colour <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="text"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Model Year <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="number"
                min={2020}
                max={2030}
                value={modelYear}
                onChange={(e) => setModelYear(Number(e.target.value))}
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F] font-mono"
                required
              />
            </div>
          </div>

          {/* SENSITIVE DEALERSHIP VEHICLE NUMBERS */}
          <div className="p-4 bg-red-950/20 border border-[#D6181F]/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#D6181F]" />
              <span>Sensitive Identification Records</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Chassis / VIN Number <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Engine Number <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Key Number
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={keyNumber}
                    onChange={(e) => setKeyNumber(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-lg pl-8 pr-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Status & Storage Location */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Arrival Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-[#1b1b1b] border border-white/15 rounded-lg pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Stock Entry Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-[#1b1b1b] border border-white/15 rounded-lg pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Stock Status <span className="text-[#D6181F]">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] font-bold"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Storage Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  list="edit-location-options"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full bg-[#1b1b1b] border border-white/15 rounded-lg pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
                <datalist id="edit-location-options">
                  {STORAGE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Reason for Status Change if status modified */}
          {isStatusChanged && (
            <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1.5 animate-in fade-in duration-150">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Status Change Reason (Recorded into Stock Movement History) <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="text"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder={`Reason for changing status from '${vehicle.status}' to '${status}' (e.g. Customer booking, Delivery, Sale)`}
                className="w-full bg-[#1b1b1b] border border-amber-500/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F]"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
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
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

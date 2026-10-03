import React, { useState } from 'react';
import { X, Bike, ShieldCheck, Tag, Calendar, MapPin, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { VehicleRecord, VehicleType, VehicleStatus } from '../../types/vehicleStock';
import { useVehicleStock } from '../../context/VehicleStockContext';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (vehicle: VehicleRecord) => void;
}

const HERO_MODELS: Record<VehicleType, { name: string; variants: string[]; colours: string[] }[]> = {
  Motorcycle: [
    {
      name: 'Hero Splendor+',
      variants: ['Self Start Alloy Wheel (i3S)', 'Black and Accent Edition', 'Matt Shield Gold', 'XTEC 2.0 (LED Headlamp)'],
      colours: ['Black with Sports Red', 'Black with Silver', 'Black with Purple', 'Heavy Grey with Green', 'Canvas Black'],
    },
    {
      name: 'Hero HF Deluxe',
      variants: ['Self Start Drum Cast (i3S)', 'Self Start Drum Alloy', 'Kick Start Drum Spoke'],
      colours: ['Techno Blue', 'Heavy Grey with Black', 'Candy Blazing Red', 'Black with Red'],
    },
    {
      name: 'Hero Passion Plus',
      variants: ['Drum Cast with i3S'],
      colours: ['Sports Red', 'Black Nexus Blue', 'Black Heavy Grey'],
    },
    {
      name: 'Hero Glamour XTEC',
      variants: ['Disc Cast (Bluetooth Navigation)', 'Drum Cast (Digital Meter)'],
      colours: ['Nexus Blue Metallic', 'Glossy Black', 'Candy Blazing Red', 'Matte Axis Grey'],
    },
    {
      name: 'Hero Super Splendor XTEC',
      variants: ['Disc Alloy (LED Headlamp)', 'Drum Alloy (i3S)'],
      colours: ['Gloss Black', 'Matte Grey', 'Candy Blazing Red', 'Dusky Black'],
    },
    {
      name: 'Hero Xtreme 125R',
      variants: ['Single Channel ABS (Front Disc)', 'Integrated Braking System (IBS)'],
      colours: ['Firestorm Red', 'Cobalt Blue', 'Stallion Black'],
    },
    {
      name: 'Hero Xpulse 200 4V',
      variants: ['Pro Edition (Long Travel USD)', 'Standard 4V (Dual Purpose)'],
      colours: ['Rally Edition White / Blue', 'Matte Nexus Blue', 'Techno Blue', 'Black Sports Red'],
    },
    {
      name: 'Hero Karizma XMR',
      variants: ['Dual Channel ABS (Liquid-Cooled DOHC)'],
      colours: ['Iconic Yellow', 'Turbo Red', 'Phantom Black'],
    },
    {
      name: 'Hero Mavrick 440',
      variants: ['Top Diamond Cut Alloy (e-Sim Connected)', 'Mid Alloy', 'Base Spoke Wheel'],
      colours: ['Arctic White', 'Fearless Red', 'Celestial Blue', 'Phantom Black', 'Enigma Black'],
    },
    {
      name: 'Hero Xtreme 160R 4V',
      variants: ['Pro Edition (USD Forks)', 'Standard Edition'],
      colours: ['Blazing Neon', 'Stealth Black', 'Matte Slate'],
    },
  ],
  Scooter: [
    {
      name: 'Hero Destini 125 XTEC',
      variants: ['ZX Disc (Chrome Package & Backrest)', 'VX Drum Cast', 'LX Base'],
      colours: ['Chestnut Brown', 'Nobel Red', 'Pearl Silver White', 'Panther Black', 'Matt Black'],
    },
    {
      name: 'Hero Xoom 110',
      variants: ['ZX Cast Disc (Cornering Lights)', 'VX Cast Drum', 'LX Sheet Drum'],
      colours: ['Polestar Blue', 'Black', 'Matte Abrax Orange', 'Sports Red', 'Pearl White'],
    },
    {
      name: 'Hero Pleasure+ XTEC',
      variants: ['Connected Drum Cast (Bluetooth)', 'VX Drum Cast', 'LX Drum'],
      colours: ['Pearl Silver White', 'Matte Black', 'Jubilant Yellow', 'Blazing Red', 'Pole Star Blue'],
    },
    {
      name: 'VIDA V1 Pro (EV)',
      variants: ['Pro (Removable Dual Battery)', 'Plus (Fast Charge)'],
      colours: ['Matte White', 'Matte Sports Red', 'Matte Abrax Orange', 'Cyan'],
    },
  ],
};

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

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addVehicle } = useVehicleStock();

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();

  const [vehicleType, setVehicleType] = useState<VehicleType>('Motorcycle');
  const [modelName, setModelName] = useState<string>('Hero Splendor+');
  const [customModel, setCustomModel] = useState<string>('');
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);

  const [variant, setVariant] = useState<string>('Self Start Alloy Wheel (i3S)');
  const [colour, setColour] = useState<string>('Black with Sports Red');
  const [modelYear, setModelYear] = useState<number>(currentYear);

  // SENSITIVE DEALERSHIP FIELDS
  const [chassisNumber, setChassisNumber] = useState<string>('');
  const [engineNumber, setEngineNumber] = useState<string>('');
  const [keyNumber, setKeyNumber] = useState<string>('');

  const [arrivalDate, setArrivalDate] = useState<string>(todayStr);
  const [purchaseDate, setPurchaseDate] = useState<string>(todayStr);
  const [status, setStatus] = useState<VehicleStatus>('In Stock');
  const [storageLocation, setStorageLocation] = useState<string>('Showroom Floor A-01');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  // Handle Type Change
  const handleTypeChange = (newType: VehicleType) => {
    setVehicleType(newType);
    setIsCustomModel(false);
    const first = HERO_MODELS[newType][0];
    if (first) {
      setModelName(first.name);
      setVariant(first.variants[0] || 'Standard');
      setColour(first.colours[0] || 'Standard');
    }
  };

  // Handle Model Change
  const handleModelChange = (selected: string) => {
    if (selected === '__CUSTOM__') {
      setIsCustomModel(true);
      setModelName('');
    } else {
      setIsCustomModel(false);
      setModelName(selected);
      const found = HERO_MODELS[vehicleType].find((m) => m.name === selected);
      if (found) {
        setVariant(found.variants[0] || 'Standard');
        setColour(found.colours[0] || 'Standard');
      }
    }
  };

  const currentModelObj = HERO_MODELS[vehicleType].find((m) => m.name === modelName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalModelName = isCustomModel ? customModel.trim() : modelName.trim();
    if (!finalModelName) {
      setError('Please select or specify a Hero motorcycle/scooter model.');
      return;
    }

    if (!chassisNumber.trim()) {
      setError('Please enter Vehicle Chassis / VIN Number.');
      return;
    }

    if (!engineNumber.trim()) {
      setError('Please enter Engine Number.');
      return;
    }

    setLoading(true);
    const res = await addVehicle({
      vehicleType,
      modelName: finalModelName,
      variant: variant.trim() || 'Standard',
      colour: colour.trim() || 'Standard',
      modelYear: Number(modelYear) || currentYear,
      chassisNumber: chassisNumber.trim().toUpperCase(),
      engineNumber: engineNumber.trim().toUpperCase(),
      keyNumber: keyNumber.trim().toUpperCase() || 'N/A',
      arrivalDate,
      purchaseDate,
      status,
      storageLocation: storageLocation.trim() || 'Showroom Floor A-01',
      notes: notes.trim(),
    });
    setLoading(false);

    if (res.success && res.vehicle) {
      if (onSuccess) onSuccess(res.vehicle);
      onClose();
    } else {
      setError(res.error || 'Failed to add vehicle to stock.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shadow-lg shadow-[#D6181F]/20">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  + Add New Vehicle to Dealership Stock
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                  Auto Stock ID
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Maintains individual VIN, Engine, Key numbers & updates model-level physical stock
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

          {/* 1. Vehicle Type Switcher */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              1. Vehicle Type <span className="text-[#D6181F]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('Motorcycle')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  vehicleType === 'Motorcycle'
                    ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-lg shadow-[#D6181F]/30'
                    : 'bg-[#1b1b1b] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Motorcycle / Bike</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Scooter')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  vehicleType === 'Scooter'
                    ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-lg shadow-[#D6181F]/30'
                    : 'bg-[#1b1b1b] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Scooter / Step-Through</span>
              </button>
            </div>
          </div>

          {/* 2. Model & Variant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Model Name */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                2. Model Name <span className="text-[#D6181F]">*</span>
              </label>
              {!isCustomModel ? (
                <select
                  value={modelName}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                >
                  {HERO_MODELS[vehicleType].map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Other / Enter Custom Model...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="Enter Hero model name..."
                    className="flex-1 bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomModel(false)}
                    className="px-2.5 py-1 text-[11px] bg-white/10 rounded-lg text-gray-300 hover:text-white"
                  >
                    Preset
                  </button>
                </div>
              )}
            </div>

            {/* Variant */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                3. Variant <span className="text-[#D6181F]">*</span>
              </label>
              {currentModelObj && currentModelObj.variants.length > 0 ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    list="variant-suggestions"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    placeholder="e.g. Self Start Alloy Wheel"
                    className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                    required
                  />
                  <datalist id="variant-suggestions">
                    {currentModelObj.variants.map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                </div>
              ) : (
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. Standard / Disc / Alloy"
                  className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  required
                />
              )}
            </div>
          </div>

          {/* 3. Colour & Model Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Colour */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                4. Colour <span className="text-[#D6181F]">*</span>
              </label>
              <input
                type="text"
                list="colour-suggestions"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                placeholder="e.g. Black with Sports Red"
                className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                required
              />
              {currentModelObj && (
                <datalist id="colour-suggestions">
                  {currentModelObj.colours.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              )}
            </div>

            {/* Model Year */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                5. Model Year <span className="text-[#D6181F]">*</span>
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

          {/* SENSITIVE DEALERSHIP VEHICLE IDENTIFICATION (ADMIN ONLY) */}
          <div className="p-4 bg-red-950/20 border border-[#D6181F]/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D6181F]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Physical Vehicle Identification Numbers (Dealership Confidential)
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                Admin Panel Protected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Chassis Number */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  6. Vehicle VIN / Chassis No. <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value)}
                  placeholder="e.g. MBHHA10EWRA102834"
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>

              {/* Engine Number */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  7. Engine Number <span className="text-[#D6181F]">*</span>
                </label>
                <input
                  type="text"
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value)}
                  placeholder="e.g. HA10ER8391024"
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D6181F]"
                  required
                />
              </div>

              {/* Key Number */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  8. Key Number
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={keyNumber}
                    onChange={(e) => setKeyNumber(e.target.value)}
                    placeholder="e.g. K-9021"
                    className="w-full bg-black/60 border border-white/15 rounded-lg pl-8 pr-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Status & Storage Location */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Arrival Date */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                9. Arrival Date
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

            {/* Stock Entry Date */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                10. Stock Entry Date
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

            {/* Status */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                11. Initial Status <span className="text-[#D6181F]">*</span>
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

            {/* Storage Location */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                12. Storage Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  list="location-options"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="Showroom Floor A-01"
                  className="w-full bg-[#1b1b1b] border border-white/15 rounded-lg pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
                <datalist id="location-options">
                  {STORAGE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
              13. Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Polished display unit with side guard installed. PDI verified."
              className="w-full bg-[#1b1b1b] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F]"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="text-[11px] text-gray-400">
              Unique Stock ID (e.g. <strong className="text-white">VH-XXXX</strong>) will be assigned permanently on save.
            </div>

            <div className="flex items-center gap-2">
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
                {loading ? 'Saving Vehicle...' : 'Save Vehicle to Stock'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

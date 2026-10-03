import React, { useState } from 'react';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  Wrench,
  User,
  Phone,
  Plus,
  CheckCircle2,
  X,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react';

interface MechanicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MechanicsModal: React.FC<MechanicsModalProps> = ({ isOpen, onClose }) => {
  const { mechanics, addMechanic, isAdmin } = usePartsInventory();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide mechanic name.');
      return;
    }

    setLoading(true);
    const res = await addMechanic(name.trim(), mobile.trim(), specialization.trim());
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setName('');
      setMobile('');
      setSpecialization('');
      setTimeout(() => {
        setSuccess(false);
        setShowAddForm(false);
      }, 1000);
    } else {
      setError(res.error || 'Failed to add technician.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                Workshop Mechanics & Technicians
              </h2>
              <p className="text-[11px] text-gray-400">
                Authorized dealership personnel permitted to draw and install Hero genuine parts
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

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Registered Technicians ({mechanics.length})
            </span>

            {isAdmin && !showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Mechanic</span>
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAdd} className="p-4 bg-[#1a1a1a] border border-white/15 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  New Technician Profile
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Technician added successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-[#D6181F]"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98290XXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-[#D6181F]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Engine Overhaul, Fi"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save Mechanic'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Technicians List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mechanics.map((m) => (
              <div
                key={m.id}
                className="p-3.5 bg-[#181818] border border-white/10 rounded-xl space-y-1.5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                        {m.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 block">
                        {m.specialization || 'General Technician'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                    Active
                  </span>
                </div>

                {m.mobile && (
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono pt-1">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span>+91 {m.mobile}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#121212] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

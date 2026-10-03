import React, { useState } from 'react';
import { X, Sliders, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { useVehicleStock } from '../../context/VehicleStockContext';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_HERO_MODELS = [
  'Hero Splendor+',
  'Hero HF Deluxe',
  'Hero Passion Plus',
  'Hero Glamour XTEC',
  'Hero Super Splendor XTEC',
  'Hero Xtreme 125R',
  'Hero Xpulse 200 4V',
  'Hero Karizma XMR',
  'Hero Mavrick 440',
  'Hero Destini 125 XTEC',
  'Hero Xoom 110',
  'Hero Pleasure+ XTEC',
  'VIDA V1 Pro (EV)',
];

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({ isOpen, onClose }) => {
  const { modelSettings, updateModelSetting, modelSummary } = useVehicleStock();

  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_HERO_MODELS[0]);
  const [minStock, setMinStock] = useState<number>(2);
  const [customModel, setCustomModel] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  // Build a map of existing settings
  const settingsMap = new Map<string, number>();
  for (const s of modelSettings) {
    if (s.modelName) {
      settingsMap.set(s.modelName.toLowerCase().trim(), s.minimumStock);
    }
  }

  // Also include any models present in current stock
  const allKnownModels = Array.from(
    new Set([...DEFAULT_HERO_MODELS, ...modelSummary.map((m) => m.modelName)])
  );

  const handleSelectModel = (name: string) => {
    setIsCustom(false);
    setSelectedModel(name);
    const existing = settingsMap.get(name.toLowerCase().trim());
    setMinStock(existing !== undefined ? existing : 2);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalModel = isCustom ? customModel.trim() : selectedModel.trim();
    if (!finalModel) return;

    setLoading(true);
    const res = await updateModelSetting(finalModel, minStock);
    setLoading(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      if (isCustom) {
        setIsCustom(false);
        setSelectedModel(finalModel);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                Model Stock Settings & Low Stock Thresholds
              </h2>
              <p className="text-[11px] text-gray-400">
                Set minimum physical showroom stock before "LOW STOCK" alert triggers
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
        <div className="p-6 space-y-5 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Threshold saved and live synchronized across all dealership dashboards!</span>
            </div>
          )}

          {/* Quick Explanation */}
          <div className="p-3.5 bg-black/50 border border-white/10 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-gray-300 text-[11px]">
              <p>
                When a model's available showroom stock drops to or below its minimum stock level, the system automatically flags it as <strong className="text-amber-400 font-bold">LOW STOCK</strong>.
              </p>
              <p>
                When available stock reaches zero, it automatically shows <strong className="text-red-400 font-bold">OUT OF STOCK</strong> on both Admin Panel and Public Website.
              </p>
            </div>
          </div>

          {/* Form to Set Minimum Stock */}
          <form onSubmit={handleSave} className="p-4 bg-[#191919] border border-white/10 rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Hero Motorcycle / Scooter Model
                </label>
                {!isCustom ? (
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      if (e.target.value === '__CUSTOM__') {
                        setIsCustom(true);
                      } else {
                        handleSelectModel(e.target.value);
                      }
                    }}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] font-bold"
                  >
                    {allKnownModels.map((m) => {
                      const curMin = settingsMap.get(m.toLowerCase().trim()) ?? 2;
                      return (
                        <option key={m} value={m}>
                          {m} (Min Stock: {curMin})
                        </option>
                      );
                    })}
                    <option value="__CUSTOM__">+ Enter Other Custom Model...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="e.g. Hero Xtreme 200S"
                      className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustom(false)}
                      className="px-2.5 py-1 text-[11px] bg-white/10 rounded text-gray-300 hover:text-white"
                    >
                      Presets
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Minimum Stock (Qty)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={minStock}
                    onChange={(e) => setMinStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D6181F]"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase rounded-lg cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Set'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Configured Models Overview Table */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Current Dealership Model Thresholds:
            </h4>
            <div className="max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#181818] border-b border-white/10 text-gray-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Model</th>
                    <th className="py-2 px-3 text-center">Minimum Required</th>
                    <th className="py-2 px-3 text-right">Quick Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allKnownModels.map((m) => {
                    const minVal = settingsMap.get(m.toLowerCase().trim()) ?? 2;
                    return (
                      <tr key={m} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{m}</td>
                        <td className="py-2 px-3 text-center font-mono">
                          <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 font-bold text-amber-400">
                            {minVal} units
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSelectModel(m)}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[10px] font-bold uppercase"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

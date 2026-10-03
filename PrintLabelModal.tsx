import React from 'react';
import { HeroPart } from '../../types/parts';
import { X, Printer, ShieldCheck, QrCode } from 'lucide-react';

interface PrintLabelModalProps {
  part: HeroPart;
  onClose: () => void;
}

export const PrintLabelModal: React.FC<PrintLabelModalProps> = ({ part, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#181818] border-b border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#D6181F]" />
            <span className="text-xs font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
              Print Hero Genuine Parts Bin Tag
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Label View */}
        <div className="p-6 bg-neutral-900 flex justify-center">
          <div
            id="printable-hero-tag"
            className="w-full max-w-sm bg-white text-black p-4 rounded-lg shadow-xl border-2 border-dashed border-gray-400 font-sans relative overflow-hidden"
          >
            {/* Top OEM Brand Header */}
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#D6181F] flex items-center justify-center text-white font-black text-sm rounded-sm">
                  H
                </div>
                <div>
                  <div className="text-[12px] font-black uppercase tracking-tight text-red-600 leading-none">
                    HERO GENUINE PARTS
                  </div>
                  <div className="text-[8px] font-bold text-gray-600 tracking-wider">
                    SHRI RAM HERO • NADBAI
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-bold uppercase text-gray-500">BIN LOCATION</div>
                <div className="text-xs font-black font-mono bg-black text-white px-2 py-0.5 rounded">
                  {part.rackNumber} / {part.shelfNumber}
                </div>
              </div>
            </div>

            {/* Part Number & Description */}
            <div className="my-2 text-center">
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                HERO PART NUMBER
              </div>
              <div className="text-xl font-black font-mono tracking-wider text-black">
                {part.partNumber}
              </div>
              <div className="text-xs font-bold text-gray-800 uppercase mt-0.5 leading-snug">
                {part.partName}
              </div>
            </div>

            {/* Barcode Graphic Simulation */}
            <div className="my-3 py-1 flex flex-col items-center justify-center border-y border-gray-200">
              <div className="flex items-center gap-0.5 h-8 w-4/5 justify-center">
                {[4, 2, 6, 1, 3, 5, 2, 7, 3, 2, 5, 1, 4, 6, 2, 3, 6, 2, 4, 1, 5, 3, 2, 6, 4, 2, 5, 3].map(
                  (width, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: `${(width % 3) + 1}px` }}
                    />
                  )
                )}
              </div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-gray-600 mt-1 font-semibold">
                *{part.partNumber}*
              </span>
            </div>

            {/* Compatible Models & Price */}
            <div className="grid grid-cols-2 gap-2 text-left pt-1">
              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase block">FITS MODELS:</span>
                <span className="text-[10px] font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {part.applicableModels.slice(0, 3).join(', ')}
                  {part.applicableModels.length > 3 ? '...' : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold text-gray-500 uppercase block">MAX RETAIL PRICE</span>
                <span className="text-sm font-black font-mono text-black">
                  {part.mrp ? `₹${part.mrp}` : 'MRP Not Added'}
                </span>
                <div className="text-[7px] text-gray-500">(INCL. OF ALL TAXES)</div>
              </div>
            </div>

            {/* Hologram / Security tag badge */}
            <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-[8px] text-gray-600">
              <div className="flex items-center gap-1 font-bold text-red-600">
                <ShieldCheck className="w-3 h-3" />
                100% ORIGINAL OEM SPARE
              </div>
              <div className="font-mono text-[7px] text-gray-400">
                DATE: {part.dateAdded}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 py-3.5 bg-[#181818] border-t border-white/10 flex items-center justify-between print:hidden">
          <span className="text-[11px] text-gray-400">
            Standard 4" x 2.5" bin shelf format
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { PartImportRow } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import * as XLSX from 'xlsx';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  AlertOctagon,
  ArrowRight,
  Database,
} from 'lucide-react';

interface ImportPartsModalProps {
  onClose: () => void;
}

export const ImportPartsModal: React.FC<ImportPartsModalProps> = ({ onClose }) => {
  const { parts, importPartsBatch, exportToCsv } = usePartsInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<PartImportRow[]>([]);
  const [duplicateAction, setDuplicateAction] = useState<'update' | 'skip' | 'duplicate'>('update');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importSummary, setImportSummary] = useState<{
    imported: number;
    updated: number;
    skipped: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  // Sample CSV / XLSX Template generator
  const handleDownloadSample = () => {
    const sampleData = [
      {
        'Part Number': '90306-KST-941',
        'Part Name': 'Flange Nut M10 (Rear Axle)',
        'Category': 'Nut & Bolt',
        'Subcategory': 'Fasteners',
        'Model': 'Splendor+, HF Deluxe, Super Splendor',
        'Variant': 'All Variants',
        'MRP': 18,
        'Purchase Price': 11,
        'Selling Price': 18,
        'Opening Stock': 100,
        'Minimum Stock': 25,
        'Unit': 'Pcs',
        'Rack': 'Rack A',
        'Shelf': 'Bin 01',
        'Supplier': 'Hero MotoCorp Regional Spares Depot',
        'Notes': 'High-tensile zinc plated M10 nut',
      },
      {
        'Part Number': '17211-KCC-9000',
        'Part Name': 'Air Cleaner Filter Element (Foam)',
        'Category': 'Air Filter',
        'Subcategory': 'Filter',
        'Model': 'Splendor+, Passion+, HF Deluxe',
        'Variant': 'BS6 Fi',
        'MRP': 270,
        'Purchase Price': 205,
        'Selling Price': 270,
        'Opening Stock': 30,
        'Minimum Stock': 8,
        'Unit': 'Pcs',
        'Rack': 'Rack A',
        'Shelf': 'Shelf 2',
        'Supplier': 'Hero MotoCorp Regional Spares Depot',
        'Notes': 'Official Hero Genuine air filter element',
      },
      {
        'Part Number': '98069-57717',
        'Part Name': 'Spark Plug NGK CR7HSA',
        'Category': 'Electrical',
        'Subcategory': 'Ignition',
        'Model': 'Universal / All Hero Models',
        'Variant': '100cc - 125cc',
        'MRP': 135,
        'Purchase Price': 92,
        'Selling Price': 135,
        'Opening Stock': 45,
        'Minimum Stock': 15,
        'Unit': 'Pcs',
        'Rack': 'Rack C',
        'Shelf': 'Shelf 1',
        'Supplier': 'MICO Bosch Automotive Spares',
        'Notes': 'Resistor spark plug',
      },
      {
        'Part Number': '32100-K0R-900',
        'Part Name': 'Sensor Wiring Loom Harness',
        'Category': 'Electrical',
        'Subcategory': 'Wiring',
        'Model': 'Xtreme 250R',
        'Variant': '2026 Edition',
        'MRP': '', // Demonstrating empty/null MRP -> "MRP Not Added"
        'Purchase Price': 1850,
        'Selling Price': 2300,
        'Opening Stock': 5,
        'Minimum Stock': 2,
        'Unit': 'Pcs',
        'Rack': 'Rack H',
        'Shelf': 'Shelf 1',
        'Supplier': 'Hero MotoCorp Regional Spares Depot',
        'Notes': 'Advance sample. Official Hero circular MRP awaited.',
      },
    ];

    exportToCsv(sampleData, 'Hero_Genuine_Parts_Import_Template');
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setError('The uploaded spreadsheet contains no data rows.');
          setIsProcessing(false);
          return;
        }

        // Process rows and validate
        const validatedRows: PartImportRow[] = rawJson.map((row) => {
          // Normalize column headers
          const partNo =
            row['Part Number'] || row['part_number'] || row['PartNumber'] || row['Hero Part Number'] || row['Part No'] || '';
          const name = row['Part Name'] || row['part_name'] || row['PartName'] || row['Name'] || '';
          const cat = row['Category'] || row['category'] || 'Other';
          const subcat = row['Subcategory'] || row['subcategory'] || '';
          const model = row['Model'] || row['model'] || row['Applicable Model'] || '';
          const variant = row['Variant'] || row['variant'] || '';
          const mrpVal = row['MRP'] !== undefined ? row['MRP'] : '';
          const purchaseVal = row['Purchase Price'] || row['purchase_price'] || '';
          const sellingVal = row['Selling Price'] || row['selling_price'] || '';
          const openingVal = row['Opening Stock'] || row['opening_stock'] || row['Stock'] || 0;
          const minVal = row['Minimum Stock'] || row['min_stock'] || 5;
          const unitVal = row['Unit'] || row['unit'] || 'Pcs';
          const rackVal = row['Rack'] || row['rack'] || row['Rack Number'] || 'Rack A';
          const shelfVal = row['Shelf'] || row['shelf'] || row['Shelf Number'] || 'Shelf 1';
          const supVal = row['Supplier'] || row['supplier'] || 'Hero MotoCorp Spares Depot';
          const notesVal = row['Notes'] || row['notes'] || '';

          const errors: string[] = [];
          if (!partNo.trim()) errors.push('Part Number is required');
          if (!name.trim()) errors.push('Part Name is required');

          const cleanPartNo = String(partNo).trim().toUpperCase();
          const isDuplicate = parts.some(
            (p) => !p.isArchived && p.partNumber.trim().toUpperCase() === cleanPartNo
          );

          return {
            partNumber: cleanPartNo,
            partName: String(name).trim(),
            category: String(cat).trim() || 'Other',
            subcategory: String(subcat).trim(),
            model: String(model).trim(),
            variant: String(variant).trim(),
            mrp: mrpVal,
            purchasePrice: purchaseVal,
            sellingPrice: sellingVal,
            openingStock: openingVal,
            minimumStock: minVal,
            unit: String(unitVal).trim() || 'Pcs',
            rack: String(rackVal).trim() || 'Rack A',
            shelf: String(shelfVal).trim() || 'Shelf 1',
            supplier: String(supVal).trim() || 'Hero MotoCorp Regional Spares Depot',
            notes: String(notesVal).trim(),
            status: errors.length > 0 ? 'invalid' : isDuplicate ? 'duplicate' : 'valid',
            errors,
          };
        });

        setParsedRows(validatedRows);
      } catch (err: any) {
        console.error('File parsing error:', err);
        setError(`Failed to parse file: ${err?.message || 'Unsupported format'}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file from disk.');
      setIsProcessing(false);
    };

    reader.readAsBinaryString(file);
  };

  // Preview metrics
  const totalRows = parsedRows.length;
  const validNewRows = parsedRows.filter((r) => r.status === 'valid').length;
  const duplicateRows = parsedRows.filter((r) => r.status === 'duplicate').length;
  const invalidRows = parsedRows.filter((r) => r.status === 'invalid').length;

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await importPartsBatch(parsedRows, duplicateAction);
      setImportSummary({
        imported: res.importedCount,
        updated: res.updatedCount,
        skipped: res.skippedCount,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to complete batch import.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Import Genuine Parts (CSV / Excel)
              </h2>
              <p className="text-[11px] text-gray-400">
                Bulk upload thousands of Hero Genuine parts, prices, storage racks and stock
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {importSummary ? (
            /* Success confirmation screen */
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Rajdhani'] uppercase">
                Import Completed Successfully!
              </h3>
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
                <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">New Parts</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">+{importSummary.imported}</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Updated</span>
                  <span className="text-xl font-mono font-bold text-amber-400">{importSummary.updated}</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Skipped</span>
                  <span className="text-xl font-mono font-bold text-gray-400">{importSummary.skipped}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                All records and opening stock transactions have been saved permanently into inventory.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#D6181F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b5141a] transition-colors"
              >
                Close & View Parts Catalog
              </button>
            </div>
          ) : (
            <>
              {/* File Dropzone & Template helper */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 p-6 border-2 border-dashed border-white/20 hover:border-[#D6181F]/70 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <FileSpreadsheet className="w-10 h-10 text-[#D6181F] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                    {fileName ? fileName : 'Select or Drop CSV / XLSX File'}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1">
                    Supports .CSV, .XLSX, and .XLS spreadsheet files
                  </span>
                </div>

                {/* Sample Template Download Card */}
                <div className="p-4 bg-[#191919] border border-white/10 rounded-2xl sm:w-72 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-white font-['Rajdhani'] uppercase tracking-wider block">
                      Download Sample Template
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                      Contains pre-formatted columns (Part Number, Part Name, Category, MRP, Stock, Rack, etc.) for quick reference.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/15 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-yellow-400" />
                    Download Sample CSV
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Preview Metrics & Duplicate Policy Selection */}
              {parsedRows.length > 0 && (
                <div className="space-y-4">
                  {/* Summary metric pill cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#191919] border border-white/10 rounded-xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Rows</span>
                      <span className="text-lg font-mono font-bold text-white">{totalRows}</span>
                    </div>
                    <div className="p-3 bg-[#191919] border border-emerald-500/30 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block">New Parts</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{validNewRows}</span>
                    </div>
                    <div className="p-3 bg-[#191919] border border-amber-500/30 rounded-xl">
                      <span className="text-[10px] font-bold text-amber-400 uppercase block">Existing (Duplicates)</span>
                      <span className="text-lg font-mono font-bold text-amber-400">{duplicateRows}</span>
                    </div>
                    <div className="p-3 bg-[#191919] border border-red-500/30 rounded-xl">
                      <span className="text-[10px] font-bold text-red-400 uppercase block">Invalid Rows</span>
                      <span className="text-lg font-mono font-bold text-red-400">{invalidRows}</span>
                    </div>
                  </div>

                  {/* Duplicate Resolution Strategy */}
                  {duplicateRows > 0 && (
                    <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Action for Existing Parts ({duplicateRows} matching Part Numbers):</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-200">
                          <input
                            type="radio"
                            name="duplicateAction"
                            value="update"
                            checked={duplicateAction === 'update'}
                            onChange={() => setDuplicateAction('update')}
                            className="text-[#D6181F] focus:ring-0"
                          />
                          <span className="font-bold">Update Existing Part (Default)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                          <input
                            type="radio"
                            name="duplicateAction"
                            value="skip"
                            checked={duplicateAction === 'skip'}
                            onChange={() => setDuplicateAction('skip')}
                            className="text-[#D6181F] focus:ring-0"
                          />
                          <span>Skip Existing Rows</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                          <input
                            type="radio"
                            name="duplicateAction"
                            value="duplicate"
                            checked={duplicateAction === 'duplicate'}
                            onChange={() => setDuplicateAction('duplicate')}
                            className="text-[#D6181F] focus:ring-0"
                          />
                          <span>Create Duplicate Master</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Preview Table (First 20 rows) */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-[#1a1a1a] text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Spreadsheet Preview (Showing top {Math.min(parsedRows.length, 25)} of {parsedRows.length} rows)</span>
                      <span className="text-[10px] text-gray-500 font-mono">Verify fields before import</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#202020] text-gray-400 uppercase text-[10px] font-bold sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Part Number</th>
                            <th className="py-2 px-3">Part Name</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3">MRP</th>
                            <th className="py-2 px-3">Opening Stock</th>
                            <th className="py-2 px-3">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {parsedRows.slice(0, 25).map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2 px-3 whitespace-nowrap">
                                {row.status === 'valid' && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    New
                                  </span>
                                )}
                                {row.status === 'duplicate' && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    Existing
                                  </span>
                                )}
                                {row.status === 'invalid' && (
                                  <span
                                    className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30"
                                    title={row.errors.join(', ')}
                                  >
                                    Invalid ({row.errors[0]})
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-white whitespace-nowrap">
                                {row.partNumber || '-'}
                              </td>
                              <td className="py-2 px-3 text-gray-200 max-w-xs truncate">
                                {row.partName || '-'}
                              </td>
                              <td className="py-2 px-3 text-gray-400 whitespace-nowrap">{row.category}</td>
                              <td className="py-2 px-3 font-mono text-white whitespace-nowrap">
                                {row.mrp !== '' && row.mrp !== undefined ? `₹${row.mrp}` : (
                                  <span className="text-amber-400 text-[10px]">MRP Not Added</span>
                                )}
                              </td>
                              <td className="py-2 px-3 font-mono text-emerald-400">{row.openingStock} {row.unit}</td>
                              <td className="py-2 px-3 text-gray-400 whitespace-nowrap">
                                {row.rack} • {row.shelf}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!importSummary && (
          <div className="px-6 py-4 bg-[#181818] border-t border-white/10 flex items-center justify-between gap-4">
            <span className="text-[11px] text-gray-400">
              {parsedRows.length > 0
                ? `Ready to import ${validNewRows + (duplicateAction === 'update' ? duplicateRows : 0)} eligible parts`
                : 'Upload a spreadsheet to preview'}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsedRows.length === 0 || isProcessing}
                onClick={handleConfirmImport}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  parsedRows.length === 0 || isProcessing
                    ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-[#D6181F] hover:bg-[#b5141a] shadow-lg shadow-[#D6181F]/30'
                }`}
              >
                <Database className="w-4 h-4" />
                Confirm Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

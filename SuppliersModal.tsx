import React, { useState } from 'react';
import { PartSupplier } from '../../types/parts';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  X,
  Building2,
  Phone,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';

interface SuppliersModalProps {
  onClose: () => void;
}

export const SuppliersModal: React.FC<SuppliersModalProps> = ({ onClose }) => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, parts, transactions, userRole } =
    usePartsInventory();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [gstNumber, setGstNumber] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setGstNumber('');
    setContactPerson('');
    setNotes('');
    setIsAdding(false);
    setEditingId(null);
    setError('');
  };

  const startEdit = (sup: PartSupplier) => {
    setEditingId(sup.id);
    setName(sup.name);
    setPhone(sup.phone);
    setAddress(sup.address);
    setGstNumber(sup.gstNumber || '');
    setContactPerson(sup.contactPerson || '');
    setNotes(sup.notes || '');
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userRole !== 'admin') {
      setError('Unauthorized: Only Admin can manage suppliers.');
      return;
    }

    if (!name.trim()) {
      setError('Supplier Name is required.');
      return;
    }

    if (editingId) {
      const res = await updateSupplier(editingId, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        gstNumber: gstNumber.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      if (res.success) {
        resetForm();
      } else {
        setError(res.error || 'Failed to update supplier.');
      }
    } else {
      const res = await addSupplier({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        gstNumber: gstNumber.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      if (res.success) {
        resetForm();
      } else {
        setError(res.error || 'Failed to add supplier.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSupplier(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/60 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Authorized Spares Suppliers & Depots
              </h2>
              <p className="text-[11px] text-gray-400">
                OEM supply chain directory and purchase history
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Bar with Add Supplier button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Registered Vendors & Depots ({suppliers.length})
            </span>
            {userRole === 'admin' && !isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-3 py-1.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Supplier
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {isAdding && (
            <form onSubmit={handleSave} className="p-5 bg-[#181818] border border-white/15 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white font-['Rajdhani'] uppercase">
                  {editingId ? 'Edit Supplier Details' : 'Register New Vendor / Depot'}
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                    Supplier / Depot Name <span className="text-[#D6181F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hero MotoCorp Regional Spares Depot"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0141-2839100 / 8890992086"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                    GSTIN / Registration Number
                  </label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="e.g. 08AAACH2748P1ZP"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F] uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. S. K. Verma (Area Manager)"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                  Full Depot / Warehouse Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot / Industrial Area, City, State"
                  className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Discounts, dispatch frequency, terms..."
                  className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D6181F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase transition-colors"
                >
                  {editingId ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          )}

          {/* Suppliers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup) => {
              // Count parts linked to this supplier
              const linkedPartsCount = parts.filter(
                (p) => !p.isArchived && p.supplier?.toLowerCase().includes(sup.name.toLowerCase().slice(0, 15))
              ).length;

              // Count purchase transactions
              const supplierTxCount = transactions.filter(
                (t) => t.type === 'stock_in' && t.supplier?.toLowerCase().includes(sup.name.toLowerCase().slice(0, 15))
              ).length;

              return (
                <div
                  key={sup.id}
                  className="p-4 bg-[#191919] border border-white/10 rounded-2xl flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white font-['Rajdhani'] uppercase leading-snug">
                          {sup.name}
                        </h3>
                        {sup.contactPerson && (
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            Attn: {sup.contactPerson}
                          </span>
                        )}
                      </div>

                      {userRole === 'admin' && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(sup)}
                            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(sup.id)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-gray-400">
                      {sup.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="font-mono text-gray-300">{sup.phone}</span>
                        </div>
                      )}
                      {sup.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                          <span className="text-gray-400 text-[11px] leading-tight">{sup.address}</span>
                        </div>
                      )}
                      {sup.gstNumber && (
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span>GSTIN: <span className="text-white">{sup.gstNumber}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats footer */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Package className="w-3 h-3" />
                      {linkedPartsCount} Catalog Parts Linked
                    </span>
                    <span className="text-gray-500">{supplierTxCount} Consignments Received</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

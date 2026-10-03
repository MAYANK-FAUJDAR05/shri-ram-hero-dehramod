import React, { useState, useEffect } from 'react';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  FileCode,
} from 'lucide-react';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const { getSupabaseStatus } = usePartsInventory();
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const refreshStatus = async () => {
    setLoading(true);
    const sb = await getSupabaseStatus();
    setSupabaseData(sb);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    if (supabaseData?.schemaSql) {
      navigator.clipboard.writeText(supabaseData.schemaSql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Supabase & Cloud Security Configuration
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                  Cloud Relational DB
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                PostgreSQL schema, Row Level Security (RLS), and Central Admin Authentication
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
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
          {loading ? (
            <div className="py-8 text-center text-gray-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Verifying Supabase connection...</span>
            </div>
          ) : (
            <>
              {/* Connection Status Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  supabaseData?.connected && supabaseData?.hasTables
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : supabaseData?.connected
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-[#1a1a1a] border-white/10 text-gray-300'
                }`}
              >
                {supabaseData?.connected && supabaseData?.hasTables ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-white uppercase font-['Rajdhani']">
                      {supabaseData?.connected && supabaseData?.hasTables
                        ? 'Supabase Database Connected & Ready'
                        : supabaseData?.connected
                        ? 'Supabase Connected (Migration Required)'
                        : 'Local Authoritative Server Active'}
                    </strong>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    {supabaseData?.connected && supabaseData?.hasTables
                      ? `Relational tables are active at ${supabaseData.endpoint}. All installations and stock movements sync in real-time.`
                      : supabaseData?.connected
                      ? 'Connected to Supabase endpoint, but SQL tables are not created yet. Copy and run the SQL migration below in Supabase SQL Editor.'
                      : 'App is running smoothly with authoritative local disk storage. To sync directly to your Supabase Cloud project, add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to environment secrets.'}
                  </p>
                </div>
              </div>

              {/* Authentication Security Info */}
              <div className="p-4 bg-[#181818] border border-white/10 rounded-xl space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Admin Authentication & Access Control
                </span>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Authorized Admin ID:</span>
                  <span className="font-mono font-bold text-emerald-400">admin</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Password Encryption:</span>
                  <span className="font-mono text-white">Salted Scrypt Hash (256-bit)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Session Security:</span>
                  <span className="text-emerald-400 font-bold">Encrypted 24-hr Bearer Token</span>
                </div>
              </div>

              {/* Relational Tables Included */}
              <div className="p-4 bg-[#181818] border border-white/10 rounded-xl space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Supabase Relational Tables & RLS Policies
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  {[
                    'admin_profiles',
                    'parts',
                    'part_stock_movements',
                    'bikes',
                    'part_installations',
                    'audit_logs',
                    'suppliers',
                    'mechanics',
                  ].map((tbl) => (
                    <div key={tbl} className="p-2 bg-black/40 rounded border border-white/5 text-gray-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{tbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SQL Migration Script Box */}
              <div className="p-4 bg-[#181818] border border-white/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>Supabase SQL Migration Script (schema.sql)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3 py-1 rounded bg-[#D6181F] hover:bg-[#b5141a] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Open your <strong className="text-white">Supabase Dashboard → SQL Editor</strong>, paste this script, and click <strong className="text-emerald-400">Run</strong> to create all relational tables, constraints, foreign keys, and indexes.
                </p>
                <div className="p-3 bg-black/70 rounded-lg border border-white/10 max-h-48 overflow-y-auto font-mono text-[10px] text-gray-300 whitespace-pre">
                  {supabaseData?.schemaSql || '-- Loading schema.sql...'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#121212] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={refreshStatus}
            className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Re-check Connection</span>
          </button>

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

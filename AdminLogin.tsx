import React, { useState } from 'react';
import { usePartsInventory } from '../context/PartsInventoryContext';
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  X,
  ShieldAlert,
  Boxes,
  SlidersHorizontal,
  Upload,
  Building2,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Shield,
  LogIn,
} from 'lucide-react';

export interface AdminLoginProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBackToShowroom?: () => void;
  onLoginSuccess?: (user: { id: string; username: string; role: 'admin' | 'staff'; name: string }) => void;
  variant?: 'modal' | 'card' | 'page';
  title?: string;
  subtitle?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isOpen = true,
  onClose,
  onBackToShowroom,
  onLoginSuccess,
  variant = 'modal',
  title = 'Hero Genuine Parts - Admin Portal',
  subtitle = 'Central inventory & workshop access control',
}) => {
  const { login, logout, currentUser, isAdmin, isLoggedIn } = usePartsInventory();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  if (variant === 'modal' && !isOpen) {
    return null;
  }

  // Direct Credential Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Please provide both Admin ID and password.');
      return;
    }

    setLoading(true);
    const res = await login(cleanUsername, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        if (onLoginSuccess && currentUser) {
          onLoginSuccess(currentUser);
        }
        if (onClose) {
          onClose();
        }
      }, 700);
    } else {
      setError(res.error || 'Invalid Admin ID or password.');
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  const cardContent = (
    <div className="bg-[#141414] border border-white/15 rounded-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-red-950/70 via-[#181818] to-[#141414] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shadow-lg shadow-[#D6181F]/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                {title}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#D6181F]/20 text-[#D6181F] border border-[#D6181F]/30 text-[9px] font-mono font-bold uppercase">
                Admin ID: admin
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>

        {onClose && variant === 'modal' && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-5">
        {/* If Already Logged In as Admin */}
        {isLoggedIn && isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white font-['Rajdhani'] uppercase">
                  Authenticated as Admin ({currentUser?.username})
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Logged in as <span className="font-bold text-white">{currentUser?.name}</span>. Parts Stock and restricted inventory management features are currently unlocked.
                </p>
              </div>
            </div>

            {/* List of Unlocked Features */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Restricted Inventory Features Active:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 text-gray-300">
                  <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Genuine Parts Catalog</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 text-gray-300">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Stock In, Out & Adjustments</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 text-gray-300">
                  <Upload className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Excel & CSV Batch Upload</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 text-gray-300">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Manage OEM Suppliers</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 text-gray-300">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Permanent Audit Log & History</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={logout}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Admin</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : success ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
              Access Granted!
            </h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto">
              Welcome, <span className="font-bold text-white">{username}</span>. Opening Shri Ram Hero Admin Portal & Parts Stock Management...
            </p>
          </div>
        ) : (
          /* ADMIN ID & PASSWORD DIRECT LOGIN */
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Prominent Admin ID Banner */}
            <div className="p-3 bg-red-950/40 border border-[#D6181F]/30 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-200">
                <Shield className="w-4 h-4 text-[#D6181F] shrink-0" />
                <span>Admin Login Required:</span>
              </div>
              <span className="font-mono font-black text-white bg-black/60 px-2 py-0.5 rounded border border-white/10 text-[11px]">
                Admin ID = <span className="text-[#D6181F]">admin</span>
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Username / Admin ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Admin ID <span className="text-[#D6181F]">*</span>
                </label>
                <span className="text-[10px] text-gray-400 font-mono">
                  Default ID: <strong className="text-white">admin</strong>
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F] transition-colors font-mono font-bold"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Admin Password <span className="text-[#D6181F]">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D6181F] transition-colors font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick-fill helper for authorized credentials */}
            <div className="p-3 bg-[#191919] border border-white/10 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Quick Credential Selection:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'Hero@Nadbai2026')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded border border-[#D6181F]/40 font-mono transition-colors cursor-pointer"
                >
                  Fill Admin: <span className="text-[#D6181F] font-bold">admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('staff', 'staff')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 font-mono transition-colors cursor-pointer"
                >
                  Fill Staff: <span className="text-emerald-400 font-bold">staff</span>
                </button>
              </div>
            </div>

            {/* Submit Action: Direct Login */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Log In to Admin Portal'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  // Dedicated Full Page Variant (when opening Admin / Parts Stock)
  if (variant === 'page') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#D6181F] selection:text-white">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[#D6181F] rounded transform -skew-x-12 shrink-0 shadow-lg shadow-[#D6181F]/30 flex items-center justify-center">
                <span className="text-white font-black text-xl transform skew-x-12 font-['Rajdhani']">H</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white font-['Rajdhani'] uppercase tracking-tight leading-none">
                  Shri Ram Hero • <span className="text-[#D6181F]">Admin Portal</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Hero Genuine Parts Stock & Workshop Management • Admin ID: admin
                </p>
              </div>
            </div>

            {onBackToShowroom && (
              <button
                type="button"
                onClick={onBackToShowroom}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Return to Showroom</span>
              </button>
            )}
          </div>
        </header>

        {/* Center Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
          <div className="w-full max-w-md">
            {cardContent}
          </div>
        </main>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {cardContent}
    </div>
  );
};

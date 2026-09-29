import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Lock, Key, ShieldCheck, AlertCircle, ArrowRight, User, Loader2 } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { showAdminModal, setShowAdminModal, loginAdmin } = usePortfolio();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!showAdminModal) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);

    try {
      const success = await loginAdmin(username, password);
      if (!success) {
        setErrorMsg('Invalid username or password. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('Server error during login. Please try again or check your database connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-amber-500/30">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black flex items-center justify-center shadow-2xs font-extrabold">
              <ShieldCheck className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Admin CMS Access
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-amber-400 font-bold uppercase tracking-wider">
                Verified via MongoDB · Portfolio Control Center
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-neutral-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-900 dark:text-amber-400" />
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isVerifying}
              autoComplete="off"
              className="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-900 dark:text-amber-400" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isVerifying}
              autoComplete="new-password"
              className="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-65"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying with MongoDB...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span>Login to CMS Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

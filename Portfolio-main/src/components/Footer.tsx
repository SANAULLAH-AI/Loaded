import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminModal, setShowAdminDrawer } = usePortfolio();
  const { profile } = data;

  return (
    <footer className="border-t border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black py-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                {profile.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 dark:bg-black dark:text-amber-400 border border-slate-200 dark:border-amber-500/30">
                {profile.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              {profile.university} • CGPA: {profile.cgpa}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              {profile.email}
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
            <a href="#about" className="hover:text-slate-900 dark:hover:text-amber-400 transition">About</a>
            <a href="#education" className="hover:text-slate-900 dark:hover:text-amber-400 transition">Education</a>
            <a href="#skills" className="hover:text-slate-900 dark:hover:text-amber-400 transition">Skills</a>
            <a href="#projects" className="hover:text-slate-900 dark:hover:text-amber-400 transition">Projects</a>
            <a href="#certifications" className="hover:text-slate-900 dark:hover:text-amber-400 transition">Certifications</a>
            <a href="#contact" className="hover:text-slate-900 dark:hover:text-amber-400 transition">Contact</a>
          </div>
        </div>

        {/* Admin Panel Footer Card */}
        <div className="pt-6 border-t border-slate-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>

          {/* Admin Panel Access Button in Footer */}
          <div className="flex items-center gap-3">
            {isAdminLoggedIn ? (
              <button
                onClick={() => setShowAdminDrawer(true)}
                id="footer-admin-cms-btn"
                className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-amber-400 dark:text-black font-extrabold hover:opacity-90 transition shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Open Admin CMS Panel</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAdminModal(true)}
                id="footer-admin-login-btn"
                className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 hover:border-slate-400 dark:hover:border-amber-400 transition shadow-2xs flex items-center gap-2 cursor-pointer group"
              >
                <Lock className="w-3.5 h-3.5 text-slate-600 dark:text-red-500 group-hover:scale-110 transition-transform" />
                <span>Admin CMS Panel Access</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sun, Moon, Lock, ShieldCheck, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, isAdminLoggedIn, setShowAdminModal, setShowAdminDrawer, setShowResumeModal, data } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', href: '#about', visible: data.sectionVisibility.about },
    { name: 'Education', href: '#education', visible: data.sectionVisibility.education },
    { name: 'Skills', href: '#skills', visible: data.sectionVisibility.skills },
    { name: 'Experience', href: '#internships', visible: data.sectionVisibility.internships },
    { name: 'Projects', href: '#projects', visible: data.sectionVisibility.projects },
    { name: 'Publications', href: '#publications', visible: data.sectionVisibility.publications },
    { name: 'Testimonials', href: '#testimonials', visible: data.sectionVisibility.testimonials },
    { name: 'Certifications', href: '#certifications', visible: data.sectionVisibility.certifications },
    { name: 'Contact', href: '#contact', visible: data.sectionVisibility.contact },
  ].filter((link) => link.visible);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 dark:bg-black/95 border-b border-slate-200 dark:border-amber-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo Brand */}
        <a href="#" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-slate-900 dark:bg-amber-400 rounded-full flex items-center justify-center text-white dark:text-black font-black text-lg group-hover:scale-105 transition-transform shadow-md dark:shadow-amber-500/20">
            S
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight leading-none uppercase text-slate-900 dark:text-white">
              {data.profile.name || 'Sanaullah'}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-amber-400 tracking-[0.2em] uppercase mt-1">
              {data.profile.title || 'BSCS Programmer'}
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-slate-900 dark:hover:text-amber-400 transition-colors duration-200 py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 px-4 py-2 rounded-full border border-slate-200 dark:border-amber-500/30 transition-all cursor-pointer"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Light Mode</span>
              </>
            )}
          </button>

          {/* Admin CMS Button */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => setShowAdminDrawer(true)}
              id="admin-dashboard-btn"
              className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-red-600 dark:hover:bg-red-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CMS Panel</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              id="admin-login-btn"
              className="p-2 rounded-full border border-slate-200 dark:border-amber-500/30 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-amber-400 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Admin CMS Login"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-amber-500/30 text-slate-600 dark:text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black px-6 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-neutral-900 dark:hover:text-amber-400 rounded-lg"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

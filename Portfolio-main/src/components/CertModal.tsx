import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Award, ExternalLink, Image as ImageIcon, Tag, Edit3 } from 'lucide-react';

export const CertModal: React.FC = () => {
  const { selectedCert, setSelectedCert, isAdminLoggedIn, setShowAdminDrawer } = usePortfolio();

  if (!selectedCert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-amber-500/30">
        {/* Top Header */}
        <div className="p-6 bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-slate-900 dark:text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-amber-400/80">
              Certificate Details
            </span>
          </div>

          <button
            onClick={() => setSelectedCert(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-neutral-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-900 dark:bg-black dark:text-amber-400 border border-slate-200 dark:border-amber-500/30">
              {selectedCert.issuer}
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white pt-2">
              {selectedCert.title}
            </h3>
            {selectedCert.date && (
              <p className="text-xs text-slate-400 dark:text-red-500 font-mono">
                Issued / Completed: {selectedCert.date}
              </p>
            )}
          </div>

          {/* Certificate Image or Upload Placeholder */}
          {selectedCert.imageUrl ? (
            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-black">
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                className="w-full h-full object-contain p-2"
              />
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-amber-500/30 bg-slate-50 dark:bg-black text-center space-y-2">
              <ImageIcon className="w-6 h-6 text-slate-400 dark:text-amber-400 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                No Certificate Scan Image Uploaded Yet
              </p>
              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    setSelectedCert(null);
                    setShowAdminDrawer(true);
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Upload Certificate Image via Admin CMS
                </button>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {selectedCert.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded text-slate-700 dark:text-amber-400 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-slate-400 dark:text-amber-400/70" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-amber-500/20 flex items-center justify-between">
          <div>
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  setSelectedCert(null);
                  setShowAdminDrawer(true);
                }}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 dark:bg-neutral-900 dark:text-amber-400 border dark:border-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Item</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedCert.credentialUrl && selectedCert.credentialUrl !== '#' && (
              <a
                href={selectedCert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-amber-400 dark:text-black font-black hover:opacity-90 flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                <span>Verify Credential</span>
              </a>
            )}

            <button
              onClick={() => setSelectedCert(null)}
              className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-neutral-900 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

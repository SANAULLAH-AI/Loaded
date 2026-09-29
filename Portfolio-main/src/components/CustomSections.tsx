import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Layers, ExternalLink, Edit3, Trash2 } from 'lucide-react';

export const CustomSections: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminDrawer, deleteCustomSection } = usePortfolio();
  const { customSections } = data;

  if (!customSections || customSections.length === 0) return null;

  const visibleSections = customSections.filter((s) => s.visible);

  if (visibleSections.length === 0) return null;

  return (
    <div className="space-y-16 py-8">
      {visibleSections.map((sec) => (
        <section key={sec.id} className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-amber-500/20 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-amber-400 mb-1">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>Custom Section</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {sec.sectionTitle}
                </h2>
              </div>

              {isAdminLoggedIn && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAdminDrawer(true)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-amber-400 border dark:border-amber-500/20"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCustomSection(sec.id)}
                    className="p-2 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border dark:border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sec.items.map((item) => (
                <div key={item.id} className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-3xl p-6 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.dateOrDuration && (
                      <span className="text-xs font-semibold text-slate-400 dark:text-red-500">
                        {item.dateOrDuration}
                      </span>
                    )}
                  </div>

                  {item.subtitle && (
                    <p className="text-xs font-bold text-slate-800 dark:text-amber-400">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-amber-400 hover:underline pt-2"
                    >
                      <span>Explore Link</span>
                      <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

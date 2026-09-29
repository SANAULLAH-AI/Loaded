import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  BookOpen,
  ExternalLink,
  FileText,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
} from 'lucide-react';

export const PublicationsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { publications, sectionVisibility } = data;

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!sectionVisibility.publications || !publications || publications.length === 0) {
    return null;
  }

  const visiblePubs = publications.filter((p) => p.visible);

  if (visiblePubs.length === 0) return null;

  return (
    <section id="publications" className="py-16 border-b border-slate-200 dark:border-amber-500/20 bg-slate-50/50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
        {/* Section Header */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
            Academic & Technical Contributions
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>Research Publications & Articles</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-black">
              IEEE / arXiv / Kaggle
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Academic papers, preprints, NLP transformer writeups, and deep learning technical research papers authored by Sanaullah.
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePubs.map((pub) => {
            const isExpanded = expandedId === pub.id;
            return (
              <div
                key={pub.id}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm hover:border-amber-400/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Publisher badge & Date */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black">
                      {pub.publisher}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {pub.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {pub.title}
                  </h4>

                  {/* Authors */}
                  <p className="text-xs font-mono text-slate-500 dark:text-amber-400/80">
                    <strong>Authors:</strong> {pub.authors}
                  </p>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {pub.description}
                  </p>

                  {/* Expandable Abstract */}
                  {pub.abstract && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Paper Abstract' : 'Read Paper Abstract'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-sans animate-fade-in">
                          <strong className="block text-[10px] font-extrabold uppercase tracking-widest text-amber-500 mb-1">
                            Paper Abstract:
                          </strong>
                          {pub.abstract}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Tags & Links */}
                <div className="pt-4 border-t border-slate-100 dark:border-neutral-900 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {pub.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-amber-500/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-400 hover:underline"
                    >
                      <span>View Paper / Preprint</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, MapPin, Plus, Edit3, Trash2 } from 'lucide-react';

export const InternshipsSection: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminDrawer, deleteInternship } = usePortfolio();
  const { internships, sectionVisibility } = data;

  if (!sectionVisibility.internships) return null;

  const visibleInternships = internships.filter((i) => i.visible);

  return (
    <section id="internships" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
              Professional Experience
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Internships & Roles
            </h3>
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={() => setShowAdminDrawer(true)}
              className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold flex items-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Internship</span>
            </button>
          )}
        </div>

        {/* Content */}
        {visibleInternships.length === 0 ? (
          <div className="bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-amber-500/30 p-8 text-center space-y-3">
            <Briefcase className="w-8 h-8 text-slate-400 dark:text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold uppercase text-slate-700 dark:text-zinc-300">
              No Internship Entries Recorded Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
              Use the Admin Panel in the footer to add internship positions, industrial projects, or research apprenticeships.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleInternships.map((intern) => (
              <div
                key={intern.id}
                className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all duration-300 shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-neutral-900 pb-3">
                    <span className="text-xs font-black uppercase text-slate-900 dark:text-amber-400">
                      {intern.company}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-red-500 flex items-center gap-1 uppercase tracking-wider">
                      <Calendar className="w-3 h-3 text-red-500" />
                      {intern.duration}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {intern.role}
                  </h4>

                  {intern.location && (
                    <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 dark:text-amber-400" />
                      <span>{intern.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                    {intern.description}
                  </p>
                </div>

                {intern.skills && intern.skills.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-neutral-900 flex flex-wrap gap-1.5">
                    {intern.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded text-slate-700 dark:text-amber-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Admin Actions */}
                {isAdminLoggedIn && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <button
                      onClick={() => setShowAdminDrawer(true)}
                      className="p-1 rounded bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-amber-400 border dark:border-amber-500/20"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteInternship(intern.id)}
                      className="p-1 rounded bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border dark:border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

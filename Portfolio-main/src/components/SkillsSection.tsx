import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Code, Cpu, Sparkles, Plus, Edit3, Trash2, CheckCircle } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminDrawer, deleteSkillCategory, deleteEmergingTech } =
    usePortfolio();
  const { skills, emergingTech, sectionVisibility } = data;

  if (!sectionVisibility.skills && !sectionVisibility.emergingTech) return null;

  const visibleSkills = skills.filter((s) => s.visible);
  const visibleEmerging = emergingTech.filter((e) => e.visible);

  return (
    <section id="skills" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-slate-50/50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-16">
        {/* Technical Skills Header */}
        {sectionVisibility.skills && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
                  Technical Proficiency
                </h2>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Skills & Tools
                </h3>
              </div>

              {isAdminLoggedIn && (
                <button
                  onClick={() => setShowAdminDrawer(true)}
                  className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold flex items-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manage Skills</span>
                </button>
              )}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleSkills.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 relative shadow-sm group hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-amber-400"></span>
                      {cat.categoryName}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      {cat.skills.length} Competencies
                    </span>
                  </div>

                  {/* Skills List with Proficiency Meters */}
                  <div className="space-y-3.5">
                    {cat.skills.map((skill, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                          <span className="text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-slate-700 dark:text-amber-400" />
                            {skill.name}
                          </span>
                          {skill.level && (
                            <span className="text-slate-500 font-mono text-[11px] dark:text-red-500 font-bold">
                              {skill.level}%
                            </span>
                          )}
                        </div>
                        {skill.level && (
                          <div className="w-full bg-slate-100 dark:bg-black h-2 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-amber-500/20">
                            <div
                              className="bg-slate-900 dark:bg-amber-400 h-full rounded-full transition-all duration-700"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Admin Actions */}
                  {isAdminLoggedIn && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        onClick={() => setShowAdminDrawer(true)}
                        className="p-1.5 rounded bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-amber-400 border dark:border-amber-500/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSkillCategory(cat.id)}
                        className="p-1.5 rounded bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border dark:border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emerging Technologies Header & Grid */}
        {sectionVisibility.emergingTech && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
                  Next-Gen Capabilities
                </h2>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Emerging Tech
                </h3>
              </div>

              {isAdminLoggedIn && (
                <button
                  onClick={() => setShowAdminDrawer(true)}
                  className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-red-600 dark:text-white flex items-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manage Tech</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleEmerging.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all duration-300 shadow-sm group"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-black text-slate-800 dark:text-amber-400 flex items-center justify-center font-bold border dark:border-amber-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-neutral-900 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded text-slate-700 dark:text-amber-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Admin Actions */}
                  {isAdminLoggedIn && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        onClick={() => setShowAdminDrawer(true)}
                        className="p-1.5 rounded bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-amber-400 border dark:border-amber-500/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEmergingTech(item.id)}
                        className="p-1.5 rounded bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border dark:border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

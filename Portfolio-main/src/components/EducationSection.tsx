import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, Plus, Edit3, Trash2 } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminDrawer, deleteEducation } = usePortfolio();
  const { education, sectionVisibility } = data;

  if (!sectionVisibility.education) return null;

  const visibleEdu = education.filter((e) => e.visible);

  return (
    <section id="education" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
              Academic History
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Education & CGPA
            </h3>
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={() => setShowAdminDrawer(true)}
              className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold flex items-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Education</span>
            </button>
          )}
        </div>

        {/* Education Timeline Cards */}
        <div className="space-y-6">
          {visibleEdu.map((edu) => (
            <div
              key={edu.id}
              className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 sm:p-8 relative shadow-sm group hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Degree & University */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-900 dark:bg-black dark:text-amber-400 border border-slate-200 dark:border-amber-500/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-red-500" />
                      CGPA: {edu.cgpa}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 dark:bg-black dark:text-zinc-400 border border-slate-200 dark:border-amber-500/20 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 dark:text-amber-400" />
                      {edu.duration}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {edu.degree}
                  </h4>

                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-600 dark:text-amber-400">
                    <GraduationCap className="w-4 h-4 text-slate-900 dark:text-amber-400" />
                    <span>{edu.institution}</span>
                    {edu.location && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                        • <MapPin className="w-3 h-3 text-red-500" /> {edu.location}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal pt-1">
                    {edu.description}
                  </p>
                </div>

                {/* Right Column: Key Core Courses */}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="lg:col-span-4 bg-slate-50 dark:bg-black rounded-xl p-4 border border-slate-200 dark:border-amber-500/20 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-700 dark:text-red-500" />
                      Core Academic Modules
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.courses.map((course, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded shadow-2xs text-slate-700 dark:text-zinc-200"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {isAdminLoggedIn && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={() => setShowAdminDrawer(true)}
                    className="p-1.5 rounded bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-amber-400 border dark:border-amber-500/20"
                    title="Edit Item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteEducation(edu.id)}
                    className="p-1.5 rounded bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border dark:border-red-500/30"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Brain, GraduationCap, CheckCircle2, User, Sparkles, Edit3 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminDrawer } = usePortfolio();
  const { about, profile, sectionVisibility } = data;

  if (!sectionVisibility.about || !about.visible) return null;

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'award':
        return <Award className="w-4 h-4" />;
      case 'brain':
        return <Brain className="w-4 h-4" />;
      case 'graduationcap':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <section id="about" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-slate-50/50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
              Overview & Background
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {about.title || 'About Me'}
            </h3>
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={() => setShowAdminDrawer(true)}
              className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 dark:bg-neutral-900 dark:text-amber-400 border border-slate-300 dark:border-amber-500/30 flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit About</span>
            </button>
          )}
        </div>

        {/* Content Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Biography Text */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400 block">
                Academic Trajectory & Goals
              </span>
              <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-200 leading-relaxed font-normal">
                {about.content}
              </p>
            </div>

            {/* Bottom University & Degree Summary */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-neutral-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">
                  Institution
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                  {profile.university}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">
                  Degree Program
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                  {profile.degree}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights & CGPA Gauge */}
          <div className="lg:col-span-5 space-y-4">
            {/* CGPA Progress Card */}
            <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  Academic CGPA Score
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 text-white dark:bg-red-600 dark:text-white">
                  {profile.cgpa}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-black h-3 rounded-full overflow-hidden p-0.5 my-3 border border-slate-200 dark:border-amber-500/30">
                <div
                  className="bg-slate-900 dark:bg-amber-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: '96.5%' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                <span>Scale: 0.00 to 4.00</span>
                <span className="font-bold text-slate-900 dark:text-amber-400">96.5% Performance</span>
              </div>
            </div>

            {/* Grid of Highlight Pills */}
            <div className="grid grid-cols-2 gap-3">
              {about.highlights.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/20 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-black text-slate-800 dark:text-amber-400 flex items-center justify-center mb-2 border dark:border-amber-500/20">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block uppercase">
                    {item.label}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-zinc-100 block mt-0.5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

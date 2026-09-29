import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Mail,
  Linkedin,
  Github,
  Globe,
  Cpu,
  BarChart2,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, isAdminLoggedIn, setShowAdminDrawer, setShowResumeModal } = usePortfolio();
  const { profile } = data;

  const roles = [
    'Data Science & AI Enthusiast',
    'Machine Learning Developer',
    'Python & Analytics Specialist',
    'Hugging Face Spaces Builder',
  ];

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [roles.length]);

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'mail':
        return <Mail className="w-3.5 h-3.5" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5" />;
      case 'github':
        return <Github className="w-3.5 h-3.5" />;
      case 'globe':
      case 'portfolio':
        return <Globe className="w-3.5 h-3.5" />;
      case 'cpu':
      case 'hugging-face':
      case 'huggingface':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'barchart2':
      case 'kaggle':
        return <BarChart2 className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-20 border-b border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/30 text-slate-700 dark:text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>Abasyn University • CGPA: {profile.cgpa} / 4.00</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-slate-900 dark:text-white leading-[1.05]">
                Hi, I'm{' '}
                <span className="text-slate-900 dark:text-amber-400 underline decoration-slate-300 dark:decoration-red-600 underline-offset-8">
                  {profile.name}
                </span>
              </h1>
              <div className="h-10 flex items-center">
                <span className="text-lg sm:text-xl font-bold text-slate-700 dark:text-amber-400 transition-all duration-300">
                  {profile.title} &mdash;{' '}
                  <span className="text-indigo-600 dark:text-red-500 font-mono text-base">{roles[roleIndex]}</span>
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
              {profile.bio}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300 transition-all flex items-center gap-2 shadow-sm font-extrabold"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setShowResumeModal(true)}
                className="px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-2 shadow-md cursor-pointer border border-amber-300"
              >
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>Preview Resume</span>
              </button>

              <a
                href="#contact"
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-red-600/50 bg-slate-50 dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-slate-700 dark:text-red-500" />
                <span>Contact Direct</span>
              </a>

              {isAdminLoggedIn && (
                <button
                  onClick={() => setShowAdminDrawer(true)}
                  className="px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-amber-400 border border-emerald-300 dark:border-amber-500/40 bg-emerald-50 dark:bg-neutral-900 hover:bg-emerald-100 cursor-pointer"
                >
                  ⚡ Quick CMS Edit
                </button>
              )}
            </div>

            {/* Connectivity Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-neutral-900">
              <h2 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3">
                Connectivity Profiles
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {profile.socialLinks
                  .filter((soc) => soc.visible)
                  .map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-slate-200 dark:border-amber-500/20 rounded-lg bg-slate-50 dark:bg-black text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-neutral-900 dark:hover:border-amber-400/50 transition-all text-[10px] font-bold uppercase flex items-center gap-2"
                    >
                      <span className="text-slate-600 dark:text-amber-400">
                        {getSocialIcon(soc.iconName)}
                      </span>
                      <span className="truncate">{soc.platform}</span>
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Metrics Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl space-y-6 shadow-sm">
              {/* Profile Header */}
              <div className="flex items-center gap-4 border-b border-slate-200 dark:border-neutral-900 pb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-300 dark:border-amber-400/50 shadow-md">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                    {profile.name}
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 dark:text-amber-400">
                    {profile.degree}
                  </p>
                  <p className="text-xs text-slate-400">
                    {profile.university}
                  </p>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
                    Academic CGPA
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-amber-400">
                    {profile.cgpa}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Abasyn University</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
                    Certifications
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-red-500">
                    {data.certifications.filter((c) => c.visible).length}+
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Verified Credentials</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
                    Case Studies
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-amber-400">
                    {data.projects.filter((p) => p.visible).length}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">AI & Web Apps</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
                    Status
                  </span>
                  <div className="text-xs font-black text-slate-900 dark:text-red-500 mt-1 uppercase">
                    Available
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Open to Roles</span>
                </div>
              </div>

              {/* Status Update Strip */}
              <div className="bg-slate-900 dark:bg-black rounded-xl p-4 text-white flex items-center justify-between border border-slate-800 dark:border-amber-500/30">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-amber-400/80">System Capability</span>
                  <span className="text-xs font-bold text-white dark:text-white">Data Science & AI Apps Ready</span>
                </div>
                <div className="w-7 h-7 rounded-full border border-slate-700 dark:border-amber-400 flex items-center justify-center text-xs text-amber-400">
                  ↗
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ExternalLink, Github, Cpu, BookOpen, CheckCircle } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const { selectedProject, setSelectedProject } = usePortfolio();

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col my-auto border border-slate-200 dark:border-amber-500/30">
        {/* Top Header */}
        <div className="p-6 bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold">
              {selectedProject.category}
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {selectedProject.title}
            </h3>
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-neutral-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Cover Image */}
          {selectedProject.imageUrl && (
            <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-100 dark:bg-black border border-slate-200 dark:border-amber-500/20">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-amber-400/80">
              Project Overview
            </h4>
            <p className="text-sm text-slate-800 dark:text-zinc-100 font-medium leading-relaxed">
              {selectedProject.shortDesc}
            </p>
          </div>

          {/* Full Case Study Writeup */}
          {selectedProject.fullCaseStudy && (
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-neutral-900">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-amber-400/80 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-900 dark:text-red-500" />
                Case Study & Technical Implementation
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                {selectedProject.fullCaseStudy}
              </p>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-neutral-900">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-amber-400/80">
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedProject.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded text-slate-700 dark:text-amber-400 flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3 text-slate-500 dark:text-red-500" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-amber-400 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/30 hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
            {selectedProject.demoUrl && (
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-amber-400 dark:text-black font-extrabold hover:opacity-90 flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                <span>Live Demo</span>
              </a>
            )}
            {selectedProject.huggingfaceUrl && (
              <a
                href={selectedProject.huggingfaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 dark:bg-red-950/80 dark:text-red-400 border border-amber-200 dark:border-red-500/30 hover:opacity-90 flex items-center gap-1.5 transition"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Hugging Face Space</span>
              </a>
            )}
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-neutral-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

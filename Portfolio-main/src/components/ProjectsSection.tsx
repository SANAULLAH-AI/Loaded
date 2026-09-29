import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Code2,
  ExternalLink,
  Github,
  Cpu,
  Search,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  Filter,
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { data, setSelectedProject, isAdminLoggedIn, setShowAdminDrawer, deleteProject } =
    usePortfolio();
  const { projects, sectionVisibility } = data;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!sectionVisibility.projects) return null;

  const visibleProjects = projects.filter((p) => p.visible);

  const categories = ['All', 'AI & Data Science', 'Mobile Apps', 'Web Apps', 'Cheatsheets & Tools'];

  const filteredProjects = visibleProjects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
              Portfolio Works
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Featured Projects
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={() => setShowAdminDrawer(true)}
                className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold flex items-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 shadow-2xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-black shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-neutral-900 dark:hover:text-amber-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-amber-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-white dark:bg-black border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-amber-500/30 p-8 space-y-3">
            <Filter className="w-8 h-8 text-slate-400 dark:text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold uppercase text-slate-700 dark:text-zinc-300">
              No matching projects
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Media Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-black border-b border-slate-200 dark:border-amber-500/20">
                  <img
                    src={
                      project.imageUrl ||
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'
                    }
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-900/90 text-white dark:bg-black/90 dark:text-amber-400 border border-white/20 dark:border-amber-500/30">
                      {project.category}
                    </span>
                  </div>

                  {/* Admin Quick Buttons */}
                  {isAdminLoggedIn && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 dark:bg-black/90 p-1 rounded-lg border dark:border-amber-500/30">
                      <button
                        onClick={() => setShowAdminDrawer(true)}
                        className="p-1 text-slate-200 hover:text-amber-400"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 font-normal">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded text-slate-700 dark:text-amber-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-amber-500/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-slate-200 dark:border-amber-500/20 text-slate-600 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-neutral-900 dark:hover:text-amber-400 transition"
                        title="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-slate-200 dark:border-amber-500/20 text-slate-600 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-neutral-900 dark:hover:text-amber-400 transition"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.huggingfaceUrl && (
                      <a
                        href={project.huggingfaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-slate-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-slate-200/60 dark:hover:bg-neutral-900 transition"
                        title="Hugging Face Space"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-amber-400 border border-slate-200 dark:border-amber-500/30 bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-red-500" />
                    <span>Case Study</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

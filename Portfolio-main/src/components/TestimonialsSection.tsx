import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Linkedin,
  UserCheck,
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { testimonials, sectionVisibility } = data;

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!sectionVisibility.testimonials || !testimonials || testimonials.length === 0) {
    return null;
  }

  const visibleTestimonials = testimonials.filter((t) => t.visible);

  if (visibleTestimonials.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length);
  };

  const current = visibleTestimonials[currentIndex];

  return (
    <section id="testimonials" className="py-16 border-b border-slate-200 dark:border-amber-500/20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
              Peer & Academic Endorsements
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Testimonials & Mentorship
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xl">
              Endorsements and feedback from university department heads, professors, and industry lead data scientists.
            </p>
          </div>

          {/* Slider Controls */}
          {visibleTestimonials.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-amber-500/20 hover:border-amber-400 transition cursor-pointer"
                title="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-400">
                {currentIndex + 1} / {visibleTestimonials.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-amber-500/20 hover:border-amber-400 transition cursor-pointer"
                title="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Card */}
        <div className="relative p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-neutral-950 border-2 border-slate-200 dark:border-amber-500/30 shadow-xl overflow-hidden">
          <Quote className="absolute top-6 right-6 w-20 h-20 text-slate-200 dark:text-amber-500/10 pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl">
            {/* Rating & Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-400 text-black">
                {current.relationship || 'Verified Mentor'}
              </span>
            </div>

            {/* Quote */}
            <blockquote className="text-base sm:text-lg font-medium text-slate-800 dark:text-zinc-100 leading-relaxed italic">
              "{current.quote}"
            </blockquote>

            {/* Author Profile */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-amber-500/20">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-black flex items-center justify-center text-base shadow-md uppercase">
                {current.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{current.name}</span>
                  {current.linkedinUrl && (
                    <a
                      href={current.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  {current.role} &bull; <span className="font-bold text-amber-600 dark:text-amber-400">{current.organization}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

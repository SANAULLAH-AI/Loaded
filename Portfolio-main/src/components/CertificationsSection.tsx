import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Award,
  ExternalLink,
  Search,
  Plus,
  Edit3,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const { data, setSelectedCert, isAdminLoggedIn, setShowAdminDrawer, deleteCertification } =
    usePortfolio();
  const { certifications, sectionVisibility } = data;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('All');

  if (!sectionVisibility.certifications) return null;

  const visibleCerts = certifications.filter((c) => c.visible);

  const issuers = ['All', ...Array.from(new Set(visibleCerts.map((c) => c.issuer)))];

  const filteredCerts = visibleCerts.filter((cert) => {
    const matchesIssuer = selectedIssuer === 'All' || cert.issuer === selectedIssuer;
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesIssuer && matchesSearch;
  });

  return (
    <section id="certifications" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-slate-50/50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
              Verified Knowledge & Credentials
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Certifications & Badges
            </h3>
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={() => setShowAdminDrawer(true)}
              className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold flex items-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certificate</span>
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 shadow-2xs">
          {/* Issuer Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {issuers.map((iss) => (
              <button
                key={iss}
                onClick={() => setSelectedIssuer(iss)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedIssuer === iss
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-black shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-neutral-900 dark:hover:text-amber-400'
                }`}
              >
                {iss}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-amber-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Certifications Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all duration-300 shadow-sm group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 dark:bg-black dark:text-amber-400 border border-slate-200 dark:border-amber-500/30">
                    {cert.issuer}
                  </span>
                  {cert.date && (
                    <span className="text-[10px] font-bold text-slate-400 dark:text-red-500 uppercase tracking-wider">
                      {cert.date}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug">
                  {cert.title}
                </h4>

                {/* Optional Certificate Image Thumbnail */}
                {cert.imageUrl && (
                  <div
                    onClick={() => setSelectedCert(cert)}
                    className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-amber-500/20 cursor-pointer group-hover:opacity-95 transition"
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Tags & Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between">
                <div className="flex flex-wrap gap-1 max-w-[70%]">
                  {cert.tags.slice(0, 2).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-[10px] font-mono rounded text-slate-600 dark:text-amber-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-black text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-neutral-900 dark:hover:text-amber-400 transition cursor-pointer"
                    title="View Certificate Details"
                  >
                    {cert.imageUrl ? (
                      <ImageIcon className="w-3.5 h-3.5 text-slate-900 dark:text-amber-400" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>

                  {cert.credentialUrl && cert.credentialUrl !== '#' && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-black text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-neutral-900 dark:hover:text-red-500 transition"
                      title="Verify Credential Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {isAdminLoggedIn && (
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => setShowAdminDrawer(true)}
                    className="p-1 rounded bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-amber-400 border dark:border-amber-500/20"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCertification(cert.id)}
                    className="p-1 rounded bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border dark:border-red-500/30"
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

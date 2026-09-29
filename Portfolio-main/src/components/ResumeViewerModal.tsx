import React, { useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  Download,
  Printer,
  FileText,
  Mail,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Trash2,
  Upload,
} from 'lucide-react';

export const ResumeViewerModal: React.FC = () => {
  const { data, showResumeModal, setShowResumeModal, isAdminLoggedIn, updateProfile } = usePortfolio();
  const { profile, education, skills, projects, certifications, internships } = data;

  const resumePrintRef = useRef<HTMLDivElement>(null);

  if (!showResumeModal) return null;

  const handlePrintDownload = () => {
    window.print();
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateProfile({ resumeUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteResume = () => {
    if (window.confirm('Are you sure you want to delete the uploaded custom resume document?')) {
      updateProfile({ resumeUrl: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-printable-area, #resume-printable-area * {
            visibility: visible;
          }
          #resume-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-amber-500/30 flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 dark:bg-black border-b border-slate-200 dark:border-amber-500/20 flex flex-wrap items-center justify-between text-white shrink-0 gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
              <FileText className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>Curriculum Vitae</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-black">
                  Verified PDF
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Official Resume Document of {profile.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Upload / Delete Controls */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-1.5 mr-2">
                {profile.resumeUrl ? (
                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 transition flex items-center gap-1 cursor-pointer"
                    title="Delete Uploaded Resume Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete Resume File</span>
                  </button>
                ) : (
                  <label className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 transition flex items-center gap-1 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom PDF/Doc</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            <button
              onClick={handlePrintDownload}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print CV</span>
            </button>

            <button
              onClick={() => setShowResumeModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Resume View Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-black">
          {profile.resumeUrl ? (
            /* Uploaded PDF/Image preview embed */
            <div className="w-full space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Custom Resume File Attached
                </span>
                <a
                  href={profile.resumeUrl}
                  download="Sanaullah_Resume.pdf"
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition"
                >
                  Direct File Download
                </a>
              </div>

              {profile.resumeUrl.startsWith('data:image') || profile.resumeUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img
                  src={profile.resumeUrl}
                  alt="Resume Document Scan"
                  className="w-full rounded-xl shadow-lg border border-slate-200 dark:border-neutral-800"
                />
              ) : (
                <iframe
                  src={profile.resumeUrl}
                  title="Resume PDF Document"
                  className="w-full h-[700px] rounded-xl shadow-lg border border-slate-200 dark:border-neutral-800 bg-white"
                />
              )}
            </div>
          ) : (
            /* Dynamic Recruiter-Ready CV Document Layout */
            <div
              id="resume-printable-area"
              ref={resumePrintRef}
              className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/30 rounded-2xl shadow-xl p-6 sm:p-10 space-y-8 text-slate-900 dark:text-zinc-100 font-sans"
            >
              {/* CV Header */}
              <div className="border-b-2 border-amber-400 pb-6 flex flex-wrap justify-between items-start gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    {profile.name}
                  </h1>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    {profile.title} &bull; {profile.degree}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {profile.university} | CGPA: <strong className="text-slate-900 dark:text-white">{profile.cgpa}</strong>
                  </p>
                </div>

                <div className="space-y-1 text-xs font-mono text-slate-600 dark:text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    <span>{profile.phone || '+92 325 1907930'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{profile.location || 'Islamabad, Pakistan'}</span>
                  </div>
                </div>
              </div>

              {/* Bio Summary */}
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-amber-500/20 pb-1">
                  Executive Professional Summary
                </h2>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
                  {profile.bio}
                </p>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-amber-500/20 pb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Education & Academic Credentials
                </h2>
                {education.filter(e => e.visible).map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold uppercase text-slate-900 dark:text-white">
                        {edu.degree}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                        {edu.duration}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-zinc-300 flex justify-between">
                      <span>{edu.institution}, {edu.location}</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">CGPA: {edu.cgpa}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Key Skills */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-amber-500/20 pb-1 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  Core Technical Competencies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.filter(s => s.visible).map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <span className="text-[11px] font-bold uppercase text-slate-800 dark:text-zinc-200 block">
                        {cat.categoryName}:
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                        {cat.skills.map(s => s.name).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Highlight Projects */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-amber-500/20 pb-1 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  Key AI & Software Engineering Projects
                </h2>
                <div className="space-y-2.5">
                  {projects.filter(p => p.visible).slice(0, 4).map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold uppercase text-slate-900 dark:text-white">
                          {proj.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {proj.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-300">
                        {proj.shortDesc}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {proj.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-100 dark:bg-black text-slate-700 dark:text-amber-400 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-amber-500/20 pb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Verified Certifications & Licenses
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-zinc-300 list-disc list-inside">
                  {certifications.filter(c => c.visible).slice(0, 6).map((cert) => (
                    <li key={cert.id} className="text-[11px]">
                      <strong className="text-slate-900 dark:text-white">{cert.title}</strong> — {cert.issuer} ({cert.date || '2024'})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  User,
  BookOpen,
  GraduationCap,
  Code2,
  Cpu,
  Award,
  Briefcase,
  Layers,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  FileImage,
  Globe,
  Sparkles,
  ShieldAlert,
  Sliders,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Database,
  RefreshCw,
  Inbox,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import {
  CertificationItem,
  CustomSection,
  CustomSectionItem,
  EducationItem,
  EmergingTechItem,
  InternshipItem,
  ProjectItem,
  PublicationItem,
  SkillCategory,
  TestimonialItem,
} from '../types/portfolio';
import { ImageCropStudioModal } from './ImageCropStudioModal';
import { uploadImageToMongoDB } from '../lib/mongodb';

export const AdminCMSDrawer: React.FC = () => {
  const {
    data,
    showAdminDrawer,
    setShowAdminDrawer,
    logoutAdmin,
    adminCredentials,
    updateAdminCredentials,
    updateProfile,
    updateAbout,
    setAccentTheme,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addEmergingTech,
    updateEmergingTech,
    deleteEmergingTech,
    addProject,
    updateProject,
    deleteProject,
    addPublication,
    updatePublication,
    deletePublication,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addCertification,
    updateCertification,
    deleteCertification,
    addInternship,
    updateInternship,
    deleteInternship,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    toggleSectionVisibility,
    resetToDefaults,
    exportJSON,
    importJSON,
    supabaseStatus,
    supabaseMsg,
    syncToSupabaseNow,
    loadFromSupabaseNow,
    adminSyncStatus,
    adminSyncMsg,
    contactMessages,
    contactMessagesCount,
    contactMessagesSource,
    inboxStatus,
    refreshContactMessages,
    deleteContactMessage,
    clearAllContactMessages,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    | 'projects'
    | 'publications'
    | 'testimonials'
    | 'certifications'
    | 'profile'
    | 'about'
    | 'education'
    | 'skills'
    | 'emergingTech'
    | 'internships'
    | 'customSections'
    | 'messages'
    | 'visibility'
    | 'security'
  >('projects');

  // Form states for modal/in-drawer additions
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingPub, setEditingPub] = useState<Partial<PublicationItem> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [editingEdu, setEditingEdu] = useState<Partial<EducationItem> | null>(null);
  const [editingSkillCat, setEditingSkillCat] = useState<Partial<SkillCategory> | null>(null);
  const [editingEmerging, setEditingEmerging] = useState<Partial<EmergingTechItem> | null>(null);
  const [editingInternship, setEditingInternship] = useState<Partial<InternshipItem> | null>(null);
  const [editingCustomSec, setEditingCustomSec] = useState<Partial<CustomSection> | null>(null);

  // Security Credentials form
  const [newUsername, setNewUsername] = useState(adminCredentials.username);
  const [newPassword, setNewPassword] = useState(adminCredentials.pass);
  const [credSuccessMsg, setCredSuccessMsg] = useState('');

  // New item temp states
  const [newHighlightLabel, setNewHighlightLabel] = useState('');
  const [newHighlightValue, setNewHighlightValue] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(85);

  // Image Crop & Beauty Filter Studio state
  const [studioConfig, setStudioConfig] = useState<{
    isOpen: boolean;
    initialUrl: string;
    title: string;
    aspectRatio: '1:1' | '16:9' | '4:3' | 'free';
    onApply: (croppedDataUrl: string) => void;
  }>({
    isOpen: false,
    initialUrl: '',
    title: 'Image Studio',
    aspectRatio: '1:1',
    onApply: () => {},
  });

  // Keep security form fields synced with latest admin credentials from context / MongoDB
  useEffect(() => {
    setNewUsername(adminCredentials.username);
    setNewPassword(adminCredentials.pass);
  }, [adminCredentials.username, adminCredentials.pass]);

  // Auto-refresh contact messages when drawer opens OR user switches to messages tab
  useEffect(() => {
    if (showAdminDrawer && (activeTab === 'messages' || inboxStatus === 'idle')) {
      void refreshContactMessages();
    }
  }, [showAdminDrawer, activeTab]);

  if (!showAdminDrawer) return null;

  // Helper for file upload base64 conversion + MongoDB Atlas asset upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          const dataUrl = reader.result as string;
          callback(dataUrl);
          // Also persist to MongoDB Atlas portfolio_uploads collection for cross-browser sync
          try {
            await uploadImageToMongoDB(dataUrl, file.name || `cms_upload_${Date.now()}`);
          } catch (e) {
            console.warn('[MongoDB Upload] Non-critical: could not proxy upload to /api/upload:', e);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Crop Studio "onApply" also uploads cropped asset to MongoDB Atlas
  const wrapStudioApplyWithMongoUpload = (
    baseApply: (croppedDataUrl: string) => void,
    label?: string
  ) => {
    return async (croppedDataUrl: string) => {
      baseApply(croppedDataUrl);
      try {
        await uploadImageToMongoDB(croppedDataUrl, label || `cropped_studio_${Date.now()}`);
      } catch (e) {
        console.warn('[MongoDB Upload] Non-critical: could not save cropped image:', e);
      }
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl h-full bg-white dark:bg-black border-l border-slate-200 dark:border-amber-500/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 dark:bg-neutral-950 text-white border-b border-slate-800 dark:border-amber-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span>CMS Admin Control Center</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-black">
                  LIVE CMS
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 dark:text-amber-400/80 font-mono">
                Logged as: <span className="font-bold text-amber-400">sanaullah786shah92</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/80 hover:bg-red-900 transition cursor-pointer"
            >
              Logout
            </button>
            <button
              onClick={() => setShowAdminDrawer(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:hover:text-amber-400 hover:bg-slate-800 dark:hover:bg-neutral-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 dark:bg-neutral-950 border-b border-slate-200 dark:border-amber-500/20 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'projects', label: 'Projects', icon: <Code2 className="w-3.5 h-3.5" /> },
            { id: 'publications', label: 'Publications & Articles', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare className="w-3.5 h-3.5" /> },
            { id: 'certifications', label: 'Certifications', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'profile', label: 'Profile & Resume', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'about', label: 'About & Stats', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'skills', label: 'Skills & Levels', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'emergingTech', label: 'Emerging Tech', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'internships', label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'customSections', label: 'Custom Sections', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'messages', label: 'Inbox', icon: <Inbox className="w-3.5 h-3.5" />, badge: contactMessagesCount > 0 ? String(contactMessagesCount) : null },
            { id: 'visibility', label: 'Visibility & Backup', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'security', label: 'Security & Theme', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 cursor-pointer relative ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-neutral-900 dark:hover:text-amber-400'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-0.5 -mt-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 bg-slate-50 dark:bg-black">
          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Projects & Case Studies Manager
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage project cards, live demo URLs, GitHub repositories, case study writeups, and cover screenshots.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingProject({
                      title: '',
                      category: 'AI & Data Science',
                      shortDesc: '',
                      fullCaseStudy: '',
                      technologies: ['Python'],
                      visible: true,
                      featured: false,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              {/* Project Editor Form Modal inside drawer */}
              {editingProject && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingProject.id ? 'Edit Project' : 'Add New Project'}
                    </h4>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={editingProject.title || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        placeholder="e.g. AI Chatbot"
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Category *
                      </label>
                      <select
                        value={editingProject.category || 'AI & Data Science'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      >
                        <option value="AI & Data Science">AI & Data Science</option>
                        <option value="Mobile Apps">Mobile Apps</option>
                        <option value="Web Apps">Web Apps</option>
                        <option value="Cheatsheets & Tools">Cheatsheets & Tools</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Short Overview Summary
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDesc || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortDesc: e.target.value })
                      }
                      placeholder="Brief card overview description..."
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Full Case Study Breakdown
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.fullCaseStudy || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, fullCaseStudy: e.target.value })
                      }
                      placeholder="Detailed case study implementation story, methodology, and features..."
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/..."
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={editingProject.demoUrl || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, demoUrl: e.target.value })
                        }
                        placeholder="https://demo.com"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Hugging Face Space URL
                      </label>
                      <input
                        type="text"
                        value={editingProject.huggingfaceUrl || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, huggingfaceUrl: e.target.value })
                        }
                        placeholder="https://huggingface.co/spaces/..."
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Cover Image (Image URL, Upload, or AI Crop Studio)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={editingProject.imageUrl || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, imageUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 min-w-[200px] p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setStudioConfig({
                            isOpen: true,
                            initialUrl: editingProject.imageUrl || '',
                            title: 'Crop & Beautify Project Image',
                            aspectRatio: '16:9',
                            onApply: (dataUrl) =>
                              setEditingProject({ ...editingProject, imageUrl: dataUrl }),
                          })
                        }
                        className="px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-600" />
                        <span>Crop & Beautify</span>
                      </button>
                      <label className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer hover:opacity-90 flex items-center gap-1.5 shrink-0">
                        <FileImage className="w-3.5 h-3.5" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) =>
                              setEditingProject({ ...editingProject, imageUrl: base64 })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.technologies?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      placeholder="Python, Pandas, React, TensorFlow"
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingProject.featured || false}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, featured: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Featured Project</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingProject.visible !== false}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, visible: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Visible on Portfolio</span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      if (!editingProject.title) return;
                      if (editingProject.id) {
                        updateProject(editingProject.id, editingProject);
                      } else {
                        addProject(editingProject as any);
                      }
                      setEditingProject(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {(data.projects || []).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      {proj.imageUrl ? (
                        <img
                          src={proj.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 font-bold text-xs">
                          NO IMG
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                            {proj.title}
                          </h4>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {proj.category}
                          </span>
                          {proj.featured && (
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {proj.shortDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          updateProject(proj.id, { visible: !proj.visible })
                        }
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          proj.visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {proj.visible ? 'Visible' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PUBLICATIONS */}
          {activeTab === 'publications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Research Publications & Technical Articles
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage academic paper entries, publisher badges, abstracts, authors, preprints, and citation links.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingPub({
                      title: '',
                      publisher: 'IEEE / arXiv',
                      date: '2024',
                      authors: 'Sanaullah',
                      description: '',
                      abstract: '',
                      url: '',
                      tags: ['NLP', 'Machine Learning'],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Publication</span>
                </button>
              </div>

              {/* Editing Form */}
              {editingPub && (
                <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-amber-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-neutral-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                      {editingPub.id ? 'Edit Publication / Article' : 'Add New Publication'}
                    </h4>
                    <button
                      onClick={() => setEditingPub(null)}
                      className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Paper Title *
                      </label>
                      <input
                        type="text"
                        value={editingPub.title || ''}
                        onChange={(e) => setEditingPub({ ...editingPub, title: e.target.value })}
                        placeholder="e.g. Deep Learning Approaches for Urdu Sentiment Analysis"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Publisher / Journal / Platform
                      </label>
                      <input
                        type="text"
                        value={editingPub.publisher || ''}
                        onChange={(e) => setEditingPub({ ...editingPub, publisher: e.target.value })}
                        placeholder="e.g. IEEE / arXiv / Kaggle Writeups"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Authors
                      </label>
                      <input
                        type="text"
                        value={editingPub.authors || ''}
                        onChange={(e) => setEditingPub({ ...editingPub, authors: e.target.value })}
                        placeholder="e.g. Sanaullah, Dr. A. Rahman"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Publication Year
                      </label>
                      <input
                        type="text"
                        value={editingPub.date || ''}
                        onChange={(e) => setEditingPub({ ...editingPub, date: e.target.value })}
                        placeholder="2024"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={editingPub.description || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, description: e.target.value })}
                      placeholder="Brief overview of research outcomes..."
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                      Full Paper Abstract
                    </label>
                    <textarea
                      rows={3}
                      value={editingPub.abstract || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, abstract: e.target.value })}
                      placeholder="Paste abstract summary here..."
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Paper URL / Preprint Link
                      </label>
                      <input
                        type="text"
                        value={editingPub.url || ''}
                        onChange={(e) => setEditingPub({ ...editingPub, url: e.target.value })}
                        placeholder="https://arxiv.org/abs/..."
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(editingPub.tags || []).join(', ')}
                        onChange={(e) =>
                          setEditingPub({
                            ...editingPub,
                            tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="NLP, Deep Learning, Urdu"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!editingPub.title) return alert('Title is required');
                      if (editingPub.id) {
                        updatePublication(editingPub.id, editingPub);
                      } else {
                        addPublication({
                          title: editingPub.title,
                          publisher: editingPub.publisher || 'Research Journal',
                          date: editingPub.date || '2024',
                          authors: editingPub.authors || 'Sanaullah',
                          description: editingPub.description || '',
                          abstract: editingPub.abstract || '',
                          url: editingPub.url || '',
                          tags: editingPub.tags || ['Research'],
                          visible: editingPub.visible ?? true,
                        });
                      }
                      setEditingPub(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase bg-amber-400 text-black hover:bg-amber-300 cursor-pointer shadow-sm"
                  >
                    Save Publication
                  </button>
                </div>
              )}

              {/* Publications List */}
              <div className="space-y-3">
                {(data.publications || []).map((pub) => (
                  <div
                    key={pub.id}
                    className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                          {pub.title}
                        </h4>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400 text-black">
                          {pub.publisher}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        {pub.authors} &bull; {pub.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updatePublication(pub.id, { visible: !pub.visible })}
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          pub.visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {pub.visible ? 'Published' : 'Draft / Hidden'}
                      </button>
                      <button
                        onClick={() => setEditingPub(pub)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePublication(pub.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Testimonials & Mentor Recommendations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage testimonials from university professors, internship lead supervisors, and collaborators.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingTestimonial({
                      name: '',
                      role: '',
                      organization: 'Abasyn University',
                      quote: '',
                      relationship: 'Academic Mentor',
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Testimonial</span>
                </button>
              </div>

              {/* Editing Form */}
              {editingTestimonial && (
                <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-amber-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-neutral-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                      {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
                    </h4>
                    <button
                      onClick={() => setEditingTestimonial(null)}
                      className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Mentor Name *
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.name || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                        placeholder="e.g. Dr. Tariq Mahmood"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.role || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                        placeholder="e.g. Head of Computer Science"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Organization / University
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.organization || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, organization: e.target.value })}
                        placeholder="e.g. Abasyn University Islamabad"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Relationship Badge
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.relationship || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, relationship: e.target.value })}
                        placeholder="e.g. Academic Mentor / Professor"
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                      Endorsement Quote *
                    </label>
                    <textarea
                      rows={3}
                      value={editingTestimonial.quote || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                      placeholder="Sanaullah is an outstanding scholar who..."
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!editingTestimonial.name || !editingTestimonial.quote) {
                        return alert('Name and Quote are required');
                      }
                      if (editingTestimonial.id) {
                        updateTestimonial(editingTestimonial.id, editingTestimonial);
                      } else {
                        addTestimonial({
                          name: editingTestimonial.name,
                          role: editingTestimonial.role || 'Mentor',
                          organization: editingTestimonial.organization || 'Abasyn University',
                          quote: editingTestimonial.quote,
                          relationship: editingTestimonial.relationship || 'Academic Mentor',
                          visible: editingTestimonial.visible ?? true,
                        });
                      }
                      setEditingTestimonial(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase bg-amber-400 text-black hover:bg-amber-300 cursor-pointer shadow-sm"
                  >
                    Save Testimonial
                  </button>
                </div>
              )}

              {/* Testimonials List */}
              <div className="space-y-3">
                {(data.testimonials || []).map((test) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                          {test.name}
                        </h4>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {test.organization}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic mt-0.5">
                        "{test.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateTestimonial(test.id, { visible: !test.visible })}
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          test.visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {test.visible ? 'Published' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => setEditingTestimonial(test)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTestimonial(test.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SECURITY & THEME */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Admin Credentials & Theme Customizer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your CMS login username and password. Credentials are synced to <strong>MongoDB Atlas admin_config</strong> collection for cross-browser persistence, and also cached locally in your browser session.
                </p>
              </div>

              {/* Credentials Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Update CMS Admin Credentials</span>
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      adminSyncStatus === 'synced'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : adminSyncStatus === 'syncing'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse'
                        : adminSyncStatus === 'error'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {adminSyncStatus === 'synced'
                      ? 'MONGODB SYNCED'
                      : adminSyncStatus === 'syncing'
                      ? 'SYNCING TO MONGODB...'
                      : adminSyncStatus === 'error'
                      ? 'SYNC FAILED'
                      : 'LOCAL CACHE'}
                  </span>
                </div>

                <p
                  className={`text-[11px] font-mono p-2.5 rounded-lg border ${
                    adminSyncStatus === 'synced'
                      ? 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                      : adminSyncStatus === 'syncing'
                      ? 'bg-amber-500/5 text-amber-700 dark:text-amber-300 border-amber-500/20'
                      : adminSyncStatus === 'error'
                      ? 'bg-rose-500/5 text-rose-700 dark:text-rose-300 border-rose-500/20'
                      : 'bg-slate-50 dark:bg-black text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {adminSyncMsg}
                </p>

                {credSuccessMsg && (
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
                    {credSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                      CMS Username
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      autoComplete="off"
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                      CMS Password
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={adminSyncStatus === 'syncing'}
                  onClick={async () => {
                    if (!newUsername.trim() || !newPassword.trim()) {
                      return alert('Username and password cannot be empty');
                    }
                    await updateAdminCredentials(newUsername, newPassword);
                    setCredSuccessMsg('Admin login credentials updated & synced to MongoDB Atlas!');
                    setTimeout(() => setCredSuccessMsg(''), 4500);
                  }}
                  className="px-4 py-2.5 rounded-xl font-black text-xs uppercase bg-amber-400 text-black hover:bg-amber-300 transition cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {adminSyncStatus === 'syncing' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save New Credentials (Sync to MongoDB)</span>
                </button>
              </div>

              {/* Accent Theme Palette Switcher */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Select Portfolio Accent Theme
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'amber', name: 'Gold Amber & Crimson', class: 'bg-amber-400 border-red-600' },
                    { id: 'emerald', name: 'Emerald AI Green', class: 'bg-emerald-500 border-emerald-300' },
                    { id: 'blue', name: 'Cyber Neon Blue', class: 'bg-cyan-400 border-blue-600' },
                    { id: 'purple', name: 'Royal Violet', class: 'bg-violet-500 border-purple-300' },
                    { id: 'crimson', name: 'Obsidian Crimson', class: 'bg-red-600 border-amber-400' },
                  ].map((themeOpt) => (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() => setAccentTheme(themeOpt.id as any)}
                      className={`p-3 rounded-xl border-2 text-left space-y-2 transition cursor-pointer ${
                        data.accentTheme === themeOpt.id
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border ${themeOpt.class}`} />
                      <span className="text-[10px] font-bold uppercase text-slate-900 dark:text-white block">
                        {themeOpt.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Certifications & Credentials Manager
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add certificates from Kaggle, Udemy, Coursera, IBM, HP, Forage, etc., with verification links and image scans.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingCert({
                      title: '',
                      issuer: 'Udemy',
                      date: '2024',
                      tags: ['Data Science'],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certificate</span>
                </button>
              </div>

              {/* Editing Form */}
              {editingCert && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingCert.id ? 'Edit Certificate' : 'Add New Certificate'}
                    </h4>
                    <button
                      onClick={() => setEditingCert(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Certificate Title *
                      </label>
                      <input
                        type="text"
                        value={editingCert.title || ''}
                        onChange={(e) =>
                          setEditingCert({ ...editingCert, title: e.target.value })
                        }
                        placeholder="e.g. Python for Data Science"
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Issuer / Organization *
                      </label>
                      <input
                        type="text"
                        value={editingCert.issuer || ''}
                        onChange={(e) =>
                          setEditingCert({ ...editingCert, issuer: e.target.value })
                        }
                        placeholder="Kaggle, Udemy, IBM, Coursera, HP, Forage..."
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Credential Verification URL
                      </label>
                      <input
                        type="text"
                        value={editingCert.credentialUrl || ''}
                        onChange={(e) =>
                          setEditingCert({ ...editingCert, credentialUrl: e.target.value })
                        }
                        placeholder="https://coursera.org/verify/..."
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Year / Date
                      </label>
                      <input
                        type="text"
                        value={editingCert.date || ''}
                        onChange={(e) =>
                          setEditingCert({ ...editingCert, date: e.target.value })
                        }
                        placeholder="2024"
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Certificate Scan Image or Upload */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Certificate Scan Image (URL, Upload, or AI Crop Studio)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={editingCert.imageUrl || ''}
                        onChange={(e) =>
                          setEditingCert({ ...editingCert, imageUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1 min-w-[200px] p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setStudioConfig({
                            isOpen: true,
                            initialUrl: editingCert.imageUrl || '',
                            title: 'Crop & Beautify Certificate Image',
                            aspectRatio: '4:3',
                            onApply: (dataUrl) =>
                              setEditingCert({ ...editingCert, imageUrl: dataUrl }),
                          })
                        }
                        className="px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-600" />
                        <span>Crop & Beautify</span>
                      </button>
                      <label className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer hover:opacity-90 flex items-center gap-1.5 shrink-0">
                        <FileImage className="w-3.5 h-3.5" />
                        <span>Upload Scan</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) =>
                              setEditingCert({ ...editingCert, imageUrl: base64 })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingCert.tags?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          tags: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      placeholder="Python, Kaggle, Machine Learning"
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!editingCert.title) return;
                      if (editingCert.id) {
                        updateCertification(editingCert.id, editingCert);
                      } else {
                        addCertification(editingCert as any);
                      }
                      setEditingCert(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Save Certificate
                  </button>
                </div>
              )}

              {/* Certificate List */}
              <div className="space-y-3">
                {(data.certifications || []).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                      </span>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mt-0.5">
                        {cert.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          updateCertification(cert.id, { visible: !cert.visible })
                        }
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          cert.visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {cert.visible ? 'Visible' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCertification(cert.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROFILE & SOCIALS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Personal Profile & Social Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={data.profile.title}
                    onChange={(e) => updateProfile({ title: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Subtitle Tagline
                  </label>
                  <input
                    type="text"
                    value={data.profile.subtitle}
                    onChange={(e) => updateProfile({ subtitle: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    CGPA Badge
                  </label>
                  <input
                    type="text"
                    value={data.profile.cgpa}
                    onChange={(e) => updateProfile({ cgpa: e.target.value })}
                    className="w-full p-2.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    University Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.university}
                    onChange={(e) => updateProfile({ university: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Academic Session / Years
                  </label>
                  <input
                    type="text"
                    value={data.profile.academicYears}
                    onChange={(e) => updateProfile({ academicYears: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Hero Bio Overview
                </label>
                <textarea
                  rows={3}
                  value={data.profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Avatar Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Profile Avatar Photo (URL, File Upload, or AI Crop Studio)
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={data.profile.avatarUrl || ''}
                    onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 min-w-[200px] p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setStudioConfig({
                        isOpen: true,
                        initialUrl: data.profile.avatarUrl || '',
                        title: 'Crop & Beautify Profile Avatar',
                        aspectRatio: '1:1',
                        onApply: (dataUrl) => updateProfile({ avatarUrl: dataUrl }),
                      })
                    }
                    className="px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>Crop & Beautify Avatar</span>
                  </button>
                  <label className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer hover:opacity-90 flex items-center gap-1.5 shrink-0">
                    <FileImage className="w-3.5 h-3.5" />
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (base64) => updateProfile({ avatarUrl: base64 }))
                      }
                    />
                  </label>
                </div>
                
                {/* Local codebase images directory helper */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Codebase Images Folder (/public/images/):</span>
                  <button
                    type="button"
                    onClick={() => updateProfile({ avatarUrl: '/images/profile-avatar.svg' })}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 font-mono text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    /images/profile-avatar.svg
                  </button>
                </div>
              </div>

              {/* Resume / CV Document Management */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-amber-400">
                      Resume / CV Document Management
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload PDF/Image or enter URL for visitors to preview and download directly.
                    </p>
                  </div>
                  {data.profile.resumeUrl ? (
                    <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active CV Loaded
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase bg-slate-800 text-slate-400">
                      No CV Uploaded
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={data.profile.resumeUrl || ''}
                    onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
                    placeholder="Paste PDF or Image URL..."
                    className="flex-1 min-w-[200px] p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-black dark:text-white"
                  />

                  <label className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF / Image CV</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (base64) => updateProfile({ resumeUrl: base64 }))
                      }
                    />
                  </label>

                  {data.profile.resumeUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete current resume document?')) {
                          updateProfile({ resumeUrl: '' });
                        }
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete CV</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Social Channels Manager */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Social Channels & External Profile Links
                </h4>
                <div className="space-y-2">
                  {((data.profile && data.profile.socialLinks) || []).map((soc, idx) => (
                    <div key={soc.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={soc.platform}
                        onChange={(e) => {
                          const updated = [...data.profile.socialLinks];
                          updated[idx].platform = e.target.value;
                          updateProfile({ socialLinks: updated });
                        }}
                        className="w-32 p-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const updated = [...data.profile.socialLinks];
                          updated[idx].url = e.target.value;
                          updateProfile({ socialLinks: updated });
                        }}
                        className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const updated = [...data.profile.socialLinks];
                          updated[idx].visible = !updated[idx].visible;
                          updateProfile({ socialLinks: updated });
                        }}
                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          soc.visible
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                        }`}
                      >
                        {soc.visible ? 'Show' : 'Hide'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ABOUT & STATS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                About Section & Quick Stat Highlights
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.about.title}
                  onChange={(e) => updateAbout({ title: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Detailed Story & Background
                </label>
                <textarea
                  rows={4}
                  value={data.about.content}
                  onChange={(e) => updateAbout({ content: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Highlights Editor */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Highlight Stat Cards
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((data.about && data.about.highlights) || []).map((h, idx) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                    >
                      <input
                        type="text"
                        value={h.label}
                        onChange={(e) => {
                          const updated = [...data.about.highlights];
                          updated[idx].label = e.target.value;
                          updateAbout({ highlights: updated });
                        }}
                        placeholder="Label"
                        className="w-full p-1.5 text-xs font-bold rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                      <input
                        type="text"
                        value={h.value}
                        onChange={(e) => {
                          const updated = [...data.about.highlights];
                          updated[idx].value = e.target.value;
                          updateAbout({ highlights: updated });
                        }}
                        placeholder="Value (e.g. 3.86 CGPA)"
                        className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Education & Academics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Degrees, academic honors, CGPA records, and key coursework modules.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingEdu({
                      institution: 'Abasyn University Islamabad Campus',
                      degree: 'BS Computer Science',
                      cgpa: '3.86/4.00',
                      duration: '2023 - Present',
                      description: 'Comprehensive study of Computer Science fundamentals.',
                      courses: ['Data Structures', 'Database Systems'],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              </div>

              {/* Education Editor */}
              {editingEdu && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingEdu.id ? 'Edit Education Entry' : 'Add Education Entry'}
                    </h4>
                    <button
                      onClick={() => setEditingEdu(null)}
                      className="text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={editingEdu.institution || ''}
                        onChange={(e) =>
                          setEditingEdu({ ...editingEdu, institution: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Degree Program
                      </label>
                      <input
                        type="text"
                        value={editingEdu.degree || ''}
                        onChange={(e) =>
                          setEditingEdu({ ...editingEdu, degree: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        CGPA / Marks
                      </label>
                      <input
                        type="text"
                        value={editingEdu.cgpa || ''}
                        onChange={(e) =>
                          setEditingEdu({ ...editingEdu, cgpa: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Duration / Session
                      </label>
                      <input
                        type="text"
                        value={editingEdu.duration || ''}
                        onChange={(e) =>
                          setEditingEdu({ ...editingEdu, duration: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingEdu.description || ''}
                      onChange={(e) =>
                        setEditingEdu({ ...editingEdu, description: e.target.value })
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Key Course Modules (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingEdu.courses?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          courses: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!editingEdu.institution) return;
                      if (editingEdu.id) {
                        updateEducation(editingEdu.id, editingEdu);
                      } else {
                        addEducation(editingEdu as any);
                      }
                      setEditingEdu(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Education
                  </button>
                </div>
              )}

              {/* Education List */}
              <div className="space-y-3">
                {(data.education || []).map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        {edu.duration} • {edu.cgpa}
                      </span>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-xs text-slate-500">{edu.institution}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingEdu(edu)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SKILLS & PROFICIENCY */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Technical Skills & Proficiency Levels
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Organize skills into categories and set percentage levels (0-100%) for progress bars.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingSkillCat({
                      categoryName: 'New Skill Category',
                      skills: [{ name: 'Python', level: 90 }],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Category Editor */}
              {editingSkillCat && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingSkillCat.id ? 'Edit Skill Category' : 'Add Skill Category'}
                    </h4>
                    <button
                      onClick={() => setEditingSkillCat(null)}
                      className="text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={editingSkillCat.categoryName || ''}
                      onChange={(e) =>
                        setEditingSkillCat({ ...editingSkillCat, categoryName: e.target.value })
                      }
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Skills in this Category
                    </label>

                    {editingSkillCat.skills?.map((sk, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={sk.name}
                          onChange={(e) => {
                            const updatedSkills = [...(editingSkillCat.skills || [])];
                            updatedSkills[idx].name = e.target.value;
                            setEditingSkillCat({ ...editingSkillCat, skills: updatedSkills });
                          }}
                          placeholder="Skill Name"
                          className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={sk.level || 80}
                            onChange={(e) => {
                              const updatedSkills = [...(editingSkillCat.skills || [])];
                              updatedSkills[idx].level = Number(e.target.value);
                              setEditingSkillCat({ ...editingSkillCat, skills: updatedSkills });
                            }}
                            className="w-16 p-2 text-xs font-bold text-center rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          />
                          <span className="text-xs font-bold">%</span>
                        </div>
                        <button
                          onClick={() => {
                            const updatedSkills = (editingSkillCat.skills || []).filter((_, i) => i !== idx);
                            setEditingSkillCat({ ...editingSkillCat, skills: updatedSkills });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const updatedSkills = [...(editingSkillCat.skills || []), { name: 'New Skill', level: 85 }];
                        setEditingSkillCat({ ...editingSkillCat, skills: updatedSkills });
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer hover:opacity-90 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill Item</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (!editingSkillCat.categoryName) return;
                      if (editingSkillCat.id) {
                        updateSkillCategory(editingSkillCat.id, editingSkillCat);
                      } else {
                        addSkillCategory(editingSkillCat as any);
                      }
                      setEditingSkillCat(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Category
                  </button>
                </div>
              )}

              {/* Skills List */}
              <div className="space-y-4">
                {(data.skills || []).map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {cat.categoryName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingSkillCat(cat)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSkillCategory(cat.id)}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                        >
                          <span>{s.name}</span>
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                            {s.level || 80}%
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EMERGING TECH */}
          {activeTab === 'emergingTech' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Emerging Tech Radar & Tools
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highlight cutting-edge tech (Hugging Face, Scikit-Learn, Deep Learning, Git, Model Deployment).
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingEmerging({
                      title: 'New Technology',
                      description: 'Description of hands-on experience and implementation.',
                      tags: ['AI', 'Python'],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tech Radar</span>
                </button>
              </div>

              {/* Emerging Editor */}
              {editingEmerging && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingEmerging.id ? 'Edit Technology' : 'Add Technology'}
                    </h4>
                    <button
                      onClick={() => setEditingEmerging(null)}
                      className="text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Technology Title
                    </label>
                    <input
                      type="text"
                      value={editingEmerging.title || ''}
                      onChange={(e) =>
                        setEditingEmerging({ ...editingEmerging, title: e.target.value })
                      }
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingEmerging.description || ''}
                      onChange={(e) =>
                        setEditingEmerging({ ...editingEmerging, description: e.target.value })
                      }
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingEmerging.tags?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingEmerging({
                          ...editingEmerging,
                          tags: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!editingEmerging.title) return;
                      if (editingEmerging.id) {
                        updateEmergingTech(editingEmerging.id, editingEmerging);
                      } else {
                        addEmergingTech(editingEmerging as any);
                      }
                      setEditingEmerging(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Technology
                  </button>
                </div>
              )}

              {/* Emerging Tech List */}
              <div className="space-y-3">
                {(data.emergingTech || []).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingEmerging(item)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEmergingTech(item.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INTERNSHIPS / EXPERIENCE */}
          {activeTab === 'internships' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Internships & Experience
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Practical work history, data science internships, and lab assistant roles.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingInternship({
                      role: 'Data Science Intern',
                      company: 'Tech Organization',
                      location: 'Islamabad, Pakistan',
                      duration: 'Summer 2024',
                      description: 'Data cleaning, EDA, and model testing.',
                      skills: ['Python', 'EDA'],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Internship Editor */}
              {editingInternship && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingInternship.id ? 'Edit Experience' : 'Add Experience'}
                    </h4>
                    <button
                      onClick={() => setEditingInternship(null)}
                      className="text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={editingInternship.role || ''}
                        onChange={(e) =>
                          setEditingInternship({ ...editingInternship, role: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={editingInternship.company || ''}
                        onChange={(e) =>
                          setEditingInternship({ ...editingInternship, company: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editingInternship.location || ''}
                        onChange={(e) =>
                          setEditingInternship({ ...editingInternship, location: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Duration / Period
                      </label>
                      <input
                        type="text"
                        value={editingInternship.duration || ''}
                        onChange={(e) =>
                          setEditingInternship({ ...editingInternship, duration: e.target.value })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Description & Accomplishments
                    </label>
                    <textarea
                      rows={3}
                      value={editingInternship.description || ''}
                      onChange={(e) =>
                        setEditingInternship({ ...editingInternship, description: e.target.value })
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Skills Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingInternship.skills?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingInternship({
                          ...editingInternship,
                          skills: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!editingInternship.role) return;
                      if (editingInternship.id) {
                        updateInternship(editingInternship.id, editingInternship);
                      } else {
                        addInternship(editingInternship as any);
                      }
                      setEditingInternship(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Experience
                  </button>
                </div>
              )}

              {/* Internships List */}
              <div className="space-y-3">
                {(data.internships || []).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        {item.company} • {item.duration}
                      </span>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mt-0.5">
                        {item.role}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingInternship(item)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteInternship(item.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CUSTOM SECTIONS */}
          {activeTab === 'customSections' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Custom Sections Manager
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add custom sections (e.g., Research Publications, Competitions, Keynotes, Honors).
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingCustomSec({
                      sectionTitle: 'Publications & Research Papers',
                      items: [
                        {
                          id: 'csi-1',
                          title: 'Deep Learning Model Optimization',
                          subtitle: 'Journal Submission',
                          dateOrDuration: '2024',
                          description: 'Research paper on neural network weight pruning.',
                        },
                      ],
                      visible: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Section</span>
                </button>
              </div>

              {/* Custom Section Form */}
              {editingCustomSec && (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/50 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {editingCustomSec.id ? 'Edit Custom Section' : 'Add Custom Section'}
                    </h4>
                    <button
                      onClick={() => setEditingCustomSec(null)}
                      className="text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={editingCustomSec.sectionTitle || ''}
                      onChange={(e) =>
                        setEditingCustomSec({ ...editingCustomSec, sectionTitle: e.target.value })
                      }
                      placeholder="e.g. Publications & Honors"
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Items list inside section */}
                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Section Items
                    </label>

                    {editingCustomSec.items?.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updatedItems = [...(editingCustomSec.items || [])];
                              updatedItems[idx].title = e.target.value;
                              setEditingCustomSec({ ...editingCustomSec, items: updatedItems });
                            }}
                            placeholder="Item Title"
                            className="p-1.5 text-xs font-bold rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) => {
                              const updatedItems = [...(editingCustomSec.items || [])];
                              updatedItems[idx].subtitle = e.target.value;
                              setEditingCustomSec({ ...editingCustomSec, items: updatedItems });
                            }}
                            placeholder="Subtitle / Tag"
                            className="p-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...(editingCustomSec.items || [])];
                            updatedItems[idx].description = e.target.value;
                            setEditingCustomSec({ ...editingCustomSec, items: updatedItems });
                          }}
                          placeholder="Description..."
                          className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newItem: CustomSectionItem = {
                          id: 'csi-' + Date.now(),
                          title: 'New Custom Item',
                          description: 'Description of custom item',
                        };
                        setEditingCustomSec({
                          ...editingCustomSec,
                          items: [...(editingCustomSec.items || []), newItem],
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section Item</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (!editingCustomSec.sectionTitle) return;
                      if (editingCustomSec.id) {
                        updateCustomSection(editingCustomSec.id, editingCustomSec);
                      } else {
                        addCustomSection(editingCustomSec as any);
                      }
                      setEditingCustomSec(null);
                    }}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Custom Section
                  </button>
                </div>
              )}

              {/* Custom Sections List */}
              <div className="space-y-3">
                {(data.customSections || []).map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        {sec.sectionTitle}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {sec.items?.length || 0} items in this section
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingCustomSec(sec)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCustomSection(sec.id)}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CONTACT MESSAGES INBOX (MongoDB Atlas Connected) */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Inbox className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
                    <span>Portfolio Contact Messages Inbox</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        inboxStatus === 'loaded'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : inboxStatus === 'loading'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : inboxStatus === 'error'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {inboxStatus === 'loaded'
                        ? `LIVE · ${contactMessagesSource || 'MongoDB Atlas'}`
                        : inboxStatus === 'loading'
                        ? 'FETCHING FROM DATABASE...'
                        : inboxStatus === 'error'
                        ? 'FAILED TO LOAD'
                        : 'READY'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    All messages submitted via the portfolio Contact form are stored directly in <strong>MongoDB Atlas Cluster0 → portfolio_db → contact_messages</strong> collection.
                    Total messages in DB: <strong className="text-amber-600 dark:text-amber-400">{contactMessagesCount || 0}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => refreshContactMessages()}
                    disabled={inboxStatus === 'loading'}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-amber-500/30 hover:border-amber-400/60 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {inboxStatus === 'loading' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>Refresh From MongoDB</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        window.confirm(
                          `ARE YOU SURE? This will PERMANENTLY DELETE ALL ${contactMessagesCount || 0} contact messages from MongoDB Atlas database. This action cannot be undone.`
                        )
                      ) {
                        await clearAllContactMessages();
                      }
                    }}
                    disabled={inboxStatus === 'loading' || contactMessagesCount === 0}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 hover:bg-rose-200 border border-rose-200 dark:border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Messages</span>
                  </button>
                </div>
              </div>

              {/* Messages count & database info banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 dark:from-black dark:via-amber-950/30 dark:to-black border border-amber-500/30 space-y-2">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-white/80">
                      Collection: <strong className="text-white">contact_messages</strong>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-white/80">
                      Stored count: <strong className="text-white">{contactMessagesCount || 0}</strong>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-white/80">
                      Source: <strong className="text-white">{contactMessagesSource || 'MongoDB Atlas'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Inbox Messages List */}
              {inboxStatus === 'loading' && (
                <div className="p-10 rounded-2xl border border-amber-500/20 bg-white/50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Fetching contact messages from MongoDB Atlas...
                  </p>
                </div>
              )}

              {inboxStatus !== 'loading' && contactMessages.length === 0 && (
                <div className="p-12 rounded-2xl border border-dashed border-slate-300 dark:border-amber-500/30 bg-white/60 dark:bg-neutral-950 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-amber-500/30 flex items-center justify-center">
                    <Inbox className="w-7 h-7 text-slate-400 dark:text-amber-500/60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white">
                      No Contact Messages Yet
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      When visitors submit inquiries via the portfolio Contact form, they will automatically appear here and be saved in MongoDB Atlas database.
                    </p>
                  </div>
                </div>
              )}

              {contactMessages.length > 0 && (
                <div className="space-y-4">
                  {contactMessages.map((msg: any, idx: number) => {
                    const msgId = String(msg.id || msg._id || `msg-${idx}`);
                    const timestamp = msg.timestamp || msg.createdAt || new Date().toISOString();
                    return (
                      <div
                        key={msgId}
                        className="group rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/20 hover:border-amber-400/50 transition-all shadow-sm overflow-hidden"
                      >
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-amber-500/10 flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                              {String(msg.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white truncate">
                                  {msg.name || 'Unknown Sender'}
                                </h5>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                                  #{String(idx + 1).padStart(3, '0')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition break-all"
                                >
                                  <Mail className="w-3 h-3 shrink-0" />
                                  <span>{msg.email}</span>
                                </a>
                                <span className="opacity-40">·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  {new Date(timestamp).toLocaleString()}
                                </span>
                              </div>
                              {msg.subject && (
                                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <FileText className="w-3 h-3 shrink-0" />
                                  Subject: {msg.subject}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`mailto:${msg.email}?subject=${encodeURIComponent(
                                'Re: ' + (msg.subject || 'Portfolio Inquiry')
                              )}&body=${encodeURIComponent(`\n\n---\nOriginal message from ${msg.name} (${msg.email}):\n\n${msg.message || ''}`)}`}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition flex items-center gap-1 cursor-pointer"
                              title="Reply via email"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Reply</span>
                            </a>
                            <button
                              type="button"
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    `Delete this message from "${msg.name}"? This will be permanently removed from MongoDB Atlas database.`
                                  )
                                ) {
                                  await deleteContactMessage(msgId);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                              title="Delete message from MongoDB"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Message Body */}
                        <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-black/40">
                          <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
                            {msg.message || <span className="italic text-slate-400">[No message body]</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: VISIBILITY & DATA BACKUP */}
          {activeTab === 'visibility' && (
            <div className="space-y-8">
              {/* Select Portfolio Accent Theme Section */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-5 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
                      <span>Select Portfolio Accent Theme</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Accent themes dynamically customize primary highlights, badges, buttons, and glowing borders when <strong className="text-amber-600 dark:text-amber-400">Dark Mode</strong> is active.
                    </p>
                  </div>

                  {/* Reset to Original Button */}
                  <button
                    type="button"
                    onClick={() => setAccentTheme('amber')}
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-800 dark:text-amber-400 border border-slate-300 dark:border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Original</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {[
                    {
                      key: 'amber',
                      label: 'Gold Amber & Crimson',
                      badge: 'Default / Original',
                      colorPreview: 'bg-gradient-to-r from-amber-400 to-red-600',
                      desc: 'Classic Abasyn Gold Amber & Deep Crimson Red accents',
                    },
                    {
                      key: 'emerald',
                      label: 'Emerald AI Green',
                      badge: 'AI & Data Science',
                      colorPreview: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
                      desc: 'Bio-tech & Machine Learning matrix green glow',
                    },
                    {
                      key: 'blue',
                      label: 'Cyber Neon Blue',
                      badge: 'Cybersecurity',
                      colorPreview: 'bg-gradient-to-r from-blue-400 to-indigo-500',
                      desc: 'Futuristic quantum blue and electric indigo',
                    },
                    {
                      key: 'purple',
                      label: 'Royal Violet',
                      badge: 'Premium Luxury',
                      colorPreview: 'bg-gradient-to-r from-purple-400 to-pink-500',
                      desc: 'Sophisticated deep royal violet & magenta glow',
                    },
                    {
                      key: 'crimson',
                      label: 'Obsidian Crimson',
                      badge: 'High Performance',
                      colorPreview: 'bg-gradient-to-r from-rose-500 to-red-600',
                      desc: 'Intense obsidian blood red & crimson contrast',
                    },
                  ].map((themeOpt) => {
                    const isSelected =
                      (data.accentTheme || 'amber') === themeOpt.key ||
                      (themeOpt.key === 'purple' && data.accentTheme === 'violet');
                    return (
                      <div
                        key={themeOpt.key}
                        onClick={() => setAccentTheme(themeOpt.key as any)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-neutral-900 border-amber-500 dark:border-amber-400 text-white shadow-md ring-2 ring-amber-400/30'
                            : 'bg-white dark:bg-neutral-900/60 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-zinc-300 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`h-3 w-12 rounded-full ${themeOpt.colorPreview} shadow-xs`} />
                            {isSelected ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-black">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                                {themeOpt.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                            {themeOpt.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                            {themeOpt.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400 dark:text-zinc-500 uppercase">Dark Mode Accent</span>
                          <span className="font-bold text-amber-500 dark:text-amber-400">
                            {isSelected ? 'SELECTED' : 'SELECT'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white mb-1">
                  Global Section Visibility Controls
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Easily toggle visibility for any section across your live portfolio with one click.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                  {([
                    { key: 'about', label: 'Overview / Bio', desc: 'About summary, academic standing highlights' },
                    { key: 'education', label: 'Education & CGPA', desc: 'University degree, academic years & course list' },
                    { key: 'skills', label: 'Skills & Proficiency', desc: 'Technical skill categories & progress meters' },
                    { key: 'emergingTech', label: 'Emerging Tech Radar', desc: 'Hands-on AI/ML tools & technology radar' },
                    { key: 'projects', label: 'Projects Portfolio', desc: 'Featured projects, filter tags, code & live links' },
                    { key: 'publications', label: 'Publications & Papers', desc: 'Research papers, Kaggle writeups & articles' },
                    { key: 'testimonials', label: 'Testimonials & Quotes', desc: 'Department head & mentor recommendations' },
                    { key: 'internships', label: 'Experience & Internships', desc: 'Industry internships & leadership roles' },
                    { key: 'certifications', label: 'Certifications Registry', desc: 'Verified certificates, credentials & badges' },
                    { key: 'contact', label: 'Contact Information', desc: 'Direct email, WhatsApp, WeChat & social links' },
                  ] as const).map(({ key, label, desc }) => {
                    const isVisible = !!data.sectionVisibility?.[key];
                    return (
                      <div
                        key={key}
                        onClick={() => toggleSectionVisibility(key as any)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isVisible
                            ? 'bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-amber-300 shadow-xs hover:border-amber-500/60'
                            : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-950 dark:text-slate-500 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            {isVisible ? (
                              <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                            )}
                            <h4 className="font-extrabold text-xs uppercase tracking-wider">
                              {label}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {desc}
                          </p>
                        </div>

                        {/* Toggle Button Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 transition-all ${
                            isVisible
                              ? 'bg-amber-400 text-black shadow-2xs'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {isVisible ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MongoDB Atlas Database Sync Status & Management */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-black border border-emerald-500/40 space-y-4 shadow-sm text-white">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <span>MongoDB Atlas Cluster0 Live Database Sync</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Cluster URI: <span className="font-mono text-emerald-300">mongodb+srv://sanaullah:***@cluster0.qgvkxcj.mongodb.net</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Database: <strong className="text-white">portfolio_db</strong> | Collections: <strong className="text-white">portfolio_store, contact_messages, portfolio_uploads</strong>
                      </p>
                      <p className="text-[10px] text-amber-300/90 font-mono mt-1">
                        Whitelisted IP: <strong className="text-emerald-300">154.192.5.104/32</strong> &amp; <strong className="text-emerald-300">0.0.0.0/0</strong> (Atlas Network Access)
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        supabaseStatus === 'synced'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : supabaseStatus === 'syncing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : supabaseStatus === 'error'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {supabaseStatus === 'synced' ? 'MONGODB SYNCED' : supabaseStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-black/50 p-2.5 rounded-lg border border-slate-800 font-mono">
                  {supabaseMsg}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={syncToSupabaseNow}
                    disabled={supabaseStatus === 'syncing'}
                    className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${supabaseStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    <span>Sync All CRUD Changes To MongoDB Atlas</span>
                  </button>

                  <button
                    type="button"
                    onClick={loadFromSupabaseNow}
                    disabled={supabaseStatus === 'syncing'}
                    className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 border border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fetch Fresh Document From MongoDB Atlas</span>
                  </button>
                </div>
              </div>

              {/* Data Export / Import & Reset */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Data Backup, JSON Import & Reset</span>
                </h4>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={exportJSON}
                    className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-slate-900 text-white dark:bg-indigo-600 hover:opacity-90 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:opacity-90 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              const success = importJSON(event.target.result as string);
                              if (success) {
                                alert('Portfolio data imported successfully!');
                              } else {
                                alert('Invalid JSON backup file structure.');
                              }
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>

                  <button
                    onClick={resetToDefaults}
                    className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY & ACCENT THEMES */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Select Portfolio Accent Theme Section */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-5 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
                      <span>Select Portfolio Accent Theme</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Accent themes dynamically customize primary highlights, badges, buttons, and glowing borders when <strong className="text-amber-600 dark:text-amber-400">Dark Mode</strong> is active.
                    </p>
                  </div>

                  {/* Reset to Original Button */}
                  <button
                    type="button"
                    onClick={() => setAccentTheme('amber')}
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-800 dark:text-amber-400 border border-slate-300 dark:border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Original</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {[
                    {
                      key: 'amber',
                      label: 'Gold Amber & Crimson',
                      badge: 'Default / Original',
                      colorPreview: 'bg-gradient-to-r from-amber-400 to-red-600',
                      desc: 'Classic Abasyn Gold Amber & Deep Crimson Red accents',
                    },
                    {
                      key: 'emerald',
                      label: 'Emerald AI Green',
                      badge: 'AI & Data Science',
                      colorPreview: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
                      desc: 'Bio-tech & Machine Learning matrix green glow',
                    },
                    {
                      key: 'blue',
                      label: 'Cyber Neon Blue',
                      badge: 'Cybersecurity',
                      colorPreview: 'bg-gradient-to-r from-blue-400 to-indigo-500',
                      desc: 'Futuristic quantum blue and electric indigo',
                    },
                    {
                      key: 'purple',
                      label: 'Royal Violet',
                      badge: 'Premium Luxury',
                      colorPreview: 'bg-gradient-to-r from-purple-400 to-pink-500',
                      desc: 'Sophisticated deep royal violet & magenta glow',
                    },
                    {
                      key: 'crimson',
                      label: 'Obsidian Crimson',
                      badge: 'High Performance',
                      colorPreview: 'bg-gradient-to-r from-rose-500 to-red-600',
                      desc: 'Intense obsidian blood red & crimson contrast',
                    },
                  ].map((themeOpt) => {
                    const isSelected =
                      (data.accentTheme || 'amber') === themeOpt.key ||
                      (themeOpt.key === 'purple' && data.accentTheme === 'violet');
                    return (
                      <div
                        key={themeOpt.key}
                        onClick={() => setAccentTheme(themeOpt.key as any)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-neutral-900 border-amber-500 dark:border-amber-400 text-white shadow-md ring-2 ring-amber-400/30'
                            : 'bg-white dark:bg-neutral-900/60 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-zinc-300 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`h-3 w-12 rounded-full ${themeOpt.colorPreview} shadow-xs`} />
                            {isSelected ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-black">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                                {themeOpt.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                            {themeOpt.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                            {themeOpt.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400 dark:text-zinc-500 uppercase">Dark Mode Accent</span>
                          <span className="font-bold text-amber-500 dark:text-amber-400">
                            {isSelected ? 'SELECTED' : 'SELECT'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Credentials & Security Form */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Admin Access Credentials</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your CMS login username and password.
                </p>

                {credSuccessMsg && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                    {credSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      autoComplete="off"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newUsername.trim() || !newPassword.trim()) return;
                    updateAdminCredentials(newUsername, newPassword);
                    setCredSuccessMsg('Credentials updated successfully!');
                    setTimeout(() => setCredSuccessMsg(''), 4000);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 cursor-pointer shadow-sm"
                >
                  Save Credentials
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Crop & Beauty Filter Studio Modal */}
      <ImageCropStudioModal
        isOpen={studioConfig.isOpen}
        onClose={() => setStudioConfig((prev) => ({ ...prev, isOpen: false }))}
        initialImageUrl={studioConfig.initialUrl}
        title={studioConfig.title}
        defaultAspectRatio={studioConfig.aspectRatio}
        onApply={(dataUrl) => {
          studioConfig.onApply(dataUrl);
          setStudioConfig((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};

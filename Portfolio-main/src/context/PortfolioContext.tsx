import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initialPortfolioData } from '../data/initialData';
import {
  fetchPortfolioFromMongoDB,
  savePortfolioToMongoDB,
  getMongoDbStatus,
  fetchAdminConfigFromMongoDB,
  saveAdminConfigToMongoDB,
  verifyAdminLoginWithMongoDB,
  fetchContactMessagesFromMongoDB,
  deleteContactMessageFromMongoDB,
  clearAllContactMessagesFromMongoDB,
} from '../lib/mongodb';
import {
  AboutData,
  CertificationItem,
  CustomSection,
  EducationItem,
  EmergingTechItem,
  InternshipItem,
  PortfolioData,
  ProfileInfo,
  ProjectItem,
  PublicationItem,
  SectionVisibilityMap,
  SkillCategory,
  TestimonialItem,
} from '../types/portfolio';

interface PortfolioContextType {
  data: PortfolioData;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  adminCredentials: { username: string; pass: string };
  updateAdminCredentials: (user: string, pass: string) => Promise<void>;
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
  showAdminDrawer: boolean;
  setShowAdminDrawer: (show: boolean) => void;

  // MongoDB Atlas sync status & aliases
  dbStatus: 'idle' | 'syncing' | 'synced' | 'error';
  dbMsg: string;
  supabaseStatus: 'idle' | 'syncing' | 'synced' | 'error';
  supabaseMsg: string;
  syncToMongoDBNow: () => Promise<boolean>;
  loadFromMongoDBNow: () => Promise<boolean>;
  syncToSupabaseNow: () => Promise<boolean>;
  loadFromSupabaseNow: () => Promise<boolean>;

  // Admin Credentials Sync Status
  adminSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  adminSyncMsg: string;

  // Contact Messages Inbox (MongoDB Atlas connected)
  contactMessages: any[];
  contactMessagesCount: number;
  contactMessagesSource: string;
  inboxStatus: 'idle' | 'loading' | 'loaded' | 'error';
  refreshContactMessages: () => Promise<void>;
  deleteContactMessage: (msgId: string) => Promise<boolean>;
  clearAllContactMessages: () => Promise<boolean>;

  // Active Resume Viewer Modal

  showResumeModal: boolean;
  setShowResumeModal: (show: boolean) => void;

  // Active Project Case Study Modal
  selectedProject: ProjectItem | null;
  setSelectedProject: (proj: ProjectItem | null) => void;

  // Active Cert Modal
  selectedCert: CertificationItem | null;
  setSelectedCert: (cert: CertificationItem | null) => void;

  // CRUD Dispatchers
  updateProfile: (profile: Partial<ProfileInfo>) => void;
  updateAbout: (about: Partial<AboutData>) => void;
  setAccentTheme: (accent: 'amber' | 'emerald' | 'blue' | 'purple' | 'crimson') => void;

  // Education CRUD
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

  // Skills CRUD
  addSkillCategory: (cat: Omit<SkillCategory, 'id'>) => void;
  updateSkillCategory: (id: string, cat: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;

  // Emerging Tech CRUD
  addEmergingTech: (item: Omit<EmergingTechItem, 'id'>) => void;
  updateEmergingTech: (id: string, item: Partial<EmergingTechItem>) => void;
  deleteEmergingTech: (id: string) => void;

  // Projects CRUD
  addProject: (proj: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, proj: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  // Publications CRUD
  addPublication: (pub: Omit<PublicationItem, 'id'>) => void;
  updatePublication: (id: string, pub: Partial<PublicationItem>) => void;
  deletePublication: (id: string) => void;

  // Testimonials CRUD
  addTestimonial: (test: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, test: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  // Certifications CRUD
  addCertification: (cert: Omit<CertificationItem, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;

  // Internships CRUD
  addInternship: (item: Omit<InternshipItem, 'id'>) => void;
  updateInternship: (id: string, item: Partial<InternshipItem>) => void;
  deleteInternship: (id: string) => void;

  // Custom Sections CRUD
  addCustomSection: (sec: Omit<CustomSection, 'id'>) => void;
  updateCustomSection: (id: string, sec: Partial<CustomSection>) => void;
  deleteCustomSection: (id: string) => void;

  // Section Visibility
  toggleSectionVisibility: (sectionKey: keyof SectionVisibilityMap) => void;

  // Utils
  resetToDefaults: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
}

const LOCAL_STORAGE_KEY = 'sanaullah_portfolio_data_v2';
const THEME_STORAGE_KEY = 'sanaullah_theme_v2';
const ADMIN_SESSION_KEY = 'sanaullah_admin_session';
const ADMIN_CREDS_KEY = 'sanaullah_admin_creds';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialPortfolioData,
          ...parsed,
          profile: { ...initialPortfolioData.profile, ...(parsed.profile || {}) },
          about: { ...initialPortfolioData.about, ...(parsed.about || {}) },
          publications: parsed.publications || initialPortfolioData.publications,
          testimonials: parsed.testimonials || initialPortfolioData.testimonials,
          customSections: parsed.customSections || initialPortfolioData.customSections,
          sectionVisibility: {
            ...initialPortfolioData.sectionVisibility,
            ...(parsed.sectionVisibility || {}),
          },
        };
      }
    } catch (err) {
      console.error('Failed to load local storage portfolio data:', err);
    }
    return initialPortfolioData;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {
      // ignore
    }
    return 'light'; // Default is light theme as requested!
  });

  // Sync theme and portfolio accent theme with document.documentElement class list (dark mode exclusive)
  useEffect(() => {
    const root = document.documentElement;
    // Clear all existing theme classes
    root.classList.remove('theme-amber', 'theme-emerald', 'theme-blue', 'theme-purple', 'theme-violet', 'theme-crimson');

    if (theme === 'dark') {
      root.classList.add('dark');
      const accent = data.accentTheme || 'amber';
      root.classList.add(`theme-${accent}`);
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // ignore
    }
  }, [theme, data.accentTheme]);

  // MongoDB Atlas DB sync states
  const [dbStatus, setDbStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [dbMsg, setDbMsg] = useState<string>('MongoDB Atlas Cluster0 connected');

  // === Cross-browser sync guards (prevent stale localStorage overwrite + live polling) ===
  // true only after the on-mount DB fetch fully completes — prevents writing stale cached data back to Mongo
  const initialHydrateDoneRef = useRef(false);
  // true exactly once when background poll updates data — prevents the saved data from being echoed back as another save
  const skipNextMongoSaveFromPollRef = useRef(false);

  // Load from MongoDB Atlas on mount
  useEffect(() => {
    async function loadInitialFromMongoDB() {
      setDbStatus('syncing');
      setDbMsg('Connecting to MongoDB Atlas Cluster0...');
      const dbData = await fetchPortfolioFromMongoDB();
      if (dbData && dbData.profile) {
        setData(dbData);
        setDbStatus('synced');
        setDbMsg('Loaded latest portfolio data from MongoDB Atlas database');
      } else {
        setDbStatus('idle');
        setDbMsg('MongoDB Atlas ready (local cache active)');
      }
      // Unblock future MongoDB saves ONLY after first hydrate completes
      initialHydrateDoneRef.current = true;
    }
    loadInitialFromMongoDB();
  }, []);

  // Sync data with localStorage and MongoDB Atlas on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to persist portfolio data:', err);
    }

    // Debounced async sync to MongoDB Atlas
    const timer = setTimeout(async () => {
      // Guard 1: If this setData came from a background poll, skip the echo-save (but clear flag for next change)
      if (skipNextMongoSaveFromPollRef.current) {
        skipNextMongoSaveFromPollRef.current = false;
        return;
      }
      // Guard 2: Never write to MongoDB before first hydrate finishes (prevents stale localStorage overwrite)
      if (!initialHydrateDoneRef.current) {
        return;
      }
      setDbStatus('syncing');
      setDbMsg('Syncing CRUD changes to MongoDB Atlas DB...');
      const res = await savePortfolioToMongoDB(data);
      if (res.success) {
        setDbStatus('synced');
        setDbMsg('All CRUD changes synced to MongoDB Atlas Cluster0');
      } else {
        setDbStatus('error');
        setDbMsg(res.message || 'Failed to sync to MongoDB Atlas');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  const syncToMongoDBNow = async (): Promise<boolean> => {
    setDbStatus('syncing');
    setDbMsg('Manual sync to MongoDB Atlas initiated...');
    const res = await savePortfolioToMongoDB(data);
    if (res.success) {
      setDbStatus('synced');
      setDbMsg('Successfully saved portfolio to MongoDB Atlas DB');
      return true;
    } else {
      setDbStatus('error');
      setDbMsg(res.message || 'Sync error with MongoDB Atlas Cluster0');
      return false;
    }
  };

  const loadFromMongoDBNow = async (): Promise<boolean> => {
    setDbStatus('syncing');
    setDbMsg('Fetching latest from MongoDB Atlas DB...');
    const dbData = await fetchPortfolioFromMongoDB();
    if (dbData && dbData.profile) {
      setData(dbData);
      setDbStatus('synced');
      setDbMsg('Fetched fresh portfolio data from MongoDB Atlas DB');
      return true;
    } else {
      setDbStatus('error');
      setDbMsg('No existing portfolio document found in MongoDB Atlas DB');
      return false;
    }
  };

  // Background polling every 8 seconds so all open tabs/browsers instantly mirror DB edits (no F5 required)
  useEffect(() => {
    const POLL_INTERVAL_MS = 8000;
    const id = setInterval(async () => {
      // Only poll AFTER first hydrate finishes; never fetch while an active sync save is writing
      if (!initialHydrateDoneRef.current || dbStatus === 'syncing') return;
      try {
        const dbData = await fetchPortfolioFromMongoDB();
        if (!dbData || !dbData.profile) return;
        // Mark next setData() as poll-sourced so the debounced save effect skips echoing this same data back to DB
        skipNextMongoSaveFromPollRef.current = true;
        setData(dbData);
      } catch (err) {
        // Silently ignore transient poll errors; user can refresh
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [dbStatus]);

  // Backward compatibility aliases
  const supabaseStatus = dbStatus;
  const supabaseMsg = dbMsg;
  const syncToSupabaseNow = syncToMongoDBNow;
  const loadFromSupabaseNow = loadFromMongoDBNow;

  // Admin Credentials MongoDB Sync Status
  const [adminSyncStatus, setAdminSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [adminSyncMsg, setAdminSyncMsg] = useState<string>('Admin credentials pending MongoDB Atlas sync');

  // Contact Messages Inbox state (MongoDB Atlas connected)
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [contactMessagesCount, setContactMessagesCount] = useState<number>(0);
  const [contactMessagesSource, setContactMessagesSource] = useState<string>('Local cache');
  const [inboxStatus, setInboxStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Load admin credentials from MongoDB Atlas on mount + contact messages (if admin logged in)
  useEffect(() => {
    async function loadAdminConfigAndInbox() {
      setAdminSyncStatus('syncing');
      setAdminSyncMsg('Loading admin credentials from MongoDB Atlas...');
      const adminCfg = await fetchAdminConfigFromMongoDB();
      if (adminCfg.success && adminCfg.username && adminCfg.pass) {
        setAdminCredentials({ username: adminCfg.username, pass: adminCfg.pass });
        try {
          localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ username: adminCfg.username, pass: adminCfg.pass }));
        } catch (e) {}
        setAdminSyncStatus('synced');
        setAdminSyncMsg(`Admin credentials loaded from ${adminCfg.source || 'MongoDB Atlas'}`);
      } else {
        setAdminSyncStatus('idle');
        setAdminSyncMsg('Using localStorage admin credentials (MongoDB fallback active)');
      }
    }
    loadAdminConfigAndInbox();
  }, []);

  // Refresh contact messages whenever admin logs in / drawer becomes relevant
  const refreshContactMessages = async () => {
    setInboxStatus('loading');
    try {
      const res = await fetchContactMessagesFromMongoDB();
      if (res.success) {
        setContactMessages(res.messages);
        setContactMessagesCount(res.count || res.messages.length);
        setContactMessagesSource(res.source || 'MongoDB Atlas');
        setInboxStatus('loaded');
        return;
      }
    } catch (e) {
      console.warn('Failed to refresh contact messages:', e);
    }
    setInboxStatus('error');
  };

  const deleteContactMessage = async (msgId: string): Promise<boolean> => {
    const res = await deleteContactMessageFromMongoDB(msgId);
    if (res.success) {
      setContactMessages((prev) => prev.filter((m) => String(m.id) !== String(msgId) && String(m._id) !== String(msgId)));
      setContactMessagesCount((prev) => Math.max(0, prev - 1));
    }
    return res.success;
  };

  const clearAllContactMessages = async (): Promise<boolean> => {
    const res = await clearAllContactMessagesFromMongoDB();
    if (res.success) {
      setContactMessages([]);
      setContactMessagesCount(0);
    }
    return res.success;
  };


  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAdminDrawer, setShowAdminDrawer] = useState<boolean>(false);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const [adminCredentials, setAdminCredentials] = useState<{ username: string; pass: string }>(() => {
    try {
      const savedCreds = localStorage.getItem(ADMIN_CREDS_KEY);
      if (savedCreds) {
        return JSON.parse(savedCreds);
      }
    } catch (e) {
      // ignore
    }
    return { username: 'sanaullah786shah92', pass: 'sanaullah7964' };
  });

  const updateAdminCredentials = async (username: string, pass: string) => {
    const updated = { username: username.trim(), pass: pass.trim() };
    setAdminCredentials(updated);
    try {
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated));
    } catch (e) {}

    setAdminSyncStatus('syncing');
    setAdminSyncMsg('Syncing admin credentials to MongoDB Atlas...');
    const res = await saveAdminConfigToMongoDB(updated);
    if (res.success) {
      setAdminSyncStatus('synced');
      setAdminSyncMsg(res.message || 'Admin credentials synced to MongoDB Atlas database');
    } else {
      setAdminSyncStatus('error');
      setAdminSyncMsg(res.message || 'Failed to sync admin credentials to MongoDB Atlas');
    }
  };

  const loginAdmin = async (user: string, pass: string): Promise<boolean> => {
    const verifyRes = await verifyAdminLoginWithMongoDB({ username: user, pass: pass });
    const serverApproved = verifyRes.success;
    const localApproved = user.trim() === adminCredentials.username && pass.trim() === adminCredentials.pass;
    if (serverApproved || localApproved) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setShowAdminModal(false);
      setShowAdminDrawer(true);
      // Load contact inbox immediately after admin login
      void refreshContactMessages();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setShowAdminDrawer(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  };

  const updateProfile = (profileUpdate: Partial<ProfileInfo>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate },
    }));
  };

  const updateAbout = (aboutUpdate: Partial<AboutData>) => {
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, ...aboutUpdate },
    }));
  };

  const setAccentTheme = (accent: 'amber' | 'emerald' | 'blue' | 'purple' | 'crimson') => {
    setData((prev) => ({ ...prev, accentTheme: accent }));
  };

  // Publications CRUD
  const addPublication = (pub: Omit<PublicationItem, 'id'>) => {
    const newPub: PublicationItem = { ...pub, id: 'pub-' + Date.now() };
    setData((prev) => ({ ...prev, publications: [newPub, ...(prev.publications || [])] }));
  };

  const updatePublication = (id: string, pub: Partial<PublicationItem>) => {
    setData((prev) => ({
      ...prev,
      publications: (prev.publications || []).map((p) => (p.id === id ? { ...p, ...pub } : p)),
    }));
  };

  const deletePublication = (id: string) => {
    setData((prev) => ({
      ...prev,
      publications: (prev.publications || []).filter((p) => p.id !== id),
    }));
  };

  // Testimonials CRUD
  const addTestimonial = (test: Omit<TestimonialItem, 'id'>) => {
    const newTest: TestimonialItem = { ...test, id: 'test-' + Date.now() };
    setData((prev) => ({ ...prev, testimonials: [newTest, ...(prev.testimonials || [])] }));
  };

  const updateTestimonial = (id: string, test: Partial<TestimonialItem>) => {
    setData((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).map((t) => (t.id === id ? { ...t, ...test } : t)),
    }));
  };

  const deleteTestimonial = (id: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((t) => t.id !== id),
    }));
  };

  // Education CRUD
  const addEducation = (item: Omit<EducationItem, 'id'>) => {
    const newItem: EducationItem = { ...item, id: 'edu-' + Date.now() };
    setData((prev) => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const updateEducation = (id: string, item: Partial<EducationItem>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...item } : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  // Skills CRUD
  const addSkillCategory = (cat: Omit<SkillCategory, 'id'>) => {
    const newCat: SkillCategory = { ...cat, id: 'sk-' + Date.now() };
    setData((prev) => ({ ...prev, skills: [...prev.skills, newCat] }));
  };

  const updateSkillCategory = (id: string, cat: Partial<SkillCategory>) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...cat } : s)),
    }));
  };

  const deleteSkillCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // Emerging Tech CRUD
  const addEmergingTech = (item: Omit<EmergingTechItem, 'id'>) => {
    const newItem: EmergingTechItem = { ...item, id: 'em-' + Date.now() };
    setData((prev) => ({ ...prev, emergingTech: [...prev.emergingTech, newItem] }));
  };

  const updateEmergingTech = (id: string, item: Partial<EmergingTechItem>) => {
    setData((prev) => ({
      ...prev,
      emergingTech: prev.emergingTech.map((e) => (e.id === id ? { ...e, ...item } : e)),
    }));
  };

  const deleteEmergingTech = (id: string) => {
    setData((prev) => ({
      ...prev,
      emergingTech: prev.emergingTech.filter((e) => e.id !== id),
    }));
  };

  // Projects CRUD
  const addProject = (proj: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = { ...proj, id: 'proj-' + Date.now() };
    setData((prev) => ({ ...prev, projects: [newProj, ...prev.projects] }));
  };

  const updateProject = (id: string, proj: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...proj } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Certifications CRUD
  const addCertification = (cert: Omit<CertificationItem, 'id'>) => {
    const newCert: CertificationItem = { ...cert, id: 'cert-' + Date.now() };
    setData((prev) => ({ ...prev, certifications: [newCert, ...prev.certifications] }));
  };

  const updateCertification = (id: string, cert: Partial<CertificationItem>) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
    }));
  };

  const deleteCertification = (id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // Internships CRUD
  const addInternship = (item: Omit<InternshipItem, 'id'>) => {
    const newItem: InternshipItem = { ...item, id: 'intern-' + Date.now() };
    setData((prev) => ({ ...prev, internships: [...prev.internships, newItem] }));
  };

  const updateInternship = (id: string, item: Partial<InternshipItem>) => {
    setData((prev) => ({
      ...prev,
      internships: prev.internships.map((i) => (i.id === id ? { ...i, ...item } : i)),
    }));
  };

  const deleteInternship = (id: string) => {
    setData((prev) => ({
      ...prev,
      internships: prev.internships.filter((i) => i.id !== id),
    }));
  };

  // Custom Sections CRUD
  const addCustomSection = (sec: Omit<CustomSection, 'id'>) => {
    const newSec: CustomSection = { ...sec, id: 'cs-' + Date.now() };
    setData((prev) => ({ ...prev, customSections: [...prev.customSections, newSec] }));
  };

  const updateCustomSection = (id: string, sec: Partial<CustomSection>) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((c) => (c.id === id ? { ...c, ...sec } : c)),
    }));
  };

  const deleteCustomSection = (id: string) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((c) => c.id !== id),
    }));
  };

  // Section Visibility
  const toggleSectionVisibility = (sectionKey: keyof SectionVisibilityMap) => {
    setData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: !prev.sectionVisibility[sectionKey],
      },
    }));
  };

  // Utils
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all portfolio data to defaults?')) {
      setData(initialPortfolioData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sanaullah_Portfolio_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.projects && parsed.certifications) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file imported:', e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        theme,
        toggleTheme,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminCredentials,
        updateAdminCredentials,
        showAdminModal,
        setShowAdminModal,
        showAdminDrawer,
        setShowAdminDrawer,
        dbStatus,
        dbMsg,
        supabaseStatus,
        supabaseMsg,
        syncToMongoDBNow,
        loadFromMongoDBNow,
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
        showResumeModal,
        setShowResumeModal,
        selectedProject,
        setSelectedProject,
        selectedCert,
        setSelectedCert,
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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { PublicationsSection } from './components/PublicationsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { InternshipsSection } from './components/InternshipsSection';
import { CustomSections } from './components/CustomSections';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { CertModal } from './components/CertModal';
import { ResumeViewerModal } from './components/ResumeViewerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminCMSDrawer } from './components/AdminCMSDrawer';
import { AIChatbotWidget } from './components/AIChatbotWidget';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-amber-500/30 selection:text-amber-200 dark:selection:bg-amber-400/40 dark:selection:text-amber-100">
        <Header />
        <main>
          <Hero />
          <AboutSection />
          <EducationSection />
          <SkillsSection />
          <ProjectsSection />
          <PublicationsSection />
          <TestimonialsSection />
          <CertificationsSection />
          <InternshipsSection />
          <CustomSections />
          <ContactSection />
        </main>
        <Footer />

        {/* Floating Modals, Chatbot, and CMS Drawer */}
        <ProjectModal />
        <CertModal />
        <ResumeViewerModal />
        <AdminLoginModal />
        <AdminCMSDrawer />
        <AIChatbotWidget />
      </div>
    </PortfolioProvider>
  );
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  visible: boolean;
}

export interface ProfileInfo {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  location?: string;
  cgpa: string;
  university: string;
  degree: string;
  academicYears: string;
  bio: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks: SocialLink[];
}

export interface AboutHighlight {
  id: string;
  label: string;
  value: string;
  iconName: string;
}

export interface AboutData {
  title: string;
  content: string;
  highlights: AboutHighlight[];
  visible: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  cgpa: string;
  duration: string;
  description: string;
  courses?: string[];
  visible: boolean;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: { name: string; level?: number; icon?: string }[];
  visible: boolean;
}

export interface EmergingTechItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  visible: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI & Data Science' | 'Mobile Apps' | 'Web Apps' | 'Cheatsheets & Tools' | 'Other';
  shortDesc: string;
  fullCaseStudy?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  huggingfaceUrl?: string;
  imageUrl?: string;
  galleryImages?: string[];
  featured: boolean;
  visible: boolean;
}

export interface InternshipItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  skills: string[];
  certificateUrl?: string;
  visible: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  imageUrl?: string;
  tags: string[];
  visible: boolean;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  dateOrDuration?: string;
  description: string;
  linkUrl?: string;
  imageUrl?: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
  visible: boolean;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string; // e.g. IEEE / arXiv / Kaggle / Medium / University Journal
  date: string;
  authors: string;
  description: string;
  abstract?: string;
  url?: string;
  pdfUrl?: string;
  tags: string[];
  visible: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  avatarUrl?: string;
  relationship?: string; // e.g. University Professor / Project Lead / Mentor
  linkedinUrl?: string;
  visible: boolean;
}

export interface SectionVisibilityMap {
  about: boolean;
  education: boolean;
  skills: boolean;
  emergingTech: boolean;
  projects: boolean;
  publications: boolean;
  testimonials: boolean;
  internships: boolean;
  certifications: boolean;
  contact: boolean;
}

export interface PortfolioData {
  profile: ProfileInfo;
  about: AboutData;
  education: EducationItem[];
  skills: SkillCategory[];
  emergingTech: EmergingTechItem[];
  projects: ProjectItem[];
  publications: PublicationItem[];
  testimonials: TestimonialItem[];
  internships: InternshipItem[];
  certifications: CertificationItem[];
  customSections: CustomSection[];
  sectionVisibility: SectionVisibilityMap;
  accentTheme?: 'amber' | 'emerald' | 'blue' | 'purple' | 'crimson';
}

import { Document, Types } from 'mongoose';

export type UserRole = 'student' | 'recruiter' | 'admin';
export type EducationLevel = 'Matric' | 'Intermediate' | 'Diploma' | 'Bachelor' | 'Master' | 'PhD';
export type VisibilityLevel = 'public' | 'recruiters' | 'private';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
export type JobStatus = 'draft' | 'active' | 'expired' | 'filled';
export type ApplicationStatus = 'applied' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  role: UserRole;
  emailVerified: Date | null;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
}

export interface IEducation {
  level: EducationLevel;
  field: string;
  institution: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  grade?: string;
  certificate?: string;
}

export interface ISkill {
  name: string;
  verified: boolean;
  verificationSource?: 'manual' | 'github' | 'test' | 'peer';
  endorsements: number;
}

export interface IGitHubRepo {
  name: string;
  url: string;
  description?: string;
  languages: string[];
  stars: number;
  forks: number;
  verifiedSkills: string[];
}

export interface IGitHubProfile {
  username?: string;
  connected: boolean;
  accessToken?: string;
  repos: IGitHubRepo[];
  totalCommits?: number;
  followers?: number;
  verifiedAt?: Date;
}

export interface IResume {
  url: string;
  publicId: string;
  parsed: boolean;
  parsedData?: {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills: string[];
    experience: IExperience[];
    education: IEducation[];
  };
  lastParsed?: Date;
}

export interface IExperience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  skills: string[];
}

export interface IProject {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IVisibilitySettings {
  profile: VisibilityLevel;
  resume: VisibilityLevel;
  github: VisibilityLevel;
  email: VisibilityLevel;
  phone: VisibilityLevel;
}

export interface INotificationPreferences {
  jobAlerts: boolean;
  mentorAlerts: boolean;
  weeklyDigest: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

export interface IStudentProfile extends Document {
  userId: Types.ObjectId;
  name: string;
  headline?: string;
  bio?: string;
  avatar?: string;
  location: {
    city?: string;
    country?: string;
    remote: boolean;
  };
  education: IEducation[];
  skills: ISkill[];
  experience: IExperience[];
  projects: IProject[];
  github: IGitHubProfile;
  resume?: IResume;
  visibility: IVisibilitySettings;
  preferences: INotificationPreferences;
  careerGoals?: {
    shortTerm: string;
    longTerm: string;
    targetRoles: string[];
    targetIndustries: string[];
  };
  roadmapId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecruiterProfile extends Document {
  userId: Types.ObjectId;
  name: string;
  title: string;
  company: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry?: string;
  avatar?: string;
  bio?: string;
  location?: {
    city?: string;
    country?: string;
  };
  phone?: string;
  linkedIn?: string;
  activeJobs: Types.ObjectId[];
  savedSearches: ISavedSearch[];
  preferences: {
    dailyBriefing: boolean;
    candidateAlerts: boolean;
    emailNotifications: boolean;
  };
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    expiresAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavedSearch {
  _id?: Types.ObjectId;
  name: string;
  filters: {
    skills?: string[];
    experience?: { min: number; max: number };
    education?: string[];
    location?: string;
    remote?: boolean;
  };
  createdAt: Date;
}

export interface IAdminProfile extends Document {
  userId: Types.ObjectId;
  name: string;
  avatar?: string;
  permissions: string[];
  lastAdminActionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

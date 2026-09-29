import { Document, Types } from 'mongoose';
import { JobType, JobStatus, ApplicationStatus } from './user';

export interface IJobLocation {
  city?: string;
  country?: string;
  remote: boolean;
}

export interface IJobSalary {
  min: number;
  max: number;
  currency: 'USD' | 'PKR' | 'EUR' | 'GBP';
  period: 'hourly' | 'monthly' | 'yearly';
  negotiable: boolean;
}

export interface IJobExperience {
  min: number;
  max: number;
  preferred?: number;
}

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  company: string;
  companyLogo?: string;
  companyDescription?: string;
  location: IJobLocation;
  type: JobType;
  experience: IJobExperience;
  salary?: IJobSalary;
  skills: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  expiryDate: Date;
  status: JobStatus;
  visibility: 'public' | 'private' | 'featured';
  createdBy: Types.ObjectId;
  aiGenerated: boolean;
  applications: Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  studentId: Types.ObjectId;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  aiMatchScore?: number;
  aiMatchExplanation?: string;
  notes?: string;
  interviewDate?: Date;
  interviewFeedback?: {
    score: number;
    notes: string;
    interviewer: Types.ObjectId;
  }[];
  appliedAt: Date;
  updatedAt: Date;
}

export interface IJobSearchFilters {
  query?: string;
  skills?: string[];
  type?: JobType[];
  experience?: { min: number; max: number };
  salary?: { min: number; max: number };
  location?: string;
  remote?: boolean;
  postedWithin?: '24h' | '7d' | '30d' | 'all';
}

export interface ICandidateSearchFilters {
  query?: string;
  skills?: string[];
  education?: string[];
  experience?: { min: number; max: number };
  location?: string;
  remote?: boolean;
  githubVerified?: boolean;
  availableNow?: boolean;
}

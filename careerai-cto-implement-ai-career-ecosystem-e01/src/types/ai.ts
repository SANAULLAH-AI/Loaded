import { Types } from 'mongoose';

export interface IInterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedPoints: string[];
}

export interface IInterviewAnswer {
  questionId: string;
  answer: string;
  score: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  idealAnswer: string;
}

export interface IInterviewSession extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  jobTitle: string;
  skills: string[];
  level: string;
  questions: IInterviewQuestion[];
  answers: IInterviewAnswer[];
  overallScore: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface IRoadmapMilestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  completed: boolean;
  completedAt?: Date;
}

export interface IRoadmap extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  title: string;
  currentRole: string;
  targetRole: string;
  timeline: '1-year' | '3-year' | '5-year';
  milestones: IRoadmapMilestone[];
  progress: number;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResumeAnalysis {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
  extractedFrom: 'pdf' | 'doc' | 'txt';
  confidence: number;
}

export interface IMatchResult {
  candidateId: string;
  matchScore: number;
  skillMatch: {
    matched: string[];
    missing: string[];
    extra: string[];
  };
  experienceMatch: {
    yearsMatch: boolean;
    relevanceScore: number;
  };
  overallAssessment: string;
  interviewQuestions: string[];
}

export interface IGitHubAnalysis {
  username: string;
  repositories: {
    name: string;
    languages: Record<string, number>;
    verifiedSkills: string[];
    quality: 'beginner' | 'intermediate' | 'advanced';
  }[];
  overallSkills: {
    name: string;
    confidence: number;
    evidence: string[];
  }[];
  recommendations: string[];
}

export interface IDailyBriefing {
  recruiterId: string;
  date: Date;
  activeJobsCount: number;
  newCandidatesCount: number;
  topMatches: {
    candidateName: string;
    jobTitle: string;
    matchScore: number;
    whyGoodFit: string;
    nextSteps: string;
  }[];
  marketInsights: string;
}

export interface IAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IAIChatSession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  context: 'career_coach' | 'interview_prep' | 'skill_learning';
  messages: IAIChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'recruiter']),
  company: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'recruiter' && !data.company) {
    return false;
  }
  return true;
}, {
  message: 'Company name is required for recruiters',
  path: ['company'],
});

export const EducationSchema = z.object({
  level: z.enum(['Matric', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD']),
  field: z.string().min(2, 'Field of study is required'),
  institution: z.string().min(2, 'Institution name is required'),
  startYear: z.number().min(1900).max(new Date().getFullYear()),
  endYear: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
  current: z.boolean().default(false),
  grade: z.string().optional(),
});

export const ExperienceSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean().default(false),
  description: z.string().max(2000).optional(),
  skills: z.array(z.string()).default([]),
});

export const StudentProfileSchema = z.object({
  name: z.string().min(2).max(100),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    remote: z.boolean().default(false),
  }),
  education: z.array(EducationSchema),
  skills: z.array(z.object({
    name: z.string(),
    verified: z.boolean().default(false),
  })),
  experience: z.array(ExperienceSchema),
  github: z.object({
    username: z.string().optional(),
    connected: z.boolean().default(false),
  }),
  visibility: z.object({
    profile: z.enum(['public', 'recruiters', 'private']).default('public'),
    resume: z.enum(['public', 'recruiters', 'private']).default('recruiters'),
    github: z.enum(['public', 'recruiters', 'private']).default('public'),
  }),
});

export const JobPostSchema = z.object({
  title: z.string().min(5).max(100),
  company: z.string().min(2).max(100),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    remote: z.boolean().default(false),
  }),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']),
  experience: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  salary: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.enum(['USD', 'PKR', 'EUR', 'GBP']).default('USD'),
    period: z.enum(['hourly', 'monthly', 'yearly']).default('yearly'),
  }).optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  description: z.string().min(50).max(5000),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  benefits: z.array(z.string()).optional(),
  expiryDate: z.date().min(new Date(), 'Expiry date must be in the future'),
});

export const InterviewSettingsSchema = z.object({
  jobTitle: z.string().min(2),
  skills: z.array(z.string()).min(1),
  level: z.enum(['entry', 'mid', 'senior', 'lead']),
  questionCount: z.number().min(3).max(10).default(5),
});

export const MessageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1).max(2000),
  subject: z.string().min(1).max(200).optional(),
});

export const BroadcastSchema = z.object({
  title: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().url().optional(),
  targetAudience: z.enum(['all', 'students', 'recruiters', 'admins']),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type StudentProfileInput = z.infer<typeof StudentProfileSchema>;
export type JobPostInput = z.infer<typeof JobPostSchema>;
export type InterviewSettingsInput = z.infer<typeof InterviewSettingsSchema>;
export type MessageInput = z.infer<typeof MessageSchema>;
export type BroadcastInput = z.infer<typeof BroadcastSchema>;

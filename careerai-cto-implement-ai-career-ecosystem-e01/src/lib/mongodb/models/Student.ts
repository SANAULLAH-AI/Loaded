import mongoose, { Schema, model, models } from 'mongoose';
import { IStudentProfile } from '@/types';

const EducationSchema = new Schema({
  level: {
    type: String,
    enum: ['Matric', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    required: true,
  },
  field: { type: String, required: true },
  institution: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  current: { type: Boolean, default: false },
  grade: { type: String },
  certificate: { type: String },
});

const SkillSchema = new Schema({
  name: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationSource: {
    type: String,
    enum: ['manual', 'github', 'test', 'peer'],
  },
  endorsements: { type: Number, default: 0 },
});

const GitHubRepoSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  languages: [{ type: String }],
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  verifiedSkills: [{ type: String }],
});

const ExperienceSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  skills: [{ type: String }],
});

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  imageUrl: { type: String },
  liveUrl: { type: String },
  githubUrl: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    headline: {
      type: String,
      maxlength: 200,
    },
    bio: {
      type: String,
      maxlength: 2000,
    },
    avatar: {
      type: String,
    },
    location: {
      city: { type: String },
      country: { type: String },
      remote: { type: Boolean, default: false },
    },
    education: [EducationSchema],
    skills: [SkillSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    github: {
      username: { type: String },
      connected: { type: Boolean, default: false },
      accessToken: { type: String, select: false },
      repos: [GitHubRepoSchema],
      totalCommits: { type: Number },
      followers: { type: Number },
      verifiedAt: { type: Date },
    },
    resume: {
      url: { type: String },
      publicId: { type: String },
      parsed: { type: Boolean, default: false },
      parsedData: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        summary: { type: String },
        skills: [{ type: String }],
        experience: [ExperienceSchema],
        education: [EducationSchema],
      },
      lastParsed: { type: Date },
    },
    visibility: {
      profile: {
        type: String,
        enum: ['public', 'recruiters', 'private'],
        default: 'public',
      },
      resume: {
        type: String,
        enum: ['public', 'recruiters', 'private'],
        default: 'recruiters',
      },
      github: {
        type: String,
        enum: ['public', 'recruiters', 'private'],
        default: 'public',
      },
      email: {
        type: String,
        enum: ['public', 'recruiters', 'private'],
        default: 'recruiters',
      },
      phone: {
        type: String,
        enum: ['public', 'recruiters', 'private'],
        default: 'private',
      },
    },
    preferences: {
      jobAlerts: { type: Boolean, default: true },
      mentorAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },
    careerGoals: {
      shortTerm: { type: String },
      longTerm: { type: String },
      targetRoles: [{ type: String }],
      targetIndustries: [{ type: String }],
    },
    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: 'Roadmap',
    },
  },
  {
    timestamps: true,
  }
);

StudentProfileSchema.index({ userId: 1 });
StudentProfileSchema.index({ 'skills.name': 1 });
StudentProfileSchema.index({ 'location.country': 1, 'location.city': 1 });
StudentProfileSchema.index({ 'github.connected': 1 });
StudentProfileSchema.index({ createdAt: -1 });

export const StudentProfile = models.StudentProfile || model<IStudentProfile>('StudentProfile', StudentProfileSchema);

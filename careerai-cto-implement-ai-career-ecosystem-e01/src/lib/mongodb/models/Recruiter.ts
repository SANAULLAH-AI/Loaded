import mongoose, { Schema, model, models } from 'mongoose';
import { IRecruiterProfile } from '@/types';

const SavedSearchSchema = new Schema({
  name: { type: String, required: true },
  filters: {
    skills: [{ type: String }],
    experience: {
      min: { type: Number },
      max: { type: Number },
    },
    education: [{ type: String }],
    location: { type: String },
    remote: { type: Boolean },
  },
  createdAt: { type: Date, default: Date.now },
});

const RecruiterProfileSchema = new Schema<IRecruiterProfile>(
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
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
    },
    companyWebsite: { type: String },
    companySize: { type: String },
    companyIndustry: { type: String },
    avatar: { type: String },
    bio: { type: String },
    location: {
      city: { type: String },
      country: { type: String },
    },
    phone: { type: String },
    linkedIn: { type: String },
    activeJobs: [{
      type: Schema.Types.ObjectId,
      ref: 'Job',
    }],
    savedSearches: [SavedSearchSchema],
    preferences: {
      dailyBriefing: { type: Boolean, default: true },
      candidateAlerts: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
      },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

RecruiterProfileSchema.index({ userId: 1 });
RecruiterProfileSchema.index({ company: 1 });
RecruiterProfileSchema.index({ createdAt: -1 });

export const RecruiterProfile = models.RecruiterProfile || model<IRecruiterProfile>('RecruiterProfile', RecruiterProfileSchema);

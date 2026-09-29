import mongoose, { Schema, model, models } from 'mongoose';
import { IJob } from '@/types';

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: 'text',
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      index: true,
    },
    companyLogo: { type: String },
    companyDescription: { type: String },
    location: {
      city: { type: String },
      country: { type: String },
      remote: { type: Boolean, default: false },
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      required: true,
      index: true,
    },
    experience: {
      min: { type: Number, default: 0 },
      max: { type: Number },
      preferred: { type: Number },
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: {
        type: String,
        enum: ['USD', 'PKR', 'EUR', 'GBP'],
        default: 'USD',
      },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly',
      },
      negotiable: { type: Boolean, default: true },
    },
    skills: [{
      type: String,
      index: true,
    }],
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'expired', 'filled'],
      default: 'active',
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'featured'],
      default: 'public',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'RecruiterProfile',
      required: true,
      index: true,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    applications: [{
      type: Schema.Types.ObjectId,
      ref: 'Application',
    }],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ skills: 1 });
JobSchema.index({ type: 1, status: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ 'location.country': 1, 'location.city': 1 });
JobSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

JobSchema.pre('save', function(next) {
  if (this.expiryDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

export const Job = models.Job || model<IJob>('Job', JobSchema);

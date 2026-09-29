import mongoose, { Schema, model, models } from 'mongoose';
import { IApplication } from '@/types';

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'],
      default: 'applied',
      index: true,
    },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    aiMatchScore: { type: Number, min: 0, max: 100 },
    aiMatchExplanation: { type: String },
    notes: { type: String },
    interviewDate: { type: Date },
    interviewFeedback: [{
      score: { type: Number },
      notes: { type: String },
      interviewer: {
        type: Schema.Types.ObjectId,
        ref: 'RecruiterProfile',
      },
    }],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });
ApplicationSchema.index({ studentId: 1, status: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });
ApplicationSchema.index({ appliedAt: -1 });
ApplicationSchema.index({ aiMatchScore: -1 });

export const Application = models.Application || model<IApplication>('Application', ApplicationSchema);

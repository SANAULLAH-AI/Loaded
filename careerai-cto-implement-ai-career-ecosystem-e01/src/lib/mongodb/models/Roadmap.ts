import mongoose, { Schema, model, models } from 'mongoose';
import { IRoadmap } from '@/types';

const MilestoneSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeframe: { type: String, required: true },
  skills: [{ type: String }],
  projects: [{ type: String }],
  certifications: [{ type: String }],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const RoadmapSchema = new Schema<IRoadmap>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    currentRole: { type: String },
    targetRole: { type: String, required: true },
    timeline: {
      type: String,
      enum: ['1-year', '3-year', '5-year'],
      default: '5-year',
    },
    milestones: [MilestoneSchema],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    aiGenerated: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

RoadmapSchema.index({ studentId: 1 });
RoadmapSchema.index({ createdAt: -1 });

export const Roadmap = models.Roadmap || model<IRoadmap>('Roadmap', RoadmapSchema);

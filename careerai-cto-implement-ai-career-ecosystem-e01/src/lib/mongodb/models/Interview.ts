import mongoose, { Schema, model, models } from 'mongoose';
import { IInterviewSession } from '@/types';

const InterviewQuestionSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'situational'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  expectedPoints: [{ type: String }],
});

const InterviewAnswerSchema = new Schema({
  questionId: { type: String, required: true },
  answer: { type: String, required: true },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  feedback: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
  },
  idealAnswer: { type: String },
});

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    skills: [{ type: String }],
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      required: true,
    },
    questions: [InterviewQuestionSchema],
    answers: [InterviewAnswerSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

InterviewSessionSchema.index({ studentId: 1, completed: 1 });
InterviewSessionSchema.index({ createdAt: -1 });
InterviewSessionSchema.index({ overallScore: -1 });

export const InterviewSession = models.InterviewSession || model<IInterviewSession>('InterviewSession', InterviewSessionSchema);

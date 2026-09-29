import mongoose, { Schema, model, models } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin'],
      default: 'student',
      index: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    lastLoginAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ role: 1, createdAt: -1 });

export const User = models.User || model<IUser>('User', UserSchema);

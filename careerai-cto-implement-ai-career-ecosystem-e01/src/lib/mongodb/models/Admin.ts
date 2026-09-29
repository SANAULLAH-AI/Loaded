import mongoose, { Schema, model, models } from 'mongoose';
import { IAdminProfile } from '@/types';

const AdminProfileSchema = new Schema<IAdminProfile>(
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
    avatar: { type: String },
    permissions: [{ type: String }],
    lastAdminActionAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

AdminProfileSchema.index({ userId: 1 });

export const AdminProfile = models.AdminProfile || model<IAdminProfile>('AdminProfile', AdminProfileSchema);

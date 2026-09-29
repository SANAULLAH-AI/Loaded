import mongoose, { Schema, model, models } from 'mongoose';
import { NotificationPayload } from '@/types';

const NotificationSchema = new Schema<NotificationPayload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['job_match', 'application_update', 'message', 'system', 'alert'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Notification = models.Notification || model<NotificationPayload>('Notification', NotificationSchema);

import mongoose, { Schema, model, models } from 'mongoose';
import { AuditLogEntry } from '@/types';

const AuditLogSchema = new Schema<AuditLogEntry>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminProfile',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      index: true,
    },
    oldValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

AuditLogSchema.index({ adminId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const AuditLog = models.AuditLog || model<AuditLogEntry>('AuditLog', AuditLogSchema);

import { Types } from 'mongoose';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  size: number;
}

export interface NotificationPayload {
  userId: Types.ObjectId;
  type: 'job_match' | 'application_update' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  linkUrl?: string;
  targetAudience: 'all' | 'students' | 'recruiters' | 'admins';
  sentBy: Types.ObjectId;
  sentAt: Date;
  readBy: Types.ObjectId[];
}

export interface AuditLogEntry {
  _id: Types.ObjectId;
  adminId: Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: Date;
  services: {
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastChecked: Date;
  }[];
  metrics: {
    activeUsers: number;
    requestsPerMinute: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
}

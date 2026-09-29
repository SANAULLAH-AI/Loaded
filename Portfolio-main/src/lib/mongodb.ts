import { PortfolioData } from '../types/portfolio';

/**
 * Fetch portfolio data from MongoDB Atlas backend API.
 */
export async function fetchPortfolioFromMongoDB(): Promise<PortfolioData | null> {
  try {
    const res = await fetch('/api/portfolio', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (json && json.success && json.data && json.data.profile) {
      return json.data as PortfolioData;
    }
    return null;
  } catch (err) {
    console.error('Failed to load portfolio from MongoDB Atlas API:', err);
    return null;
  }
}

/**
 * Save / Sync portfolio data to MongoDB Atlas backend API.
 */
export async function savePortfolioToMongoDB(
  portfolioData: PortfolioData
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portfolioData),
    });
    const json = await res.json();
    if (res.ok && json && json.success) {
      return {
        success: true,
        message: json.message || 'All CRUD changes saved to MongoDB Atlas database!',
      };
    }
    return {
      success: false,
      message: json?.error || 'Failed to save changes to MongoDB Atlas',
    };
  } catch (err: any) {
    console.error('Failed to save portfolio to MongoDB Atlas:', err);
    return {
      success: false,
      message: err?.message || 'Network error connecting to MongoDB Atlas server',
    };
  }
}

/**
 * Fetch MongoDB Atlas Connection & Cluster Status
 */
export async function getMongoDbStatus(): Promise<{
  connected: boolean;
  provider: string;
  cluster: string;
  dbName: string;
  message: string;
  portfolioDocumentCount?: number;
}> {
  try {
    const res = await fetch('/api/db-status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      connected: false,
      provider: 'MongoDB Atlas',
      cluster: 'cluster0.qgvkxcj.mongodb.net',
      dbName: 'portfolio_db',
      message: 'Connecting to MongoDB Atlas API endpoint...',
    };
  }
}

/**
 * Send contact inquiry message to MongoDB Atlas
 */
export async function sendContactMessageToMongoDB(contactPayload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload),
    });
    const json = await res.json();
    return {
      success: json.success,
      message: json.message || json.error || 'Message processed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to submit contact message.',
    };
  }
}

/**
 * Fetch all contact inquiry messages from MongoDB Atlas Admin Inbox
 */
export async function fetchContactMessagesFromMongoDB(): Promise<{
  success: boolean;
  count: number;
  source?: string;
  messages: any[];
}> {
  try {
    const res = await fetch('/api/contact/messages', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return {
      success: !!json.success,
      count: json.count || 0,
      source: json.source,
      messages: json.messages || [],
    };
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      messages: [],
    };
  }
}

/**
 * Delete a single contact message by ID from MongoDB Atlas
 */
export async function deleteContactMessageFromMongoDB(
  messageId: string
): Promise<{ success: boolean; message: string; deletedCount?: number }> {
  try {
    const res = await fetch(`/api/contact/messages/${encodeURIComponent(messageId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return {
      success: !!json.success,
      message: json.message || json.error || 'Delete processed.',
      deletedCount: json.deletedCount,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error deleting contact message.',
    };
  }
}

/**
 * Clear ALL contact messages from MongoDB Atlas (bulk delete)
 */
export async function clearAllContactMessagesFromMongoDB(): Promise<{
  success: boolean;
  message: string;
  deletedCount?: number;
}> {
  try {
    const res = await fetch('/api/contact/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return {
      success: !!json.success,
      message: json.message || json.error || 'Clear processed.',
      deletedCount: json.deletedCount,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error clearing all contact messages.',
    };
  }
}

/**
 * Upload image (base64 data URL) to MongoDB Atlas asset repo via /api/upload proxy
 */
export async function uploadImageToMongoDB(
  fileData: string,
  fileName?: string
): Promise<{ success: boolean; url: string; fileName: string; message?: string }> {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileData, fileName: fileName || `upload_${Date.now()}` }),
    });
    const json = await res.json();
    if (res.ok && json && json.success) {
      return {
        success: true,
        url: json.url || fileData,
        fileName: json.fileName || fileName || 'uploaded_image',
        message: json.message,
      };
    }
    return {
      success: false,
      url: fileData,
      fileName: fileName || 'uploaded_image',
      message: json?.error || 'Upload endpoint returned failure.',
    };
  } catch (err: any) {
    return {
      success: false,
      url: fileData,
      fileName: fileName || 'uploaded_image',
      message: err?.message || 'Network error during image upload.',
    };
  }
}

/**
 * Fetch admin credentials config from MongoDB Atlas (for persistence across browsers)
 */
export async function fetchAdminConfigFromMongoDB(): Promise<{
  success: boolean;
  username?: string;
  pass?: string;
  source?: string;
}> {
  try {
    const res = await fetch('/api/admin/config', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (json && json.success) {
      return {
        success: true,
        username: json.username,
        pass: json.pass,
        source: json.source,
      };
    }
    return { success: false };
  } catch (err: any) {
    return { success: false };
  }
}

/**
 * Save / Sync admin credentials config to MongoDB Atlas
 */
export async function saveAdminConfigToMongoDB(payload: {
  username: string;
  pass: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json && json.success) {
      return {
        success: true,
        message: json.message || 'Admin credentials synced to MongoDB Atlas.',
      };
    }
    return {
      success: false,
      message: json?.error || 'Failed to save admin credentials to MongoDB Atlas.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error saving admin credentials.',
    };
  }
}

/**
 * Verify admin login against MongoDB Atlas (live server check)
 */
export async function verifyAdminLoginWithMongoDB(payload: {
  username: string;
  pass: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return {
      success: !!json.success,
      message: json.message || json.error || 'Login request processed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error during admin login verification.',
    };
  }
}

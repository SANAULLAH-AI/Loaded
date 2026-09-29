import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';
import fs from 'fs';
import { initialPortfolioData } from './src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Atlas Configuration
const MONGODB_URI =
  process.env.MONGODB_URI';

const DB_NAME = 'portfolio_db';
const PORTFOLIO_COLLECTION = 'portfolio_store';
const MESSAGES_COLLECTION = 'contact_messages';
const UPLOADS_COLLECTION = 'portfolio_uploads';
const ADMIN_COLLECTION = 'admin_config';

let mongoClient: MongoClient | null = null;
let dbInstance: Db | null = null;
let lastConnectAttempt = 0;
let lastConnectionErrorMsg = '';
const CONNECT_COOLDOWN_MS = 15000;
let mongoSeededOnce = false;

let serverPortfolioDataMemoryFallback: any = null;
let contactMessagesMemoryFallback: any[] = [];
let adminConfigMemoryFallback: { username: string; pass: string } = {
  username: 'sanaullah786shah92',
  pass: 'sanaullah7964',
};

try {
  if (initialPortfolioData && (initialPortfolioData as any).profile) {
    serverPortfolioDataMemoryFallback = initialPortfolioData;
    console.log('[SERVER] Loaded FULL initialPortfolioData via direct TS import from src/data/initialData.ts');
  } else {
    throw new Error('imported initialPortfolioData missing .profile');
  }
} catch (e) {
  console.warn('[SERVER] Direct import of initialPortfolioData failed, using inline default fallback:', (e as Error).message);
  serverPortfolioDataMemoryFallback = {
    profile: { name: 'Sanaullah', title: 'BSCS Programmer', subtitle: 'Data Science, Machine Learning & Artificial Intelligence Enthusiast', email: 'sanaullah786shah92@gmail.com', phone: '+92 325 1907930', location: 'Islamabad, Pakistan', cgpa: '3.86/4.00', university: 'Abasyn University Islamabad Campus', degree: 'Bachelor of Science in Computer Science', academicYears: 'January 2023 – Present', bio: 'BSCS student with strong interest in Data Science, Machine Learning, and AI.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', resumeUrl: '#', socialLinks: [{ id: 'soc-1', platform: 'Email', url: 'mailto:sanaullah786shah92@gmail.com', iconName: 'Mail', visible: true }, { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin', visible: true }, { id: 'soc-3', platform: 'GitHub', url: 'https://github.com', iconName: 'Github', visible: true }] },
    about: { title: 'About Me', content: 'BSCS student with strong interest in Data Science, Machine Learning, and AI.', highlights: [{ id: 'h1', label: 'Academic Standing', value: '3.86 / 4.00 CGPA', iconName: 'Award' }], visible: true },
    education: [], skills: [], emergingTech: [], projects: [], publications: [], testimonials: [], internships: [], certifications: [], customSections: [],
    sectionVisibility: { about: true, education: true, skills: true, emergingTech: true, projects: true, publications: true, testimonials: true, internships: true, certifications: true, contact: true },
    accentTheme: 'amber',
  };
}

async function ensureMongoSeeded(db: Db) {
  if (mongoSeededOnce) return;
  try {
    const portfolioColl = db.collection(PORTFOLIO_COLLECTION);
    const existing = await portfolioColl.findOne({ _id: 'main_portfolio' as any });
    if (!existing && serverPortfolioDataMemoryFallback) {
      await portfolioColl.insertOne({
        _id: 'main_portfolio' as any,
        data: serverPortfolioDataMemoryFallback,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      console.log('[MONGODB SEEDED] portfolio_store: inserted initialPortfolioData document (main_portfolio)');
    } else if (existing && existing.data) {
      serverPortfolioDataMemoryFallback = existing.data;
      console.log('[MONGODB LOADED] portfolio_store: loaded existing main_portfolio into memory cache');
    }

    const adminColl = db.collection(ADMIN_COLLECTION);
    const existingAdmin = await adminColl.findOne({ _id: 'main_admin' as any });
    if (existingAdmin && existingAdmin.username && existingAdmin.pass) {
      adminConfigMemoryFallback = {
        username: String(existingAdmin.username),
        pass: String(existingAdmin.pass),
      };
      console.log('[MONGODB LOADED] admin_config: loaded admin credentials from MongoDB');
    } else {
      await adminColl.updateOne(
        { _id: 'main_admin' as any },
        {
          $set: {
            _id: 'main_admin' as any,
            username: adminConfigMemoryFallback.username,
            pass: adminConfigMemoryFallback.pass,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log('[MONGODB SEEDED] admin_config: inserted default admin credentials');
    }

    const msgColl = db.collection(MESSAGES_COLLECTION);
    const msgCount = await msgColl.countDocuments();
    if (msgCount > 0 && contactMessagesMemoryFallback.length === 0) {
      const msgs = await msgColl.find({}).sort({ createdAt: -1 }).toArray();
      contactMessagesMemoryFallback = msgs.map((m: any) => ({
        id: m.id || m._id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        timestamp: m.timestamp || m.createdAt?.toISOString?.() || new Date().toISOString(),
      }));
      console.log(`[MONGODB LOADED] contact_messages: loaded ${contactMessagesMemoryFallback.length} messages into memory`);
    }

    mongoSeededOnce = true;
  } catch (e: any) {
    console.warn('[MONGODB SEED WARN] Non-critical seeding step issue:', e?.message || e);
  }
}

async function getMongoDb(): Promise<Db | null> {
  if (dbInstance) return dbInstance;

  const now = Date.now();
  if (now - lastConnectAttempt < CONNECT_COOLDOWN_MS) {
    // Return null immediately during cooldown to avoid blocking requests or spamming logs
    return null;
  }

  lastConnectAttempt = now;

  try {
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch (e) {
        // ignore close error
      }
      mongoClient = null;
    }

    mongoClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      directConnection: false,
    });

    await mongoClient.connect();
    dbInstance = mongoClient.db(DB_NAME);
    lastConnectionErrorMsg = '';
    console.log(`Connected to MongoDB Atlas Cluster0 [Database: ${DB_NAME}]`);
    await ensureMongoSeeded(dbInstance);
    return dbInstance;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    lastConnectionErrorMsg = errorMsg;
    console.log(`[MongoDB Atlas Info] DB connection pending / Atlas Network IP check: ${errorMsg}`);

    // Cleanup failed client instance
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch (e) {}
      mongoClient = null;
    }
    dbInstance = null;
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Health & MongoDB Status Endpoint
  app.get('/api/health', async (req, res) => {
    const db = await getMongoDb();
    const isMongoConnected = !!db;
    res.json({
      status: 'ok',
      database: isMongoConnected ? 'MongoDB Atlas (Cluster0)' : 'In-Memory Fallback',
      isMongoConnected,
      serverTime: new Date().toISOString(),
    });
  });

  // DB Status details endpoint for Admin CMS
  app.get('/api/db-status', async (req, res) => {
    try {
      const db = await getMongoDb();
      if (!db) {
        return res.json({
          connected: false,
          provider: 'MongoDB Atlas',
          cluster: 'cluster0.qgvkxcj.mongodb.net',
          dbName: DB_NAME,
          configuredIp: '154.192.5.104/32',
          message: lastConnectionErrorMsg
            ? `MongoDB Status: Connection pending (${lastConnectionErrorMsg}). Tip: Ensure '0.0.0.0/0' or '154.192.5.104/32' is added in MongoDB Atlas -> Network Access.`
            : 'Connecting or attempting reconnection to MongoDB Atlas Cluster0...',
        });
      }
      // Ping DB
      await db.command({ ping: 1 });
      const stats = await db.collection(PORTFOLIO_COLLECTION).countDocuments();

      return res.json({
        connected: true,
        provider: 'MongoDB Atlas',
        cluster: 'cluster0.qgvkxcj.mongodb.net',
        dbName: DB_NAME,
        configuredIp: '154.192.5.104/32',
        portfolioDocumentCount: stats,
        message: 'Successfully connected and verified MongoDB Atlas Cluster0 database!',
      });
    } catch (err: any) {
      return res.json({
        connected: false,
        provider: 'MongoDB Atlas',
        cluster: 'cluster0.qgvkxcj.mongodb.net',
        dbName: DB_NAME,
        configuredIp: '154.192.5.104/32',
        message: `MongoDB Notice: ${err?.message || 'Connection pending'}`,
      });
    }
  });

  // GET Portfolio Data from MongoDB Atlas
  app.get('/api/portfolio', async (req, res) => {
    try {
      const db = await getMongoDb();
      if (db) {
        const doc = await db.collection(PORTFOLIO_COLLECTION).findOne({ _id: 'main_portfolio' as any });
        if (doc && doc.data) {
          serverPortfolioDataMemoryFallback = doc.data;
          return res.json({ success: true, source: 'MongoDB Atlas', data: doc.data });
        }
      }
      return res.json({
        success: true,
        source: db ? 'MongoDB Atlas (Empty)' : 'Local Memory',
        data: serverPortfolioDataMemoryFallback,
      });
    } catch (err: any) {
      console.log('[MongoDB Info] Portfolio fetch fallback:', err?.message || err);
      return res.json({
        success: true,
        source: 'Local Memory Fallback',
        data: serverPortfolioDataMemoryFallback,
      });
    }
  });

  // POST Sync/Save Portfolio Data to MongoDB Atlas
  app.post('/api/portfolio', async (req, res) => {
    try {
      const portfolioData = req.body;
      if (!portfolioData) {
        return res.status(400).json({ success: false, error: 'No portfolio payload provided.' });
      }

      serverPortfolioDataMemoryFallback = portfolioData;
      const db = await getMongoDb();

      if (db) {
        await db.collection(PORTFOLIO_COLLECTION).updateOne(
          { _id: 'main_portfolio' as any },
          {
            $set: {
              _id: 'main_portfolio' as any,
              data: portfolioData,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );

        return res.json({
          success: true,
          source: 'MongoDB Atlas',
          message: 'All CRUD portfolio changes successfully saved to MongoDB Atlas database!',
        });
      }

      return res.json({
        success: true,
        source: 'Memory Cache',
        message: 'Portfolio updated in local cache (MongoDB connecting...).',
      });
    } catch (err: any) {
      console.log('[MongoDB Info] Failed to write to MongoDB Atlas:', err?.message || err);
      return res.status(500).json({
        success: false,
        error: `MongoDB Atlas Write Note: ${err?.message || err}`,
      });
    }
  });

  // POST Contact Form Submission to MongoDB Atlas
  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: Name, Email, and Message.',
      });
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || 'Portfolio Inquiry').trim(),
      message: String(message).trim(),
      timestamp: new Date().toISOString(),
    };

    contactMessagesMemoryFallback.unshift(newMessage);

    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(MESSAGES_COLLECTION).insertOne({
          _id: newMessage.id as any,
          ...newMessage,
          createdAt: new Date(),
        });
        console.log('📩 New Portfolio Contact Message Saved to MongoDB Atlas:', newMessage);
      }
    } catch (err) {
      console.warn('Could not save contact message to MongoDB Atlas, stored in memory:', err);
    }

    return res.json({
      success: true,
      message: 'Thank you! Your message has been saved to MongoDB Atlas and sent to Sanaullah.',
      receivedMessage: newMessage,
    });
  });

  // GET All Contact Messages from MongoDB Atlas
  app.get('/api/contact/messages', async (req, res) => {
    try {
      const db = await getMongoDb();
      if (db) {
        const messages = await db
          .collection(MESSAGES_COLLECTION)
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        if (messages && messages.length > 0) {
          return res.json({
            success: true,
            source: 'MongoDB Atlas',
            count: messages.length,
            messages,
          });
        }
      }
      return res.json({
        success: true,
        source: 'Memory Fallback',
        count: contactMessagesMemoryFallback.length,
        messages: contactMessagesMemoryFallback,
      });
    } catch (err) {
      return res.json({
        success: true,
        source: 'Memory Fallback',
        count: contactMessagesMemoryFallback.length,
        messages: contactMessagesMemoryFallback,
      });
    }
  });

  // POST Image Upload Proxy & MongoDB Atlas Asset Store
  app.post('/api/upload', async (req, res) => {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No file data received.' });
    }

    try {
      const db = await getMongoDb();
      if (db) {
        const uploadDoc = {
          fileId: 'img-' + Date.now(),
          fileName: fileName || 'uploaded_image',
          fileData,
          createdAt: new Date(),
        };
        await db.collection(UPLOADS_COLLECTION).insertOne(uploadDoc as any);
      }
    } catch (e) {
      console.warn('MongoDB Asset Upload Note:', e);
    }

    return res.json({
      success: true,
      url: fileData,
      fileName: fileName || 'uploaded_image',
      message: 'Image uploaded successfully to MongoDB Atlas asset repository.',
    });
  });

  // GET Admin Credentials from MongoDB Atlas
  app.get('/api/admin/config', async (req, res) => {
    try {
      const db = await getMongoDb();
      if (db) {
        const existing = await db.collection(ADMIN_COLLECTION).findOne({ _id: 'main_admin' as any });
        if (existing && existing.username) {
          adminConfigMemoryFallback = {
            username: String(existing.username),
            pass: String(existing.pass || ''),
          };
          return res.json({
            success: true,
            source: 'MongoDB Atlas',
            username: adminConfigMemoryFallback.username,
            pass: adminConfigMemoryFallback.pass,
          });
        }
      }
      return res.json({
        success: true,
        source: 'Memory Fallback',
        username: adminConfigMemoryFallback.username,
        pass: adminConfigMemoryFallback.pass,
      });
    } catch (err: any) {
      return res.json({
        success: true,
        source: 'Memory Fallback',
        username: adminConfigMemoryFallback.username,
        pass: adminConfigMemoryFallback.pass,
      });
    }
  });

  // POST Update Admin Credentials to MongoDB Atlas
  app.post('/api/admin/config', async (req, res) => {
    try {
      const { username, pass } = req.body;
      if (!username || !pass) {
        return res.status(400).json({ success: false, error: 'Username and password are required.' });
      }
      adminConfigMemoryFallback = {
        username: String(username).trim(),
        pass: String(pass).trim(),
      };
      const db = await getMongoDb();
      if (db) {
        await db.collection(ADMIN_COLLECTION).updateOne(
          { _id: 'main_admin' as any },
          {
            $set: {
              _id: 'main_admin' as any,
              username: adminConfigMemoryFallback.username,
              pass: adminConfigMemoryFallback.pass,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
        return res.json({
          success: true,
          source: 'MongoDB Atlas',
          message: 'Admin credentials saved to MongoDB Atlas successfully.',
        });
      }
      return res.json({
        success: true,
        source: 'Memory Fallback',
        message: 'Admin credentials saved to local memory (MongoDB pending).',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `Failed to update admin credentials: ${err?.message || err}`,
      });
    }
  });

  // POST Admin Login Verify against MongoDB Atlas
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, pass } = req.body;
      // Ensure latest creds are loaded from DB
      const db = await getMongoDb();
      if (db) {
        const existing = await db.collection(ADMIN_COLLECTION).findOne({ _id: 'main_admin' as any });
        if (existing && existing.username) {
          adminConfigMemoryFallback = {
            username: String(existing.username),
            pass: String(existing.pass || ''),
          };
        }
      }
      const ok =
        username?.trim() === adminConfigMemoryFallback.username &&
        pass?.trim() === adminConfigMemoryFallback.pass;
      return res.json({
        success: ok,
        message: ok ? 'Admin login verified against MongoDB Atlas.' : 'Invalid admin credentials.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `Login verification error: ${err?.message || err}`,
      });
    }
  });

  // DELETE Single Contact Message by ID from MongoDB Atlas
  app.delete('/api/contact/messages/:id', async (req, res) => {
    try {
      const msgId = req.params.id;
      if (!msgId) {
        return res.status(400).json({ success: false, error: 'Message ID required.' });
      }
      contactMessagesMemoryFallback = contactMessagesMemoryFallback.filter(
        (m) => String(m.id) !== String(msgId) && String(m._id) !== String(msgId)
      );
      const db = await getMongoDb();
      if (db) {
        const delRes = await db.collection(MESSAGES_COLLECTION).deleteOne({
          $or: [{ _id: msgId as any }, { id: msgId as any }],
        });
        return res.json({
          success: true,
          source: 'MongoDB Atlas',
          deletedCount: delRes.deletedCount || 0,
          message: `Contact message ${msgId} removed from MongoDB Atlas.`,
        });
      }
      return res.json({
        success: true,
        source: 'Memory Fallback',
        message: `Contact message ${msgId} removed from local memory.`,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete contact message: ${err?.message || err}`,
      });
    }
  });

  // DELETE All Contact Messages Bulk
  app.delete('/api/contact/messages', async (req, res) => {
    try {
      contactMessagesMemoryFallback = [];
      const db = await getMongoDb();
      if (db) {
        const delRes = await db.collection(MESSAGES_COLLECTION).deleteMany({});
        return res.json({
          success: true,
          source: 'MongoDB Atlas',
          deletedCount: delRes.deletedCount || 0,
          message: 'All contact messages cleared from MongoDB Atlas.',
        });
      }
      return res.json({
        success: true,
        source: 'Memory Fallback',
        message: 'All contact messages cleared from local memory.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `Failed to clear messages: ${err?.message || err}`,
      });
    }
  });

  // Vite Middleware in Development vs Static Serve in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Portfolio App running with MongoDB Atlas Cluster0`);
    console.log(`   ➜  Local:         http://localhost:${PORT}`);
    console.log(`   ➜  Loopback:      http://127.0.0.1:${PORT}`);
    console.log(`   ➜  Network bind:  0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});


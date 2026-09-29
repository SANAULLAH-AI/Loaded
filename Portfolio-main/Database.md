# Database Documentation & Integration

## Overview
This application uses **MongoDB Atlas** as its primary cloud database to provide persistent storage for all CRUD operations, contact form inquiries, and image uploads across the portfolio. Changes made in the Admin CMS are automatically synced to the MongoDB Atlas cluster in real time.

---

## MongoDB Atlas Connection & Configuration

- **Cluster Endpoint**: `cluster0.qgvkxcj.mongodb.net`
- **Connection URI**: `mongodb+srv://sanaullah:portfolio@cluster0.qgvkxcj.mongodb.net/?appName=Cluster0`
- **Allowed Network IP**: `154.192.5.104/32` (and server egress IP range)
- **Database Name**: `portfolio_db`

---

## MongoDB Collections Schema

The MongoDB database contains three primary collections:

### 1. `portfolio_store` Collection
Stores the complete application state document:
- `_id`: `"main_portfolio"`
- `data`: Full `PortfolioData` JSON schema object containing profile, education, skills, projects, publications, certifications, custom sections, section visibility flags, and theme settings.
- `updatedAt`: ISO timestamp of the latest edit.

### 2. `contact_messages` Collection
Stores incoming contact form messages submitted by visitors:
- `_id`: `"msg-<timestamp>"`
- `name`: Visitor name
- `email`: Visitor email
- `subject`: Subject line
- `message`: Message body content
- `timestamp`: ISO timestamp
- `createdAt`: Date object

### 3. `portfolio_uploads` Collection
Stores image asset uploads:
- `fileId`: `"img-<timestamp>"`
- `fileName`: String
- `fileData`: Base64 image string / URL
- `createdAt`: Date object

---

## API Endpoints (Express + MongoDB Driver)

- `GET /api/db-status`: Checks MongoDB Atlas Cluster0 connection state and document count.
- `GET /api/portfolio`: Fetches the latest `main_portfolio` document from MongoDB Atlas `portfolio_store`.
- `POST /api/portfolio`: Performs an `updateOne` with `{ upsert: true }` to save all CRUD edits to MongoDB Atlas.
- `POST /api/contact`: Inserts a new visitor message into MongoDB Atlas `contact_messages` collection.
- `GET /api/contact/messages`: Retrieves all contact messages from MongoDB Atlas.
- `POST /api/upload`: Saves uploaded image assets to MongoDB Atlas `portfolio_uploads` collection.

---

## Sync Mechanism & Resilience

1. **Mount Load**: When the app boots, `PortfolioContext` fetches `/api/portfolio`. If present in MongoDB Atlas, it updates the application state.
2. **Debounced Auto-Sync**: Edits in Admin CMS automatically trigger a debounced save to MongoDB Atlas after 1000ms.
3. **Manual Controls**: Admin CMS includes manual "Sync All CRUD Changes To MongoDB Atlas" and "Fetch Fresh Document From MongoDB Atlas" buttons.
4. **Resilient Fallback**: In case of transient network delays or IP restrictions, local cache ensures zero downtime for visitors while attempting automatic background reconnects.

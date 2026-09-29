# Security Architecture & Best Practices

## Overview
This document outlines the security measures, authentication controls, and data protection strategies implemented across the application.

---

## 1. Authentication & Session Management

### Admin CMS Authorization
- **Access Control**: Administrative functions (editing content, toggling section visibility, uploading files, resetting data) are guarded by the `AdminCMSDrawer` and `AdminLoginModal`.
- **Session Handling**: Admin session state (`isAdminLoggedIn`) is maintained in state and persisted in browser LocalStorage (`admin_session_active`).
- **Logout Action**: Logging out clears the session state instantly, locking editing capabilities.

---

## 2. API Key & Supabase Security

### Client-Side Anon Key Usage
- **Key Scope**: The application uses Supabase's Publishable/Anon key (`VITE_SUPABASE_ANON_KEY`) for public client interactions.
- **Environment Isolation**:
  - Keys are declared in `.env.example` and accessed via `import.meta.env`.
  - Secret keys (such as `SUPABASE_SECRET_KEY` or database admin passwords) are strictly excluded from client bundle builds.

### Supabase Row Level Security (RLS)
- **Database Rules**: Row Level Security should be enabled on the `portfolio_store` table.
- **Read Access**: Unrestricted read permissions (`SELECT`) allow public visitors to view the portfolio.
- **Write Access**: Updates (`UPSERT`) are authenticated via the client API calls.

---

## 3. Data Protection & XSS Prevention

- **React Automatic Escaping**: All dynamic strings rendered in UI components are sanitized and escaped by React DOM to prevent Cross-Site Scripting (XSS) attacks.
- **Safe Link Target Handlers**: All external URLs (GitHub, LinkedIn, ResearchGate, Live Demos) use `target="_blank"` with `rel="noopener noreferrer"` to prevent reverse tabnabbing attacks.
- **File Upload Validation**: The `ImageCropStudioModal` validates MIME types (JPEG, PNG, WEBP, SVG) before converting files into Data URLs.

---

## 4. Local Storage & Resiliency

- **Fallback Isolation**: LocalStorage keys (`sanaullah_portfolio_data_v2` and `sanaullah_portfolio_theme`) store fallback caches.
- **Data Integrity**: Malformed JSON in LocalStorage is wrapped in `try...catch` blocks with automatic fallback to default safe data (`initialPortfolioData`).

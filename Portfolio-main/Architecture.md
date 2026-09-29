# System Architecture

## Overview
This application is a modern, responsive, high-performance Academic & Professional Portfolio platform for **Sanaullah** (BS Computer Science / AI & Machine Learning). It is built using **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**, integrated with **Supabase** for live cloud database CRUD synchronization.

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript) |
| **Build Tool & Dev Server** | Vite |
| **Styling & UI Components** | Tailwind CSS, Lucide React Icons |
| **State Management** | React Context API (`PortfolioContext`) |
| **Cloud Persistence & Backend** | Supabase PostgreSQL (`@supabase/supabase-js`) |
| **Local Storage Backup** | Browser LocalStorage API |
| **Asset Storage** | Codebase `/public/images/` directory & Data URLs |

---

## High-Level Architecture Diagram

```
+-----------------------------------------------------------------------+
|                              USER BROWSER                              |
|                                                                       |
|  +--------------------------+        +-----------------------------+  |
|  |   Portfolio Visitor UI   |        |   Admin CMS Control Drawer  |  |
|  |  (Hero, Projects, Bio)   |        |  (CRUD Editor & Toggles)    |  |
|  +------------+-------------+        +--------------+--------------+  |
|               |                                     |                 |
|               +------------------+------------------+                 |
|                                  |                                    |
|                                  v                                    |
|                      +------------------------+                       |
|                      |   PortfolioContext     |                       |
|                      |  (Global State Engine) |                       |
|                      +-----------+------------+                       |
|                                  |                                    |
|            +---------------------+---------------------+              |
|            |                                           |              |
|            v                                           v              |
|   +------------------+                       +-------------------+    |
|   | LocalStorage API |                       | Supabase JS SDK   |    |
|   | (Local Fallback) |                       | (Cloud Client)    |    |
|   +------------------+                       +---------+---------+    |
+--------------------------------------------------------|--------------+
                                                         | HTTPS / REST
                                                         v
                                              +---------------------+
                                              | Supabase Cloud DB   |
                                              | (portfolio_store)   |
                                              +---------------------+
```

---

## Core Components Structure

- **`src/App.tsx`**: Main entry container rendering header, portfolio sections, modals, and CMS drawer.
- **`src/context/PortfolioContext.tsx`**: Centralized state store managing portfolio data, theme (dark/light), admin login state, modal toggles, and Supabase auto-sync.
- **`src/lib/supabase.ts`**: Initialized Supabase client instance and CRUD functions (`fetchPortfolioFromSupabase`, `savePortfolioToSupabase`).
- **`src/components/`**:
  - `Header.tsx`: Navigation bar with dynamic section visibility tabs and dark mode toggle.
  - `Hero.tsx`: Main showcase banner featuring bio, avatar, and quick contact action buttons.
  - `AboutSection.tsx`: Summary, research interests, and core competencies.
  - `EducationSection.tsx`: Academic degrees, university details, CGPA, and coursework.
  - `SkillsSection.tsx`: Categorized technical skills with progress bars.
  - `ProjectsSection.tsx`: Showcase of AI/ML, NLP, and software projects with live/code links and modal detail previews.
  - `PublicationsSection.tsx`: Research papers, Kaggle writeups, and articles.
  - `CertificationsSection.tsx`: Verified certificate badges and credentials.
  - `InternshipsSection.tsx`: Industry experience and leadership roles.
  - `TestimonialsSection.tsx`: Department head and mentor recommendations.
  - `ContactSection.tsx`: Direct email, social links, and message form.
  - `AdminCMSDrawer.tsx`: Full-featured slide-over admin drawer for live portfolio CRUD editing.
  - `ImageCropStudioModal.tsx`: Image upload and aspect-ratio cropper studio.
  - `ResumeViewerModal.tsx`: Interactive PDF/CV previewer.

---

## Asset & Image Architecture
- **Directory**: `/public/images/`
- **Static Assets**: Pre-bundled SVG/JPG images stored directly in the repository under `/public/images/`.
- **Dynamic Uploads**: Admin CMS image cropper converts custom user uploads into optimized Base64 Data URLs or direct image path references, persisted straight to Supabase DB.

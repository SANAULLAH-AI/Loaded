# Error Handling & Resilience Strategy

## Overview
This document details the defensive programming practices, error boundary strategies, and graceful degradation mechanisms implemented in the application to ensure zero downtime and smooth user experience.

---

## 1. Supabase Database Fault Tolerance

### Graceful Degradation Strategy
The application operates on a **dual-storage strategy** (Supabase Cloud + Browser LocalStorage + Default Data Bundle).

```
                      +-----------------------------+
                      |   Fetch / Save Request      |
                      +--------------+--------------+
                                     |
                                     v
                       +---------------------------+
                       | Supabase Network Call     |
                       +-------------+-------------+
                                     |
                    +----------------+----------------+
                    |                                 |
              [Success]                           [Failure]
                    |                                 |
                    v                                 v
          +-------------------+             +-------------------+
          | Update State &    |             | Log Warning       |
          | LocalStorage      |             | Fallback to Local |
          +-------------------+             | Storage Cache     |
                                            +-------------------+
```

### Key Error Handling Code Patterns
In `src/lib/supabase.ts`:
- **`maybeSingle()` Query Execution**: Uses `maybeSingle()` instead of `single()` when querying Supabase. This prevents throwing unhandled exceptions if the `portfolio_store` table is empty.
- **Fail-Safe Fallback**: If network requests fail (e.g., ad blockers, offline status, or missing database table), functions catch the error silently, return `null` or `false`, and fall back to local storage without breaking the UI.

---

## 2. Real-Time Status Feedback in Admin CMS

The Admin CMS drawer displays a live visual status badge for database interactions:

| Status State | Badge Style | User Message |
| :--- | :--- | :--- |
| **`idle`** | Gray | "Supabase ready (local cache active)" |
| **`syncing`** | Amber (Animated pulse) | "Saving changes to Supabase DB..." |
| **`synced`** | Emerald | "All CRUD changes synced to Supabase database" |
| **`error`** | Rose / Red | "Failed to sync to Supabase (check table or permissions)" |

---

## 3. LocalStorage Parser Resiliency

In `src/context/PortfolioContext.tsx`:
- **JSON Parse Protection**: `JSON.parse(saved)` is wrapped in a `try...catch` block.
- **Schema Migration Merging**: Loaded data is deep-merged with `initialPortfolioData` using object spread operators to ensure newly added properties or array fields are never `undefined`:
  ```typescript
  return {
    ...initialPortfolioData,
    ...parsed,
    profile: { ...initialPortfolioData.profile, ...(parsed.profile || {}) },
    sectionVisibility: {
      ...initialPortfolioData.sectionVisibility,
      ...(parsed.sectionVisibility || {}),
    },
  };
  ```

---

## 4. UI Component Guarding

- **Array Guarding**: Array operations (`.map()`, `.filter()`) across sections check for existence (`data.projects || []`) to prevent runtime type errors.
- **Image Fallbacks**: If an image URL fails to load, `onError` handlers replace broken image sources with fallback SVG placeholders (`/images/profile-avatar.svg` or default icons).
- **Type Safety**: All components strictly implement TypeScript interfaces defined in `src/types/portfolio.ts`.

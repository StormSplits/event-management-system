# Tech Stack & Architecture Explanation

This document provides a deep dive into the technologies used in the College Event Management System and the reasoning behind each choice.

---

## 1. Core Framework: Next.js 15 (App Router)

### Why Next.js?
- **Server Components (RSC):** Non-interactive UI (event feed, dashboard stats, participant lists) is rendered on the server, reducing the JavaScript bundle sent to the client and improving initial load performance.
- **App Router:** File-system based routing with native support for nested layouts. Route groups like `(auth)` and `(student)` allow shared layouts without affecting URL paths.
- **Server Actions:** Form submissions and mutations (create/edit/delete event, register, unregister, update profile) are handled securely on the server without writing separate API endpoints. The `useActionState` hook connects client forms to server actions with built-in pending and error states.
- **API Routes:** Used for cases where a traditional HTTP endpoint is needed — e.g., `/api/auth/forgot-password` calls Supabase's `resetPasswordForEmail` and returns JSON.

### Route Groups & Layout Architecture

| Group | Layout | Routes |
| :--- | :--- | :--- |
| `(auth)` | Centered card layout | Login, Register, Forgot Password, Reset Password |
| `(student)` | Navbar layout | Feed, Registrations, Profile |
| `admin/` | Sidebar layout | Dashboard, Analytics, Events, Participants, Settings |

---

## 2. Styling: Tailwind CSS v4 + Shadcn UI

### Tailwind CSS v4
- **Utility-First:** Classes are written directly in JSX, eliminating context-switching between CSS files and components.
- **Design System:** A custom theme in `globals.css` defines primary (Indigo `#4F46E5`), secondary (Amber `#F59E0B`), and neutral color scales with full dark mode support via CSS variables.
- **Performance:** Tailwind v4 compiles only the CSS that is actually used, resulting in a minimal stylesheet in production.

### Shadcn UI + Radix UI
Shadcn UI components are copied directly into the project (`src/components/ui/`), giving full ownership of the code.

- **Accessibility:** Built on Radix UI primitives — all Dialogs, Dropdowns, and Tabs are WAI-ARIA compliant out of the box.
- **Customisability:** Components like `Button`, `Card`, `Dialog`, `Table`, and `Tabs` are extended with project-specific variants without fighting a third-party API.

---

## 3. Database & Authentication: Supabase

### Database (PostgreSQL)

Three core tables:

| Table | Key Columns | Purpose |
| :--- | :--- | :--- |
| `profiles` | `id`, `full_name`, `email`, `role`, `avatar_url` | User data linked to Supabase Auth users |
| `events` | `id`, `title`, `description`, `rules`, `date`, `location`, `category`, `capacity`, `image_url`, `registration_deadline` | All event data |
| `registrations` | `id`, `user_id`, `event_id`, `created_at` | Join table with unique constraint on `(user_id, event_id)` |

### Authentication
- **Supabase Auth** handles sign-up, login, logout, and password reset.
- **`@supabase/ssr`** manages session cookies securely across Next.js Server Components, Client Components, and Middleware.
- **Middleware** (`src/middleware.ts`) protects routes — unauthenticated users are redirected to `/login`, and non-admin users are blocked from `/admin/*`.
- **Password Reset** uses Supabase's `resetPasswordForEmail` via a dedicated API route (`/api/auth/forgot-password`), sending a real reset email with a redirect back to `/auth/reset-password`.

### Role-Based Access Control
- Role is stored in the `profiles` table (`student` or `admin`) and checked in both Middleware and server actions.
- Admin server actions (create/edit/delete event) perform a server-side role check against the `profiles` table before executing — preventing privilege escalation even if client-side guards are bypassed.

---

## 4. Key Feature Implementations

### Markdown Rendering
Event descriptions and rules are stored as Markdown strings in the database and rendered using **`react-markdown`** in the `EventDetailModal`. This allows admins to use rich formatting (bold, lists, headings, code blocks) without a complex rich text editor.

### Image Handling
- Admins can provide a **URL** (e.g., Pexels, Unsplash) or upload a **file** (converted to base64, max ~200KB).
- `next.config.ts` whitelists `images.pexels.com`, `images.unsplash.com`, and Supabase storage domains for `next/image` optimisation.
- Base64 images bypass the Next.js image optimiser (`unoptimized` flag) since they are already embedded data URIs.

### Duplicate Registration Prevention
- The `registrations` table has a unique constraint on `(user_id, event_id)`.
- The server action catches Postgres error code `23505` (unique violation) and returns a user-friendly message.
- The feed page fetches the user's registered event IDs server-side and passes them to `FeedView`, which marks cards as "Registered ✓" and disables the registration button in the modal.

### Past Events
- Past events are fetched separately (`.lt('date', now)`) and displayed in a read-only state.
- The `EventCard` applies `grayscale` and reduced opacity; the `EventDetailModal` shows a "This event has ended" overlay and disables the registration button entirely.
- Both the student feed and admin events page separate Upcoming and Past events into distinct tabs/sections.

### CSV Export (Participants)
- The `ExportButton` component (`export-button.tsx`) is a `"use client"` component co-located with the participants page.
- On click, it generates a CSV string from the participant data array, creates a `Blob`, and triggers a browser download — no server round-trip needed.
- This pattern (server page + client island for interactivity) is a core RSC pattern used throughout the app.

### Notifications
- A notification bell in the student navbar shows upcoming event reminders.
- Implemented as a client component (`features/student/notifications/`) that fetches and displays relevant upcoming events.

### Unregister
- Students can unregister from upcoming events via the `UnregisterButton` client component on the Registrations page.
- The server action deletes the row from `registrations` and revalidates the page cache.

---

## 5. Component Architecture

```
components/
├── ui/           # Shadcn primitives (Button, Card, Dialog, Table, Tabs, Badge, etc.)
├── shared/       # Components shared across student and admin roles
└── features/
    ├── admin/
    │   ├── sidebar.tsx           # Admin navigation sidebar
    │   ├── dashboard-stats.tsx   # Live metric cards
    │   └── events/               # Admin event form sub-components
    └── student/
        ├── navbar.tsx            # Student top navigation with notification bell
        ├── event-card.tsx        # Event card with past/upcoming visual states
        ├── event-detail-modal.tsx# Full event detail dialog with registration
        ├── feed-view.tsx         # Client component managing tabs, filters, and state
        ├── filter-bar.tsx        # Category filter buttons
        ├── notifications/        # Notification bell + dropdown
        ├── profile-form.tsx      # Student profile update form
        └── unregister-button.tsx # Unregister from event button
```

The pattern used throughout is **Server Component pages + Client Component islands**: pages fetch data on the server and pass it as props to interactive client components, keeping the data-fetching layer clean and the bundle size minimal.

---

## 6. Deployment: Vercel

- **Zero Configuration:** Vercel auto-detects Next.js and handles build settings.
- **Edge Network:** Global CDN for fast static asset delivery.
- **CI/CD:** Automatic deployments on every `git push` to the main branch.
- **Environment Variables:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in the Vercel project dashboard.

---

## Summary of Key Decisions

| Decision | Alternative Considered | Reason for Choice |
| :--- | :--- | :--- |
| **Next.js App Router** | React SPA + Express | Server rendering, built-in backend, better SEO |
| **Server Actions** | REST API | Eliminates boilerplate, type-safe end-to-end, no extra routes |
| **Tailwind CSS v4** | CSS Modules | Faster iteration, consistent design system, minimal output |
| **Shadcn UI** | Material UI / Ant Design | Full code ownership, smaller bundle, accessible primitives |
| **Supabase** | Firebase / Custom Backend | Relational SQL, excellent Next.js SSR integration, built-in Auth |
| **react-markdown** | Rich text editor (Tiptap, Quill) | Lightweight, safe, zero configuration — Markdown stored as plain text |
| **CSV via Blob** | Server-side file generation | No server round-trip, instant download, simpler implementation |

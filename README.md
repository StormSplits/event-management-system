# College Event Management System

A comprehensive, full-stack event management platform for college campuses. Features role-based access for students and administrators, enabling seamless event discovery, registration, and management.

---

## 🚀 Features

### For Students
- **Event Feed:** Browse upcoming and past events in a responsive grid with Upcoming / Past tabs.
- **Category Filtering:** Filter events by category (Technical, Cultural, Sports, etc.) using a dynamic filter bar.
- **Smart Registration:** One-click registration with live capacity tracking. Already-registered events show "Registered ✓" to prevent duplicates.
- **Past Events:** Past events are displayed in a greyed-out, read-only mode — descriptions and rules are visible but registration is blocked.
- **My Registrations:** Dedicated page showing registered events split into Upcoming and Past sections, with an Unregister option for upcoming events.
- **Notifications:** In-app notification bell for upcoming event reminders.
- **Markdown Rendering:** Event descriptions and rules are rendered as rich Markdown (bold, lists, headings, etc.).
- **Forgot Password:** Real email-based password reset via Supabase Auth.
- **Profile:** Students can view their profile information.

### For Administrators
- **Dashboard:** Live metrics — total students, active events, total registrations, and engagement rate.
- **Event Management:** Create, edit, and delete events with a rich form supporting Markdown descriptions, rules, image upload (file or URL), date/time, capacity, category, location, and registration deadline.
- **Past Events View:** Admin events page separates Upcoming and Past events into distinct sections.
- **Participant Tracking:** Per-event participant list with name, email, registration time, user ID, and status.
- **CSV Export:** Download the participant list for any event as a `.csv` file.
- **All Registrations:** Global view of all registrations across every event (`/admin/participants`).
- **Analytics:** Dedicated analytics page for event engagement insights.
- **Profile Settings:** Admins can update their display name from the Settings page.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) |
| **Language** | TypeScript |

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** v18.17.0 or higher
- **npm** v9.0.0 or higher
- **Supabase Account** — you need a Supabase project for the database and authentication.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/college-event-system.git
cd college-event-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment on Vercel

1. **Push to GitHub** — ensure your project is in a GitHub repository.
2. **Import to Vercel** — go to [vercel.com/dashboard](https://vercel.com/dashboard), click **Add New → Project**, and import the repo.
3. **Add Environment Variables** — add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Deploy** — click **Deploy**. Vercel will build and provide a live URL.

---

## 🔐 Authentication & Roles

Supabase Auth is used for all authentication. Roles are stored in the `profiles` table.

| Role | Access |
| :--- | :--- |
| **Student** | Browse events, register/unregister, view own registrations, update profile. *(Default role)* |
| **Admin** | Full access: dashboard, analytics, create/edit/delete events, view all participants, CSV export, settings. *(Requires `role: admin` in `profiles` table)* |

Password reset emails are sent via Supabase's built-in email service. Configure the redirect URL in your Supabase project's Auth settings to point to `/auth/reset-password`.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (auth)/                     # Auth routes: Login, Register, Forgot Password, Reset Password
│   ├── (student)/                  # Student portal
│   │   ├── feed/                   # Event feed with Upcoming/Past tabs and category filters
│   │   ├── registrations/          # My Registrations page
│   │   └── profile/                # Student profile page
│   ├── admin/                      # Admin portal (sidebar layout)
│   │   ├── dashboard/              # Live metrics dashboard
│   │   ├── analytics/              # Event analytics page
│   │   ├── events/                 # Event management (list, create, edit, delete)
│   │   │   └── [id]/
│   │   │       └── participants/   # Per-event participant list + CSV export
│   │   ├── participants/           # Global all-registrations view
│   │   └── settings/               # Admin profile settings
│   ├── api/
│   │   └── auth/forgot-password/   # API route for Supabase password reset email
│   └── auth/                       # Auth callback & reset-password handlers
├── components/
│   ├── ui/                         # Shadcn UI primitives (Button, Card, Dialog, Table, etc.)
│   ├── shared/                     # Shared components across roles
│   └── features/
│       ├── admin/                  # Admin-specific: Sidebar, DashboardStats, event form components
│       └── student/                # Student-specific: EventCard, EventDetailModal, FeedView,
│                                   #   FilterBar, Navbar, Notifications, ProfileForm, UnregisterButton
└── lib/
    ├── supabase/                   # Supabase client (server + browser)
    └── utils.ts                    # Utility helpers (cn, etc.)
```

---

## 🗄 Database Schema

| Table | Key Columns |
| :--- | :--- |
| `profiles` | `id`, `full_name`, `email`, `role` (`student`/`admin`), `avatar_url` |
| `events` | `id`, `title`, `description`, `rules`, `date`, `location`, `category`, `capacity`, `image_url`, `registration_deadline` |
| `registrations` | `id`, `user_id`, `event_id`, `created_at` — unique constraint on `(user_id, event_id)` |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

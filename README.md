# TaskBloom

**Where productivity blossoms.**

A premium SaaS task management platform with a marketing landing page, authenticated dashboard, Convex backend, and subscription-ready architecture.

## Tech stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Convex (database, auth, server functions)
- **Auth:** Convex Auth (email/password)
- **UI:** Radix UI primitives, Lucide icons, Recharts, Sonner toasts

## Getting started

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Clone and install**

   ```bash
   cd "Task List App - Winnie"
   npm install
   ```

   If you see **`EBADPLATFORM` / `inotify`** on Windows, run instead:

   ```bash
   npm install --legacy-peer-deps --force
   ```

   (`.npmrc` sets `legacy-peer-deps`; `--force` skips the Linux-only `inotify` platform check so install completes on Windows.)

2. **Convex**

   Link your Convex project (creates one if needed):

   ```bash
   npx convex dev
   ```

   Follow the prompts to log in and create or link a deployment. This generates `convex/_generated` and sets `CONVEX_DEPLOYMENT` in your environment.

3. **Environment variables**

   Copy the example env file and set your Convex URL:

   ```bash
   cp .env.local.example .env.local
   ```

   Set `NEXT_PUBLIC_CONVEX_URL` to your Convex deployment URL (shown in the Convex dashboard or after `npx convex dev`).

   **Convex Auth (required for login/signup):** Set these in the **Convex dashboard** (Deployment → Settings → Environment Variables), not in `.env.local`:

   - `SITE_URL` — e.g. `http://localhost:3000` for local dev (optional if only using passwords)
   - `JWT_PRIVATE_KEY` and `JWKS` — required. Generate them once:
     1. Install deps: `npm install --legacy-peer-deps`
     2. Run: `npm run generate-auth-keys`
     3. Copy the two lines of output and add them as two separate environment variables in the [Convex dashboard](https://dashboard.convex.dev) under your deployment’s Environment Variables (paste each line as name=value).

4. **Run the app**

   With Convex dev running in one terminal:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

   **Note:** Use `npm run dev` (runs this project’s script). Do not use `npx dev run`—that is a different package and can trigger the inotify/Windows install error.

## Project structure

```
app/
  (marketing)/     # Landing page at /
  (auth)/          # /login, /signup
  (dashboard)/     # /dashboard, /tasks, /analytics, /settings, /upgrade
components/
  marketing/       # Hero, Features, Pricing, etc.
  dashboard/       # Sidebar, TopBar
  ui/              # Button, Card, Input, Badge, Modal, Skeleton
convex/
  schema.ts        # users, tasks, subscriptions (+ auth tables)
  auth.ts          # Convex Auth (Password provider)
  http.ts          # Auth HTTP routes
  tasks.ts         # Task CRUD and queries
  users.ts         # Profile and ensureProfile
  subscriptions.ts # Subscription scaffold (Stripe-ready)
  seed.ts          # Seed tasks for new users
  analytics.ts     # Charts data
lib/
  utils.ts         # cn(), priority colors
```

## Features

- **Marketing:** Animated landing page with hero, features, pricing, testimonials, CTA
- **Auth:** Email/password sign up and sign in via Convex Auth; protected dashboard routes
- **Dashboard:** Overview with completion progress, due today, streak, priority breakdown
- **Tasks:** Create, edit, delete, toggle complete; filter by priority/status; sort; search
- **Analytics:** Tasks completed per week, priority distribution, completion trend
- **Settings:** Profile, theme toggle, subscription placeholder, danger zone
- **Upgrade:** Pricing cards, Pro feature gated by `subscriptionStatus`, monthly/yearly toggle (UI)
- **Design:** Food-inspired palette (Strawberry, Avocado, Blueberry, etc.) and TaskBloom brand tokens; light/dark mode

## Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_CONVEX_URL` and (if using auth) ensure `SITE_URL` in Convex matches your production URL.
- **Backend:** Convex is deployed separately; `npx convex dev` deploys to your Convex cloud project.

## License

Private / portfolio use.

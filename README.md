# TaskBloom — Task Management & Productivity (Next.js + Convex)

TaskBloom is a premium SaaS task management platform that helps users organize tasks, track progress, and stay productive. It provides a marketing landing page, authenticated dashboard, real-time task sync, and subscription-ready architecture. It is built as an educational/portfolio project using Next.js 15 (App Router) and Convex.

**website preview**

Run the app and open http://localhost:3000 for a preview.

## Main features

- Displays a marketing landing page (hero, features, pricing, testimonials) and an authenticated dashboard at `/dashboard`
- Real-time task management: create, edit, delete, and toggle completion with instant sync via Convex
- Filtering and sorting of tasks by priority, status, and search; overview with completion progress, due today, and streak
- Analytics: tasks completed per week, priority distribution, and completion trend (Recharts)
- Email/password authentication (Convex Auth) with protected dashboard routes
- Settings: profile, theme toggle (light/dark), subscription placeholder, and danger zone
- Upgrade flow with pricing cards and Pro feature gated by subscription status (Stripe-ready)
- Food-inspired design palette (Strawberry, Avocado, Blueberry) and TaskBloom brand; responsive UI with Radix primitives

## Tech stack

- **Runtime & framework:** Node.js, Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **Backend & database:** Convex (database, auth, server functions)
- **Authentication:** Convex Auth (email/password)
- **UI & motion:** Radix UI primitives, Lucide icons, Framer Motion, Recharts, Sonner toasts

## Launching the app

**Clone:**

```bash
git clone https://github.com/WinnieYuDev/task-bloom
cd task-bloom
```

(Or clone this repository and `cd` into the project folder.)

**Install dependencies:**

```bash
npm install --legacy-peer-deps
```

**Convex:** Link your Convex project (creates one if needed):

```bash
npx convex dev
```

Log in and create or link a deployment. This generates `convex/_generated` and sets `CONVEX_DEPLOYMENT` in your environment.

**Environment variables:** Create a `.env.local` file in the project root (see `.env.local.example`). Set:

- `NEXT_PUBLIC_CONVEX_URL` — your Convex deployment URL (from the Convex dashboard or after `npx convex dev`)

**Convex Auth (required for login/signup):** In the **Convex dashboard** (Deployment → Settings → Environment Variables), add:

- `SITE_URL` — e.g. `http://localhost:3000` for local dev
- `JWT_PRIVATE_KEY` and `JWKS` — run `npm run generate-auth-keys` and paste the two output lines as separate env vars in the [Convex dashboard](https://dashboard.convex.dev).

**Start the app:**

With `npx convex dev` running in one terminal:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Examples:** Take a look at similar projects!

- FoodGuard (MVC): https://github.com/WinnieYuDev/food-guard-mvc-demo
- Boston Community Swap: https://github.com/WinnieYuDev/community-trade-fullstack
- Home Cooking Reviews: https://github.com/WinnieYuDev/home-cooking-fullstack

## Backend technologies

Convex: https://www.convex.dev

## License & credits

Private / portfolio use.

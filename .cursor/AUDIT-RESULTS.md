# Security Audit Report

**Date:** 2025-02-18  
**Scope:** Convex auth, mutations/queries, app auth routes, middleware, user input.

## Summary

Overall risk was **Medium** (Critical and High items have been addressed in this run). The app uses Convex Auth with server-side identity checks in Convex; protected routes are enforced client-side until a Convex Auth Next.js adapter is used. **Critical:** Subscription mutation allowed any user to modify any other user’s subscription (fixed). **Critical:** Signup page contained debug code that sent auth env state and errors to an external ingest URL (removed). **High:** Public debug action exposed auth env state (converted to internal). Remaining items are suggestions.

## Findings

### Critical (addressed)

- **convex/subscriptions.ts — `createOrUpdate`**  
  Any authenticated user could pass any `userId` and create/update that user’s subscription (privilege escalation).  
  **Fix:** Enforce `currentUserId === args.userId`; only allow updating own subscription (or use an internal mutation for Stripe webhook).

- **app/(auth)/signup/page.tsx — agent/debug logging**  
  Code sent Convex auth env state (`jwtPrivateKeySet`, `jwksSet`) and error messages to `http://127.0.0.1:7243/ingest/...`, and called `api.debugAuthEnv.check` from the client.  
  **Fix:** Removed all ingest fetches and `debugAuthEnv.check` usage from signup.

### High (addressed)

- **convex/debugAuthEnv.ts — public `check` action**  
  Returned whether `JWT_PRIVATE_KEY` and `JWKS` are set (information disclosure).  
  **Fix:** Converted to `internalAction` so it is not part of the public API.

### Suggestions

- **middleware.ts**  
  Protected paths (`/dashboard`, `/tasks`, etc.) are not enforced server-side; the comment notes that the dashboard layout redirects when `getCurrentUser` is null. Add server-side protection when Convex Auth provides a Next.js adapter (e.g. read auth cookie in middleware and redirect unauthenticated users).

- **convex/invitations.ts — `getByToken`**  
  Unauthenticated; anyone with the token can read the invitation. Ensure invitation tokens are high-entropy (e.g. crypto.randomUUID or equivalent when creating them) and consider rate limiting this query.

- **convex/auth.config.ts**  
  Uses `process.env.CONVEX_SITE_URL`; ensure this is set in Convex env for the deployment and not committed.

### Passed

- **Authentication & sessions:** No tokens or secrets in logs, errors, or client payloads. Auth is checked server-side in Convex via `auth.getUserId(ctx)`.
- **Authorization (Convex):** `tasks.ts` (list, create, update, remove, toggleComplete, dueToday), `users.ts` (getCurrentUser, updateProfile, ensureProfile), `seed.ts` (seedTasksForNewUser), `analytics.ts` (completedPerWeek, priorityDistribution, productivityStreak) all require identity and scope by `userId`. Subscriptions now enforce same-user.
- **Input validation:** Convex validators used for mutation/query args; no raw string interpolation of user input in queries (e.g. `tasks.list` filters in memory after indexed query).
- **Sensitive data:** Passwords handled by Convex Auth; login/signup do not log or expose secrets. `console.error` in app is used for operational errors only (no secrets).
- **HTTP routes:** `convex/http.ts` only mounts Convex Auth HTTP routes; no custom endpoints that bypass auth.

## Recommendations

1. **Subscription webhook:** When adding a Stripe webhook, implement it as an HTTP action or internal mutation that validates the webhook signature and then updates subscriptions; do not allow clients to call `createOrUpdate` for arbitrary users (current fix limits to self; webhook should use an internal mutation).
2. **Middleware:** Revisit middleware when Convex Auth supports server-side session reading (e.g. Next.js adapter) and redirect unauthenticated users from protected paths.
3. **Invitations:** When creating invitation documents, use a high-entropy token (e.g. `crypto.randomUUID()` or Convex `Id`-like entropy) and consider rate limiting `getByToken` if it becomes public.
4. **Env:** Keep `JWT_PRIVATE_KEY`, `JWKS`, and `CONVEX_SITE_URL` in Convex dashboard env only; no `.env` with real secrets in repo.

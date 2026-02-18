# Development workflow: agents, rules, skills & browser testing

Use these in **Agent** or **Composer**. Rules and Skills apply when the context matches. Copy prompts as **Custom Instructions** or **Saved Chats** for repeatable workflows.

---

## Which agent is best for which

| Your goal | Best agent | Why |
|-----------|------------|-----|
| **Day-to-day code** (features, refactors, PR review, architecture) | **Principal Engineer** | Always-on rule; enforces standards, types, error handling, RSC vs client. |
| **Before release / after auth or backend changes** | **Security Audit** | Skill + rule on auth/Convex; finds auth, authz, and input issues. |
| **Before deploy / after env or deps changes** | **DevOps Audit** | Skill; checks build, Convex config, env, deps, deployment readiness. |
| **Before release / new UI or forms** | **Accessibility Audit** | Skill; code + optional browser; semantics, labels, focus, keyboard, Radix. |
| **Marketing or public pages** | **SEO Audit** | Skill; code + optional browser; metadata, headings, semantics. |
| **Live UI checks** (focus, headings, landmarks, meta tags) | **Accessibility** or **SEO** with a URL | Include `http://localhost:3000` (or your URL) so Browser MCP runs. |

**Short “which agent” guide:**
- **“Is this code good quality?”** → Principal Engineer  
- **“Is this safe to ship?”** → Security Audit  
- **“Can we deploy this?”** → DevOps Audit  
- **“Can everyone use this UI?”** → Accessibility Audit  
- **“Will this page be findable and well-rendered?”** → SEO Audit  

---

## Repeatable process: Rules, Commands, Skills, Browser

| Layer | What it is | How it runs | In this project |
|-------|------------|-------------|-----------------|
| **Rules** | Always-on or file-scoped guidance. | Cursor applies by **alwaysApply** or **globs**. | **Principal Engineer**: always. **Security Conventions**: only for `convex/auth*.ts`, `convex/**/*.ts`, `app/(auth)/**`, `middleware.ts`. |
| **Commands** | Saved prompts you run on demand. | You paste or invoke from Command Palette / Saved Chats. | Use the prompts below as Commands (e.g. “Run a full security audit”). |
| **Skills** | Step-by-step audit instructions. | Cursor uses when your **message matches the skill description**. | **security-audit**, **devops-audit**, **accessibility-audit**, **seo-audit** — trigger on “security audit”, “DevOps audit”, “accessibility audit”, “SEO audit”, etc. |
| **Browser testing** | Live checks in a real page. | You include a **URL** in the prompt; agent uses Browser MCP (e.g. `cursor-ide-browser`) to open and snapshot. | Only **Accessibility** and **SEO**; add URL when you want live checks (e.g. `http://localhost:3000`). |

**How to get the right agent:** Say clearly what you want (e.g. “Run a full security audit” or “Apply Principal Engineer standards to `tasks/page.tsx`”). For live UI checks, add the app URL to the Accessibility or SEO prompt.

---

## Optimized workflow (when to run what)

1. **Ongoing:** Principal Engineer mindset on every change (rule is always on).
2. **Before release:** Security Audit → then Accessibility (and SEO if you have public/marketing pages).
3. **Before deploy:** DevOps Audit (build, env, Convex, deps).
4. **After auth/backend changes:** Security Audit (and optionally narrow to specific files).
5. **New UI/form:** Accessibility Audit (code-only or with URL for browser check).
6. **New marketing page:** SEO Audit (code-only or with URL for live meta/headings).

---

## Prompts by agent

### Principal Engineer

**Best for:** Feature work, refactors, architecture, code review, naming, error handling, Server vs Client components.

**Prompt:**
```
Act as Principal Engineer for this Next.js + Convex app. Follow our standards: small focused components, strict TypeScript, explicit error handling, and Server Components by default. Review the current change and suggest improvements for maintainability and performance.
```

**Targeted:**
```
Apply Principal Engineer standards to [file or feature]. Check naming, error handling, and whether this should be a Server or Client Component.
```

**Rule:** `principal-engineer` (always applied). No Skill. No browser.

---

### Security Audit

**Best for:** Before release, after auth or Convex backend changes; finding auth, authz, and input issues.

**Prompt:**
```
Run a full security audit. Cover Convex auth and mutations, app auth routes, middleware, and any user input. Report Critical / High / Suggestions and concrete file references.
```

**Narrow:**
```
Security review only for [e.g. convex/auth.ts and convex/tasks.ts] — focus on auth and authorization checks.
```

**Rule:** `security-conventions` (globs: auth, Convex, app/(auth), middleware). **Skill:** `security-audit`. No browser.

---

### DevOps Audit

**Best for:** Before deploy, after adding env or dependencies; build, Convex config, env, deployment readiness.

**Prompt:**
```
Run a DevOps audit: build scripts, Convex config, env usage, dependencies, and deployment readiness. No real secrets in repo; use Convex env. Report findings with file references.
```

**Quick:**
```
DevOps check: verify package.json scripts and Convex deployment config. List any missing env or security concerns.
```

**Skill:** `devops-audit`. No Rule. No browser.

---

### Accessibility Audit

**Best for:** Before release or when adding new UI flows; semantics, labels, focus, keyboard, Radix.

**Prompt (code only):**
```
Run an accessibility audit. Check semantic HTML, form labels, focus, keyboard support, and Radix usage. Report Critical / Suggestions / Passed with file references.
```

**Prompt (with browser testing):**
```
Run an accessibility audit. First do a code review (semantics, labels, focus, keyboard). Then open [http://localhost:3000] in the browser, take a snapshot, and check heading order, landmarks, and focusable elements. Report findings and recommendations.
```

Replace the URL with your dev or staging URL. **Skill:** `accessibility-audit`. **Browser:** Yes when URL is in the prompt.

---

### SEO Audit

**Best for:** Marketing or public-facing pages; metadata, headings, semantics.

**Prompt (code only):**
```
Run an SEO audit. Check metadata (title, description) in layout and routes, heading hierarchy, and semantics. Report with file references.
```

**Prompt (with browser testing):**
```
Run an SEO audit. Review metadata and structure in code, then open [http://localhost:3000] in the browser and verify the rendered title, meta description, and h1 structure. Report findings and recommendations.
```

Replace with your dev or production URL. **Skill:** `seo-audit`. **Browser:** Yes when URL is in the prompt.

---

## Summary table (triggers, rules, skills, browser)

| Agent              | Primary trigger              | Rules                    | Skills            | Browser MCP   |
|--------------------|------------------------------|--------------------------|-------------------|---------------|
| Principal Engineer | Prompt above / “Apply Principal Engineer…” | principal-engineer (always) | —                 | No            |
| Security Audit     | “Run a full security audit”  | security-conventions (globs) | security-audit    | No            |
| DevOps Audit       | “Run a DevOps audit”         | —                        | devops-audit      | No            |
| Accessibility      | “Run an accessibility audit” [+ optional URL] | —       | accessibility-audit | Yes (if URL)  |
| SEO                | “Run an SEO audit” [+ optional URL] | —                  | seo-audit         | Yes (if URL)  |

**Browser:** Enable **Browser MCP** (e.g. `cursor-ide-browser`) in Cursor MCP settings so the agent can open and snapshot when you include a URL in Accessibility or SEO prompts.

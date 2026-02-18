# Optimized prompts for development workflow

Use these prompts in **Agent** or **Composer** to trigger the right behavior. Rules and Skills are applied automatically when the description matches. Copy, paste, and tweak as needed.

---

## Principal Engineer

**When to use:** General feature work, refactors, architecture decisions.

**Prompt:**
```
Act as Principal Engineer for this Next.js + Convex app. Follow our standards: small focused components, strict TypeScript, explicit error handling, and Server Components by default. Review the current change and suggest improvements for maintainability and performance.
```

**Optional (targeted):**
```
Apply Principal Engineer standards to [file or feature]. Check naming, error handling, and whether this should be a Server or Client Component.
```

---

## Security Audit

**When to use:** Before release, after auth changes, or when touching Convex backend.

**Prompt:**
```
Run a full security audit. Cover Convex auth and mutations, app auth routes, middleware, and any user input. Report Critical / High / Suggestions and concrete file references.
```

**Optional (narrow):**
```
Security review only for [convex/auth.ts and convex/tasks.ts] — focus on auth and authorization checks.
```

---

## DevOps Audit

**When to use:** Before deploy, after adding env or dependencies.

**Prompt:**
```
Run a DevOps audit: build scripts, Convex config, env usage, dependencies, and deployment readiness. No real secrets in repo; use Convex env. Report findings with file references.
```

**Optional:**
```
DevOps check: verify package.json scripts and Convex deployment config. List any missing env or security concerns.
```

---

## Accessibility Audit

**When to use:** Before release or when adding new UI flows.

**Prompt (code only):**
```
Run an accessibility audit. Check semantic HTML, form labels, focus, keyboard support, and Radix usage. Report Critical / Suggestions / Passed with file references.
```

**Prompt (with browser testing):**
```
Run an accessibility audit. First do a code review (semantics, labels, focus, keyboard). Then open [http://localhost:3000] in the browser, take a snapshot, and check heading order, landmarks, and focusable elements. Report findings and recommendations.
```

*Replace the URL with your dev or staging URL if different.*

---

## SEO Audit

**When to use:** For marketing or public-facing pages.

**Prompt (code only):**
```
Run an SEO audit. Check metadata (title, description) in layout and routes, heading hierarchy, and semantics. Report with file references.
```

**Prompt (with browser testing):**
```
Run an SEO audit. Review metadata and structure in code, then open [http://localhost:3000] in the browser and verify the rendered title, meta description, and h1 structure. Report findings and recommendations.
```

*Replace the URL with your dev or production URL.*

---

## Repeatable process summary

| Role              | Primary trigger        | Rules / Skills                    | Browser MCP      |
|-------------------|------------------------|-----------------------------------|------------------|
| Principal Engineer| Prompt above           | Rule: principal-engineer          | No               |
| Security Audit    | “Run a full security audit” | Rule: security-conventions (globs) + Skill: security-audit | No               |
| DevOps Audit      | “Run a DevOps audit”   | Skill: devops-audit               | No               |
| Accessibility     | “Run an accessibility audit” + optional URL | Skill: accessibility-audit  | Yes (if URL given) |
| SEO               | “Run an SEO audit” + optional URL | Skill: seo-audit           | Yes (if URL given) |

**Commands:** In Cursor you can save these as **Custom Instructions** or **Saved Chats** and reuse them. For true “Commands,” use Cursor’s command palette or saved prompts if your plan supports it.

**Browser testing:** Ensure **Browser MCP** (e.g. `cursor-ide-browser`) is enabled in Cursor MCP settings so the agent can navigate and snapshot when you include a URL in the Accessibility or SEO prompts.

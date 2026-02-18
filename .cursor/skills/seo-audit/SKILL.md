---
name: seo-audit
description: Runs an SEO audit using code review and optional browser inspection. Use when the user asks for an SEO audit, meta tags check, or search engine optimization review.
---

# SEO Audit

## Approach
1. **Code review**: Check metadata, structure, and semantics in the codebase.
2. **Browser inspection** (when URL available): Use Browser MCP to load the page and verify rendered title, meta, and heading structure.

## Code checklist (always)

- **Metadata**: `app/layout.tsx` or per-route layout exports `metadata` (title, description) or generates it with `generateMetadata`.
- **Title**: Unique, descriptive `<title>` per meaningful route (e.g. dashboard, login, home).
- **Description**: Meta description present, under ~160 chars, and relevant to the page.
- **Headings**: Logical hierarchy (one h1 per page, then h2/h3); headings describe content.
- **URLs**: Clean, readable routes; avoid unnecessary query params for key content.
- **Semantics**: Use `<main>`, `<article>`, `<nav>` where appropriate; avoid div soup for main content.
- **Performance**: Next.js default optimizations (images, fonts) used; no blocking scripts in critical path.

## Browser check (when URL provided)

1. Navigate to the URL (e.g. `http://localhost:3000` or production).
2. Take a snapshot and/or inspect: document title, meta description, first heading (h1), and overall structure.
3. For multiple routes: repeat for home, main app, and key marketing pages if applicable.
4. Unlock when done.

If no URL is given, run the code checklist only and note: "Provide the app URL for a live meta/heading check."

## Output format

```markdown
# SEO Audit Report

## Summary
[Brief overview; note code-only vs code + browser]

## Code review
- **Critical**: [Missing or wrong metadata, broken structure]
- **Suggestions**: [Improvements]
- **Passed**: [What’s good]

## Live check** (if run)
- [Title, description, h1 and structure from browser]

## Recommendations
[Numbered, actionable items with file/route references]
```

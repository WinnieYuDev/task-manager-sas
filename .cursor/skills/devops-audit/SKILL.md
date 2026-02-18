---
name: devops-audit
description: Audits DevOps, deployment, and infrastructure for this project. Use when the user asks for a DevOps audit, deployment review, CI/CD check, or infrastructure review.
---

# DevOps Audit

## Scope
- `package.json` scripts, dependencies, and lockfile
- Convex config and deployment (e.g. `convex.json`, env)
- Next.js config, env files (templates only; never real secrets)
- CI/CD config if present (e.g. `.github/workflows/`, `.cursor/` or build scripts)

## Checklist

1. **Build & run**
   - [ ] `npm run build` and `npm run start` (or equivalent) succeed
   - [ ] No hardcoded secrets in repo; use env vars / Convex env
   - [ ] Node/package versions documented or pinned where it matters

2. **Convex**
   - [ ] Convex env vars used for keys/secrets (dashboard or CLI)
   - [ ] No dev-only credentials used in production config
   - [ ] Schema and indexes align with query patterns

3. **Dependencies**
   - [ ] No known critical vulnerabilities (e.g. `npm audit`)
   - [ ] Dev vs prod deps correctly split in `package.json`
   - [ ] Lockfile committed for reproducible installs

4. **Deployment**
   - [ ] Build and start commands suitable for target host (Vercel, etc.)
   - [ ] Env documented (e.g. README or `.env.example`) without real values

## Output format

```markdown
# DevOps Audit Report

## Summary
[Brief overview and overall health: Good / Needs attention / Critical]

## Findings
- **Critical**: [Blockers]
- **High**: [Important fixes]
- **Suggestions**: [Improvements]
- **Passed**: [What looks good]

## Recommendations
[Numbered, actionable items]
```

Reference specific files and line numbers where relevant.

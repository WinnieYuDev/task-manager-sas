---
name: security-audit
description: Runs a security audit for auth, API, and data handling. Use when the user asks for a security audit, security review, penetration check, or when reviewing authentication, authorization, or Convex backend code.
---

# Security Audit

## Scope
- Convex: `convex/auth*.ts`, `convex/*.ts` (mutations/queries), `convex/schema.ts`
- App: `app/(auth)/**`, `middleware.ts`, env usage, any user input handling

## Checklist (run in order)

1. **Authentication & sessions**
   - [ ] No tokens or secrets in logs, errors, or client payloads
   - [ ] Session/auth checks happen server-side (Convex) for sensitive operations
   - [ ] No auth bypass via missing or weak checks in mutations/queries

2. **Authorization**
   - [ ] Every mutation/query that touches user data verifies identity (e.g. `ctx.auth.getUserIdentity()`)
   - [ ] Row-level checks: users can only read/write their own or permitted data

3. **Input validation**
   - [ ] Convex validators used for all mutation/query args
   - [ ] No raw string interpolation of user input in queries or HTTP calls
   - [ ] Env vars and config validated before use

4. **Sensitive data**
   - [ ] No PII or secrets in client bundles or public responses
   - [ ] Passwords/secrets never logged or stored in plain text

## Output format

```markdown
# Security Audit Report

## Summary
[1–2 sentence overview and risk level: Low / Medium / High / Critical]

## Findings
- **Critical**: [Must fix before release]
- **High**: [Fix soon]
- **Suggestions**: [Improvements]
- **Passed**: [Items that are in good shape]

## Recommendations
[Numbered, actionable steps]
```

Keep findings concrete (file/function and exact issue). One finding per bullet.

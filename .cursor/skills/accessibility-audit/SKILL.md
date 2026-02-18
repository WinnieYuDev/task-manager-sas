---
name: accessibility-audit
description: Runs an accessibility (a11y) audit via code review and optional browser testing. Use when the user asks for an accessibility audit, a11y check, WCAG review, or screen reader compatibility. Trigger phrases: "accessibility audit", "a11y", "WCAG", "screen reader", "focus and keyboard", "semantic HTML and labels". If a URL is provided, include browser snapshot checks.
---

# Accessibility Audit

## Approach
1. **Code review**: Check components and markup for a11y patterns.
2. **Browser testing** (when app URL is available): Use Browser MCP to open the app, take a snapshot, and verify focus, labels, and structure.

## Code checklist (always)

- **Semantic HTML**: Use `<button>`, `<nav>`, `<main>`, `<header>`, landmarks; avoid divs for interactive elements.
- **Forms**: Every input has a visible `<label>` (or `aria-label`/`aria-labelledby`); errors linked with `aria-describedby`.
- **Focus**: Interactive elements are focusable; no `tabIndex={-1}` without a good reason; focus order is logical.
- **Keyboard**: All actions available via keyboard; no keyboard traps in modals/dialogs.
- **Radix components**: Use Radix primitives as intended (they expose a11y); verify custom overlays have focus management and escape.
- **Color & contrast**: Don’t rely on color alone; sufficient contrast for text (aim for WCAG AA).
- **Images**: Decorative images have `alt=""`; meaningful images have descriptive `alt`.

## Browser testing (when URL provided)

1. Navigate to the given URL (e.g. `http://localhost:3000` or deployed URL).
2. Lock browser, then take a snapshot.
3. Check: focusable elements, heading hierarchy (h1 → h2…), landmarks, form labels, button/link text.
4. If testing flows: navigate through key flows (e.g. login, add task) and snapshot after key steps.
5. Unlock when done.

If the user does not provide a URL, run the code checklist only and note: "Run again with the app URL for live browser checks."

## Output format

```markdown
# Accessibility Audit Report

## Summary
[Overview; note if browser testing was used or code-only]

## Code review
- **Critical**: [Blocking a11y issues]
- **Suggestions**: [Improvements]
- **Passed**: [What’s good]

## Browser check** (if run)
- [Findings from snapshot/navigation]

## Recommendations
[Numbered, actionable items; include file/component where relevant]
```

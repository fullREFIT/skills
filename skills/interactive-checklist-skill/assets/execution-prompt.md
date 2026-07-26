# Interactive Checklist / Task Tracker — Execution Prompt

**What this is:** A reusable prompt that transforms any task list, checklist, action item list, or runbook into a production-quality interactive web app in a single self-contained HTML file. Paste this prompt into any Claude conversation, then paste or attach your content below the `## MY CONTENT` section.

**Companion document:** Interactive Checklist Web App Specification v1.0 (contains the full component spec, state management patterns, failure modes, and QA checklist).

---

## THE PROMPT

```
Build an interactive checklist web app from the content below. Output a single self-contained HTML file with all CSS and JS inline. No React, no JSX, no build step. This file must work when dragged directly into Vercel for deployment.

## PRIORITY ORDER

1. **Every item present.** Every task, checklist item, or action item from the source content must appear in the output. Do not truncate, summarize, or omit items. If the source has 42 tasks, the artifact has 42 task cards. If an item has 6 sub-steps, all 6 render.

2. **Functional interactivity.** Checkboxes work. Accordions toggle independently (multi-open — opening one NEVER closes another). Notes persist for the session. Export generates valid markdown with both completion state and notes. Copy buttons copy the right content.

3. **Visual quality.** The app should look excellent — but never at the expense of completeness or functionality.

## ARCHITECTURE

### Task Cards
Each item renders as an expandable task card:
- **Collapsed:** Checkbox + title + status badge (ON DECK / COMPLETE) + category badge + effort badge + HAS NOTES badge (gold, visible only when notes exist) + chevron
- **Expanded:** Description + prerequisite callout (amber box, if dependencies exist) + step-by-step instructions + code blocks with copy buttons + notes textarea
- **Checked state:** Title strikethrough, muted color, green left border, badge switches to COMPLETE, opacity 0.85

### Accordions
- Multi-open: every card toggles independently. Opening one NEVER closes another.
- Checkbox clicks do NOT trigger accordion toggle (use stopPropagation on checkbox).
- Expand All / Collapse All buttons scope to the active tab only.

### Tabs (if 9+ items)
- Group items by execution context (where the work happens), not by topic.
- Each tab shows completion count: "Infrastructure (3/6)"
- Final tab is always "Export" — dedicated view for markdown export.
- All tab panels stay in the DOM (toggle visibility, don't destroy/recreate).

### Notes
- Every task card has a `<textarea>` in its expanded detail.
- Task-specific placeholder text (not generic "Add notes...").
- "HAS NOTES" gold badge appears on collapsed cards with non-empty notes.
- Global notes count in hero stats bar.
- Notes debounce at 600ms before updating state/UI.

### Markdown Export
The Export tab contains:
1. **Generate Export** button → renders markdown in a `<pre>` preview area
2. **Copy to Clipboard** button → copies to clipboard with toast notification
3. **Download .md** button → downloads with timestamped filename

Export format includes:
- Header with timestamp and completion percentage
- Task status by category (preserving tab grouping)
- Each task: checkbox marker `[x]`/`[ ]` + title + detail line + notes
- Bottom section: "Summary for AI Task Tracker" with two clean lists — Completed and Outstanding — structured for LLM consumption

### Hero Header
- Dark background (Forge Dark or equivalent)
- Section label (mono, uppercase, accent color)
- H1: Checklist title
- Meta line: "[N] tasks total · [X] complete, [Y] on deck"
- Stats bar: Complete | On Deck | Progress % | Notes count
- Progress bar: 6px, accent fill, green at 100%

### Code Blocks
- Every `<pre><code>` gets a copy button — NO EXCEPTIONS
- Dark background (#1a1817), JetBrains Mono, horizontal scroll
- Copy button: top-right, icon swap to ✓ for 2 seconds
- Always visible on touch devices

## DESIGN SYSTEM: CARBON FORGE

Apply the full/REFIT Carbon Forge visual identity:

- **Palette:** Carbon Core #121010, Forge Red #D43B2A, Forge Gold #FFB400, Forge Dark #333130, Ash White #F2F0EE, Pure White #FFFFFF, Echo #878E88, Soft Gray #E5E3E0, Success #2d8a4e
- **Typography:** Outfit (400/600/700) for body and headings. JetBrains Mono (400/600/700) for labels, badges, code, data. No italics.
- **Section labels:** JetBrains Mono, 11px, 600 weight, UPPERCASE, 0.12em tracking, Forge Red
- **Layout:** Ash White canvas, Pure White card surfaces, max-width 900px. No gradients. Max border-radius 6px.
- **No emojis** as design system. Use badges, borders, and typography.

## STATE MANAGEMENT

Single state object in JavaScript:
```javascript
const state = {
  checked: {},        // { taskId: true/false }
  notes: {},          // { taskId: "note text" }
  open: {},           // { taskId: true/false }
  activeTab: 'tab1',
  hideComplete: false
};
```

- Default: in-memory only (no browser storage APIs).
- Include a commented-out localStorage persistence layer that can be activated for Vercel deployment.
- Every user action updates the state object → re-renders affected UI elements.

## CONTENT ORDERING

Group items by execution context, not source document order:
- Terminal / CLI tasks together
- Dashboard / web UI tasks together
- Manual / browser tasks together

Within each group, preserve the original item numbering for cross-reference consistency.

## SECURITY

If the source content contains API keys, tokens, secrets, or credentials:
- Replace values with `$ENV_VAR` references or 1Password retrieval commands
- Show credential names and types, never values
- Do not mention the redaction unless asked

## ACCESSIBILITY

- Skip link as first `<body>` element
- `lang="en"` on `<html>`
- Single `<h1>` in hero, logical heading hierarchy
- `:focus-visible` with 3px accent outline
- `aria-expanded` on accordion triggers
- `aria-label` on copy buttons
- `prefers-reduced-motion` respected
- 44×44px minimum touch targets

## RESPONSIVE

- No horizontal page scroll at any viewport width
- Stats bar wraps with flex-wrap
- Code blocks scroll internally (overflow-x: auto on pre)
- Card grids collapse to single column below 640px
- Tab bar horizontally scrollable on mobile

## PRINT STYLES

- Remove dark backgrounds, toolbar, tabs, copy buttons
- Force all accordions open
- Code blocks get light background

## WHAT NOT TO DO

- Do not use localStorage or sessionStorage (artifact context). Include the commented-out persistence layer for Vercel.
- Do not build single-open accordions. Multi-open is mandatory.
- Do not center body text. Left-align everything except hero heading and stat numbers.
- Do not use purple gradients, Inter/Roboto fonts, or uniform border-radius.
- Do not render actual API keys, tokens, or secrets.
- Do not silently drop items that won't fit. Flag the issue and offer options.
- Do not create JSX files. Output must be self-contained HTML.
- Do not use window.storage (Claude artifact API) — it doesn't work on deployed sites.

## TOKEN BUDGET

If the source content would produce >2500 lines of HTML:
1. State the estimated size
2. Offer options: priority render (full detail for high-priority items, summary cards for rest), split artifacts, or multi-file recommendation
3. Never silently truncate

## DELIVERY

1. The complete, working HTML file
2. 2-3 sentences on architecture decisions: tab grouping rationale, what you reordered and why, any content too large to include
3. Note any security redactions only if they affect usability
4. End with: "This artifact is ready. Use **Publish and Share** to generate a link, or copy the source to host anywhere. For Vercel deployment, uncomment the localStorage persistence layer in the script section."

---

## MY CONTENT

[Paste or attach your content here. Any format works — markdown, plain text, bullet points, structured task list, or a full runbook. Include for each item: title, description, any sub-steps, estimated effort, category/context, and dependencies. If items don't have all fields, the builder will work with what's available.]
```

---

## USAGE NOTES

**To use this prompt:**
1. Copy everything inside the code fence above.
2. Paste into any Claude conversation (works in any project, not just the Content → Web Artifact Engine).
3. Replace `[Paste or attach your content here...]` with your task list content.
4. The output is a production-ready HTML file.

**What this prompt handles that the Universal Web Artifact Execution Prompt doesn't:**
- Per-item notes textareas with "HAS NOTES" badge system
- Structured markdown export designed for both human review and LLM consumption
- Checkbox state management with progress tracking
- Multi-open accordion behavior (hard requirement, not a suggestion)
- Tab grouping by execution context
- Commented-out localStorage persistence layer for Vercel deployment
- Debounced note editing (600ms)

**What this prompt does NOT handle:**
- Persistent state across devices (requires Supabase backend)
- Dynamic task lists (adding/removing items requires editing the HTML and redeploying)
- Real-time collaboration (requires WebSocket backend)
- Email notifications on completion (requires n8n webhook)

**When to use this vs. the Universal Web Artifact Execution Prompt:**
- **This prompt:** Content that is fundamentally a checklist, task list, action item list, or step-by-step procedure with completion tracking.
- **Universal prompt:** Content that is a document, report, guide, or reference that happens to contain some checklist elements. The Universal prompt will add checkboxes where appropriate, but its primary concern is information architecture. This prompt's primary concern is task completion tracking with notes and export.

**Upgrade path from this prompt:**
If the checklist needs persistent state, dynamic items, or multi-device sync, the next step is a multi-file Next.js app with Supabase backend. This prompt's output serves as the UI prototype — the component structure, state shape, and export format translate directly into React components with a Supabase persistence layer.

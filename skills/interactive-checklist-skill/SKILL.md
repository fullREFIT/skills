---
name: interactive-checklist-skill
description: "Build interactive checklist, task tracker, and action item web apps as self-contained HTML files. Outputs single-file HTML with inline CSS and JS, deployable to Vercel via drag-and-drop. Features include multi-open accordions, per-item notes with HAS NOTES badges, structured markdown export for LLM consumption, checkbox state management with progress tracking, tabbed navigation by execution context, copy-to-clipboard on all code blocks,  MANDATORY TRIGGERS: checklist, task tracker, action items, task list, to-do list, runbook tracker, step tracker, interactive checklist, checklist web app, task tracker app."
---

# Interactive Checklist Skill

Build production-quality interactive checklist web apps from task lists, action items, runbooks, or step-by-step procedures. Every output is a single self-contained HTML file with all CSS and JS inline — no build step, no framework, deployable to Vercel via drag-and-drop.

## Table of Contents

1. [When to Use](#when-to-use)
2. [Quick Start Workflow](#quick-start-workflow)
3. [Architecture Decision Tree](#architecture-decision-tree)
4. [Core Components](#core-components)
5. [Design System](#design-system)
6. [State Management](#state-management)
7. [Security](#security)
8. [Quality Gate](#quality-gate)
9. [Bundled Resources](#bundled-resources)

---

## When to Use

Use this skill when the source content is fundamentally a checklist, task list, action item list, or step-by-step procedure with completion tracking. The primary concern is task completion tracking with notes and export.

For content that is a document, report, guide, or reference that happens to contain some checklist elements, use the Universal Web Artifact Execution Prompt instead — its primary concern is information architecture.

**Input:** Any format — markdown, plain text, bullet points, structured task list, or full runbook.

**Output:** A single `.html` file with all CSS and JS inline. No external dependencies except Google Fonts (Outfit + JetBrains Mono).

---

## Quick Start Workflow

```
STEP 1: ANALYZE
  Read source content. Count items. Assess per-item complexity.
  Read references/component-spec.md for component details.
  ↓
STEP 2: DECIDE ARCHITECTURE
  Use the Architecture Decision Tree below to determine:
  - Tab count and grouping strategy
  - Card complexity (simple / medium / rich)
  - Persistence model (in-memory vs. localStorage)
  ↓
STEP 3: BUILD
  Read references/design-tokens.md for exact CSS values.
  Read assets/execution-prompt.md for the inline prompt template.
  Build the complete HTML file.
  ↓
STEP 4: VERIFY
  Run the Quality Gate checklist below.
  Read references/failure-modes.md to check for known anti-patterns.
  ↓
STEP 5: DELIVER
  Present the HTML file. Note architecture decisions in 2-3 sentences.
  End with: "This artifact is ready. Use Publish and Share to generate
  a link, or copy the source to host anywhere."
```

---

## Architecture Decision Tree

### Question 1: Where will this run?

| Context | Format | Persistence |
|---------|--------|-------------|
| Claude artifact preview | Self-contained HTML | In-memory JS only. No localStorage. |
| Vercel drag-and-drop | Self-contained HTML | localStorage. All state survives reloads. |
| Vercel with build step | Multi-file React | Supabase or localStorage for cross-device sync. |

**Default:** Build for Claude artifact context (in-memory only). Include a commented-out localStorage persistence layer in the script section.

### Question 2: How many items?

| Count | Tab Strategy |
|-------|-------------|
| 1–8 | No tabs. Single list with Expand All / Collapse All. |
| 9–20 | 2–4 content tabs by execution context + 1 Export tab. |
| 21–50 | 3–6 tabs with per-tab progress, global progress bar, Hide Completed toggle. |
| 50+ | Recommend multi-file deployment. |

### Question 3: Per-item complexity?

| Complexity | Rendering |
|-----------|-----------|
| Simple (title only) | Flat checkbox list, no accordion. |
| Medium (title + detail + code) | Accordion card with expand/collapse. |
| Rich (steps + code + prerequisites + notes) | Full task card per [`references/component-spec.md`](references/component-spec.md). |

---

## Core Components

### Task Card

The atomic unit. Two states: collapsed and expanded.

**Collapsed:** Checkbox + title + status badge (ON DECK / COMPLETE) + category badge + effort badge + HAS NOTES badge (gold, visible only when notes exist) + chevron indicator.

**Expanded adds:** Description, prerequisite callout (amber box), step-by-step instructions, code blocks with copy buttons, notes textarea.

**Checked state:** Title strikethrough, muted color, green left border, badge changes to COMPLETE, card opacity 0.85.

For full component anatomy including CSS, see [`references/component-spec.md`](references/component-spec.md).

### Accordion Behavior

**Multi-open is mandatory.** Every card toggles independently. Opening one NEVER closes another. Checkbox clicks must NOT trigger the accordion (use `stopPropagation`).

### Toolbar

Sticky below hero. Contains: Expand All, Collapse All, Hide Completed toggle, Export to Markdown button. Expand/Collapse scope to active tab only.

### Tab Navigation

Group items by execution context (where the work happens), not by topic. Each tab shows completion count: `"Infrastructure (3/6)"`. Final tab is always "Export". All tab panels stay in DOM — toggle visibility, never destroy/recreate.

### Notes System

Every task card has a `<textarea>`. Notes debounce at 600ms. "HAS NOTES" gold badge visible on collapsed cards with content. Global notes count in hero stats.

### Markdown Export

Dedicated Export tab with three buttons: Generate Export, Copy to Clipboard, Download .md. Export format structured for both human review and LLM orchestrator consumption — includes "Summary for AI Task Tracker" section with Completed/Outstanding split lists.

For the full export format specification, see [`references/component-spec.md`](references/component-spec.md).

### Hero Header

Dark background. Section label (mono, uppercase, accent). H1 title. Meta line with total/complete/on-deck counts. Stats bar: Complete, On Deck, Progress %, Notes count. Progress bar: 6px, accent fill, green at 100%.

### Code Blocks

Every `<pre><code>` gets a copy button — no exceptions. Dark background (#1a1817), JetBrains Mono, horizontal scroll. Copy button: top-right, icon swap to checkmark for 2 seconds. Always visible on touch devices.

---

## Design System

### Default Design System (Carbon Forge tokens)

Read [`references/design-tokens.md`](references/design-tokens.md) for the complete CSS custom properties, typography scale, badge taxonomy, and component patterns.

Key constraints:
- Palette: Carbon Core #121010, Forge Red #D43B2A, Forge Gold #FFB400, Forge Dark #333130, Ash White #F2F0EE, Pure White #FFFFFF, Echo #878E88, Soft Gray #E5E3E0
- Typography: Outfit (400/600/700) + JetBrains Mono (400/600/700). No italics.
- No gradients. Max border-radius 6px. No emojis as design system.
- Never use Forge Gold as text on light backgrounds (1.8:1 contrast — WCAG fail).

### Non-branded builds

Use the same token structure with a different palette. The component patterns work with any color system — swap the CSS variables.

---

## State Management

Single JavaScript object:

```javascript
const state = {
  checked: {},        // { taskId: true/false }
  notes: {},          // { taskId: "note text" }
  open: {},           // { taskId: true/false }
  activeTab: 'tab1',
  hideComplete: false
};
```

Every user action updates `state` then re-renders affected UI. Default: in-memory only. Include commented-out localStorage layer for Vercel deployment.

---

## Security

If the source content contains credentials, API keys, tokens, or secrets:
- Replace actual values with `$ENV_VAR` references or 1Password retrieval commands
- Show credential names and types, never values
- Do not mention the redaction unless asked

---

## Quality Gate

Run before every delivery. Read [`references/failure-modes.md`](references/failure-modes.md) for detailed anti-patterns.

### Critical
- [ ] Self-contained HTML — no external dependencies except Google Fonts
- [ ] No actual secrets, API keys, or tokens in output
- [ ] Single `<h1>` in hero. No heading level skips.
- [ ] Every `<pre><code>` has a copy button
- [ ] Checkbox clicks don't trigger accordion toggles
- [ ] State managed in-memory (artifact) or localStorage (Vercel) — never window.storage
- [ ] Export generates valid markdown with completion state and notes
- [ ] No horizontal scroll at 375px

### High Priority
- [ ] Multi-open accordion — opening one NEVER closes another
- [ ] HAS NOTES badge shows/hides correctly
- [ ] Progress bar and stats update on every checkbox change
- [ ] Tab counts update dynamically
- [ ] Expand All / Collapse All scope to active tab
- [ ] Skip link, `:focus-visible`, `prefers-reduced-motion`, `aria-expanded`
- [ ] Google Fonts loaded (not system defaults)
- [ ] Colors as CSS custom properties

### Medium Priority
- [ ] Hover states on all interactive elements
- [ ] Copy button visual feedback (icon swap + revert)
- [ ] Touch devices: copy buttons always visible
- [ ] Print styles expand accordions, hide interactive chrome

---

## Bundled Resources

| File | Purpose | When to Load |
|------|---------|-------------|
| [`references/component-spec.md`](references/component-spec.md) | Full component anatomy: task card states, accordion JS, toolbar, tabs, notes system, markdown export format, hero, code blocks, badge taxonomy | Every build — core reference |
| [`references/design-tokens.md`](references/design-tokens.md) | Complete CSS custom properties, typography scale, badge styles, responsive breakpoints, print styles, accessibility requirements | Every build — design reference |
| [`references/failure-modes.md`](references/failure-modes.md) | Known anti-patterns from production builds with symptoms and fixes | Quality gate — pre-delivery check |
| [`assets/execution-prompt.md`](assets/execution-prompt.md) | Self-contained execution prompt template for paste-and-go use | When user needs a standalone prompt |

---

*Interactive Checklist Skill v1.0 — April 2026*
*Conformant to agentskills.io open standard (December 2025)*
*Lineage: 4 production builds (March–April 2026) encoding lessons from React JSX, window.storage, localStorage, and in-memory state iterations.*

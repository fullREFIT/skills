---
name: web-app-builder
description: >-
  Convert one or more markdown files into a single-file HTML web application
  using the default design system (Carbon Forge). Handles full content analysis (format
  selection, interface pattern selection), responsive rendering (collapsible
  sections, tabs, sidebar navigation, interactive checklists, code blocks with
  copy buttons, styled tables, callout boxes), and single-file HTML output
  (all CSS and JS inline, no build step, no frameworks). Outputs are
  browser-ready HTML files. MANDATORY TRIGGERS: web app from markdown,
  markdown to HTML, convert markdown, web app builder, web app,
  single-file app, HTML from docs, interactive docs, doc viewer, markdown
  viewer, documentation site, web app from docs, build me a web app.
---

# Web App Builder

Convert one or more markdown files into a single-file, browser-ready HTML web application using the default design system (Carbon Forge). No build step, no frameworks, no external dependencies beyond Google Fonts.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Production Workflow](#production-workflow)
3. [Phase 1: Content Analysis](#phase-1-content-analysis)
4. [Phase 2: Content Rendering Rules](#phase-2-content-rendering-rules)
5. [Phase 3: Carbon Forge Design System](#phase-3-carbon-forge-design-system)
6. [Phase 4: Technical Requirements](#phase-4-technical-requirements)
7. [Phase 5: Output](#phase-5-output)
8. [Quality Verification](#quality-verification)
9. [Bundled Resources](#bundled-resources)

---

## Prerequisites

**Input:** One or more markdown files (or markdown content pasted directly).

**Output:** A single `.html` file with all CSS and JS inline. No external dependencies except Google Fonts (Outfit + JetBrains Mono).

**Brand system:** default design system (Carbon Forge) embedded in this skill — see [`references/carbon-forge-design-system.md`](references/carbon-forge-design-system.md) for complete token reference and component patterns.

---

## Production Workflow

```
STEP 1: CONTENT ANALYSIS
  Input:  Markdown file(s)
  Output: Interface pattern decision + content type classification
  ↓
STEP 2: CONTENT RENDERING
  Input:  Classified content
  Output: Rendered HTML sections (code, tables, checklists, callouts)
  ↓
STEP 3: DESIGN APPLICATION
  Input:  Rendered sections
  Output: Carbon Forge-styled HTML (CSS variables, components)
  ↓
STEP 4: ASSEMBLY
  Input:  Styled sections
  Output: Single HTML file (inline CSS + JS)
  ↓
STEP 5: VERIFY
  Input:  HTML file
  Output: Pass/fail against quality checklist
```

---

## Phase 1: Content Analysis

Before writing any code, analyze the provided markdown file(s) and determine:

1. **File count and relationship.** Are these independent documents, sequential parts of one topic, or a hierarchy (parent + children)?
2. **Content type per file.** Classify each: reference guide, runbook/checklist, tutorial, analysis/report, specification, framework, mixed.
3. **Structural elements present.** Scan for: numbered steps, checklists, code blocks, tables, nested headings, metadata blocks, callouts/warnings, definition lists.

Then select the interface pattern:

| Signal | Pattern |
|--------|---------|
| 1 file, short-to-medium | Single-page with collapsible sections |
| 1 file, long/complex | Single-page with sidebar navigation + collapsible sections |
| 2–5 files, independent topics | Tabbed interface, one tab per file |
| 2–5 files, sequential/related | Tabbed interface with shared progress or navigation |
| 6+ files | Sidebar navigation with content panel |
| Files with clear parent-child hierarchy | Sidebar tree navigation |
| Checklist/runbook content detected | Add per-item checkboxes, progress tracking, completion states |

State your format decision and reasoning in a brief comment at the top of the output HTML before the `<!DOCTYPE>`.

For detailed pattern implementations, read [`references/interface-patterns.md`](references/interface-patterns.md).

---

## Phase 2: Content Rendering Rules

### Disclosure Behavior — Critical

All collapsible/expandable sections use **explicit toggle controls**:

- **Default state:** All expandable content starts COLLAPSED on page load.
- **Independent operation:** Every toggle is independent. Opening one section NEVER closes another.
- **Sticky state:** Once expanded, a section stays expanded until the user explicitly collapses it.
- **Bulk controls:** Provide "Expand All" / "Collapse All" buttons at the top of each page/tab.
- **Implementation:** Use `<details>` elements with JS-controlled `open` attribute, or custom toggle components. Never use CSS-only `:target` or radio-button accordion patterns.

### Heading-to-Section Mapping

- **H1** → Page/tab title (not collapsible)
- **H2** → Top-level collapsible sections with toggle controls
- **H3** → Nested collapsible subsections within their parent H2
- **H4+** → Rendered inline within their parent section (not independently collapsible)

### Content Element Rendering

**Code blocks:**
- Syntax-highlighted using inline CSS classes (no external highlight.js)
- Every code block gets a "Copy" button in the top-right corner
- Copy button shows "Copied ✓" feedback for 1.5 seconds, then reverts
- Use JetBrains Mono for all code rendering

**Checklists / Numbered Steps — Default behavior (always on unless user explicitly asks to disable):**
- Render as interactive checkboxes when content contains step-by-step instructions, task lists, or items prefixed with `- [ ]`
- Checked items get subtle strikethrough and opacity reduction (not hidden — still readable, still uncheckable)
- Show a progress indicator (fraction + bar) per section with checkable items
- "Reset All" button per section to uncheck all items
- **Notes field (always included):** Every checklist section includes a "Notes" textarea below the task list. Auto-grows as user types. Stores session notes tied to that section.
- **"Extract Markdown" button (per tab):** Appears at the bottom of every tab panel (or page footer for single-page layouts). Opens a modal with a formatted markdown summary of all tasks in that tab/page — checked state (`- [x]` / `- [ ]`), progress counts, and any notes entered. Modal has a "Copy to Clipboard" button for pasting directly into Claude Code.
- **"Export Session Recap" button (global):** Placed in the app header. Collects task state, progress, and notes from ALL tabs/sections simultaneously and produces one combined markdown document. Enables full-session handoff to Claude Code in a single click.

**Tables:**
- Render as styled HTML tables with alternating row backgrounds
- Horizontally scrollable on narrow viewports
- Header row is sticky when the table is tall

**Callouts / Admonitions:**
- `> ⚠️` or `> WARNING` or `> CAUTION` → amber callout
- `> ✅` or `> NOTE` or `> TIP` → green callout
- `> ❌` or `> ERROR` or `> DANGER` → red callout
- `> ℹ️` or `> INFO` → blue-gray callout
- All other blockquotes → neutral block with Forge Red left border

**Metadata blocks:**
- YAML frontmatter or structured `key: value` sections → compact info bar at top of that file's view

For complete rendering patterns and HTML/CSS examples, read [`references/content-rendering-guide.md`](references/content-rendering-guide.md).

---

## Phase 3: Carbon Forge Design System

Apply these tokens exactly. No substitutions, no "close enough." See [`references/carbon-forge-design-system.md`](references/carbon-forge-design-system.md) for the full CSS reference.

### Palette

| Token | Hex | CSS Variable | Role |
|-------|-----|-------------|------|
| Carbon Core | `#121010` | `--carbon-core` | Text, deepest dark |
| Forge Red | `#D43B2A` | `--forge-red` | CTAs, action, primary accent |
| Forge Gold | `#FFB400` | `--forge-gold` | Highlights, secondary accent |
| Forge Dark | `#333130` | `--forge-dark` | Dark section backgrounds |
| Ash White | `#F2F0EE` | `--ash-white` | Page canvas background |
| Pure White | `#FFFFFF` | `--pure-white` | Card/panel surfaces |
| Echo | `#878E88` | `--echo` | Secondary text, metadata |
| Soft Gray | `#E5E3E0` | `--soft-gray` | Borders, dividers |

### Typography

- **Primary:** Outfit (Google Fonts) — headings weight 700, body weight 400
- **Monospace:** JetBrains Mono (Google Fonts) — code, labels weight 600, metrics weight 700
- **No italics** anywhere
- Section labels: JetBrains Mono, 600 weight, 0.6875rem, UPPERCASE, letter-spacing 0.12em, Forge Red color
- Body: Outfit 400, 0.875–1rem, line-height 1.6

### Component Patterns

- **Cards/Panels:** Pure White background, 1px Soft Gray border, 0.75rem border-radius, 1.75rem padding
- **Primary buttons:** Forge Red background, white text, 0.5rem radius, weight 600. Hover: darken to `#b8301f`
- **Secondary buttons:** Transparent background, Soft Gray border, Carbon Core text. Hover: Pure White fill
- **Tab active state:** Forge Red bottom border or Forge Red text
- **Tab badges:** JetBrains Mono, small, Forge Red background for status indicators
- **Progress bars:** Forge Red fill on Soft Gray track, rounded ends

### Accessibility Constraints

- **Never** use Forge Gold as text on light backgrounds (1.8:1 contrast ratio — WCAG fail)
- Carbon Core on Pure White: 16.5:1 (AAA)
- Forge Red on Pure White: 5.3:1 (AA)
- Echo on Pure White: 4.0:1 (AA)

---

## Phase 4: Technical Requirements

### Architecture

- **Single HTML file.** All CSS and JS inline. No external dependencies except Google Fonts.
- **State in JS memory only.** No localStorage, no sessionStorage, no cookies.
- **Responsive.** Must work from 375px mobile to 1440px+ desktop.
- **No frameworks.** Vanilla HTML, CSS, JS. No React, no Vue, no build step.

### Performance

- Lazy-render tab/section content only when first viewed (for apps with 4+ tabs or heavy content).
- Debounce any scroll-based listeners.
- Use CSS transitions for expand/collapse animations (200–300ms ease).

### Interactivity

- Keyboard accessible: Tab through interactive elements, Enter/Space to toggle, arrow keys for tab navigation.
- Scroll-to-top button appears when scrolled past 600px.
- Smooth scroll to section when navigating via sidebar or tab links.
- Print-friendly: `@media print` rules that expand all sections and remove interactive chrome.

---

## Phase 5: Output

Produce a single HTML file structured as:

```html
<!-- Format: [chosen pattern] | Files: [count] | Content types: [list] -->
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google Fonts, CSS variables, all styles inline -->
</head>
<body>
  <!-- Header with app title + "Export Session Recap" button (top-right) -->
  <!-- Navigation (tabs, sidebar, or none — based on format decision) -->
  <!-- Bulk expand/collapse controls -->
  <!-- Content panels with full rendering rules applied -->
  <!--   Each checklist section includes: tasks → notes textarea → extract button -->
  <!-- Each tab panel ends with "Extract Markdown" button -->
  <!-- Scroll-to-top button -->
  <!-- Markdown export modal (hidden by default, shown on extract) -->
  <!-- All JavaScript inline -->
</body>
</html>
```

**Content fidelity rule:** The markdown content must be rendered faithfully. Do not summarize, truncate, or omit any content. Every heading, paragraph, list item, code block, and table from the source must appear in the output.

---

## Quality Verification

Run this checklist against every output before delivery:

- [ ] Format decision comment at top of HTML file
- [ ] All content from source markdown present (nothing truncated)
- [ ] Carbon Forge palette exact — all 8 hex values, no substitutions
- [ ] No Forge Gold text on light backgrounds
- [ ] No italics anywhere
- [ ] All sections start collapsed on page load
- [ ] Expand All / Collapse All controls functional
- [ ] Each toggle is independent (opening one doesn't close others)
- [ ] Code blocks have Copy button with 1.5s feedback
- [ ] Interactive checkboxes present where applicable, with progress indicator
- [ ] Notes textarea present in every checklist section (auto-grows on input)
- [ ] "Extract Markdown" button at the bottom of each tab panel / page
- [ ] "Export Session Recap" button in the app header
- [ ] Markdown export modal opens with correct content when extract buttons are clicked
- [ ] Modal has "Copy to Clipboard" button that copies and shows "Copied ✓" feedback
- [ ] Exported markdown includes task state (- [x] / - [ ]), progress count, and notes
- [ ] Tables scroll horizontally on narrow viewports
- [ ] Callout types correctly matched (amber/green/red/blue-gray)
- [ ] Scroll-to-top button appears on scroll past 600px
- [ ] Keyboard accessible: Tab, Enter/Space, arrow keys functional
- [ ] Responsive at 375px, 768px, 1440px
- [ ] Single file — no external JS or CSS dependencies (only Google Fonts CDN)
- [ ] Print styles expand all sections and remove interactive chrome

For the full QA checklist in checkable format, read [`assets/qa-checklist.md`](assets/qa-checklist.md).

---

## Bundled Resources

| File | Purpose | When to Load |
|------|---------|-------------|
| [`references/carbon-forge-design-system.md`](references/carbon-forge-design-system.md) | Complete CSS custom properties, component patterns, typography scale, color tokens | Every build |
| [`references/interface-patterns.md`](references/interface-patterns.md) | Full HTML/CSS/JS implementations for each interface pattern (single-page, tabs, sidebar) | When building the interface structure |
| [`references/content-rendering-guide.md`](references/content-rendering-guide.md) | Complete rendering implementations for code blocks, checklists, tables, callouts, metadata | When rendering specific content element types |
| [`assets/qa-checklist.md`](assets/qa-checklist.md) | Full interactive quality checklist | Before delivering any output |
| [`assets/output-template.html`](assets/output-template.html) | Starter HTML shell with Carbon Forge CSS variables and base structure pre-loaded | As a foundation for any build |
| [`scripts/validate_output.py`](scripts/validate_output.py) | Python script to validate HTML structure, check for required elements, and verify Carbon Forge tokens | Post-build validation |

---

*Web App Builder v1.1 — April 2026*
*Source: Carbon Forge Web App Builder — Universal Prompt*
*Conformant to agentskills.io open standard (December 2025)*

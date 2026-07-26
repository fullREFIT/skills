# QA Checklist — Web App Builder

Run this checklist before delivering any web app output. Every item must pass.

---

## Phase 1: Content Fidelity

- [ ] Format decision comment present at top of HTML file (`<!-- Format: ... | Files: ... | Content types: ... -->`)
- [ ] All source content present — no headings, paragraphs, list items, code blocks, or tables omitted
- [ ] Content not summarized or paraphrased — exact source text preserved
- [ ] YAML frontmatter or metadata blocks rendered as info bar (if present in source)

## Phase 2: Interface Pattern

- [ ] Interface pattern matches content analysis (single-page, sidebar, tabs, or tree)
- [ ] Bulk "Expand All" / "Collapse All" controls present at top of each page/tab
- [ ] All sections start COLLAPSED on page load
- [ ] Each toggle is independent — opening one section does NOT close others
- [ ] Toggle icon rotates 180° when section is open
- [ ] Sticky header present on sidebar/tab layouts
- [ ] Scroll-to-top button appears after scrolling 600px
- [ ] Smooth scroll to sections when using sidebar/tab navigation

## Phase 3: Content Element Rendering

### Code Blocks
- [ ] Every code block has a "Copy" button in top-right
- [ ] Copy button shows "Copied ✓" for 1.5 seconds then reverts
- [ ] Code rendered in JetBrains Mono
- [ ] Language label shown (or "code" if unknown)

### Checklists
- [ ] `- [ ]` items rendered as interactive checkboxes
- [ ] Checked items show strikethrough with reduced opacity (not hidden)
- [ ] Progress indicator (fraction + bar) shows per checklist section
- [ ] "Reset All" button present per checklist section
- [ ] Progress bar updates immediately on checkbox change
- [ ] Notes textarea present in every checklist section (below task list)
- [ ] Notes textarea auto-grows as user types (no scroll bar on short content)
- [ ] Notes textarea has correct `data-notes-for` attribute matching its checklist section

### Extract Markdown
- [ ] "Extract Markdown" button present at bottom of every tab panel (or page footer for single-page)
- [ ] "Export Session Recap" button present in app header (top-right)
- [ ] Clicking either button opens the markdown modal
- [ ] Modal title reflects the tab/section name correctly
- [ ] Modal textarea contains: all tasks with [x]/[ ] state, progress count, notes
- [ ] "Copy to Clipboard" button in modal copies content and shows "Copied ✓" for 2s
- [ ] Modal closes on "Close" button click
- [ ] Modal closes on Escape key press
- [ ] Modal closes on backdrop (dark overlay) click
- [ ] "Export Session Recap" captures ALL tabs/sections, not just the active one
- [ ] Exported markdown uses `- [x]` for completed and `- [ ]` for incomplete tasks
- [ ] Exported markdown includes `**Progress:**` line per section
- [ ] Exported markdown includes `**Notes:**` block only when notes are non-empty

### Tables
- [ ] Alternating row backgrounds (Pure White / Ash White)
- [ ] Table scrolls horizontally on narrow viewports (not overflow: hidden)
- [ ] Header row has dark Carbon Core background
- [ ] Column headers use JetBrains Mono UPPERCASE

### Callouts
- [ ] `⚠️`/WARNING/CAUTION → amber callout
- [ ] `✅`/NOTE/TIP → green callout
- [ ] `❌`/ERROR/DANGER → red callout
- [ ] `ℹ️`/INFO → blue-gray callout
- [ ] Other blockquotes → neutral with Forge Red left border

## Phase 4: Carbon Forge Design System

### Colors
- [ ] `--carbon-core: #121010` used for text and deepest dark
- [ ] `--forge-red: #D43B2A` used for CTAs, accents, active states
- [ ] `--forge-gold: #FFB400` NOT appearing as text on light backgrounds
- [ ] `--ash-white: #F2F0EE` as page canvas background
- [ ] `--pure-white: #FFFFFF` as card/panel surfaces
- [ ] `--echo: #878E88` for secondary text
- [ ] `--soft-gray: #E5E3E0` for borders and dividers
- [ ] No default purple/indigo from other design systems present

### Typography
- [ ] Outfit font loaded from Google Fonts
- [ ] JetBrains Mono font loaded from Google Fonts
- [ ] NO italics anywhere — em/i render as font-weight: 600
- [ ] Section labels: JetBrains Mono, uppercase, Forge Red, 0.6875rem

### Components
- [ ] Card borders use Soft Gray, radius 0.75rem, padding 1.75rem
- [ ] Active tab indicated by Forge Red bottom border or text
- [ ] Progress bars use Forge Red fill on Soft Gray track

## Phase 5: Technical Requirements

- [ ] Single HTML file — all CSS and JS inline
- [ ] No external dependencies except Google Fonts CDN
- [ ] No localStorage / sessionStorage usage
- [ ] No frameworks (no React, Vue, etc.)
- [ ] Responsive: opens correctly at 375px, 768px, 1440px
- [ ] Keyboard accessible: Tab through all interactive elements
- [ ] Enter/Space toggles collapsible sections
- [ ] Arrow keys navigate between tabs
- [ ] Print media query expands all sections and removes interactive chrome
- [ ] HTML `lang="en"` attribute present
- [ ] `<main id="main-content">` present for skip link target
- [ ] Skip link present (`.skip-link`)
- [ ] ARIA attributes on tabs (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`)
- [ ] ARIA attributes on toggle buttons (`aria-expanded`, `aria-controls`)

## Phase 6: Visual Spot-Check

Open the HTML file in a browser and verify:

- [ ] Page background is Ash White (warm off-white, NOT pure white or gray)
- [ ] Cards sit on Ash White with visible Pure White contrast
- [ ] Headers/navigation areas use Carbon Core (deep black-brown), NOT #000000
- [ ] Forge Red appears on CTAs, active states, section labels — not orange, not dark red
- [ ] No purple, indigo, blue-gray as primary accent colors
- [ ] Fonts render as Outfit (rounded, humanist sans) — not system default
- [ ] Code fonts render as JetBrains Mono — not Courier

---

*QA Checklist v1.0 — April 2026*

# Default Design System — Web App Builder Reference

Complete CSS tokens, component patterns, and layout rules for the Carbon Forge design system as applied to single-file HTML web applications.

---

## CSS Custom Properties

Paste this `:root` block verbatim into every generated HTML file.

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@600;700&display=swap');

:root {
  /* Brand Palette */
  --carbon-core:   #121010;   /* Text, deepest dark */
  --forge-red:     #D43B2A;   /* CTAs, action, primary accent */
  --forge-red-hover: #b8301f; /* Forge Red darkened for hover */
  --forge-gold:    #FFB400;   /* Highlights — dark backgrounds ONLY */
  --forge-dark:    #333130;   /* Dark section backgrounds */
  --ash-white:     #F2F0EE;   /* Page canvas background */
  --pure-white:    #FFFFFF;   /* Card/panel surfaces */
  --echo:          #878E88;   /* Secondary text, metadata */
  --soft-gray:     #E5E3E0;   /* Borders, dividers */

  /* Typography */
  --font-primary: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', Consolas, monospace;

  /* Radius */
  --radius:    0.5rem;
  --radius-lg: 0.75rem;

  /* Spacing scale */
  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.75rem;
  --space-xl:  3rem;

  /* Layout */
  --max-width: 960px;
}
```

---

## Base Reset and Body

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--carbon-core);
  background-color: var(--ash-white);
}

/* CRITICAL: No italics in any element */
em, i, cite, address, dfn, var { font-style: normal; font-weight: 600; }

/* Accessibility: skip link */
.skip-link {
  position: absolute; top: -40px; left: 0;
  background: var(--forge-red); color: white;
  padding: 8px 16px; z-index: 100; text-decoration: none;
  font-family: var(--font-primary);
}
.skip-link:focus { top: 0; }

/* Focus indicator */
:focus-visible { outline: 3px solid var(--forge-red); outline-offset: 2px; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Typography Scale

```css
h1 {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--carbon-core);
}

h2 {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--carbon-core);
}

h3 {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 1.4;
  color: var(--carbon-core);
}

h4, h5, h6 {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1rem;
  color: var(--carbon-core);
}

p, li {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  line-height: 1.6;
}

/* Section label — JetBrains Mono, UPPERCASE, Forge Red */
.section-label {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--forge-red);
  margin-bottom: 0.75rem;
}

/* Metric / data display */
.metric {
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

---

## Layout Container

```css
.container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: var(--space-md);
}

/* App layout: full-height, scroll within content area */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: var(--carbon-core);
  color: var(--ash-white);
  padding: 1rem var(--space-md);
  position: sticky;
  top: 0;
  z-index: 50;
}

.app-header h1 {
  color: var(--ash-white);
  font-size: clamp(1rem, 2.5vw, 1.375rem);
}

.app-header .section-label {
  color: var(--forge-gold);
}
```

---

## Cards and Panels

```css
.card {
  background: var(--pure-white);
  border: 1px solid var(--soft-gray);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

/* Red top-border variant (primary content, systems) */
.card-primary {
  border-top: 3px solid var(--forge-red);
}

/* Gold left-border variant (secondary content, enablement) */
.card-accent {
  border-left: 3px solid var(--forge-gold);
}

/* Flat section panel (no border-radius, full-width) */
.section-panel {
  background: var(--pure-white);
  border-bottom: 1px solid var(--soft-gray);
  padding: 1.5rem var(--space-lg);
}
```

---

## Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease;
  text-decoration: none;
  white-space: nowrap;
}

/* Primary — Forge Red */
.btn-primary {
  background: var(--forge-red);
  color: #ffffff;
}
.btn-primary:hover { background: var(--forge-red-hover); }

/* Secondary — transparent with border */
.btn-secondary {
  background: transparent;
  color: var(--carbon-core);
  border: 1px solid var(--soft-gray);
}
.btn-secondary:hover { background: var(--pure-white); }

/* Small variant */
.btn-sm {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
}
```

---

## Collapsible Sections

Sections default to collapsed. Every toggle is independent. Bulk controls at the top of each page/tab.

```css
/* Toggle header — the clickable row */
.toggle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem var(--space-lg);
  cursor: pointer;
  background: var(--pure-white);
  border-bottom: 1px solid var(--soft-gray);
  user-select: none;
  transition: background-color 150ms ease;
}
.toggle-header:hover { background: var(--ash-white); }

.toggle-header h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

/* Chevron indicator */
.toggle-icon {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--echo);
  transition: transform 200ms ease;
  flex-shrink: 0;
}
.toggle-header[aria-expanded="true"] .toggle-icon {
  transform: rotate(180deg);
}

/* Content panel — hidden by default */
.toggle-content {
  display: none;
  padding: var(--space-lg);
  background: var(--pure-white);
  border-bottom: 1px solid var(--soft-gray);
}
.toggle-content.is-open {
  display: block;
}

/* Bulk controls bar */
.bulk-controls {
  display: flex;
  gap: var(--space-sm);
  padding: 0.75rem var(--space-lg);
  background: var(--ash-white);
  border-bottom: 1px solid var(--soft-gray);
}
```

---

## Tab Navigation

```css
.tab-list {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--soft-gray);
  background: var(--pure-white);
  overflow-x: auto;
  scrollbar-width: none;
}
.tab-list::-webkit-scrollbar { display: none; }

.tab-btn {
  padding: 0.875rem 1.25rem;
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--echo);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 150ms ease, border-color 150ms ease;
}
.tab-btn:hover { color: var(--carbon-core); }
.tab-btn.is-active {
  color: var(--forge-red);
  border-bottom-color: var(--forge-red);
}

.tab-panel { display: none; }
.tab-panel.is-active { display: block; }
```

---

## Sidebar Navigation

```css
.sidebar-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
  min-height: calc(100vh - 56px); /* subtract header height */
}

@media (max-width: 768px) {
  .sidebar-layout {
    grid-template-columns: 1fr;
  }
  .sidebar { display: none; }
  .sidebar.is-open { display: block; }
}

.sidebar {
  background: var(--carbon-core);
  padding: 1.5rem 0;
  position: sticky;
  top: 56px;
  height: calc(100vh - 56px);
  overflow-y: auto;
}

.sidebar-nav-item {
  display: block;
  padding: 0.625rem 1.25rem;
  font-family: var(--font-primary);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--echo);
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: color 150ms ease, border-color 150ms ease, background 150ms ease;
  cursor: pointer;
}
.sidebar-nav-item:hover {
  color: var(--ash-white);
  background: rgba(255, 255, 255, 0.05);
}
.sidebar-nav-item.is-active {
  color: var(--ash-white);
  border-left-color: var(--forge-red);
  background: rgba(212, 59, 42, 0.1);
}

.sidebar-section-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--forge-gold);
  padding: 1.25rem 1.25rem 0.375rem;
}

.content-area {
  padding: var(--space-lg);
  overflow-y: auto;
}
```

---

## Progress Bars

Used for checklist section progress indicators.

```css
.progress-bar-wrap {
  background: var(--soft-gray);
  border-radius: 99px;
  height: 6px;
  overflow: hidden;
  margin-bottom: var(--space-sm);
}
.progress-bar-fill {
  height: 100%;
  background: var(--forge-red);
  border-radius: 99px;
  transition: width 200ms ease;
}
.progress-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--echo);
}
```

---

## Scroll-to-Top Button

```css
.scroll-top-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--forge-red);
  color: white;
  border: none;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: background-color 200ms ease;
  z-index: 40;
}
.scroll-top-btn.is-visible { display: flex; }
.scroll-top-btn:hover { background: var(--forge-red-hover); }
```

---

## Print Styles

```css
@media print {
  .sidebar, .tab-list, .bulk-controls, .scroll-top-btn,
  .btn, .toggle-icon { display: none !important; }

  .toggle-content { display: block !important; }
  .sidebar-layout { display: block !important; }

  body { background: white; }
  .card { border: 1px solid #ccc; break-inside: avoid; }
}
```

---

## Accessibility Reference

| Combination | Ratio | Rating | Usage |
|-------------|-------|--------|-------|
| Carbon Core on Pure White | 16.5:1 | AAA | Body text, headings |
| Carbon Core on Ash White | 15.1:1 | AAA | Body text on canvas |
| Forge Red on Pure White | 5.3:1 | AA | Links, labels, CTAs |
| Forge Gold on Carbon Core | 10.7:1 | AAA | Highlights on dark backgrounds |
| Echo on Pure White | 4.0:1 | AA | Secondary text |
| **Forge Gold on Pure White** | **1.8:1** | **FAIL** | **NEVER use** |

**Rules:**
- Forge Gold (`#FFB400`) MUST NEVER appear as text on light backgrounds
- No gradients as primary visual treatments
- No italics anywhere (em/i/cite render as font-weight: 600 instead)
- No AI clichés (circuits, neural networks, robots, brains)

---

*Default Design System for Web App Builder v1.0 — April 2026*

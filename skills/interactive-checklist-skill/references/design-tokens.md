# Design Tokens — Interactive Checklist Skill

Complete CSS custom properties, typography, responsive breakpoints, accessibility, and print styles.

---

## CSS Custom Properties (default palette)

```css
:root {
  /* Palette */
  --color-core: #121010;
  --color-red: #D43B2A;
  --color-red-hover: #b8301f;
  --color-gold: #FFB400;
  --color-dark: #333130;
  --color-ash: #F2F0EE;
  --color-white: #FFFFFF;
  --color-echo: #878E88;
  --color-soft: #E5E3E0;
  --color-code-bg: #1a1817;
  --color-success: #2d8a4e;
  --color-info: #3b82f6;

  /* Typography */
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Google Fonts Load

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## Typography Scale

| Element | Font | Weight | Size | Tracking | Line-height | Notes |
|---------|------|--------|------|----------|-------------|-------|
| H1 (hero) | Outfit | 700 | clamp(1.4rem, 3.5vw, 1.8rem) | -0.02em | 1.25 | Only in hero |
| H2 (section) | Outfit | 700 | 1.25rem | -0.02em | 1.3 | Section headings |
| H3 (card title) | Outfit | 700 | 1rem | normal | 1.3 | Task titles within cards |
| Body | Outfit | 400 | 0.875rem (14px) | normal | 1.6 | Default |
| Section label | JetBrains Mono | 600 | 0.6875rem (11px) | 0.12em | 1 | UPPERCASE, Forge Red |
| Stat number | JetBrains Mono | 700 | 1.25rem | -0.02em | 1 | Gold on dark |
| Stat label | Outfit | 400 | 0.75rem | normal | 1 | Echo color |
| Badge | JetBrains Mono | 600 | 0.5625rem (9px) | 0.06em | 1 | UPPERCASE |
| Code | JetBrains Mono | 400 | 0.8125rem | normal | 1.5 | In code blocks |
| Meta text | Outfit | 400 | 0.8125rem | normal | 1.5 | Echo color |

**No italics anywhere.**

---

## Component Styles

### Hero

```css
.hero {
  background: var(--color-dark);
  padding: 2rem 1.5rem 1.75rem;
}
.hero-inner {
  max-width: 900px;
  margin: 0 auto;
}
.section-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-red);
  margin-bottom: 0.4rem;
}
.hero h1 {
  font-weight: 700;
  font-size: clamp(1.4rem, 3.5vw, 1.8rem);
  letter-spacing: -0.02em;
  color: var(--color-white);
  margin-bottom: 0.25rem;
}
.hero-meta {
  font-size: 0.8125rem;
  color: var(--color-echo);
}
```

### Stats Bar

```css
.stats-bar {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}
.stat-box {
  background: var(--color-core);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  flex: 1;
  min-width: 90px;
}
.stat-number {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-gold);
}
.stat-label {
  font-size: 0.75rem;
  color: var(--color-echo);
  margin-top: 0.125rem;
}
```

### Progress Bar

```css
.progress-wrap { margin-top: 1rem; }
.progress-track {
  height: 6px;
  background: rgba(255,255,255,0.12);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-gold);
  border-radius: 3px;
  transition: width 0.4s ease, background-color 0.3s ease;
}
.progress-fill.complete {
  background: var(--color-success);
}
```

### Task Cards

```css
.task-card {
  background: var(--color-white);
  border: 1px solid var(--color-soft);
  border-radius: 6px;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s ease;
}
.task-card:hover {
  border-color: var(--color-echo);
}
.task-card.completed {
  border-left: 3px solid var(--color-success);
  opacity: 0.85;
}
.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--color-echo);
}
```

### Code Blocks

```css
.code-block {
  position: relative;
  margin: 0.5rem 0;
}
.code-block pre {
  background: var(--color-code-bg);
  color: var(--color-ash);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.5;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: none;
  color: var(--color-echo);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  opacity: 0.6;
  transition: all 0.2s ease;
}
.copy-btn:hover { opacity: 1; background: rgba(255,255,255,0.2); }
.copy-btn.copied { color: var(--color-success); opacity: 1; }
@media (hover: none) { .copy-btn { opacity: 1; } }
```

### Badges

```css
.badge {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid;
  white-space: nowrap;
  display: inline-block;
}
.badge-on-deck {
  background: rgba(135,142,136,0.15);
  border-color: var(--color-echo);
  color: var(--color-echo);
}
.badge-complete {
  background: rgba(45,138,78,0.15);
  border-color: var(--color-success);
  color: var(--color-success);
}
.badge-has-notes {
  background: rgba(255,180,0,0.15);
  border-color: var(--color-gold);
  color: var(--color-gold);
}
.badge-terminal, .badge-dashboard {
  background: rgba(51,49,48,0.1);
  border-color: var(--color-dark);
  color: var(--color-dark);
}
```

---

## Responsive Breakpoints

```css
@media (max-width: 768px) {
  .hero { padding: 1.5rem 1rem 1.25rem; }
  .content { padding: 1rem; }
  .stats-bar { gap: 0.5rem; }
  .stat-box { min-width: 75px; padding: 0.5rem 0.625rem; }
  .stat-number { font-size: 1rem; }
}

@media (max-width: 480px) {
  .tab-btn { padding: 8px 12px; font-size: 13px; }
  .task-header { padding: 0.75rem; }
  .stat-box { min-width: 70px; }
}
```

### Tab Bar (mobile horizontal scroll)

```css
.tab-nav {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  gap: 0;
  border-bottom: 1px solid var(--color-soft);
  background: var(--color-white);
  position: sticky;
  top: 0;
  z-index: 10;
}
.tab-btn {
  scroll-snap-align: start;
  white-space: nowrap;
  flex-shrink: 0;
}
```

---

## Accessibility

```css
/* Skip link */
.skip-link {
  position: absolute; top: -40px; left: 0;
  background: var(--color-red); color: white;
  padding: 8px 16px; z-index: 100;
  text-decoration: none; font-weight: 600;
}
.skip-link:focus { top: 0; }

/* Focus indicators */
:focus-visible {
  outline: 3px solid var(--color-red);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Print Styles

```css
@media print {
  .hero { background: white !important; color: black !important; }
  .hero h1 { color: black !important; }
  .section-label { color: black !important; }
  .stats-bar, .toolbar, .tab-nav, .copy-btn, .export-panel,
  .progress-wrap, .warning-banner { display: none !important; }
  .task-card { break-inside: avoid; border: 1px solid #ccc; }
  .task-body { display: block !important; }
  .code-block pre { background: #f5f5f5 !important; color: black !important; border: 1px solid #ccc; }
  .notes-textarea { border: 1px solid #ccc; }
}
```

---

*Design Tokens v1.0 — Interactive Checklist Skill*

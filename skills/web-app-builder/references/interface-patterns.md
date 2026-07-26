# Interface Patterns — Web App Builder Reference

Complete HTML/JS implementations for each interface pattern. Select based on Phase 1 content analysis.

---

## Pattern 1: Single-Page with Collapsible Sections

**When to use:** 1 file, short-to-medium length. No navigation needed.

### Structure

```html
<div class="app-layout">
  <header class="app-header">
    <div class="container">
      <p class="section-label">DOCUMENT</p>
      <h1><!-- Title from H1 of document --></h1>
    </div>
  </header>

  <main id="main-content" class="container" style="padding-top: 1.5rem; padding-bottom: 3rem;">
    <!-- Bulk controls -->
    <div class="bulk-controls">
      <button class="btn btn-secondary btn-sm" onclick="expandAll()">Expand All</button>
      <button class="btn btn-secondary btn-sm" onclick="collapseAll()">Collapse All</button>
    </div>

    <!-- Each H2 becomes a toggle section -->
    <div class="toggle-section" data-section="section-1">
      <button class="toggle-header" aria-expanded="false" aria-controls="section-1-content"
              onclick="toggleSection('section-1')">
        <h2>Section Title</h2>
        <span class="toggle-icon" aria-hidden="true">▼</span>
      </button>
      <div class="toggle-content" id="section-1-content" role="region">
        <!-- H3+ content rendered here -->
      </div>
    </div>
  </main>
</div>
```

### JavaScript

```js
function toggleSection(id) {
  const section = document.querySelector(`[data-section="${id}"]`);
  const header = section.querySelector('.toggle-header');
  const content = section.querySelector('.toggle-content');
  const isOpen = content.classList.contains('is-open');
  content.classList.toggle('is-open', !isOpen);
  header.setAttribute('aria-expanded', String(!isOpen));
}

function expandAll() {
  document.querySelectorAll('.toggle-content').forEach(c => c.classList.add('is-open'));
  document.querySelectorAll('.toggle-header').forEach(h => h.setAttribute('aria-expanded', 'true'));
}

function collapseAll() {
  document.querySelectorAll('.toggle-content').forEach(c => c.classList.remove('is-open'));
  document.querySelectorAll('.toggle-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
}

// Keyboard: Enter/Space on toggle headers
document.querySelectorAll('.toggle-header').forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});
```

---

## Pattern 2: Single-Page with Sidebar Navigation

**When to use:** 1 file, long or complex. H2s appear in sidebar for quick navigation.

### Structure

```html
<div class="app-layout">
  <header class="app-header" style="position:sticky;top:0;z-index:50;">
    <div style="max-width:100%;padding:0 1rem;display:flex;align-items:center;gap:1rem;">
      <button class="sidebar-toggle-btn btn btn-secondary btn-sm"
              onclick="toggleSidebar()" aria-label="Toggle navigation">☰</button>
      <div>
        <p class="section-label" style="color:var(--forge-gold);margin:0;">REFERENCE</p>
        <h1 style="color:var(--ash-white);font-size:1.125rem;margin:0;">Doc Title</h1>
      </div>
    </div>
  </header>

  <div class="sidebar-layout">
    <nav class="sidebar" id="sidebar" aria-label="Document sections">
      <p class="sidebar-section-label">SECTIONS</p>
      <!-- Generated from H2 headings -->
      <a class="sidebar-nav-item is-active" href="#" onclick="scrollToSection('section-1');return false;">
        Section 1
      </a>
      <a class="sidebar-nav-item" href="#" onclick="scrollToSection('section-2');return false;">
        Section 2
      </a>
    </nav>

    <main id="main-content" class="content-area">
      <div class="bulk-controls">
        <button class="btn btn-secondary btn-sm" onclick="expandAll()">Expand All</button>
        <button class="btn btn-secondary btn-sm" onclick="collapseAll()">Collapse All</button>
      </div>

      <!-- Sections with anchor IDs matching sidebar links -->
      <div id="section-1" class="toggle-section" data-section="section-1">
        <button class="toggle-header" aria-expanded="false" onclick="toggleSection('section-1')">
          <h2>Section 1</h2>
          <span class="toggle-icon" aria-hidden="true">▼</span>
        </button>
        <div class="toggle-content" id="section-1-content">
          <!-- content -->
        </div>
      </div>
    </main>
  </div>
</div>
```

### JavaScript Additions

```js
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('is-open');
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Open the section if collapsed
  const content = el.querySelector('.toggle-content');
  if (content && !content.classList.contains('is-open')) {
    toggleSection(id);
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Update active state
  document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('is-active'));
  document.querySelector(`[onclick="scrollToSection('${id}');return false;"]`)
    ?.classList.add('is-active');
}

// Intersection Observer: update active sidebar item on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('is-active'));
      document.querySelector(`[onclick*="${id}"]`)?.classList.add('is-active');
    }
  });
}, { rootMargin: '-20% 0px -60% 0px' });

document.querySelectorAll('.toggle-section[id]').forEach(el => observer.observe(el));
```

---

## Pattern 3: Tabbed Interface

**When to use:** 2–5 files. Each file gets its own tab.

### Structure

```html
<div class="app-layout">
  <header class="app-header">
    <div class="container">
      <p class="section-label" style="color:var(--forge-gold);margin:0 0 0.25rem;">DOCUMENTS</p>
      <h1 style="color:var(--ash-white);">App Title</h1>
    </div>
  </header>

  <!-- Tab list -->
  <div role="tablist" class="tab-list" aria-label="Documents">
    <button class="tab-btn is-active" role="tab" aria-selected="true"
            aria-controls="tab-panel-1" id="tab-1"
            onclick="switchTab('tab-1','tab-panel-1')">
      Document 1
    </button>
    <button class="tab-btn" role="tab" aria-selected="false"
            aria-controls="tab-panel-2" id="tab-2"
            onclick="switchTab('tab-2','tab-panel-2')">
      Document 2
    </button>
  </div>

  <!-- Tab panels -->
  <main id="main-content">
    <div class="tab-panel is-active container" id="tab-panel-1"
         role="tabpanel" aria-labelledby="tab-1"
         style="padding-top:1.5rem;padding-bottom:3rem;">
      <div class="bulk-controls">
        <button class="btn btn-secondary btn-sm" onclick="expandAllInPanel('tab-panel-1')">Expand All</button>
        <button class="btn btn-secondary btn-sm" onclick="collapseAllInPanel('tab-panel-1')">Collapse All</button>
      </div>
      <!-- Collapsible sections for this document -->
    </div>

    <div class="tab-panel container" id="tab-panel-2"
         role="tabpanel" aria-labelledby="tab-2"
         style="padding-top:1.5rem;padding-bottom:3rem;">
      <!-- Content lazy-loaded on first activation -->
    </div>
  </main>
</div>
```

### JavaScript

```js
function switchTab(tabId, panelId) {
  // Deactivate all
  document.querySelectorAll('[role="tab"]').forEach(t => {
    t.classList.remove('is-active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));

  // Activate selected
  document.getElementById(tabId).classList.add('is-active');
  document.getElementById(tabId).setAttribute('aria-selected', 'true');
  document.getElementById(panelId).classList.add('is-active');
}

function expandAllInPanel(panelId) {
  const panel = document.getElementById(panelId);
  panel.querySelectorAll('.toggle-content').forEach(c => c.classList.add('is-open'));
  panel.querySelectorAll('.toggle-header').forEach(h => h.setAttribute('aria-expanded', 'true'));
}

function collapseAllInPanel(panelId) {
  const panel = document.getElementById(panelId);
  panel.querySelectorAll('.toggle-content').forEach(c => c.classList.remove('is-open'));
  panel.querySelectorAll('.toggle-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
}

// Arrow key navigation for tabs
document.querySelectorAll('[role="tab"]').forEach((tab, i, tabs) => {
  tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') tabs[(i + 1) % tabs.length].focus();
    if (e.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].focus();
  });
});
```

---

## Pattern 4: Sidebar Tree Navigation (6+ Files)

**When to use:** 6+ files, or files with clear parent-child hierarchy.

### Structure

Same as Pattern 2, but the sidebar is extended with nested items and group labels:

```html
<nav class="sidebar" id="sidebar" aria-label="Document navigation">
  <!-- Group 1 -->
  <p class="sidebar-section-label">GROUP 1</p>
  <a class="sidebar-nav-item is-active" href="#" onclick="loadSection('doc1-s1');return false;">
    Section 1.1
  </a>
  <a class="sidebar-nav-item" href="#"
     style="padding-left:2rem;font-size:0.8125rem;"
     onclick="loadSection('doc1-s1-sub');return false;">
    Subsection 1.1.1
  </a>

  <!-- Group 2 -->
  <p class="sidebar-section-label">GROUP 2</p>
  <a class="sidebar-nav-item" href="#" onclick="loadSection('doc2-s1');return false;">
    Section 2.1
  </a>
</nav>
```

For 6+ files: use lazy rendering — only render the content of a document when the user first navigates to it. Store content as JS strings or data attributes, inject on first activation.

---

## Scroll-to-Top Implementation

Add to every pattern:

```js
// Scroll-to-top button
const scrollBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('is-visible', window.scrollY > 600);
}, { passive: true });

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

```html
<button class="scroll-top-btn" id="scroll-top-btn" aria-label="Scroll to top">↑</button>
```

---

## Pattern Selection Decision Tree

```
How many files?
├── 1 file
│   ├── Short/medium → Pattern 1 (single-page + collapsible)
│   └── Long/complex → Pattern 2 (sidebar + collapsible)
├── 2–5 files
│   ├── Independent topics → Pattern 3 (tabs)
│   └── Sequential/related → Pattern 3 (tabs with shared progress bar)
└── 6+ files → Pattern 4 (sidebar tree)

Checklist content detected in any pattern?
→ Add checkbox rendering + progress tracking to affected sections (see content-rendering-guide.md)
```

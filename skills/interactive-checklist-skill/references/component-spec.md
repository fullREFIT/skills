# Component Specification — Interactive Checklist Skill

Detailed component anatomy for every element in the interactive checklist web app. This is the Level 3 reference — load when building.

---

## Task Card (Atomic Unit)

### Collapsed State

```html
<div class="task-card" data-task="1">
  <div class="task-header" onclick="toggleTask(this)">
    <input type="checkbox" class="task-checkbox"
           onchange="toggleComplete(this, event)"
           aria-label="Mark task 1 complete">
    <div class="task-title-area">
      <div class="task-number">
        Task 1
        <span class="badge badge-terminal">Terminal</span>
        <span class="badge badge-on-deck">On Deck</span>
        <span class="badge badge-has-notes" style="display:none">Has Notes</span>
      </div>
      <div class="task-title">Task title here</div>
    </div>
    <span class="chevron">&#9654;</span>
  </div>
  <div class="task-body">
    <!-- expanded content here -->
  </div>
</div>
```

**Visual specs (collapsed):**
- Card: Pure White background, 1px Soft Gray border, 6px radius, 0 left border (default)
- Checkbox: 18×18px visible, 44×44px tap target via padding
- Title: Outfit 600, 0.875rem, Carbon Core
- Chevron: Echo color, 0.75rem, transitions rotate(90deg) on open
- Card has `cursor: pointer` on the header area

### Expanded State

The `.task-body` becomes visible. Contains:

1. **Description** — `<p>` elements, Outfit 400, 0.8125rem, Echo color
2. **Prerequisite callout** (if dependencies exist):
   ```html
   <div class="callout callout-amber">
     <strong>Prerequisite:</strong> Task 2 must be done first.
   </div>
   ```
   Amber border (2px), light amber background, bold label.

3. **Step-by-step instructions** — `<ol class="steps-list">` with code blocks inline
4. **Code blocks** — see Code Block section below
5. **Notes textarea:**
   ```html
   <div class="notes-section">
     <label for="notes-1">Notes</label>
     <textarea class="notes-textarea" id="notes-1"
               placeholder="Document your findings, paste relevant links..."
               oninput="updateNoteCount()"></textarea>
   </div>
   ```

### Checked State

When checkbox is ticked:
- Title: `text-decoration: line-through; color: var(--color-echo);`
- Card: `border-left: 3px solid var(--color-success);`
- Status badge: switches from "ON DECK" to "COMPLETE" (green)
- Card: `opacity: 0.85` (still readable and interactive)
- Card remains fully functional — can be unchecked, notes editable, accordion toggleable

---

## Accordion Behavior

### Multi-Open Implementation

```javascript
function toggleTask(header) {
  const card = header.closest('.task-card');
  card.classList.toggle('open');
}
```

The `.task-body` visibility is controlled by CSS:
```css
.task-body {
  display: none;
  padding: 0 1rem 1rem 1rem;
}
.task-card.open .task-body {
  display: block;
}
```

### Checkbox Click Isolation

```javascript
document.querySelectorAll('.task-checkbox').forEach(function(cb) {
  cb.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});
```

### Expand All / Collapse All (scoped to active tab)

```javascript
function expandAll() {
  const activePanel = document.querySelector('.tab-panel.active');
  if (!activePanel) return;
  activePanel.querySelectorAll('.task-card').forEach(function(card) {
    card.classList.add('open');
  });
}

function collapseAll() {
  const activePanel = document.querySelector('.tab-panel.active');
  if (!activePanel) return;
  activePanel.querySelectorAll('.task-card').forEach(function(card) {
    card.classList.remove('open');
  });
}
```

---

## Toolbar

Position: sticky below hero, above task list. `z-index: 10`.

```html
<div class="toolbar">
  <button class="toolbar-btn" onclick="expandAll()">Expand All</button>
  <button class="toolbar-btn" onclick="collapseAll()">Collapse All</button>
  <button class="toolbar-btn" onclick="toggleHideComplete()">
    <span id="hide-label">Show All</span>
  </button>
  <button class="toolbar-btn primary" onclick="switchTab('export')">Export to Markdown</button>
</div>
```

**Hide Completed toggle:**
```javascript
function toggleHideComplete() {
  state.hideComplete = !state.hideComplete;
  document.getElementById('hide-label').textContent =
    state.hideComplete ? 'Hiding Completed' : 'Show All';
  document.querySelectorAll('.task-card').forEach(function(card) {
    if (state.hideComplete && card.classList.contains('completed')) {
      card.style.display = 'none';
    } else {
      card.style.display = '';
    }
  });
}
```

---

## Tab Navigation

### HTML Structure

```html
<nav class="tab-nav">
  <button class="tab-btn active" data-tab="infra"
          onclick="switchTab('infra')">Infrastructure (0/6)</button>
  <button class="tab-btn" data-tab="n8n"
          onclick="switchTab('n8n')">n8n + Workflows (0/3)</button>
  <button class="tab-btn" data-tab="content"
          onclick="switchTab('content')">Content Ops (0/1)</button>
  <button class="tab-btn" data-tab="export"
          onclick="switchTab('export')">Export</button>
</nav>
```

### Tab Switching (preserves state)

```javascript
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  var panel = document.getElementById('panel-' + tabId);
  if (panel) panel.classList.add('active');
  var btn = document.querySelector('[data-tab="' + tabId + '"]');
  if (btn) btn.classList.add('active');
  state.activeTab = tabId;
}
```

All panels remain in the DOM. Visibility toggled via `.active` class. Notes, checkbox state, and accordion state all persist across tab switches.

### Dynamic Completion Counts

Update tab labels on every checkbox change:
```javascript
function updateTabCounts() {
  var tabs = { infra: [0,0], n8n: [0,0], content: [0,0] };
  document.querySelectorAll('.task-card').forEach(function(card) {
    var tab = card.dataset.tab;
    if (!tabs[tab]) return;
    tabs[tab][0]++;
    if (card.classList.contains('completed')) tabs[tab][1]++;
  });
  // Update each tab button text with counts
}
```

---

## Notes System

### Per-Task Notes

- Every task card includes a `<textarea>` in its expanded body
- Placeholder text is task-specific (not generic "Add notes...")
- Notes persist in the `state.notes` object, keyed by task ID

### HAS NOTES Badge

The gold badge appears on collapsed task cards when notes exist:

```javascript
function updateNoteCount() {
  var count = 0;
  document.querySelectorAll('.notes-textarea').forEach(function(ta) {
    var taskId = ta.id.replace('notes-', '');
    var badge = document.querySelector('[data-task="' + taskId + '"] .badge-has-notes');
    if (ta.value.trim().length > 0) {
      count++;
      if (badge) badge.style.display = '';
    } else {
      if (badge) badge.style.display = 'none';
    }
  });
  document.getElementById('stat-notes').textContent = count;
}
```

### Debounce

Notes textareas use a 600ms debounce to avoid re-renders on every keystroke:

```javascript
var noteTimer;
function onNoteInput() {
  clearTimeout(noteTimer);
  noteTimer = setTimeout(function() {
    updateNoteCount();
  }, 600);
}
```

---

## Markdown Export

### Export Tab Structure

```html
<div class="tab-panel" id="panel-export">
  <div class="export-panel">
    <h3>Export Progress as Markdown</h3>
    <p>Generates a markdown snapshot of all task statuses and notes.</p>
    <div class="export-preview" id="export-preview">
      Click "Generate" to create the export...
    </div>
    <div class="export-actions">
      <button class="toolbar-btn primary" onclick="generateExport()">Generate Export</button>
      <button class="toolbar-btn" onclick="copyExport()">Copy to Clipboard</button>
      <button class="toolbar-btn" onclick="downloadExport()">Download .md</button>
    </div>
  </div>
</div>
```

### Export Format

```markdown
# [Checklist Title] — Progress Report

**Exported:** [ISO timestamp]
**Status:** [X] of [Y] complete ([Z]%)

---

## Task Status by Category

### [Tab/Category Name]

- [x] **Task Title** — [effort badge]
  - Detail: [first line of description]
  - **Notes:** [full notes, line breaks preserved]

- [ ] **Task Title** — [effort badge]
  - Detail: [first line of description]

---

## Summary for AI Task Tracker

### Completed
- **Task Title** — [notes summary or "No notes"]

### Outstanding
- Task Title — [notes or "No notes"]

---
*End of progress report.*
```

### Download Implementation

```javascript
function downloadExport() {
  var content = document.getElementById('export-preview').textContent;
  if (content.startsWith('Click')) generateExport();
  content = document.getElementById('export-preview').textContent;
  var dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  var blob = new Blob([content], { type: 'text/markdown' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'checklist-progress_' + dateStr + '.md';
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## Hero Header

### Structure

```html
<header class="hero">
  <div class="hero-inner">
    <div class="section-label">TASK TRACKER</div>
    <h1>Checklist Title Here</h1>
    <p class="hero-meta">[N] tasks total · <span id="hero-status">0 complete, N on deck</span></p>
    <div class="stats-bar">
      <div class="stat-box">
        <div class="stat-number" id="stat-complete">0</div>
        <div class="stat-label">Complete</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" id="stat-remaining">N</div>
        <div class="stat-label">On Deck</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" id="stat-percent">0%</div>
        <div class="stat-label">Progress</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" id="stat-notes">0</div>
        <div class="stat-label">Notes</div>
      </div>
    </div>
    <div class="progress-wrap">
      <div class="progress-track">
        <div class="progress-fill" id="progress-fill" style="width:0%"></div>
      </div>
    </div>
  </div>
</header>
```

### Progress Bar Behavior

- Default fill color: Forge Gold (`--color-gold`)
- At 100%: switches to Success Green (`--color-success`)
- Transition: `width 0.4s ease, background-color 0.3s ease`

---

## Code Blocks with Copy Buttons

### Implementation

```html
<div class="code-block">
  <pre><code>curl -X POST https://example.com/webhook \
  -H "Authorization: Bearer $AUTH_TOKEN"</code></pre>
  <button class="copy-btn" onclick="copyCode(this, event)"
          aria-label="Copy to clipboard">&#x2398;</button>
</div>
```

### Copy Function

```javascript
function copyCode(btn, e) {
  if (e) e.stopPropagation();
  var code = btn.closest('.code-block').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(function() {
    btn.textContent = '\u2713';
    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Copied');
    setTimeout(function() {
      btn.textContent = '\u2398';
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', 'Copy to clipboard');
    }, 2000);
  });
}
```

---

## Status Badge Taxonomy

| Badge | Background | Border | Text Color |
|-------|-----------|--------|------------|
| ON DECK | Echo @ 15% | Echo | Echo |
| COMPLETE | Success @ 15% | Success green | Success green |
| HAS NOTES | Gold @ 15% | Gold | Gold |
| Category (Terminal, etc.) | Dark @ 15% | Dark | Dark |

All badges: JetBrains Mono, 9px (0.5625rem), 600 weight, UPPERCASE, 0.06em tracking, 3px radius, 1px border.

---

*Component Specification v1.0 — Interactive Checklist Skill*

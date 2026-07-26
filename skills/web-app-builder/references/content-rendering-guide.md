# Content Rendering Guide — Web App Builder Reference

Complete HTML/CSS/JS implementations for each content element type. Apply these patterns when rendering markdown content inside the interface structure.

---

## Code Blocks

Every code block gets a "Copy" button. Syntax highlighting uses inline CSS classes (no external libraries).

### HTML Structure

```html
<div class="code-block-wrap">
  <div class="code-block-header">
    <span class="code-lang">javascript</span>
    <button class="btn btn-sm copy-btn"
            onclick="copyCode(this)"
            aria-label="Copy code">Copy</button>
  </div>
  <pre class="code-pre"><code class="code-content">// your code here
const x = 42;</code></pre>
</div>
```

### CSS

```css
.code-block-wrap {
  background: var(--carbon-core);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 1rem 0;
  border: 1px solid var(--soft-gray);
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--forge-dark);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.code-lang {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--forge-gold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.code-pre {
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
}

.code-content {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ash-white);
  white-space: pre;
}

.copy-btn {
  background: rgba(255,255,255,0.1);
  color: var(--ash-white);
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 0.6875rem;
}
.copy-btn:hover { background: rgba(255,255,255,0.2); }
.copy-btn.copied {
  background: rgba(5,150,105,0.3);
  color: #6ee7b7;
  border-color: rgba(5,150,105,0.5);
}
```

### JavaScript

```js
function copyCode(btn) {
  const code = btn.closest('.code-block-wrap').querySelector('.code-content').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied ✓';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}
```

---

## Interactive Checklists

Render `- [ ]` task lists (and numbered steps) as interactive checkboxes with per-section progress.

### HTML Structure

```html
<div class="checklist-section" data-checklist-id="checklist-1">
  <div class="checklist-progress-wrap">
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" id="checklist-1-bar" style="width:0%"></div>
    </div>
    <span class="progress-label" id="checklist-1-label">0 / 5 complete</span>
    <button class="btn btn-sm btn-secondary"
            onclick="resetChecklist('checklist-1')"
            style="margin-left:auto;">Reset All</button>
  </div>

  <ul class="checklist" role="list">
    <li class="checklist-item" data-checklist-item>
      <label class="checklist-label">
        <input type="checkbox" class="checklist-checkbox"
               onchange="updateProgress('checklist-1')">
        <span class="checklist-text">Task item text</span>
      </label>
    </li>
    <!-- more items -->
  </ul>
</div>
```

### CSS

```css
.checklist-section {
  padding: 0.75rem 0;
}

.checklist-progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.checklist {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checklist-item {
  border-radius: var(--radius);
  transition: opacity 150ms ease;
}

.checklist-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.625rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: background 150ms ease, border-color 150ms ease;
}
.checklist-label:hover {
  background: var(--ash-white);
  border-color: var(--soft-gray);
}

.checklist-checkbox {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: var(--forge-red);
  cursor: pointer;
}

.checklist-text {
  font-family: var(--font-primary);
  font-size: 0.9375rem;
  line-height: 1.5;
  transition: opacity 150ms ease;
}

/* Checked state */
.checklist-item.is-checked .checklist-text {
  text-decoration: line-through;
  opacity: 0.5;
  text-decoration-color: var(--echo);
}
```

### JavaScript

```js
function updateProgress(checklistId) {
  const section = document.querySelector(`[data-checklist-id="${checklistId}"]`);
  const all = section.querySelectorAll('.checklist-checkbox');
  const checked = section.querySelectorAll('.checklist-checkbox:checked');
  const total = all.length;
  const done = checked.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  section.querySelector(`#${checklistId}-bar`).style.width = pct + '%';
  section.querySelector(`#${checklistId}-label`).textContent = `${done} / ${total} complete`;

  // Update item visual state
  all.forEach(cb => {
    cb.closest('.checklist-item').classList.toggle('is-checked', cb.checked);
  });
}

function resetChecklist(checklistId) {
  const section = document.querySelector(`[data-checklist-id="${checklistId}"]`);
  section.querySelectorAll('.checklist-checkbox').forEach(cb => { cb.checked = false; });
  section.querySelectorAll('.checklist-item').forEach(i => i.classList.remove('is-checked'));
  updateProgress(checklistId);
}
```

---

## Tables

Styled with alternating rows, scrollable on narrow viewports, sticky header when tall.

### HTML Structure

```html
<div class="table-wrap">
  <table class="data-table">
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Value 1</td>
        <td>Value 2</td>
        <td>Value 3</td>
      </tr>
      <tr>
        <td>Value A</td>
        <td>Value B</td>
        <td>Value C</td>
      </tr>
    </tbody>
  </table>
</div>
```

### CSS

```css
.table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--soft-gray);
  margin: 1rem 0;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  background: var(--carbon-core);
  color: var(--ash-white);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.75rem 1rem;
  text-align: left;
  white-space: nowrap;
  position: sticky;
  top: 0;
}

.data-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--soft-gray);
  vertical-align: top;
  color: var(--carbon-core);
  line-height: 1.5;
}

.data-table tbody tr:nth-child(even) td {
  background: var(--ash-white);
}
.data-table tbody tr:nth-child(odd) td {
  background: var(--pure-white);
}
.data-table tbody tr:hover td {
  background: rgba(212, 59, 42, 0.04);
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}
```

---

## Callout Boxes

Pattern-matched from blockquote prefixes. Four types plus a default.

### HTML Structures

```html
<!-- Amber: WARNING / CAUTION / ⚠️ -->
<div class="callout callout-warning" role="note">
  <div class="callout-icon">⚠️</div>
  <div class="callout-body">
    <p class="callout-title">Warning</p>
    <p>Warning content here.</p>
  </div>
</div>

<!-- Green: NOTE / TIP / ✅ -->
<div class="callout callout-tip" role="note">
  <div class="callout-icon">✅</div>
  <div class="callout-body">
    <p class="callout-title">Tip</p>
    <p>Tip content here.</p>
  </div>
</div>

<!-- Red: ERROR / DANGER / ❌ -->
<div class="callout callout-danger" role="alert">
  <div class="callout-icon">❌</div>
  <div class="callout-body">
    <p class="callout-title">Error</p>
    <p>Error content here.</p>
  </div>
</div>

<!-- Blue-gray: INFO / ℹ️ -->
<div class="callout callout-info" role="note">
  <div class="callout-icon">ℹ️</div>
  <div class="callout-body">
    <p class="callout-title">Info</p>
    <p>Info content here.</p>
  </div>
</div>

<!-- Default (neutral, Forge Red left border) -->
<blockquote class="callout callout-default">
  <p>Blockquote content here.</p>
</blockquote>
```

### CSS

```css
.callout {
  display: flex;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  margin: 1rem 0;
  border: 1px solid transparent;
}

.callout-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  line-height: 1.4;
}

.callout-body > *:last-child { margin-bottom: 0; }

.callout-title {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.375rem;
}

/* Warning — amber */
.callout-warning {
  background: #fef9e7;
  border-color: #f59e0b;
  border-left: 4px solid #f59e0b;
}
.callout-warning .callout-title { color: #92400e; }

/* Tip — green */
.callout-tip {
  background: #f0fdf4;
  border-color: #059669;
  border-left: 4px solid #059669;
}
.callout-tip .callout-title { color: #065f46; }

/* Danger — red */
.callout-danger {
  background: #fef2f2;
  border-color: #dc2626;
  border-left: 4px solid #dc2626;
}
.callout-danger .callout-title { color: #991b1b; }

/* Info — blue-gray */
.callout-info {
  background: #f0f4f8;
  border-color: #64748b;
  border-left: 4px solid #64748b;
}
.callout-info .callout-title { color: #334155; }

/* Default blockquote — Forge Red left border */
.callout-default {
  border-left: 4px solid var(--forge-red);
  background: var(--ash-white);
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  border-radius: 0 var(--radius) var(--radius) 0;
}
.callout-default p {
  color: var(--carbon-core);
  font-style: normal;
}
```

---

## Metadata / Frontmatter Info Bar

Render YAML frontmatter or key: value metadata blocks as a compact info bar.

### HTML Structure

```html
<div class="metadata-bar" aria-label="Document metadata">
  <div class="metadata-item">
    <span class="metadata-key">Author</span>
    <span class="metadata-value">Your Name</span>
  </div>
  <div class="metadata-item">
    <span class="metadata-key">Version</span>
    <span class="metadata-value">1.2.0</span>
  </div>
  <div class="metadata-item">
    <span class="metadata-key">Status</span>
    <span class="metadata-value">Active</span>
  </div>
</div>
```

### CSS

```css
.metadata-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.875rem var(--space-lg);
  background: var(--forge-dark);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 1.5rem;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metadata-key {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--forge-gold);
}

.metadata-value {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ash-white);
}
```

---

## Definition Lists

For markdown definition-list patterns (term + indented definition).

```html
<dl class="definition-list">
  <div class="definition-item">
    <dt class="definition-term">Term</dt>
    <dd class="definition-desc">Definition content for this term.</dd>
  </div>
</dl>
```

```css
.definition-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin: 1rem 0;
}
.definition-item {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0.5rem 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--soft-gray);
}
@media (max-width: 600px) {
  .definition-item { grid-template-columns: 1fr; }
}
.definition-term {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--forge-red);
}
.definition-desc {
  font-family: var(--font-primary);
  font-size: 0.9375rem;
  color: var(--carbon-core);
  margin: 0;
}
```

---

## Nested Toggle (H3 within H2)

H3 headings within an H2 section render as nested collapsibles.

```html
<!-- Inside a .toggle-content -->
<div class="nested-section" data-section="nested-1">
  <button class="nested-toggle-header" aria-expanded="false"
          onclick="toggleSection('nested-1')">
    <h3 class="nested-toggle-title">Subsection Title</h3>
    <span class="toggle-icon" aria-hidden="true">▼</span>
  </button>
  <div class="toggle-content nested-toggle-content" id="nested-1-content">
    <!-- H4+ rendered inline here -->
  </div>
</div>
```

```css
.nested-toggle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--ash-white);
  border: 1px solid var(--soft-gray);
  border-radius: var(--radius);
  cursor: pointer;
  margin: 0.75rem 0 0;
  text-align: left;
}
.nested-toggle-header:hover { background: var(--soft-gray); }
.nested-toggle-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
}
.nested-toggle-content {
  padding: 1rem;
  background: var(--ash-white);
  border: 1px solid var(--soft-gray);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
  margin-bottom: 0.75rem;
}
```

---

## Notes Section (Always included with checklists)

Every checklist section gets a Notes textarea directly below the task list. Auto-grows as the user types. Data is captured by the Extract Markdown function.

### HTML Structure

Place this immediately after the closing `</ul>` of every `.checklist`:

```html
<div class="notes-section">
  <label class="notes-label" for="notes-checklist-1">
    <span class="section-label" style="color:var(--echo);">NOTES</span>
  </label>
  <textarea
    class="notes-textarea"
    id="notes-checklist-1"
    data-notes-for="checklist-1"
    placeholder="Add notes about this section..."
    oninput="autoGrow(this)"
    rows="2"
  ></textarea>
</div>
```

**`data-notes-for` must match the `data-checklist-id` of its parent checklist section.**

### CSS

```css
.notes-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--soft-gray);
}

.notes-label {
  display: block;
  margin-bottom: 0.375rem;
}

.notes-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-family: var(--font-primary);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--carbon-core);
  background: var(--ash-white);
  border: 1px solid var(--soft-gray);
  border-radius: var(--radius);
  resize: none;
  overflow: hidden;
  transition: border-color 150ms ease;
  min-height: 2.75rem;
}
.notes-textarea:focus {
  outline: none;
  border-color: var(--forge-red);
  background: var(--pure-white);
}
.notes-textarea::placeholder { color: var(--echo); }
```

### JavaScript

```js
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
```

---

## Extract Markdown — Per Tab/Page Button

Place this at the **bottom of every tab panel** (or just before the closing `</main>` for single-page layouts).

### HTML Structure

```html
<!-- At the bottom of a tab panel or main section -->
<div class="extract-bar">
  <span class="extract-bar-label">Session export</span>
  <button class="btn btn-secondary"
          onclick="extractTabMarkdown('tab-panel-1', 'Tab Title')"
          aria-label="Extract markdown for this tab">
    Extract Markdown
  </button>
</div>
```

For single-page (no tabs), the button text can read "Extract Session Markdown".

### CSS

```css
.extract-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem var(--space-lg);
  margin-top: 2rem;
  border-top: 2px solid var(--soft-gray);
  background: var(--ash-white);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.extract-bar-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--echo);
}
```

---

## Export Session Recap — Global Button (Header)

The global "Export Session Recap" button lives in the app header, right side.

### HTML

```html
<!-- Inside .app-header, right side -->
<button class="btn btn-secondary"
        style="border-color:rgba(255,255,255,0.25);color:var(--ash-white);font-size:0.8125rem;"
        onclick="exportSessionRecap()"
        aria-label="Export full session recap as markdown">
  Export Session Recap
</button>
```

---

## Markdown Export Modal

One modal instance per page, hidden by default. Shown by both extract functions.

### HTML Structure

```html
<!-- Place just before </body> -->
<div class="md-modal" id="md-modal" role="dialog" aria-modal="true"
     aria-labelledby="md-modal-title" style="display:none;">
  <div class="md-modal-backdrop" onclick="closeMarkdownModal()"></div>
  <div class="md-modal-box">
    <div class="md-modal-header">
      <h3 class="md-modal-title" id="md-modal-title">Session Recap</h3>
      <button class="md-modal-close" onclick="closeMarkdownModal()"
              aria-label="Close modal">✕</button>
    </div>
    <p class="md-modal-hint">
      Copy this into Claude Code to give it full context of what was completed.
    </p>
    <textarea class="md-modal-content" id="md-modal-content"
              readonly spellcheck="false"></textarea>
    <div class="md-modal-footer">
      <button class="btn btn-primary" id="md-copy-btn" onclick="copyModalContent()">
        Copy to Clipboard
      </button>
      <button class="btn btn-secondary" onclick="closeMarkdownModal()">Close</button>
    </div>
  </div>
</div>
```

### CSS

```css
.md-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.md-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(18, 16, 16, 0.7);
}

.md-modal-box {
  position: relative;
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  background: var(--pure-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--soft-gray);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.md-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--soft-gray);
  flex-shrink: 0;
}

.md-modal-title {
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 700;
  color: var(--carbon-core);
  margin: 0;
}

.md-modal-close {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--echo);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  border-radius: var(--radius);
  transition: color 150ms ease;
}
.md-modal-close:hover { color: var(--carbon-core); }

.md-modal-hint {
  font-family: var(--font-primary);
  font-size: 0.8125rem;
  color: var(--echo);
  padding: 0.625rem 1.5rem 0;
  flex-shrink: 0;
}

.md-modal-content {
  flex: 1;
  margin: 0.75rem 1.5rem;
  padding: 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--carbon-core);
  background: var(--ash-white);
  border: 1px solid var(--soft-gray);
  border-radius: var(--radius);
  resize: none;
  overflow-y: auto;
  min-height: 200px;
}

.md-modal-footer {
  display: flex;
  gap: 0.625rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--soft-gray);
  flex-shrink: 0;
}
```

### JavaScript — Complete Extract System

```js
// ============================================================
// MARKDOWN EXTRACT SYSTEM
// ============================================================

/**
 * Build markdown for a single container (tab panel or document body).
 * container: DOM element to search within (or null for whole document)
 * title: String title for the section heading
 */
function buildMarkdownForContainer(container, title) {
  var lines = [];
  lines.push('## ' + title);
  lines.push('');

  // Find all checklist sections in this container
  var sections = (container || document).querySelectorAll('[data-checklist-id]');

  if (sections.length === 0) {
    lines.push('*No checklists in this section.*');
    lines.push('');
  }

  sections.forEach(function(section) {
    var checklistId = section.getAttribute('data-checklist-id');

    // Section heading (look for a nearby h2/h3)
    var sectionTitle = '';
    var parentToggle = section.closest('.toggle-content');
    if (parentToggle) {
      var prev = parentToggle.previousElementSibling;
      if (prev) {
        var heading = prev.querySelector('h2, h3');
        if (heading) sectionTitle = heading.textContent.trim();
      }
    }
    if (sectionTitle) {
      lines.push('### ' + sectionTitle);
      lines.push('');
    }

    // Tasks
    var items = section.querySelectorAll('.checklist-item');
    items.forEach(function(item) {
      var cb = item.querySelector('.checklist-checkbox');
      var txt = item.querySelector('.checklist-text');
      if (cb && txt) {
        lines.push('- [' + (cb.checked ? 'x' : ' ') + '] ' + txt.textContent.trim());
      }
    });

    // Progress
    var progressLabel = section.querySelector('[id="' + checklistId + '-label"]');
    if (progressLabel && items.length > 0) {
      lines.push('');
      lines.push('**Progress:** ' + progressLabel.textContent.trim());
    }

    // Notes
    var notesEl = section.querySelector('.notes-textarea');
    var notesText = notesEl ? notesEl.value.trim() : '';
    if (notesText) {
      lines.push('');
      lines.push('**Notes:**');
      lines.push(notesText);
    }

    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Extract markdown for a single tab panel (or page).
 * panelId: id of the tab panel element, or null for single-page
 * title: display title for this tab/page
 */
function extractTabMarkdown(panelId, title) {
  var container = panelId ? document.getElementById(panelId) : null;
  var appTitle = document.querySelector('.app-header h1')
    ? document.querySelector('.app-header h1').textContent.trim()
    : 'Session';

  var md = '# Session Recap — ' + appTitle + '\n';
  md += '*Generated: ' + new Date().toLocaleString('en-US', {
    dateStyle: 'long', timeStyle: 'short'
  }) + '*\n\n---\n\n';
  md += buildMarkdownForContainer(container, title);

  showMarkdownModal(md, 'Session Recap — ' + title);
}

/**
 * Export all tabs (or all sections for single-page).
 * Iterates every .tab-panel or every .toggle-section.
 */
function exportSessionRecap() {
  var appTitle = document.querySelector('.app-header h1')
    ? document.querySelector('.app-header h1').textContent.trim()
    : 'Session';

  var md = '# Full Session Recap — ' + appTitle + '\n';
  md += '*Generated: ' + new Date().toLocaleString('en-US', {
    dateStyle: 'long', timeStyle: 'short'
  }) + '*\n\n---\n\n';

  // Multi-tab layout
  var panels = document.querySelectorAll('.tab-panel');
  if (panels.length > 0) {
    panels.forEach(function(panel) {
      var tabId = panel.getAttribute('aria-labelledby');
      var tabBtn = tabId ? document.getElementById(tabId) : null;
      var tabTitle = tabBtn ? tabBtn.textContent.trim() : (panel.id || 'Section');
      md += buildMarkdownForContainer(panel, tabTitle);
      md += '\n---\n\n';
    });
  } else {
    // Single-page layout — collect all sections
    md += buildMarkdownForContainer(null, appTitle);
  }

  showMarkdownModal(md, 'Full Session Recap — ' + appTitle);
}

// ============================================================
// MODAL CONTROLS
// ============================================================

function showMarkdownModal(md, title) {
  var modal = document.getElementById('md-modal');
  var titleEl = document.getElementById('md-modal-title');
  var contentEl = document.getElementById('md-modal-content');
  titleEl.textContent = title;
  contentEl.value = md;
  modal.style.display = 'flex';
  // Focus the copy button for keyboard users
  setTimeout(function() {
    document.getElementById('md-copy-btn').focus();
  }, 50);
}

function closeMarkdownModal() {
  document.getElementById('md-modal').style.display = 'none';
}

function copyModalContent() {
  var content = document.getElementById('md-modal-content').value;
  var btn = document.getElementById('md-copy-btn');
  navigator.clipboard.writeText(content).then(function() {
    btn.textContent = 'Copied \u2713';
    setTimeout(function() { btn.textContent = 'Copy to Clipboard'; }, 2000);
  });
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('md-modal').style.display !== 'none') {
    closeMarkdownModal();
  }
});
```

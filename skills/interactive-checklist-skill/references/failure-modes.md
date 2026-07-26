# Failure Modes — Interactive Checklist Skill

Known anti-patterns from 4 production builds (March–April 2026). Check every build against this list before delivery.

---

## Critical Failures

### 1. Checkbox Triggers Accordion Toggle
**Symptom:** Clicking a checkbox opens or closes the task card.
**Cause:** Click event propagates from checkbox to the parent header's onclick handler.
**Fix:** Add `e.stopPropagation()` on every checkbox click listener:
```javascript
document.querySelectorAll('.task-checkbox').forEach(function(cb) {
  cb.addEventListener('click', function(e) { e.stopPropagation(); });
});
```

### 2. window.storage on Vercel
**Symptom:** App works in Claude artifact preview but breaks completely on deployed Vercel site.
**Cause:** `window.storage` is the Claude artifact persistence API — it does not exist in standard browsers.
**Fix:** Use in-memory state for artifacts (default) or standard `localStorage` for Vercel. Never use `window.storage` for HTML files that will be deployed.

### 3. JSX File on Vercel
**Symptom:** Drag-and-drop to Vercel fails — file is not served as a page.
**Cause:** Vercel cannot serve raw `.jsx` files without a build step. Only `.html` files work for drag-and-drop.
**Fix:** Always output self-contained HTML with inline `<style>` and `<script>`. No React, no JSX, no build dependency.

### 4. Secrets in Output
**Symptom:** Published artifact URL exposes API keys, tokens, or passwords to anyone with the link.
**Cause:** Source content contained real credentials and they were rendered literally.
**Fix:** Replace all actual values with `$ENV_VAR` references. In curl commands: `-H "Authorization: Bearer $AUTH_TOKEN"`. In tables: show 1Password item names, not values.

---

## High-Priority Failures

### 5. Single-Open Accordion
**Symptom:** Opening one task card closes the previously open one. Users can only see one task at a time.
**Cause:** Implemented a single-open accordion pattern instead of multi-open.
**Fix:** Multi-open is mandatory. Each card toggles independently via `classList.toggle('open')`. No logic to close siblings.

### 6. Notes Lost on Tab Switch
**Symptom:** User adds notes, switches tabs, switches back — notes are gone.
**Cause:** Tab switching destroyed and recreated DOM panels instead of toggling visibility.
**Fix:** All tab panels stay in the DOM at all times. Toggle visibility with a CSS class (`display: none` / `display: block`), never remove from DOM.

### 7. Expand All Affects All Tabs
**Symptom:** Clicking "Expand All" on Tab 1 also opens all cards in hidden Tab 2 and Tab 3.
**Cause:** `expandAll()` queries all `.task-card` elements globally instead of scoping to the active panel.
**Fix:** Scope to active tab: `document.querySelector('.tab-panel.active').querySelectorAll('.task-card')`.

### 8. Export Has Stale Data
**Symptom:** Markdown export doesn't reflect the latest checkbox changes or note edits.
**Cause:** Export was cached or generated once and not refreshed.
**Fix:** Always regenerate export from live state. The `generateExport()` function must read current checkbox and textarea values from the DOM at call time.

---

## Medium-Priority Failures

### 9. HAS NOTES Badge Flickers
**Symptom:** The gold "HAS NOTES" badge appears and disappears with every keystroke as the user types.
**Cause:** Note change detection fires on every `input` event without debounce.
**Fix:** Debounce `updateNoteCount()` at 600ms:
```javascript
var noteTimer;
function onNoteInput() {
  clearTimeout(noteTimer);
  noteTimer = setTimeout(updateNoteCount, 600);
}
```

### 10. Progress Bar Wrong at 100%
**Symptom:** Progress bar stays gold at 100% instead of switching to green.
**Cause:** Missing conditional to apply `.complete` class at 100%.
**Fix:**
```javascript
if (pct === 100) {
  fill.classList.add('complete');
} else {
  fill.classList.remove('complete');
}
```

### 11. Centered Body Text
**Symptom:** Everything is centered — looks AI-generated and template-like.
**Cause:** Default centering applied without override.
**Fix:** Left-align all body content, card content, list items, table cells. Center only: hero h1, hero subtitle, stat numbers within stat boxes.

### 12. Missing Copy Buttons
**Symptom:** Code blocks exist without copy-to-clipboard affordance.
**Cause:** Copy buttons not added to every `<pre><code>` element.
**Fix:** Count code blocks and copy buttons — numbers must match. Every `<pre><code>` gets a sibling `<button class="copy-btn">`.

### 13. Responsive Breakage
**Symptom:** At 375px, stats bar overflows horizontally, code blocks break page width.
**Fix:**
- Stats bar: `flex-wrap: wrap` with `min-width` per stat box
- Code blocks: `overflow-x: auto` on `<pre>` (not the page)
- Tables: wrap in `div` with `overflow-x: auto`
- Tab bar: `overflow-x: auto; scroll-snap-type: x mandatory`

---

## Quick-Reference Table

| # | Failure | Severity | Most Common Cause |
|---|---------|----------|-------------------|
| 1 | Checkbox triggers accordion | Critical | Missing stopPropagation |
| 2 | window.storage on Vercel | Critical | Wrong persistence API |
| 3 | JSX on Vercel | Critical | Wrong output format |
| 4 | Secrets in output | Critical | Literal credential rendering |
| 5 | Single-open accordion | High | Wrong accordion pattern |
| 6 | Notes lost on tab switch | High | DOM destruction on switch |
| 7 | Expand All affects all tabs | High | Unscoped DOM query |
| 8 | Export stale data | High | Cached export |
| 9 | HAS NOTES flickers | Medium | No debounce |
| 10 | Progress bar at 100% | Medium | Missing conditional |
| 11 | Centered body text | Medium | Default centering |
| 12 | Missing copy buttons | Medium | Incomplete implementation |
| 13 | Responsive breakage | Medium | No overflow containment |

---

*Failure Modes v1.0 — Interactive Checklist Skill*

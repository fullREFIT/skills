# Diff Output Template

Use this format for Phase 3 output. Goal: the user gets a ready-to-use updated document PLUS full transparency on every change.

---

# Refresh Complete: [Document Name]

**Refreshed:** [date]
**Source:** [original filename]
**Output:** [new filename or paste target]

---

## Part 1 — The updated document

```
[FULL UPDATED DOCUMENT, READY TO PASTE OR SAVE]
```

---

## Part 2 — Changelog

Each entry: original → updated, with classification, confidence, and source.

### Change 1

**Classification:** Platform fact
**Confidence:** HIGH
**Source:** [docs.claude.com URL]

**Before:**
> [original text]

**After:**
> [updated text]

**Why:** [one sentence]

---

### Change 2

[same structure]

---

### Change N

[same structure]

---

## Part 3 — Preserved without modification

Listing what was deliberately NOT changed, so you can verify nothing was silently rewritten.

### Behavioral rules (preserved verbatim)
- [list]

### Institutional knowledge (preserved verbatim)
- [list]

### Stylistic choices (preserved verbatim)
- [list]

### Facts that were fresh (no change needed)
- [list]

---

## Part 4 — Structural changes (if any)

[Only populated if the user approved structural changes or if the refresh required them. If not, this section reads: "No structural changes made. Original structure preserved."]

### Structural change 1
**Type:** [reordering / consolidation / extraction / etc.]
**What changed:** [...]
**Why:** [...]
**Cost of not making this change:** [...]

---

## Part 5 — Residual risks & manual spot-checks

Things the refresh couldn't fully verify, and areas where the user should spot-check before treating this as final.

- **Unverified items:** [list with guidance]
- **Low-confidence updates:** [list with guidance]
- **Areas where Claude's own knowledge may be stale:** [list]
- **Anything dependent on user-specific context Claude doesn't have:** [list]

---

## Part 6 — Test plan

Specific next action to verify the refresh worked.

1. **Regression test:** Run [3-5 canonical prompts the user actually uses against this project] against the updated instructions. Compare outputs to the previous version. Flag any regressions in behavior, voice, or correctness.
2. **Anti-pattern spot-check:** Confirm that [specific anti-patterns from the original doc, e.g., "no 'Great question'"] are still being enforced.
3. **Voice check:** Read the first 3 responses Claude produces with the updated instructions. Do they still sound like how you want the project to sound? If not, that's a signal the refresh smoothed out voice — flag what specifically got blanded and I'll restore it.
4. **Specific next action:** [concrete, e.g., "Save the updated CLAUDE.md to your project root and run `claude code` against your three hardest historical tasks."]

---

## Part 7 — Recommendations for next refresh

Based on what I observed, here's when and how to refresh this document next.

- **Suggested cadence:** [e.g., "quarterly for this document — platform facts move faster than domain facts here"]
- **Signals to watch for:** [things that, if they change, should trigger an out-of-cycle refresh]
- **One-off improvements for next time:** [anything the user might want to tackle that's out of scope for this refresh]

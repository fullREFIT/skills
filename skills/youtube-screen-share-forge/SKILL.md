---
name: youtube-screen-share-forge
description: "Produce branded full-screen presentation slides for YouTube screen sharing in Ecamm Live. Takes a video script's framework section or concept spec and produces a single self-contained HTML file (1920x1080, 16:9) with keyboard-navigable slides. Templates: framework overview, concept reveal, before/after comparison, process flow, data/stat, diagnostic checklist, system architecture, chapter title, summary. Browser capture in Ecamm Live — no additional tools required. MANDATORY TRIGGERS: YouTube screen share, screen share slides, Ecamm slides, framework slides, YouTube slides, presentation slides, screen share forge, video presentation, /youtube-screen-share-forge, /screen-share-forge, /yt-slides, build the slides, make the slides, screen share deck."
license: MIT
metadata:
  version: "2.0.0"
---
# YouTube Screen Share Forge

## Editorial discipline gate (mandatory, run first)

Before producing any slide, run the brand-position test. If a prospect who has never met the creator consumed the finished piece, would they think "this person knows their stuff and could solve a problem like mine," or "their own systems are a mess"? The first passes. The second fails: reframe the creator from the failure case to the observer, the teacher, or the diagnostician (observation, methodology, or industry-pattern reframe), or cut the piece.

Personal working struggles are never content. They do not get reframed into vulnerability. They get left out.

Full diagnostic and reframe templates are in `references/editorial-discipline-gate.md`.

## Voice on every word of copy

Every word that lands on a slide follows the unified voice rules: no em-dashes, no semicolons, no exclamation points, no emojis, no banned words, varied sentence length, a scene or specific to open, a position taken. The canonical banned-word list lives in `editorial-discipline-and-human-style-writing-guide_061526.md`. Read a draft back out loud before it ships.

> Read `references/detail.md` before executing. It contains the full HTML shell, all template code, CSS specs, quality checklist, and output instructions.

Produce a single self-contained HTML presentation file (1920×1080, 16:9) for YouTube screen sharing via Ecamm Live browser window capture. Landscape format, keyboard navigation. Brand tokens from `config.example.md`.

**Output:** One `.html` file. Open in Chrome → press F for fullscreen → Ecamm captures the window. Arrow keys / spacebar advance slides. No external tools.

---

## Prerequisites

- Set brand tokens in `config.example.md` (copy to `config.md` and fill in your values) before building.
- Runtime: Chrome (any modern browser). No Python, no PDF tools.

---

## Workflow

```
STEP 1: PARSE INPUT        → Extract framework section or concept spec
STEP 2: CONTENT STRATEGY   → Slide count, narrative arc, template selection per slide
STEP 3: SLIDE DESIGN       → Assign template + content to each slide; set accent color
STEP 4: HTML BUILD         → Single self-contained HTML file (shell + slides + nav script)
STEP 5: VERIFY             → Quality checklist: legibility, brand, Ecamm compatibility
STEP 6: OUTPUT             → Save to /mnt/user-data/outputs/[video-slug]-slides.html
```

---

## Input Forms

| Form | Source | Extract |
|------|--------|---------|
| A — Script framework section | FRAMEWORK block of script file | Structure, part names, key insights, data points |
| B — Concept spec | Output of `/script-to-lead-magnet` or manual spec | Framework name, 3-6 parts, viewer outcome |
| C — Free-form description | Plain-language brief | Conceptual components, logical sequence, slide count |

---

## Slide Count Targets

| Video type | Target slides |
|-----------|---------------|
| Long-form (8-15 min), framework 50%+ of runtime | 8-14 |
| Short-form demo, entire video | 4-8 |
| Framework overview only | 5-10 |

**Density rule:** 1 slide per 45 seconds of screen share runtime. When in doubt, split — add a Chapter Title slide between major sections rather than cramming content.

---

## Template Index

| Content type | Template |
|-------------|----------|
| Framework name + 3-5 parts shown together | Framework Overview |
| One concept in depth | Concept Reveal |
| Old way vs. new way / problem vs. solution | Before/After Comparison |
| Steps in sequence | Process Flow |
| Number / stat / finding | Data/Stat |
| Viewer self-assessment questions | Diagnostic Checklist |
| System component relationships | System Architecture |
| Major section transition | Chapter Title |
| Final summary of key points | Summary |
| Last slide CTA | Free Resource (CTA) |

**Slide sequence:** Chapter Title → Framework Overview → Concept Reveal (×N) → Summary → Free Resource CTA.

**Accent color rule:** Forge Red (`#D43B2A`) for systems/infrastructure content. Forge Gold (`#FFB400`) for team/enablement content.

---

## Output Spec

- **File name:** `[video-slug]-slides.html`
- **Output path:** `/mnt/user-data/outputs/[video-slug]-slides.html`
- **Speaker notes:** Embed as `<!-- NOTE: "..." -->` comments above each slide div. Not visible in fullscreen; serves as review reference.
- **CTA button text:** Set your CTA URL in `config.example.md`. Always include the full URL (not just the domain).
- **Delivery:** Provide Ecamm Live setup steps with the file (in references/detail.md).

---

*YouTube Screen Share Forge v2.0 — May 2026*
*Conformant to agentskills.io open standard*

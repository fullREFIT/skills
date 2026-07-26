---
name: linkedin-carousel-forge
description: >-
  Produce LinkedIn carousel PDFs and infographic PDFs using a configurable design
  system. Handles the full pipeline: content strategy (pain point mapping, narrative
  arc, slide sequencing), slide design (typographic posters, data comparisons,
  before/after layouts, CTA slides), HTML rendering, and PDF export. Outputs are
  upload-ready for LinkedIn's document carousel format. Also creates standalone
  infographic PDFs for single-image posts. Self-contained with complete brand
  system included — configure brand tokens in config.example.md. MANDATORY TRIGGERS: LinkedIn carousel, carousel post,
  carousel PDF, LinkedIn slides, infographic, infographic PDF, social graphic,
  LinkedIn graphic, carousel design, LinkedIn PDF, slide deck, branded slides,
  social media graphic, branded carousel.
---

# LinkedIn Carousel Forge

Produce upload-ready LinkedIn carousel PDFs and infographic PDFs with your brand design system. Handles content strategy, slide design, rendering, and PDF assembly.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Output Types](#output-types)
3. [Carousel Production Workflow](#carousel-production-workflow)
4. [Infographic Production Workflow](#infographic-production-workflow)
5. [Slide Architecture](#slide-architecture)
6. [Rendering Pipeline](#rendering-pipeline)
7. [Quality Verification](#quality-verification)
8. [Bundled Resources](#bundled-resources)

---

## Prerequisites

**Required tools:** Python 3, Playwright (Chromium), `img2pdf` (pip).

```bash
pip install playwright img2pdf
playwright install chromium
```

**Rendering engine:** Playwright Chromium screenshot at 1080×1080px. `wkhtmltoimage` is deprecated, removed from Homebrew, and must NOT be used. Playwright supports flexbox, grid, Google Fonts CDN — use them freely.

**Brand system:** Default design system included below. Configure brand tokens in `config.example.md` to match your brand.

**Fonts:** Load Outfit + JetBrains Mono via Google Fonts `<link>` tag in every slide. Playwright fetches them at render time. Fallbacks: Poppins → DejaVu Sans Mono.

---

## Default Brand System

### Color Palette

| Element | Hex | Usage |
|---------|-----|-------|
| **Carbon** (Primary Dark) | `#121010` | Dark backgrounds, typography on light |
| **Forge Red** (Accent) | `#D43B2A` | Headlines, CTAs, emphasis |
| **Forge Gold** (Highlight) | `#FFB400` | Accent bars, highlights (dark backgrounds only) |
| **Ash** (Light) | `#F2F0EE` | Light backgrounds, negative space |
| **Forge Dark** (Medium) | `#333130` | Secondary text, borders |

### Typography

| Element | Font | Weight | Usage |
|---------|------|--------|-------|
| **Headlines** | Outfit | Bold (700) | Slide titles, major statements |
| **Body** | Outfit | Regular (400) | Body text, descriptions |
| **Monospace** | JetBrains Mono | Regular | Code, data, technical content |

**Google Fonts:** Load Outfit from Google Fonts CDN. Fallback: Poppins.

### Design Rules

- **No italics** in any text
- **No emojis** anywhere
- **Dark backgrounds** use Forge Gold sparingly (accent bars only)
- **Light backgrounds** use Carbon for text
- **Minimum contrast:** 4.5:1 (WCAG AA)
- **Logo:** PNG with transparent background, black text with red accent slash

### Example HTML Template

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* BRAND TOKENS — update from config.example.md to match your brand */
    :root {
      --carbon: #121010;
      --forge-red: #D43B2A;
      --forge-gold: #FFB400;
      --ash: #F2F0EE;
      --off-white: #F2F0EE; /* canonical alias — same value as --ash */
      --dark: #333130;
      --echo: #878E88;
    }
    /* CRITICAL COLOR RULE: body text is ALWAYS --ash (#F2F0EE). Never --echo (#878E88).
       Echo is only for slide counter and structural navigation labels.
       To de-emphasize text: use smaller font size at off-white, not grey at same size. */
    body {
      font-family: Outfit, sans-serif;
      background-color: var(--carbon);
      color: white;
      margin: 0;
      padding: 40px;
      width: 1080px;
      height: 1080px;
    }
    h1 {
      color: var(--forge-red);
      font-weight: 700;
    }
    .accent-bar {
      background-color: var(--forge-gold);
      height: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <!-- Slide content here -->
</body>
</html>
```

---

## Output Types

This skill produces two output types:

| Type | Format | LinkedIn Upload Method | Dimensions |
|------|--------|----------------------|------------|
| **Carousel** | Multi-page PDF (8-12 slides per post) | New post → Document icon → Upload PDF | 1080x1080px per slide |
| **Infographic** | Single-page PDF or PNG | New post → Image icon → Upload | 1080x1350px (portrait) or 1080x1080px (square) |

Both types use the configured design system exclusively. No deviations.

---

## Carousel Production Workflow

```
STEP 1: CONTENT STRATEGY
  Input: Topic, pain point(s), target cluster
  Output: Slide-by-slide narrative arc
  ↓
STEP 2: SLIDE DESIGN
  Input: Narrative arc
  Output: HTML files (one per slide, 1080x1080px)
  ↓
STEP 3: RENDER
  Input: HTML files
  Output: PNG images (via wkhtmltoimage)
  ↓
STEP 4: ASSEMBLE
  Input: PNG images
  Output: Single PDF file (upload-ready)
  ↓
STEP 5: VERIFY
  Input: PDF + original brief
  Output: Pass/fail against quality checklist
```

### Step 1: Content Strategy

**Slide density rule:** Target 8-12 slides per carousel. Optimal is 10. Split multi-point slides — a hook + problem comparison + 3 mechanism items should be 3 slides, not 1. Every slide covers exactly one idea. When in doubt, split.

Every carousel tells a story across 8-12 slides. Map the narrative arc before designing:

| Slide Position | Purpose | Template Type |
|---------------|---------|---------------|
| **Slide 1** (Hook) | Stop the scroll. Name the pain. Create tension. | `hook` — Bold statement, big typography, minimal elements |
| **Slide 2** (Problem) | Quantify or dramatize the problem | `data-reveal` or `comparison` — Stats, before/after, what's broken |
| **Slide 3** (Mechanism) | Show what the solution looks like | `system-display` or `list-steps` — How it works, what was built |
| **Slide 4** (Proof) | Evidence it works — stories, numbers, outcomes | `story-card` or `data-reveal` — Real results, specific examples |
| **Slide 5** (CTA) | Clear next step with "(Link in the first comment)" | `cta` — Headline + description + button + gold link-in-comment line |
| **Slide 6** (Optional) | Additional proof or the enablement layer | Any template type |

**Narrative arc rules:**
- Slide 1 must be understood by a total stranger in 2 seconds
- No internal jargon anywhere (no pain point numbers, no cluster labels, no "Layer 1/Layer 2" naming)
- Every slide must pass the stranger test: a CEO scrolling LinkedIn at 7am understands it without context
- The Forge Red / Forge Gold color encoding communicates the two-layer model visually without naming it
- Final slide always includes "(Link in the first comment)" in Forge Gold text below the CTA button

### Step 2: Slide Design

Design each slide as self-contained HTML. Follow the slide architecture in the [Slide Architecture](#slide-architecture) section. Use the component library in [`references/slide-system.md`](references/slide-system.md) for exact CSS patterns.

**Critical design rules:**
- Minimum text size: 18px at 1080px render width (anything smaller is illegible in LinkedIn feed)
- Maximum text per slide: ~40 words (this is a visual medium, not a document)
- Dark backgrounds only (Carbon Core `#121010` or Forge Dark `#333130`)
- No gradients, no stock imagery, no AI clichés
- Section labels in JetBrains Mono uppercase only when buyer-facing (never internal taxonomy)
- Wordmark + tagline in footer of every slide

### Step 3-4: Render and Assemble

Use Playwright to render each HTML slide to PNG, then assemble with img2pdf:

```python
from playwright.sync_api import sync_playwright
import img2pdf
from pathlib import Path

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1080})
    for html_file in sorted(Path("slides/").glob("slide-*.html")):
        page.goto(f"file://{html_file.absolute()}")
        page.wait_for_timeout(500)  # allow Google Fonts to load
        page.screenshot(path=str(html_file.with_suffix(".png")),
                        clip={"x": 0, "y": 0, "width": 1080, "height": 1080})
    browser.close()

pngs = sorted(Path("slides/").glob("slide-*.png"))
with open("carousel.pdf", "wb") as f:
    f.write(img2pdf.convert([str(p) for p in pngs]))
```

The `wait_for_timeout(500)` is required to let Google Fonts load before the screenshot.

### Step 5: Verify

Run the quality checklist against every carousel before delivery:

- [ ] Every slide legible at 550px width (LinkedIn desktop feed size)
- [ ] No text below 20px at 1080px render
- [ ] Content fills ~65-75% of the available slide area — no large dead zones
- [ ] No internal jargon — passes stranger test
- [ ] Brand palette exact (hex values from config.example.md)
- [ ] At least one accent color element on every slide
- [ ] Brand wordmark in header AND footer of every slide — see config.example.md for your wordmark format
- [ ] Footer tagline matches your brand config
- [ ] CTA slide includes "(Link in the first comment)" in Forge Gold
- [ ] PDF opens correctly and each page is a separate slide
- [ ] Total file size under 10MB (LinkedIn limit for document uploads)

---

## Infographic Production Workflow

Infographics are single-page visual assets for LinkedIn image posts (not carousels).

### Infographic Types

| Type | Best For | Dimensions | Layout |
|------|----------|-----------|--------|
| **Data Snapshot** | Stats, metrics, comparisons | 1080x1350px (portrait) | 2-3 data blocks with headline |
| **Process Map** | Step-by-step workflows | 1080x1350px (portrait) | Numbered steps with icons/descriptions |
| **Comparison** | Before/after, option A vs B | 1080x1080px (square) | Two-column layout |
| **Checklist** | Actionable lists, evaluation criteria | 1080x1350px (portrait) | Numbered or checked items |
| **Quote Card** | Thesis statement, key insight | 1080x1080px (square) | Large centered text, minimal elements |
| **Proof Point** | Case result, engagement metric | 1080x1080px (square) | Big number + context |

### Infographic Design Rules

All carousel design rules apply, plus:
- Portrait infographics (1080x1350) get more vertical breathing room — use it
- The infographic must communicate one idea completely in one image
- Include your brand wordmark and tagline in footer (see config.example.md)
- For text-heavy infographics (checklists, process maps), use JetBrains Mono for numbering and Outfit for body text
- Always include a CTA line at the bottom: "(Link in the first comment)" in your accent color, plus your CTA URL from config.example.md when the CTA is a resource (lead magnet, tool, prompt kit).

### Rendering Infographics

```bash
python scripts/render-carousel.py --input-dir ./html/ --output infographic-name.pdf --height 1350
```

Use `--height 1350` for portrait format, omit for square (defaults to 1080).

---

## Slide Architecture

### Slide System

Every slide is a 1080×1080px HTML page with this base structure:

```
┌──────────────────────────────────────┐
│  HEADER (wordmark + slide counter)    │  top: 60px
│                                       │
│  ┌────────────────────────────────┐   │
│  │                                │   │
│  │   CONTENT ZONE                 │   │  top:140px → bottom:140px
│  │   (vertically centered         │   │  display:flex; align-items:center
│  │    via flexbox)                │   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                       │
│  FOOTER (wordmark + tagline)          │  bottom: 60px
└──────────────────────────────────────┘
    Background: Carbon Core #121010
    Side padding: 80px left/right
```

**Base HTML skeleton (Playwright-compatible):**

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1080px; overflow:hidden; font-family:Outfit,sans-serif; }
</style>
</head>
<body>
<div style="width:1080px; height:1080px; background:#121010; position:relative;">

  <!-- HEADER -->
  <div style="position:absolute; top:60px; left:80px; right:80px; display:flex; justify-content:space-between; align-items:center;">
    <!-- Wordmark left, slide counter right -->
  </div>

  <!-- CONTENT ZONE — vertically centered via flex -->
  <div style="position:absolute; top:140px; left:80px; right:80px; bottom:140px; display:flex; align-items:center;">
    <div style="width:100%;">
      <!-- Slide-specific content here -->
    </div>
  </div>

  <!-- FOOTER -->
  <div style="position:absolute; bottom:60px; left:80px; right:80px; display:flex; justify-content:space-between; align-items:flex-end;">
    <!-- Wordmark left, tagline right -->
  </div>

</div>
</body></html>
```

**Why this layout:** `position:absolute` with fixed top/bottom creates a bounded content zone (800px tall). `display:flex; align-items:center` vertically centers the content block, distributing dead space equally above and below — the correct design pattern for minimal typographic posters.

### Shared Components

**Wordmark** (header and footer):
```html
<span style="font-family:Outfit,sans-serif; font-weight:400; font-size:22px; letter-spacing:-0.01em; color:#F2F0EE;">
  <span style="font-weight:400;">full</span><span style="color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">REFIT</span>
</span>
```

**Slide counter** (top right):
```html
<div style="font-family:'JetBrains Mono',monospace; font-weight:600; font-size:18px; color:#878E88; letter-spacing:0.04em;">01 / 05</div>
```

**Footer tagline** — SYSTEMS BUILT. in Ash white, TEAMS EQUIPPED. in Forge Gold:
```html
<div style="font-family:'JetBrains Mono',monospace; font-weight:500; font-size:13px; letter-spacing:0.06em; text-transform:uppercase;">
  <span style="color:#F2F0EE;">SYSTEMS BUILT.</span> <span style="color:#FFB400;">TEAMS EQUIPPED.</span>
</div>
```

**Gold label** (section category, JetBrains Mono):
```html
<div style="font-family:'JetBrains Mono',monospace; font-weight:600; font-size:20px; letter-spacing:0.12em; color:#FFB400; text-transform:uppercase; margin-bottom:26px;">LABEL TEXT</div>
```

**Red divider bar:**
```html
<div style="width:100px; height:6px; background:#D43B2A; margin-bottom:44px;"></div>
```

### Template Types

Five production-ready slide templates.

---

**1. `hook`** — The scroll-stopper. Gold label + big headline + red bar + grey sub + gold statement.

```html
<!-- Gold label -->
<div style="font-family:'JetBrains Mono',monospace; font-weight:600; font-size:20px; letter-spacing:0.12em; color:#FFB400; text-transform:uppercase; margin-bottom:26px;">AI OPERATIONS</div>
<!-- Headline: 92px, weight 900 -->
<div style="font-family:Outfit,sans-serif; font-weight:900; font-size:92px; color:#F2F0EE; letter-spacing:-0.03em; line-height:1.06; margin-bottom:32px;">9 subscriptions.<br>Zero workflows.</div>
<!-- Red bar -->
<div style="width:100px; height:6px; background:#D43B2A; margin-bottom:44px;"></div>
<!-- Sub text: 40px, off-white (#F2F0EE) — body text is never grey -->
<div style="font-family:Outfit,sans-serif; font-weight:400; font-size:40px; color:#F2F0EE; line-height:1.4; margin-bottom:28px;">The pattern at every 10–30 person company.</div>
<!-- Gold statement: 34px -->
<div style="font-family:Outfit,sans-serif; font-weight:700; font-size:34px; color:#FFB400; line-height:1.4;">Zero of them are actually inside the business.</div>
```

Font sizes: label 20px, headline 92px/900, sub 40px/400/off-white (#F2F0EE), gold 34px/700.

---

**2. `bullets`** — Problem/insight with arrow-bulleted list. Gold label + headline + 3 arrow items + gold statement.

```html
<!-- Headline: 50px, weight 700 -->
<div style="font-family:Outfit,sans-serif; font-weight:700; font-size:50px; color:#F2F0EE; letter-spacing:-0.02em; line-height:1.15; margin-bottom:40px;">Three costs. One invoice.</div>
<!-- Arrow item (repeat 3×) -->
<div style="display:flex; align-items:flex-start; margin-bottom:30px;">
  <div style="color:#D43B2A; font-size:30px; margin-right:18px; margin-top:2px; flex-shrink:0;">→</div>
  <div style="font-family:Outfit,sans-serif; font-weight:400; font-size:30px; color:#F2F0EE; line-height:1.4;">The subscription — visible, budgeted, accepted</div>
</div>
<!-- Gold statement: 32px -->
<div style="margin-top:10px; font-family:Outfit,sans-serif; font-weight:700; font-size:32px; color:#FFB400; line-height:1.4;">The subscription is always the cheapest part.</div>
```

Font sizes: headline 50px/700, arrow 30px, gold 32px/700.

---

**3. `system`** — Mechanism/how-it-works. Gold label + headline + 3 left-bordered items with sub-text + gold statement.

```html
<!-- Headline: 54px, weight 700, multi-line -->
<div style="font-family:Outfit,sans-serif; font-weight:700; font-size:54px; color:#F2F0EE; letter-spacing:-0.02em; line-height:1.12; margin-bottom:36px;">Tools require workflows.<br>Workflows require owners.</div>
<!-- Border item (repeat 3×, border color alternates Red/Red/Red or Red/Gold) -->
<div style="border-left:5px solid #D43B2A; padding-left:24px; margin-bottom:30px;">
  <div style="font-family:Outfit,sans-serif; font-weight:700; font-size:28px; color:#F2F0EE; line-height:1.3;">Name the specific workflow each tool lives inside</div>
  <div style="font-family:Outfit,sans-serif; font-weight:400; font-size:22px; color:#F2F0EE; line-height:1.4; margin-top:8px;">Not 'sales productivity' — actual documented steps</div>
</div>
<!-- Gold statement: 32px -->
<div style="margin-top:10px; font-family:Outfit,sans-serif; font-weight:700; font-size:32px; color:#FFB400; line-height:1.4;">If you can't name the workflow, you're paying for a placeholder.</div>
```

Font sizes: headline 54px/700, item title 28px/700, item sub 22px/400/off-white (#F2F0EE), gold 32px/700.

---

**4. `story`** — Proof/test. Gold label + headline + dark card + red closing statement.

```html
<!-- Headline: 52px, weight 700 -->
<div style="font-family:Outfit,sans-serif; font-weight:700; font-size:52px; color:#F2F0EE; letter-spacing:-0.02em; line-height:1.12; margin-bottom:36px;">Pull your subscription list.</div>
<!-- Dark card -->
<div style="background:#333130; border-radius:16px; padding:44px; border-left:6px solid #D43B2A; margin-bottom:30px;">
  <div style="font-family:Outfit,sans-serif; font-weight:700; font-size:30px; color:#F2F0EE; line-height:1.3; margin-bottom:16px;">For every tool without a named workflow:</div>
  <div style="font-family:Outfit,sans-serif; font-weight:400; font-size:26px; color:#F2F0EE; line-height:1.5;">Cut it or build the workflow around it now.</div>
</div>
<!-- Red closing statement: 32px -->
<div style="font-family:Outfit,sans-serif; font-weight:700; font-size:32px; color:#D43B2A; line-height:1.4;">Two choices per tool. No third option.</div>
```

Font sizes: headline 52px/700, card title 30px/700, card body 26px/400, red close 32px/700.

---

**5. `cta`** — Call to action. Centered layout with wordmark, bar, headline, body, button, gold link line.

```html
<div style="text-align:center;">
  <!-- Large wordmark: 40px -->
  <div style="margin-bottom:32px;"><!-- wordmark at 40px --></div>
  <!-- Bar centered -->
  <div style="width:100px; height:6px; background:#D43B2A; margin:0 auto 36px auto;"></div>
  <!-- Headline: 52px, weight 700 -->
  <div style="font-family:Outfit,sans-serif; font-weight:700; font-size:52px; color:#F2F0EE; letter-spacing:-0.02em; line-height:1.2; max-width:840px; margin:0 auto;">Find out what your AI tools are actually costing you.</div>
  <!-- Body: 28px, off-white (#F2F0EE) — body text is never grey -->
  <div style="font-family:Outfit,sans-serif; font-size:28px; color:#F2F0EE; margin-top:28px; line-height:1.5; max-width:760px; margin-left:auto; margin-right:auto;">The Team AI Cost Calculator. Enter your tools, team size, and usage patterns.</div>
  <!-- Red button: 28px -->
  <div style="display:inline-block; margin-top:44px; padding:24px 56px; background:#D43B2A; border-radius:14px; font-family:Outfit,sans-serif; font-weight:700; font-size:28px; color:#FFFFFF;">Run the free calculation</div>
  <!-- Gold link line: 26px -->
  <div style="margin-top:26px; font-family:Outfit,sans-serif; font-weight:600; font-size:26px; color:#FFB400;">(Link in the first comment)</div>
</div>
```

Font sizes: wordmark 40px, headline 52px/700, body 28px/off-white (#F2F0EE), button 28px/700, link-in-comment 26px/gold.

---

### Layout Rules (Playwright)

Playwright uses a full modern Chromium engine. All standard CSS works:

**Use freely:**
- `display:flex` and `flex-direction`, `align-items`, `justify-content`
- `position:absolute` with pixel offsets
- Google Fonts via `<link>` tag (with 500ms wait before screenshot)
- `gap`, `grid`, any modern CSS

**Always:**
- Inline styles on every element (no `<style>` blocks in body, no external CSS)
- `wait_for_timeout(500)` in Playwright before screenshot (allows fonts to load)
- `overflow:hidden` on the body to prevent any bleed

---

## Rendering Pipeline

### Requirements

| Dependency | Install | Purpose |
|-----------|---------|---------|
| Python 3 | Pre-installed | Script runtime |
| Playwright | `pip install playwright && playwright install chromium` | HTML → PNG rendering |
| img2pdf | `pip install img2pdf` | PNG → PDF assembly |

### Production Script Pattern

```python
#!/usr/bin/env python3
import img2pdf
from pathlib import Path
from datetime import datetime
from playwright.sync_api import sync_playwright

RUN_DIR = Path(f"_runs/run-{datetime.now().strftime('%Y%m%d-%H%M%S')}")

def render_slides(post_id, slides_dir, html_files):
    """Render a list of HTML files to PNGs and return PNG paths."""
    pngs = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1080})
        for html_path in html_files:
            page.goto(f"file://{Path(html_path).absolute()}")
            page.wait_for_timeout(500)  # Google Fonts load time
            png_path = Path(html_path).with_suffix(".png")
            page.screenshot(path=str(png_path),
                            clip={"x": 0, "y": 0, "width": 1080, "height": 1080})
            pngs.append(png_path)
        browser.close()
    return pngs

def build_pdf(pngs, output_path):
    with open(output_path, "wb") as f:
        f.write(img2pdf.convert([str(p) for p in pngs]))
```

### Run Structure

Each generation run is isolated in a timestamped directory:

```
_runs/
  run-20260421-005613/
    F01-ai-subscriptions-zero-workflows/
      slides/
        slide-01.html
        slide-01.png
        ...
      F01-carousel.pdf
```

Output is copied to `output-v1/` after generation. Each post folder in output-v1 should contain:
- `F##-carousel.pdf` — the upload-ready carousel
- `F##-post.md` — the LinkedIn post text (frontmatter + body)
- `slides/` — individual PNG slides for reference

---

## Quality Verification

### Legibility Test

Open the PDF at 50% zoom. If any text is unreadable, it will be unreadable in the LinkedIn feed. Fix before delivery.

### Stranger Test

Show any slide to someone who has never heard of full/REFIT. Ask: "What is this about?" If they can't answer in 5 seconds, the slide fails. Rewrite.

### Brand Compliance

| Element | Requirement | Verification |
|---------|------------|-------------|
| Background | Carbon Core `#121010` | Visual check |
| Card backgrounds | Forge Dark `#333130` | Used inside story/system cards only |
| Primary accent | Forge Red `#D43B2A` | Arrow bullets, bar, card borders, CTA button |
| Secondary accent | Forge Gold `#FFB400` | Labels, gold statements, link-in-comment, TEAMS EQUIPPED. |
| Ash white | `#F2F0EE` | Primary text, SYSTEMS BUILT. in footer tagline |
| Echo grey | `#878E88` | Slide counter, t-label only — never body text |
| Primary font | Outfit (fallback: Poppins) | Weight 400/700/900 |
| Mono font | JetBrains Mono (fallback: DejaVu Sans Mono) | Labels, slide counter, footer tagline |
| Wordmark | "full" Outfit Regular (400) full-opacity white + "/" in Forge Red + "REFIT" Outfit Bold (700) | In header AND footer of every slide |
| Footer tagline | "SYSTEMS BUILT." in `#F2F0EE` + "TEAMS EQUIPPED." in `#FFB400` | Every slide |
| Gold on every slide | At least one Forge Gold element per slide | Labels, gold statements, or tagline counts |
| No italics | Anywhere | Zero tolerance |
| No emojis | Anywhere | Zero tolerance |
| No gradients | As primary treatments | Zero tolerance |

---

## Bundled Resources

| File | Purpose | When to Load |
|------|---------|-------------|
| [`references/slide-system.md`](references/slide-system.md) | Complete HTML/CSS for all 7 slide templates, component library, wkhtmltoimage-compatible patterns | Every carousel or infographic build |
| [`references/content-strategy-guide.md`](references/content-strategy-guide.md) | Pain point → narrative arc mapping, CTA assignment rules, ICA symptom cluster targeting | When planning carousel content strategy |
| [`references/manual-render-guide.md`](references/manual-render-guide.md) | Step-by-step rendering without the script (browser screenshots, external tools) | When wkhtmltoimage is unavailable |
| [`scripts/render-carousel.py`](scripts/render-carousel.py) | Python script: HTML → PNG → PDF pipeline | Every render operation |
| [`assets/post-text-templates.md`](assets/post-text-templates.md) | LinkedIn post caption templates with CTA formatting and hashtag rules | When writing the post text that accompanies the carousel |
| _(your own production reference)_ | Governing production reference: folder structure, frontmatter schema, CTA rotation rules, quality checklist, publishing steps | When producing a complete paired post package (PDF + text) |

---

*LinkedIn Carousel Forge v2.1 — May 2026*
*Updated: Playwright rendering, 5-template system, correct font scales, footer color split*
*Conformant to agentskills.io open standard (December 2025)*

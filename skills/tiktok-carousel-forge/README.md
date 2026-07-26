# TikTok Carousel Forge

Produce TikTok vertical carousel image sets (1080×1920 PNG, 9:16) from an existing LinkedIn carousel package in the Carbon Forge design system.

## What it does

- Reads LinkedIn carousel HTML slides from `LIC-linkedin-carousel/slides/`
- Reflows each slide to the 1080×1920 vertical canvas using documented Carbon Forge reflow rules
- Renders via Playwright Chromium (700ms font-load wait per slide)
- Verifies every PNG is exactly 1080×1920 and non-blank
- Writes a platform-compliant `tt-caption_{slug}_{MMDDYY}.md` caption file
- Stages everything into `TT-tiktok-carousel/`

## Prerequisites

```bash
pip install playwright pillow
playwright install chromium
```

## Installation

Add to Claude Code, Codex, Hermes, or Cursor by uploading `tiktok-carousel-forge.zip` via the skills interface, or place this folder in your skills directory.

## Usage

Invoke with any of these phrases in Claude Code or compatible surfaces:

- `tiktok carousel`
- `TT carousel`
- `produce tiktok`
- `build tiktok`
- `re-render tiktok`
- `/tiktok-carousel-forge`

### Standalone (re-render after a carousel revision)

```
build the tiktok carousel for --package /path/to/NNN-slug
```

### From rev-content-2-produce

Step 6 of rev-content-2-produce calls this skill automatically. No separate invocation needed.

## File Structure

```
tiktok-carousel-forge/
├── SKILL.md                      # Agent instructions (load when triggered)
├── README.md                     # This file
├── references/
│   ├── tt-reflow-rules.md        # Vertical reflow rules + HTML templates
│   └── tt-format-specs.md        # Platform rules for TikTok images and caption
├── scripts/
│   └── render_tt_carousel.py     # Parameterized Playwright renderer
├── assets/                       # (empty — no static assets needed)
└── tiktok-carousel-forge.zip     # Deployment archive
```

## Output

```
TT-tiktok-carousel/
  slides-vertical/
    slide-vertical-01.html
    slide-vertical-02.html
    ...
  tiktok-carousel_{slug}_{MMDDYY}_01.png
  tiktok-carousel_{slug}_{MMDDYY}_02.png
  ...
  tt-caption_{slug}_{MMDDYY}.md
  build_tt_carousel.py            (hardcoded copy for re-runs)
```

## Related Skills

- `linkedin-carousel-forge` — builds the source carousel this skill reads from
- `instagram-carousel-forge` — produces the square 1:1 version of the same content
- `rev-content-2-produce` — invokes both IG and TikTok forge as steps 5 and 6

---

*tiktok-carousel-forge v1.0.0 — July 2026 | Carbon Forge design system | agentskills.io open standard*

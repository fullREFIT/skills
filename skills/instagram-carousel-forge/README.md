# Instagram Carousel Forge

Produce Instagram carousel image sets (1080×1080 PNG) from an existing LinkedIn carousel package .

## What it does

- Copies 1080×1080 PNGs from `LIC-linkedin-carousel/slides/` and renames them to the IG naming convention
- Verifies each PNG is exactly 1080×1080 and non-blank
- Writes a platform-compliant `ig-caption_{slug}_{MMDDYY}.md` caption file
- Stages everything into `IG-instagram-carousel/`

## Prerequisites

```bash
pip install pillow
```

## Installation

Add to Claude Code, Codex, Hermes, or Cursor by uploading `instagram-carousel-forge.zip` via the skills interface, or place this folder in your skills directory.

## Usage

Invoke with any of these phrases in Claude Code or compatible surfaces:

- `instagram carousel`
- `IG carousel`
- `instagram post`
- `produce instagram`
- `re-render instagram`
- `/instagram-carousel-forge`

### Standalone (re-render after a carousel revision)

```
produce the instagram carousel for --package /path/to/NNN-slug
```

### From rev-content-2-produce

Step 5 of rev-content-2-produce calls this skill automatically. No separate invocation needed.

## File Structure

```
instagram-carousel-forge/
├── SKILL.md                      # Agent instructions (load when triggered)
├── README.md                     # This file
├── references/
│   └── ig-format-specs.md        # Platform rules for IG images and caption
├── scripts/
│   └── build_ig_carousel.py      # Parameterized PNG copy + rename + verify script
├── assets/                       # (empty — no static assets needed)
└── instagram-carousel-forge.zip  # Deployment archive
```

## Output

```
IG-instagram-carousel/
  ig-carousel_{slug}_{MMDDYY}_01.png
  ig-carousel_{slug}_{MMDDYY}_02.png
  ...
  ig-caption_{slug}_{MMDDYY}.md
  build_ig_carousel.py            (hardcoded copy for re-runs)
```

## Related Skills

- `linkedin-carousel-forge` — builds the source carousel this skill copies from
- `tiktok-carousel-forge` — produces the vertical 9:16 version of the same content
- `rev-content-2-produce` — invokes both IG and TikTok forge as steps 5 and 6

---

*instagram-carousel-forge v1.0.0 — July 2026  | agentskills.io open standard*

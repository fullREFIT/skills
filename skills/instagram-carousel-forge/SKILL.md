---
name: instagram-carousel-forge
description: "Produce Instagram carousel image sets (1080×1080 PNG) from an existing LinkedIn carousel package or content brief. Copies and renames slide PNGs from LIC-linkedin-carousel/slides/, verifies each image is exactly 1080×1080 and non-blank, writes an ig-caption_{slug}_{MMDDYY}.md caption file, and stages everything into IG-instagram-carousel/. Works standalone for re-renders after carousel revisions, MANDATORY TRIGGERS: instagram carousel, IG carousel, instagram post, instagram images, produce instagram, build instagram, ig-carousel, instagram-carousel-forge, IG PNGs, re-render instagram, instagram content, instagram slides."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  argument-hint: "[--package /path/to/NNN-slug] [--slug slug] [--date MMDDYY] [--slides-dir /path/to/slides]"
  user-invocable: "true"
  version: "1.0.0"
---
# Instagram Carousel Forge

Produce an Instagram carousel image set (1080×1080 PNGs) and caption file from an existing LinkedIn carousel package. Works standalone for re-renders.

## Prerequisites

```bash
pip install pillow
```

Playwright is NOT required for Instagram — IG PNGs are copied from the already-rendered LinkedIn carousel slides.

## Input

Provide one of:

- `--package /path/to/NNN-slug` — full path to a content title folder. The skill reads `LIC-linkedin-carousel/slides/slide-*.png` automatically.
- `--slides-dir /path/to/slides` — direct path to a folder of `slide-*.png` files (1080×1080). Required alongside `--slug` and `--date`.
- Inline (no args) — skill infers the title folder from the current working directory.

Required with `--slides-dir` or inline:
- `--slug` — the content slug (e.g. `ai-agent-budget`)
- `--date` — the date string MMDDYY (e.g. `071326`)

Also reads (when available):
- `LI-linkedin-post/linkedin-post_{slug}_{MMDDYY}.md` — source for caption derivation
- `LI-linkedin-post/first-comment_{slug}_{MMDDYY}.md` — CTA link reference

## Process

1. **Locate source slides.** Find `LIC-linkedin-carousel/slides/slide-*.png`. If fewer than 6 exist, stop and report — the LinkedIn carousel is incomplete and must be built first.
2. **Copy and rename.** Run `scripts/build_ig_carousel.py` with the source slides path, output directory, slug, and date. The script copies each PNG to `IG-instagram-carousel/ig-carousel_{slug}_{MMDDYY}_{NN}.png`.
3. **Verify.** Confirm every PNG is exactly 1080×1080 and file size > 5 KB. Report any failures.
4. **Write caption.** Read the LinkedIn post file. Derive the IG caption following the rules in `references/ig-format-specs.md`. Write `IG-instagram-carousel/ig-caption_{slug}_{MMDDYY}.md`.
5. **Archive build script.** Write a hardcoded copy of `build_ig_carousel.py` with the slug, date, and paths filled in at `IG-instagram-carousel/build_ig_carousel.py` for future re-runs without CLI args.

## Output Structure

```
IG-instagram-carousel/
  ig-carousel_{slug}_{MMDDYY}_01.png
  ig-carousel_{slug}_{MMDDYY}_02.png
  ...
  ig-caption_{slug}_{MMDDYY}.md
  build_ig_carousel.py
```

## IG Caption Rules (summary — full rules in references/ig-format-specs.md)

- Max 2,200 characters
- Same opening live wire as the LinkedIn post — do not re-angle
- Same CTA family — adapt the copy for IG character limits, preserve the ask
- No link in the caption body — end with "link in bio" or "link in first comment"
- Hashtags: 5–10, placed at the end of the caption. No spaces, lowercase, no branded terms per Module B.
- No exclamation points, no em dashes, no semicolons, no emoji

## Re-render use

If the LinkedIn carousel was revised after the initial IG export, run this skill again with `--package`. It overwrites the IG-instagram-carousel/ folder in-place. Do not rewrite the caption unless the carousel copy changed.

## Acceptance

- `IG-instagram-carousel/` exists with one PNG per source slide (minimum 6)
- Every PNG is exactly 1080×1080 and > 5 KB (confirmed by script output)
- `ig-caption_{slug}_{MMDDYY}.md` exists with caption text and hashtags
- The opening line of the caption matches the opening live wire of the LinkedIn post
- No PNG is blank (visually verify slide 1 and the final slide)
- `build_ig_carousel.py` is present for re-render capability

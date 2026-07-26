---
name: tiktok-carousel-forge
description: "Produce TikTok vertical carousel image sets (1080×1920 PNG, 9:16) from an existing LinkedIn carousel package. Reads LIC-linkedin-carousel/slides/ HTML files, reflows each slide to the vertical canvas using documented reflow rules, renders via Playwright Chromium, verifies every PNG is exactly 1080×1920 and non-blank, writes a tt-caption_{slug}_{MMDDYY}.md file, and stages everything into TT-tiktok-carousel/. Works standalone for re-renders after carousel revisions. Brand tokens (wordmark, tagline, colors) are set in config.example.md. MANDATORY TRIGGERS: tiktok carousel, TT carousel, tiktok post, tiktok images, produce tiktok, build tiktok, tt-carousel, tiktok-carousel-forge, TikTok PNGs, re-render tiktok, tiktok content, vertical carousel, 9:16 carousel."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  argument-hint: "[--package /path/to/NNN-slug] [--slug slug] [--date MMDDYY]"
  user-invocable: "true"
  version: "1.0.0"
---
# TikTok Carousel Forge

Produce a TikTok vertical carousel image set (1080×1920 PNGs, 9:16) and caption file from an existing LinkedIn carousel package. Same content, vertical container. Use `config.example.md` to set your brand tokens (wordmark, tagline, colors) before first use.

## Prerequisites

```bash
pip install playwright pillow
playwright install chromium
```

## Input

Provide one of:

- `--package /path/to/NNN-slug` — full path to a content title folder
- Inline (no args) — skill infers the title folder from the current working directory

The package must contain `LIC-linkedin-carousel/slides/slide-*.html` — the source HTML files the LinkedIn carousel was built from. Also reads:
- `LI-linkedin-post/linkedin-post_{slug}_{MMDDYY}.md` — for caption derivation and content sync verification
- `LI-linkedin-post/first-comment_{slug}_{MMDDYY}.md` — for the CTA link reference

## Process

1. **Read source HTML slides.** Load each `LIC-linkedin-carousel/slides/slide-{NN}.html` file. Extract the content structure: headline, body text, labels, list items, CTA copy, and any data values from each slide.

2. **Reflow to vertical.** For each slide, create a new 1080×1920 HTML document applying the vertical reflow rules in `references/tt-reflow-rules.md`. Key changes: canvas becomes 1080×1920, content zone padding becomes 200px top/bottom (was 140px), and font sizes scale up per the reflow table. Your brand tokens from `config.example.md` (colors, wordmark, tagline, fonts) are preserved exactly. Content is NOT re-angled or re-worded — same live wire, same CTA, same claims.

3. **Write vertical HTML files.** Save each reflowed slide as `TT-tiktok-carousel/slides-vertical/slide-vertical-{NN}.html`.

4. **Render via Playwright.** Run `scripts/render_tt_carousel.py` with the slides-vertical directory and output directory. Playwright Chromium renders each HTML file at a 1080×1920 viewport and screenshots it to `TT-tiktok-carousel/tiktok-carousel_{slug}_{MMDDYY}_{NN}.png`. Wait 700ms before each screenshot to allow Google Fonts to load.

5. **Verify.** Confirm every PNG is exactly 1080×1920 and file size > 5 KB. Report any failures.

6. **Content sync check.** Read slide 1 and the CTA slide of both the LinkedIn carousel and the TikTok set. Confirm the headline and CTA text match exactly. Any drift is a production error — re-render the affected slides.

7. **Write caption.** Read the LinkedIn post file. Derive the TikTok caption following the rules in `references/tt-format-specs.md`. Write `TT-tiktok-carousel/tt-caption_{slug}_{MMDDYY}.md`.

8. **Archive build script.** Write a hardcoded copy of `render_tt_carousel.py` with the slug, date, and paths filled in at `TT-tiktok-carousel/build_tt_carousel.py` for future re-runs without CLI args.

## Output Structure

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
  build_tt_carousel.py
```

## Vertical Reflow Rules (summary — full rules in references/tt-reflow-rules.md)

| Element | LinkedIn 1080×1080 | TikTok 1080×1920 |
|---------|-------------------|-----------------|
| Canvas | 1080×1080 | 1080×1920 |
| Content zone | top:140px / bottom:140px | top:200px / bottom:200px |
| Hook headline | 74–92px, weight 900 | 92px, weight 900 |
| Body text | 34–38px | 42–46px |
| Gold label | 20px, JetBrains Mono | 20px (unchanged) |
| Red divider bar | width:100px | width:140px |
| Gold statement | 32–34px | 38px |
| Wordmark/footer | unchanged | unchanged |

All brand tokens from `config.example.md` are preserved across LinkedIn and TikTok: colors, fonts (Outfit + JetBrains Mono via Google CDN), wordmark, and footer tagline placement.

## TikTok Caption Rules (summary — full rules in references/tt-format-specs.md)

- Max 4,000 characters (TikTok limit)
- Same opening live wire as LinkedIn post — no re-angling
- Typically shorter than LinkedIn: strip the longer body sections, keep the core tension and CTA
- Hashtags: 3–8 at end of caption (or inline). No branded terms.
- No exclamation points, no em dashes, no semicolons, no emoji
- No link in caption — end with "link in bio"

## Re-render use

If the LinkedIn carousel was revised, run this skill again with `--package`. Re-read the updated HTML slides, reflow fresh, re-render. The TT-tiktok-carousel/ folder is overwritten in-place. Do not rewrite the caption unless the carousel copy changed.

## Content Sync Guarantee

TikTok and LinkedIn/Instagram always show the same content. The reflow changes dimensions and scales typography only. Verify by comparing:
- Slide 1 headline text: must match exactly
- CTA slide headline and button text: must match exactly
- Slide count: must match the LinkedIn carousel

Any content difference between formats is a bug, not a design choice.

## Acceptance

- `TT-tiktok-carousel/slides-vertical/` contains one HTML file per LinkedIn carousel slide
- `TT-tiktok-carousel/` contains one PNG per source slide (minimum 6)
- Every PNG is exactly 1080×1920 and > 5 KB (confirmed by render script output)
- `tt-caption_{slug}_{MMDDYY}.md` exists with caption and hashtags
- Slide 1 headline and CTA text match the LinkedIn carousel exactly
- `build_tt_carousel.py` is present for re-render capability

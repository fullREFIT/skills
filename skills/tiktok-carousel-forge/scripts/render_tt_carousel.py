#!/usr/bin/env python3
"""
render_tt_carousel.py — Carbon Forge TikTok vertical carousel renderer
Renders slide-vertical-NN.html files at 1080x1920 via Playwright Chromium.
Verifies each PNG: exact 1080x1920 and file size > 5 KB.

Usage (parameterized):
    python render_tt_carousel.py \
        --slides-dir /path/to/TT-tiktok-carousel/slides-vertical \
        --output-dir /path/to/TT-tiktok-carousel \
        --slug ai-agent-budget \
        --date 071326

Usage (hardcoded — for per-piece archived copies):
    Set SLUG, DATE, SLIDES_DIR, OUTPUT_DIR below and run without args.

Prerequisites:
    pip install playwright pillow
    playwright install chromium
"""

import argparse
import sys
from pathlib import Path

# Hardcoded values for archived per-piece copies — override with CLI args
SLUG = ""
DATE = ""
SLIDES_DIR = ""
OUTPUT_DIR = ""

VIEWPORT_W = 1080
VIEWPORT_H = 1920
FONT_WAIT_MS = 700


def render_slides(slides_dir: Path, output_dir: Path, slug: str, date: str) -> list:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: playwright not installed. Run: pip install playwright && playwright install chromium", file=sys.stderr)
        sys.exit(1)

    html_files = sorted(slides_dir.glob("slide-vertical-*.html"))
    if len(html_files) < 6:
        print(
            f"ERROR: only {len(html_files)} vertical HTML files found in {slides_dir}. "
            "Need at least 6. Build the vertical HTML slides first.",
            file=sys.stderr,
        )
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)
    png_files = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": VIEWPORT_W, "height": VIEWPORT_H})

        for i, html_path in enumerate(html_files, 1):
            page.goto(f"file://{html_path.absolute()}")
            page.wait_for_timeout(FONT_WAIT_MS)
            png_path = output_dir / f"tiktok-carousel_{slug}_{date}_{i:02d}.png"
            page.screenshot(
                path=str(png_path),
                clip={"x": 0, "y": 0, "width": VIEWPORT_W, "height": VIEWPORT_H},
            )
            png_files.append(png_path)
            print(f"  rendered: {png_path.name}")

        browser.close()

    return png_files


def verify_pngs(png_files: list) -> bool:
    try:
        from PIL import Image
        pil_available = True
    except ImportError:
        print("WARNING: pillow not installed — skipping dimension verification. Run: pip install pillow")
        pil_available = False

    print("\nPNG verification:")
    all_ok = True

    for p in png_files:
        p = Path(p)
        if not p.exists():
            print(f"  FAIL — missing: {p.name}")
            all_ok = False
            continue

        size = p.stat().st_size
        if size < 5000:
            print(f"  FAIL — too small ({size} bytes): {p.name}")
            all_ok = False
            continue

        if pil_available:
            with Image.open(p) as img:
                w, h = img.size
                if w != VIEWPORT_W or h != VIEWPORT_H:
                    print(f"  FAIL — wrong dimensions {w}x{h}: {p.name}")
                    all_ok = False
                else:
                    print(f"  OK    — {w}x{h}, {size // 1024} KB: {p.name}")
        else:
            print(f"  OK    — {size // 1024} KB: {p.name} (dimensions not verified)")

    return all_ok


def main():
    parser = argparse.ArgumentParser(
        description="Render TikTok vertical carousel slides via Playwright"
    )
    parser.add_argument("--slides-dir", help="Path to slides-vertical/ folder containing slide-vertical-NN.html files")
    parser.add_argument("--output-dir", help="Output directory for TikTok PNGs")
    parser.add_argument("--slug", help="Content slug (e.g. ai-agent-budget)")
    parser.add_argument("--date", help="Date string MMDDYY (e.g. 071326)")
    args = parser.parse_args()

    slug = args.slug or SLUG
    date = args.date or DATE
    slides_str = args.slides_dir or SLIDES_DIR
    output_str = args.output_dir or OUTPUT_DIR

    if not all([slug, date, slides_str, output_str]):
        parser.print_help()
        print(
            "\nERROR: provide --slides-dir, --output-dir, --slug, --date "
            "or set the hardcoded values at the top of this script.",
            file=sys.stderr,
        )
        sys.exit(1)

    slides_dir = Path(slides_str)
    output_dir = Path(output_str)

    if not slides_dir.exists():
        print(f"ERROR: slides directory not found: {slides_dir}", file=sys.stderr)
        sys.exit(1)

    print(f"Rendering {VIEWPORT_W}x{VIEWPORT_H} TikTok slides from {slides_dir} ...")
    png_files = render_slides(slides_dir, output_dir, slug, date)

    all_ok = verify_pngs(png_files)
    if all_ok:
        print(f"\nAll {len(png_files)} TikTok PNGs: PASS ({VIEWPORT_W}x{VIEWPORT_H}, >5 KB)")
    else:
        print(f"\nTikTok PNG verification: one or more failures above")
        sys.exit(1)


if __name__ == "__main__":
    main()

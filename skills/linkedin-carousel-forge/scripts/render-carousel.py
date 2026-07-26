#!/usr/bin/env python3
"""
LinkedIn Carousel Forge — Render Pipeline v2.0
Converts HTML slide files to a single PDF carousel for LinkedIn upload.

Uses Playwright (Chromium) for rendering — NOT wkhtmltoimage (deprecated).

Usage:
    python render-carousel.py --input-dir ./slides/ --output carousel.pdf
    python render-carousel.py --input-dir ./slides/ --output infographic.pdf --height 1350

Requirements:
    pip install playwright img2pdf
    playwright install chromium

The script:
    1. Reads all .html files from --input-dir (sorted alphabetically)
    2. Renders each to PNG at specified dimensions via Playwright Chromium
    3. Waits 500ms per slide for Google Fonts to load
    4. Combines all PNGs into a single PDF via img2pdf
    5. Reports per-slide status and final PDF size
"""

import argparse
import os
import sys
from pathlib import Path


def check_dependencies():
    missing = []
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        missing.append("playwright (pip install playwright && playwright install chromium)")
    try:
        import img2pdf
    except ImportError:
        missing.append("img2pdf (pip install img2pdf)")
    if missing:
        print(f"ERROR: Missing dependencies: {', '.join(missing)}")
        sys.exit(1)


def find_html_files(input_dir):
    d = Path(input_dir)
    if not d.is_dir():
        print(f"ERROR: Input directory does not exist: {input_dir}")
        sys.exit(1)
    html_files = sorted(d.glob("*.html"))
    if not html_files:
        print(f"ERROR: No .html files found in {input_dir}")
        sys.exit(1)
    return html_files


def render_slides(html_files, width, height, font_wait_ms=500):
    """Render HTML files to PNGs using Playwright. Returns list of PNG paths."""
    from playwright.sync_api import sync_playwright

    png_files = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})

        for i, html_path in enumerate(html_files, 1):
            png_path = html_path.with_suffix(".png")
            try:
                page.goto(f"file://{html_path.absolute()}")
                page.wait_for_timeout(font_wait_ms)  # allow Google Fonts to load
                page.screenshot(
                    path=str(png_path),
                    clip={"x": 0, "y": 0, "width": width, "height": height}
                )
                size = png_path.stat().st_size
                print(f"  [{i}/{len(html_files)}] {html_path.name} → {size:,} bytes")
                png_files.append(png_path)
            except Exception as e:
                print(f"  [{i}/{len(html_files)}] {html_path.name} → FAILED: {e}")

        browser.close()

    return png_files


def assemble_pdf(png_files, output_path):
    import img2pdf
    missing = [f for f in png_files if not f.exists()]
    if missing:
        print(f"ERROR: Missing {len(missing)} PNG files.")
        return False
    try:
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert([str(p) for p in png_files]))
        return True
    except Exception as e:
        print(f"ERROR: PDF assembly failed: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Render HTML slides to LinkedIn carousel PDF (Playwright)"
    )
    parser.add_argument("--input-dir", required=True,
                        help="Directory containing HTML slide files")
    parser.add_argument("--output", required=True,
                        help="Output PDF file path")
    parser.add_argument("--width", type=int, default=1080,
                        help="Slide width in pixels (default: 1080)")
    parser.add_argument("--height", type=int, default=1080,
                        help="Slide height in pixels (default: 1080, use 1350 for portrait)")
    parser.add_argument("--font-wait", type=int, default=500,
                        help="Milliseconds to wait for Google Fonts to load (default: 500)")

    args = parser.parse_args()

    print(f"LinkedIn Carousel Forge v2.0 — Playwright Render Pipeline")
    print(f"  Input:  {args.input_dir}")
    print(f"  Output: {args.output}")
    print(f"  Size:   {args.width}x{args.height}px")
    print()

    check_dependencies()

    html_files = find_html_files(args.input_dir)
    print(f"Found {len(html_files)} HTML slides.")
    print()

    png_files = render_slides(html_files, args.width, args.height, args.font_wait)

    if not png_files:
        print("ERROR: No slides rendered successfully. Aborting.")
        sys.exit(1)

    print()
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Assembling PDF ({len(png_files)} slides)...")
    if assemble_pdf(png_files, output_path):
        size = output_path.stat().st_size
        print(f"  PDF created: {output_path} ({size:,} bytes, {len(png_files)} slides)")
        if size > 10 * 1024 * 1024:
            print(f"  WARNING: File exceeds LinkedIn's 10MB document upload limit.")
        print()
        print("Upload to LinkedIn:")
        print("  1. Create new post → click the document icon (not image)")
        print("  2. Upload this PDF")
        print("  3. Add post text as caption")
        print("  4. Publish, then immediately add lead magnet link as first comment")
    else:
        print("ERROR: PDF assembly failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()

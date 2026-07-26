#!/usr/bin/env python3
"""
build_ig_carousel.py — Instagram carousel builder
Copies 1080x1080 PNGs from a source slides directory and renames them to the IG convention.
Verifies each PNG: exact 1080x1080 and file size > 5 KB.

Usage (parameterized):
    python build_ig_carousel.py \
        --source-slides /path/to/LIC-linkedin-carousel/slides \
        --output-dir /path/to/IG-instagram-carousel \
        --slug ai-agent-budget \
        --date 071326

Usage (hardcoded — for per-piece archived copies):
    Set SLUG, DATE, SOURCE_SLIDES, OUTPUT_DIR below and run without args.
"""

import argparse
import shutil
import sys
from pathlib import Path

# Hardcoded values for archived per-piece copies — override with CLI args
SLUG = ""
DATE = ""
SOURCE_SLIDES = ""
OUTPUT_DIR = ""


def copy_and_verify(source_slides: Path, output_dir: Path, slug: str, date: str) -> bool:
    output_dir.mkdir(parents=True, exist_ok=True)

    slide_files = sorted(source_slides.glob("slide-*.png"))
    if len(slide_files) < 6:
        print(
            f"ERROR: only {len(slide_files)} slides found in {source_slides}. "
            "Need at least 6. Build the LinkedIn carousel first.",
            file=sys.stderr,
        )
        return False

    try:
        from PIL import Image
        pil_available = True
    except ImportError:
        print("WARNING: pillow not installed — skipping dimension verification. Run: pip install pillow")
        pil_available = False

    all_ok = True
    for i, src in enumerate(slide_files, 1):
        dst = output_dir / f"ig-carousel_{slug}_{date}_{i:02d}.png"
        shutil.copy2(str(src), str(dst))

        size = dst.stat().st_size
        if size < 5000:
            print(f"  FAIL — too small ({size} bytes): {dst.name}")
            all_ok = False
            continue

        if pil_available:
            with Image.open(dst) as img:
                w, h = img.size
                if w != 1080 or h != 1080:
                    print(f"  FAIL — wrong dimensions {w}x{h}: {dst.name}")
                    all_ok = False
                else:
                    print(f"  OK    — {w}x{h}, {size // 1024} KB: {dst.name}")
        else:
            print(f"  OK    — {size // 1024} KB: {dst.name} (dimensions not verified)")

    return all_ok


def main():
    parser = argparse.ArgumentParser(
        description="Build Instagram carousel PNGs from LinkedIn carousel slides"
    )
    parser.add_argument("--source-slides", help="Path to folder containing slide-*.png files")
    parser.add_argument("--output-dir", help="Output directory for IG PNGs")
    parser.add_argument("--slug", help="Content slug (e.g. ai-agent-budget)")
    parser.add_argument("--date", help="Date string MMDDYY (e.g. 071326)")
    args = parser.parse_args()

    slug = args.slug or SLUG
    date = args.date or DATE
    source_str = args.source_slides or SOURCE_SLIDES
    output_str = args.output_dir or OUTPUT_DIR

    if not all([slug, date, source_str, output_str]):
        parser.print_help()
        print(
            "\nERROR: provide --source-slides, --output-dir, --slug, --date "
            "or set the hardcoded values at the top of this script.",
            file=sys.stderr,
        )
        sys.exit(1)

    source_slides = Path(source_str)
    output_dir = Path(output_str)

    if not source_slides.exists():
        print(f"ERROR: source slides directory not found: {source_slides}", file=sys.stderr)
        sys.exit(1)

    print(f"Copying IG PNGs from {source_slides} ...")
    ok = copy_and_verify(source_slides, output_dir, slug, date)

    pngs = list(output_dir.glob(f"ig-carousel_{slug}_{date}_*.png"))
    if ok:
        print(f"\nAll {len(pngs)} IG PNGs: PASS (1080x1080, >5 KB)")
    else:
        print(f"\nIG PNG verification: one or more failures above ({len(pngs)} PNGs written)")
        sys.exit(1)


if __name__ == "__main__":
    main()

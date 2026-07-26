#!/usr/bin/env python3
"""
Web App Builder — Output Validator
Validates a generated HTML file against Carbon Forge design system requirements
and structural rules from the web-app-builder skill.

Usage:
    python scripts/validate_output.py path/to/output.html
    python scripts/validate_output.py path/to/output.html --verbose
"""

import sys
import re
import argparse
from pathlib import Path


# ============================================================
# Required Carbon Forge color tokens
# ============================================================
REQUIRED_TOKENS = {
    "--carbon-core": "#121010",
    "--forge-red": "#D43B2A",
    "--forge-gold": "#FFB400",
    "--forge-dark": "#333130",
    "--ash-white": "#F2F0EE",
    "--pure-white": "#FFFFFF",
    "--echo": "#878E88",
    "--soft-gray": "#E5E3E0",
}

# Colors that must NOT appear as text on light backgrounds
FORBIDDEN_TEXT_ON_LIGHT = [
    "#FFB400",  # Forge Gold
    "var(--forge-gold)",
]

# ============================================================
# Validation checks
# ============================================================

def check(name, passed, detail="", verbose=False):
    """Print a check result. Returns True if passed."""
    status = "✓ PASS" if passed else "✗ FAIL"
    if passed and not verbose:
        return True  # Silent pass unless verbose
    print(f"  {status}  {name}")
    if detail and not passed:
        print(f"         {detail}")
    return passed


def validate(html_path: Path, verbose: bool = False) -> bool:
    content = html_path.read_text(encoding="utf-8")
    failures = []

    print(f"\nValidating: {html_path.name}")
    print("=" * 60)

    # ---- Section 1: Format Declaration ----
    print("\n[1] Format Declaration")
    has_format_comment = bool(re.search(r"<!--\s*Format:", content))
    if not check("Format decision comment present", has_format_comment, verbose=verbose):
        failures.append("Missing format comment at top of file")

    # ---- Section 2: HTML Structure ----
    print("\n[2] HTML Structure")

    checks = [
        ("lang=\"en\" attribute", 'lang="en"' in content),
        ("Viewport meta tag", 'name="viewport"' in content),
        ("<main id=\"main-content\">", 'id="main-content"' in content),
        ("Skip link (.skip-link)", 'class="skip-link"' in content),
        ("Scroll-to-top button", 'scroll-top-btn' in content),
    ]
    for name, passed in checks:
        if not check(name, passed, verbose=verbose):
            failures.append(f"Missing: {name}")

    # ---- Section 3: Carbon Forge Design Tokens ----
    print("\n[3] Carbon Forge Design Tokens")

    for token, hex_value in REQUIRED_TOKENS.items():
        present = token in content
        hex_present = hex_value.lower() in content.lower()
        passed = present or hex_present
        detail = f"Token '{token}' ({hex_value}) not found"
        if not check(f"{token}: {hex_value}", passed, detail, verbose=verbose):
            failures.append(detail)

    # ---- Section 4: Typography Checks ----
    print("\n[4] Typography")

    font_checks = [
        ("Outfit font loaded", "family=Outfit" in content or "Outfit" in content),
        ("JetBrains Mono loaded", "JetBrains+Mono" in content or "JetBrains Mono" in content),
        ("--font-primary defined", "--font-primary" in content),
        ("--font-mono defined", "--font-mono" in content),
    ]
    for name, passed in font_checks:
        if not check(name, passed, verbose=verbose):
            failures.append(f"Missing: {name}")

    # Check for italics (font-style: italic)
    italic_matches = re.findall(r"font-style\s*:\s*italic", content, re.IGNORECASE)
    no_italics = len(italic_matches) == 0
    if not check("No font-style: italic", no_italics,
                 f"Found {len(italic_matches)} italic declaration(s) — remove all",
                 verbose=verbose):
        failures.append("font-style: italic detected — violates Carbon Forge rules")

    # ---- Section 5: Interactive Requirements ----
    print("\n[5] Interactivity")

    interactive_checks = [
        ("Toggle sections (.toggle-section)", 'toggle-section' in content),
        ("Collapsible content (.toggle-content)", 'toggle-content' in content),
        ("aria-expanded attribute", 'aria-expanded' in content),
        ("Expand All / Collapse All controls", 'expandAll' in content and 'collapseAll' in content),
        ("Copy code functionality", 'copyCode' in content or 'copy-btn' in content),
        ("Scroll-to-top JavaScript", 'scroll-top-btn' in content),
    ]
    for name, passed in interactive_checks:
        if not check(name, passed, verbose=verbose):
            failures.append(f"Missing: {name}")

    # ---- Section 6: Single-File Requirements ----
    print("\n[6] Single-File Checks")

    # Check for external CSS/JS (excluding Google Fonts)
    external_links = re.findall(r'<link[^>]+href=["\'](?!https://fonts\.googleapis)["\'][^>]*>', content)
    external_scripts = re.findall(r'<script[^>]+src=["\'][^"\']+["\'][^>]*>', content)
    no_external_css = len(external_links) == 0
    no_external_js = len(external_scripts) == 0

    if not check("No external CSS (only Google Fonts allowed)", no_external_css,
                 f"Found external CSS: {external_links}", verbose=verbose):
        failures.append("External CSS dependencies detected")

    if not check("No external JS", no_external_js,
                 f"Found external scripts: {external_scripts}", verbose=verbose):
        failures.append("External JS dependencies detected")

    # Check for framework imports
    framework_patterns = [
        ("React", r'react(?:\.min)?\.js|from\s+["\']react["\']'),
        ("Vue", r'vue(?:\.min)?\.js|from\s+["\']vue["\']'),
        ("Angular", r'angular(?:\.min)?\.js'),
    ]
    for fw_name, pattern in framework_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            if not check(f"No {fw_name} framework", False,
                         f"{fw_name} detected — must use vanilla HTML/CSS/JS",
                         verbose=verbose):
                failures.append(f"{fw_name} framework detected")
        else:
            check(f"No {fw_name} framework", True, verbose=verbose)

    # Check for localStorage/sessionStorage
    no_storage = 'localStorage' not in content and 'sessionStorage' not in content
    if not check("No localStorage/sessionStorage", no_storage,
                 "State must be in JS memory only", verbose=verbose):
        failures.append("localStorage or sessionStorage usage detected")

    # ---- Section 7: Accessibility ----
    print("\n[7] Accessibility")

    a11y_checks = [
        ("aria-controls attribute", 'aria-controls' in content),
        ("role=\"region\" on toggle panels", 'role="region"' in content),
        ("Keyboard handler (keydown)", 'keydown' in content),
        ("Print media query", '@media print' in content),
    ]
    for name, passed in a11y_checks:
        if not check(name, passed, verbose=verbose):
            failures.append(f"Missing accessibility: {name}")

    # ---- Section 8: Checklist Extract Features ----
    print("\n[8] Checklist Extract Features")

    extract_checks = [
        ("Notes textarea (.notes-textarea)", 'notes-textarea' in content),
        ("data-notes-for attribute", 'data-notes-for' in content),
        ("autoGrow function", 'autoGrow' in content),
        ("Extract Markdown button", 'extractTabMarkdown' in content or 'Extract Markdown' in content),
        ("Export Session Recap button", 'exportSessionRecap' in content),
        ("Markdown export modal (#md-modal)", 'id="md-modal"' in content or "id='md-modal'" in content),
        ("copyModalContent function", 'copyModalContent' in content),
        ("closeMarkdownModal function", 'closeMarkdownModal' in content),
        ("buildMarkdownForContainer function", 'buildMarkdownForContainer' in content),
        ("Escape key closes modal", "Escape" in content),
        ("Backdrop click closes modal", "closeMarkdownModal" in content and "backdrop" in content.lower()),
    ]
    for name, passed in extract_checks:
        if not check(name, passed, verbose=verbose):
            failures.append(f"Missing extract feature: {name}")

    # ---- Summary ----
    print("\n" + "=" * 60)
    if failures:
        print(f"RESULT: FAIL — {len(failures)} issue(s) found\n")
        for i, f in enumerate(failures, 1):
            print(f"  {i}. {f}")
        print()
        return False
    else:
        print(f"RESULT: PASS — All checks passed\n")
        return True


# ============================================================
# Entry point
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="Validate a web-app-builder HTML output file against Carbon Forge rules."
    )
    parser.add_argument("html_file", help="Path to the HTML file to validate")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Show all checks, including passing ones")
    args = parser.parse_args()

    path = Path(args.html_file)
    if not path.exists():
        print(f"Error: File not found: {path}")
        sys.exit(1)
    if path.suffix.lower() != ".html":
        print(f"Warning: Expected .html file, got {path.suffix}")

    passed = validate(path, verbose=args.verbose)
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()

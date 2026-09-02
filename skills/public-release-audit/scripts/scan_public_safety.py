#!/usr/bin/env python3
"""Scan a candidate public artifact for likely private or secret material.

This is a first-pass detector, not an ownership or privacy verdict.
Exit 0 when no findings are detected, 1 when findings exist, 2 for bad input.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

PATTERNS = [
    ("secret-assignment", re.compile(r"(?i)\b(api[_-]?key|secret|token|password|private[_-]?key)\s*[:=]\s*['\"]?[^\s'\"]{8,}")),
    ("private-key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("absolute-home-path", re.compile(r"(?:/Users/[^/\s]+|/home/[^/\s]+)/")),
    ("email-address", re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)),
    ("airtable-id", re.compile(r"\b(?:app|tbl|fld|viw)[A-Za-z0-9]{14}\b")),
    ("slack-id", re.compile(r"\b[CT][0-9A-Z]{8,}\b")),
    ("private-ip", re.compile(r"\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b")),
]

SKIP_NAMES = {".git", ".DS_Store", "__pycache__", "scan_public_safety.py"}
BINARY_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".zip", ".woff", ".woff2", ".ttf", ".ico"}


def files(root: Path):
    for path in root.rglob("*"):
        if any(part in SKIP_NAMES for part in path.parts):
            continue
        if path.is_file() and path.suffix.lower() not in BINARY_SUFFIXES:
            yield path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=Path)
    args = parser.parse_args()
    root = args.path.resolve()
    if not root.is_dir():
        print(f"ERROR: not a directory: {root}", file=sys.stderr)
        return 2

    findings = []
    for path in files(root):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            print(f"WARN: could not read {path}: {exc}", file=sys.stderr)
            continue
        for number, line in enumerate(text.splitlines(), 1):
            for label, pattern in PATTERNS:
                if pattern.search(line):
                    findings.append((path, number, label, line.strip()[:160]))

    if not findings:
        print("CLEAN — no first-pass private-data patterns detected.")
        return 0
    for path, number, label, excerpt in findings:
        print(f"{path}:{number} [{label}] {excerpt}")
    print(f"TOTAL: {len(findings)} finding(s). Inspect every finding before publication.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

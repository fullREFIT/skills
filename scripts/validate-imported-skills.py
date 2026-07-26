#!/usr/bin/env python3
"""Validate the portable skill collection imported under skills/."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / "skills"
MANIFEST = ROOT / "skills-manifest.json"
SKIP_NAMES = {"LICENSE", "LICENSE.txt"}
TEXT_SUFFIXES = {".css", ".html", ".js", ".json", ".md", ".mjs", ".py", ".sh", ".toml", ".ts", ".tsx", ".txt", ".yaml", ".yml"}
SENSITIVE_PATTERNS = {
    "personal name": re.compile(r"\bpaul(?:\s+chambers)?\b", re.IGNORECASE),
    "personal macOS path": re.compile(r"/Users/[A-Za-z0-9._-]+/"),
    "personal Linux path": re.compile(r"/home/[A-Za-z0-9._-]+/"),
    "fullREFIT email": re.compile(r"[\w.+-]+@fullrefit\.com", re.IGNORECASE),
    "Airtable identifier": re.compile(r"\b(?:app|tbl|fld|viw)[A-Za-z0-9]{14}\b"),
    "Slack identifier": re.compile(r"\b[CT]0[A-Z0-9]{8,}\b"),
    "credential-like token": re.compile(r"\b(?:ghp|github_pat|sk_live|sk_test|xox[baprs])_[A-Za-z0-9_-]{12,}\b"),
}


def main() -> int:
    errors: list[str] = []
    data = json.loads(MANIFEST.read_text())
    imported = [item for item in data.get("skills", []) if str(item.get("path", "")).startswith("skills/")]
    manifest_paths = {item["path"] for item in imported}
    actual_paths = {str(path.parent.relative_to(ROOT)) for path in SKILLS_ROOT.glob("*/SKILL.md")}

    if manifest_paths != actual_paths:
        for path in sorted(actual_paths - manifest_paths):
            errors.append(f"skill missing from manifest: {path}")
        for path in sorted(manifest_paths - actual_paths):
            errors.append(f"manifest path missing SKILL.md: {path}")

    names: set[str] = set()
    for skill_path in sorted(SKILLS_ROOT.glob("*/SKILL.md")):
        rel = skill_path.relative_to(ROOT)
        text = skill_path.read_text(errors="replace")
        if not text.startswith("---\n") or text.count("---") < 2:
            errors.append(f"missing YAML frontmatter: {rel}")
            continue
        try:
            frontmatter = yaml.safe_load(text.split("---", 2)[1]) or {}
        except yaml.YAMLError as exc:
            errors.append(f"invalid YAML frontmatter in {rel}: {exc}")
            continue
        name = frontmatter.get("name")
        description = frontmatter.get("description")
        if not isinstance(name, str) or not name.strip():
            errors.append(f"frontmatter missing name: {rel}")
        elif name in names:
            errors.append(f"duplicate frontmatter name: {name}")
        else:
            names.add(name)
        if not isinstance(description, str) or not description.strip():
            errors.append(f"frontmatter missing description: {rel}")

    for path in sorted(SKILLS_ROOT.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT)
        if path.name == ".DS_Store":
            errors.append(f"macOS metadata file must not be published: {rel}")
            continue
        if path.name in SKIP_NAMES or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        text = path.read_text(errors="ignore")
        for label, pattern in SENSITIVE_PATTERNS.items():
            if pattern.search(text):
                errors.append(f"{label} found in public skill: {rel}")

    if errors:
        print("Imported skill collection validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Imported skill collection validation: PASS")
    print(f"- {len(actual_paths)} skill directories match the manifest")
    print("- all SKILL.md frontmatter has unique names and descriptions")
    print("- no macOS metadata, personal paths, private identifiers, or credential-like tokens detected")
    return 0


if __name__ == "__main__":
    sys.exit(main())

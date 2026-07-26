#!/usr/bin/env python3
"""Minimal validator for vibe-coding-router skill packages."""
from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    import yaml
except Exception as exc:  # pragma: no cover
    print(f"ERROR: PyYAML unavailable: {exc}")
    sys.exit(2)


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    skill = root / "SKILL.md"
    if not skill.exists():
        print(f"ERROR: missing {skill}")
        return 1
    content = skill.read_text(encoding="utf-8")
    if not content.startswith("---\n"):
        print("ERROR: SKILL.md must start with YAML frontmatter")
        return 1
    match = re.search(r"\n---\s*\n", content[4:])
    if not match:
        print("ERROR: missing closing frontmatter marker")
        return 1
    end = match.start() + 4
    frontmatter = yaml.safe_load(content[4:end])
    if not isinstance(frontmatter, dict):
        print("ERROR: frontmatter is not a mapping")
        return 1
    for key in ("name", "description"):
        if not frontmatter.get(key):
            print(f"ERROR: missing {key}")
            return 1
    if frontmatter["name"] != "vibe-coding-router":
        print(f"ERROR: unexpected name {frontmatter['name']!r}")
        return 1
    if len(frontmatter["description"]) > 1024:
        print("ERROR: description exceeds 1024 chars")
        return 1
    for rel in ("README.md", "references", "scripts", "assets"):
        if not (root / rel).exists():
            print(f"ERROR: missing {root / rel}")
            return 1
    print("OK: vibe-coding-router skill structure looks valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

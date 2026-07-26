#!/usr/bin/env python3
"""Print the public skill catalog from skills-manifest.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "skills-manifest.json"


def main() -> None:
    data = json.loads(MANIFEST.read_text())
    skills = data.get("skills", [])
    print(f"full/REFIT public skills: {len(skills)}")
    for skill in skills:
        print(f"- {skill['name']} [{skill['status']}]")
        print(f"  {skill['description']}")
        print(f"  project: {skill['projectPath']}")
        print(f"  guide: {skill['guide']}")
        print(f"  download: {skill['download']}")


if __name__ == "__main__":
    main()

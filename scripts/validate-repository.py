#!/usr/bin/env python3
"""Validate public monorepo structure, links, manifest, and skill package safety."""

from __future__ import annotations

import json
import hashlib
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "presentation-deck-builder-skill"
OLD_REPOSITORY = "https://github.com/fullREFIT/presentation-deck-builder-skill"
PRIVATE_PATH_MARKERS = ("/Users/paul", "\\Users\\paul")
TEXT_SUFFIXES = {
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".mjs",
    ".py",
    ".sh",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}
ROOT_REQUIRED = (
    "README.md",
    "LICENSE",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "CHANGELOG.md",
    "skills-manifest.json",
    "docs/GITHUB-OPTIMIZATION-PLAN.md",
    "docs/MATT-POCOCK-SKILLS-ANALYSIS.md",
    "docs/REPOSITORY-USER-GUIDE-SOP.md",
    "docs/templates/USER-GUIDE-TEMPLATE.md",
)
PROJECT_REQUIRED = (
    "README.md",
    "USER-GUIDE.md",
    "LICENSE",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "package.json",
    "downloads/presentation-deck-builder-v2.zip",
)
LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def read_text(path: Path) -> str | None:
    if path.suffix.lower() not in TEXT_SUFFIXES and path.name not in {"LICENSE", ".gitignore"}:
        return None
    try:
        return path.read_text()
    except UnicodeDecodeError:
        return None


def validate_required(errors: list[str]) -> None:
    for rel in ROOT_REQUIRED:
        if not (ROOT / rel).is_file():
            fail(errors, f"missing root file: {rel}")
    for rel in PROJECT_REQUIRED:
        if not (PROJECT / rel).is_file():
            fail(errors, f"missing project file: presentation-deck-builder-skill/{rel}")


def validate_manifest(errors: list[str]) -> None:
    path = ROOT / "skills-manifest.json"
    try:
        data = json.loads(path.read_text())
    except Exception as exc:
        fail(errors, f"invalid skills-manifest.json: {exc}")
        return
    if data.get("schemaVersion") != 1:
        fail(errors, "skills-manifest.json schemaVersion must be 1")
    skills = data.get("skills")
    if not isinstance(skills, list) or not skills:
        fail(errors, "skills-manifest.json must contain at least one skill")
        return
    ids: set[str] = set()
    for item in skills:
        skill_id = item.get("id")
        if not skill_id or skill_id in ids:
            fail(errors, f"missing or duplicate skill id: {skill_id!r}")
        ids.add(skill_id)
        for key in ("path", "projectPath", "guide"):
            value = item.get(key)
            if not value or not (ROOT / value).exists():
                fail(errors, f"manifest {skill_id} has invalid {key}: {value!r}")
        if item.get("status") not in {"experimental", "beta", "stable", "deprecated"}:
            fail(errors, f"manifest {skill_id} has invalid status")


def validate_skill(errors: list[str]) -> None:
    skill_files = sorted(PROJECT.glob("skill/*/SKILL.md"))
    if len(skill_files) != 1:
        fail(errors, f"expected one canonical SKILL.md, found {len(skill_files)}")
        return
    text = skill_files[0].read_text()
    if not text.startswith("---\n"):
        fail(errors, "SKILL.md is missing YAML frontmatter")
    frontmatter = text.split("---", 2)[1] if text.count("---") >= 2 else ""
    if not re.search(r"^name:\s*\S+", frontmatter, re.MULTILINE):
        fail(errors, "SKILL.md frontmatter is missing name")
    if not re.search(r"^description:\s*.+", frontmatter, re.MULTILINE):
        fail(errors, "SKILL.md frontmatter is missing description")


def validate_project_text(errors: list[str]) -> None:
    for path in PROJECT.rglob("*"):
        if not path.is_file() or any(part in {"node_modules", "dist", ".git"} for part in path.parts):
            continue
        text = read_text(path)
        if text is None:
            continue
        rel = path.relative_to(ROOT)
        if OLD_REPOSITORY in text:
            fail(errors, f"stale standalone repository URL: {rel}")
        for marker in PRIVATE_PATH_MARKERS:
            if marker in text:
                fail(errors, f"private machine path in public file: {rel}")


def validate_markdown_links(errors: list[str]) -> None:
    for path in ROOT.rglob("*.md"):
        if any(part in {"node_modules", "dist", ".git"} for part in path.parts):
            continue
        text = path.read_text()
        for raw in LINK_RE.findall(text):
            target = raw.strip().split(" ", 1)[0].strip("<>")
            if not target or target.startswith(("#", "http://", "https://", "mailto:")):
                continue
            target = target.split("#", 1)[0]
            if target and not (path.parent / target).resolve().exists():
                fail(errors, f"broken relative link in {path.relative_to(ROOT)}: {raw}")


def validate_zip(errors: list[str]) -> None:
    archive = PROJECT / "downloads/presentation-deck-builder-v2.zip"
    site_archive = PROJECT / "site/public/downloads/presentation-deck-builder-v2.zip"
    if not site_archive.is_file():
        fail(errors, "site download ZIP is missing")
    elif hashlib.sha256(archive.read_bytes()).digest() != hashlib.sha256(site_archive.read_bytes()).digest():
        fail(errors, "repository and site download ZIP files do not match")
    try:
        with zipfile.ZipFile(archive) as zf:
            names = zf.namelist()
            required = {
                "presentation-deck-builder-v2/SKILL.md",
                "presentation-deck-builder-v2/references/user-guide.md",
                "presentation-deck-builder-v2/LICENSE",
            }
            missing = required - set(names)
            if missing:
                fail(errors, f"ZIP missing required files: {sorted(missing)}")
            for name in names:
                path = Path(name)
                if path.is_absolute() or ".." in path.parts:
                    fail(errors, f"unsafe ZIP path: {name}")
    except zipfile.BadZipFile:
        fail(errors, "presentation-deck-builder-v2.zip is not a valid ZIP archive")


def main() -> int:
    errors: list[str] = []
    validate_required(errors)
    validate_manifest(errors)
    validate_skill(errors)
    validate_project_text(errors)
    validate_markdown_links(errors)
    validate_zip(errors)
    if errors:
        print("Repository validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Repository validation: PASS")
    print("- root governance and guide standard present")
    print("- manifest paths resolve")
    print("- one canonical SKILL.md found")
    print("- no stale standalone URL or private machine path in project files")
    print("- relative Markdown links resolve")
    print("- release and site ZIP files match and have a valid structure")
    return 0


if __name__ == "__main__":
    sys.exit(main())

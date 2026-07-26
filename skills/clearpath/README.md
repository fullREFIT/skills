# ClearPath File System (skill)

A file and folder naming + organization system. Renames and reorganizes files to one legible convention so anything is findable fast, then executes only after you approve a before/after tree.

**Version:** 3.0

## What it does

- Enforces one naming convention: lowercase-hyphens, UPPERCASE format/platform prefixes (`LF`, `SF`, `LIC`, `LI`…), underscore as a segment separator, `MMDDYY` month-first dates.
- Organizes by topic, never by file type. Topic folders hold everything for that topic; prefixed subfolders appear only when their content exists.
- Reorganizes **within** a topic's own home — never lifts files into a global type-based master folder.
- Runs a safe workflow: scan → BEFORE/AFTER tree → your approval → copy-first execution → before/after tree snapshots archived to `_archive/`.

## Installation

### Claude Code
```bash
cp -r clearpath/ ~/.claude/skills/clearpath/
```
Detected automatically; no restart needed. Invoke with `/clearpath [path]`.

### Claude.ai / Desktop
Settings → Customize → Skills → Upload `clearpath.zip`. Enable code execution (Settings → Capabilities) so `scripts/clearpath-validate.sh` can run.

## Files

| Path | Purpose |
|------|---------|
| `SKILL.md` | The skill: 5 rules, prefix codes, the scan→tree→approve→execute workflow |
| `references/canonical-reference.md` | Full spec: segment grammar, date conversion, examples, structures |
| `references/quick-reference.md` | One-page cheat sheet (`/clearpath help`) |
| `references/safety-protocol.md` | Mandatory data-protection protocol for any execute run |
| `references/implementation-guide.md` | Human-facing explainer |
| `scripts/clearpath-validate.sh` | Audit + plan scanner (pre-flight, violation scan, rename plan) |

## Usage

```
/clearpath /path/to/dir          # audit + before/after tree
/clearpath apply /path/to/dir    # restructure (after you approve the tree)
/clearpath help                  # quick reference
```

---

# AI Agent Directory Rules

This README is a portable instruction file for any folder that contains an `_archive` directory.

## Hard rule: do not inspect `_archive`

AI agents must not read, crawl, index, summarize, count, open, or quote from any folder named exactly `_archive` unless the user explicitly names a specific archived file or path and asks for it.

This applies to every nested `_archive` directory under the current folder.

## What agents should do instead

- Treat `_archive` as inactive historical material.
- Skip `_archive` during directory scans, file searches, context loading, summarization, and project orientation.
- Mention only that an `_archive` folder exists if that helps explain what was skipped.
- Review normal project files and folders outside `_archive`.
- Review other underscore-prefixed folders only when relevant. The special exclusion is `_archive`.

## If archived material is needed

Before opening anything inside `_archive`, the agent must state the exact archived path it intends to inspect and why the live files are insufficient. If the user did not explicitly request that archived path, ask first.

## Wrong behavior

The wrong behavior is to satisfy a broad request like "read this folder," "summarize this project," "search this directory," or "load all context" by including `_archive` contents. That burns tokens on stale material and can contaminate the current answer with obsolete context.

---
name: clearpath
description: "File and folder naming and organization system (ClearPath v3.0). Renames and reorganizes files to one legible convention: lowercase-hyphens for words, UPPERCASE format/platform prefixes (LF, SF, LIC, LI...) on subfolders and files, underscore as a segment separator that joins co-equal topics and precedes the date, MMDDYY dates (month-first, never ISO or YYMMDD), topic-based folders, 4-level soft depth, never an empty folder. Reorganizes WITHIN a topic's own home, never into a global type-based master folder. Workflow: scan, show a BEFORE/AFTER tree, get approval, execute with copy-first safety and before/after tree snapshots archived to _archive/. Use when creating, renaming, organizing, or auditing files and folders. MANDATORY TRIGGERS: clearpath, organize files, rename files, naming convention, file naming, folder structure, audit directory, naming compliance, file organization, clean up folder, restructure folder, tidy directory."
license: MIT
allowed-tools: Bash, Read, Write, Edit
metadata:
  user-invocable: "true"
  argument-hint: "[path or action]"
---
# ClearPath File System v3.0

**One convention. Point it at a folder, approve the tree, done.** The goal is a unified system of organization that is very easy to understand and that lets you find anything fast.

Apply ClearPath to every file and folder created, renamed, or organized. When invoked via `/clearpath` or when asked to create, rename, organize, or audit files and folders, follow this system exactly.

## Bundled resources

Read these from this skill's directory as needed:

| File | When to read |
|------|-------------|
| `references/safety-protocol.md` | **MANDATORY** before any execute/apply operation |
| `references/canonical-reference.md` | Full spec: rules, segment grammar, date conversion, examples |
| `references/quick-reference.md` | On `/clearpath help` |
| `references/implementation-guide.md` | When explaining ClearPath to a person |
| `scripts/clearpath-validate.sh` | Run during `/clearpath [path]` audits |

---

## The 5 rules

### Rule 1: Lowercase + hyphens
Names use lowercase letters, words joined by hyphens. No spaces, no camelCase. The one exception: UPPERCASE format/platform prefix codes (below).

```
BAD:  Q1 Sales Report.xlsx
GOOD: q1-sales-report_021526.xlsx
```

### Rule 2: Underscore is a segment separator
The underscore separates *segments* of meaning. Hyphens join words *within* one segment.

- Co-equal topics: use `_` instead of `-and-` → `advertising_marketing`
- The date is always its own trailing segment → `..._MMDDYY`
- **The trailing 6-digit segment is always the date.** Everything before it is topic/role segments.

```
advertising_marketing_021526.md      ← topic "advertising" + topic "marketing" + date
most-ai-content-is-lying-script_021526.md   ← one topic (hyphens) + role + date
```

### Rule 3: Dates are MMDDYY, month-first
`_MMDDYY`. Six digits, no separators. `021526` = February 15, 2026. **Never `YYMMDD`. Never ISO `YYYYMMDD`.** This file system is read month-first; that preference is canonical.

- **Date these:** documents, reports, scripts, deliverables, exports, snapshots, meeting notes — anything that gets a newer version later.
- **Do NOT date:** config files (`package.json`, `.env`), framework files (`README.md`, `SKILL.md`, `CLAUDE.md`), build files (`Dockerfile`), permanent assets (`logo-primary.png`), source code in git repos, and a skill's own bundled references.

### Rule 4: Organize by topic, never by file type
A topic folder holds *everything* about that topic. Never split a topic across `pdfs/`, `scripts/`, `images/`.

```
BAD (by type):        GOOD (by topic):
  pdfs/                 marketing/
  spreadsheets/           brand-guidelines_011026.pdf
  images/                 content-calendar_020126.xlsx
```

### Rule 5: Depth target is 4, soft
Aim for 4 levels. Go to 5 or 6 only when it genuinely makes sense (deep client/project hierarchies). If you are creating empty intermediate folders just to categorize, flatten.

---

## Two rules that protect findability

### Never create an empty folder
Structure follows content. Create a subfolder only when something goes in it. A *missing* folder is a useful signal that the piece still needs producing. An empty folder is noise.

### Reorganize within a topic's home — never into a global master folder
ClearPath reorganizes files **within the topic folder they already belong to**, into that topic's canonical shape. It **never lifts files out into a global type-based collection.** Moving every project's `chat-recap` and `project-handoff` docs into one shared `chat-recap_project-handoff/` master folder is BANNED — it destroys findability, because you remember the file by its project, not its type. Project-local docs stay project-local.

---

## Format & platform prefix codes (UPPERCASE)

Prefixes ride on **subfolders and files**, not the topic folder. The topic folder is the plain, human-readable name (e.g. the video title).

| Code | Meaning |
|------|---------|
| `LF` | Long-form video · `SF` Short-form video |
| `LIC` | LinkedIn carousel · `LI` LinkedIn text post |
| `IG` | Instagram · `TT` TikTok variant |
| `EM` | Email · `BL` Blog · `SK` Skool |

A content topic uses a topic folder containing prefixed subfolders, each created only when its content exists:

```
most-ai-content-is-lying/                    ← topic folder, no prefix, no date
  LF-most-ai-content-is-lying/
    LF-most-ai-content-is-lying-script_021526.md
    slides/
      LF-most-ai-content-is-lying-slides.html
  LIC-most-ai-content-is-lying/
    LIC-most-ai-content-is-lying-carousel_021526.pdf
    LIC-most-ai-content-is-lying-post_021526.md
    slides/
      slide-01.png            ← build artifacts: no prefix, no date
  _archive/
    tree-before_021526.md
    tree-after_021526.md
```

(No `SF-` folder above = the short-form has not been produced yet. That absence is the to-do signal.) Files repeat the topic so they stay self-identifying when detached. The role (`-script`, `-tp`, `-carousel`, `-post`) attaches by hyphen before the date.

---

## Folder naming

- **Standard:** `topic-name/` — lowercase, hyphens, no date
- **Ordered:** `01-topic-name/` when sequence matters
- **Special:** `_archive/` (superseded work + tree snapshots), `_inbox/` (quick capture, empty often), `references/`, `assets/`, `scripts/`

The `_archive/` and `_inbox/` underscore prefix is the one exception to "underscore separates segments."

---

## Words to remove from filenames

`FINAL`, `USE-THIS`, `CURRENT`, `LATEST`, `v1`/`v2`/`v3`, `copy`, `Copy`, `(1)`, `(2)`, `new`, `old`, `updated`, `revised`. The date is the version. Keep `draft` only if the file *is* a draft. Keep a version number only when it identifies a distinct product (`safe-v2`), not a revision.

---

## The workflow: scan → tree → approve → execute → archive

This is the operating loop. Never skip the approval gate.

### `/clearpath [path]` — audit
1. Run `scripts/clearpath-validate.sh [path]`.
2. Display violations.
3. If violations exist, produce the **BEFORE/AFTER tree** (apply proposed renames *in memory only* — touch nothing) and present both for the user to compare.

### `/clearpath apply [path]` — restructure
**MANDATORY: read `references/safety-protocol.md` first.**
1. **Pre-flight** — filesystem type, cloud-sync detection, backup/git check, scope count, JSON staging manifest (`/tmp/clearpath-stage-*.json`).
2. **Scan & preview** — show the BEFORE tree and the proposed AFTER tree. **WAIT FOR EXPLICIT APPROVAL.**
3. **Execute** — copy-first-delete-later, max 20 ops per batch, two-step renames on case-insensitive filesystems. Reorganize within the topic's home only. Create no empty folders.
4. **Archive the trees** — write `tree-before_MMDDYY.md` and `tree-after_MMDDYY.md` into the target's `_archive/`. These are the human-readable **map** (where everything was, where it went). They are NOT the safety mechanism — the JSON staging manifest + copy-first-delete-later is the actual rollback. Keep both.
5. **Validate** — file counts match before/after, zero violations remain.

### `/clearpath help`
Display `references/quick-reference.md`.

---

## Quick decision guide

| Situation | Action |
|-----------|--------|
| New file | `descriptive-name_MMDDYY.ext` (or `topic_topic_MMDDYY.ext`) |
| New content topic | `topic-folder/` → prefixed subfolders as content appears |
| New folder | `topic-name/` (no date), created only when it has content |
| Two co-equal topics in one name | join with `_`: `advertising_marketing` |
| Replacing an old version | old → nearest `_archive/`, new file gets today's date |
| Restructuring a messy folder | reorganize within its own home; never to a global master |
| Folder too deep | 4 is the target; flatten empty intermediate levels |
| Not sure where a file goes | a topic folder, never "misc" or "other" |

---

*ClearPath v3.0 — month-first dates, segment underscores, topic homes, approved trees.*

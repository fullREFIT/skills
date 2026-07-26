# ClearPath — Canonical Reference

**Version:** 3.0
**Purpose:** The full specification. SKILL.md is the operating summary; this is the complete rule set, segment grammar, and examples.

---

## Format at a glance

```
descriptive-name_MMDDYY.ext              one topic + date
topic_topic_MMDDYY.ext                   co-equal topics + date
PREFIX-topic-name-role_MMDDYY.ext        prefixed content file
```

**Date:** `_MMDDYY` — month, day, 2-digit year. No separators. Month-first by design.

```
ai-readiness-script_021526.md
advertising_marketing_021526.md
LF-most-ai-content-is-lying-script_021526.md
```

---

## The segment grammar (Rule 2 in depth)

A name is a sequence of **segments**. Hyphens join words *inside* a segment; underscores *separate* segments.

```
LF - most-ai-content-is-lying - script _ 021526
│         │                       │       │
prefix    topic (one concept,     role    date segment
          hyphenated)             (trailing 6 digits)
```

- **Prefix** (optional, UPPERCASE): `LF-`, `SF-`, `LIC-`, etc. Attaches to the front by hyphen.
- **Topic segment(s):** one concept uses hyphens (`most-ai-content-is-lying`). Two co-equal concepts join with `_` instead of `-and-` (`advertising_marketing`).
- **Role** (optional): `-script`, `-tp`, `-carousel`, `-post`, `-checklist`. Attaches by hyphen.
- **Date segment:** the trailing 6-digit group, always read as `MMDDYY`.

**Disambiguation rule:** the date is always the trailing 6-digit segment. Any other `_`-separated segment is a topic.

---

## The 5 rules

1. **Lowercase + hyphens.** Exception: UPPERCASE prefix codes.
2. **Underscore separates segments** (co-equal topics + the date). Hyphens join words within a segment.
3. **Dates are `MMDDYY`,** month-first. Never YYMMDD, never ISO.
4. **Organize by topic,** not by file type.
5. **Depth target 4,** soft — deeper only when it genuinely makes sense.

Plus two findability guards:
- **Never create an empty folder.** A missing folder is the to-do signal.
- **Reorganize within a topic's home only.** Never lift files into a global type-based master folder.

---

## Date conversion

| Original | ClearPath |
|---|---|
| `2026-02-15` (ISO) | `_021526` |
| `260215` (YYMMDD) | `_021526` |
| `02/15/2026` | `_021526` |
| `Feb 15, 2026` | `_021526` |
| No date | `_MMDDYY` using today, or skip if not a versioned file |

---

## Prefix codes

| Code | Meaning | Code | Meaning |
|------|---------|------|---------|
| `LF` | Long-form video | `IG` | Instagram |
| `SF` | Short-form video | `TT` | TikTok variant |
| `LIC` | LinkedIn carousel | `EM` | Email |
| `LI` | LinkedIn text post | `BL` | Blog |
| | | `SK` | Skool |

Prefixes ride on subfolders and files, never on the topic folder.

---

## Allowed / prohibited characters

- **Allowed:** lowercase `a-z`, digits `0-9`, hyphen `-` (word join), underscore `_` (segment separator), period `.` (extension), UPPERCASE only in prefix codes.
- **Prohibited:** spaces, lowercase-violating uppercase, special characters, unicode, emoji, parentheses, ampersands, apostrophes, consecutive hyphens.

## Words to remove

`FINAL`, `USE-THIS`, `CURRENT`, `LATEST`, `v1`/`v2`/`v3`, `copy`, `(1)`, `(2)`, `new`, `old`, `updated`, `revised`. Keep `draft` if the file is a draft. Keep a version number only when it is a product identity (`safe-v2`), not a revision marker.

## Never rename / never date

`README.md`, `SKILL.md`, `CLAUDE.md`, `COMPANION-GUIDE.md`, `LICENSE`, `package.json`, `Dockerfile`, dotfiles, lockfiles, source code in git repos, permanent assets (`logo-primary.png`), and a skill's own bundled references.

---

## Folder naming

- **Standard:** `topic-name/` (lowercase, hyphens, no date)
- **Ordered:** `01-topic-name/`
- **Special:** `_archive/`, `_inbox/`, `references/`, `assets/`, `scripts/`

---

## Standard structures

### Content topic (video project)
```
{video-title}/
  LF-{video-title}/          ← only if long-form exists
    LF-{video-title}-script_MMDDYY.md
    LF-{video-title}-tp_MMDDYY.md
    slides/
      LF-{video-title}-slides.html
  SF-{video-title}/          ← only if short-form exists
    SF-{video-title}-script_MMDDYY.md
  LIC-{video-title}/         ← only if carousel exists
    LIC-{video-title}-carousel_MMDDYY.pdf
    LIC-{video-title}-post_MMDDYY.md
    slides/
      slide-01.png
  _archive/
    tree-before_MMDDYY.md
    tree-after_MMDDYY.md
```

### General project
```
project-name/
  README.md
  references/
  assets/
  _archive/
  project-plan_MMDDYY.md
```

### Business root
```
business-name/
  01-brand-identity/
  02-marketing/
  03-clients/
  _archive/
  _inbox/
```

---

## The workflow

1. **Scan** — identify violations (run `scripts/clearpath-validate.sh`).
2. **Plan** — produce the BEFORE tree and the projected AFTER tree (in memory only). Present both. Wait for approval.
3. **Execute** — copy-first-delete-later, reorganize within the topic's home, create no empty folders. Follow `safety-protocol.md`.
4. **Archive** — write `tree-before_MMDDYY.md` + `tree-after_MMDDYY.md` to the target's `_archive/`.
5. **Validate** — counts match, zero violations.

---

## Pragmatic exceptions

| Situation | Exception |
|-----------|-----------|
| External/vendor files | Don't rename files from external systems if the original name is needed for traceability. The folder organizes them. |
| Living documents | Date optional for files edited in place and never snapshotted (especially in git). |
| Existing numbered structures | `1. Name/` in established shared workspaces is acceptable; migrate to `01-name/` only for new structures. |
| Language conventions | Source code follows its language (Python `snake_case`, etc.), not ClearPath. |

---

*ClearPath v3.0 — the complete specification.*

# ClearPath v3.0 — Quick Reference

## The format

```
descriptive-name_MMDDYY.ext          one topic + date
topic_topic_MMDDYY.ext               co-equal topics + date
PREFIX-topic-role_MMDDYY.ext         prefixed content file
```

## The 5 rules

| # | Rule | Example |
|---|------|---------|
| 1 | Lowercase + hyphens (UPPERCASE prefixes excepted) | `project-plan` not `Project Plan` |
| 2 | Underscore separates segments (topics + date) | `advertising_marketing_021526` |
| 3 | Dates are `MMDDYY`, month-first | `021526` = Feb 15, 2026 |
| 4 | Organize by topic, not file type | `marketing/` not `pdfs/` |
| 5 | Depth target 4, soft | flatten empty intermediate levels |

Plus: **never create an empty folder** · **reorganize within a topic's home, never into a global master folder.**

## Date format

```
_MMDDYY        month + day + 2-digit year, no separators
_010126  = January 1, 2026
_021526  = February 15, 2026
_123126  = December 31, 2026
```
Never `YYMMDD`. Never ISO `YYYYMMDD`.

## Prefix codes (on subfolders + files, not the topic folder)

`LF` long-form · `SF` short-form · `LIC` LinkedIn carousel · `LI` LinkedIn post · `IG` Instagram · `TT` TikTok · `EM` email · `BL` blog · `SK` Skool

## Folders

| Type | Format |
|------|--------|
| Regular | `topic-name/` |
| Ordered | `01-topic-name/` |
| Archive | `_archive/` (superseded work + tree-before/after snapshots) |
| Inbox | `_inbox/` (quick capture) |

## Never date / never rename

`README.md`, `SKILL.md`, `CLAUDE.md`, `package.json`, `.gitignore`, `.env`, `Dockerfile`, `LICENSE`, lockfiles, source code, `logo-primary.png`, a skill's bundled references.

## Remove from filenames

`FINAL` · `v1/v2/v3` · `USE-THIS` · `CURRENT` · `LATEST` · `copy` · `(1)` · `new` · `old` · `updated`

## Good vs bad

```
BAD                                  GOOD
Q1 Sales Report.xlsx                 q1-sales-report_021526.xlsx
Marketing_Plan_FINAL.docx            marketing-plan_021526.docx
report-v3-final-USE-THIS.pdf         quarterly-report_021526.pdf
advertising-and-marketing.md         advertising_marketing_021526.md
New Folder/                          client-projects/
PDFs/                                contracts/
```

## Workflow

```
/clearpath /path           audit + before/after tree
/clearpath apply /path     restructure (after you approve the tree)
/clearpath help            this card
```

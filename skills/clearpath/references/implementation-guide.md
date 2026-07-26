# ClearPath — Implementation Guide (human-facing)

**Version:** 3.0. A plain-language explainer for a person (or VA) applying ClearPath by hand.

## The idea in one line

Give every file and folder one predictable name so you can find anything in a few clicks, and never reorganize things so far that you lose your mental map of where they live.

## How to name a file

```
descriptive-name_MMDDYY.ext
```

1. **Lowercase, hyphens between words.** `Q1 Sales Report.xlsx` → `q1-sales-report_021526.xlsx`.
2. **Underscore separates segments.** Use it to join two equal topics instead of writing "and" (`advertising_marketing`), and always right before the date.
3. **Date is month-first:** `021526` is February 15, 2026. Six digits, no slashes. Never year-first.
4. **Only date things that get newer versions** — reports, scripts, deliverables. Don't date READMEs, configs, or code.

## How to name a folder

- Folder = the topic, in plain words. A video's folder is the video's title.
- No prefix and no date on the topic folder.
- Inside it, the format subfolders carry the prefix: `LF-` long-form, `SF-` short-form, `LIC-` LinkedIn carousel. The files inside carry the prefix too.
- **Only make a folder when you have something to put in it.** No empty folders. A folder that isn't there yet tells you that piece still needs doing.

## The golden rule of moving things

Tidy files **inside the folder they already belong to.** Never sweep files of the same type out of all your projects into one big shared folder. If you move every project's recap into a single `chat-recaps/` folder, you will never find the one you want, because you remember it by its project, not by the word "recap." Keep project files with their project.

## When replacing an old version

Move the old file into an `_archive/` folder right where it lives, and give the new file today's date. Don't add `FINAL`, `v2`, or `copy` — the date is the version.

## The safe way to reorganize a messy folder

1. Look at what's there.
2. Write down every rename and move as a plan (before → after).
3. Look at the plan as a tree. Approve it.
4. Make the changes, copying first and deleting only after you've checked nothing's missing.
5. Drop a `tree-before` and `tree-after` snapshot into `_archive/` so you can always see what moved.

Anything over a few dozen files, or anything in a synced folder (Dropbox, iCloud): read `safety-protocol.md` first.

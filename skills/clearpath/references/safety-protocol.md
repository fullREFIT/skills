# ClearPath Safety Protocol — Data Protection During Implementation

**Version:** 3.0
**Purpose:** Prevent data loss when applying ClearPath to any directory, via skill, script, or manual CLI. **Read this before any execute/apply run.**

---

## Why this exists

A ClearPath run on a cloud-synced folder of ~4,976 files once caused permanent data loss: no staging, no manifest, no backup verification, bulk ops on a synced folder, case-insensitive collisions, and suppressed errors. This protocol prevents a repeat.

---

## Layer 1: Pre-flight (before anything moves)

```
[ ] 1. FILESYSTEM TYPE
      diskutil info "$(df -P TARGET | tail -1 | awk '{print $1}')" | grep "File System Personality"
      Case-insensitive → flag two-step renames. Case-sensitive → standard renames OK.

[ ] 2. CLOUD SYNC
      Check .dropbox, .sync, ~/Library/CloudStorage mount points.
      Cloud-synced → BATCH MODE (max 20 ops/batch, pause between batches).

[ ] 3. BACKUP
      Time Machine: tmutil latestbackup   ·   git: git -C TARGET status
      No backup → STOP, create one: rsync -a TARGET/ TARGET.clearpath-backup-$(date +%m%d%y)/

[ ] 4. MANIFEST
      find TARGET -not -path '*/.*' | sort > /tmp/clearpath-manifest-before.txt   (store OUTSIDE target)

[ ] 5. SCOPE
      >100 items → phased.  >500 → explicit confirmation + backup.  >2000 → refuse without verified backup + sync paused.
```

---

## Layer 2: Staging manifest (the undo buffer)

Record every planned operation as JSON BEFORE execution: `/tmp/clearpath-stage-{timestamp}.json`.

```json
{
  "version": "3.0",
  "target": "/path/to/directory",
  "preflight": { "filesystem": "case-insensitive", "cloud_sync": "none", "backup_verified": true },
  "operations": [
    { "id": 1, "type": "move", "source": ".../LF-x/x-script_021526.md",
      "destination": ".../x/LF-x/LF-x-script_021526.md", "status": "pending", "batch": 1, "risk": "low" }
  ],
  "rollback_log": []
}
```

Each operation has a status (pending → executing → completed / failed / rolled-back), a batch number, and a risk flag (case-collision, deep-move, cloud-sync). The rollback log records reverse operations as they complete.

---

## Layer 3: Execution with rollback

```
1. Create new folder structure (mkdir only — never delete)        ← create NO empty folders that won't receive content
2. Copy files to new locations (cp, NOT mv)
3. Verify copies match originals (count + size)
4. User confirms results look correct
5. ONLY THEN remove originals (and only empty dirs via rmdir)
```

**COPY FIRST, DELETE LATER.** Never `mv` for bulk operations.

Case-insensitive rename (e.g. `Press/` → `press/`):
```bash
mkdir "press-clearpath-temp"
cp -R "Press/"* "press-clearpath-temp/"
# verify count + sizes
rm -r "Press"
mv "press-clearpath-temp" "press"
```

---

## Layer 4: Archive the trees (the visual map)

After a successful restructure, write two snapshots into the target's `_archive/`:

```
_archive/
  tree-before_MMDDYY.md     ← the directory exactly as it was
  tree-after_MMDDYY.md      ← the directory as it now is
```

These are the **human-readable map** — they let you see where any file was and where it went, so nothing is ever truly lost. They are **not** the rollback mechanism. The JSON staging manifest + copy-first-delete-later is the actual recovery path. **Keep both:** the trees for the human, the manifest for the machine.

---

## Execution modes

| Mode | Command | Changes files? |
|------|---------|----------------|
| Audit | `clearpath-validate /path` | No |
| Plan | `clearpath-validate /path --plan` | No |
| Execute | `clearpath-validate /path --plan --execute` | Yes (with approval) |
| Rollback | from the staging manifest | Yes (reversal) |

---

## Error handling

1. Never suppress errors (no `2>/dev/null` on operations).
2. Stop on first error (`set -euo pipefail`).
3. Log everything to the staging manifest.
4. Surface every failure prominently. No silent fallbacks.

---

## Decision matrix

| Situation | Extra precautions |
|-----------|-------------------|
| New project (<50 files) | Standard pre-flight |
| Existing project (50–500) | Backup verification required |
| Large folder (500+) | Backup + phased batches + checkpoints |
| Cloud-synced (any size) | Batch mode + sync delay + pause sync first |
| Case-insensitive FS + folder renames | Two-step renames via temp dirs |

---

*Any implementation of ClearPath MUST follow this protocol.*

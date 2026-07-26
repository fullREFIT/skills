#!/usr/bin/env bash
# install_skill.sh — install an Agent Skills-standard skill into Tier 1 targets.
#
# Tier 1 tools (Claude Code, Codex CLI, Cursor) read SKILL.md unchanged, so porting
# is a copy — not a conversion. This script does the copy correctly: strips packaging
# cruft, preserves execute bits, and checks the one thing that silently breaks skill
# loading (frontmatter `name` not matching the parent directory name).
#
# Usage:
#   install_skill.sh <path-to-skill-dir> [claude|codex|cursor|agents|all|every] [--dry-run] [--force]
#
# Refuses to overwrite an installed copy whose description differs from the source —
# that is usually a deliberate platform variant, not a stale file. --force overrides.
#
# Exit: 0 all requested targets installed and validated; 1 otherwise.

set -uo pipefail

SRC="${1:-}"
TARGETS="${2:-all}"
DRY=""; FORCE=""
for a in "$@"; do
  [[ "$a" == "--dry-run" ]] && DRY=1
  [[ "$a" == "--force" ]] && FORCE=1
done
[[ "$TARGETS" == --* ]] && TARGETS="all"

if [[ -z "$SRC" || ! -d "$SRC" ]]; then
  echo "usage: install_skill.sh <path-to-skill-dir> [claude|codex|cursor|agents|all|every] [--dry-run] [--force]" >&2
  exit 1
fi

SRC="${SRC%/}"
NAME="$(basename "$SRC")"

if [[ ! -f "$SRC/SKILL.md" ]]; then
  echo "FAIL: no SKILL.md in $SRC" >&2
  exit 1
fi

# The spec requires frontmatter `name` to match the parent directory name. When it
# doesn't, most tools skip the skill without an error — it just never triggers.
FM_NAME="$(grep -m1 '^name:' "$SRC/SKILL.md" | sed 's/^name:[[:space:]]*//' | tr -d '"'"'"' \r')"
if [[ "$FM_NAME" != "$NAME" ]]; then
  echo "FAIL: frontmatter name '$FM_NAME' != directory name '$NAME'." >&2
  echo "      Tools skip mismatched skills silently. Rename one to match the other." >&2
  exit 1
fi

if ! [[ "$NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "FAIL: '$NAME' is not a valid skill name (lowercase letters, digits, single hyphens)." >&2
  exit 1
fi

DESC_LEN="$(python3 - "$SRC/SKILL.md" <<'PY' 2>/dev/null || echo 0
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
m=re.search(r'^description:\s*"(.*?)"\s*$',s,re.S|re.M) or re.search(r'^description:\s*(.+)$',s,re.M)
print(len(m.group(1)) if m else 0)
PY
)"
if [[ "$DESC_LEN" -gt 1024 ]]; then
  echo "FAIL: description is $DESC_LEN chars; the spec caps it at 1024. Upload/validation will reject it." >&2
  exit 1
fi
if [[ "$DESC_LEN" -eq 0 ]]; then
  echo "WARN: could not read a description from frontmatter — check it exists." >&2
fi

declare -a DIRS=()
case "$TARGETS" in
  claude) DIRS=("$HOME/.claude/skills") ;;
  codex)  DIRS=("$HOME/.codex/skills") ;;
  cursor) DIRS=("$HOME/.cursor/skills") ;;
  agents) DIRS=("$HOME/.agents/skills") ;;
  all|native-all) DIRS=("$HOME/.claude/skills" "$HOME/.codex/skills" "$HOME/.cursor/skills") ;;
  every) DIRS=("$HOME/.claude/skills" "$HOME/.codex/skills" "$HOME/.cursor/skills" "$HOME/.agents/skills") ;;
  *) echo "FAIL: unknown target '$TARGETS' (use claude|codex|cursor|agents|all|every)" >&2; exit 1 ;;
esac

RC=0
for BASE in "${DIRS[@]}"; do
  DEST="$BASE/$NAME"
  if [[ -n "$DRY" ]]; then
    echo "[dry-run] would install $NAME -> $DEST"
    continue
  fi
  # Divergence guard. A skill already installed at the destination may be a deliberate
  # platform-specific variant, not a stale copy — Codex and Cursor builds of the same skill
  # routinely carry different triggers and different prose. Overwriting one silently
  # destroys work that looks identical from the outside. Compare descriptions first and
  # refuse unless the caller explicitly forces it.
  if [[ -f "$DEST/SKILL.md" && -z "$FORCE" ]]; then
    SRC_D="$(sed -n 's/^description:[[:space:]]*"\(.*\)"$/\1/p' "$SRC/SKILL.md" | head -c 200)"
    DST_D="$(sed -n 's/^description:[[:space:]]*"\(.*\)"$/\1/p' "$DEST/SKILL.md" | head -c 200)"
    if [[ -n "$DST_D" && "$SRC_D" != "$DST_D" ]]; then
      echo "SKIP $DEST" >&2
      echo "     Installed copy differs from the source — likely a platform-specific variant." >&2
      echo "     source: ${SRC_D:0:96}..." >&2
      echo "     dest:   ${DST_D:0:96}..." >&2
      echo "     Re-run with --force to overwrite, or edit that copy directly." >&2
      RC=1
      continue
    fi
  fi

  mkdir -p "$DEST" || { echo "FAIL: cannot create $DEST" >&2; RC=1; continue; }

  # Copy contents, excluding packaging artifacts and any self-nested folder left by
  # unzipping a skill archive inside its own directory.
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete \
      --exclude='*.zip' --exclude='*.skill' --exclude='.DS_Store' \
      --exclude='__pycache__' --exclude='.git' --exclude="$NAME/" \
      "$SRC"/ "$DEST"/ || { echo "FAIL: copy failed for $DEST" >&2; RC=1; continue; }
  else
    rm -rf "${DEST:?}"/* 2>/dev/null
    (cd "$SRC" && tar cf - \
      --exclude='*.zip' --exclude='*.skill' --exclude='.DS_Store' \
      --exclude='__pycache__' --exclude='.git' --exclude="./$NAME" .) \
      | (cd "$DEST" && tar xf -) || { echo "FAIL: copy failed for $DEST" >&2; RC=1; continue; }
  fi

  [[ -d "$DEST/scripts" ]] && chmod +x "$DEST"/scripts/* 2>/dev/null

  FILES="$(find "$DEST" -type f | wc -l | tr -d ' ')"
  if [[ -f "$DEST/SKILL.md" ]]; then
    printf "OK   %-46s %s files\n" "$DEST" "$FILES"
  else
    echo "FAIL: SKILL.md missing after install at $DEST" >&2
    RC=1
  fi
done

if [[ $RC -eq 0 && -z "$DRY" ]]; then
  echo
  echo "Installed '$NAME'. Restart or reload the target tool so it rescans its skills directory."
fi
exit $RC

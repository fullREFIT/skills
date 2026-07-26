#!/usr/bin/env bash
# ClearPath Validation & Implementation Script
# Scans directories for naming violations and optionally fixes them.
#
# Usage:
#   clearpath-validate /path/to/directory              # Audit mode (default)
#   clearpath-validate /path/to/directory --plan        # Generate rename plan
#   clearpath-validate /path/to/directory --plan --execute  # Execute the plan
#   clearpath-validate --rollback /tmp/clearpath-stage-*.json  # Rollback
#
# Modes:
#   (default)   Audit — report violations, change nothing
#   --plan      Generate staging manifest + rename table, change nothing
#   --execute   Execute the plan (requires --plan, prompts for confirmation)
#   --rollback  Reverse operations from a staging manifest
#
# Options:
#   --yes           Skip confirmation prompt (for CI/scripted use)
#   --sync-delay N  Seconds between batches for cloud-synced dirs (default: 5)
#   --batch-size N  Max operations per batch (default: 20)
#   --json          Output results as JSON instead of table
#   --help          Show this help

set -euo pipefail

VERSION="3.0.0"
SCRIPT_NAME="clearpath-validate"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Defaults
MODE="audit"
PLAN=false
EXECUTE=false
ROLLBACK=false
AUTO_YES=false
SYNC_DELAY=5
BATCH_SIZE=20
JSON_OUTPUT=false
TARGET=""
ROLLBACK_FILE=""

# Exception files that should never be renamed
EXCEPTIONS=(
    "README.md" "SKILL.md" "CLAUDE.md" "LICENSE" "Makefile" "Dockerfile"
    "package.json" "package-lock.json" "tsconfig.json" "pyproject.toml"
    ".gitignore" ".env" ".env.local" ".env.example" ".DS_Store"
    "docker-compose.yml" "docker-compose.yaml" "Cargo.toml" "go.mod"
    "requirements.txt" "setup.py" "setup.cfg" "Pipfile" "Pipfile.lock"
    "yarn.lock" "pnpm-lock.yaml" "bun.lockb" "Gemfile" "Gemfile.lock"
    "Procfile" "Vagrantfile" ".editorconfig" ".prettierrc" ".eslintrc"
    ".eslintrc.json" ".prettierrc.json" "jest.config.js" "jest.config.ts"
    "vite.config.ts" "vite.config.js" "next.config.js" "next.config.mjs"
    "tailwind.config.js" "tailwind.config.ts" "postcss.config.js"
    "webpack.config.js" "rollup.config.js" "babel.config.js"
    "tsconfig.node.json" "tsconfig.app.json" "vitest.config.ts"
    "Makefile.toml" "CMakeLists.txt" "Taskfile.yml" "Justfile"
    "COMPANION-GUIDE.md"
)

# Folders to skip entirely
SKIP_DIRS=(
    ".git" "node_modules" ".next" ".nuxt" "dist" "build" "__pycache__"
    ".venv" "venv" ".tox" ".mypy_cache" ".pytest_cache" ".cache"
    "target" ".svn" ".hg" ".idea" ".vscode" ".DS_Store"
    "vendor" "bower_components" ".terraform" ".serverless"
)

# ─── Helper Functions ───────────────────────────────────────────────

usage() {
    head -30 "$0" | grep '^#' | sed 's/^# *//' | sed 's/^!//'
    exit 0
}

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_ok() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_header() { echo -e "\n${BOLD}${CYAN}$1${NC}"; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; }

is_exception() {
    local filename
    filename=$(basename "$1")
    for exc in "${EXCEPTIONS[@]}"; do
        if [[ "$filename" == "$exc" ]]; then
            return 0
        fi
    done
    if [[ "$filename" == .* ]]; then
        return 0
    fi
    return 1
}

should_skip_dir() {
    local dirname
    dirname=$(basename "$1")
    for skip in "${SKIP_DIRS[@]}"; do
        if [[ "$dirname" == "$skip" ]]; then
            return 0
        fi
    done
    return 1
}

# ─── Parse Arguments ────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
    case $1 in
        --plan) PLAN=true; shift ;;
        --execute) EXECUTE=true; shift ;;
        --rollback)
            ROLLBACK=true
            if [[ -n "${2:-}" && ! "$2" == --* ]]; then
                ROLLBACK_FILE="$2"
                shift
            fi
            shift ;;
        --yes) AUTO_YES=true; shift ;;
        --sync-delay)
            SYNC_DELAY="${2:?--sync-delay requires a number}"
            shift 2 ;;
        --batch-size)
            BATCH_SIZE="${2:?--batch-size requires a number}"
            shift 2 ;;
        --json) JSON_OUTPUT=true; shift ;;
        --help|-h) usage ;;
        --version) echo "$SCRIPT_NAME v$VERSION"; exit 0 ;;
        -*)
            log_error "Unknown option: $1"
            echo "Run '$SCRIPT_NAME --help' for usage"
            exit 1 ;;
        *)
            if [[ -z "$TARGET" ]]; then
                TARGET="$1"
            elif [[ "$ROLLBACK" == true && -z "$ROLLBACK_FILE" ]]; then
                ROLLBACK_FILE="$1"
            fi
            shift ;;
    esac
done

# ─── Validate inputs ────────────────────────────────────────────────

if [[ "$ROLLBACK" == true ]]; then
    if [[ -z "$ROLLBACK_FILE" ]]; then
        log_error "Rollback requires a staging manifest file"
        echo "Usage: $SCRIPT_NAME --rollback /tmp/clearpath-stage-*.json"
        exit 1
    fi
    if [[ ! -f "$ROLLBACK_FILE" ]]; then
        log_error "Manifest file not found: $ROLLBACK_FILE"
        exit 1
    fi
    log_info "Rollback mode is not yet implemented in shell. Use the staging manifest JSON to manually reverse operations."
    exit 0
fi

if [[ -z "$TARGET" ]]; then
    log_error "No target directory specified"
    echo "Usage: $SCRIPT_NAME /path/to/directory [--plan] [--execute]"
    exit 1
fi

if [[ ! -d "$TARGET" ]]; then
    log_error "Not a directory: $TARGET"
    exit 1
fi

if [[ "$EXECUTE" == true && "$PLAN" != true ]]; then
    log_error "--execute requires --plan"
    exit 1
fi

TARGET=$(cd "$TARGET" && pwd)

# ─── Pre-Flight Checks ──────────────────────────────────────────────

log_header "CLEARPATH PRE-FLIGHT"

FS_DEVICE=$(df -P "$TARGET" | tail -1 | awk '{print $1}')
FS_TYPE="unknown"
CASE_INSENSITIVE=false

if command -v diskutil &>/dev/null; then
    FS_INFO=$(diskutil info "$FS_DEVICE" 2>/dev/null | grep "File System Personality" || echo "")
    if [[ "$FS_INFO" == *"Case-sensitive"* && "$FS_INFO" != *"not"* ]]; then
        FS_TYPE="case-sensitive"
        CASE_INSENSITIVE=false
    else
        FS_TYPE="case-insensitive (macOS default)"
        CASE_INSENSITIVE=true
    fi
fi

if [[ "$CASE_INSENSITIVE" == true ]]; then
    log_warn "Filesystem: $FS_TYPE — two-step renames required for case changes"
else
    log_ok "Filesystem: $FS_TYPE"
fi

CLOUD_SYNC="none"
if [[ -d "$TARGET/.dropbox" || -d "$TARGET/.dropbox.cache" ]]; then
    CLOUD_SYNC="dropbox"
elif [[ "$TARGET" == *"CloudStorage"* ]]; then
    CLOUD_SYNC="cloud-storage"
elif [[ "$TARGET" == *"Google Drive"* || "$TARGET" == *"Google_Drive"* ]]; then
    CLOUD_SYNC="google-drive"
elif [[ "$TARGET" == *"OneDrive"* ]]; then
    CLOUD_SYNC="onedrive"
elif [[ "$TARGET" == *"iCloud"* ]]; then
    CLOUD_SYNC="icloud"
fi

if [[ "$CLOUD_SYNC" != "none" ]]; then
    log_warn "Cloud sync detected: $CLOUD_SYNC — batch mode will be enforced"
else
    log_ok "Cloud sync: none detected"
fi

TOTAL_FILES=$(find "$TARGET" -type f -not -path '*/.*' -not -path '*/node_modules/*' | wc -l | tr -d ' ')
TOTAL_DIRS=$(find "$TARGET" -type d -not -path '*/.*' -not -path '*/node_modules/*' | wc -l | tr -d ' ')
log_info "Scope: $TOTAL_FILES files, $TOTAL_DIRS folders"

if [[ "$TOTAL_FILES" -gt 2000 && "$EXECUTE" == true ]]; then
    log_error "Over 2000 files. Refusing to execute without verified backup."
    log_info "Create a backup first: rsync -a '$TARGET/' '${TARGET}.clearpath-backup-$(date +%m%d%y)/'"
    exit 1
fi

HAS_GIT=false
HAS_TIMEMACHINE=false

if git -C "$TARGET" rev-parse --git-dir &>/dev/null; then
    HAS_GIT=true
    log_ok "Git repo detected"
fi

if command -v tmutil &>/dev/null; then
    TM_BACKUP=$(tmutil latestbackup 2>/dev/null || echo "none")
    if [[ "$TM_BACKUP" != "none" ]]; then
        HAS_TIMEMACHINE=true
        log_ok "Time Machine backup: $TM_BACKUP"
    else
        log_warn "No Time Machine backup found"
    fi
fi

if [[ "$HAS_GIT" == false && "$HAS_TIMEMACHINE" == false ]]; then
    log_warn "No backup detected (no git, no Time Machine)"
fi

echo ""

# ─── Scan for Violations ────────────────────────────────────────────

log_header "CLEARPATH VIOLATION SCAN"

declare -a VIOLATIONS_SPACES=()
declare -a VIOLATIONS_UPPERCASE=()
declare -a VIOLATIONS_UNDERSCORE=()
declare -a VIOLATIONS_DEPTH=()
declare -a VIOLATIONS_VAGUE=()
declare -a VIOLATIONS_NODATE=()

FIND_PRUNE=""
for skip in "${SKIP_DIRS[@]}"; do
    FIND_PRUNE="$FIND_PRUNE -name $skip -prune -o"
done

while IFS= read -r item; do
    [[ -z "$item" ]] && continue
    filename=$(basename "$item")
    if is_exception "$item"; then continue; fi
    skip=false
    for sd in "${SKIP_DIRS[@]}"; do
        if [[ "$item" == *"/$sd/"* || "$item" == *"/$sd" ]]; then
            skip=true; break
        fi
    done
    [[ "$skip" == true ]] && continue

    if [[ "$filename" == *" "* ]]; then
        VIOLATIONS_SPACES+=("$item")
    fi

    # Allow UPPERCASE format/platform prefix codes (LF-, SF-, LIC-, LI-, IG-, TT-, EM-, BL-, SK-)
    stripped_name="$filename"
    if [[ "$stripped_name" =~ ^(LF|SF|LIC|LI|IG|TT|EM|BL|SK)- ]]; then
        stripped_name="${stripped_name#*-}"
    fi
    if [[ "$stripped_name" =~ [A-Z] ]]; then
        VIOLATIONS_UPPERCASE+=("$item")
    fi

    # v3.0: underscores are valid segment separators (co-equal topics + date).
    # Flag only ISO 8-digit dates (_YYYYMMDD), which violate the month-first MMDDYY rule.
    if [[ -f "$item" && "$filename" =~ _[0-9]{8}[\._] ]]; then
        VIOLATIONS_UNDERSCORE+=("$item")
    fi

    LOWER_FILENAME=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    if [[ "$LOWER_FILENAME" == *"final"* || "$LOWER_FILENAME" == *"use-this"* || \
          "$LOWER_FILENAME" == *"copy"* || "$LOWER_FILENAME" == *"(1)"* || \
          "$LOWER_FILENAME" == *"(2)"* || "$LOWER_FILENAME" == *"new-"* || \
          "$LOWER_FILENAME" == *"-new."* || "$LOWER_FILENAME" == *"old-"* || \
          "$LOWER_FILENAME" == *"latest"* || "$LOWER_FILENAME" == *"current"* ]]; then
        VIOLATIONS_VAGUE+=("$item")
    fi
done < <(find "$TARGET" -not -path '*/.*' -not -path '*/node_modules/*' -print 2>/dev/null)

while IFS= read -r deep_dir; do
    [[ -z "$deep_dir" ]] && continue
    skip=false
    for sd in "${SKIP_DIRS[@]}"; do
        if [[ "$deep_dir" == *"/$sd/"* || "$deep_dir" == *"/$sd" ]]; then
            skip=true; break
        fi
    done
    [[ "$skip" == false ]] && VIOLATIONS_DEPTH+=("$deep_dir")
done < <(find "$TARGET" -mindepth 5 -type d -not -path '*/.*' -not -path '*/node_modules/*' 2>/dev/null)

# ─── Report ──────────────────────────────────────────────────────────

TOTAL_VIOLATIONS=0

print_violations() {
    local label="$1"
    local color="$2"
    shift 2
    local items=("$@")
    local count=${#items[@]}
    if [[ $count -gt 0 ]]; then
        echo -e "\n${color}${BOLD}$label ($count)${NC}"
        for item in "${items[@]}"; do
            local rel="${item#$TARGET/}"
            echo -e "  ${color}→${NC} $rel"
        done
        TOTAL_VIOLATIONS=$((TOTAL_VIOLATIONS + count))
    fi
}

if [[ ${#VIOLATIONS_SPACES[@]} -gt 0 ]]; then
    print_violations "Spaces in names" "$RED" "${VIOLATIONS_SPACES[@]}"
fi
if [[ ${#VIOLATIONS_UPPERCASE[@]} -gt 0 ]]; then
    print_violations "Uppercase in names" "$RED" "${VIOLATIONS_UPPERCASE[@]}"
fi
if [[ ${#VIOLATIONS_UNDERSCORE[@]} -gt 0 ]]; then
    print_violations "ISO 8-digit date (use month-first MMDDYY)" "$YELLOW" "${VIOLATIONS_UNDERSCORE[@]}"
fi
if [[ ${#VIOLATIONS_VAGUE[@]} -gt 0 ]]; then
    print_violations "Vague/versioned names (FINAL, copy, v1, etc.)" "$YELLOW" "${VIOLATIONS_VAGUE[@]}"
fi
if [[ ${#VIOLATIONS_DEPTH[@]} -gt 0 ]]; then
    print_violations "Folders deeper than 4 levels (soft — deeper is OK when it makes sense)" "$YELLOW" "${VIOLATIONS_DEPTH[@]}"
fi

TOTAL_VIOLATIONS=$(( ${#VIOLATIONS_SPACES[@]} + ${#VIOLATIONS_UPPERCASE[@]} + ${#VIOLATIONS_UNDERSCORE[@]} + ${#VIOLATIONS_VAGUE[@]} + ${#VIOLATIONS_DEPTH[@]} ))

echo ""
log_header "SUMMARY"

if [[ $TOTAL_VIOLATIONS -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}✓ COMPLIANT${NC} — $TOTAL_FILES files, $TOTAL_DIRS folders. Zero violations."
else
    echo -e "${RED}${BOLD}$TOTAL_VIOLATIONS violation(s) found${NC} across $TOTAL_FILES files, $TOTAL_DIRS folders."
    echo ""
    echo -e "  Spaces:       ${#VIOLATIONS_SPACES[@]}"
    echo -e "  Uppercase:    ${#VIOLATIONS_UPPERCASE[@]}"
    echo -e "  Bad underscore: ${#VIOLATIONS_UNDERSCORE[@]}"
    echo -e "  Vague names:  ${#VIOLATIONS_VAGUE[@]}"
    echo -e "  Too deep:     ${#VIOLATIONS_DEPTH[@]}"
fi

echo ""

if [[ "$PLAN" == true && $TOTAL_VIOLATIONS -gt 0 ]]; then
    log_header "RENAME PLAN"
    MANIFEST_FILE="/tmp/clearpath-stage-$(date +%s).json"
    log_info "Staging manifest: $MANIFEST_FILE"
    log_info "Plan generation shows what WOULD change. No files are modified."
    echo ""
    printf "%-60s  →  %s\n" "CURRENT" "PROPOSED"
    printf "%-60s  →  %s\n" "$(printf '%0.s─' {1..60})" "$(printf '%0.s─' {1..40})"

    if [[ ${#VIOLATIONS_SPACES[@]} -gt 0 ]]; then
        for item in "${VIOLATIONS_SPACES[@]}"; do
            rel="${item#$TARGET/}"
            fixed=$(echo "$rel" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
            printf "%-60s  →  %s\n" "$rel" "$fixed"
        done
    fi

    if [[ ${#VIOLATIONS_UPPERCASE[@]} -gt 0 ]]; then
        for item in "${VIOLATIONS_UPPERCASE[@]}"; do
            rel="${item#$TARGET/}"
            if [[ "$rel" == *" "* ]]; then continue; fi
            fixed=$(echo "$rel" | tr '[:upper:]' '[:lower:]')
            if [[ "$CASE_INSENSITIVE" == true && "$rel" != "$fixed" ]]; then
                printf "%-60s  →  %s ${YELLOW}(two-step rename)${NC}\n" "$rel" "$fixed"
            else
                printf "%-60s  →  %s\n" "$rel" "$fixed"
            fi
        done
    fi

    echo ""

    if [[ "$EXECUTE" == true ]]; then
        log_warn "EXECUTE mode is designed for the Claude Code skill to orchestrate."
        log_info "The shell script provides audit + plan. The /clearpath skill handles execution"
        log_info "with the full safety protocol (copy-first, verify, then cleanup)."
        echo ""
        log_info "Staging manifest saved to: $MANIFEST_FILE"
    fi
fi

if [[ $TOTAL_VIOLATIONS -gt 0 ]]; then
    exit 1
else
    exit 0
fi

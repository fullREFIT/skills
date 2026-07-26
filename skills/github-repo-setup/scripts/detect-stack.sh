#!/usr/bin/env bash
# detect-stack.sh — Phase 0 preflight for github-repo-setup skill
# Produces a compact stack detection table. Does not install anything.
#
# Usage: bash scripts/detect-stack.sh
# Exit codes:
#   0 — detection complete (even if some tools missing)
#   1 — unsupported OS or shell error

set -uo pipefail

# Detect OS
OS="unknown"
case "$(uname -s)" in
  Darwin*) OS="macOS" ;;
  Linux*)  OS="Linux" ;;
  MINGW*|MSYS*|CYGWIN*) OS="Windows (WSL/MSYS)" ;;
  *)       OS="Unknown: $(uname -s)" ;;
esac

# Helper: check tool version with fallback
check_version() {
  local tool="$1"
  local cmd="$2"
  local version
  if command -v "$tool" >/dev/null 2>&1; then
    version=$(eval "$cmd" 2>/dev/null | head -1 | tr -d '\n')
    if [ -n "$version" ]; then
      printf "  %-20s %-12s %s\n" "$tool" "YES" "$version"
    else
      printf "  %-20s %-12s %s\n" "$tool" "YES" "(version unknown)"
    fi
  else
    printf "  %-20s %-12s %s\n" "$tool" "MISSING" "-"
  fi
}

# Helper: check nvm (not a binary — sourced into shell)
check_nvm() {
  if command -v nvm >/dev/null 2>&1; then
    printf "  %-20s %-12s %s\n" "nvm" "YES" "$(nvm --version 2>/dev/null)"
  elif [ -f "$HOME/.nvm/nvm.sh" ] || [ -f "/opt/homebrew/opt/nvm/nvm.sh" ] || [ -f "/usr/local/opt/nvm/nvm.sh" ]; then
    printf "  %-20s %-12s %s\n" "nvm" "INSTALLED" "(not loaded in shell)"
  else
    printf "  %-20s %-12s %s\n" "nvm" "MISSING" "-"
  fi
}

echo "======================================"
echo " Stack Detection — $(date)"
echo "======================================"
echo ""
echo "OS:    $OS"
echo "Shell: ${SHELL:-unknown}"
echo "User:  ${USER:-unknown}"
echo ""

echo "=== Languages ==="
check_version "node"    "node --version"
check_version "python3" "python3 --version"
check_version "go"      "go version"
check_version "rustc"   "rustc --version"
check_version "ruby"    "ruby --version"
check_version "deno"    "deno --version"
check_version "bun"     "bun --version"
check_version "java"    "java --version"
check_version "php"     "php --version"
echo ""

echo "=== Package Managers ==="
check_version "brew"    "brew --version"
check_version "npm"     "npm --version"
check_version "pnpm"    "pnpm --version"
check_version "yarn"    "yarn --version"
check_version "bun"     "bun --version"
check_version "pip3"    "pip3 --version"
check_version "uv"      "uv --version"
check_version "poetry"  "poetry --version"
check_version "cargo"   "cargo --version"
check_version "gem"     "gem --version"
echo ""

echo "=== Version Managers ==="
check_nvm
check_version "pyenv"    "pyenv --version"
check_version "rustup"   "rustup --version"
check_version "asdf"     "asdf --version"
check_version "mise"     "mise --version"
check_version "corepack" "corepack --version"
echo ""

echo "=== Tools ==="
check_version "git"     "git --version"
check_version "gh"      "gh --version"
check_version "docker"  "docker --version"
check_version "make"    "make --version"
check_version "op"      "op --version"
check_version "jq"      "jq --version"
echo ""

echo "======================================"
echo " Detection complete. No installations performed."
echo " Use this output to inform Phase 1 reconnaissance."
echo "======================================"

exit 0

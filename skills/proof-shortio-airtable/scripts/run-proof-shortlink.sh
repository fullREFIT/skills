#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: run-proof-shortlink.sh <tokenized Proof share URL>" >&2
  exit 64
fi

PROOF_URL="$1"
PROJECT_DIR="${PROOF_SHORTIO_PROJECT_DIR:-${PROJECT_ROOT:-$HOME}/proof-shortio-airtable}"
ENV_MCP="${HOME}/.env.mcp"

# Resolve values from the local env file when available (e.g. for non-interactive agent runs).
if [[ -f "$ENV_MCP" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_MCP"
fi

# Prefer the dedicated Proof shortener key when available.
if [[ -z "${SHORT_IO_API_KEY:-}" && -n "${SHORT_IO_PROOF_SHORTENER_API:-}" ]]; then
  export SHORT_IO_API_KEY="$SHORT_IO_PROOF_SHORTENER_API"
fi

# Force the verified target mapping because ~/.env.mcp may contain unrelated Airtable defaults.
export AIRTABLE_BASE_ID="${PROOF_SHORTIO_AIRTABLE_BASE_ID:-${AIRTABLE_BASE_ID:?'AIRTABLE_BASE_ID is required'}}"
export AIRTABLE_TABLE_ID="${PROOF_SHORTIO_AIRTABLE_TABLE_ID:-${AIRTABLE_TABLE_ID:?'AIRTABLE_TABLE_ID is required'}}"
export AIRTABLE_PROOF_URL_FIELD="${PROOF_SHORTIO_AIRTABLE_PROOF_URL_FIELD:-URL}"
export AIRTABLE_SHORT_URL_FIELD="${PROOF_SHORTIO_AIRTABLE_SHORT_URL_FIELD:-Backup Link}"
export AIRTABLE_TITLE_FIELD="${PROOF_SHORTIO_AIRTABLE_TITLE_FIELD:-Name}"
export SHORT_IO_DOMAIN="${PROOF_SHORTIO_SHORT_IO_DOMAIN:-${SHORT_IO_DOMAIN:?'SHORT_IO_DOMAIN is required'}}"

if [[ -z "${AIRTABLE_API_KEY:-}" || "${AIRTABLE_API_KEY:-}" == op://* ]]; then
  echo "AIRTABLE_API_KEY is missing or unresolved. Source ~/.env.mcp or export a resolved Airtable PAT first." >&2
  exit 78
fi

if [[ -z "${SHORT_IO_API_KEY:-}" || "${SHORT_IO_API_KEY:-}" == op://* ]]; then
  echo "SHORT_IO_API_KEY is missing or unresolved. Source ~/.env.mcp or export a resolved Short.io API key first." >&2
  exit 78
fi

cd "$PROJECT_DIR"
npm start -- "$PROOF_URL"

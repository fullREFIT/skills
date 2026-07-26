# proof-shortio-airtable skill

Operating skill for seamless Proof document to Short.io to Airtable automation.

## Purpose

This skill lets a user provide Markdown or draft content and receive a tracked Proof link in one seamless step. It creates the Proof document, creates or reuses the Short.io link on your configured domain, and records the result in Airtable.

It also supports the older path where a tokenized Proof URL already exists and only needs a shortlink plus Airtable tracking.

## Files

- `SKILL.md`: Agent operating instructions.
- `references/runtime-contract.md`: Activation, credentials, field mapping, and troubleshooting.
- `scripts/create-proof-and-shortlink.sh`: One-step wrapper for Markdown to Proof doc to Short.io to Airtable.
- `scripts/run-proof-shortlink.sh`: Local runner for existing tokenized Proof URLs.

## Configuration

Set these environment variables before running the automation. Store them in `~/.env.mcp` or export them in your shell:

| Variable | Description |
|---|---|
| `SHORT_IO_DOMAIN` | Your Short.io custom domain (e.g. `your-domain.co`) |
| `AIRTABLE_BASE_ID` | Your Airtable base ID (format: `appXXXXXXXXXXXX`) |
| `AIRTABLE_TABLE_ID` | Your Airtable table ID (format: `tblXXXXXXXXXXXX`) |
| `SHORT_IO_API_KEY` | Your Short.io API key |
| `AIRTABLE_API_KEY` | Your Airtable personal access token (`pat...`) |

Optional overrides (defaults shown in `run-proof-shortlink.sh`):

| Variable | Description |
|---|---|
| `AIRTABLE_PROOF_URL_FIELD` | Airtable field for the Proof document URL (default: `URL`) |
| `AIRTABLE_SHORT_URL_FIELD` | Airtable field for the Short.io link (default: `Backup Link`) |
| `AIRTABLE_TITLE_FIELD` | Airtable field for the document title (default: `Name`) |
| `SHORT_IO_PROOF_SHORTENER_API` | Alternative Short.io key variable name (mapped to `SHORT_IO_API_KEY` automatically) |

## User-facing contract

The user should receive a human-readable result, not JSON:

- Proof document link.
- Short.io shortlink.
- Airtable record ID or confirmation.
- Verification summary.

## Reload note

After installing or updating the skill, agents may need a fresh session before the new skill appears in their skill index.

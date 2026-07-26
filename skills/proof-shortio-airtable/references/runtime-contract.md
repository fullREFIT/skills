# Runtime contract

## Current status

The automation code lives at `${PROJECT_ROOT}/proof-shortio-airtable` and tests have passed. It is not a hosted service. It runs when an agent or shell command invokes it with a Proof share URL.

## Activation requirements

No button needs to be turned on for the local automation. To make it work, a run must provide these values:

```text
AIRTABLE_API_KEY=resolved Airtable PAT, not an op:// reference
AIRTABLE_BASE_ID=${AIRTABLE_BASE_ID}
AIRTABLE_TABLE_ID=${AIRTABLE_TABLE_ID}
AIRTABLE_PROOF_URL_FIELD=URL
AIRTABLE_SHORT_URL_FIELD=Backup Link
AIRTABLE_TITLE_FIELD=Name
SHORT_IO_API_KEY=resolved Short.io key
SHORT_IO_DOMAIN=${SHORT_IO_DOMAIN}
```

Optional fields are not enabled by default because the live Airtable table may not have dedicated Proof Doc ID or Short.io ID fields, and `Last Updated` is a date field rather than date-time.

## Known Airtable schema

The table used by this automation should have these fields:

Table: `Proof.ai Links` (configure via `AIRTABLE_TABLE_ID`)

Fields:

- `Name`, multiline text
- `Visit URL Button`, button
- `URL`, url
- `Description`, multiline text
- `Last Updated`, date
- `Backup Link`, multiline text
- `Description 2`, multiline text

## Credential setup

`AIRTABLE_API_KEY` must be a resolved Airtable personal access token (starts with `pat`). A literal `op://...` reference will cause Airtable to return `AUTHENTICATION_REQUIRED`.

Recommended: store resolved values in `~/.env.mcp` and source that file before running.

Working credential variable names to store in `~/.env.mcp`:

- `AIRTABLE_API_KEY`
- `SHORT_IO_API_KEY`
- `SHORT_IO_PROOF_SHORTENER_API` (alternative Short.io key, mapped automatically)

## Preferred run command

```bash
~/.claude/skills/proof-shortio-airtable/scripts/run-proof-shortlink.sh "https://www.proofeditor.ai/d/<slug>?token=<token>"
```

## Failure meanings

- Airtable 401: usually unresolved `op://` token or missing PAT.
- Airtable field error: env mapping does not match the live table fields.
- Short.io auth error: wrong Short.io key or key not resolved from your secret store.
- Short.io domain error: `SHORT_IO_DOMAIN` is not a configured domain in your Short.io account.

## Safe change policy

Keep this automation narrow. It should only validate a Proof URL, resolve a title, dedupe via Airtable, create or reuse a Short.io link, and write the result to Airtable.

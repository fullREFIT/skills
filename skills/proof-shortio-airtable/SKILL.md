---
name: proof-shortio-airtable
description: "This skill creates Proof documents from Markdown or draft content, creates or reuses Short.io links for them, and records the result in Airtable. Use it when you want a seamless Proof link workflow, when a Proof document URL needs a shortlink, when creating tracked Proof docs, when troubleshooting Proof to Short.io to Airtable syncs, when configuring the automation, or when checking activation status. MANDATORY TRIGGERS: Proof shortlink, create Proof link, tracked Proof link, proof-shortio, proof-shortio-airtable, proof-shortlink-Airtable, proof-shortlink-airtable, Proof.ai Links, Short.io, Airtable shortlink, proof share URL."
license: MIT
allowed-tools: Bash, Read, Write
metadata:
  user-invocable: "true"
---

# Proof Short.io Airtable

Operate the local automation at `${PROJECT_ROOT}/proof-shortio-airtable`.

## Purpose

This skill exists to make Proof link creation and tracking seamless. The user should be able to provide a title and Markdown or draft content, then receive a clean human result: the Proof document link, the Short.io shortlink, and confirmation that Airtable was updated.

The preferred workflow is one step:

1. Create the Proof document from Markdown or draft content.
2. Use the tokenized Proof URL internally.
3. Create or reuse the Short.io link on `${SHORT_IO_DOMAIN}`.
4. Write or confirm the Airtable row.
5. Report a human-readable result, not JSON.

The existing URL-only workflow remains valid when a tokenized Proof URL already exists.

## Required reading

Before running or changing the automation, read `references/runtime-contract.md`.

## Default runtime mapping

Use this mapping unless the SSOT says otherwise. Override by setting the corresponding env vars:

- `AIRTABLE_BASE_ID=${AIRTABLE_BASE_ID}`
- `AIRTABLE_TABLE_ID=${AIRTABLE_TABLE_ID}`
- `AIRTABLE_PROOF_URL_FIELD=URL`
- `AIRTABLE_SHORT_URL_FIELD=Backup Link`
- `AIRTABLE_TITLE_FIELD=Name`
- `SHORT_IO_DOMAIN=${SHORT_IO_DOMAIN}`

Do not set `AIRTABLE_SHORTENED_AT_FIELD` to `Last Updated` unless the code is changed to write a date-only value or the Airtable field is changed to date-time.

## Seamless create-and-track workflow

When the user provides Markdown or draft content and asks for a Proof link, create the Proof document first, then shortlink and track it. Do not ask the user to manually create the Proof doc first.

Use this wrapper when the user provides Markdown or draft content:

```bash
~/.claude/skills/proof-shortio-airtable/scripts/create-proof-and-shortlink.sh \
  --title "Document title" \
  --markdown-file "/absolute/path/to/source.md" \
  --slug "optional-custom-shortio-path"
```

The wrapper:

1. Read the Markdown source.
2. Create a Proof doc with `POST https://www.proofeditor.ai/share/markdown`.
3. Keep `accessToken`, `ownerSecret`, and tokenized URLs out of user-facing logs.
4. Pass the tokenized Proof URL to the existing shortlink runner.
5. Verify the Short.io redirect without printing the Proof token.
6. Verify the Airtable row.
7. Returns a plain-English success message with the safe links and record ID.

## Existing Proof URL workflow

Use the helper script when a tokenized Proof URL already exists:

```bash
~/.claude/skills/proof-shortio-airtable/scripts/run-proof-shortlink.sh "https://www.proofeditor.ai/d/<slug>?token=<token>"
```

The script sources `~/.env.mcp` when available, maps `SHORT_IO_PROOF_SHORTENER_API` to `SHORT_IO_API_KEY`, sets non-secret defaults, then runs `npm start` in the project directory.

## Validation workflow

1. Confirm whether the input is draft content or an existing tokenized Proof share URL.
2. If the input is draft content, create the Proof doc first.
3. If the input is an existing tokenized Proof URL, skip doc creation.
4. Run the shortlink and Airtable sync.
5. Confirm the internal runner output includes a `shortUrl`, `recordId`, and title.
6. Re-read the Airtable row if a production change needs verification.
7. If Airtable returns `401`, check whether `AIRTABLE_API_KEY` is an unresolved `op://` reference instead of a resolved `pat...` token.
8. If Short.io fails, verify `SHORT_IO_PROOF_SHORTENER_API` or `SHORT_IO_API_KEY` exists in `~/.env.mcp` and that `${SHORT_IO_DOMAIN}` is a configured Short.io domain.

## Reporting contract

The user-facing output should be simple and human-readable:

- Status.
- Proof document link.
- Short.io shortlink.
- Airtable record ID or confirmation.
- What was verified.

Do not provide JSON to the user as the primary result. JSON is acceptable only as internal machine output between scripts or for debugging under a clearly labeled technical section.

## Boundaries

Do not print secrets. Do not expose Proof share tokens or `ownerSecret` in chat. Do not create new Airtable fields without explicit approval. Do not introduce Supabase, a generic link platform, or a CMS.

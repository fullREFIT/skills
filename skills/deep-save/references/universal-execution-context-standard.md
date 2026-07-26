# Universal Execution Context Standard for Deep Save

Use this reference when the next model or agent does not read Hermes `AGENTS.md` files.

## Source hierarchy

Use this order unless the user provides a more specific current instruction:

1. System and platform rules.
2. The user's current explicit instruction.
3. Current local continuation brief or handoff file.
4. Project-local instructions, if present.
5. Durable knowledge store, if available.
6. Human-facing restart board, if available.
7. Older handoffs and archived recaps.
8. Model memory or training data.

If sources conflict, trust the more current and more local source. State the conflict and the source chosen.

## Durable sources

Use the durable knowledge and task system as the source of truth when available. For this system, that is the configured knowledge MCP (e.g., Open Brain or equivalent).

Use the restart board as a human-facing cockpit only. It is not the sole source of truth.

A complete deep save should write or update:

- durable decisions and learnings,
- pending tasks with owner and completion criteria,
- local continuation brief when files are available,
- restart-board section when Proof is available.

## Safety rules

Never save or expose:

- API keys,
- bearer tokens,
- OAuth tokens,
- raw share tokens,
- tokenized URLs,
- private credentials,
- secret URLs,
- full environment dumps.

Do not send external messages, post publicly, deploy, delete data, rotate credentials, or change production systems unless explicitly asked. Deep save is a preservation task, not an execution task.

## File and path rules

When writing or referencing files, use absolute paths. Do not make future agents guess the working directory.

If a path is unknown, say it is unknown rather than inventing one.

## Task hygiene

If work remains, create durable tasks rather than leaving them only in chat.

Each task should include:

- project prefix,
- exact action,
- relevant absolute path or safe URL,
- what it unblocks,
- done criteria,
- owner if known.

Do not create a task for work that is already complete.

## Verification standard

Do not claim a save, link, file, or board update worked unless it was verified.

Acceptable verification examples:

- re-read the created file,
- confirm the knowledge MCP returned thought or task IDs,
- re-read the restart board or confirm stable anchors exist,
- confirm the short-link automation returned a short URL and record ID.

If verification is partial, state what remains unverified.

# start-session

Cross-surface session-start protocol (Claude Code, Cowork, Desktop, web). Renamed from
`cc-start-session` and extended with automatic token-cheap resume — **no flag to remember.**

## Auto-routing (Step 0 decides for you)
On every run the skill first looks for a deep-save CONTINUATION-BRIEF for the project, then routes:
- **PATH A — brief-only (token-cheap):** chosen automatically **whenever a brief exists**. Loads only
  the brief (~1–3k tokens) and **never** runs `claude --continue` (which would reload the full
  transcript). This is the default after the deep-save → /clear → resume loop.
- **PATH B — warm-start (full context):** chosen automatically **when no brief exists**. On Claude Code
  tries `claude --continue`; otherwise reconstructs from Open Brain + local files + archaeology.

You do not type `--fresh`. Flags are **optional overrides only**: `--full` forces the complete reload
even when a brief exists; `--fresh` forces brief-only.

## The loop this completes
```
long thread → /deep-save (writes the brief) → /clear (or new surface) → start-session --fresh
```
`/compact` can't do this — it's in-session only. The brief is durable and cross-surface, so the
restart works in a new terminal, on another machine, or in Cowork/Desktop.

## Usage
- `start-session` — auto-routes: brief-only if a brief exists, else warm-start. **This is all you need.**
- `start-session <project>` — override project-name detection.
- `start-session --full` — force the complete reload even if a brief exists.
- `start-session --fresh` — force brief-only (rarely needed; it's already automatic).

## Files
```
start-session/
├── SKILL.md
├── README.md
├── references/
│   ├── fresh-mode.md             # full --fresh procedure (brief location, load, present, fallbacks)
│   └── chat-recap-template.md    # canonical chat-recap structure (DEFAULT-mode parsing)
├── scripts/                      # (none required)
└── assets/                       # (none required)
```

## Requires
Open Brain MCP is used for cross-surface retrieval when available. The skill degrades gracefully when
no knowledge MCP is present — it falls back to local files and chat archaeology. Bash optional (Claude
Code paths only). Companions: **deep-save** (writes the CONTINUATION-BRIEF), **cc-save-session**
(writes chat-recaps).

*v3.0 — June 2026*

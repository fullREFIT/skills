# deep-save

Extract a long conversation into a knowledge MCP (e.g., Open Brain or equivalent) with signal/noise triage and permanence classification —
**and** write a durable, cross-surface **CONTINUATION-BRIEF** so a fresh context window can resume the
exact thread without reloading the bloated transcript.

## Two outputs
1. **Atomized thoughts** — permanence-tiered (permanent / long-lived / short-lived), deduped, linked.
   Preserves *knowledge*.
2. **CONTINUATION-BRIEF** (v1.1) — one 1–3k-token doc written to a local file **and** the knowledge MCP
   (`chat_recap`). Preserves *where we are*. This is what `start-session --fresh` loads.

## Why the brief (vs `/compact`)
`/compact` summarizes in-session only — it cannot travel to a new terminal, machine, or surface
(Cowork/Desktop). The brief is durable and cross-surface: deep-save here → `/clear` → `start-session
--fresh` anywhere reloads ~1–3k tokens instead of the full session.

## Usage
- `deep save` / `/deep-save` — full run (thoughts + brief).
- `deep save just <topic>` — scope extraction to one topic.
- Run it right before you `/clear` a long thread.

## Files
```
deep-save/
├── SKILL.md
├── README.md
├── references/
│   ├── permanence-tiers.md          # tier classification rules
│   ├── content-templates.md         # per-type content structure
│   ├── mcp-tools.md                 # knowledge MCP reference
│   └── continuation-brief-template.md  # Step 6 brief structure + write locations
├── scripts/                         # (none required)
└── assets/                          # (none required)
```

## Requires
A knowledge MCP (e.g., Open Brain or equivalent) with `permanent` + `stale_after` params. See changelog. Works on all Claude
surfaces with a compatible knowledge MCP connected. Companion: **start-session --fresh**.

*v1.1 — June 2026*

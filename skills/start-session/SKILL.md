---
name: start-session
description: "Cross-surface session-start protocol (Claude Code, Codex, Cowork, Desktop, web). AUTO-DETECTS the right resume path — no flag to remember: on every run it first looks for a deep-save CONTINUATION-BRIEF for the project; if one exists it resumes from the brief ONLY (~1-3k tokens, skips claude --continue) so you never reload a bloated transcript; if none exists it warm-starts (claude --continue, else Open Brain + local files + archaeology) and presents a synthesized summary with Final Exchange. Optional overrides: --full forces the complete reload even when a brief exists; --fresh forces brief-only. Applies the Brain-First Rule for the session. MANDATORY TRIGGERS: start session, start-session, resume, resume session, pick up where we left off, continue session, where did we leave off, restart project, restart session, what was I working on, resume project, fresh start, warm restart, resume without bloat, load the brief, continuation brief resume, --fresh, --full."
license: MIT
allowed-tools: Read, Bash, Glob, Grep
metadata:
  version: "3.1.0"
  user-invocable: "true"
  argument-hint: "[optional: project name] [--full forces complete reload] [--fresh forces brief-only]"
---
# Start Session (cross-surface, auto-routing)

Session-start protocol for **any** surface — Claude Code, Codex, Cowork, Claude Desktop, web. Companion to
`deep-save` (writes the CONTINUATION-BRIEF this skill reads) and `cc-save-session` (writes chat-recaps).

**You never need a flag.** The skill decides the resume path itself by checking whether a
CONTINUATION-BRIEF exists. The two paths:

- **PATH A — brief-only resume (token-cheap):** chosen automatically **whenever a CONTINUATION-BRIEF
  exists** for the project. Loads only the brief (~1–3k tokens). **Never** runs `claude --continue` /
  `claude --resume` — those replay the full bloated transcript, the exact thing the brief exists to
  avoid. This is the back half of the deep-save → /clear → resume loop.
- **PATH B — warm-start (full context):** chosen automatically **when no brief exists**. On Claude Code
  tries the native resume command when explicitly appropriate; otherwise reconstructs from Open Brain + local files + chat archaeology.

> **Open Brain dependency note:** Steps that query Open Brain (search_thoughts, get_hot_context, etc.) require an Open Brain MCP server to be connected. The skill degrades gracefully when no knowledge MCP is present — it falls back to local files and chat archaeology for all retrieval.

Read [`references/fresh-mode.md`](references/fresh-mode.md) for the full brief-only procedure,
[`references/chat-recap-template.md`](references/chat-recap-template.md) for recap parsing, and
[`references/universal-start-session-prompt.md`](references/universal-start-session-prompt.md) when using this workflow in ChatGPT, Gemini, or another LLM that cannot install local skills.

---


## Universal deep-save handoff compatibility

The current `deep-save` skill can produce handoffs for Claude, ChatGPT, Gemini, Codex, Cowork, Hermes, and other LLMs. At session start, treat those universal deep-save artifacts as first-class context.

When a continuation brief or restart board references these files, load or quote them before broad transcript reloads:

- `references/universal-agent-operating-standard.md`
- `references/universal-execution-context-standard.md`
- `references/universal-deep-save-prompt.md`

Apply the same signal filter on resume:

- Treat corrected decisions, durable rules, verified state, owner, and next action as authoritative.
- Treat assistant mistakes, glazing, sycophancy, apologies, false starts, and superseded recommendations as historical noise unless the brief explicitly preserved a durable lesson from them.
- If the continuation brief says a prior recommendation was superseded, do not revive the old recommendation from a transcript, memory, or model default.
- Your external reference system (e.g., a shared doc, wiki, or dashboard) is a human-facing index. Open Brain and the local continuation brief remain the durable sources of truth.
- If a weekly short link is present, use it as a safe pointer only. Do not copy tokenized URLs into reports, Open Brain, logs, or local files.

## Step 0 — Auto-route (ALWAYS run first; this is the whole point)

### 0a. Resolve project name
Strip any `--full` / `--fresh` token from the argument first, then:
1. **Explicit override** — a project name in the argument.
2. **`.project-name` file** — `{pwd}/.project-name` if present.
3. **`pwd` basename** — lowercased with hyphens (Claude Code or Codex with a project cwd).
4. **Ask** — if `pwd` is home/root, or on a surface with no cwd (Desktop/web), ask which project
   (or infer it from the brief search in 0b if exactly one obvious match returns).

### 0b. Look for a CONTINUATION-BRIEF (cheap — do this before anything else)
- **Open Brain (every surface, when available):** `search_thoughts(query="CONTINUATION-BRIEF {project}", limit=3, detail_level="full")`.
  A brief is a result whose **first body line contains the literal marker `CONTINUATION-BRIEF`** and
  matches `{project}`. Do NOT filter by `type` — the save tools only *hint* type and the server may
  store the brief as observation/reference; the marker string is the reliable key.
- **Local (bash surfaces):**
  ```bash
  ROOT="{project-root}"
  [ -n "$ROOT" ] && [ "$ROOT" != "$HOME" ] \
    && F="$ROOT/chat-recap-project-handoff/CONTINUATION-BRIEF.md" \
    || F="$HOME/.claude/continuation/CONTINUATION-BRIEF_{project}.md"
  [ -f "$F" ] && echo FOUND
  ```
If both exist, use the newer (compare the brief header date / OB `created_at`).

### 0c. Route
| Condition | Path |
|-----------|------|
| Brief found, no override | **PATH A** (brief-only) — default whenever a brief exists |
| Brief found **and** user passed `--full` / said "load full / everything / whole transcript" | **PATH B** (warm-start) |
| No brief found | **PATH B** (warm-start) |
| `--fresh` passed but no brief | Tell the user no brief exists; offer PATH B, or to run `deep-save` in the source session first |

A brief older than 30 days: still route to PATH A, but flag the staleness in the presentation so the
user can choose to load full instead. Never silently `claude --continue` when a brief exists.

---

## PATH A — Brief-only resume (auto-selected when a brief exists)

Full detail in [`references/fresh-mode.md`](references/fresh-mode.md). Summary:

### A1 — Hard rule
**Do NOT run `claude --continue` or `claude --resume`.** They replay the entire transcript. If the user
explicitly wants the full transcript, that is PATH B (an override), not this path.

### A2 — Load ONLY the brief
Read just the brief found in Step 0b. Do **not** run `get_hot_context`, `get_knowledge_index`,
`thought_stats`, chat archaeology, or local chat-recaps — the brief is self-sufficient (Active Goal,
State, Open Loops, ▶ Immediate Next Step, Key Files, Open Brain anchors, Final Exchange, Resume
pointers). Optional, cheap: fetch the specific Open Brain IDs the brief lists via
`get_thought_detail(ids=[...])` only if the next step needs them.

### A3 — Present + confirm
```
RESUMING (brief) — {project}
─────────────────────────────────────────
Brief source:  {Open Brain <id> | local <path>}  ·  written {timestamp}
Context cost:  brief only (~{N}k tokens) — full transcript NOT loaded

Active Goal:   {from brief}

▶ Immediate Next Step:
  {exact action from brief}

Where we paused (Final Exchange):
  You: "{abbrev}"   Me: "{abbrev}"

Open loops: {top 2-3}
─────────────────────────────────────────
```
> "Pick up from the Immediate Next Step on a fresh context? (Full transcript NOT loaded — say 'load full' if you need the whole thread.)"

---

## PATH B — Warm-start (auto-selected when no brief exists, or `--full`)

### B0: Try `claude --continue` First (Claude Code only)
```bash
claude --continue 2>/dev/null
```
If successful, full transcript context is restored. Skip B1–B6. Confirm briefly:
> "Resumed your session from {timestamp}. Last we were on: {summary}. Continue?"

Only proceed to cold-start if continue is unavailable (different machine, expired, cleared) or the user
wants a summary. Not on non-Claude-Code surfaces (no `claude` CLI) — go to B1.

### B1: Open Brain Warm-Up (silent, parallel) — skip if no knowledge MCP is connected
```
get_hot_context                  # 500-word summary of last 7 days
get_knowledge_index              # cached topic/people/project overview
thought_stats                    # totals, types, sources, date range
list_tasks status=pending limit=20
list_tasks status=completed days=3 limit=20
```
Note totals, date range, top topics, source breakdown; filter tasks to this project; note work done by
other surfaces.

### B2: Find the Last Session (sequential passes; stop at a chat-recap with a Final Exchange)
- **Pass A — chat-recap:** `search_thoughts query="chat-recap {project}" type=chat_recap limit=3 detail_level=full`. Parse Active Goal (§1), Immediate Next Step (§5), Context for Resume (§7), Final Exchange (§8).
- **Pass B — project-handoff:** `search_thoughts query="project-handoff {project}" limit=1 detail_level=full`. Absence normal.
- **Pass C — recent activity:** `search_thoughts query="{project}" since_date="{7d ago ISO}" detail_level=compact limit=10`. **Skeleton detection:** ignore minimal "Session completed." notes; look further back.
- **Pass D — archaeology (fallback):** only if Pass A empty/stale — `conversation_search query="{project}" max_results=5` + `recent_chats n=5`.
- **Pass E — belief timeline (dormant >14d):** `get_belief_timeline topic="{project}" limit=10`.

### B3: Read Local Project State (bash surfaces only)
```bash
RECAP_DIR="$(pwd)/chat-recap-project-handoff"
LATEST_RECAP=$(ls -t "${RECAP_DIR}/chat-recap_${PROJECT_NAME}_"*.md 2>/dev/null | head -1)
LATEST_HANDOFF=$(ls -t "${RECAP_DIR}/project-handoff_${PROJECT_NAME}_"*.md 2>/dev/null | head -1)
LESSONS="${RECAP_DIR}/lessons-learned.md"
```
Also read if present: `CLAUDE.md`, `.claude/settings.json`, `~/.claude/my-tasks.yaml`,
`~/.claude/goals.yaml` (path is configurable — adjust to wherever your goals file lives). Note any my-tasks vs Open Brain conflict.

### B4: Reconcile
If both a local and an Open Brain chat-recap exist, the **newer wins**; note which surface wrote it.
Note relevant tasks completed elsewhere.

### B5: Present Context
```
RESUMING — {project}
─────────────────────────────────────────
Last session:   {timestamp}     Last surface: {CC | Cowork | Desktop | web}
Resume mode:    {claude --continue | cold-start from chat-recap}

Active Goal:    {§1}
Immediate Next Step:
  {§5 — the EXACT action}
Final Exchange (where we paused):
  You said: "{§8 abbrev}"     I responded: "{§8 abbrev}"
Files Modified Last Session: {§4 top 3-5}
Open Brain:
  Pending ({N}): {top 3 by priority}    Completed elsewhere: {N}
Cross-Surface Activity: {since last recap, or "None detected"}
Relevant Standing Decisions: {1-2 from lessons-learned bearing on the goal}
Proposed focus: {one sentence}
─────────────────────────────────────────
```
Tone: "Here's what's on deck." Never "you have incomplete tasks." Then confirm:
> "Pick up from the Immediate Next Step? Or has the situation changed since {timestamp}?"

---

## Step 6 (both paths): Brain-First Rule (entire session)
Before answering ANY factual question about tools, people, projects, API behavior, pricing, decisions,
or prior work: `search_thoughts` first (when Open Brain is available); use results >50% similarity; fall back to training data only if nothing relevant. A wrong answer from training data is worse than "let me check."

## Halt Conditions
- **Open Brain unreachable:** PATH A → try the local brief file; if neither, tell the user and offer PATH B. PATH B → fall back to local files + archaeology; report degraded state.
- **No brief and no chat-recap anywhere:** project name may be wrong or this is fresh — ask to confirm.
- **Brief/recap older than 30 days:** surface it; the project may have evolved.

## What This Skill Does NOT Do
- Does not auto-execute the next step without confirmation.
- Does not close stale tasks (that's `cc-save-session`).
- In PATH A, does not reload the full transcript or run the broad warm-up — brief only.
- Read-only — it never writes (deep-save / cc-save-session handle writes).

## Bundled Resources
| File | Purpose |
|------|---------|
| `references/fresh-mode.md` | Full PATH A (brief-only) procedure: brief location, load, present, fallbacks |
| `references/chat-recap-template.md` | Canonical chat-recap structure (PATH B parsing) |
| `references/universal-start-session-prompt.md` | Portable paste-ready prompt for ChatGPT, Gemini, and other LLMs without local skill installation |

---
*Start Session v3.1 — June 2026*
*v3.1: brief detection is now automatic (Step 0 auto-route) — no `--fresh` flag needed; flags are optional overrides only (`--full` forces reload, `--fresh` forces brief-only).*
*v3.0: renamed from cc-start-session; unified cross-surface; added brief-only resume.*
*Companions: deep-save (writes the CONTINUATION-BRIEF), cc-save-session (writes chat-recaps)*

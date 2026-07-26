# PATH A — Brief-only resume — full procedure

This is the resume half of the **deep-save → /clear → resume** loop. It is selected **automatically**
by Step 0 whenever a CONTINUATION-BRIEF exists for the project — the user does **not** type `--fresh`
(that flag only forces this path when you'd otherwise warm-start). Its single promise: bring back
*where we are* without bringing back the *tokens*. Brief-only; never touches the full transcript.

## The loop it completes

```
[long bloated thread]
   │  run /deep-save        → atomized thoughts + ONE CONTINUATION-BRIEF (local file + Open Brain)
   │  /clear                → fresh, empty context window (same process)  — OR open any new surface
   ▼
start-session --fresh       → loads ONLY the brief (~1–3k tokens) → continue the exact thread
```

Contrast: `claude --continue` / `claude --resume` replay the **entire** JSONL transcript (e.g. 600k+
tokens). `/compact` summarizes but only in-session and cannot travel to another terminal/surface.
`--fresh` is the durable, cross-surface, token-cheap path.

## Procedure

### 1. Hard rule — no transcript reload
Do **not** run `claude --continue` or `claude --resume`. If the user explicitly wants the full
transcript back, that is a different request — tell them to use `claude --resume` and pick the session;
do not do it implicitly inside `--fresh`.

### 2. Resolve project name
Same detection as DEFAULT mode (`--fresh` flag stripped first): explicit arg → `.project-name` →
`pwd` basename → ask. On Desktop/web (no cwd), ask the user which project, or infer from the brief
search results if one obvious match returns.

### 3. Find the latest brief (stop at first hit)
1. **Open Brain (all surfaces, when available):**
   ```
   search_thoughts(query="CONTINUATION-BRIEF {project}", limit=3, detail_level="full")
   ```
   Pick the most recent result whose **first body line contains the literal `CONTINUATION-BRIEF`
   marker** and matches the project. Do **not** hard-filter by `type` — the save tools only hint type
   (the server may store the brief as reference/session_notes), so the marker string is the reliable
   key, not the type.
2. **Local file (bash surfaces):**
   ```bash
   ROOT="{project-root}"   # cwd project root if it has one
   if [ -n "$ROOT" ] && [ "$ROOT" != "$HOME" ]; then
     F="$ROOT/chat-recap-project-handoff/CONTINUATION-BRIEF.md"
   else
     F="$HOME/.claude/continuation/CONTINUATION-BRIEF_${PROJECT}.md"
   fi
   [ -f "$F" ] && cat "$F"
   ```
If both exist, prefer whichever is newer (compare the brief's header timestamp / Open Brain
`created_at`). They should match — deep-save writes both in the same run.

### 4. Load only the brief
Read that one document. Do **not** call `get_hot_context`, `get_knowledge_index`, `thought_stats`,
chat archaeology, or read local chat-recaps. The brief already contains everything needed:
Active Goal, State (done), Open Loops (not done), ▶ Immediate Next Step, Key Files, Open Brain anchors,
Final Exchange, Resume pointers. Pulling more defeats the token goal.

Optional, cheap enrichment (only if the brief references them and the next step needs them): fetch the
specific Open Brain thought/task IDs the brief lists via `get_thought_detail(ids=[...])`. Targeted, not
broad.

### 5. Present + confirm
Use the FRESH presentation block in SKILL.md (Brief source, Context cost, Active Goal, ▶ Immediate
Next Step, Final Exchange, Open loops). Then confirm before acting:
> "Pick up from the Immediate Next Step on a fresh context? Full transcript is NOT loaded — tell me if you need it."

### 6. Fallbacks
- **No brief found:** state it plainly. Offer: (a) run `deep-save` in the source session and retry, or
  (b) switch to DEFAULT cold-start (more tokens). Never silently `claude --continue`.
- **Open Brain down, local brief present:** use the local file. **Both unreachable:** report and ask.
- **Brief older than 30 days:** surface the staleness; the project may have moved on.
- **Brief lacks an Immediate Next Step:** the source deep-save was thin — present what exists and ask
  the user to set the next action.

## Why a stable, dateless brief filename
`CONTINUATION-BRIEF.md` (and the home-fallback `CONTINUATION-BRIEF_{project}.md`) is a *latest pointer*,
overwritten each deep-save — the same precedent as `lessons-learned.md`. This guarantees `--fresh` has a
deterministic path to read without globbing dates. The dated history, if ever wanted, lives in Open
Brain as superseded `chat_recap` thoughts.

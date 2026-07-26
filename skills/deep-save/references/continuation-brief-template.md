# Continuation Brief — template & rules

The continuation brief is a **single, tight (~1–3k token) document** whose only job is to let a
**fresh context window** resume this exact thread without reloading the full transcript. It is the
durable, cross-surface alternative to `/compact` (which is in-session only and cannot travel to
Cowork/Desktop).

## Where it is written (deep-save writes BOTH)

1. **Local file (fast, token-cheap):**
   - If a project root exists: `{project-root}/chat-recap-project-handoff/CONTINUATION-BRIEF.md`
   - If `pwd` is home/root or no project root: `~/.claude/continuation/CONTINUATION-BRIEF_{project}.md`
   - Filename is **stable and dateless** (a "latest pointer", same precedent as `lessons-learned.md`).
     Overwrite on every deep-save — one current brief per project, always.
2. **Knowledge MCP (cross-surface durability):** one thought, `type: chat_recap`, whose body is the brief
   verbatim, with the literal marker `CONTINUATION-BRIEF` and `[PROJECT]` prefix in the first line so
   `start-session --fresh` can find it from any surface (Cowork, Desktop, web, another machine).
   Set `permanent: false`, `stale_after` = +30 days (it is a resume pointer, not durable knowledge —
   the durable knowledge is the atomized thoughts deep-save already saved).

## Required structure (keep it lean — every line earns its tokens)

```markdown
# CONTINUATION-BRIEF — {project} — {MMDDYY HH:MM}

> Resume THIS thread in a FRESH window. Load only this brief.
> Do NOT run `claude --continue` / `claude --resume` (those reload the full bloated transcript).

## Active Goal
{1–2 sentences — what we are ultimately trying to do}

## State — done
- {bullet}  {bullet}  ...

## Open Loops — not done
- {bullet}  {bullet}  ...

## ▶ Immediate Next Step (exact)
{the precise next action — exact command, file, or decision; not a category}

## Key Files (absolute paths)
- /abs/path — what it is

## Knowledge MCP anchors
- Thoughts: {short-id — title}
- Tasks: {short-id — title (status)}

## Final Exchange (where we paused)
- You: "{abbreviated last user message}"
- Me: "{abbreviated last assistant response}"

## Resume pointers
- Brief (local): {absolute path}
- Brief (knowledge MCP): thought {short-id}, type chat_recap, marker CONTINUATION-BRIEF
- Full transcript (only if truly needed): `cd {pwd} && claude --resume` then pick this session
```

## Rules
- **Lean.** Target 1–3k tokens. If the thread touched many topics, summarize — do not transcribe.
- **Exact next step.** The single most valuable line. Make it executable, not a theme.
- **Mask secrets** (same patterns as the main skill): never write keys/tokens into the brief.
- **One brief per project.** Overwrite the local file; supersede the prior knowledge MCP brief thought
  (search for an existing `CONTINUATION-BRIEF {project}` chat_recap and `update_thought` it if found,
  else create new) so `--fresh` always finds exactly one current brief.
- The brief is **separate from** the atomized permanence-tiered thoughts. Those preserve knowledge;
  the brief preserves *where we are*. Write both.

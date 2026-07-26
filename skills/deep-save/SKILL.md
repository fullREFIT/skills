---
name: deep-save
description: "Extract and save a long conversation to a knowledge MCP (e.g., Open Brain or equivalent) with signal/noise triage and permanence classification, AND write a durable cross-surface CONTINUATION-BRIEF for token-cheap fresh-context resume. Classifies every extractable item into three permanence tiers (permanent for decisions/rules/person notes, long-lived at 120-180 days, short-lived at 30-90 days), deduplicates, batch-writes with permanent/stale_after flags, links thoughts, then writes a 1-3k-token brief (local file + knowledge MCP) so a cleared/fresh window — on any surface incl. Cowork/Desktop — can resume the exact thread without reloading the full transcript. Works on any Claude surface with a compatible knowledge MCP. MANDATORY TRIGGERS: deep save, save this conversation, save chat to brain, extract and save, long save, full save, save everything important, save session to open brain, capture conversation, brain dump, continuation brief, warm restart prep, save before clear, prep for fresh context."
license: MIT
allowed-tools:
  - mcp__open-brain__save_thought
  - mcp__open-brain__save_thoughts_batch
  - mcp__open-brain__create_task
  - mcp__open-brain__create_tasks_batch
  - mcp__open-brain__search_thoughts
  - mcp__open-brain__link_thoughts
  - mcp__open-brain__update_thought
  - mcp__open-brain__get_thought_detail
  - Bash
metadata:
  user-invocable: "true"
  version: "1.1.0"
  argument-hint: "[optional: project name or topic focus]"
---
# Deep Save — Long Conversation Extraction with Signal/Noise Triage

Reads the entire current conversation, extracts everything worth keeping, classifies each item on the permanence spectrum, and saves to a knowledge MCP (e.g., Open Brain or equivalent) via MCP with appropriate `permanent` and `stale_after` flags. Designed for long Desktop/Cowork/web sessions that accumulated significant knowledge.

Read [`references/permanence-tiers.md`](references/permanence-tiers.md) for the full classification system, [`references/content-templates.md`](references/content-templates.md) for structured content formatting, [`references/continuation-brief-template.md`](references/continuation-brief-template.md) for the Step 6 brief structure and write locations, and the universal operating references when the saved thread may be resumed by Claude, ChatGPT, Gemini, Codex, Cowork, or another non-Hermes model:

- [`references/universal-agent-operating-standard.md`](references/universal-agent-operating-standard.md)
- [`references/universal-execution-context-standard.md`](references/universal-execution-context-standard.md)
- [`references/universal-deep-save-prompt.md`](references/universal-deep-save-prompt.md)

**Two outputs, not one.** This skill (1) saves atomized, permanence-tiered thoughts that preserve *knowledge*, and (2) writes a single CONTINUATION-BRIEF that preserves *where we are* so a fresh context window can resume cheaply. Always produce both. The brief is what makes `start-session --fresh` work.

## When to Use

- Long Claude Desktop or Claude.ai session (30+ exchanges) with accumulated decisions and context
- Session spanning multiple topics where end-of-session sync would miss earlier material
- Recovery scenario — conversation is about to hit context limits and knowledge needs to be preserved
- User says "deep save", "save this conversation to brain", or "extract everything important"

## What This Does Differently from /open-brain-sync

`/open-brain-sync` captures the session's top decisions and tasks quickly. `/deep-save` reads the **entire** conversation, triages every piece of knowledge on the permanence spectrum, and writes with explicit decay metadata. Use sync for quick end-of-session saves. Use deep-save when the conversation itself is the artifact.


## Universal LLM mode

When a deep save may be used by any model, do not depend on Hermes-only files such as `SOUL.md` or `AGENTS.md`, Claude-only slash commands, Codex-only instructions, or platform-specific memory. Translate the intent into the universal references bundled with this skill.

Use the universal references to preserve the standing behavior the user wants across LLMs:

- Save information that changes decisions, execution, recommendations, or future behavior.
- Save corrections and durable anti-drift rules, not the noisy exchange that produced them.
- Skip glazing, sycophancy, apologies, false starts, and superseded assistant mistakes unless they produced a durable rule or decision.
- Mark wrong prior assistant advice as superseded rather than saving it as truth.
- Preserve current source of truth, owner, next action, and verification state.

If a thread contains Hermes, Claude, Codex, ChatGPT, or other assistant errors, save the corrected rule, current decision, or known pitfall. Do not save the flawed assistant response as operational context.

## Required Capabilities

- **Knowledge MCP (e.g., Open Brain or equivalent)** — `save_thought`, `save_thoughts_batch`, `create_task`, `create_tasks_batch`, `search_thoughts`, `link_thoughts`, `update_thought`
- **Works on**: Claude Desktop, Claude.ai web, Claude Code, Cowork, Cursor, Antigravity — any surface with a compatible knowledge MCP configured


## Proof restart cockpit and weekly short link

If Proof is available, use it as the human-facing restart cockpit, not as the only source of truth. The durable sources remain the local continuation brief and knowledge MCP thoughts/tasks.

When Proof short-link tooling is available, create or update a weekly dynamic short link for the restart cockpit. The slug format is:

```text
deep-save-wo_MMDDYY
```

`wo` means week ending. `MMDDYY` is the Sunday of the current week, calculated at runtime. If the configured short-link domain is `proof.co`, display it as `proof.co/deep-save-wo_MMDDYY`. If the configured domain is different, use that configured domain and keep the same slug. Refresh this weekly link every Monday so it points to the current week's restart board or deep-save cockpit.

Never persist raw tokenized Proof URLs, share tokens, bearer tokens, API keys, OAuth tokens, private credentials, or secret URLs in Proof, knowledge MCP, local reports, logs, screenshots, or restart-board body text.

## Step 1 — Full Conversation Scan (silent)

Read the entire conversation from first message to present. For each exchange, extract and classify into permanence tiers. See [`references/permanence-tiers.md`](references/permanence-tiers.md) for the full classification rules.

**Quick reference:**
- **Tier 1 PERMANENT** — Decisions, standing rules, lessons learned, person notes, architecture decisions
- **Tier 2 LONG-LIVED** (120-180d) — Observations, ideas, reference URLs/paths, guides
- **Tier 3 SHORT-LIVED** (30-90d) — Session context, chat recaps, project snapshots, tool pricing
- **SKIP** — Dead ends, setup steps, small talk, committed code, superseded work, glazing, sycophancy, apology loops, false starts, assistant mistakes that were corrected without producing a durable rule, and anything scoring below 30 on signal score

## Step 2 — Dedup Check (silent)

Before saving, batch-check for duplicates:

```
search_thoughts(query="[core topic of each item]", limit=3, detail_level="compact")
```

For each candidate:
- **Exact duplicate** (>85% similarity to existing thought) → SKIP, note in report
- **Update candidate** (60-85% similarity, same topic, existing is older) → use `update_thought` on the existing thought instead of creating new
- **New** (<60% similarity or no match) → proceed to save

## Step 3 — Batch Write

Group items by permanence tier and write using `save_thoughts_batch` (max 20 per call). See [`references/content-templates.md`](references/content-templates.md) for the required content structure per type.

```
save_thoughts_batch({
  thoughts: [
    {
      content: "[PROJECT-NAME] [clear title]\n\n[structured content]",
      type: "decision",
      source: "claude-desktop",
      confidence: 0.9,
      permanent: true,
      stale_after: "2026-10-07",
      provenance_url: "deep-save session [date]"
    }
  ]
})
```

**Tasks** go via `create_tasks_batch`:
```
create_tasks_batch({
  tasks: [{ content: "[PROJECT] Specific next action", priority: "high", due_date: "2026-06-15" }]
})
```

## Step 4 — Link Related Thoughts

After saving, scan for obvious connections between new thoughts:

```
link_thoughts(source_id, target_id, link_type, confidence)
```

Link types: `supports`, `extends`, `supersedes`, `contradicts`, `follows_from`, `related_to`

Also link to existing thoughts found during dedup check if the relationship is meaningful.

## Step 5 — Report

Present a triage report:

```
DEEP SAVE COMPLETE — [project/topic]
────────────────────────────────────
Permanent (never decay):
  - [N] decisions
  - [N] learnings/standing rules
  - [N] person notes

Time-bounded:
  - [N] observations (stale after [date])
  - [N] references (stale after [date])
  - [N] session context (stale after [date])

Tasks created: [N]
Duplicates skipped: [N]
Existing thoughts updated: [N]
Links created: [N]

Continuation brief:
  Local:      [absolute path or "skipped (no bash)"]
  Open Brain: [thought id] (chat_recap, stale: YYYY-MM-DD)
  Resume with: start-session --fresh   (NOT claude --continue)

Thought IDs (for reference):
  [id] — [title] (permanent)
  [id] — [title] (stale: YYYY-MM-DD)
  ...
────────────────────────────────────
```

## Step 6 — Write the Continuation Brief (ALWAYS)

This is the token-saving payoff. After the thoughts are saved, write ONE compact brief so a fresh
context window — after `/clear`, on another machine, or on Cowork/Desktop — can resume this exact
thread without reloading the bloated transcript. Full structure and rules:
[`references/continuation-brief-template.md`](references/continuation-brief-template.md).

Write it to **both** stores:

1. **Local file** (fast, deterministic for `start-session --fresh`):
   ```bash
   PROJECT="{project-name}"
   ROOT="{project-root}"                       # cwd's project root if it has one
   if [ -n "$ROOT" ] && [ "$ROOT" != "$HOME" ]; then
     DIR="$ROOT/chat-recap-project-handoff"; else DIR="$HOME/.claude/continuation"; fi
   mkdir -p "$DIR"
   # write the brief to "$DIR/CONTINUATION-BRIEF.md"  (home fallback: CONTINUATION-BRIEF_${PROJECT}.md)
   ```
   Stable, dateless filename — overwrite each run (one current brief per project, like
   `lessons-learned.md`). On Desktop/web with no bash, skip this and rely on the knowledge MCP copy.

2. **Knowledge MCP (cross-surface durability)** — save the brief verbatim via `save_thought` so
   `start-session --fresh` finds it from any surface. The **first line MUST be the literal marker**
   `[PROJECT] CONTINUATION-BRIEF — {project} — {date}` (this string, not the `type`, is how `--fresh`
   locates it — the save tools only *hint* type and the server may reclassify, so do not rely on
   `type=chat_recap`). Supersede the prior brief: `search_thoughts(query="CONTINUATION-BRIEF {project}",
   limit=3)`; if a result's first line carries the marker for the same project, `update_thought` it,
   else `save_thought`. Flags: `type="reference"` (hint only), `permanent=false`,
   `stale_after` = +30 days, `source` = this surface, `provenance_url` = "continuation-brief {date}".

Keep the brief 1–3k tokens. The single most important line is **▶ Immediate Next Step** — make it an
exact, executable action. Mask secrets. Report the brief's local path + knowledge MCP id in Step 5.

## Edge Cases

**Very long conversation (100+ exchanges):** Process in chunks of 30 exchanges. Deduplicate across chunks — later exchanges often supersede earlier ones on the same topic.

**Multiple projects discussed:** Group saves by project prefix. Each project's items get their own batch.

**Conversation includes sensitive content:** Apply secret masking — never save API keys, tokens, passwords, or JWTs to the knowledge MCP. Patterns to redact: `sk-ant-*`, `sk-*`, `ghp_*`, `xoxb-*`, `eyJ*` (JWTs), `AKIA*` (AWS).

**No bash available (Claude Desktop, Claude.ai web):** Skip the local file write. MCP direct saves are the primary path and work on all surfaces.

**User wants selective save:** If invoked with an argument like "just the Open Brain decisions", filter extraction to that topic only.

## Confidence Scoring Guide

| Confidence | When to use |
|-----------|-------------|
| 1.0 | Verified by running code, reading docs, or user confirmation |
| 0.9 | Direct observation during this session |
| 0.8 | Strong inference from multiple data points |
| 0.6 | Reasonable inference, not directly verified |
| 0.4 | Speculation or hypothesis discussed but not tested |

---
*Deep Save v1.1 — June 2026*
*v1.1: adds Step 6 — durable cross-surface CONTINUATION-BRIEF (local file + knowledge MCP chat_recap) for token-cheap fresh-context resume via `start-session --fresh`.*
*Requires: knowledge MCP (e.g., Open Brain or equivalent) with save_thought permanent + stale_after params. See changelog.*
*Works on: All Claude surfaces with a compatible knowledge MCP connected*
*Companion: start-session --fresh (reads the brief into a clean window)*

# Universal Start Session Prompt

Use this prompt when starting or resuming a project in any LLM chat that does not natively load the `start-session` skill.

This prompt is LLM agnostic. It can be pasted into ChatGPT, Claude, Gemini, Codex, Cowork, or another agent. Use available tools if the runtime has them. If the runtime has no tools, ask the user for the needed continuation brief, restart-board excerpt, or Open Brain anchors.

## Objective

Resume from the smallest reliable source of truth instead of reloading a noisy transcript.

Prefer a deep-save continuation brief when one exists. The brief is designed to preserve verified state, corrected decisions, durable rules, open loops, owners, and the next action without bringing forward assistant mistakes, glazing, sycophancy, false starts, or superseded recommendations.

## Source hierarchy

Use this order:

1. Current user instruction.
2. Local continuation brief, if provided or accessible.
3. Open Brain thoughts and tasks, if accessible (Open Brain is an optional dependency — skip if no knowledge MCP is connected).
4. External reference system entry (e.g., shared doc, wiki, or dashboard), if accessible.
5. Project-local instructions, if provided.
6. Recent local recaps or handoffs, if accessible.
7. Chat transcript or model memory only as fallback.

If sources conflict, trust the more current and more local source. State the conflict and the source chosen.

## Resume routing

### Path A: continuation brief exists

Use Path A by default when a continuation brief exists.

Do this:

1. Read only the continuation brief first.
2. Fetch only the Open Brain IDs listed in the brief if the runtime has Open Brain tools and the next step needs them.
3. Treat the brief's corrected decisions, durable rules, verified state, owner, and next action as authoritative.
4. Treat assistant mistakes, glazing, sycophancy, apologies, false starts, and superseded recommendations as historical noise unless the brief explicitly preserved a durable lesson from them.
5. Do not reload the whole transcript unless the user explicitly asks for the full thread.

Then present:

```markdown
## Active Goal
[goal from the brief]

## Immediate Next Step
[one concrete next action]

## Open Loops
[only real open loops, or none]

## Source of Truth
- Continuation brief: [path or provided excerpt]
- Open Brain thoughts: [ids, or "not available"]
- Open Brain tasks: [ids or none, or "not available"]
- External reference: [safe short link or slug, if provided]

## Final Exchange
[short summary of where the prior session stopped]
```

End by asking:

`Pick up from the Immediate Next Step, or has the situation changed?`

### Path B: no continuation brief exists

Use Path B only when no brief is available or the user asks to load the full context.

Do this:

1. Search durable memory or project notes for the project name.
2. Find the latest session summary, chat recap, project handoff, or restart-board entry.
3. Check pending and recently completed tasks if a task system is available.
4. Reconcile conflicts by source hierarchy.
5. Present a concise resume summary and recommend one next action.

Do not treat a long transcript as truth when a later recap or correction supersedes it.

## Anti-drift guardrails

- Do not preserve or repeat superseded assistant mistakes.
- Do not convert polite agreement into a decision.
- Do not blame the user for missing actions that the system failed to surface.
- If the objective is immediate revenue, prioritize live buyers, invoices, replies, follow-ups, and named opportunities before infrastructure or product work.
- If the next action is safe, reversible, and in scope, recommend it clearly.
- If the next action requires credentials, public posting, external sending, production changes, legal judgment, or privacy-sensitive access, ask before acting.

## External reference and short-link handling

If an external reference system entry (e.g., a shared doc, wiki, or dashboard) is provided, use it as a human-facing index only. Do not treat it as the only source of truth.

If a weekly short link is provided, use it as a safe pointer. Do not request, expose, or store tokenized URLs, share tokens, bearer tokens, API keys, OAuth tokens, private credentials, or secret URLs.

## Final response format

```markdown
## Status
Ready to resume / Blocked / Needs input.

## Result
Plain-English summary of where the work stands.

## Source of truth used
- [brief, Open Brain, external reference, or user-provided context]

## Immediate next step
[one concrete action]

## Owner
[assistant / user / another agent / no further action]

## Recommendation
[recommended move and why]
```

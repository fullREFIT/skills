# Content Templates for Deep Save

Structured templates for each thought type. Use these formats when writing to the knowledge MCP to ensure consistency and future-readability.

---

## Decisions

```markdown
[PROJECT] Decision title

Context: [why this decision came up — what problem or choice triggered it]
Decision: [what was chosen — the specific thing being done]
Rejected: [alternatives that were considered and ruled out]
Reasoning: [why this choice over alternatives — the deciding factor]
Revisit if: [conditions that would warrant changing this decision]
```

**Example:**
```markdown
[OPEN-BRAIN] Use quality_score column for signal scoring instead of adding new column

Context: Need to filter noise (skeleton session notes) from search results. The thoughts table already has a quality_score column defaulted to 50.00 for all rows.
Decision: Repurpose quality_score as computed signal score (5-100) with auto-trigger
Rejected: Adding a separate signal_score column (unnecessary duplication), LLM-based scoring (too expensive at ingest time)
Reasoning: Column exists, is unused, has the right type. Trigger-based computation means zero cost per search query.
Revisit if: Scoring needs to incorporate semantic analysis that can't be done in SQL
```

---

## Learnings

```markdown
[PROJECT] What we learned — concise title

What happened: [the situation or problem encountered]
The insight: [the non-obvious part — what wasn't expected]
How to apply: [when this pattern recurs and what to do differently]
```

**Example:**
```markdown
[OPEN-BRAIN] Supabase CLI deploys to wrong project when env var is set

What happened: Running `supabase functions deploy` silently deployed to the wrong project because SUPABASE_PROJECT_ID env var overrides the linked project.
The insight: The CLI honors environment variables over the local project link with no warning. A correct local config doesn't guarantee correct deployment.
How to apply: Always pass --project-ref explicitly, or use the deploy script that strips stray env vars. Never trust a bare `supabase functions deploy`.
```

---

## Person Notes

```markdown
[Contact Name] — [role/context in one line]

Role: [title, company, what they do]
Relationship: [how you know them, context of interaction]
Preferences: [communication style, decision-making approach, constraints]
Key facts: [anything useful for future interactions]
Last interaction: [date and topic, if known]
Follow-up: [pending actions, if any]
```

**Example:**
```markdown
[Contact Name] — [role description]

Role: [title/company/what they do]
Relationship: [how you connected, context]
Preferences: [communication style, key constraints]
Key facts: [durable facts useful for future interactions]
Last interaction: [date and topic, if known]
Follow-up: [pending actions, if any]
```

---

## References

```markdown
[TOPIC] Reference — [what it is in 3-5 words]

Path/URL: [exact path, URL, ID, or config value]
Purpose: [what it's for and when you'd need it]
Notes: [any gotchas, version requirements, or access notes]
```

**Example:**
```markdown
[OPEN-BRAIN] Deploy script for edge functions

Path/URL: {PROJECT_ROOT}/scripts/deploy-edge-function.sh
Purpose: Deploys Supabase Edge Functions to the correct project, bypassing stray env var overrides
Notes: Pass function name as argument (defaults to open-brain-mcp). Verifies live version after deploy. Requires supabase CLI installed.
```

---

## Observations

```markdown
[PROJECT] Observation title

[What was observed — factual, specific]
[Context or measurement if applicable]
[Why this matters or when it would be relevant]
```

**Example:**
```markdown
[OPEN-BRAIN] Signal score distribution after backfill

4,262 thoughts scored. Distribution:
- Score 5-10: 183 skeleton session notes (noise floor)
- Score 20-25: 563 low-signal session notes
- Score 60-100: 2,902 guides, references, observations, decisions (signal)

Default min_signal=30 filter removes 746 thoughts (17.5%) from every search. The cut is clean — no high-value thoughts fall below 30.
```

---

## Session Context (Short-lived)

```markdown
[PROJECT] Session state — [date]

Working on: [what was in progress]
Current position: [exact file, function, or step]
Blockers: [what's preventing progress, if any]
Next action: [the specific thing to do next]
```

---

## MCP Tool Parameters Reference

When calling `save_thought` or `save_thoughts_batch`, these are the available parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | The thought content (use templates above) |
| `type` | string | No | `observation`, `idea`, `reference`, `person_note`, `decision`, `learning` |
| `source` | string | No | `claude-desktop`, `claude-code`, `claude-web`, `cowork`, `cursor` |
| `confidence` | number | No | 0.0-1.0 quality signal |
| `permanent` | boolean | No | `true` for Tier 1 items that never decay |
| `stale_after` | string | No | ISO date `YYYY-MM-DD` for Tier 2/3 decay |
| `provenance_url` | string | No | Source reference for traceability |
| `session_id` | string | No | Session identifier for grouping |

**Batch limit:** 20 items per `save_thoughts_batch` call. Split into multiple calls if needed.

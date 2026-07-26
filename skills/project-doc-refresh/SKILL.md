---
name: project-doc-refresh
description: >-
  Audit, research, and refresh Claude Project custom instructions and project documents so they reflect current Claude platform capabilities (Skills 2.0, MCP, subagents, caching, model routing) and current domain facts. Use when the user wants to update a CLAUDE.md, custom instructions, project documents, system prompts, or any long-lived context document that may have gone stale. Three-phase workflow — audit first, research only flagged items, produce a tracked-changes diff the user approves before finalizing. Never rewrites voice, behavioral rules, or institutional knowledge. MANDATORY TRIGGERS: refresh custom instructions, update project documents, audit CLAUDE.md, update system prompt, refresh project context, is my prompt stale, update my Claude project, modernize instructions, refresh skill docs, project doc audit, instructions audit, context refresh.
---

# Project Doc Refresh

You are operating as the Project Doc Refresh skill. Your job is to keep long-lived Claude context documents — custom instructions, CLAUDE.md files, project documents, system prompts — accurate and non-degrading as the Claude platform and the user's domain evolve.

The core principle: **audit before researching, research before rewriting, diff before finalizing.** Most "refresh my prompt" tools skip the audit and produce polished hallucinations. This skill refuses to.

---

## Invocation modes

Determine which mode applies from the user's request. If ambiguous, ask once — don't assume.

### Single-document mode

One document. Run the full three-phase workflow against it. Deliver one audit report, one research findings doc, one updated document with changelog.

### Project-wide mode (most common when invoked inside a Claude Project)

The user is inside a Claude Project that contains custom instructions PLUS one or more attached project documents. Process them as a set, not independently.

**Step 1 — Enumerate.** Before starting Phase 1, list every document in scope:
- The custom instruction (always scope position #1).
- Every attached project document, in the order they appear.
Present this list to the user and ask: "Is this the full set you want refreshed, or a subset?" Do not proceed until the scope is confirmed.

**Step 2 — Custom instructions first.** Run Phase 1 (audit) on the custom instruction document before touching any project document. Reason: the custom instruction defines the voice, behavioral rules, and institutional vocabulary that the project documents should be consistent with. Auditing it first means you know what "correct" looks like for the rest.

**Step 3 — Batched audit.** After the custom instruction audit, audit each project document in sequence. Produce a **combined audit report** that includes:
- A per-document classification table (one section per document).
- A **cross-document consistency check** that flags:
  - Contradictions between the custom instruction and a project document.
  - Contradictions between two project documents.
  - Institutional knowledge defined in one document but used inconsistently in another.
  - Stale references that appear in multiple documents (research once, update everywhere).
- A consolidated research plan that de-duplicates — if three documents reference the same stale model name, that's one research item, not three.

**Step 4 — Checkpoint with the user.** Present the combined audit report. User confirms scope, research plan, and whether structural changes are permitted per document. **Stop until confirmed.**

**Step 5 — Consolidated research (Phase 2).** Execute the de-duplicated research plan. One research notes document covers findings across all documents.

**Step 6 — Checkpoint with the user.** Present findings. Confirm updates before rewriting.

**Step 7 — Sequential rewrite (Phase 3).** Rewrite the custom instruction first, then each project document. Deliver:
- Each updated document as its own artifact (ready to replace the original).
- A combined changelog with per-document sections.
- A cross-document consistency section showing how the updates maintain consistency across the set.

### Portfolio mode (multiple Claude Projects in sequence)

User wants to refresh several Claude Projects, not just one. This is typically a manual sequence — user invokes the skill once per project, passes the relevant docs each time — but the skill should treat them as a set at the end.

**Within each project:** run project-wide mode exactly as above.

**Across projects:** at the end of the session (or when the user says they're done), produce a **portfolio summary** that identifies:
- Patterns across projects (e.g., "all 6 projects reference Skills v1 syntax").
- Shared institutional knowledge that could be extracted into a reusable skill or common project document.
- Systemic staleness (e.g., "every project has outdated pricing references — recommend building a pricing skill that all projects can reference instead of inlining").

The portfolio summary is the highest-leverage output for users with many projects. Don't skip it.

### Mode detection

When the skill is invoked, infer the mode:

- If the user pastes a single document or references one file → single-document mode.
- If the user is inside a Claude Project with multiple attachments, or says "refresh this project" without specifying a document → project-wide mode.
- If the user mentions multiple projects ("refresh all my projects," "I have five projects to update") → portfolio mode.

When in doubt, ask. One clarifying question at the start is cheaper than doing the wrong mode.

## Surface detection

- If running in Claude Code: you can read/write files directly. Use the filesystem.
- If running in Claude.ai: the user pastes documents or attaches them to the project. Operate on the text in-conversation and produce a finalized artifact at the end.
- The methodology is identical across surfaces. Only file handling differs.

---

## The three-phase workflow

### Phase 1 — Audit (no research yet)

Load `references/platform-changes-log.md` and `references/staleness-taxonomy.md` into working memory.

Parse the input document and classify every substantive claim or instruction into one of six categories:

| Category | Examples | Refresh policy |
|---|---|---|
| **Platform fact** | Model names, pricing, Skills syntax, MCP references, subagent capabilities, tool availability | Research against Anthropic docs. Update if changed. |
| **Domain fact** | Industry statistics, competitor information, regulatory references, pricing comparisons, third-party tool versions | Web search with date filter. Update if changed. |
| **Behavioral rule** | "Lead with a recommendation," "No emojis unless the user uses them first," "Challenge the approach before polishing" | Do not research. Do not rewrite. Preserve verbatim. |
| **Institutional knowledge** | Project-specific vocabulary, acronyms, team names, internal processes, tool stacks the user has stated | Do not research. Flag if internally contradictory. Preserve. |
| **Stylistic choice** | Voice, pacing, formatting conventions, anti-patterns specific to the user | Do not research. Preserve verbatim. |
| **Example or illustration** | Sample outputs, bad/good pairs, concrete scenarios | Evaluate only if the example relies on a platform or domain fact that changed. |

Produce an **Audit Report** using `templates/audit-report.md` with:
- A classification table (one row per substantive claim).
- Staleness flags (`STALE`, `LIKELY_STALE`, `FRESH`, `EVERGREEN`) with reasoning.
- A research plan listing only the items marked `STALE` or `LIKELY_STALE`.
- Explicit callouts of behavioral rules, institutional knowledge, and stylistic choices that will be **preserved without modification**.

Show the Audit Report to the user. Do not proceed to Phase 2 until the user confirms or edits the research plan. This checkpoint is non-negotiable — it prevents the skill from wasting tokens researching things that didn't need researching, and it gives the user a chance to add context the skill missed.

### Phase 2 — Targeted research

Research only items the user approved in Phase 1. Follow `runbooks/research-playbook.md` for methodology.

**Platform facts:**
- Primary source: `docs.claude.com`, `anthropic.com/news`, `support.claude.com`.
- Secondary source: Anthropic engineering blog posts.
- Never trust aggregator sites or older tutorials for platform facts — the velocity of change makes them unreliable.
- If the doc site contradicts what you find via general web search, the doc site wins.

**Domain facts:**
- Web search with explicit date constraints (current year or last 6 months).
- Prefer primary sources (company announcements, regulatory bodies, original research) over aggregators.
- For fast-moving areas (AI tooling, startup ecosystem, model provider announcements), assume anything older than 90 days is suspect.

**Research output:** for each researched item, produce a small research note:
```
ITEM: [original text from document]
FINDING: [current state, with sources]
CONFIDENCE: HIGH | MEDIUM | LOW
RECOMMENDED UPDATE: [proposed new text, or "no change needed"]
```

Do not write the final document yet. Assemble these notes and show them to the user.

### Phase 3 — Diff-based rewrite

Using the approved research notes, produce the updated document following `templates/diff-output.md` structure:

1. **The full updated document** (ready to paste/save).
2. **A changelog** listing every change with:
   - Before/after snippet.
   - Classification (platform fact / domain fact / structural).
   - Confidence level.
   - Source (where applicable).
3. **Preserved-as-is list** — what was deliberately untouched, so the user can verify nothing was silently rewritten.
4. **Residual risks** — anything the skill couldn't verify, or areas where the user should spot-check manually.

Structural improvements (moving content for cache-friendliness, consolidating redundant rules, splitting a bloated CLAUDE.md into a skill + lean CLAUDE.md) are allowed ONLY if the user requested them or if `references/structural-heuristics.md` flags a clear violation. When in doubt, flag it as a recommendation, don't execute it.

---

## Hard constraints

- **Never invent platform features.** If you're not sure whether something is real, mark the claim `UNVERIFIED` and recommend the user check current docs. Fabricating a Claude feature is a disqualifying failure for this skill.
- **Never rewrite behavioral rules, voice, or institutional knowledge.** Even if you think you can phrase it better. The user has tuned these. Preserving them is the job.
- **Never skip Phase 1.** Even if the user says "just update it." The audit is cheap; blind rewriting is how drift enters the system.
- **Never produce a final document without a changelog.** The diff is as important as the artifact.
- **Never use bullet points in the user-facing summary between phases.** Conversational prose only, per the user's preferences. Bullets belong in the artifact.

## Cache-aware structure for your output

When producing an updated custom instruction or CLAUDE.md, order content for prefix cache efficiency:

1. Identity and role (most static)
2. Behavioral rules and anti-patterns (static)
3. Domain knowledge and vocabulary (semi-static)
4. Task templates and examples (semi-static)
5. References to external docs or skills (pointers, not content)

Dynamic content (timestamps, session IDs, "today's priorities") must NEVER appear in a persistent instruction. If the user has such content inlined, flag it.

## Progress and stop conditions

- After Phase 1: **stop for user approval** of the research plan.
- After Phase 2: **stop for user review** of research findings before rewriting.
- After Phase 3: deliver the final artifact and a specific next action ("run your 3 canonical prompts against this updated version and compare outputs to the previous version; flag any regression").

If at any point the audit reveals the document has more than ~40% stale content, recommend a ground-up rebuild rather than a refresh. A refresh preserves the structure; when the structure itself is obsolete (e.g., pre-Skills-2.0 architecture), you're polishing a broken foundation.

---

## Files in this skill

- `references/platform-changes-log.md` — current Claude platform facts as of the skill's last update. Load in Phase 1.
- `references/staleness-taxonomy.md` — how to classify and flag content. Load in Phase 1.
- `references/structural-heuristics.md` — when to recommend structural changes vs. leave alone.
- `templates/audit-report.md` — the Phase 1 output format.
- `templates/diff-output.md` — the Phase 3 output format.
- `templates/research-notes.md` — the Phase 2 intermediate format.
- `runbooks/research-playbook.md` — sourcing rules, query patterns, trust hierarchy.
- `runbooks/refresh-workflow.md` — end-to-end narrative walkthrough of a full refresh.
- `runbooks/execution-prompts.md` — ready-to-use prompts for invoking the skill in each mode. Share with users who want explicit control over scope.
- `scripts/extract-claims.md` — prompt-as-script for extracting classifiable claims from a document.

Load files only when the phase calls for them. Don't front-load everything.

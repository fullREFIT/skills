# Execution Prompts

Ready-to-use prompts for invoking the project-doc-refresh skill. Copy the one that matches your situation, customize the bracketed sections, paste into Claude.

Three variants:
1. **Single-document** — refreshing one custom instruction or document.
2. **Project-wide** — refreshing a whole Claude Project (custom instructions + attached documents).
3. **Portfolio** — working across multiple Claude Projects.

You do not *need* these prompts — the skill will activate from its trigger phrases alone. But using them gives you explicit control over scope, mode, and preferences, and it's cheaper than letting Claude guess and correcting later.

---

## 1. Single-document execution prompt

Use when: you want to refresh one specific document (a custom instruction, a CLAUDE.md, a single project doc).

```
Invoke the project-doc-refresh skill in single-document mode against the document below.

My preferences for this refresh:
- Scope: [facts only | facts + structural recommendations | full rebuild allowed]
- Voice preservation: [strict — preserve verbatim | moderate — small edits for clarity OK]
- Depth: [minimal — only what's clearly stale | thorough — verify everything flagged as
  LIKELY_STALE too]

Recent context you should know (things that have changed that Claude wouldn't find in docs):
- [list anything relevant about your stack, domain, or project that affects the refresh]
- [or write "none" if there's nothing]

Follow the three-phase workflow exactly. Stop at the checkpoint after Phase 1 (audit) and
wait for my approval before researching. Stop again after Phase 2 (research findings) before
rewriting.

Document to refresh:
---
[PASTE THE FULL DOCUMENT HERE]
---
```

**When to customize:**
- Change `facts only` to `facts + structural recommendations` if the document has grown unwieldy and you want restructuring suggestions.
- Set voice preservation to `strict` for documents you've heavily tuned; `moderate` for quick drafts.
- Use `minimal` depth for quarterly light refreshes; `thorough` for annual deep refreshes.

---

## 2. Project-wide execution prompt

Use when: you're inside a Claude Project that contains custom instructions AND one or more attached project documents, and you want to refresh them as a coherent set.

```
Invoke the project-doc-refresh skill in project-wide mode.

This Claude Project contains custom instructions and [N] attached project documents. I want
you to process them as a set — audit all of them, check for cross-document consistency,
consolidate the research plan, and rewrite them in order.

My preferences for this refresh:
- Scope: [facts only | facts + structural recommendations | full rebuild allowed]
- Voice preservation: [strict | moderate]
- Documents in scope: [all documents attached to this project | only: X, Y, Z]
- Cross-document consistency: [enforce — flag and fix contradictions between documents |
  observe only — flag contradictions but don't fix them unless I approve each one]

Recent context you should know:
- [list anything relevant — changes in your stack, domain, tooling, or project that affect
  the refresh]
- [or write "none"]

Execute the project-wide workflow:
1. Enumerate all documents in scope and confirm the list with me before starting.
2. Run Phase 1 (audit) on the custom instruction first, then on each project document.
   Produce a combined audit report with per-document classification tables AND a
   cross-document consistency check.
3. Stop after Phase 1 and wait for my approval of the consolidated research plan.
4. Run Phase 2 (consolidated research) — de-duplicate research across documents so each
   stale fact is researched once, not N times.
5. Stop after Phase 2 and wait for my approval of findings.
6. Run Phase 3 — rewrite the custom instruction first, then each project document.
   Deliver each as its own artifact plus a combined changelog.

Start by enumerating the documents you can see in this project.
```

**When to customize:**
- List specific documents in "Documents in scope" if you only want a subset refreshed (e.g., you just updated one doc manually and don't want it touched).
- Use `enforce` for cross-document consistency if you value coherence across docs; `observe only` if your docs are intentionally different (different audiences, different purposes).

**Important:** this prompt assumes Claude can see the project documents. In Claude.ai, project documents attached to the project should be visible. If Claude says it can't access them, you may need to paste them in explicitly or re-attach.

---

## 3. Portfolio execution prompt (for refreshing multiple projects)

Use when: you have several Claude Projects to refresh and want systemic insights at the end, not just per-project updates.

**Important:** portfolio mode is typically executed as a *series* of project-wide sessions, one per project, because Claude can only see one project's documents at a time. This prompt sets up the series and produces the portfolio summary at the end.

### Step A — Start of series (run once)

```
I'm starting a portfolio refresh across [N] Claude Projects. I'll run the
project-doc-refresh skill against each project in a separate session. At the end, I want
you to produce a portfolio summary identifying systemic patterns.

For this portfolio session, before I start the individual refreshes, help me plan:

1. Which projects I should refresh first (lowest-stakes to highest-stakes — I want to
   validate the skill on disposable projects before running it on critical ones).
2. What cross-project patterns to watch for as I run each refresh (e.g., shared
   institutional knowledge, common stale references, inconsistent voice).
3. A lightweight note-taking template for me to fill in after each individual project
   refresh, so I can feed the notes back to you at the end for the portfolio summary.

Here's a brief description of each project I'm planning to refresh:

1. [Project name]: [1-sentence description, purpose, rough age]
2. [Project name]: [1-sentence description, purpose, rough age]
3. [...continue...]
```

### Step B — Within each individual project

Use the **Project-wide execution prompt** (#2 above) inside each Claude Project. Save the output changelog from each one.

### Step C — End of series (run once, after all individual refreshes are done)

```
I've completed the individual refreshes across my portfolio. Here are my notes from each
project, using the template you provided at the start:

Project 1: [name]
- Key changes made: [from changelog]
- Patterns noticed: [what stood out]
- Remaining issues: [what I couldn't resolve]

Project 2: [name]
- [same structure]

[...]

Now produce the portfolio summary per the project-doc-refresh skill. I want:

1. Patterns across projects — stale references, inconsistent voice, shared institutional
   knowledge, common structural issues.
2. Recommendations for consolidation — things that appear in multiple projects that could
   be extracted into a shared skill or common project document I reference from each.
3. A prioritized list of next actions — what I should tackle next based on what I observed
   across the portfolio.
4. Suggested refresh cadence per project based on how stale each one was.
```

**When to customize:**
- If all your projects are related (e.g., same company, same stack), ask specifically for extraction opportunities: "what could become a shared skill across these?"
- If your projects are unrelated, focus the portfolio summary on per-project cadence rather than consolidation.

---

## Quick-reference: which prompt when

| Situation | Prompt |
|---|---|
| One document, pasted or attached | Single-document |
| Inside a Claude Project, want to refresh the whole project | Project-wide |
| Multiple projects to refresh | Portfolio (Step A → Project-wide per project → Step C) |
| Just updated one project doc, want to check the others for consistency | Project-wide with `Documents in scope: only [the others]` |
| Quick sanity-check refresh on a light document | Single-document with `depth: minimal` |
| First refresh after a year of drift | Single-document or Project-wide with `scope: facts + structural recommendations` |

## Customization notes

### Scope options

- **facts only** — only flag and update platform/domain facts. No structural changes, no consolidation recommendations. Use for frequent refreshes where you don't want the structure touched.
- **facts + structural recommendations** — update facts AND flag structural issues (cache-hostile ordering, instruction overload, inlined reference material), but don't execute structural changes without approval. Default for most cases.
- **full rebuild allowed** — if >40% of the document is stale, the skill can recommend (and execute, with approval) a ground-up rebuild. Use for annual deep refreshes or when a doc has clearly become obsolete.

### Voice preservation options

- **strict** — preserve all behavioral rules, anti-patterns, stylistic choices, and institutional knowledge verbatim. No paraphrasing even for "clarity."
- **moderate** — preserve intent verbatim but allow minor grammatical edits (fixing typos, resolving ambiguous pronouns, etc.). Never changes voice or tone.

Default to strict for documents you've tuned over time; moderate only for drafts or documents you explicitly want cleaned up.

### Recent context

Always fill in the "recent context" section if you can. The skill doesn't know things like:
- Your stack changed last month.
- Your company pivoted.
- A tool you reference got deprecated or acquired.
- A person named in the doc left the team.
- A new regulation affects your domain.

Even a sentence or two here saves significant research time and prevents the skill from "correcting" things that were never wrong.

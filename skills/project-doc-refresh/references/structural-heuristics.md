# Structural Heuristics

When to recommend structural changes to a document vs. leave the structure alone. Load during Phase 1 if the document appears structurally problematic.

The default is **preserve structure**. Restructure only when a clear violation is present, and even then, recommend — don't execute unless the user approved structural changes upfront.

## Hard structural violations (flag as `STRUCTURAL_ISSUE`)

### Cache-hostile ordering

Dynamic content (timestamps, session data, user-specific dates) appears before static content. This destroys prefix caching and multiplies cost.

**How to spot:** Look for phrases like "today is [date]", "the current date is", "as of this writing", or any reference to time/dates in the first third of the document.

**Fix:** Move dynamic references to the end (or out of the instruction entirely — they probably don't belong in persistent context at all).

### Instruction overload

Document has dozens of rules with no priority ordering. Compliance drops predictably as rule count rises.

**How to spot:** Count the imperative statements ("always", "never", "you must", "do", "don't"). If the count exceeds ~30 and there's no priority structure, flag.

**Fix:** Recommend consolidation, prioritization, or splitting stable rules into a referenced skill.

### Reference material inlined

Long reference content (documentation, full examples, schema definitions) is embedded in the instruction itself when it should live in a skill with progressive disclosure.

**How to spot:** A single section over ~500 words that's referential rather than behavioral. Examples, style guides, taxonomies.

**Fix:** Recommend extracting into a separate skill or project document; leave a pointer in the main instruction.

### Conflicting rules without resolution

Two instructions that contradict each other, with no priority hierarchy stated.

**How to spot:** Cross-reference imperatives. "Be concise" + "always include all relevant context" is a contradiction without resolution.

**Fix:** Flag as `CONTRADICTION` in the audit. Don't resolve on the user's behalf — they tune these.

### Stale architecture

Document was written for a pre-Skills-2.0, pre-MCP, pre-subagent era and assumes architectural constraints that no longer apply.

**How to spot:**
- References to one-shot execution when the work is naturally multi-step.
- Tool-calling patterns that predate MCP.
- "Commands" instead of skills.
- No distinction between planning and execution contexts for long work.

**Fix:** This is where you recommend a ground-up rebuild, not a refresh. Refreshing stale architecture is polishing a broken foundation.

## Soft structural issues (note but don't recommend action)

These are preferences, not violations. Mention in the audit, don't push:

- Heavy formatting when prose would do.
- Light formatting when structure would help.
- XML tags used inconsistently.
- Mix of imperative and descriptive voice.
- Uneven specificity across sections.

## Structural patterns that are fine

- Long documents (length isn't automatically a problem if the content earns its place).
- Rule-heavy documents (again, not inherently bad — just needs priority structure).
- Sections that repeat themes (sometimes repetition is deliberate reinforcement).
- Unusual voice or tone (that's a stylistic choice, not a violation).

## When the user says "just clean it up"

If the user gives blanket approval to restructure, still follow the audit workflow but:

1. Identify structural issues in Phase 1 alongside staleness flags.
2. In Phase 3, present structural changes in a separate section of the changelog from factual changes.
3. For each structural change, explain the cost of NOT making it (cache destruction, instruction overload, etc.) — so the user can veto specific changes even with blanket approval.

## When the user says "only update facts, don't restructure"

Honor this strictly. Flag structural issues in the audit for awareness, but do not modify structure. This is a common and valid user preference — they've tuned the structure deliberately.

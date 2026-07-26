# Audit Report Template

Use this format for Phase 1 output. The goal is a decision document the user approves before any research happens.

---

# Audit Report: [Document Name]

**Document:** [filename or descriptive title]
**Snapshot date:** [today's date]
**Source type:** [Custom Instruction | CLAUDE.md | Project Document | System Prompt | Other]
**Word count (approx):** [count]
**Detected age signals:** [e.g., "references Claude 3.5 Sonnet, mentions commands/ directory, no MCP references — likely written mid-to-late 2024"]

---

## Summary

[2-3 sentences. How stale is this document overall? What's the main thrust of the refresh that's needed? Are there structural issues?]

**Staleness severity:** [Minor | Significant | Recommend rebuild]
**Items requiring research:** [count]
**Items preserved as-is:** [count]
**Contradictions or ambiguities flagged:** [count]

---

## Classification table

| # | Claim / instruction (abbreviated) | Category | Flag | Reasoning |
|---|---|---|---|---|
| 1 | [short excerpt] | Platform fact | STALE | [why] |
| 2 | [short excerpt] | Behavioral rule | EVERGREEN | Preserve |
| 3 | [short excerpt] | Domain fact | LIKELY_STALE | [why] |
| ... | | | | |

Categories: Platform fact | Domain fact | Behavioral rule | Institutional knowledge | Stylistic choice | Example/illustration
Flags: STALE | LIKELY_STALE | FRESH | EVERGREEN | UNVERIFIED | CONTRADICTION

---

## Structural observations

[If `references/structural-heuristics.md` surfaces any hard violations, list them here. If none, say so.]

- **Cache ordering:** [OK | Issue: ...]
- **Instruction count:** [count; priority structure present: yes/no]
- **Reference material inlined:** [yes/no, details]
- **Architectural assumptions:** [current | stale (explain)]
- **Contradictions found:** [list or "none detected"]

---

## Research plan

The following items will be researched in Phase 2. **Platform facts** will be verified against Anthropic's current docs. **Domain facts** will be verified via date-constrained web search.

### Platform facts to verify

1. [item + why it's flagged]
2. [item + why it's flagged]
...

### Domain facts to verify

1. [item + why it's flagged]
2. [item + why it's flagged]
...

### Items flagged as UNVERIFIED

[These couldn't be classified confidently. User should decide whether to keep, remove, or research.]

### Items flagged as CONTRADICTION

[These need user resolution, not research.]

---

## Preserved without modification

The following will NOT be touched during the refresh. Listing them here for your verification — if I'm preserving something you wanted updated, tell me now.

### Behavioral rules
- [list]

### Institutional knowledge
- [list]

### Stylistic choices
- [list]

### Examples that remain valid
- [list]

---

## Recommended scope

Based on the audit, I recommend:

- **[Minor refresh / Significant refresh / Ground-up rebuild]**
- **Estimated time:** [rough estimate]
- **Estimated research queries:** [count]

---

## Your call

Before I proceed to Phase 2 (research), please confirm or adjust:

1. Does the research plan above look right? Anything to add or remove?
2. Is anything in "Preserved without modification" actually something you want updated?
3. Do you want me to address structural issues (if any), or only update facts?
4. Any context I'm missing that would change the classification?

Once you confirm, I'll proceed to Phase 2.

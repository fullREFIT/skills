# Staleness Taxonomy

How to classify and flag content during Phase 1 audit. Load with `platform-changes-log.md`.

## The six categories (reminder)

1. **Platform fact** — anything about Claude, Anthropic, Claude products, model capabilities, Skills, MCP, subagents, pricing, tools.
2. **Domain fact** — anything about the user's industry, competitors, third-party tools, market data, regulations.
3. **Behavioral rule** — how the AI should behave (tone, pacing, anti-patterns, decision rules).
4. **Institutional knowledge** — user-specific vocabulary, team names, internal processes, tool stacks.
5. **Stylistic choice** — voice, formatting conventions, prose patterns the user prefers.
6. **Example or illustration** — concrete scenarios, bad/good pairs, sample outputs.

Research applies to categories 1 and 2 only. Categories 3, 4, 5 are preserved. Category 6 is re-evaluated only if the underlying fact changed.

## Staleness flags

| Flag | Meaning | Action |
|---|---|---|
| `STALE` | Factually wrong given current state. | Update. Requires research confirmation before rewrite. |
| `LIKELY_STALE` | Was correct at some point, but the domain moves fast enough that it's probably outdated. | Research; update only if confirmed stale. |
| `FRESH` | Recently verifiable, no reason to suspect staleness. | Leave. Note in audit. |
| `EVERGREEN` | Not a time-sensitive fact — principle, rule, anti-pattern, voice. | Leave. Do not research. |
| `UNVERIFIED` | Can't be confirmed or denied with available sources. | Flag to user. Do not silently keep or silently remove. |
| `CONTRADICTION` | Internally inconsistent with another part of the document. | Flag to user. User resolves. |

## Classification heuristics

When in doubt between categories, ask yourself:

- **"Would two different users write this differently?"** If yes → probably behavioral/stylistic/institutional, not factual.
- **"Does this have a source of truth outside the document?"** If yes → platform or domain fact.
- **"Would this have been the same two years ago?"** If yes → likely evergreen.
- **"Does this encode a trade-off or priority?"** If yes → intent (D3), preserve.
- **"Is this a concrete number, name, version, or reference?"** If yes → probably fact, probably researchable.

## Common patterns

### Patterns that are almost always behavioral rules (preserve)

- "Lead with a recommendation"
- "No emojis unless the user uses them first"
- "Disagree when warranted"
- "End every response with a specific next action"
- "Do not ask clarifying questions before attempting"
- Anti-sycophancy rules
- Brevity / pacing rules

### Patterns that are almost always platform facts (research)

- Any model name
- Any pricing reference
- References to specific Claude features
- References to Skills, MCP, subagents, memory, canvas, artifacts
- Context window sizes
- Tool names
- Product surface names (Claude Code, Cowork, etc.)

### Patterns that are almost always domain facts (research)

- Competitor names or features
- Third-party tool versions or capabilities
- Market statistics
- Regulatory references
- Pricing comparisons

### Patterns that are almost always institutional knowledge (preserve)

- Custom vocabulary defined in the document
- Team/person names
- Internal tool stacks
- Project-specific acronyms
- The user's stated workflow

### Patterns that are often `CONTRADICTION` candidates

- Two rules that conflict without explicit priority
- An example that violates a rule stated elsewhere
- A model recommendation that contradicts a stated cost constraint
- Tool references that no longer match the tool's current capabilities

## Edge cases

**"This was a fact but has become a rule."** Example: "Claude cannot browse the web" was a platform fact in early 2024, then became stale, then some users converted it to a behavioral preference ("don't use web search for this type of task"). When you see this pattern, treat it as a behavioral rule and preserve it — even if the underlying platform fact has changed.

**"This is a rule that depends on a platform fact."** Example: "Always cache your system prompt at the top for cost savings." The rule is evergreen; the specifics (cache pricing ratio) may be stale. Preserve the rule; verify the specifics.

**"This is an example using a stale platform fact."** Example: a good/bad pair that mentions "Claude 3.5 Sonnet." The example's *point* is still valid; only the model name is stale. Update the name, preserve the example.

**"This is a vague behavioral rule that's become ineffective."** Example: "Be concise." If the user has complained that Claude isn't concise, the rule needs restructuring (maybe needs examples or anti-patterns) — but that's a rewrite decision, not a staleness decision. Flag it as a structural recommendation, don't silently rewrite.

## Severity thresholds

At the end of Phase 1, count the flagged items:

- **<10% STALE/LIKELY_STALE** → minor refresh, proceed normally.
- **10-40% STALE/LIKELY_STALE** → significant refresh; be explicit with the user about scope before Phase 2.
- **>40% STALE/LIKELY_STALE** → recommend ground-up rebuild instead of refresh. The structure is likely obsolete, not just the facts.

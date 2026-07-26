# Research Playbook

Methodology for Phase 2 research. Load when you begin research after the user approves the audit plan.

The goal is not to produce a survey of everything. The goal is to verify specific flagged items with authoritative sources, and to stop.

---

## Source trust hierarchy

### Platform facts (Claude, Anthropic, products)

**Primary (trust first):**
- `docs.claude.com`
- `anthropic.com/news` and `anthropic.com/engineering`
- `support.claude.com`
- Official Anthropic GitHub repos (when relevant)
- Anthropic's model cards and system cards

**Secondary (trust with corroboration):**
- Anthropic engineering blog posts on other platforms.
- Direct statements from Anthropic staff on verified channels.

**Do not trust for platform facts:**
- Third-party tutorials older than 90 days.
- Aggregator sites (Medium posts, LinkedIn articles, YouTube summaries).
- Reddit / HackerNews threads as primary sources (useful as signals, not truth).
- Other LLMs' knowledge (including Claude's own priors about itself — they will be stale).

### Domain facts

**Primary (trust first):**
- Company announcements / press releases / official blog.
- Regulatory bodies (government agencies, standards bodies).
- Peer-reviewed research or original data sources.
- SEC filings or equivalent financial disclosures.

**Secondary (trust with corroboration):**
- Reputable industry publications (varies by domain — the user knows their domain).
- Analyst reports from established firms.
- Recent articles from journalists with a track record on the beat.

**Do not trust for domain facts:**
- Any source over a year old when the question is "what's current."
- Aggregators summarizing other sources (go to the original).
- Content marketing disguised as analysis.
- LLM-generated content (check the byline).

---

## Query patterns

### For platform facts

Run searches that pull current Anthropic documentation first.

Good query patterns:
- `claude [feature name] docs`
- `anthropic [product] current`
- `docs.claude.com [topic]`
- `claude skills 2.0` (when looking for recent spec)
- `anthropic model pricing` (current pricing)

Bad query patterns:
- `best claude prompts` (aggregator bait)
- `claude 3.5 vs claude 4` (outdated comparison framing)
- Anything that relies on a specific version number you're unsure is current.

After the first search, fetch the doc page directly if possible. Doc snippets in search results are often truncated or stale.

### For domain facts

Explicit date constraints matter. "Current" to a search engine is often a year old.

Good query patterns:
- `[topic] [current year]`
- `[topic] latest`
- `[company] announces` (for fresh company news)
- `[regulation] current status [year]`

Bad query patterns:
- `[topic] guide` (almost always outdated)
- Anything without a date or recency cue for fast-moving topics.

For fast-moving areas (AI tooling, startup ecosystem, model announcements), do a second search with "last 30 days" or "last week" framing to catch recent changes the main search missed.

---

## The "verify then rewrite" rule

Never update a document based on a single search result. For each flagged item:

1. Find the authoritative source.
2. Read enough of it to confirm the fact.
3. If the fact contradicts what the user had, confirm with a second source (or flag as MEDIUM confidence if a second source isn't available).
4. Only then record the finding.

This is slow on purpose. The cost of a bad refresh is far higher than the cost of thorough verification.

---

## Known traps

### The "Claude says Claude can..." trap

If you find yourself consulting Claude's own training knowledge to confirm a Claude platform fact, stop. Claude's self-knowledge lags the platform. Always verify against live docs.

### The "it sounds right" trap

A confident-sounding source that matches your prior is NOT verification. Check the date. Check the author. Check whether it cites a primary source or is itself an aggregator.

### The "model name drift" trap

Model names get renamed. "Claude 3.5 Sonnet" may be referenced in old docs even when the current name is different. Check the model release notes page directly, not tutorials.

### The "feature was announced but..." trap

A feature announcement doesn't mean general availability. Check whether it's in beta, limited release, or GA. A user document saying "Claude can do X" when X is in limited beta is functionally stale.

### The "pricing is quoted wrong everywhere" trap

Pricing pages are the only reliable source for pricing. Do not pull pricing from blog posts, even Anthropic blog posts — they go out of date.

---

## When research fails

If you cannot verify a flagged item:

1. Mark it `UNVERIFIED` in the findings.
2. Note what you tried.
3. Recommend the user either:
   - Remove the claim if it's not essential.
   - Rephrase to be less specific (e.g., "current model" instead of a version number).
   - Manually verify against a source the user knows of.
4. Never silently keep a claim you couldn't verify. Never silently remove one either.

---

## Stopping criteria

You are done researching when:

- Every item on the approved research plan has a finding (including "UNVERIFIED").
- No new items have surfaced that weren't on the plan. (If they have, go back to the user — don't expand scope unilaterally.)
- The findings are written up in the research notes template.

Resist the urge to research adjacent items "while you're at it." That's scope creep and it erodes the audit-first discipline the skill depends on.

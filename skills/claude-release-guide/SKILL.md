---
name: claude-release-guide
description: "Convert shallow source material about a new Claude product or feature release (YouTube transcripts, blog posts, docs, announcements, pasted text) into a verified, teaching-grade implementation guide with prerequisites, exact steps, decision frameworks, edge cases, and cited sources. Specialized sibling to transcript-deep-dive: adds primary-source verification against claude.com and support docs, cross-references multi-source input for contradictions, outputs guides for teaching (Skool, LinkedIn, lead magnets, workshops) Use for Claude Design, Claude Code, Claude Cowork, Skills, MCP, Opus/Sonnet/Haiku model drops, pricing changes, platform features. MANDATORY TRIGGERS: claude release guide, new claude feature, claude release, claude announcement, claude product guide, teach a claude feature, claude how-to, new opus model, new sonnet model, new haiku model, claude design guide, claude code release, claude cowork release, release breakdown, feature deep dive."
---

# Claude Release Guide

Convert raw source material about a new Claude product or feature into a verified, teaching-grade implementation guide.

## When to Use

Use this skill when the user provides source material about a newly released Claude product or feature and wants a complete, teachable guide produced. Source material can be any or all of:

- One or more YouTube transcripts (most common)
- The official announcement post
- Third-party reporting (TechCrunch, VentureBeat, The New Stack, etc.)
- Pasted text, blog posts, internal notes, screenshots of docs
- A rough description from memory

Do not use for generic transcript conversion not involving Claude products — that is what `transcript-deep-dive` is for.

## Why This Skill Exists (and Why transcript-deep-dive Isn't Enough)

The general `transcript-deep-dive` skill handles the gap-analysis discipline well. Claude releases need four additional layers:

1. **Source verification against primary Claude sources.** Transcripts from launch day are shallow and sometimes wrong. Features evolve within days. Every factual claim must be checked against `claude.com/news`, `docs.claude.com`, `support.claude.com`, and the changelog — in that priority order.
2. **Multi-source reconciliation.** Multiple creators cover the same release with different takes and different errors. This skill cross-references them and flags contradictions explicitly.
3. **Release-context metadata.** Every guide declares the release date, the model generation behind the feature, access tier, and research-preview vs. GA status. This is what separates a stale guide from a current one.
4. **Teaching orientation.** Guides include a "Teach This" section — the 3–5 concepts a teacher must get across, common misconceptions to intercept, and suggested demo flow.

## Required Inputs

- **Source material** — at minimum one input. Multiple sources strongly preferred (one transcript + the official announcement is the minimum viable combo).
- **Target audience** — default: practitioners building with Claude — adjust audience to your context. Override if the user specifies.
- **Output format** — default: single markdown guide. Alternatives: Skool post, LinkedIn carousel brief, workshop outline, lead magnet.
- **Publishing voice** — default: your preferred voice; see config.example.md to set a voice guide. Default: plain, precise, first-person technical writing.

If no Claude product is named in the source, stop and ask — the skill is specialized, not general.

## The Process

Execute these phases in order. Do not skip or combine them. Compaction between phases is acceptable; merging phases is not.

### Phase 1 — Source Ingestion & Release Metadata

Read every source material file completely. Before anything else, extract and lock in the release metadata:

- **Product/feature name** (exact, as published)
- **Release date** (from official announcement, not from the YouTuber's upload date)
- **Release status** — research preview / public beta / general availability
- **Model behind it** (if applicable — e.g., Claude Design is powered by Opus 4.7)
- **Access tier** — which plans have it, gradual rollout status
- **Platforms** — claude.ai web, desktop, mobile, Claude Code, API
- **Related products** — what this connects to (Canva, Claude Code, MCP, etc.)

If any metadata field cannot be verified from a primary source, flag it `[VERIFY: what needs checking]`. Do not invent.

### Phase 2 — Gap Inventory

Apply the eight gap types from `references/gap-taxonomy.md` (shared with the `transcript-deep-dive` skill). For Claude releases, pay specific attention to these common gap patterns:

- **Pricing gaps** — creators say "available on paid plans" without specifying which plans or limits
- **Access gaps** — "rolling out gradually" without saying how to check if you have it yet
- **Feature-scope gaps** — what the product *is not* (Claude Design is not a web app builder; it does not deploy; it does not replace Figma for production design work)
- **Integration gaps** — how it connects to Claude Code, MCP, Canva, etc., and what the handoff actually looks like
- **Preview-status gaps** — what "research preview" means for reliability, data handling, and what can change

Produce a structured inventory before writing. The inventory is the guide's skeleton.

### Phase 3 — Verification Against Primary Sources

For every claim in the source material, verify against primary sources in this priority order:

1. **`claude.com/news`** — the official announcement is the authoritative source for positioning, access, and feature scope
2. **`docs.claude.com`** — for technical details, commands, API parameters, and feature mechanics
3. **`support.claude.com`** — for plan availability, pricing, and account-level questions
4. **Changelog / release notes** — for dates and version specifics
5. **Engineering and research blog posts** — for deeper mechanism explanations
6. **Reputable third-party reporting** (VentureBeat, TechCrunch, The New Stack, SiliconANGLE) — only to cross-check, never as the primary claim source

**Cross-reference multi-source input.** When two transcripts disagree on a feature detail, flag the contradiction and resolve it against the primary sources. If the primary sources don't settle it, keep the flag in the guide.

**Web search is non-negotiable for Claude releases.** Products change within days. Memory-based claims are stale by default. If web search is unavailable in the current context, produce the guide with explicit `[UNVERIFIED — web search not available in this session]` flags and instruct the user to verify before publishing.

### Phase 4 — Guide Construction

Build the guide using this structure. Sections are mandatory unless marked optional.

```
# [Product Name]: Complete Implementation Guide

*Release date: [date] | Status: [research preview/GA] | Model: [if applicable] | Verified: [verification date]*

## What This Guide Covers
One paragraph. What the reader will be able to do after completing this guide.

## The One-Line Summary
What this product is, in a single sentence, with the one thing it is NOT
(to kill the most common misconception up front).

## Who This Is For / Not For
Concrete criteria. Not "everyone" — specific use cases and specific non-use-cases.

## Prerequisites
- Plan tier required (exact: Pro $20/mo, Max, Team, Enterprise)
- Platform (web / desktop / Claude Code / API)
- Rollout status at publish time
- Prior knowledge assumed, with links to learn it
- Time estimate for full completion

## Quick Access — Do I Have It Yet?
Exact steps to check whether the feature is live on the reader's account.
Often missing from creator content, always needed.

## Core Concepts
One subsection per major concept. Each subsection:
1. What it is (plain language, one paragraph)
2. Why it exists (the problem it solves)
3. When to use it (decision criteria, not description)
4. When NOT to use it (the honest part creators usually skip)

## Setup & First Use
Numbered, exact steps. Real commands, real URLs, real UI paths.
End with: "How you know it worked."

## [Feature-Specific Walkthroughs]
One section per major feature path.

## Decision Frameworks
When to use [feature] vs. alternatives (Figma/Canva/Lovable/Gamma/etc.).
When to use [this feature] vs. [adjacent Claude feature].
A matrix, not prose.

## Limitations & Gotchas
The honest section. What this product does not do. Edge cases. Known issues.
Research-preview caveats. Token costs, rate limits if known.

## Integration Points
How this connects to Claude Code, MCP, Canva, other ecosystem products.
Concrete handoff examples.

## Pricing & Plan Mechanics
Verified plan availability and any usage limits.
If pricing is unclear, say so — don't guess.

## Teach This (optional, include when requested)
For readers who will teach this material:
- The 3–5 core concepts to get across
- Common misconceptions to intercept
- A suggested 10–15 minute demo flow
- Questions students will ask that aren't obvious from the docs

## Quick Reference
Summary table: features, access, exports, key commands/paths.

## Further Reading
Verified links to: official announcement, docs, related guides, authoritative third-party coverage.
Each link is cited with publication and publish date.

## Sources & Verification Log
- Primary sources consulted (URLs with access dates)
- Secondary sources consulted (publication, URL, date)
- Source material analyzed (transcripts, files)
- Any unresolved contradictions between sources
- Any `[VERIFY]` flags remaining in the guide
```

### Phase 5 — Quality Gates

Before delivering, verify each gate. A guide failing any gate goes back for revision, not out the door.

**Completeness gates**
- Every concept from every source is explained or explicitly excluded with reason
- Every step has exact commands/paths, not descriptions of steps
- "When to use" and "when NOT to use" addressed for every major feature
- Prerequisites section would let a zero-knowledge reader start

**Accuracy gates**
- Every factual claim cited to a primary source or flagged `[VERIFY]`
- Release date, model, access tier, and status confirmed from the official announcement
- URLs verified to point to real pages
- No fabricated examples, quotes, statistics, or pricing
- Contradictions between sources explicitly surfaced and resolved

**Usability gates**
- A reader could follow the guide without watching any transcript
- Section order follows logical learning sequence, not the video's narrative
- Each section works as a standalone reference
- Decision frameworks answer "which should I use?" without requiring judgment

**Voice gates (default: plain technical writing)**
- Reader is the subject, not the creator
- Specificity over generality — real numbers, real paths, real outcomes
- Admits limitations before claiming capabilities
- Banned words absent: transform, revolutionize, unlock, empower, seamless, game-changer, leverage, synergy, paradigm
- No hype, no AI slop, no "business leaders" framing
- First-person authentic voice where appropriate

**Teaching gates (when Teach This section is included)**
- Core concepts are ranked by importance, not listed flat
- Misconceptions are specific (what readers actually get wrong), not generic
- Demo flow has a time budget and a "what can go wrong on stage" note

### Phase 6 — Deliverable Packaging

Produce the guide in the requested format. Default is markdown in the working directory plus a brief summary inline. Alternative formats:

- **Skool post** — markdown, shorter, ends with a question that drives comments
- **LinkedIn carousel brief** — 8–12 slide structure with one idea per slide, hook on slide 1, CTA on last slide
- **Workshop outline** — 30/60/90-minute variants with timing, demos, and handout sections
- **Lead magnet** — branded header structure, CTA placement, PDF-ready formatting

## Anti-Fabrication Contract (Non-Negotiable)

This skill enforces a strict anti-fabrication contract:

- Never invent pricing, plan names, feature tiers, model capabilities, or release dates
- Never invent quotes from the vendor or third parties
- Never invent customer names, testimonials, or usage statistics
- Never invent URLs — verify every link exists
- If a detail is claimed in a transcript but not confirmed elsewhere, mark it `[VERIFY]` and keep writing
- If the official announcement contradicts a transcript, the announcement wins and the contradiction is noted in the Sources section
- If web search is unavailable, say so at the top of the guide and mark everything requiring verification

## Constraints That Separate a Good Guide from a Pretty One

1. **The source material is the skeleton, not the authority.** Transcripts are shallow and sometimes wrong. The guide corrects errors; it does not preserve them.

2. **No padding.** If a feature is simple, the section is short. Do not inflate shallow material to hit arbitrary depth.

3. **Decision frameworks over feature lists.** The most common reader complaint about release content is "but when should I use this?" Every feature gets a when-to-use and when-not-to-use.

4. **Progressive disclosure.** Summary first, depth on demand. A busy operator should get value from scanning. A thorough reader should be able to go deep on any section.

5. **Link everything.** Every product, feature, command, and integration gets a verified link. No official doc exists? Say so explicitly.

6. **Cite your verification.** The Sources section is mandatory. A guide without one is not a guide — it is a blog post dressed up as one.

## Cross-Skill Coordination

- **Use `transcript-deep-dive` instead** when the topic is not a Claude product.
- **Invoke `gmail-inbox-command`, `canva-visual-design-forge`, `linkedin-ai-image-carousels`** etc. downstream when the guide needs to be repackaged into another format for publishing.
- **Use `web-app-builder` or `interactive-checklist-skill`** when the guide should ship as an interactive web asset in addition to markdown.
- **Do not use `skill-architect`** — this skill is already created. `skill-architect` is for building new skills.

## Output

Default delivery:
1. The guide as a markdown file in the working directory
2. A one-paragraph inline summary in chat with the file path and headline findings
3. A Sources & Verification log at the foot of the guide
4. Any `[VERIFY]` flags surfaced in the inline summary, not buried in the guide

---
*Claude Release Guide v1.1 — April 2026*
*Specialized sibling of transcript-deep-dive. Requires web search for primary-source verification.*
*v1.1 renames from prior version to comply with SKILL.md reserved-word validation.*

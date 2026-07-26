# Script Forge

Evaluate source material (transcripts, articles, competitor videos, news) against your content strategy, voice system, and target audience fit. Produces teleprompter-ready YouTube scripts in long-form (8-12 min) or short-form (45-90 sec) format.

## What it does

Three-phase process: Evaluate (does this qualify?) → Reframe (transform for your brand's angle) → Produce (full annotated script). Will REJECT source material that doesn't qualify. Will state CONDITIONAL requirements when material is close. Will APPROVE AND PRODUCE when material is a fit.

## Installation

### Claude.ai / Claude Desktop / Cowork

1. Upload `script-forge.zip` at Settings → Customize → Skills → "+" → Create skill
2. Toggle the skill on
3. Trigger with `/script-forge`, `/sf`, "make a script from this," or "would this work for my audience"

### Claude Code

```bash
cp -r script-forge/ ~/.claude/skills/script-forge/
```

## File listing

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill document. Evaluation gate, reframe protocol, production workflow, quality gate. |
| `references/voice-and-humor-rules.md` | Tier 1/2 banned words, punctuation rules, structural tells, humor mechanics and density bands. |
| `references/anti-patterns.md` | Eight anti-patterns with detection criteria and fixes. |
| `references/saturated-clusters.md` | Known topic saturation, exhausted metaphors with cooldown dates, origination stream caps. Update this file as new clusters saturate or cooldowns expire. |
| `references/script-structures.md` | Full long-form and short-form templates with section timings, word counts, hook archetypes, and delivery notes. |
| `references/competitor-reframe.md` | Five-step protocol for turning competitor content into your brand's angles. |
| `references/calibration-patterns.md` | Named failure modes from production: voice drift, concept lectures, topic recycling, anecdote fabrication, em-dash creep, unearned humor, lead magnet format drift. |

## Prerequisites

None required. When filesystem is available, the skill loads governance docs from disk for comprehensive rule enforcement. When not available, inline rules cover all critical checks.

## Companion skills

- `youtube-screen-share-forge` — Produces slide decks from the screen share prompts this skill outputs
- `buyer-facing-content-check` — Pre-publish quality gate for finished scripts

## Customization

Before using Script Forge, you should:

1. **Update your TOV OS path** in SKILL.md Phase 3 to point to your actual voice system docs.
2. **Define your target audience persona** — the skill uses "your target audience" as a placeholder throughout; replace with your specific viewer profile in the reference files.
3. **Update `references/saturated-clusters.md`** with your actual topic history.
4. **Set your CTA architecture** — point the CTA references to your actual tool/lead magnet inventory.

## Maintenance

Update `references/saturated-clusters.md` when:
- A topic cluster reaches 3+ pieces (add to saturated list)
- A metaphor reaches 3+ uses in 60 days (add to cooldown with expiration)
- A cooldown expires (remove from list)
- A batch audit reveals new saturation

---

*Script Forge v1.4 — June 2026*

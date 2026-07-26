# Saturated Clusters and Cooldowns — Script Forge Reference

## Known Saturated Topic Clusters

These clusters have 3+ pieces in the existing inventory. New content in these areas requires a genuinely novel mechanism not covered by existing pieces. "Same insight, different angle" does not justify production.

> **Note for new users:** Replace the example clusters below with your actual content inventory. These are illustrative examples of the type of saturation tracking this file should contain.

### Example saturated clusters (replace with your own):

1. **Sales Visibility / CRM Intelligence** — Multiple pieces cover CRM blindness, pipeline data gaps, and sales conversation capture. Do not produce another "your CRM doesn't show you what's happening" piece without a new method.

2. **Team Capability / Adoption / Reversion** — Multiple pieces cover AI adoption failure, team training that doesn't stick, and reversion to old workflows. Do not add to this cluster without a specific build that addresses a mechanism none of the existing pieces cover.

3. **General "AI Readiness" Framing** — The "are you ready for AI" framing is generic and played out. Avoid unless the specific diagnostic is novel.

4. **Knowledge Base / Documentation Theater** — Multiple pieces cover the gap between folders of documents and a real knowledge system.

## Exhausted Metaphors (Hard Cooldown)

Do not use these metaphors in any content before the listed expiration date.

> **Note for new users:** Track metaphors that have appeared 3+ times in your content in the past 60 days.

| Metaphor | Uses in inventory | Cooldown until |
|----------|------------------------|----------------|
| *(add your exhausted metaphors here)* | — | — |

After cooldown expires, the metaphor may be used once. If it appears in 3+ pieces within 60 days after that, it goes back on cooldown.

## Anchor Story Throttle

- No anchor story reused within 60 days
- Any signature case study: max 1 per quarter across all channels (hard cap)
- Document anchor stories in YAML frontmatter (`anchor_story` field)

## Origination Stream Caps

- Stream A (Pain Point Insight): max 30% of any production batch
- Stream B (Tracker/Engagement): max 1 per quarter
- No two consecutive publications from the same audience cluster

## Deduplication Check

When filesystem is available, check your Content Asset Map:

```
{PROJECT_ROOT}/content-command-center/CONTENT-ASSET-MAP.md
```

When not available, ask: "Has this topic been covered in an existing video or post?"

## Maintaining This File

Update this file when:
- A new topic cluster reaches 3+ pieces (add to saturated list)
- A metaphor reaches 3+ uses in 60 days (add to cooldown list with expiration)
- A cooldown expires (remove from the list)
- A new batch audit reveals additional saturation

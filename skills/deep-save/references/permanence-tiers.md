# Permanence Tier Classification System

This document defines how to classify conversation content into permanence tiers for knowledge MCP storage.

---

## Tier 1: PERMANENT (`permanent: true`, no `stale_after`)

These survive forever. They represent durable knowledge that should be findable in any future session regardless of age.

| Category | Signal Phrases | Type | Example |
|----------|---------------|------|---------|
| **Decisions with reasoning** | "chose", "decided", "going with", "ruled out", "rejected" | `decision` | "Chose Supabase over PlanetScale because pgvector is native" |
| **Standing rules** | "always", "never", "from now on", "the rule is", "policy" | `decision` | "Never deploy without --project-ref flag" |
| **Lessons learned** | "learned", "realized", "turns out", "key insight", "gotcha" | `learning` | "The Supabase CLI honors env vars over linked project" |
| **Person notes** | Name + role/preference/contact info | `person_note` | "Sarah is CTO at Acme, prefers async communication" |
| **Architecture decisions** | "architecture", "pattern", "system design", "we use X for Y" | `decision` | "Open Brain uses 70/20/10 cosine/BM25/activation hybrid blend" |

**Permanence test:** Would this be equally valuable 2 years from now with no other context? If yes, it's permanent.

---

## Tier 2: LONG-LIVED (`permanent: false`, `stale_after`: 120-180 days)

Important now, likely still relevant in 3-6 months, but will eventually age out as systems change.

| Category | stale_after | Type | Example |
|----------|-----------|------|---------|
| **Observations about systems** | +120 days | `observation` | "The MCP has 25 tools as of v1.11.0" |
| **Ideas explored but not implemented** | +120 days | `idea` | "Could add a web dashboard for thought browsing" |
| **Reference URLs and file paths** | +180 days | `reference` | "Deploy script at scripts/deploy-edge-function.sh" |
| **Guides and how-tos** | +120 days | `guide` | "To deploy, run: bash scripts/deploy-edge-function.sh [name]" |

**Staleness test:** Would this still be accurate in 6 months? If uncertain, it's long-lived, not permanent.

---

## Tier 3: SHORT-LIVED (`permanent: false`, `stale_after`: 30-90 days)

Useful for near-term continuity. Fades naturally as the work progresses.

| Category | stale_after | Type | Example |
|----------|-----------|------|---------|
| **Session context / where we left off** | +30 days | `session_notes` | "We were working on migration 0026 when we stopped" |
| **Chat recaps** | +90 days | `chat_recap` | "This session covered signal scoring and audit trails" |
| **Project status snapshots** | +90 days | `observation` | "As of today, 14 thoughts are marked permanent" |
| **Tool pricing and availability** | +90 days | `reference` | "OpenRouter charges $0.001 per embedding call" |
| **Temporary workarounds** | +30 days | `observation` | "Using --no-verify-jwt until auth is wired up" |

**Decay test:** Will this be actively misleading in 3 months? If so, keep it short-lived.

---

## SKIP — Do NOT Save

These items have no future value or are already captured elsewhere:

- Debugging dead ends with no transferable lesson
- Setup steps already in CLAUDE.md or the codebase
- Small talk, greetings, "got it", "thanks", clarification questions
- Code that's already committed to git
- Intermediate work superseded by final versions in the same conversation
- Anything that would score below 30 on the signal score (skeleton session notes)
- Raw error messages without analysis
- Step-by-step execution logs ("ran npm install", "the test passed")

**Skip test:** If removed from this conversation entirely, would any future session be worse off? If no, skip it.

---

## Computing `stale_after` Dates

Calculate from today's date:

```
stale_after = today + offset_days
```

| Tier | Offset | Example (if today is 2026-06-09) |
|------|--------|----------------------------------|
| Tier 1 | N/A (no stale_after) | — |
| Tier 2 observation/idea/guide | +120 days | 2026-10-07 |
| Tier 2 reference | +180 days | 2026-12-06 |
| Tier 3 session context | +30 days | 2026-07-09 |
| Tier 3 recap/snapshot/pricing | +90 days | 2026-09-07 |

---

## Ambiguous Cases — Decision Framework

When classification is unclear, apply these tiebreakers in order:

1. **If it contains reasoning ("because", "instead of", "trade-off")** → Tier 1 (decisions survive)
2. **If it's about a specific person** → Tier 1 (relationship context is durable)
3. **If it names a version number, date, or count** → Tier 2 or 3 (will age out)
4. **If it starts with "currently" or "as of"** → Tier 3 (explicitly time-bound)
5. **When in doubt** → Tier 2 at 120 days (safe middle ground)

---
name: signal-scanner
description: "Internal build/activity content scanner for creators and builders. Mines your own builds, agent sessions, automations, runbooks, debugging work, docs, tools, deployments, and operating activity for proof-backed content and revenue opportunities, then routes them through your Revenue-Content Engine without making you the failure case. MANDATORY TRIGGERS: signal scanner, scan this build, scan my activity, mine this build, content from this build, content from my work, content opportunity, scan this session, scan this project, repurpose this build, what content is in this, build story, activity scan, proof scan, /signal-scanner, /scan."
license: MIT
allowed-tools: Read, Write, Glob, Grep
metadata:
  version: "1.2.0"
  user-invocable: "true"
---

# Signal Scanner

Signal Scanner is the internal proof scanner for your builds and projects. It identifies content and revenue opportunities inside your own builds, automations, tools, debugging sessions, runbooks, docs, agent workflows, shipped artifacts, and day-to-day operating activity.

It is not primarily a market-news scanner. External signals can be used as supporting demand context, but the core source is your real work.

Read these references before any scan:

1. [`references/revenue-content-engine-context.md`](references/revenue-content-engine-context.md) — current Revenue-Content Engine map and how internal proof routes into production.
2. [`references/business-context.md`](references/business-context.md) — your offer ladder, current sprint state, strengths, and constraints. **Customize this file for your business before use.**
3. [`references/analysis-framework.md`](references/analysis-framework.md) — scoring, editorial gate, output structure, and routing.

When local project files are available, prefer the canonical live docs named in `references/revenue-content-engine-context.md` over this bundled snapshot.

## When to Use

Use Signal Scanner when you want to find content in:

- A build, app, repo, automation, tool, runbook, workflow, or deployment.
- A debugging session, failure analysis, fix, verification run, or postmortem.
- An agent session, AI tool activity, task set, or project handoff.
- A doc folder, proof artifact, client-safe workflow, or internal operating system.
- A week/day of work where the question is "what content or revenue signal is hiding in what I actually did?"

Do not use Signal Scanner for generic topic brainstorming with no proof artifact. Do not use it for final script/post QA. Final production belongs downstream to production-layer skills.

## Input Processing

### Step 1: Inventory the real artifact

Before analysis, identify:

- **What was built or changed?** App, workflow, automation, runbook, doc, prompt, agent process, fix, deployment, audit, or operating system.
- **Where is the proof?** Exact file paths, URLs, workflow IDs, screenshots, test output, commits, logs, demos, docs, or task records.
- **What changed for a user/operator?** Before/after, bottleneck removed, hidden failure found, manual work reduced, risk exposed, decision clarified.
- **What is public-safe?** Client/private/buyer details require permission or anonymization. Do not expose confidential proof.

### Step 2: Separate content fuel from private process

Run the editorial gate before creating candidates:

- **Allowed:** lessons about systems, tools, client-safe patterns, AI operations, handoffs, approval lines, measurement, debugging, deployment, or proof-backed decisions.
- **Not allowed:** the creator's personal anti-patterns (e.g., over-planning, task-switching, disorganization, overwhelm), abandoned tangents, or personal working patterns as the story.
- **Required framing:** creator as observer, diagnostician, builder, teacher, translator, or operator. Never the creator as the failure case.

If an observation only works by making you look messy, kill it or reframe it into a system/operator lesson. If it cannot be reframed, do not surface it.

## Analysis Pipeline

Run all six lenses in order.

### Lens 1: Proof Artifact Mapping

For each artifact or activity cluster, capture:

- **Artifact:** exact path/URL/workflow ID/session/task evidence.
- **What happened:** one factual sentence.
- **Before/after:** what was unclear, manual, risky, broken, or slow before; what changed after.
- **Operator lesson:** the generalizable lesson a viewer/prospect can use.
- **Public-safety:** public-safe / anonymize / private-only / needs permission.

### Lens 2: Brand-Position Gate

Every candidate must answer:

> If a prospect consumed this, would they think "they know their stuff and could solve a problem like mine"?

Pass, reframe, or kill:

- **Pass:** Creator appears competent, specific, and useful.
- **Reframe:** move from the creator's personal experience to the system failure, operator pattern, or buyer lesson.
- **Kill:** depends on personal mess, private details, unverifiable claims, or stale self-reference.

### Lens 3: Revenue-Content Routing

Route the artifact into your Revenue-Content Engine:

- **Layer 01 Demand Truth:** if it creates a buyer-facing outreach reason, reply, proof note, diagnostic angle, or public comment opportunity.
- **Layer 02 CDE:** if it supplies proof for live audience demand, becomes a `BUILD-GAP` artifact, or should be matched against the demand feed/exclude list.
- **Layer 03 Production:** only if it already maps to an approved recording candidate.
- **Backlog/watchlist:** if useful but not yet tied to demand or a proof-safe story.

Remember: during a revenue sprint, outreach/replies/diagnostic conversion outrank content work.

### Lens 4: Content Opportunity Generation

Generate only proof-backed candidates. Each candidate needs:

- Working title.
- Format: long-form video / short-form / LinkedIn post / carousel / lead magnet / productized service.
- The real proof path.
- Core insight in one sentence.
- Module D seed: hook gap, expectation violation, concrete scene/number, or named absurdity.
- Wider audience segment: AI-curious professionals, aspiring consultants/freelancers, small-business owners, tech-adjacent operators, or other creators.
- Audience nod: one sentence, not the whole piece.
- Dedup/fingerprint: `the-problem--who-has-it` and whether it collides with produced/stale territory.

### Lens 5: Revenue Opportunity Generation

Identify whether the artifact creates:

- A prospect outreach reason.
- A diagnostic offer angle.
- A case-study/proof asset need.
- A productized service pattern.
- A lead magnet or runbook that supports an existing offer.
- A warmth note for future outreach.

Score revenue proximity 1-5 using `references/analysis-framework.md`.

### Lens 6: Packaging Recommendation

Decide the next movement:

- `capture-only`: save proof/idea, not ready.
- `CDE-match`: compare against demand feed/exclude list.
- `approval-map/build-gap`: build one missing artifact first.
- `produce-package`: ready for production because a recording candidate approval exists.
- `revenue-action`: buyer-facing action should happen before content.
- `kill`: unsafe, stale, weak, or creator-as-failure.

## Output Structure

Every scan produces this markdown structure:

```markdown
# Signal Scan: [Build/activity/artifact]

**Source:** [paths/URLs/session/docs scanned]
**Scan date:** [date]
**Artifact type:** [build / automation / runbook / debugging session / workflow / doc / agent activity]
**Public-safety:** [public-safe / anonymize / private-only / needs permission]

## What Actually Happened
[2-3 factual sentences. No hype.]

## Proof Inventory
- [Exact path/URL/workflow/test/log]
- [What it proves]

## Content Candidates
### 1. [Working title]
- **Format:** [LF/SF/LI/carousel/lead magnet/service]
- **Core insight:** [one sentence]
- **Proof path:** [exact path]
- **Module D seed:** [hook gap / expectation violation / concrete scene]
- **Audience:** [wider audience segment + one operator nod]
- **Brand-position:** [pass/reframe/kill + reason]
- **Dedup/fingerprint:** [problem--who-has-it + collision note]

## Revenue Opportunities
[Outreach/proof/diagnostic/productized-service opportunities with revenue proximity]

## Revenue-Content Routing
- **Layer 01:** [buyer-facing action, if any]
- **Layer 02/CDE:** [match/feed/build-gap/watchlist, if any]
- **Layer 03:** [only if approved candidate exists]

## Verdict
[One paragraph: what this work is worth as content/revenue proof]

## Next Action
[ONE specific next action. Not a list.]
```

## Critical Rules

1. **Your real work is the source.** The skill mines builds and activities, not vibes.
2. **Proof or it does not count.** Every candidate needs an exact path, URL, workflow ID, screenshot, output, or doc.
3. **The creator is never the failure case.** Personal working-pattern material is private unless explicitly asked for that exact frame.
4. **Revenue action still comes first.** If a build creates a buyer-facing outreach or diagnostic action, recommend that before content production.
5. **Do not bypass CDE.** Internal proof can support your content demand engine, but recording candidates still need demand, Module D, proof, creator chair, and dedup clearance.
6. **Do not leak private proof.** Buyer/client/private details require permission or anonymization.
7. **One next action.** End with the next best move, not a menu.

## What This Skill Does NOT Do

- Does not primarily scan market news or competitor announcements. Those are supporting demand context, not the main source.
- Does not replace your weekly shortlist or recording-candidate promotion.
- Does not run final editorial QA.
- Does not write final scripts or posts.
- Does not fabricate proof or infer missing outcomes.

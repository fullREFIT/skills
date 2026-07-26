# Revenue-Content Engine Context for Signal Scanner

> **Update the canonical file paths below to match your project structure before use.**

## Signal Scanner's role

Signal Scanner mines your own builds and activities for proof-backed content and revenue opportunities. It is the internal proof/artifact scanner in the Revenue-Content Engine.

It answers:

- What did you build, fix, ship, automate, debug, document, or operate?
- What proof did that create?
- What lesson could become content without making you the failure case?
- Does this proof support an existing demand cluster, become a `BUILD-GAP` artifact, or create a buyer-facing revenue action?

It does not replace the CDE demand feed. CDE starts from live audience demand. Signal Scanner starts from your proof inventory and operating activity, then routes useful proof into production only when the demand/proof/voice gates are satisfied.

## Canonical authorities

Parent Revenue-Content Engine SSOT:
`{PROJECT_ROOT}/revenue-content-engine/current-ssot-docs/revenue-content-engine-ssot.md`

If a layer-specific SSOT conflicts with the parent SSOT on that layer's subject, the layer SSOT wins.

## The four-layer flywheel

```text
00 Voice / Quality
  governs public voice, hooks, editorial safety, and the creator's allowed chair.

01 Demand Truth
  creates buyer conversations through outreach and tracks real revenue signal.

02 Origination CDE
  turns public/private demand into vetted recording candidates.

03 Production
  turns approved candidates into publishable content packages and distribution assets.
```

Signal Scanner can create inputs for all four layers, but it does not own the final gate for any layer.

## Layer 00 — Voice and Quality

Canonical files:

- `{PROJECT_ROOT}/revenue-content-engine/current-ssot-docs/four-module-tov-os-ssot.md`
- `{PROJECT_ROOT}/revenue-content-engine/current-ssot-docs/content-idea-generation-ssot.md`

Internal-build content must obey:

- Creator's allowed chair/role positions: observer, diagnostician, builder, teacher, translator, operator.
- Creator is never the failure-case seat.
- Module D is required before promotion: hook gap, expectation violation, concrete scene/number, speakable hook seed.
- Audience breadth is mandatory. Daily content is wider than the primary buyer persona only.

## Layer 01 — Demand Truth / Revenue Sprint

# Example Paths (Update These for Your Project)

Canonical files (replace with your actual paths):

- Working plan: `{PROJECT_ROOT}/revenue-content-engine/01-demand-truth/revenue_sprint_working-plan.md`
- Prospect tracker: `{PROJECT_ROOT}/revenue-content-engine/01-demand-truth/prospect_tracker.csv`
- Daily scorecard: `{PROJECT_ROOT}/revenue-content-engine/01-demand-truth/daily_scorecard.csv`
- Daily checklist: `{PROJECT_ROOT}/revenue-content-engine/01-demand-truth/daily_execution_checklist.csv`

Layer 01 rule:

> Outreach, replies, and diagnostic conversion are the first checkboxes. Content and CDE do not count as the day's revenue action by themselves.

Signal Scanner implication: if an internal build creates a buyer-facing proof note, outreach reason, diagnostic framing, or public comment opportunity, route that before content production.

## Layer 02 — Origination / Content Demand Engine

# Example Paths (Update These for Your Project)

Canonical CDE SSOT:
`{PROJECT_ROOT}/revenue-content-engine/02-origination-cde/content-demand-engine/content-demand-engine-SSOT.md`

Required CDE operating files (replace with your actual paths):

- Audience-demand source doc: `{PROJECT_ROOT}/revenue-content-engine/02-origination-cde/audience-demand-research-system.md`
- Running demand feed: `{PROJECT_ROOT}/revenue-content-engine/02-origination-cde/demand-feed_RUNNING.md`
- Exclude list: `{PROJECT_ROOT}/revenue-content-engine/02-origination-cde/exclude-list.md`
- Weekly shortlists: `{PROJECT_ROOT}/revenue-content-engine/02-origination-cde/content-demand-engine/outputs/weekly-shortlists/`
- Recording candidates: `{PROJECT_ROOT}/revenue-content-engine/02-origination-cde/content-demand-engine/outputs/recording-candidates/`

CDE chain:

> audience evidence → raw demand feed → weekly demand clusters → vetting → proof-backed recording candidates → downstream scripting.

Signal Scanner's relationship to CDE:

- It can identify proof that satisfies or strengthens a demand cluster.
- It can create a `BUILD-GAP` recommendation when demand exists but proof is missing.
- It can recommend matching a build against `demand-feed_RUNNING.md` and `exclude-list.md`.
- It cannot promote proof-only artifacts into recording candidates without demand, proof path, creator chair, and dedup clearance.

## Layer 03 — Production

# Example Paths (Update These for Your Project)

Canonical files (replace with your actual paths):

- `{PROJECT_ROOT}/revenue-content-engine/03-production/production-pipeline-SSOT.md`
- `{PROJECT_ROOT}/revenue-content-engine/03-production/workflow-guide.md`
- `{PROJECT_ROOT}/revenue-content-engine/03-production/README.md`

Production starts only after a recording candidate has explicit proof path, creator chair, hook gap, and candidate tests passed.

## Routing decisions for internal proof

Use this order:

1. **Buyer-facing proof:** if the artifact creates a specific outreach/reply/follow-up/diagnostic action, route to Layer 01 first.
2. **Proof capture:** preserve exact paths, URLs, workflows, test results, screenshots, or docs.
3. **CDE match:** compare the proof to current demand feed, weekly shortlist, recording candidates, and exclude list.
4. **Build-gap:** if audience demand is real but proof is missing, recommend the smallest artifact to build before recording.
5. **Production:** only after candidate promotion.
6. **Watchlist/kill:** if useful but not demand-backed, public-safe, or distinct enough.

## Anti-drift rules

- Do not restart strategy unless explicitly asked.
- Do not turn internal activity into content just because work happened.
- Do not let content research count as revenue action.
- Do not use confidential buyer/client details as public proof.
- Do not resurrect stale/produced topics unless the new mechanism is genuinely different and named.
- Do not frame personal working patterns as public content.

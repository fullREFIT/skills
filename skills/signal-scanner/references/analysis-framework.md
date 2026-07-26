# Analysis Framework

Scoring criteria and evaluation standards for Signal Scanner analysis.

## Revenue Proximity Scale

Score every opportunity 1-5:

| Score | Definition | Example |
|-------|------------|---------|
| 5 | Revenue this week | "This build proves a pain a named prospect has. Send a specific message or diagnostic follow-up." |
| 4 | Revenue this month | "This artifact supports a warm list, proof note, or diagnostic angle." |
| 3 | Revenue this quarter | "This can become credible content or a proof asset that creates warm context." |
| 2 | Revenue in 6 months | "This is capability proof or a future franchise, but no near-term buyer path." |
| 1 | Strategic value, unclear revenue | "Useful internally, no clear content or money path." |

Most internal work scores 2-3. Fives require a named or directly reachable buyer/reply path.

## Proof Strength Scale

| Strength | Definition |
|----------|------------|
| Strong | Working artifact, live URL, test output, before/after, client-safe result, or demo-ready system. |
| Medium | Clear doc/workflow/runbook with enough detail to reconstruct the lesson. |
| Weak | Vague session memory, no path, no output, or only a claim. |
| Private | Strong proof exists but cannot be used publicly without permission/anonymization. |

Weak proof does not become content. Private proof can create internal sales notes or anonymized lessons only.

## Brand-Position Gate

Every candidate must pass:

> A prospect should conclude "they know their stuff and could solve a problem like mine," not "their own work is chaotic."

Statuses:

- `pass`: safe as-is.
- `reframe`: shift from the creator's personal process to the system/operator lesson.
- `private-only`: useful for internal operating improvement but not content.
- `kill`: cannot be made safe or useful.

## Opportunity Types

### Content opportunities

- Long-form video from a proof-rich build story.
- Short-form from one mechanism or named absurdity.
- LinkedIn post from one operator lesson.
- Carousel from a framework/checklist/approval map.
- Lead magnet/runbook from a repeatable artifact.

### Revenue opportunities

- Outreach proof note.
- Diagnostic conversation starter.
- Productized service pattern.
- Case-study/proof asset need.
- Public comment angle tied to a live buyer/operator pain.

### CDE / origination opportunities

- Internal proof that matches a demand-feed cluster.
- Build-gap artifact that makes a demanded topic recordable.
- Evidence for a Module D hook gap or concrete scene.
- Watchlist item if proof exists but demand is not clear.

## CDE Routing Statuses

| Status | Use when | Next step |
|--------|----------|-----------|
| `proof-only` | Good internal proof, no live demand match yet | Save with path; watch for demand match. |
| `CDE-match` | Proof clearly supports an existing demand cluster | Compare against feed/shortlist/exclude list. |
| `BUILD-GAP-complete` | A previously missing artifact now exists | Re-evaluate the candidate. |
| `produce-package` | Approved candidate already exists | Route to production layer. |
| `revenue-action` | The proof creates a buyer-facing next step | Do that before content. |
| `kill/private` | Unsafe, stale, weak, or creator-as-failure | Do not surface as content. |

Do not collapse proof-only into recording-candidate. Your content demand engine still requires audience demand, proof path, creator chair, and dedup clearance.

## Content Candidate Tests

Each candidate must include:

1. **Proof path:** exact file/URL/workflow/test/log.
2. **Creator Test:** the creator has a real opinion or story and would enjoy recording it.
3. **Human Test:** specific lived detail, no fabrication.
4. **Breadth Test:** useful beyond a narrow single-buyer-type audience.
5. **Brand-Position Test:** creator is not the failure case.
6. **Module D seed:** hook gap, expectation violation, concrete scene/number, named absurdity.
7. **Dedup/fingerprint:** `the-problem--who-has-it` and collision note.

## Internal Source Inspection Protocol

When scanning a folder/session/project:

1. Read or list the relevant artifact paths. Do not infer contents from filenames alone.
2. Capture exact proof handles: paths, URLs, IDs, screenshots, outputs, logs, tests, commits.
3. Identify before/after and the operator lesson.
4. Run the brand-position gate before generating ideas.
5. Match candidates to your demand/exclude list before recommending production.
6. End with one next action.

## Anti-Patterns

1. **Proof laundering:** pretending a vague memory is proof.
2. **Creator-as-failure framing:** making personal process the hook.
3. **Content from activity alone:** work happened, but no lesson/proof/audience value exists.
4. **Skipping revenue action:** turning a buyer-facing proof note into content instead of outreach.
5. **Skipping CDE:** sending proof-only artifacts straight to production.
6. **Confidential proof leakage:** using client/buyer details publicly without permission.
7. **Stale topic resurrection:** reusing produced territory without a genuinely new mechanism.
8. **Menu endings:** giving five options instead of the one next action.

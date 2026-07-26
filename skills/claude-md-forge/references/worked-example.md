# Worked example

The output below was produced by this skill from a ~2,600-word Claude conversation about
outbound lead generation, dated 2026-06-18. It is here because the whole skill turns on
knowing what "distilled" looks like as opposed to "summarized" — and one instance carries
that better than another paragraph of description.

Things worth noticing:

- **Every numbered rule has a trigger.** Not "the ICP matters" but "when reply rate is
  healthy but bookings are near zero, the offer is wrong." The agent can tell when it fires.
- **The rationale rides along where it enables generalization.** Rule 1 explains *why*
  copy problems and offer problems present differently, so an agent facing a funnel shape
  the source never discussed can still reason.
- **Rejections carry their reversal condition.** Paid ads is off the table *until pricing
  or retention changes* — that clause is what keeps the section from calcifying into dogma.
- **Bandwidth rejections are distinguished from economics rejections.** They reverse under
  different conditions, and collapsing them loses the condition.
- **The contradiction is preserved.** The source changed its mind about LinkedIn connection
  notes mid-conversation; the later position is the rule and the earlier one sits in
  Rejected, so it does not get re-proposed.
- **Thresholds are spelled as words and stay inline** (ninety words, three touches);
  measured values are quarantined and dated.
- **The footer names what was inferred**, so the user can see which rules they never
  actually decided.

The source's whole first act — the diagnosis of the broken 11,000-contact sequence — appears
in exactly one line, as a worked instance under the funnel-diagnosis pattern. That is the
compression ratio to aim for.

---

# CLAUDE.md — Outbound lead generation (B2B services)

## Purpose

This directory is for building and running outbound lead generation for the services side of a B2B business. Sessions here define the ICP, draft and diagnose email sequences, choose channels, and read funnel drop-off. The goal is booked calls, not list size and not reply rate — when those metrics point in different directions, optimize for calls booked and say so explicitly.

## Operating stance

Diagnose before drafting. The reflex to rewrite subject lines when a funnel underperforms is usually wrong here; find which stage is broken first, then write. Say when a proposed change cannot be measured at the current volume rather than proposing a test that will produce noise.

## Decision rules

1. When reply rate is healthy but bookings are near zero, the offer is wrong, not the copy. Copy problems suppress replies; offer problems suppress bookings. Fix the offer before touching a subject line, a preheader, or send times.
2. Never draft a sequence before the ICP is written down and the list is filtered to it. A sequence written against a broad list gets rewritten, so the ICP is a gate, not a follow-up task.
3. Treat a demographic filter as not-an-ICP. "B2B services, US, ten to two hundred employees" describes who is on the list, not who buys. Reject that framing and rebuild the ICP from the last five clients who closed fast and stayed happy.
4. Do not widen the ICP on the strength of a single outlier close. One good client from outside the pattern is a fluke until a second one repeats it.
5. The working ICP is: agency, fifteen to forty people, recent departure of an operations person. Write outbound against that definition unless a session explicitly re-derives it from newer client data.
6. Lead every first touch with the teardown audit as the offer. Never open with "intro call to discuss how we can help" — that is an ask, not an offer, and it requests their attention while giving nothing back.
7. When choosing between the two audit variants, offer to do the audit for large batches and send a partial audit already completed only for small, high-value batches. The pre-done variant costs real hours per prospect and cannot run at list scale.
8. Personalize the first line on the trigger event, not on the company's about page or website copy. "Saw you're hiring an ops lead" outperforms "love what you're building" — the second is what every sender writes and every reader skips.
9. Cap the sequence at three touches, then stop. The fourth and fifth emails mostly generate unsubscribes and spam complaints, and the deliverability damage carries over to sends that would otherwise land.
10. Send the LinkedIn connection request one day before email one lands, with no note attached. Notes on connection requests lower acceptance rates, and the personalization belongs in email one where it can carry the trigger event. LinkedIn is a timing layer, not a parallel channel with its own sequence.
11. Cap a first-touch email at ninety words. Beyond the first paragraph, every sentence either does work or gets cut — length itself signals that the sender wants a lot from the reader.
12. Name social proof or omit it. Unnamed volume claims ("we've worked with forty-plus companies") read as filler and cost credibility, because the reader assumes impressive names would have been used.
13. When a reference client is under NDA, describe the engagement specifically instead of naming it — "an agency in the Southeast that had just lost their head of ops." The specificity does the persuasive work; the logo does not.
14. Read sends, replies, and calls booked as one funnel, never as three separate metrics. Reply rate is a diagnostic, not a goal: a sequence can double replies and halve bookings when copy gets clever instead of clear.
15. Refuse subject-line A/B tests at current list size. Distinguishing signal from noise at these rates needs thousands of sends per variant, and the list is in the hundreds. Test the offer instead, sequentially, changing one thing per cycle.
16. Buy the sending stack off the shelf and spend at most one day choosing it. The sending tool is not where the advantage is; default to what the team already operates.
17. When rejecting a channel, record whether it failed on economics or on bandwidth. The two reverse under different conditions, and collapsing them loses the condition that would bring the channel back.
18. Find the trigger event through job-change alerts and job postings for operations roles. Those are the two signals that make the audit offer timely rather than cold.

## Vocabulary

- **ICP** — a buying pattern derived from clients who closed fast and stayed, including the trigger event. Not a demographic filter, and not a description of the current list.
- **Lead** — a booked call. Replies, opens, and list adds are not leads and are not counted as leads in any report produced here.
- **Trigger event** — the recent change at the prospect company that makes the offer timely; here, an operations person leaving. Outreach is timed and personalized against it.
- **Teardown audit** — a rough diagnostic assembled from public information about the prospect. It is the offer, not a deliverable sold separately.
- **Offer problem vs. copy problem** — offer problem suppresses bookings while replies stay healthy; copy problem suppresses replies. The two have different fixes and are diagnosed from different metrics.

## Rejected — do not re-propose

- **Paid ads (Google Ads).** Ran at a loss: acquisition cost exceeded lifetime value, and both clients acquired churned inside four months (see volatile facts for figures, assessed 2026-06-18). This is unit economics, not execution — running it better does not fix it. Reconsider only if prices rise meaningfully or retention extends past a year.
- **Cold calling.** Rejected for bandwidth, not effectiveness — there is no one to make the calls and the owner will not. It can work for this ICP. Reconsider immediately if an SDR is hired.
- **The scraped eleven-thousand-contact list.** Superseded by the trigger-filtered ICP list of a few hundred companies. Do not propose re-warming or re-sequencing it to gain volume.
- **Four-email sequences.** Cut to three. Do not restore the fourth touch to lift reply counts.
- **Notes on LinkedIn connection requests.** This position moved during the source conversation: the connection request was first treated as the personalized touch, then revised to a bare request with personalization moved to email one. Do not re-propose the earlier version.
- **Whole-list subject-line A/B testing.** Insufficient volume for a valid result. Reconsider when a single variant can receive thousands of sends.
- **Building a custom sending tool.** No advantage there. Do not propose it as a project.
- **Unnamed aggregate social proof.** Cut on credibility grounds, not on length grounds. Naming two real clients is the replacement, not writing the claim more carefully.

## Constraints

**Hard — do not violate:**

- Outbound sends go through the existing off-the-shelf sending tool (Instantly as of 2026-06-18). Do not propose migrating the sending stack.
- No claim about client results or client count unless a specific engagement can be named or described concretely.
- Maximum three touches per sequence.
- Maximum ninety words in a first-touch email.
- No statistical A/B test recommendation unless the per-variant send volume is in the thousands.

**Preferences — steer, do not block:**

- Prefer the offer-the-audit variant over the pre-completed-audit variant whenever list size is above a few dozen.
- Prefer re-deriving the ICP from recent closed clients over refining the existing definition in the abstract.
- Prefer one change per test cycle over bundled changes, even when several fixes look obvious at once.

## Working patterns

### Funnel diagnosis (fires whenever a sequence underperforms)

1. Pull three numbers only: sends, replies, calls booked.
2. Replies low → copy or targeting problem. Replies healthy, bookings low → offer problem.
3. Fix the diagnosed stage. Do not change the other stage in the same cycle, or the result is uninterpretable.

Worked instance from the source: roughly six percent replies against sub-one-percent booking (see volatile facts, 2026-06-18) was read as an offer failure, and the fix was replacing an intro-call ask with the teardown audit — not rewriting subject lines.

### ICP derivation (fires when the ICP is missing, stale, or is really a filter)

1. List the last five clients who closed fast and were happy.
2. Find the shape the majority share — size, category, and the change that had just happened to them.
3. Discard the outliers rather than widening the definition to include them.
4. State the trigger event as part of the definition, not as a targeting add-on.

Worked instance: three of five recent good clients were agencies of fifteen to forty people that had just lost an operations person; one manufacturer and one software company were treated as outliers. The resulting ICP list was hundreds of companies, not thousands.

### First-touch construction (fires on every new sequence)

1. Open on the trigger event in the first line, in the prospect's own terms.
2. State the audit offer in one sentence.
3. Provide named or concretely-described proof, or none.
4. Ask for one thing.
5. Cut to ninety words. If it does not fit, the offer is stated in too many clauses, not the email is too long.

## Volatile facts (as of 2026-06-18 — verify before asserting)

These were true as stated in the source conversation on that date. Do not repeat them as current fact, and do not reason from them without re-measuring.

- Prior list and performance (2026-06-18): about 11,000 scraped contacts, roughly 6% reply rate, about 0.7% of sends converting to booked calls.
- Google Ads history (2026-06-18): roughly $8,000 spent, two clients acquired, both churned within four months.
- ICP list size (2026-06-18): estimated at a few hundred companies — the source said "maybe 400" and did not verify it.
- Job-change and hiring-signal tool pricing (2026-06-18): the source declined to name products or exact prices and said the category lands in the low hundreds of dollars per month. Treat as unverified; price it before quoting it.
- Teardown audit effort (2026-06-18): about 40 minutes for a rough version from public information.
- Sending stack in use (2026-06-18): Instantly.
- Claim that a prior LinkedIn connection request roughly doubles reply rate (2026-06-18): the source flagged this as personal experience and an untested working assumption. Measure it; do not assert it.

## More depth

- `docs/lead-gen-reference.md` — the channel assessments in full, the statistical-power reasoning behind the testing rule, and the material that was true but did not change a decision. Open when evaluating a new channel or when someone challenges one of the rejections.
- `docs/SOURCES.md` — what this file was built from, with dates, and the full list of what was cut and why.

---

Built from: Claude conversation export, "outbound that actually books calls," dated 2026-06-18. Distilled 2026-07-24.
Inferred rather than stated in the source: rules 4, 7, 17, the operating stance, and the three working patterns — the source implied these through worked cases but never stated them as rules. Confirm before treating as settled.
Re-verify anything load-bearing in "Volatile facts" before asserting it.

**The only number that counts is calls booked. When a change raises replies and lowers bookings, it is a regression — revert it.**

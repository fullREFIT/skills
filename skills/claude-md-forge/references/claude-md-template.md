# The template, annotated

The skeleton lives in `assets/CLAUDE.md.template`. This file explains what each section is for, what belongs in it, and what the section looks like when it has gone wrong.

Delete any section you cannot fill with real operative content. An empty section still costs tokens and still gets read.

---

## 1. Purpose (3–5 lines, no heading fluff)

What work happens in this directory and what the agent is here to do. Not a description of the topic — a statement of the job.

**Good:** "This directory is for building and running outbound lead generation for a B2B services business. Sessions here draft sequences, qualify lists, and diagnose funnel drop-off. The goal is booked calls, not list growth — optimize for the former even when the latter looks better."

**Bad:** "This project contains information about lead generation." (Describes the folder. Changes nothing.)

The last clause of the good version is doing the real work: it names the trade-off the agent will otherwise get wrong.

---

## 2. Operating stance (optional, 2–4 lines)

Only include when the source establishes a posture that differs from default agent behavior — an expertise frame, a bias toward action, a house voice, a required skepticism. If it is just "be helpful and accurate," cut the section.

---

## 3. Core decision rules — the heart of the file

Numbered, trigger→action, one rule per line, rationale attached where it enables generalization. This is where most of the file's value lives, so put it high.

```markdown
## Decision rules

1. When the prospect has fewer than 20 employees, lead with the audit offer, not the retainer — small teams buy a diagnosis before they buy a commitment.
2. Never send a sequence before the ICP is written down. Sequences written against a broad list get rewritten, so the ICP is the gate, not a follow-up.
3. If reply rate is above 8% but booking rate is below 1%, the problem is the offer, not the copy. Fix the offer before touching the emails.
```

**Sequence rules by trigger frequency, not by topic** — the rules that fire in most sessions go first.

**Failure shape:** rules that are actually observations ("The ICP matters a lot"), or rules with no trigger ("Focus on quality") that the agent cannot tell when to apply.

---

## 4. Vocabulary (only where misreading changes output)

A short list. Each entry: the term, the specific sense it carries here, and — where useful — the common sense it does *not* carry.

```markdown
## Vocabulary
- **Lead** — a booked call, not an email capture. "Lead count" always means calls booked.
- **Warm** — has replied at least once in the last 90 days. Not "opened an email."
```

Two entries that prevent a real misread beat twenty that define obvious words.

---

## 5. Rejected approaches — do not re-propose

The most under-written and most valuable section. Each entry: what was rejected, why, and what would have to change for it to come back on the table. That last clause is what keeps this from calcifying into dogma.

```markdown
## Rejected — do not re-propose
- **Paid ads.** CAC exceeded LTV at current pricing (assessed [source date]). Reconsider only if price rises above $X or LTV is re-measured.
- **Cold calling.** No bandwidth, not an effectiveness judgment. Reconsider if headcount grows.
```

Without this section a fresh agent will confidently propose the thing the user killed three months ago, and the user re-litigates it every session.

---

## 6. Constraints and non-negotiables

Hard limits that block action, separated from strong preferences that merely steer. The agent must be able to tell which is which without inferring — so use two subheadings, not one blended list.

```markdown
## Constraints
**Hard — do not violate:**
- No claims about client results without a named, verifiable source.
- All outbound goes through [tool]; do not propose a different sending stack.

**Preferences — steer, do not block:**
- Prefer plain-text emails over HTML.
```

---

## 7. Working patterns (with at least one worked example)

Reusable sequences and templates. A pattern with no instance is an adjective — include the instance, even abbreviated. If a pattern needs more than ~30 lines to convey, put the full version in `docs/` and keep the trigger and a pointer here.

---

## 8. Volatile facts — dated, quarantined

One section, near the bottom, with an explicit verify-before-asserting instruction. Rules elsewhere reference this section rather than embedding the numbers, so a refresh touches one place.

**What is volatile:** measured or observed values — prices, reply rates, spend, benchmarks, versions, model names, platform behaviors, competitor claims.

**What is not:** decision thresholds the user chose. A ninety-word cap or a three-touch limit is a constraint, not a fact about the world; it belongs in the rules. Spell those as words rather than digits — it keeps them visually distinct from measured values and keeps the audit script from flagging them.

Carry the date **inline on each entry**. A section heading alone is fragile: entries get reordered, moved, and quoted out of context, and a stripped date is how a stale number becomes a confident assertion.

```markdown
## Volatile facts (as of 2026-06-18 — verify before asserting)
These were true as stated in the source on that date. Do not repeat them as current
fact, and do not reason from them without re-measuring.
- Prior sequence performance (2026-06-18): ~6% reply, ~0.7% of sends booked a call.
- Paid search history (2026-06-18): ~$8,000 spent, two clients, both churned in four months.
```

---

## 9. Pointers, not payload

Where the depth lives. Reference `docs/` files by path with a one-line note on when to open each. Do not inline them — that is precisely the material that failed the behavior test.

```markdown
## More depth
- `docs/lead-gen-reference.md` — full teardown of the three channel tests. Read when evaluating a new channel.
- `docs/SOURCES.md` — what this file was built from, and what was cut.
```

---

## 10. Provenance footer

Sources and dates, what is inferred rather than stated, and a re-verification prompt. This is what lets the file age honestly instead of silently going stale.

```markdown
---
Built from: [source], [date]. Distilled [date].
Inferred rather than stated in source: the ICP-outlier rule, the audit-variant rule, and
the three working patterns — confirm before treating as settled.
Facts in "Volatile facts" carry the source date. Re-verify anything load-bearing before asserting it.
```

Name inferred rules by subject, never by number. Rules get resequenced as new ones land, and a footer that says "rules 3, 7" quietly starts pointing at the wrong ones.

---

## Closing line

Restate the single most important constraint. The end of a long context gets attention the middle does not, and one repeated line is cheap insurance on the rule you least want violated.

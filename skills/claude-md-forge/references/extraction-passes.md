# Extraction passes — full procedure

Six passes. Each one has a different job, and collapsing them is how the output degrades into a summary. Pass 1 wants breadth and will over-collect. Pass 2 wants ruthlessness. Doing both at once produces a mediocre middle.

---

## Pass 0 — Ingest and classify

Read the whole source before extracting anything. Partial reads produce CLAUDE.md files weighted toward whatever was at the top.

**Normalize what needs it.** YouTube auto-captions arrive without punctuation, speaker labels, or paragraph breaks, and often mistranscribe proper nouns and technical terms. Fix sentence boundaries as you read; when a term looks garbled and the correct term is inferable from context, use the correct one and note the correction in `docs/SOURCES.md`. When it is not inferable, keep the garbled form and flag it rather than guessing a plausible-sounding tool name.

**Classify the source**, because it changes where the value is:

| Source type | Richest in | Watch for |
|---|---|---|
| Strategy conversation (Claude/ChatGPT) | Decision rules, rejected options, the user's own constraints | The user's stated preferences are context, not universal truth — label them |
| Tutorial / talk / YouTube | Procedure, worked examples, tool choices | Presenter's numbers are often undated and unsourced — tag them |
| Reference doc / spec | Constraints, vocabulary, edge cases | Mostly fails the behavior test; much of it belongs in `docs/` |
| Debate / interview / panel | Trade-offs, the strongest counter-argument | Do not flatten disagreement into false consensus — record both positions |
| Working notes | Idiosyncratic shorthand, half-formed rules | Ask before promoting an unfinished thought to a hard rule |

**Record the source date.** Every factual claim in the file inherits it. If the source has no date, say "undated" — do not guess.

---

## Pass 1 — Harvest into seven buckets

Sweep for candidates. Capture the claim and its location; do not polish yet.

1. **Objective** — what outcome is this body of work aiming at? Usually stated once, early or late, in one sentence. Often implicit; if so, infer it and mark it inferred.
2. **Decision rules and heuristics** — anything of the shape "when X, do Y", "always/never", "prefer A over B because C". The highest-value bucket. Includes rules stated in passing.
3. **Vocabulary** — terms used in a specific, non-obvious sense. Only capture a term if misreading it would change output. "Lead" used to mean *booked call* rather than *email capture* is worth capturing; "email" is not.
4. **Rejected approaches** — what was considered and dismissed, and the reason. Chronically under-extracted and disproportionately valuable: without it, a fresh agent confidently re-proposes the thing the user already killed, and the user has to re-litigate it every session.
5. **Constraints and non-negotiables** — budget, tooling, compliance, brand, time, capability limits. Distinguish hard constraints from strong preferences; if the source is ambiguous, record it as a preference and flag it.
6. **Working patterns** — reusable sequences, templates, frameworks, and at least one *worked* example. A pattern without an instance is an adjective.
7. **Volatile facts** — prices, metrics, benchmarks, version numbers, model names, platform behaviors, company/product claims. These decay. Collect them separately so they land in one dated, quarantined section rather than being sprinkled through the rules.

Over-collect. Pruning is cheap; re-reading a 40k-token transcript is not.

---

## Pass 2 — The behavior test

For each candidate, write the behavior change in one clause: *"Without this, the agent would ______."*

- **Concrete answer** → keep for CLAUDE.md.
- **No answer, but true and useful** → `docs/<topic>-reference.md`.
- **Neither** → drop, and log it.

Log the cuts with a one-line reason each, at **theme level** rather than per sentence — a cut list longer than the CLAUDE.md has defeated its own purpose. Mark each entry *cut* or *moved to docs/*; those mean very different things to a user checking your judgment. The full table goes in `docs/SOURCES.md`; the chat report gets the themes. This is the trust mechanism: distillation throws away most of the source, and the user cannot evaluate what they cannot see. A cut list also surfaces disagreement fast — if the user says "wait, that one mattered," you learn it in one exchange instead of after three sessions of degraded output.

Two traps at this pass:

- **The interesting-but-inert claim.** "The average B2B sales cycle is 84 days." Fascinating, changes nothing. Unless a rule keys off it, it goes to `docs/`.
- **The rule the model already follows.** "Write clear code." "Be accurate." If a competent agent does this unprompted, the line is pure cost. Cut it. The bar is: does this instruction *differ* from default behavior?

---

## Pass 3 — Convert to operative form

Rewrite each survivor as an instruction.

| Instead of | Write |
|---|---|
| "We talked about how outbound works better with a narrow ICP." | "Narrow the ICP before writing any outbound sequence. A sequence written for a broad list gets rewritten, so do this first, not after." |
| "The user prefers short emails." | "Cap outbound emails at 90 words. Longer drafts get cut, so write short rather than trimming later." |
| "Three channels were considered." | "Do not re-propose paid ads or cold calling — both were evaluated and rejected (paid: CAC exceeded LTV at current pricing; calling: no bandwidth). Propose them again only if pricing or headcount changes." |

Rules of thumb:

- **Trigger→action beats description.** The trigger tells the agent when the rule fires; without it, the agent applies the rule everywhere or nowhere.
- **Keep the "because" when it enables generalization.** A rule with its rationale survives contact with a case the source never anticipated. A bare imperative does not. But cut the rationale when it is just restated context — the test is whether an agent facing a novel case could reason from it.
- **Second person or imperative, present tense.** No "we," no "the conversation," no past tense.
- **One rule per line.** Compound rules hide their second half.
- **Do not manufacture certainty the source did not have.** If the source said "probably" or "we should test this," the rule says so: "Treat X as the working hypothesis, not a settled rule — it was untested as of the source date."

---

## Pass 4 — Provenance and volatility

Two mechanisms, both about graceful decay.

**Confidence marking.** Every non-obvious claim is one of:
- *From source* — stated in the material.
- *Inferred* — your synthesis, not stated. Mark it. The user needs to know which of their rules they never actually decided.
- *Unverified* — the source asserted it without support, and it is the kind of claim that is often wrong.

**Volatile-fact quarantine.** Prices, model names, versions, benchmarks, platform behaviors, and competitor claims go in one dated section near the bottom, headed with a verify-before-asserting instruction, with the date repeated inline on every entry. Rules that depend on a volatile fact reference the section rather than embedding the number, so that updating one number does not require auditing the whole file.

**Thresholds are not facts.** A word cap, a touch count, a team-size band is a constraint the user chose, not an observation about the world — it stays in the rules where it fires. Only measured or observed values get quarantined. Writing inline thresholds as words rather than digits keeps the two visually separate.

**Never invent.** No fabricated statistics, citations, URLs, tool names, or quotes. If the source was vague, the file says the source was vague. A confidently wrong number in persistent context poisons every session in that directory, silently, for as long as the file lives — this is the single most damaging failure this skill can produce.

---

## Pass 5 — Assemble

Fill the template (`assets/CLAUDE.md.template`, annotated in `references/claude-md-template.md`).

**Order is not cosmetic.** Start and end of a long context get more attention than the middle, and static-before-dynamic is what makes the prefix cacheable. So: identity and hard rules at the top, pointers and volatile facts at the bottom, and the single most important constraint restated in the closing line.

**Sections with nothing real in them get deleted, not filled with "N/A."** An empty section is a line item the model still reads.

**Write `docs/SOURCES.md`** — what the file was built from, each source's date, transcription corrections you made, and the cut list from pass 2.

---

## Pass 6 — Audit

```bash
python3 scripts/audit_claudemd.py <path-to-CLAUDE.md>
```

Deterministic checks beat re-reading your own draft — you already believe it is good, which is exactly why you will miss the README drift. Fix every FAIL. Judge WARNs individually and tell the user which you accepted and why.

Then the two checks a script cannot do:

1. **The fresh-agent test.** Read only the CLAUDE.md, as if you had never seen the source. Could you make the domain decisions it governs? If a rule is unintelligible without the transcript, it is missing its context — write the context in.
2. **The reversal test.** For each hard rule, ask whether a reasonable agent might have done the opposite by default. If not, the rule is not earning its tokens.

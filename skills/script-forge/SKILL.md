---
name: script-forge
description: "Evaluate source material (transcripts, articles, competitor videos, news) against your content strategy, voice system, and target audience fit. Three possible verdicts: REJECT (with reasons), CONDITIONAL (with requirements), or APPROVE AND PRODUCE (delivers a full teleprompter-ready script formatted for spoken on-camera delivery). Handles both long-form (8-12 min YouTube) and short-form (45-90 sec Shorts/Reels). Enforces your brand's voice/tone operating system (TOV OS) across stance, editorial guardrails, teleprompter delivery, and hooks/flow/retention. Also enforces RESTART-DISCIPLINE. Will refuse to produce scripts from source material that fails the evaluation gate. MANDATORY TRIGGERS: script forge, /script-forge, make a script from this, can I use this, evaluate this content, turn this into a video, script from transcript, script from article, would this work for my audience, reframe this, competitor reframe, write a script, teleprompter script, teleprompter formatting, /sf."
license: MIT
allowed-tools: Read, Write, Glob, Grep
metadata:
  version: "1.4.0"
  user-invocable: "true"
---
# Script Forge

## Editorial discipline gate (mandatory, run first)

Before producing or clearing any creator-facing content, run the brand-position test. If a prospect the creator has never met consumed the finished piece, would they think "they know their stuff and could solve a problem like mine," or "their own work is a mess, they almost shipped something bad, they are overwhelmed, they cannot finish what they start"? The first passes. The second fails: reframe the creator from the failure case to the observer, the teacher, or the diagnostician (observation, methodology, or industry-pattern reframe), or cut the piece.

The creator's personal working patterns are never content. They do not get reframed into vulnerability. They get left out.

Full diagnostic, reframe templates, and hard rules are in `references/editorial-discipline-gate.md`. The unified voice guide also holds the canonical voice and banned-word list. Where this skill's own voice list differs from the unified guide, the unified guide wins.

Evaluate source material and produce YouTube scripts. One skill, two formats. The evaluation gate is the hard part. The script is the output.

This skill will tell you NO when source material doesn't qualify. It will tell you what has to change when material is close. It will produce a full script when material is a fit. It is not a yes-man.

## Voice system: your TOV OS (canonical)

This skill writes in the creator's voice as defined by their **TOV OS (Tone of Voice operating system)**, the canonical voice authority. When the filesystem is available, load it before producing — the SSOT first, then the modules in causal order **A → B → C → D**:

`{PROJECT_ROOT}/content-command-center/docs/four-module-system/`
- `four-module-tov-os-ssot.md` — architecture, load order, global non-negotiables (read first)
- `module-a-global-tone-and-stance.md` — worldview, stance, say-the-unsaid (meaning)
- `module-b-brand-voice-and-editorial-guardrails.md` — brand framing, banned words/patterns, quality gates (craft)
- `module-c-teleprompter-and-human-delivery.md` — spoken rhythm, read-aloud, teleprompter scan (delivery)
- `module-d-hooks-flow-and-retention.md` — hook-as-gap, six-test hook gate, flow, ending loop (attention)

Priority when rules conflict: **A > B > C, with D subordinate to A and B and parallel to C.** Module B is the authority on voice and banned words; Module D is the authority on hooks and flow; Module C governs teleprompter delivery (it pairs with this skill's teleprompter-formatting reference); Module A governs stance and the truth that must be told. The bundled `references/voice-and-humor-rules.md` is the offline fallback only — where it and Module B differ, **Module B wins**. For any script that has to win a click and hold a viewer, Module D is not optional.

## Table of Contents

1. [Workflow](#workflow)
2. [Phase 1: Evaluation Gate](#phase-1-evaluation-gate)
3. [Phase 2: Reframe](#phase-2-reframe)
4. [Phase 3: Produce](#phase-3-produce)
5. [Quality Gate](#quality-gate)
6. [Output Format](#output-format)
7. [Reference Files](#reference-files)

---

## Workflow

Provide source material (transcript, article, competitor video, news, raw idea) and optionally specify long-form or short-form.

```
PHASE 1: EVALUATE    → Does this qualify for your content?
PHASE 2: REFRAME     → Transform source into your brand's angle (if Phase 1 passes)
PHASE 3: PRODUCE     → Write teleprompter-ready script
```

Phase 1 is the gate. Most source material fails here. That is correct behavior.

---

## Phase 1: Evaluation Gate

Read the source material completely. Answer seven questions. Each requires YES to proceed.

### Q1: Does this teach your target audience something they can DO?

Define your ideal viewer. They are likely a pragmatic professional skeptical of hype who respects specific, evidence-based advice without performance.

**The Monday Test:** After watching, what specific thing can your viewer do Monday they couldn't do Friday? If the answer is a way of THINKING not DOING, it's a concept lecture. REJECT unless reframeable around a method.

### Q2: Is the topic saturated?

Check against known saturated clusters and your content asset map when filesystem is available. Read [`references/saturated-clusters.md`](references/saturated-clusters.md) for the current list.

If the topic overlaps with existing content, it needs a genuinely novel mechanism. "Same insight, different angle" is not enough.

### Q3: Can it source from a named origination stream?

Every piece traces to one of seven streams (A-G). If it can't be tagged, it's not ready.

- **A** — Pain Point Insight (max 30% of any batch)
- **B** — Recent Engagement (max 1/quarter)
- **C** — Industry Release
- **D** — Reader/Community Question
- **E** — Counter-Intuitive Data
- **F** — Direct Rebuttal
- **G** — Cross-Domain Transfer

Competitor content is almost always Stream F or D.

### Q4: Does your version add something the source didn't?

The version must do at least one of: reframe for your target audience's perspective, add the actionable method the original left out, apply operational specificity the original lacked, or take a position the original hedged on.

If you would say the same thing the same way, REJECT.

### Q5: Does it pass the anti-pattern scan?

Read [`references/anti-patterns.md`](references/anti-patterns.md) for the full eight patterns. One match is a flag. Two or more is REJECT.

### Q6: Is there a screen share build moment?

Long-form: FRAMEWORK needs a live build on screen. If the best visual is a conceptual diagram, the method may not be concrete enough.

Short-form: no screen share required, but tangible takeaway must be a specific action.

### Q7: Can the humor be earned?

Humor is not mandatory. But if the topic is prime territory and the script would end up humorless, note the missed opportunity.

Read [`references/voice-and-humor-rules.md`](references/voice-and-humor-rules.md) for the six compatible mechanics and their density bands.

### Verdicts

**REJECT:** State which questions failed. Be specific. If salvageable with a different approach, say so. Do not soften.

**CONDITIONAL:** List every requirement. Common conditions: "needs an actionable method," "overlaps existing piece, only this angle justifies it," "works as short but not long-form."

**APPROVE:** Proceed to Phase 2.

---

## Phase 2: Reframe

Complete before writing the script.

1. **Audience cluster:** define the viewer segment (e.g., skeptical practitioner, aspiring operator, capability-gap buyer)
2. **Origination stream:** Tag to A-G
3. **Your brand angle:** One sentence. Must contain a verb (what the viewer DOES).
4. **Hook archetype:** Micro-Story, Diagnostic, Counterintuitive, or Specific Number
5. **Format:** Multi-step method with 3+ components → long-form. Single insight/mechanism → short-form. Recommend with reasoning if ambiguous.
6. **CTA / lead magnet:** Load your CTA architecture doc before choosing any CTA. Use only your official tool inventory. If no official tool naturally fits, set `cta: no`. Never invent a lead-magnet name, never route to a community platform as the primary CTA, and never use bare site links in written first comments or descriptions.
7. **Metaphor check:** Verify not on cooldown list in [`references/saturated-clusters.md`](references/saturated-clusters.md).

If competitor source material, run the Competitor Reframe Protocol in [`references/competitor-reframe.md`](references/competitor-reframe.md).

Present reframe for approval. If the creator says "just produce it," skip approval.

---

## Phase 3: Produce

### Load governance documents (when filesystem available)

Primary — your **TOV OS** (load the SSOT first, then Modules A → B → C → D in that order; full list in "Voice system" above):

```
{PROJECT_ROOT}/content-command-center/docs/four-module-system/
  → four-module-tov-os-ssot.md
  → module-a-global-tone-and-stance.md
  → module-b-brand-voice-and-editorial-guardrails.md
  → module-c-teleprompter-and-human-delivery.md
  → module-d-hooks-flow-and-retention.md
```

Module D is mandatory for any long-form or short-form script (it owns the hook and the flow). If the four-module files are unreachable, fall back to [`references/voice-and-humor-rules.md`](references/voice-and-humor-rules.md) (inline rules always enforced, subordinate to Module B).

### Batch production discipline

When asked for multiple Script Forge packages, produce files in a dated content batch workspace rather than filling chat with long scripts. Use the creation date in the top-level folder: `content-batch_MMDDYY/`. Group every asset for one title under `{title-slug}_MMDDYY/`. Do not scatter one title across multiple format folders.

For each idea, create the requested long-form script, short-form script, and LinkedIn post, then add a recording checklist for every long-form recording package unless explicitly told not to. Write a batch run report that lists file paths, verification results, and any external stats added with sources.

Parallel drafting by idea is acceptable for large batches, but the parent session must verify the created files directly. Subagent summaries are not final QA. Run the mechanical scan before reporting done: file presence, zero em dashes, zero semicolons, zero exclamation marks, zero `[FILL]` placeholders in finished content, and zero Tier 1 banned-word hits. See [`references/batch-production.md`](references/batch-production.md).

### CTA and attribution docs

For any CTA decision, load and obey your canonical CTA architecture document. The tool-first principle: the primary CTA, when one appears, routes to a specific tool on your site, the tool delivers full value with no email gate, and email is captured on the tool page afterward. The default is no CTA — add one only when the piece naturally connects to an official tool (roughly 1 in 3-4). Common failures to avoid: invented lead magnets, community-platform-first routing, bare site links, and free-text CTA frontmatter.

### Script structure

Read [`references/script-structures.md`](references/script-structures.md) for the full long-form and short-form templates with section timings, word counts, and delivery notes.

**Long-form summary:** HOOK (0:00-0:30) → CONTEXT (0:30-2:00) → FRAMEWORK (2:00-8:00, 50-60%) → WTODN (8:00-10:00) → CLOSE (10:00-11:00). 1800-2700 words. 3-5 humor moves.

**Short-form summary:** HOOK (0:00-0:08) → EVIDENCE (0:08-0:55) → TANGIBLE TAKEAWAY (0:55-1:15) → CLOSE (1-2 sentences). 110-220 words. 1-2 humor moves. Kallaway hook + Stevenson takeaway.

### Teleprompter formatting

The script body must read cleanly off a scrolling teleprompter, not just on a page. Read [`references/teleprompter-formatting.md`](references/teleprompter-formatting.md) and apply it while writing: one idea per line, breaks at natural breath points, a blank line between beats, numbers spelled as words, and hard names given a one-time pronunciation note. This layers on top of the annotated script, it does not replace it. The annotations stay. The spoken lines between them follow the teleprompter discipline.

---

## Quality Gate

Run silently before delivering ANY script:

- [ ] Zero em-dashes, semicolons, exclamation marks
- [ ] Zero Tier 1 banned words
- [ ] Zero Tier 2 banned words (scan every word against the list in references)
- [ ] Zero banned AI-tell phrases
- [ ] No tricolon patterns (verify every list)
- [ ] Max one "It's not X. It's Y." per script
- [ ] Sections uneven (FRAMEWORK 50-60% for long-form)
- [ ] Reader-as-subject 80%+ in teaching sections
- [ ] Every humor move annotated and earned
- [ ] Monday Test passes
- [ ] WTODN: first move + time + success criterion (long-form)
- [ ] Tangible takeaway has homework (short-form)
- [ ] No exhausted metaphors
- [ ] Hook has curiosity gap
- [ ] No fake specificity
- [ ] Pub test passes
- [ ] Script sounds like the creator, not a content marketer or AI
- [ ] Teleprompter format: one idea per line, breaks at natural breath points, white space between beats
- [ ] Sentence length varies (short punches mixed with longer flowing sentences, capped ~30 words), not uniform staccato
- [ ] Ideas linked with tension connectives (but, so, therefore), not flat "and then" sequence
- [ ] Numbers spelled as words, hard names given a one-time pronunciation note
- [ ] Read-aloud pass done: every line says cleanly on one breath, no written-sounding lines
- [ ] Module A: says the unsaid, supplies missing context, creates contact (not a topic recital)
- [ ] Module B: brand position protected (creator never the failure seat), zero banned words/patterns
- [ ] Module C: survives read-aloud — one idea per sentence, talks to a person, scans on teleprompter
- [ ] Module D: hook is a gap not a topic, passes the six-test hook gate, payoff front-loaded, ending opens the next loop

Fix failures before delivering. Do not deliver scripts with known violations.

---

## Output Format

### Approved scripts

Deliver as markdown containing:
1. YAML metadata (title, format, stream, cluster, PPs, hook archetype, humor mechanics, monday_test, wtodn, lead_magnet)
2. Full annotated script with section labels, delivery notes `[DELIVERY:]`, humor annotations `[HUMOR: Mechanic — reason]`, screen share markers `[SCREEN SHARE]` / `[CAMERA]`
3. YouTube title options (3 variants)
4. YouTube description with chapter timestamps
5. Screen share slide prompt (long-form only) for youtube-screen-share-forge
6. Lead magnet brief (format + contents, 3-4 sentences)
7. On request ("give me the prompter version"), a stripped teleprompter-ready file: spoken lines only, every annotation and label removed, one idea per line, paste-ready into a teleprompter app. Follow the prompter-ready section of [`references/teleprompter-formatting.md`](references/teleprompter-formatting.md).

### Rejections

```
VERDICT: REJECT
SOURCE: [title/description]
REASON: [which questions failed, specifically]
SALVAGEABLE: [yes/no]
REFRAME DIRECTION: [if salvageable]
```

### Conditional approvals

```
VERDICT: CONDITIONAL
SOURCE: [title/description]
REQUIREMENTS:
1. [specific change]
2. [specific change]
REFRAME DIRECTION: [angle if requirements met]
FORMAT RECOMMENDATION: [long/short + reasoning]
```

---

## Reference Files

| File | Purpose | When to read |
|------|---------|-------------|
| [`references/editorial-discipline-gate.md`](references/editorial-discipline-gate.md) | Brand-position test, failure-seat reframe templates, hard rules on what is never content | Before producing or clearing any creator-facing content (the editorial gate, run first) |
| [`references/voice-and-humor-rules.md`](references/voice-and-humor-rules.md) | Tier 1/2 banned words, banned phrases, structural tells, punctuation rules, humor mechanics, density bands | Before producing any script |
| [`references/batch-production.md`](references/batch-production.md) | Multi-idea Script Forge batch workflow, file output discipline, run reports, parent-session verification, recording checklists | When asked for multiple ideas/packages in one run |
| [`references/anti-patterns.md`](references/anti-patterns.md) | Eight anti-patterns with detection criteria | During Phase 1, Q5 |
| [`references/saturated-clusters.md`](references/saturated-clusters.md) | Known saturated topics, exhausted metaphors with cooldown dates | During Phase 1, Q2 and Phase 2 metaphor check |
| [`references/script-structures.md`](references/script-structures.md) | Full long-form and short-form templates with timings, word counts, delivery notes | During Phase 3 production |
| [`references/competitor-reframe.md`](references/competitor-reframe.md) | 5-step protocol for reframing competitor content | During Phase 2 when source is competitor material |
| [`references/calibration-patterns.md`](references/calibration-patterns.md) | Named failure modes from production experience | When output quality feels off |
| [`references/teleprompter-formatting.md`](references/teleprompter-formatting.md) | Spoken-language line formatting, cue legend, read-aloud rules, prompter-ready output | During Phase 3 production and the read-aloud quality check |

Read the appropriate reference file when needed. Do not read all references on every invocation.

---

*Script Forge v1.4 — aligned to the Four-Module TOV OS*
*Enforces: TOV OS (A stance · B editorial guardrails · C teleprompter delivery · D hooks/flow/retention), RESTART-DISCIPLINE*
*Companion skills: youtube-screen-share-forge (slides), lead-attribution-cta (CTA + attribution), buyer-facing-content-check (pre-publish gate)*
*v1.1 changes: Added teleprompter-formatting reference and wired it into Phase 3, the Quality Gate, and an optional prompter-ready output. Spoken-language line discipline now enforced on every script.*
*v1.2 changes: Added sentence-rhythm rules to teleprompter-formatting (vary length, cap ~30 words, but/therefore tension connectives) after a uniform-staccato failure. Quality gate now checks for sentence variation, not just short lines.*
*v1.3 changes: Repointed the voice authority to the Four-Module TOV OS (SSOT → A → B → C → D), made Module B the banned-word authority and Module D the hook/flow authority, and added a four-layer (A/B/C/D) check to the Quality Gate. Module C now pairs with the teleprompter-formatting reference.*
*v1.4 changes: Converged the forks onto one superset — folded the editorial-discipline gate (brand-position test, failure-seat reframe, never-content rules) and its reference in alongside the teleprompter-formatting, batch-production, and CTA/attribution wiring. Repointed the CTA close to the active tool-first architecture and fixed the CTA doc path. Generalized for any creator/brand.*

---
name: claude-md-forge
description: "Turn source material — a Claude or ChatGPT conversation, a YouTube or podcast transcript, a strategy doc, notes — into a topic-specific agent context file (CLAUDE.md for Claude Code, AGENTS.md for Codex CLI and Cursor, or AGENTS.md plus a thin CLAUDE.md shim for a shared repo), so every future session in that directory operates with the strategy, tactics, vocabulary, and rejected paths from that source. Distills rather than summarizes: keeps only what changes agent behavior, pushes depth to docs/, refuses to produce README-style documentation. MANDATORY TRIGGERS: CLAUDE.md, AGENTS.md, agents md, claude md, turn this transcript into a CLAUDE.md, make an AGENTS.md from this conversation, convert this chat into project context, capture this session's knowledge, topic CLAUDE.md, domain context file, persistent context from transcript, YouTube transcript to CLAUDE.md, seed a project with this knowledge, agent memory from this conversation, claude-md-forge."
license: MIT
---

# CLAUDE.md Forge

Convert unstructured source material into a **behavioral contract** that loads into every Claude Code session opened in a directory.

## The one idea that governs everything here

A CLAUDE.md is not documentation. It is persistent context that gets prepended to every session, and every line in it competes for the model's attention against the user's actual request. So the test for inclusion is never "is this true?" or "is this interesting?" — it is:

> **If the agent did not know this, what would it do differently?**

If there is no concrete answer, the line does not belong in CLAUDE.md. It belongs in `docs/`, or nowhere.

This is why summarizing a transcript produces a bad CLAUDE.md and distilling one produces a good one. A summary preserves *what was said*. A CLAUDE.md preserves *what to do*. Those are different documents, and the gap between them is where this skill does its work.

## What "wrong" looks like

Three failure modes, in descending order of how often they happen:

1. **The README.** Sections for installation, badges, license, contribution guidelines, changelog, contact info. Every line is accurate and none of it changes a single agent decision. This is the default failure — the word "markdown file in a repo" pulls hard toward README conventions. Resist it. See `references/anti-patterns.md`.
2. **The transcript summary.** "In this conversation we explored three approaches to lead generation..." Narrative, past tense, describing a discussion instead of instructing an agent. The tell is the word "we."
3. **The paste.** The whole 40,000-token transcript reformatted with headers. Blows the context budget, buries the operative rules in the middle where attention is weakest, and makes every future session in that directory more expensive and less accurate.

## Procedure

Read `references/extraction-passes.md` before starting — it holds the full pass-by-pass procedure. The short version:

**0 — Ingest and classify.** Read the source. Identify its type, because extraction emphasis differs: a *strategy conversation* is rich in decision rules and rejected options; a *tutorial or talk* is rich in procedure and worked examples; a *reference doc* is rich in constraints and vocabulary; a *debate or interview* is rich in trade-offs and disagreement. Note the source's date — you will need it for the provenance footer, and any factual claim inherits it.

**1 — Harvest.** Sweep the source for candidates into seven buckets: objective/outcome, decision rules and heuristics, vocabulary, rejected approaches, constraints and non-negotiables, working patterns with worked examples, volatile facts. Over-collect here; you prune next. Do not paraphrase yet — capture the claim and where it came from.

**2 — Apply the behavior test.** For each candidate, name the behavior change in one clause. Candidates that survive become CLAUDE.md lines. Candidates that fail but are still true and useful go to `docs/`. Candidates that are neither get dropped, and you log them. The log matters: the user needs to see what you cut to trust what you kept.

**3 — Convert to operative form.** Rewrite every survivor as an instruction, not an observation. Prefer trigger→action shape: "When the prospect has fewer than 20 employees, lead with the audit offer, not the retainer." Keep the *reason* attached when the reason is what lets the agent generalize to cases the source never covered — a rule without its rationale breaks the first time reality differs slightly from the transcript.

**4 — Tag provenance and volatility.** Anything the source asserted as fact — a price, a metric, a tool name, a platform behavior, a benchmark — carries the source's date and a verify-before-asserting note. This is what makes the file degrade gracefully instead of silently going stale six months from now. Never invent a number, a citation, or a name that was not in the source; if the source was vague, say the source was vague.

**5 — Assemble.** Fill `assets/CLAUDE.md.template` (annotated in `references/claude-md-template.md`). Order matters: identity and hard rules first, pointers and volatile facts last. The top of the file gets the most attention and is the most cacheable; the bottom is where churn belongs.

**6 — Audit.** Run the bundled script — it catches the failure modes mechanically, which is more reliable than re-reading your own draft:

```bash
python3 scripts/audit_claudemd.py <path-to-CLAUDE.md-or-AGENTS.md>
```

Fix every FAIL. Judge each WARN on its merits and say in your handoff which warnings you accepted and why. The blank skeleton fails this audit by construction — its bracketed prompts are on the placeholder list — so a first run full of placeholder FAILs means the template is not filled in yet, not that the script is broken.

## Output

Write these into the target directory (create it if the user named a new one):

```
<project-dir>/
├── CLAUDE.md / AGENTS.md        the behavioral contract — the deliverable (see "Which file to write")
├── docs/
│   ├── <topic>-reference.md     depth that failed the behavior test but is worth keeping
│   └── SOURCES.md               sources with dates, transcription fixes, and the cut list
└── (report to the user in chat, not as a file)
```

`<topic>` is a short kebab-case slug for the domain the CLAUDE.md governs — `lead-gen`, `pricing`, `outbound`. Derive it from the subject matter, not the source filename. One reference file per genuinely separate domain; if a source covers three unrelated topics, that is usually three CLAUDE.md files in three directories, and you should say so rather than blending them.

The chat report is short: what the CLAUDE.md now makes the agent do differently, a theme-level summary of what you cut, what you could not verify, and any judgment call the user might reverse. The item-level cut list lives in `docs/SOURCES.md` — the chat gets the themes, the file gets the detail. Log cuts at theme level, not per sentence; a cut list longer than the CLAUDE.md has defeated its own purpose. Mark each entry as *cut* or *moved to docs/* — "cut" and "relocated" mean very different things to a user checking your judgment.

## Which file to write

The distillation is identical regardless of filename — what changes is which tool will read the result. Decide this before pass 5, because it also decides whether you write one file or two.

| Tool | Reads | Does not read |
|---|---|---|
| Claude Code | `CLAUDE.md` | `AGENTS.md` — it must be pulled in via an `@AGENTS.md` import line or a symlink |
| Codex CLI | `AGENTS.md` | `CLAUDE.md` |
| Cursor | `AGENTS.md` (nested files included) | — |

*Verified July 2026. Claude Code's lack of native AGENTS.md support is a long-standing open request rather than an oversight, so re-check it before asserting; the rest of this table is stable.*

**Choose by who opens the directory:**

- **Claude Code only** → write `CLAUDE.md`. Simplest, no shim.
- **Codex or Cursor only** → write `AGENTS.md`. Same content, same structure, different name.
- **More than one, or you don't know** → write `AGENTS.md` as the single source of truth, plus a `CLAUDE.md` containing one import line and nothing else:

  ```markdown
  @AGENTS.md
  ```

  Two files, one source of truth, no drift. Anything genuinely Claude-specific goes in `CLAUDE.md` *below* the import, where it overrides — but if you find yourself writing much there, the rule probably was not Claude-specific after all.

**Do not write a `SOUL.md`.** Where that convention exists it holds identity, judgment posture, and communication standards — who the agent is. This skill distills domain knowledge — what the agent should know about a subject. Putting extracted tactics into a SOUL.md mixes two layers that are deliberately separate, and the mixing is not reversible once a later session reads them as one. If the source is genuinely about how an agent should behave rather than what it should know, say so and stop; that is a different artifact.

If the user did not say which tool, look at the directory: an existing `AGENTS.md`, `CLAUDE.md`, `.cursor/`, or `.codex/` answers it. If the directory is empty and they did not say, ask — it is one question and the wrong guess means the file is invisible to the tool they actually use.


## Sizing

Budget in **tokens, not lines** — lines reward padding, since the same content reflowed into more bullets looks bigger without gaining a word. Target **1,500–4,000 tokens** for the CLAUDE.md (the audit script reports this). Below ~800 tokens from a substantial source usually means you dropped operative content; above ~5,000 you are summarizing, not distilling — go back to pass 2 and be harder about the behavior test.

A dense short source that honestly yields 1,200 tokens should ship at 1,200 tokens. Never pad toward the target.

There is no capacity crisis here: current frontier models hold hundreds of simultaneous constraints reliably. The budget exists because of cost, coherence, and human readability — a file the user will not re-read is a file they will not maintain. Prune for those reasons, not because the model "can't handle it."

When a topic genuinely needs more than ~5,000 tokens of operative rules, that is a signal the material should become a **skill** with progressive disclosure rather than a CLAUDE.md that loads in full on every turn. Say so and offer it.

## Judgment calls worth making explicitly

- **Thin sources.** If the source yields fewer than five real decision rules, do not pad the file to look substantial. Produce the short honest version and tell the user the source was thin — a 40-line CLAUDE.md that is all signal beats a 200-line one that is mostly restated context.
- **Contradictions.** Long conversations change their mind. When the source contradicts itself, the later position wins and becomes the rule; the earlier position goes in "Rejected" with a note that the position moved. Do both — the Rejected entry is what stops an agent re-proposing it, and a rule that silently drops its own history invites the user to "fix" it back.
- **Decision thresholds are not volatile facts.** A ninety-word cap, a three-touch limit, a fifteen-to-forty-employee band are constraints the user chose; they stay inline in the rules. Measured or observed values — prices, reply rates, spend, tool versions — are volatile and get quarantined. Spelling inline thresholds as words rather than digits keeps them visually distinct and keeps the audit from flagging them.
- **User-specific vs. general.** A conversation about *the user's* lead generation contains both universal method and facts about their particular business. Both belong, but keep them in separate sections; the method is portable to another project and the specifics are not.
- **Existing CLAUDE.md.** If the target directory already has one, do not overwrite. Read it, write the merged draft to `<project-dir>/CLAUDE.md.merged`, show the user a diff against the current file, and only then replace and delete the staging copy.

## Reference files

| File | Read when |
|------|-----------|
| `references/extraction-passes.md` | Before every run — full procedure for passes 0–5 |
| `references/claude-md-template.md` | During pass 5 — annotated section-by-section template |
| `references/anti-patterns.md` | When unsure whether a line belongs, or when the source is documentation-shaped |
| `references/worked-example.md` | Before your first run, or when a draft feels like a summary — a full distilled CLAUDE.md with the moves annotated |
| `assets/CLAUDE.md.template` | Copy as the starting skeleton |
| `scripts/audit_claudemd.py` | Pass 6 — deterministic verification |

## Boundaries

This skill distills existing source material into persistent context. It does not scaffold new projects from scratch (that is `cc-project-architect`), refresh stale docs against current reality (`project-doc-refresh`), or produce human-facing guides from transcripts (`transcript-superguide`). If the user wants a readable article out of the transcript, they want one of those — say so rather than producing a CLAUDE.md that tries to be both.

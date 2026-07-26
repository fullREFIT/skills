# Anti-patterns

Read this when a line feels borderline, or when the source material is documentation-shaped and pulling the output toward documentation.

---

## The README trap

This is the dominant failure mode, and it is seductive because every section it produces is *accurate*. Markdown file, lives in a repo, describes a project — every convention the model has absorbed says README. But a README addresses a human deciding whether to use a project. A CLAUDE.md addresses an agent about to do work. They share a file extension and nothing else.

The following commonly appear in "CLAUDE.md best practice" lists. They belong in README.md, and in a CLAUDE.md they are pure cost:

| Section | Why it does not belong |
|---|---|
| Badges (CI, license, version) | Rendered images for humans browsing a repo host. Zero behavioral effect. |
| Installation / setup steps | Belongs in README or a script. If the agent must run setup, that is one line in a rules section, not a guide. |
| Project metadata (author, version, license) | Identity for humans and package managers. Changes no agent decision. |
| Contribution guidelines, PR process, code of conduct | Governs human contributors. |
| Contact / support channels | The agent cannot open a Slack channel or file a support ticket. |
| Changelog / release history | Historical narrative. If a past change constrains present work, state the *constraint*, not the history. |
| License compliance statements | Legal text for humans. If a license restricts what the agent may generate, that is a one-line hard constraint. |
| Architecture diagrams for their own sake | Include only when the agent must navigate the structure to work. A diagram nobody acts on is decoration. |
| Testing instructions, generic | "Run `npm test` before proposing a PR" is a rule. A test-suite tour is documentation. |
| FAQ / troubleshooting, generic | Move to `docs/` and point at it. Inline it only for failures the agent will actually hit. |

Some of these have a legitimate one-line form. "All generated code must be MIT-compatible; do not vendor GPL dependencies" is a hard constraint that changes output. "This project is MIT licensed" is not. The difference is whether it constrains a decision.

**When the source material is itself a README-style document,** the extraction job is harder, not different: hunt for the constraints and conventions buried in prose and discard the rest. Most of a README yields nothing. That is a fine outcome — say so rather than padding.

---

## The transcript summary

Narrative, past tense, first person plural. "We explored three approaches..." "The conversation covered..." "It was decided that..."

The tell is **"we."** A CLAUDE.md has no "we" — the conversation that produced it is not present in the session that reads it. Rewrite every such line as an instruction or cut it.

Related: **chronology as structure.** Organizing the file by the order topics came up in the source. The agent needs rules organized by when they fire, not by when they were discussed.

---

## The paste

Reformatting the whole source with headers. Symptoms: over 400 lines, long verbatim quotes, section headings that mirror the source's structure, operative rules buried mid-file where attention is weakest.

Cost is not theoretical: this file loads on every turn in that directory, forever, competing with the user's actual request for attention and money.

---

## Rules the model already follows

"Write clean code." "Be accurate." "Consider the user's needs." "Use best practices." A competent agent does these unprompted. Including them adds cost and dilutes the rules that *do* differ from default behavior.

The test: **would a good agent plausibly do the opposite by default?** If not, cut it.

---

## Vibes instead of criteria

"High quality output." "Professional tone." "Make it compelling." None of these can be checked, so none of them can be violated, so none of them changes behavior.

Replace with something an independent observer could verify: "Every claim about client results names a specific engagement." "Emails cap at 90 words." "No adjective appears twice in a headline."

---

## Unmarked inference

You inferred a rule the source never stated, and wrote it with the same confidence as a rule the source did state. Now the user has a decision in persistent context that they never made and cannot distinguish from ones they did.

Mark inference. It costs three words.

---

## Fabricated specifics

Invented statistics, prices, tool names, URLs, citations, or quotes — usually generated to make a section feel complete. In persistent context this is the worst possible failure: it silently poisons every future session in that directory, and the user has no reason to suspect a file they asked for.

If the source was vague, the file says the source was vague.

---

## Undated volatile facts

A price, model name, version, or benchmark stated as timeless truth. It was true on the source's date. Six months on it is confidently wrong and nothing in the file signals that. Date it, quarantine it, and instruct verification.

---

## Contradiction with itself

Long conversations change their mind, and an extraction that harvests both positions without noticing produces a file that instructs the agent two ways. The agent resolves it silently and unpredictably.

When positions moved, do both: the later position becomes the rule, and the earlier position gets a "Rejected" entry noting that the position moved. The Rejected entry is what stops the agent re-proposing it; the rule alone does not.

---

## Everything as a hard rule

If all fifteen rules are MUST, the model has no priority ordering and improvises one. Reserve hard constraints for what genuinely blocks action; everything else is a preference and is labeled as one. Fewer absolutes are followed more reliably than many.

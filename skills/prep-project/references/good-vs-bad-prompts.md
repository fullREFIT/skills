# Good vs Bad Task Prompts

Both Cowork and the Claude Code task orchestrator execute task prompts literally. Vague prompts produce wrong output or trigger approval-request fallback behavior. These examples calibrate quality for both targets — the principles are identical regardless of which executor runs the task.

The same vague-language ban applies in both: never use "appropriate", "as needed", "compelling", "relevant", "suitable", "engaging", "make it good", "polish it", "clean it up", "handle edge cases".

---

---

## BAD: Delegating Creative Decisions to Cowork

```
Write a LinkedIn post about AI adoption for small businesses.
Make it engaging and on-brand.
```

**Problems:**
- What specific angle on AI adoption?
- What does "engaging" mean?
- What does "on-brand" mean? Which brand rules?
- No word count. No structure. No CTA.
- No output path.
- Cowork will produce generic content.

---

## GOOD: Specific Content With All Decisions Made

```
Write a LinkedIn post targeting CEOs/COOs at $1M-$10M companies
(10-30 employees) about the cost of uncoordinated AI tool usage.

Angle: Teams where everyone uses different AI tools differently
waste more time than teams using no AI at all, because they create
inconsistent outputs that need manual reconciliation.

Structure:
- Hook (1 sentence): Start with a counterintuitive claim —
  "Your team's AI tools might be making them slower."
- Problem (2-3 sentences): Describe the symptom — different people
  using different tools producing incompatible outputs.
- Insight (2-3 sentences): The cost isn't the tool subscriptions.
  It's the reconciliation time and the inconsistency in customer-
  facing work.
- Pivot (1-2 sentences): What coordinated AI usage looks like —
  same tools, configured for specific roles, with shared standards.
- CTA (1 sentence): Question that invites comment. "How does your
  team decide which AI tools to use for what?"

Length: 150-200 words.
Tone: Direct, no filler, practitioner-level. Written as someone
who has seen this problem repeatedly in real companies, not as
someone selling a solution.
No emojis. No hashtags in the body (add 3-5 hashtags after a
line break at the end).
No banned words: transform, revolutionize, unlock, empower,
seamless, game-changer, leverage, synergy, paradigm.

Output: [project-root]/output/cowork/
content-batch/linkedin-post-uncoordinated-ai.md

Acceptance criteria:
- Post is 150-200 words (excluding hashtags)
- Opens with counterintuitive hook
- No banned words
- No emojis
- Ends with a question
- 3-5 hashtags after line break at end
```

**Why it works:**
- Every creative decision is made in the prompt
- Tone is described with specific behaviors, not adjectives
- Structure is explicit with sentence counts
- Brand rules are inline
- Output path is exact
- Acceptance criteria are countable/verifiable

---

## BAD: Research Without Scope

```
Research competitors in the fractional AI consulting space
and write a competitive analysis.
```

**Problems:**
- How many competitors? Which ones?
- What dimensions to compare?
- How deep? Surface scan or detailed breakdown?
- What format? Table? Narrative? Scored rubric?
- No output path. No acceptance criteria.

---

## GOOD: Scoped Research With Defined Output

```
Research these 5 companies and produce a competitive comparison:

1. Sagan AI (saganai.com)
2. AI Business Solutions (aibusinesssolutions.com)
3. Thrive AI (thriveai.co)
4. DataDriven AI Consulting (datadrivenai.com)
5. Fractional AI (fractionalai.com)

For each company, find:
- Pricing model (retainer, project, hourly — and price range if public)
- Target company size (startup, SMB, mid-market, enterprise)
- Services offered (list the top 3-5)
- Positioning statement (how they describe themselves on homepage)
- Differentiation claim (what they say makes them different)
- Content presence (blog frequency, YouTube, LinkedIn activity level)

Output format: Markdown table with one row per company, columns
matching the fields above. Follow with a 200-word narrative
summary identifying the positioning gap your company occupies
(describe your differentiation in one clause).

Source: Use each company's website. If pricing is not public,
note "Not published."

Output: [project-root]/output/cowork/
competitive-analysis/competitor-comparison.md

Acceptance criteria:
- All 5 companies included
- All 6 fields populated for each (or marked "Not published" / "Not found")
- Summary is 150-250 words
- Summary specifically names the positioning gap
- File saved at specified path
```

---

## BAD: Document With Placeholder Content

```
Create an onboarding guide for new clients. Include sections
about what to expect, timeline, and deliverables. Make it
comprehensive.
```

**Problems:**
- What IS the onboarding process? Cowork doesn't know.
- What timeline? What deliverables?
- "Comprehensive" is not a length.
- No source material referenced.

---

## GOOD: Document With All Content Provided

```
Create a client onboarding document for Acme Consulting's AI Audit
engagement.

Source material: Read the product description at
[project-root]/products/ai-audit/product-spec.md

Document structure:

## Welcome
"Thank you for choosing Acme Consulting for your AI Audit.
This document outlines exactly what happens over the next 5
business days, what we need from you, and what you will receive."

## What You Will Receive
List these 5 deliverables (1 sentence description each):
1. Current-state audit of all AI tool usage across your team
2. Process mapping of your top 5 most time-consuming workflows
3. Gap analysis identifying specific automation opportunities
4. Implementation roadmap with 30/60/90-day milestones
5. Team capability assessment with role-specific training
   recommendations

## Timeline
Day 1: Kickoff call (45 min) — we walk through your current
  tools, team structure, and pain points
Day 2-3: Lead consultant conducts async audit — reviews tools, interviews
  2-3 team members (15 min each), maps workflows
Day 4: Draft delivery — you receive the full report for review
Day 5: Final presentation (60 min) — walkthrough of findings,
  Q&A, prioritized next steps

## What We Need From You
- Access to your current tool stack (logins or screen shares)
- 45 minutes for the kickoff call
- 2-3 team members available for 15-minute interviews
- A list of your top 5 pain points before the kickoff call

## Contact
Your Name — your@email.com
Schedule: calendly.com/yourname

Format: Clean markdown. No emojis. Outfit font reference in a
comment at top (for later HTML conversion). Sections use H2.
Length: The document should be exactly these sections, no more.

Output: [project-root]/output/cowork/
onboarding/ai-audit-onboarding.md

Acceptance criteria:
- All 5 sections present with H2 headings
- All 5 deliverables listed
- All 5 days in timeline with descriptions
- Contact info correct (your@email.com, calendly link)
- No emojis
- No banned words
- File exists at output path
```

---

## BAD: Referencing Files Without Paths

```
Use the brand guidelines and ICA document to write messaging
for the new offer.
```

**Problems:**
- Which brand guidelines file? Full path needed.
- Which ICA version? Full path needed.
- What offer? What messaging format?
- Cowork has no session memory.

---

## GOOD: Full Paths and Inline Context

```
Read these source files:
- Brand messaging: [project-root]/strategy/
  brand-messaging-framework-v1.1.md
- Audience profile: [project-root]/strategy/
  audience-profile-v3.1.md (focus on Symptom Cluster A: Sales-Blind
  Leader section)

Using the Cluster A pain points and the hook formulas from the
brand messaging framework, write 5 email subject lines for a
cold outreach sequence targeting CEOs who have no visibility
into their sales conversations.

{...specific requirements continue...}
```

---

## The Rule

If Cowork needs to DECIDE something creative, strategic, or
subjective to complete the task, the prompt is too vague.
Decisions belong in the spec. Cowork executes decisions — it
does not make them.

Exception: Research tasks where Cowork is explicitly told to
analyze, evaluate, score, or recommend based on defined criteria.
In those cases, the criteria are the decision framework — Cowork
applies them, it doesn't invent them.

# Extract Claims Script

A prompt-as-script you can use internally during Phase 1 to systematically surface every classifiable claim in a document. Not user-facing — use it as a mental checklist.

This is NOT a bash script. It's a structured extraction prompt. Use it when a document is long and you risk missing items.

---

## The extraction pass

Walk through the document section by section. For each section, answer:

### 1. Factual claims

- **Platform references:** Every mention of Claude, Anthropic, a Claude product, a model name, a feature name, a tool name. List each.
- **Domain references:** Every mention of an external company, tool, standard, regulation, number, date, version, or metric. List each.
- **Pricing / cost references:** Every mention of pricing, cost ratios, token counts, budget. List each.
- **Capability claims:** Every "Claude can..." or "Claude cannot..." statement. List each.

### 2. Behavioral rules

- **Imperatives:** Every "always", "never", "you must", "do", "don't". List each.
- **Anti-patterns:** Every explicit thing the assistant should not do (phrases, tones, patterns). List each.
- **Decision rules:** Every "if X then Y" or "when X, do Y". List each.
- **Priority statements:** Every explicit ranking of goals or trade-offs. List each.

### 3. Voice and stylistic choices

- **Tone markers:** Words or phrases that set voice ("sharp," "candid," "no padding"). List each.
- **Pacing rules:** Instructions about length, density, compression. List each.
- **Formatting conventions:** Rules about bullets, headers, prose, emojis. List each.

### 4. Institutional knowledge

- **Defined terms:** Vocabulary the document defines or uses as if defined. List each.
- **Named entities:** Team names, person names, tool stacks, process names. List each.
- **Project-specific workflows:** Steps or patterns unique to this user's work. List each.

### 5. Examples and illustrations

- **Bad/good pairs:** Every explicit example of what to do or not do. List each.
- **Sample outputs:** Any concrete output shown as a template. List each.
- **Scenarios:** Any hypothetical or real case described. List each.

---

## After extraction

You should now have five lists. Every item goes into the classification table in the audit report. The extraction ensures you don't miss anything subtle — particularly institutional knowledge embedded in prose, which is easy to gloss over because it doesn't look like a "rule."

## When to use this

- Document is over ~1500 words.
- Document is written in dense prose (rules embedded in paragraphs, not bulleted).
- You've already done one audit pass and feel like you're missing things.
- The user has warned you the document has lots of specific context.

## When to skip this

- Short, well-structured documents where claims are obvious.
- Pure behavioral rule sets (no factual content to worry about).
- Quick-refresh mode where the user has flagged a specific small area.

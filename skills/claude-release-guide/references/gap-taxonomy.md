# Gap Taxonomy Reference

Detailed definitions and examples for each gap type identified during Phase 1 analysis. Use this reference when the gap type is ambiguous or when training the gap identification process.

## 1. Concept Gaps

**Definition:** A term, feature, or idea is named in the transcript but never defined or explained in a way that a reader could understand what it actually is.

**Detection pattern:** The creator says "this is called X" or "X does Y" but never explains what X fundamentally is, how it works, or why it exists.

**Examples from real transcripts:**
- "Claude uses work trees" → What is a work tree? How is it different from a branch? Why does it exist?
- "It uses a hub and spoke methodology" → Mentioned as if the listener knows what this means
- "Context rot starts happening" → Named but the mechanism isn't explained — what actually degrades?

**Guide fix:** Define the concept in one paragraph of plain language, then explain how it works in the context of the topic being discussed.

---

## 2. Step Gaps

**Definition:** An action or procedure is referenced but the actual keystrokes, commands, or clicks needed to perform it are not provided.

**Detection pattern:** The creator says "you do X" or "you open Y" but doesn't show the exact command, menu path, or sequence of actions.

**Examples:**
- "Open three terminals and start Claude in each" → What commands? What flags? In what order?
- "Enable it by adding a flag to settings.json" → Where is settings.json? What's the exact key-value pair?
- "Navigate between teammates using shift up and shift down" → What exactly does this show? What can you do once you're viewing a teammate?

**Guide fix:** Provide the exact command, file path, or UI sequence. If there are multiple ways to do it, show the recommended way first and mention alternatives.

---

## 3. Configuration Gaps

**Definition:** A setting, file, environment variable, or configuration value is mentioned but the actual value, syntax, or location is not shown.

**Detection pattern:** "Add this to your config" or "set this flag" or "enable this feature" without showing the literal configuration.

**Examples:**
- "Add experimental agent teams to your settings.json" → What's the exact JSON? What file path?
- "Use the -w flag" → What's the full command syntax? What are the parameters?
- "You can limit tools with --allowed-tools" → What's the syntax? What are valid tool names?

**Guide fix:** Show the exact configuration with syntax, file path, and any required restart/reload steps.

---

## 4. Prerequisite Gaps

**Definition:** Knowledge, software, accounts, permissions, or setup steps that the reader needs before they can follow along, but that the creator never states.

**Detection pattern:** The creator jumps into a workflow assuming the viewer already has everything set up. The absence of a "before you start" section is the gap.

**Examples:**
- Claude Code version not specified → Features vary significantly between versions
- OS compatibility not mentioned → Some features are platform-specific
- Pricing/plan requirements not mentioned → Some features require paid plans
- Git knowledge assumed → Work trees require understanding of Git branching

**Guide fix:** Create an explicit prerequisites section at the top of the guide. Include exact version requirements, installation links, and any prior knowledge with links to learn it.

---

## 5. Edge Case Gaps

**Definition:** Failure modes, limitations, boundary conditions, or "what happens when X goes wrong" scenarios that the creator never addresses.

**Detection pattern:** The creator presents the happy path only. No mention of what fails, what the limits are, or what to do when things don't work as described.

**Examples:**
- "Sub-agents can only report back to the main agent" → What happens if two sub-agents modify the same file?
- "Context rot starts happening" → At what point? How do you recognize it? What specifically breaks?
- "The limit is 10 sub-agents at once" → What happens if you need more? How does queuing work? Does queuing affect quality?
- "Agent teams use 4-7x more tokens" → What does that cost in dollars? Is there a way to monitor or cap it?

**Guide fix:** For each major feature or pattern, include a "Limitations and gotchas" subsection that addresses the most likely failure modes and how to handle them.

---

## 6. Resource Gaps

**Definition:** No links to official documentation, community resources, related guides, or further reading for tools and features mentioned.

**Detection pattern:** Tools, platforms, commands, or features are discussed with no links to where the reader can learn more or verify information.

**Examples:**
- Claude Code sub-agents discussed without linking to Anthropic's sub-agent documentation
- The `-w` flag explained without linking to Claude Code CLI reference
- A third-party framework mentioned ("GSD by Tash") without a link to find it

**Guide fix:** Every tool, feature, and platform mentioned gets a verified link to its official documentation. If the creator references a third-party tool or framework, link to it.

---

## 7. Comparison Gaps

**Definition:** Multiple options or approaches are presented without clear criteria for choosing between them.

**Detection pattern:** "You can use X or Y" or "pattern 3 is for this, pattern 4 is for that" without a decision framework.

**Examples:**
- Five agentic patterns presented without a decision matrix for when to use each
- "Only use agent teams for complex projects" → What specifically makes a project complex enough?
- "Sub-agents vs. agent teams" → What's the decision boundary? How do you know which to reach for?

**Guide fix:** Create a decision matrix or flowchart that maps specific conditions to specific recommendations. The reader should be able to answer "which one should I use?" without judgment calls.

---

## 8. Sequence Gaps

**Definition:** The order of operations is unclear, contradictory, or presented in a confusing sequence.

**Detection pattern:** Steps that depend on prior steps but don't say so, or a presentation order that doesn't match the logical execution order.

**Examples:**
- Work tree cleanup described before work tree creation is fully explained
- Sub-agent concepts explained after they're referenced in earlier patterns
- "Built-in sub-agents" mentioned at the start but custom sub-agents not introduced until pattern 3

**Guide fix:** Restructure the guide to follow logical learning sequence, not the video's presentation order. Add explicit "this requires completing [section X] first" notes where dependencies exist.

---

## Gap Priority Matrix

When multiple gaps exist (they always do), prioritize filling them in this order:

| Priority | Gap Type | Rationale |
|----------|----------|-----------|
| 1 | Prerequisite | Reader can't start without these |
| 2 | Concept | Reader can't understand the rest without definitions |
| 3 | Step | Reader can't execute without exact procedures |
| 4 | Configuration | Reader can't configure without actual values |
| 5 | Edge case | Reader will hit these during real use |
| 6 | Comparison | Reader needs decision criteria to choose approaches |
| 7 | Resource | Reader needs links for deeper exploration |
| 8 | Sequence | Reader needs logical flow (but this is addressed by restructuring) |

---
*Gap Taxonomy Reference v1.0 — April 2026*

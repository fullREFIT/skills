# Multi-Agent Patterns

This reference covers advanced patterns for orchestrating multiple agents, persisting agent configurations, and managing complex parallel workflows across Claude's agentic platforms.


## Built-in Sub-Agent Inventory by Platform

Different Claude platforms provide different built-in sub-agents. Understanding what's available helps design skills that leverage existing capabilities rather than reinventing them.

### Claude Code Sub-Agents

| Agent | Purpose | Best For | Tool Access |
|-------|---------|----------|-------------|
| `Explore` | Read-only discovery and analysis | Codebase research, file exploration, understanding existing code | Read, Grep, Glob |
| `Plan` | Strategic planning and architecture | Roadmap creation, multi-step planning, design decisions | Read, Grep, Glob |
| `Bash` | Shell command execution | System operations, package management, script execution | Bash |
| `general-purpose` | Full capability access | Complex multi-step tasks requiring all tools | All tools |

### Claude Cowork Sub-Agents

Cowork provides the same core agents but operates on local folders rather than repositories:

| Agent | Cowork Behavior | Typical Use Cases |
|-------|-----------------|-------------------|
| `Explore` | Reads and analyzes files in the working folder | Research synthesis, document analysis, content discovery |
| `Plan` | Creates structured plans based on folder contents | Project planning, roadmap creation, task breakdown |
| `Bash` | Executes commands in the local environment | File operations, script execution, data transformation |
| `general-purpose` | Full file manipulation within the folder | Document creation, content generation, multi-file operations |

### Claude Code (Cloud/Background Tasks)

When running background tasks in Claude Code (cloud), agents can:
- Create their own Git branches
- Push commits automatically
- Trigger deployment previews (Vercel, Netlify)
- Run in parallel without blocking local development

### Invoking Sub-Agents in Skills

To invoke a sub-agent from within a skill, use the `context: fork` frontmatter with the `agent` field:

```yaml
---
name: deep-analysis
description: Perform deep analysis of a topic using dedicated research agent
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Analyze $ARGUMENTS thoroughly:
1. Search for all relevant files
2. Read and synthesize findings
3. Report with specific file references
```


## Agent Orchestration Sequences

Complex tasks benefit from structured agent sequences where each agent has a specific role. The canonical pattern observed in production workflows:

### The RPEQ Pattern (Research → Plan → Execute → QA)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: RESEARCH                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │Research │ │Research │ │Research │ │Research │  ← Parallel       │
│  │Agent 1  │ │Agent 2  │ │Agent 3  │ │Agent N  │    Execution      │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘                   │
│       │           │           │           │                         │
│       └───────────┴─────┬─────┴───────────┘                         │
│                         ▼                                           │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: PLAN                                                      │
│                   ┌─────────────┐                                   │
│                   │ Plan Agent  │  ← Synthesizes research           │
│                   │ (Strategic) │    Creates structured roadmap     │
│                   └──────┬──────┘                                   │
│                          ▼                                          │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: EXECUTE                                                   │
│                   ┌─────────────┐                                   │
│                   │  Execute    │  ← Creates deliverables           │
│                   │  Agent(s)   │    (documents, code, assets)      │
│                   └──────┬──────┘                                   │
│                          ▼                                          │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 4: QA                                                        │
│                   ┌─────────────┐                                   │
│                   │  QA Agent   │  ← Reviews output                 │
│                   │  (Review)   │    Flags issues, suggests fixes   │
│                   └─────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Example: Executive Presentation Workflow

```markdown
## Orchestration Plan

### Phase 1: Parallel Research (4 agents)
- Agent 1: Research emerging AI capabilities 2026
- Agent 2: Research enterprise AI adoption patterns
- Agent 3: Research implementation challenges and solutions
- Agent 4: Research competitive landscape and benchmarks

### Phase 2: Strategic Planning (1 agent)
- Synthesize all research findings
- Create structured roadmap with phases
- Define success metrics and milestones

### Phase 3: Content Execution (1 agent + skill)
- Use Plan agent output as framework
- Invoke PowerPoint skill for presentation creation
- Apply brand guidelines from assets/

### Phase 4: Quality Assurance (1 agent)
- Review presentation for visual issues
- Check for text overlaps, font sizes, contrast
- Validate content accuracy against research
- Generate improvement recommendations
```

### Orchestration Skill Pattern

Skills can encode orchestration sequences:

```yaml
---
name: research-to-deck
description: Orchestrate multi-agent workflow from research to executive presentation. Use for creating research-backed presentations, strategy decks, or comprehensive reports requiring multiple research streams.
---

## Workflow Orchestration

This skill orchestrates the following agent sequence:

### Step 1: Spawn Research Agents
Spawn 3-4 general-purpose research agents in parallel, each focused on a different aspect of the topic. Each agent should:
- Conduct deep research using web search
- Document findings with sources
- Complete independently (parallel execution)

### Step 2: Activate Plan Agent
Once research completes, use the Plan agent to:
- Synthesize findings across all research streams
- Create a structured outline/roadmap
- Identify key themes and recommendations

### Step 3: Execute Content Creation
Using the plan as framework:
- Invoke appropriate skill (PowerPoint, document, etc.)
- Apply templates from assets/
- Generate the deliverable

### Step 4: QA Review
Spawn QA agent to:
- Review output for quality issues
- Check formatting, consistency, accuracy
- Generate revision recommendations

## Invoking This Workflow
To execute: Describe your topic and desired output format. The orchestration will be automatic.
```


## Agent Persistence Patterns

Agents and their configurations can be persisted as markdown files for reuse across sessions. This enables "agent libraries" that can be invoked without re-explaining their purpose.

### Basic Persistence Structure

```
cowork-agents/
├── README.md                    # Session onboarding document
├── agents.md                    # Agent definitions and capabilities
├── skills/
│   ├── powerpoint-reviewer/
│   │   └── SKILL.md
│   └── research-synthesizer/
│       └── SKILL.md
└── outputs/                     # Working files from agent tasks
    ├── research-findings.md
    └── presentation.pptx
```

### README as Session Onboarding

The README.md serves as a "bootstrap" document that new sessions can read to understand available agents and skills:

```markdown
# Cowork Agents Library

A collection of agent configurations and skills for Claude Cowork mode.

## Quick Start
Point a new Cowork session to this folder and say:
"Read the README and agents.md files to understand what agents and skills are available."

## Available Agents

### Research Agents
- **General Research Agent**: Multi-source web research with parallel execution
- **Competitive Analysis Agent**: Focused on competitor intelligence
- **Technical Research Agent**: Deep dives on technical topics

### Planning Agents
- **Strategic Plan Agent**: Creates roadmaps and strategic frameworks
- **Project Plan Agent**: Task breakdown and timeline creation

### Execution Agents
- **Content Writer Agent**: Long-form content creation
- **Presentation Agent**: Slide deck generation

### QA Agents
- **Content Reviewer**: Checks for accuracy and clarity
- **Visual QA Agent**: Reviews presentations for visual issues

## Available Skills
See `/skills/` folder for custom skills including:
- PowerPoint reviewer (visual QA)
- Research synthesizer (multi-source consolidation)

## Recommended Workflow
1. Research (parallel agents)
2. Plan (single strategic agent)
3. Execute (content/presentation agent)
4. QA (reviewer agent)
```

### agents.md Definition Format

```markdown
# Agent Definitions

## General Purpose Research Agent

**Type**: general-purpose
**Mode**: Parallel-capable
**Best For**: Multi-source research, complex searches, exploratory analysis

**Invocation**:
```
Spawn a general-purpose research agent to investigate [TOPIC].
Focus on: [SPECIFIC ASPECTS]
Output: Structured findings with sources
```

**Capabilities**:
- Web search across multiple sources
- Source evaluation and synthesis
- Structured output generation
- Can run multiple instances in parallel

---

## Plan Agent

**Type**: plan
**Mode**: Sequential (runs after research)
**Best For**: Strategy development, roadmap creation, task structuring

**Invocation**:
```
Use the Plan agent to synthesize [RESEARCH FINDINGS] into a structured [OUTPUT TYPE].
Include: [SPECIFIC ELEMENTS]
```

**Capabilities**:
- Research synthesis
- Logical structuring
- Timeline/milestone creation
- Dependency mapping
```

### Persisting Custom Skills Created During Sessions

When an agent creates a skill during a session (generative skill pattern), persist it:

```markdown
## Session-Generated Skills

### PowerPoint Reviewer Skill
**Created**: 2026-01-15
**Purpose**: Analyzes PowerPoint files for visual issues

**Location**: `/skills/powerpoint-reviewer/SKILL.md`

**Triggers**: "review presentation", "check slides", "QA the deck"

**Capabilities**:
- Detects text overlaps
- Identifies contrast issues (white text on light backgrounds)
- Flags font size problems
- Checks for off-slide content
```


## Context Window Management Strategies

Sub-agents receive fresh context windows, which provides significant advantages for complex tasks.

### The Context Compaction Problem

In long conversations, Claude must "compact" context to fit within limits. This:
- Loses nuance and detail from earlier exchanges
- Can cause inconsistent behavior
- Degrades quality on complex, multi-step tasks

### Sub-Agent Context Isolation

When you spawn a sub-agent with `context: fork`:
- The sub-agent gets a **fresh context window**
- Only the task prompt and skill instructions are loaded
- The sub-agent's work doesn't pollute the parent context
- Results return to parent without full context transfer

```
┌─────────────────────────────────────────────────────────────────────┐
│  PARENT CONTEXT                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Conversation history (may be compacted)                     │    │
│  │ User preferences, prior context                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                      │
│                              ▼ spawn                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ SUB-AGENT CONTEXT (Fresh)                                   │    │
│  │ ┌─────────────────────────────────────────────────────────┐ │    │
│  │ │ Task prompt only                                        │ │    │
│  │ │ Skill instructions (if applicable)                      │ │    │
│  │ │ No conversation history baggage                         │ │    │
│  │ └─────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                      │
│                              ▼ return                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Only results return to parent                               │    │
│  │ (not full sub-agent context)                                │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### When to Use Sub-Agents for Context Management

| Scenario | Recommendation |
|----------|----------------|
| Deep research on a single topic | Sub-agent with `agent: Explore` |
| Multiple research streams | Parallel sub-agents (each gets fresh context) |
| Complex document generation | Sub-agent to avoid polluting conversation |
| QA/Review tasks | Separate sub-agent for unbiased review |
| Long-running conversations | Offload intensive tasks to sub-agents |

### Skill Design for Context Efficiency

Design skills to minimize context consumption:

```yaml
---
name: efficient-research
description: Context-efficient research using sub-agent isolation
context: fork
agent: Explore
---

## Task
Research $ARGUMENTS and return a structured summary.

## Output Format
Return ONLY:
- Key findings (bullet points)
- Top 3 sources
- Confidence assessment

Do NOT return:
- Full source text
- Intermediate reasoning
- Search queries used

This keeps the return payload small for parent context.
```


## Parallel Execution Patterns

Parallel execution dramatically accelerates complex workflows by running independent tasks simultaneously.

### Identifying Parallelizable Tasks

Tasks can run in parallel when they:
- Don't depend on each other's output
- Access different resources (no conflicts)
- Can be synthesized after completion

```
SEQUENTIAL (Slow)                    PARALLEL (Fast)
─────────────────                    ─────────────────
Task A ──────────┐                   Task A ───┐
                 │                             │
Task B ──────────┤ Total: 4 units    Task B ───┼─┐ Total: 1 unit
                 │                             │ │   + synthesis
Task C ──────────┤                   Task C ───┤ │
                 │                             │ │
Task D ──────────┘                   Task D ───┘ │
                                               ▼ │
                                     Synthesis ──┘
```

### Parallel Research Pattern

```markdown
## Parallel Research Execution

To research [TOPIC], spawn the following agents simultaneously:

### Agent 1: [ASPECT A]
Focus: [Specific angle]
Sources: [Preferred source types]
Output: Structured findings

### Agent 2: [ASPECT B]
Focus: [Specific angle]
Sources: [Preferred source types]
Output: Structured findings

### Agent 3: [ASPECT C]
Focus: [Specific angle]
Sources: [Preferred source types]
Output: Structured findings

### Agent 4: [ASPECT D]
Focus: [Specific angle]
Sources: [Preferred source types]
Output: Structured findings

## Synthesis
Once all agents complete, synthesize findings into unified output.
```

### Parallel Feature Development (Vibe Coding Pattern)

For development workflows, parallel execution enables testing multiple approaches:

```markdown
## Parallel Feature Development

### Pattern: Multiple Variants
Spawn separate Claude Code instances for each variant:
- Instance 1: Feature with Configuration A
- Instance 2: Feature with Configuration B
- Instance 3: Feature with Configuration C

Each instance:
1. Creates its own Git branch
2. Implements the variant
3. Pushes to GitHub
4. Triggers preview deployment

### Evaluation
Review all previews simultaneously, then merge the winner.
```

### Parallel Execution in Cowork

In Claude Cowork, parallel agents appear in the sidebar simultaneously:

```markdown
## Cowork Parallel Execution

When you say: "Research X, Y, and Z in parallel"

Cowork will:
1. Spawn multiple research agents
2. Display all agents in sidebar
3. Show progress for each independently
4. Allow you to monitor/adjust any agent mid-task

### Mid-Task Intervention
If an agent goes off-track:
- Click the agent in sidebar
- Add a question or scope change
- Agent adjusts without restarting

### Completion
Agents complete independently. Synthesis happens after all finish.
```


## Session Continuity and Teleportation

Claude Code supports "teleporting" sessions between environments while preserving context.

### The Teleportation Concept

```
┌─────────────────┐                    ┌─────────────────┐
│  CLOUD SESSION  │                    │  LOCAL SESSION  │
│  (Background)   │                    │  (Terminal)     │
│                 │     Teleport       │                 │
│  - Full context │ ───────────────►   │  - Full context │
│  - Git branch   │                    │  - Same branch  │
│  - Task state   │                    │  - Task state   │
└─────────────────┘                    └─────────────────┘
```

### How Teleportation Works

1. **Cloud to Local**: Use "Open in CLI" from Claude Code web/mobile
   - Copies session context to local Claude Code
   - Checks out the same Git branch
   - Preserves task understanding and history

2. **Local to Cloud**: Launch background task from local
   - Task continues in cloud
   - Creates its own branch
   - Can be monitored from web/mobile

### Teleportation vs Git Checkout

| Method | Context Preserved | Best For |
|--------|-------------------|----------|
| Teleportation | Yes - full task context | Continuing work with understanding |
| Git checkout | No - code only | Just getting the code changes |

### Designing Skills for Session Continuity

Skills should handle potential session transfers gracefully:

```yaml
---
name: long-running-task
description: Task that may span multiple sessions or environments
---

## Session Continuity

This task may be teleported between environments. To ensure continuity:

### State Checkpoints
After each major milestone, create a checkpoint file:
```
checkpoints/
├── phase1-complete.md    # Research findings
├── phase2-complete.md    # Plan output
└── current-state.md      # Where we are now
```

### Resumption
If session is interrupted or teleported:
1. Read `checkpoints/current-state.md`
2. Identify last completed phase
3. Resume from next phase

### Progress Tracking
Maintain a progress file that persists across sessions:
```markdown
# Task Progress
- [x] Phase 1: Research
- [x] Phase 2: Planning
- [ ] Phase 3: Execution (IN PROGRESS)
- [ ] Phase 4: QA
```
```

### Cross-Device Workflows

The teleportation pattern enables sophisticated cross-device workflows:

```markdown
## Mobile → Desktop Workflow

1. **Mobile (Commute)**
   - Review task queue
   - Launch background research tasks
   - Monitor progress

2. **Desktop (Office)**
   - Teleport completed research to local
   - Do detailed work requiring full keyboard
   - Launch execution tasks to cloud

3. **Mobile (Evening)**
   - Review execution results
   - Approve/reject via pull requests
   - Queue next day's tasks
```


## Generative Skill Patterns

Skills can create other skills—enabling dynamic capability expansion.

### The Meta-Skill Pattern

A skill that generates new skills based on observed needs:

```yaml
---
name: skill-factory
description: Generate new skills based on repeated task patterns. Use when you notice yourself doing the same complex task repeatedly, or when a workflow should be encoded for reuse.
---

## Skill Generation Process

When generating a new skill:

### 1. Pattern Recognition
Identify the repeatable pattern:
- What triggers this task?
- What steps are always the same?
- What varies between instances?

### 2. Skill Architecture
Determine skill structure:
- What goes in frontmatter?
- What goes in body?
- Are scripts needed?
- Are reference files needed?

### 3. Generate Skill Files
Create the skill directory:
```
new-skill/
├── SKILL.md
├── scripts/      (if needed)
├── references/   (if needed)
└── assets/       (if needed)
```

### 4. Validate and Test
- Check frontmatter format
- Verify description includes triggers
- Test with representative inputs
```

### Session-Generated Skills

During task execution, agents may create skills to handle recurring sub-tasks:

```markdown
## Example: QA Skill Generation

During a presentation creation workflow, the agent notices:
- PowerPoint QA requires specific checks
- These checks are needed every time
- A skill would make this reusable

### Generated Skill

The agent creates `skills/powerpoint-reviewer/SKILL.md`:

```yaml
---
name: powerpoint-reviewer
description: Review PowerPoint files for visual quality issues. Use when checking presentations for text overlaps, contrast problems, font sizes, and off-slide content.
---

## Review Checklist

When reviewing a PowerPoint file:

### Visual Issues
- [ ] Text overlaps (elements covering each other)
- [ ] Contrast issues (light text on light backgrounds)
- [ ] Font size too small (<14pt for body text)
- [ ] Content extending beyond slide boundaries

### Consistency Issues
- [ ] Inconsistent fonts across slides
- [ ] Color palette violations
- [ ] Alignment inconsistencies
- [ ] Spacing irregularities

### Output Format
Report issues as:
- Slide number
- Issue type
- Specific location
- Recommended fix
```
```

### Skill Evolution Pattern

Skills can be updated based on usage feedback:

```markdown
## Skill Evolution Workflow

### Version 1: Initial Creation
Skill created based on first task instance.

### Version 1.1: First Refinement
After usage, add cases the skill missed:
- "White text on white background" wasn't caught
- Add explicit contrast ratio check

### Version 2: Generalization
Pattern becomes more sophisticated:
- Multiple QA dimensions
- Configurable strictness levels
- Integration with style guides

### Version 2.1+: Continuous Improvement
Ongoing refinement based on:
- Edge cases discovered
- User feedback
- Platform capability changes
```

### Skill Composition Pattern

Skills that invoke other skills:

```yaml
---
name: full-document-workflow
description: Complete document workflow from research to final QA. Composes multiple skills for end-to-end execution.
---

## Composed Workflow

This skill orchestrates multiple other skills:

### Step 1: Research
Invoke: `research-synthesizer` skill
Input: Topic and scope
Output: Structured research findings

### Step 2: Document Creation
Invoke: `document-creator` skill
Input: Research findings + template
Output: Draft document

### Step 3: Quality Assurance
Invoke: `document-reviewer` skill
Input: Draft document
Output: QA report with issues

### Step 4: Revision
If issues found, iterate:
- Apply fixes to document
- Re-run QA
- Repeat until clean

### Final Output
- Polished document
- QA certification
- Source documentation
```

### Self-Improving Skills

Advanced pattern where skills improve themselves:

```markdown
## Self-Improvement Protocol

After each execution, this skill:

### 1. Captures Feedback
- Did the output meet expectations?
- What manual corrections were needed?
- What edge cases weren't handled?

### 2. Proposes Updates
Generate proposed skill modifications:
- New checks to add
- Instructions to clarify
- Examples to include

### 3. Version Control
- Create new skill version with improvements
- Preserve old version for rollback
- Document changes in changelog

### 4. Validation
- Test updated skill on previous inputs
- Verify improvements don't cause regressions
- Promote to production if validated
```


---

## Quick Reference: Multi-Agent Decision Matrix

| Scenario | Pattern | Key Configuration |
|----------|---------|-------------------|
| Deep research on one topic | Single sub-agent | `context: fork`, `agent: Explore` |
| Research multiple topics | Parallel sub-agents | Spawn multiple `general-purpose` |
| Complex planning | Sequential agents | Research → Plan agent |
| Document generation | Isolated execution | Sub-agent with skill invocation |
| Quality review | Separate QA agent | Fresh context for unbiased review |
| Long conversation | Offload to sub-agents | Prevent context compaction |
| Cross-device work | Teleportation | Use "Open in CLI" to transfer |
| Repeated task | Generate skill | Meta-skill or manual creation |
| Complex workflow | Skill composition | Skills that invoke other skills |


---
*Multi-Agent Patterns Reference v1.0 — January 2026*
*For use with Skill Creator skill*

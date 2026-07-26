# Orchestrator File Templates

Use these templates when generating the 5 specification files.

---

## Section 1: README.md

```markdown
# {Project Name}

**Project Owner:** {Your Name}
**Status:** Ready to Execute
**Target Completion:** [timeframe]
**Output Location:** [where deliverables go]

## What This Project Does

[2-3 sentences: what gets built and why it matters to {your project}]

## Success Definition

- [ ] [Verifiable outcome 1]
- [ ] [Verifiable outcome 2]
- [ ] [Verifiable outcome 3]

## How to Execute

Open the Task Orchestrator session and say: `run {project-name}`
```

---

## Section 2: 00-PROJECT-INDEX.md

```markdown
# {Project Name} — Project Index

**Project:** {folder-name}
**Start Date:** {YYYY-MM-DD}
**Owner:** {Your Name}
**Status:** READY TO EXECUTE

## Deliverables Status Tracker

| # | Deliverable | Status | Depends On | Platform | Est. Time |
|---|------------|--------|-----------|----------|-----------|
| 1 | [Name] | Ready | None | claude-code | [time] |
| 2 | [Name] | Ready | Task 1 | claude-code | [time] |
| 3 | [Name] | Blocked | — | runbook | [time] |

Status values: Ready | Blocked | In Progress | Complete

## Execution Order

[Describe parallel groups and sequence]

**Parallel Group 1 (no dependencies):** Tasks 1, 3
**Sequential (after Group 1):** Task 2 depends on Task 1
**Independent Manual:** Task 4 (runbook, does not block automated work)

## Output Locations

| Deliverable | Output Path |
|------------|-------------|
| [Name] | [full path] |

## Success Definition

[Copy from README.md for quick reference]
```

---

## Section 3: CLAUDE-TASKS.md (Most Important File)

```markdown
# {Project Name} — Orchestrator Task Definitions

## TASK 1: {Title}

```yaml
task_id: {project-slug}-001
platform: claude-code
title: "{What to build}"
depends_on: []
status: ready
time_estimate: {estimate}
```

### Execution Prompt

[SELF-CONTAINED instructions. The orchestrator reading this has NO context beyond this project folder.]

**What to build:**
[Specific deliverable — not a vague goal]

**Folder structure:**
```
output-folder/
  file-1.ext
  file-2.ext
  subfolder/
    file-3.ext
```

**Content requirements:**
[Exhaustive list of what each file must contain]

**Brand compliance:**
[If customer-facing: no italics, no emojis, no banned words — list your brand's specific rules inline]

**Output location:** [exact path]

**Acceptance criteria:**
- [Verifiable check 1]
- [Verifiable check 2]

**When done:**
- Update 00-PROJECT-INDEX.md Task 1 status to "Complete"
- Send Slack notification: "Task 1 complete: {title}"
- Move to Task 2
```

---

## Section 4: SPECS.md

```markdown
# {Project Name} — Detailed Specifications

## Deliverable 1: {Name}

### Technical Requirements
[Data structures, schemas, formats, integrations]

### Content Specifications
[Word counts, tone, audience, structure — if content task]

### Visual Specifications
[Colors, typography, layout — if design/web task]

### Quality Standards
[What "good" looks like vs. what "bad" looks like]

### Example Output
[At least one concrete example of the expected result]

---

## Deliverable 2: {Name}
[Same structure]
```

---

## Section 5: DEPENDENCIES.md

```markdown
# {Project Name} — Dependencies

## Task Dependencies

| Task | Depends On | Notes |
|------|-----------|-------|
| Task 1 | None | Can start immediately |
| Task 2 | Task 1 | Needs Task 1 output |

## External Dependencies

### Already Configured
| Service | Purpose | Status |
|---------|---------|--------|
| n8n (your-n8n-instance) | Workflow automation | Connected via MCP |
| Slack (#your-channel) | Notifications | Connected via MCP |

### May Need Setup
| Service | Purpose | What's Needed |
|---------|---------|--------------|
| [Service] | [Purpose] | [Credential or config needed] |

## Potential Blockers

1. **[Blocker]** — State: BLOCKED | UNCLEAR | INCOMPLETE
   - BLOCKED = needs owner's input (describe what's needed)
   - UNCLEAR = can assume and proceed (state the assumption)
   - INCOMPLETE = can generate missing content (describe what to generate)

## MCP Servers Required

| MCP Server | Used By Tasks | Purpose |
|-----------|--------------|---------|
| n8n-mcp | Task 3, 4 | Build workflows |
| Supabase | Task 1 | Database schema |
```

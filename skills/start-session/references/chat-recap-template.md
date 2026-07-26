# Chat-Recap Template

The canonical structure for chat-recap content. Both `save-session` (Claude.ai/Desktop, writes as Open Brain thought) and `cc-save-session` (Claude Code, writes to `{project-root}/chat-recap-project-handoff/chat-recap_{project-name}_{MMDDYY}.md`) produce content matching this template.

## Required vs Optional Sections

| Section | Status | Purpose |
|---|---|---|
| 1. Active Goal | REQUIRED | One sentence: what this session was working on |
| 2. Why It Matters | optional | Business/technical justification — only if non-obvious |
| 3. Architectural Decisions | optional | Pattern chosen, why, alternatives rejected — only if decisions made |
| 4. Files / Artifacts Modified | REQUIRED | Concrete outputs produced this session |
| 5. Immediate Next Step | REQUIRED | Exact next action — not a category |
| 6. Nuances / Gotchas | optional | Non-obvious discoveries — only if surfaced |
| 7. Context for Resume | REQUIRED | 2-3 sentences enough to cold-start |
| 8. Final Exchange | REQUIRED | Last user message + last Claude response, verbatim |

A session with no substantive work produces a short recap with the four required sections only. Don't pad to look thorough.

## Template

```markdown
# Chat Recap: {project-name}

**Last Updated:** {ISO timestamp}
**Tool:** {Claude.ai | Claude Desktop | Claude Code}

---

## Session: {ISO timestamp}

### 1. Active Goal *(REQUIRED)*
{One sentence: what we worked on RIGHT NOW}

### 2. Why It Matters *(optional)*
{Business or technical justification, 1-2 sentences}

### 3. Architectural Decisions *(optional — when decisions were made)*

**Pattern Chosen:** {What approach}
**Why:** {Rationale}
**Alternatives Rejected:** {What we didn't do and why}
**Constraints:** {Technical or business limits}

### 4. Files / Artifacts Modified *(REQUIRED)*

For Claude Code:
- `path/to/file` (NEW | MODIFIED) — what changed and at what lines

For Claude.ai / Desktop:
- Artifact name (created | updated | linked) — what it contains

### 5. Immediate Next Step *(REQUIRED)*

**EXACT ACTION:** {Specific action with file/artifact and what to do}

**Open Brain tasks created this session:**
- {Task title with priority — or "none"}

### 6. Nuances / Gotchas *(optional — when non-obvious things were discovered)*

- **{Discovery}:** {Why it matters, what to watch for}

### 7. Context for Resume *(REQUIRED)*

{2-3 sentences. Where we left off. The single most important next action.
Cross-tool dependencies if any. Include Open Brain task references if relevant.}

### 8. Final Exchange *(REQUIRED)*

**User said:**
> {Last user message in this session — verbatim, abbreviated to 200 words max with [...] if longer}

**Claude responded:**
> {Last Claude response — abbreviated to ~3 sentences if long, full text otherwise}
```

## Why Section 8 (Final Exchange) Matters

When a session ends mid-conversation — not at a clean stopping point — the next session needs to know exactly what was being said when the previous one ended. The Final Exchange capture lets `start-session` reconstruct not just *where* the work paused, but *what was being discussed* at the moment it paused.

Use cases:
- "I was about to ask Claude to refine X" — the next session can pick that up
- "Claude was mid-explanation of Y when I stopped" — the next session can continue the explanation
- "We were debating between approach A and approach B" — the next session sees both options were on the table

## Length Guidance

- Total chat-recap under 800 words for normal sessions
- Final Exchange section: user message under 200 words abbreviated, Claude response under 3 sentences if long
- A session with no substantive work: ~10 lines, four required sections only — don't pad
- A session with major architectural work: can exceed 800 words; include all 8 sections with detail

## Same-Day Update Behavior

If a chat-recap already exists for the same project on the same day:

- **Claude Code** (cc-save-session): overwrite the existing file at `{project-root}/chat-recap-project-handoff/chat-recap_{project-name}_{MMDDYY}.md`
- **Claude.ai/Desktop** (save-session): the new save_thought call with topic `chat-recap_{project-name}_{MMDDYY}` supersedes the prior thought

One file (or one thought) per project per day. Always current. No `_session1`/`_session2` variants. No append-with-headers within the same day.

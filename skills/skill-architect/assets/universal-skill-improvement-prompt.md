# Universal Claude Skill Improvement Prompt

Use this prompt template whenever you want to comprehensively improve a Claude skill. Replace the bracketed placeholders with your specific skill details.

---

## THE PROMPT

```
# SKILL IMPROVEMENT REQUEST

## SKILL IDENTIFICATION
- **Skill Name**: [SKILL NAME]
- **Skill Domain**: [DOMAIN - e.g., document creation, API integration, workflow automation]
- **Current Version**: [Attached/Pasted below]

## OBJECTIVE
Transform this skill into the most comprehensive, current, and effective version possible. The improved skill should represent the definitive resource for [SKILL DOMAIN] within the Claude ecosystem.

## RESEARCH REQUIREMENTS

Before making any modifications, conduct exhaustive research:

### 1. Specification Currency
Search for the most current information as of [TODAY'S DATE] regarding:
- The agentskills.io open standard (latest specification)
- Claude-specific skill features (frontmatter fields, hooks, subagents, etc.)
- Cross-platform compatibility requirements (Claude Code, Codex, VS Code, Cursor, etc.)

### 2. Domain-Specific Research
Search for the most current information regarding [SKILL DOMAIN]:
- Official documentation and specifications
- Best practices and design patterns
- Recent updates, changes, or deprecations
- Common pitfalls and how to avoid them
- Advanced techniques and expert methodologies

### 3. Platform Evolution
Search for current information about:
- Claude's product ecosystem (Claude.ai, Claude Code, Cowork, Desktop, API, etc.)
- Relevant integrations and connectors (MCP servers, tool use, etc.)
- Execution environments and their capabilities

## ANALYSIS FRAMEWORK

After research, analyze the existing skill against these criteria:

### Completeness
- Does it cover all major use cases in [SKILL DOMAIN]?
- Are there gaps in coverage that users would expect?
- Does it include both basic and advanced patterns?

### Currency
- Is all information current as of [TODAY'S DATE]?
- Are deprecated approaches still referenced?
- Are new capabilities and features included?

### Specification Compliance
- Does the frontmatter conform to current agentskills.io standards?
- Is the description optimized for skill discovery (triggers, use cases)?
- Is progressive disclosure properly implemented?

### Practical Utility
- Can users immediately apply the guidance?
- Are examples concrete and actionable?
- Is the skill self-contained or does it require external knowledge?

### Cross-Platform Compatibility
- Will the skill work across all target platforms?
- Are platform-specific features properly documented?
- Are there graceful fallbacks for platform limitations?

## DELIVERABLES

### 1. Research Summary
Provide a brief summary of key findings from your research, highlighting:
- Information that should be added
- Information that should be updated
- Information that should be removed
- Patterns or approaches discovered

### 2. Improvement Recommendations
Before implementing, outline:
- Major structural changes proposed
- New sections or reference files to add
- Content to consolidate or reorganize
- Features from the current skill to preserve

### 3. Improved Skill Package
Create the complete improved skill including:
- Updated SKILL.md with current frontmatter
- New or updated reference files
- Any supporting scripts or assets
- Proper directory structure

### 4. Change Summary
Document what changed:
- New content added
- Existing content updated
- Content removed or deprecated
- Structural reorganization

## QUALITY STANDARDS

The improved skill must meet these criteria:

### Frontmatter
- [ ] Name follows agentskills.io conventions (lowercase, hyphens, ≤64 chars)
- [ ] Description includes what + when + triggers (≤1024 chars)
- [ ] Description written in third person
- [ ] All applicable optional fields configured

### Body Content
- [ ] Under 500 lines (progressive disclosure to references)
- [ ] Uses imperative/infinitive form consistently
- [ ] All bundled resources referenced with usage instructions
- [ ] No duplication between SKILL.md and reference files
- [ ] Table of contents if >100 lines

### Reference Files
- [ ] Organized by topic/purpose
- [ ] Each file focused and <10k words
- [ ] One level of nesting maximum
- [ ] Clear file naming conventions

### Practical Value
- [ ] Actionable guidance throughout
- [ ] Concrete examples for complex concepts
- [ ] Common pitfalls and troubleshooting included
- [ ] Decision frameworks for ambiguous situations

## CONSTRAINTS

- Preserve valuable content from the original skill
- Maintain backward compatibility where possible
- Do not remove functionality without replacement
- Keep the skill self-contained (minimize external dependencies)
- Ensure all claims are verified through research

## ATTACHED SKILL

[PASTE SKILL CONTENT HERE OR ATTACH FILES]
```

---

## USAGE INSTRUCTIONS

### Step 1: Copy the Prompt Template
Copy everything between the triple backticks above.

### Step 2: Replace Placeholders

| Placeholder | Replace With |
|-------------|--------------|
| `[SKILL NAME]` | The actual skill name (e.g., "mcp-builder") |
| `[SKILL DOMAIN]` | The domain it covers (e.g., "MCP server development") |
| `[TODAY'S DATE]` | Current date for research currency |
| `[ATTACH FILES]` | Upload the skill zip or paste SKILL.md content |

### Step 3: Attach Supporting Files
If the skill has reference files, scripts, or assets, attach them as:
- A zip file of the complete skill directory, OR
- Individual files (SKILL.md + reference files)

### Step 4: Submit to Claude
Start a fresh conversation and submit the completed prompt with attachments.

---

## QUICK-START VERSION

For faster iteration when you're confident in the approach:

```
Improve this Claude skill to be the most comprehensive, current, and effective version possible.

**Skill**: [SKILL NAME]
**Domain**: [SKILL DOMAIN]
**Date**: [TODAY'S DATE]

**Research first**: Search for current information about:
1. agentskills.io specification updates
2. [SKILL DOMAIN] best practices, recent changes, and current specifications
3. Claude platform capabilities relevant to this skill

**Then improve**:
- Update to current specifications and standards
- Add missing coverage areas identified by research
- Include advanced patterns and expert techniques
- Add practical, actionable examples
- Create/update reference files as needed
- Ensure cross-platform compatibility

**Quality criteria**:
- Frontmatter conforms to agentskills.io
- Description optimized for discovery (what + when + triggers)
- Progressive disclosure implemented (body → references)
- Self-contained and immediately actionable

**Output**:
- Complete improved skill package (SKILL.md + references)
- Downloadable zip file ready for installation
- Summary of changes made

[ATTACH SKILL FILES]
```

---

## EXAMPLE: MCP Builder Skill

Here's the prompt filled in for the MCP Builder skill:

```
# SKILL IMPROVEMENT REQUEST

## SKILL IDENTIFICATION
- **Skill Name**: mcp-builder
- **Skill Domain**: MCP (Model Context Protocol) server development
- **Current Version**: Attached as mcp-builder.zip

## OBJECTIVE
Transform this skill into the most comprehensive, current, and effective version possible. The improved skill should represent the definitive resource for MCP server development within the Claude ecosystem.

## RESEARCH REQUIREMENTS

Before making any modifications, conduct exhaustive research:

### 1. Specification Currency
Search for the most current information as of January 26, 2026 regarding:
- The agentskills.io open standard (latest specification)
- Claude-specific skill features (frontmatter fields, hooks, subagents, etc.)
- Cross-platform compatibility requirements (Claude Code, Codex, VS Code, Cursor, etc.)

### 2. Domain-Specific Research
Search for the most current information regarding MCP server development:
- Official MCP protocol documentation and specifications (modelcontextprotocol.io)
- MCP specification versions (2024-11-05, 2025-03-26, 2025-06-18, 2025-11-25)
- Python SDK (mcp package) and FastMCP framework updates
- TypeScript SDK updates
- Best practices for tool design, transport selection, authentication
- Recent features: Tasks, elicitation, OAuth, structured outputs
- MCP Registry for server distribution
- Common pitfalls and security considerations

### 3. Platform Evolution
Search for current information about:
- Claude's product ecosystem (Claude.ai, Claude Code, Cowork, Desktop, API)
- MCP server deployment options (stdio, Streamable HTTP, SSE deprecated)
- Integration with major AI platforms (OpenAI, Google adopting MCP)

[... rest of standard template sections ...]

## ATTACHED SKILL

[mcp-builder.zip attached]
```

---

## TIPS FOR BEST RESULTS

1. **Use Extended Thinking**: Complex skills benefit from Claude's extended thinking mode for deeper analysis.

2. **Provide Complete Context**: Include ALL skill files (SKILL.md + references + scripts), not just the main file.

3. **Specify Priority Areas**: Add a "Priority Improvements" section if you have known issues:
   ```
   ## PRIORITY IMPROVEMENTS
   - Update transport section (SSE is now deprecated)
   - Add coverage of MCP Registry publication
   - Include OAuth 2.1 authorization patterns
   ```

4. **Iterate**: For major overhauls, consider doing research → recommendations in one session, then implementation in a follow-up.

5. **Platform Targeting**: If the skill is platform-specific, note it:
   ```
   ## PLATFORM TARGET
   Primary: Claude Code (terminal environment)
   Secondary: Claude Desktop with MCP support
   ```

---

## CHECKLIST FOR REVIEWING IMPROVED SKILLS

After receiving the improved skill, verify:

### Specification Compliance
- [ ] Name: lowercase, hyphens only, ≤64 chars, matches directory
- [ ] Description: ≤1024 chars, third-person, includes triggers
- [ ] Body: <500 lines with progressive disclosure
- [ ] References: organized, focused, no excessive nesting

### Information Currency
- [ ] All specifications/APIs current as of today
- [ ] No deprecated approaches without migration guidance
- [ ] New features and capabilities included

### Practical Value
- [ ] Can be immediately used without external research
- [ ] Examples are concrete and copy-paste ready
- [ ] Common pitfalls documented with solutions
- [ ] Decision frameworks for ambiguous situations

### Package Completeness
- [ ] SKILL.md complete and well-structured
- [ ] Reference files organized and accessible
- [ ] Directory name matches skill name
- [ ] Zip file ready for installation

---

*Universal Skill Improvement Prompt v1.0 — January 2026*

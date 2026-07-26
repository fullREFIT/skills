# Skill Troubleshooting Guide

Reference for diagnosing and fixing common skill issues. Consult when skills don't trigger correctly, produce unexpected results, or fail to execute.

## Skill Discovery Issues

### Skill Not Triggering

**Symptom**: User request seems relevant, but skill is not activated.

**Diagnostic steps**:

1. **Check description clarity**
   - Is the description specific enough?
   - Does it include trigger keywords?
   - Is it written in third person?

   ```yaml
   # Bad - too vague
   description: Helps with files

   # Good - specific with triggers
   description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
   ```

2. **Verify name matches directory**
   - The `name` field MUST match the parent directory name exactly
   - Check for typos, case differences

3. **Check for reserved words**
   - Names cannot contain "anthropic" or "claude"

4. **Validate frontmatter syntax**
   - YAML must be valid
   - Fields must be properly indented
   - Run: `python scripts/quick_validate.py <skill-path>`

### Wrong Skill Triggered

**Symptom**: Different skill activates than expected.

**Diagnostic steps**:

1. **Review overlapping descriptions**
   - Multiple skills may have similar triggers
   - Make descriptions more specific
   - Add distinguishing keywords

2. **Check description length**
   - Maximum 1024 characters
   - Long descriptions may be truncated
   - Front-load important keywords

### Skill Triggers at Wrong Times

**Symptom**: Skill activates when it shouldn't.

**Solutions**:

1. **Narrow the description**
   - Remove generic terms
   - Add specific conditions
   - Example: "Use ONLY when..." instead of "Use when..."

2. **Add negative conditions**
   ```yaml
   description: Process Excel spreadsheets for data analysis. Use when working with .xlsx files. Do NOT use for CSV files (use csv-processor instead).
   ```

## Content Loading Issues

### Reference Files Not Read

**Symptom**: Agent ignores bundled reference files.

**Diagnostic steps**:

1. **Check reference paths**
   - Use forward slashes: `references/guide.md`
   - Paths are relative to skill root
   - Verify files exist at specified paths

2. **Verify reference signals in SKILL.md**
   - References must be clearly mentioned
   - Use explicit links: `See [references/guide.md](references/guide.md)`
   - Describe when to read each file

3. **Check file naming**
   - Use descriptive names: `form_validation_rules.md`
   - Avoid generic names: `doc2.md`

### Partial File Reads

**Symptom**: Agent only reads part of reference file.

**Causes**:
- File is too long
- Nested references (agent previews with `head`)

**Solutions**:

1. **Add table of contents** to long files
   ```markdown
   # API Reference

   ## Contents
   - Authentication
   - Core Methods
   - Error Handling

   ## Authentication
   ...
   ```

2. **Keep references one level deep**
   - SKILL.md → reference files (good)
   - SKILL.md → file1 → file2 (problematic)

3. **Split large files** into focused sections

## Script Execution Issues

### Script Not Found

**Symptom**: "Script not found" or "No such file" errors.

**Solutions**:

1. **Check path in instructions**
   ```markdown
   # Wrong - assumes current directory
   Run: `analyze_form.py`

   # Correct - explicit path
   Run: `python scripts/analyze_form.py`
   ```

2. **Verify file exists** in skill package

3. **Check file permissions**
   ```bash
   chmod +x scripts/analyze_form.py
   ```

### Script Fails to Execute

**Symptom**: Script runs but produces errors.

**Diagnostic steps**:

1. **Test script independently**
   ```bash
   cd skill-directory
   python scripts/my_script.py test_input.txt
   ```

2. **Check dependencies**
   - Required packages installed?
   - Correct Python version?

3. **Review error messages**
   - Missing imports
   - Path issues
   - Permission problems

### Script Output Not Used

**Symptom**: Script runs successfully but agent ignores output.

**Solutions**:

1. **Clarify output format** in SKILL.md
   ```markdown
   The script outputs JSON to stdout:
   ```json
   {"status": "success", "fields": [...]}
   ```

   Parse this output and use the `fields` array.
   ```

2. **Distinguish execute vs. read**
   ```markdown
   # Execute (use output)
   Run: `python scripts/analyze.py` and use the results

   # Read (reference only)
   See `scripts/analyze.py` for the algorithm details
   ```

## Output Quality Issues

### Inconsistent Output Format

**Symptom**: Agent produces varying formats for same task type.

**Solutions**:

1. **Add strict template**
   ```markdown
   ALWAYS use this exact format:

   # Title
   ## Section 1
   ## Section 2

   Do not deviate from this structure.
   ```

2. **Provide examples** of correct output

3. **Add validation step**
   ```markdown
   After generating output, verify it matches the template structure before proceeding.
   ```

### Missing Required Elements

**Symptom**: Output lacks required sections or data.

**Solutions**:

1. **Use checklist pattern**
   ```markdown
   Before completing, verify output includes:
   - [ ] Title
   - [ ] Executive summary
   - [ ] At least 3 key findings
   - [ ] Recommendations
   ```

2. **Make requirements explicit**
   ```markdown
   ## Required sections (always include)
   - Title
   - Summary

   ## Optional sections (include if relevant)
   - Technical details
   - Cost analysis
   ```

### Poor Output Quality

**Symptom**: Output is technically correct but not useful.

**Solutions**:

1. **Add quality criteria**
   ```markdown
   Output must be:
   - Actionable (specific steps, not vague advice)
   - Evidence-based (cite data sources)
   - Appropriate for audience (technical vs. executive)
   ```

2. **Include good/bad examples**
   ```markdown
   Good: "Update line 42 to handle null values"
   Bad: "Fix the bug"
   ```

## Workflow Issues

### Workflow Steps Skipped

**Symptom**: Agent skips validation or intermediate steps.

**Solutions**:

1. **Make steps mandatory**
   ```markdown
   **CRITICAL**: Do not proceed to Step 3 until Step 2 validation passes.
   ```

2. **Use progress checklist**
   ```markdown
   Copy and track progress:
   - [ ] Step 1: Complete
   - [ ] Step 2: Validation passed
   - [ ] Step 3: Complete
   ```

3. **Add blocking conditions**
   ```markdown
   If validation fails, STOP and fix issues before continuing.
   ```

### Workflow Loops Forever

**Symptom**: Agent gets stuck in validation loop.

**Solutions**:

1. **Add iteration limits**
   ```markdown
   Attempt validation up to 3 times. If still failing after 3 attempts, report the persistent errors and request guidance.
   ```

2. **Provide escape conditions**
   ```markdown
   If unable to resolve validation errors:
   1. Document the specific errors
   2. Save current progress
   3. Report issues and ask for guidance
   ```

## Cross-Platform Issues

### Skill Works in Claude but Not Codex/VS Code

**Symptom**: Skill functions in one platform but not another.

**Check**:

1. **Frontmatter compliance**
   - All platforms require `name` and `description`
   - Check for platform-specific fields

2. **Path format**
   - Use forward slashes only
   - Relative paths from skill root

3. **Script compatibility**
   - Different platforms may have different package availability
   - Test on target platforms

### Installation Location Issues

**Symptom**: Skill not discovered after installation.

**Platform-specific locations**:

| Platform | Location |
|----------|----------|
| Claude Code | `~/.claude/skills/` or `.claude/skills/` |
| OpenAI Codex | `~/.codex/skills/` or project |
| VS Code | `.github/skills/` or `~/.copilot/skills/` |
| API | Upload via `/v1/skills` |

Verify skill is in correct location for target platform.

## Debugging Strategies

### Enable Verbose Logging

Add debug output to understand skill behavior:

```markdown
## Debug mode

To troubleshoot, run with verbose output:
```bash
python scripts/analyze.py --verbose input.txt
```

This shows:
- Files accessed
- Intermediate results
- Decision points
```

### Isolate the Problem

1. **Test skill components separately**
   - Scripts work?
   - References readable?
   - Frontmatter valid?

2. **Simplify and rebuild**
   - Remove optional components
   - Test minimal skill
   - Add components back one at a time

3. **Compare with working skill**
   - Use a known-working skill as reference
   - Identify differences

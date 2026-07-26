# Workflow Patterns

Reference guide for structuring workflows in skills. Consult this when building skills with multi-step processes or complex decision logic.

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps. Provide an overview early in SKILL.md:

```markdown
## PDF form filling process

Filling a PDF form involves these steps:

1. Analyze the form (run analyze_form.py)
2. Create field mapping (edit fields.json)
3. Validate mapping (run validate_fields.py)
4. Fill the form (run fill_form.py)
5. Verify output (run verify_output.py)
```

### With Progress Tracking

For long workflows, provide a copyable checklist:

```markdown
Copy this checklist and check off items as you complete them:

```
Task Progress:
- [ ] Step 1: Analyze the form
- [ ] Step 2: Create field mapping
- [ ] Step 3: Validate mapping
- [ ] Step 4: Fill the form
- [ ] Step 5: Verify output
```
```

## Conditional Workflows

For tasks with branching logic, guide through decision points:

```markdown
## Document modification workflow

1. Determine the modification type:

   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow:
   - Use docx-js library
   - Build document from scratch
   - Export to .docx format

3. Editing workflow:
   - Unpack existing document
   - Modify XML directly
   - Validate after each change
   - Repack when complete
```

### Multi-Branch Conditional

```markdown
## Image processing workflow

Determine the task type:

**Resize/crop?**
→ Use PIL/Pillow
→ See [references/image-resize.md](references/image-resize.md)

**Format conversion?**
→ Use ImageMagick
→ Run: `convert input.png output.jpg`

**OCR/text extraction?**
→ Use pytesseract
→ See [references/ocr-guide.md](references/ocr-guide.md)

**Enhancement/filters?**
→ Use OpenCV
→ See [references/image-enhance.md](references/image-enhance.md)
```

## Feedback Loop Patterns

### Validation Loop

The most important pattern for quality-critical operations:

```markdown
## Editing process with validation

1. Make your edits to the file
2. **Validate immediately**: `python scripts/validate.py output/`
3. If validation fails:
   - Review the error message carefully
   - Fix the identified issues
   - Run validation again
4. **Only proceed when validation passes**
5. Continue to next step
```

### Plan-Validate-Execute Pattern

For complex operations with potential for errors:

```markdown
## Batch update workflow

1. **Plan phase**:
   - Analyze the requirements
   - Create `changes.json` with planned changes
   - Do NOT modify any files yet

2. **Validate phase**:
   - Run: `python scripts/validate_plan.py changes.json`
   - Review any warnings or errors
   - Update `changes.json` if needed
   - Repeat until validation passes

3. **Execute phase** (only after validation passes):
   - Run: `python scripts/apply_changes.py changes.json`
   - Verify results

4. **Verify phase**:
   - Run: `python scripts/verify_output.py`
   - If verification fails, investigate and restart from Step 1
```

## Iterative Refinement Pattern

For tasks requiring multiple passes:

```markdown
## Content review workflow

### Pass 1: Structure
Review overall organization and completeness.
- Are all required sections present?
- Is the flow logical?

### Pass 2: Accuracy
Verify facts and technical details.
- Are claims supported?
- Are examples correct?

### Pass 3: Style
Check tone, consistency, and polish.
- Is terminology consistent?
- Is the tone appropriate?

### Pass 4: Final check
Quick scan for obvious issues before completion.
```

## Error Recovery Patterns

### Graceful Degradation

```markdown
## Data extraction workflow

1. Try primary extraction method:
   ```bash
   python scripts/extract_primary.py input.pdf
   ```

2. If primary fails, try fallback:
   ```bash
   python scripts/extract_fallback.py input.pdf
   ```

3. If both fail, report specific error and request guidance.
```

### Checkpoint Pattern

For long operations that might fail partway:

```markdown
## Large batch processing

1. Process items in batches of 100
2. After each batch:
   - Save checkpoint: `python scripts/save_checkpoint.py`
   - Validate batch results
   - If validation fails, restore from previous checkpoint
3. On completion, verify full results

If interrupted:
- Run: `python scripts/resume_from_checkpoint.py`
- Processing continues from last successful batch
```

## Parallel vs. Sequential Decision

Use this to determine whether steps can run in parallel:

```markdown
## Dependency analysis

Steps that can run in parallel:
- No shared resources
- No data dependencies
- Order doesn't matter

Steps that must be sequential:
- Output of one is input to next
- Shared file access
- Order affects results

Example parallel opportunity:
- Analyzing multiple independent files
- Running independent validations

Example sequential requirement:
- Extract data → Transform → Load
- Create document → Add content → Format → Export
```

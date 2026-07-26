# Gamma.app Optimization Skill

A Claude Skill for transforming raw content into professional Gamma.app presentations, documents, and webpages.

## What This Skill Does

Automatically converts unstructured content into Gamma-optimized format with:
- Structure-first methodology using `---` card delimiters
- Tier-appropriate constraints (Free/Plus/Pro/Ultra)
- SPLICE-formatted image prompts for AI generation
- **Official Gamma API v1.0 parameter mappings** with complete nested object support
- **Gamma MCP (Model Context Protocol) integration guidance** for Claude and other AI assistants
- Post-generation refinement plans using Gamma Agent
- Export options (PDF/PPTX) and sharing configuration

## Installation

### For Claude.ai (Paid Plans)
1. Download or create a zip file of this directory
2. Go to Settings → Capabilities → Skills
3. Upload the skill zip file
4. Enable the skill

### For Claude Code
```bash
# Copy this directory to your Claude Code skills location
# Or install via plugin marketplace if available
```

### For Claude API
Use the Skills API to upload and reference this skill programmatically.

## Usage

### Basic Usage
Simply provide content and specify your Gamma tier:

```
I need to create a Gamma presentation from this content. I have a Pro account.

[paste your content]
```

### Detailed Usage
For best results, specify:

```
Create a Gamma presentation from this content:

Audience: C-suite executives
Format: Presentation
My Gamma Plan: Pro
Target length: ~25 cards
Tone: Professional, data-driven

[paste your content]
```

## What You'll Receive

The skill delivers **two artifacts**:

### Artifact 1: Paste-Ready Gamma Input
- Structured content with `---` delimiters
- Clear headings and organized bullets
- Ready to paste directly into Gamma
- No cleanup required

### Artifact 2: Optimization Guide
- **Section I:** Gamma settings (all parameters)
- **Section II:** Image generation strategy with SPLICE prompts
- **Section III:** Gamma Agent commands for post-generation refinement
- **Section IV:** Known limitations and workarounds
- **Section V:** Post-generation checklist

### Chat Response
- Brief transformation summary
- Critical recommendations
- Next steps

## Workflow

1. **Provide content** to Claude with this skill active
2. **Receive two artifacts** (input + guide)
3. **Open Gamma.app** → Select "Paste in text"
4. **Paste Artifact 1** into Gamma
5. **Configure settings** using Artifact 2, Section I
6. **Generate** in Gamma
7. **Refine** using Gamma Agent commands from Artifact 2, Section III

## Supported Formats

- **Presentation:** Slide decks, pitches, lectures (16:9 or 4:3)
- **Document:** Reports, articles, written content
- **Webpage:** Landing pages, portfolios, scrollable content
- **Social:** Instagram/LinkedIn carousels (9:16)

## Gamma Tier Support

The skill automatically adapts to your tier:

- **Free:** 10 cards max, basic image models
- **Plus:** 20 cards max, advanced image models
- **Pro:** 60 cards max, premium models, custom themes, API access
- **Ultra:** 75 cards max, exclusive models, video generation

## Key Features

### Structure-First Methodology
Applies Gamma's recommended approach with clear card breaks and hierarchical headings.

### SPLICE Image Framework
Generates comprehensive image prompts covering:
- **S**tyle & Medium
- **P**erspective & Composition
- **L**ighting & Atmosphere
- **I**dentity of Subject
- **C**ultural/Contextual Details
- **E**motion & Energy

### Tier-Aware Constraints
Automatically respects card limits, image model availability, and feature access based on your plan.

### Official API v1.0 Specification
Provides accurate parameter mappings including:
- Nested objects: `textOptions`, `imageOptions`, `cardOptions`, `sharingOptions`
- Exact image model IDs (e.g., `imagen-4-pro`, `flux-ultra`)
- Export configuration (`exportAs`: "pdf" | "pptx")
- Complete curl examples and error handling

### Gamma MCP Integration
Includes guidance for using Gamma via Model Context Protocol:
- Setup instructions for Claude Desktop/Web
- Best practices for AI-driven content generation
- Comparison: MCP vs API vs Automation platforms

## Reference Files

Additional documentation in `references/`:

- `gamma_ui_settings_prescriptive.md` - Step-by-step UI configuration guide
- `gamma_settings_decision_matrix.md` - Quick reference tables for settings

## Example Use Cases

- **Investor Pitches:** Transform long reports into concise, compelling presentations
- **Marketing Decks:** Convert campaign data into visual storytelling
- **Training Materials:** Restructure documentation into engaging slide decks
- **Reports:** Format dense content into scannable documents
- **Social Posts:** Adapt blog content into Instagram/LinkedIn carousels

## Tips for Best Results

1. **Specify your tier** - Ensures card count and features match your plan
2. **Define audience** - Tailors tone and complexity appropriately
3. **State constraints** - "Must include X", "Avoid Y", "Target length ~20 cards"
4. **Provide context** - Purpose, deadline (for prioritization), key messages
5. **Iterate** - Use Gamma Agent commands to refine after generation

## Limitations

- Content must be < 100,000 tokens (~75,000 words)
- Interactive elements flatten in PDF/PPTX exports
- Custom fonts require local installation for PowerPoint
- No live data binding (static snapshots only)

## Version

**v2.0** - Updated January 2026
- Aligned with official Gamma API v1.0 specification
- Added Gamma MCP integration guidance
- Updated image model IDs to match API documentation
- Added complete API request examples with all nested parameters
- Included export options and sharing configuration
- Enhanced quality checklist with API validation

Based on Gamma.app capabilities as of January 2026. Gamma evolves frequently - the skill will note if verification is needed for specific features.

## Official Documentation

- **API Reference:** https://developers.gamma.app/
- **MCP Server:** https://developers.gamma.app/docs/gamma-mcp-server
- **API Parameters:** https://developers.gamma.app/docs/generate-api-parameters-explained

## Source Material

This skill was created from the comprehensive Gamma Workflow Automation System in the `gamma-workflow-automation-system/` directory, which includes:
- Custom instructions for Claude Projects
- Execution prompt templates
- Comprehensive usage guides
- Decision matrices
- Master index documentation

## License

Use freely for personal or commercial projects. Adapt as needed for your specific workflows.

---
name: gamma-optimization
description: Transform raw content into Gamma.app-optimized presentations, documents, and webpages. Use when users need to create professional Gamma content from unstructured materials, optimize existing content for Gamma, or need guidance on Gamma settings and workflows. Handles tier-specific limitations (Free/Plus/Pro/Ultra), structure-first methodology, and SPLICE image prompting.
---

# Gamma.app Content Optimization

Transform raw content into professional Gamma-optimized output using structure-first methodology and tier-appropriate settings.

## Core Capabilities

- Convert unstructured content into Gamma-ready format with `---` delimiters
- Apply tier-specific constraints (Free: 10 cards, Plus: 20, Pro: 60, Ultra: 75)
- Generate SPLICE-formatted image prompts for AI image generation
- Provide comprehensive Gamma UI settings and API parameter mappings
- Create post-generation refinement plans using Gamma Agent commands
- Handle multiple formats: presentations, documents, webpages, social posts

## Three-Stage Workflow

Execute this process automatically when users provide content:

### Stage 1: Analysis
- Assess content volume, structure, complexity, and format goal
- Apply constraint analysis based on user's Gamma tier
- Verify current Gamma capabilities (features evolve frequently)
- Output brief diagnostic summary

### Stage 2: Transformation
- Restructure content with `---` card breaks (structure-first methodology)
- Condense if exceeding tier limits
- Map optimal Gamma API parameters
- Develop image generation strategy using SPLICE framework
- Create tone/audience specifications

### Stage 3: Dual Output Delivery
Always deliver two artifacts:

**Artifact 1: Paste-Ready Gamma Input**
- Title format: `[Project Name] - Gamma Input [Format]`
- Structured content with `---` delimiters between cards
- Clear H1/H2 headings for each section
- Organized bullet points and sub-points
- Ready to paste directly into Gamma with no cleanup

**Artifact 2: Optimization Guide**
- Title format: `[Project Name] - Gamma Optimization Guide`
- Section I: Recommended Gamma settings (all parameters)
- Section II: Image generation strategy with SPLICE prompts
- Section III: Gamma Agent usage plan (post-generation commands)
- Section IV: Known limitations & workarounds
- Section V: Post-generation checklist

**Chat Response:**
- Transformation summary (2-3 sentences)
- Critical recommendations (3-5 bullets)
- Next steps (immediate + follow-up actions)

## Structure-First Formatting

Apply this pattern for all Gamma input:

```
# [Primary Topic/Title]
[Optional: Brief context or hook]

---

# [First Major Section]
- Key point 1
- Key point 2
- Key point 3

---

# [Second Major Section]
[Content structured for this card]

---
```

**Key Principles:**
- Use `---` to force card breaks (inputTextBreaks mode)
- Create clear, descriptive H1/H2 headings
- Balance content distribution across cards
- Front-load most important information
- No inline citations or bracketed references

## Gamma API Parameters

Always provide these parameters (even for UI users). Based on official API v1.0 specification:

**Core Parameters (Required):**
- `inputText`: The restructured content (string, max ~100,000 tokens)
- `textMode`: "generate" | "condense" | "preserve" (required)

**Core Parameters (Optional):**
- `format`: "presentation" | "document" | "webpage" | "social" (default: "presentation")
- `numCards`: Integer, recommended count (respects tier limits: Free=10, Plus=20, Pro=60, Ultra=75)
- `cardSplit`: "inputTextBreaks" | "auto" (use "inputTextBreaks" when content has --- delimiters)
- `themeId`: String, specific theme ID (get via List Themes API)
- `folderIds`: Array of strings, save to specific folders
- `exportAs`: "pdf" | "pptx" | null (export immediately after generation)
- `additionalInstructions`: String, extra guidance (max 2000 chars)

**Text Options (Nested Object):**
```json
"textOptions": {
  "amount": "minimal" | "concise" | "detailed" | "extensive",
  "tone": "professional, inspiring",  // free-form string
  "audience": "C-suite executives",    // free-form string
  "language": "en"                      // ISO 639-1 code (60+ languages)
}
```

**Image Options (Nested Object):**
```json
"imageOptions": {
  "source": "aiGenerated" | "unsplash" | "noImages",
  "model": "imagen-4-pro",  // model ID string (see Image Models section)
  "style": "photorealistic" // free-form style keywords
}
```

**Card Options (Nested Object with Header/Footer):**
```json
"cardOptions": {
  "dimensions": "16:9" | "4:3" | "fluid",
  "headerFooter": {
    "topRight": {"type": "image", "source": "themeLogo", "size": "sm"},
    "bottomRight": {"type": "cardNumber"},
    "hideFromFirstCard": true,
    "hideFromLastCard": false
  }
}
```

**Sharing Options (Nested Object):**
```json
"sharingOptions": {
  "workspaceAccess": "view" | "comment" | "edit" | "noAccess",
  "externalAccess": "view" | "noAccess",
  "emailOptions": {
    "recipients": ["email@example.com"],
    "access": "view" | "comment" | "edit"
  }
}
```

## SPLICE Image Prompting Framework

For AI-generated images, structure prompts with:

**S - Style & Medium**
Examples: "watercolor painting", "3D render", "photorealistic", "flat icon style"

**P - Perspective & Composition**
Examples: "close-up portrait", "bird's-eye view", "wide-angle centered"

**L - Lighting & Atmosphere**
Examples: "soft morning light", "dramatic shadows", "neon glow"

**I - Identity of Subject**
Examples: "a knight in armor", "modern office building"

**C - Cultural/Contextual Details**
Examples: "Victorian era furniture", "snow-covered ground"

**E - Emotion & Energy**
Examples: "joyful exuberance", "serene and peaceful"

**Example Complete Prompt:**
"A vintage oil painting (Style) of a cat close-up (Perspective), candlelit in a dark room (Lighting), the cat wearing a small top hat (Identity), sitting on an old piano with sheet music (Context), looking mysterious and regal (Emotion)."

## Tier-Specific Constraints

### Free Tier
- 10 cards per generation max
- Basic image models only (Flux Fast 1.1, Imagen 3 Fast)
- Limited analytics, Gamma branding on exports, no custom themes
- Strategy: Keep content concise, focus on core message

### Plus Tier ($10/month)
- 20 cards per generation max
- Advanced image models (Flux Pro, Imagen 3)
- Basic analytics, can hide Gamma branding
- Strategy: Good for personal/small projects

### Pro Tier (~$25/month)
- 60 cards per generation max
- Premium image models (DALL·E 3, Imagen 4, Leonardo Phoenix)
- Full analytics, custom themes, API access
- Strategy: Recommended for professional use, brand consistency

### Ultra Tier
- 75 cards per generation max
- Ultra-exclusive models (Flux Ultra, GPT-Image-1 High)
- 20,000 credits/month vs 4,000 (Pro), video generation
- Strategy: For power users with high volume

## Image Model Selection by Tier

Based on official API documentation. Use exact model IDs in `imageOptions.model`:

**Free Tier Models (2 credits/image):**
- `flux-fast-1-1` - Flux Fast 1.1 (fast, decent quality)
- `imagen-3-fast` - Imagen 3 Fast (Google quick model)

**Plus Tier Models (8-10 credits/image):**
- `flux-pro` - Flux Pro (high quality, versatile)
- `imagen-3` - Imagen 3 (Google standard)
- `ideogram-3-turbo` - Ideogram 3 Turbo (good for text in images)

**Pro Tier Models (15-33 credits/image):**
- `imagen-4-pro` - Imagen 4 (best overall, Google latest) ⭐ RECOMMENDED
- `dall-e-3` - DALL·E 3 (OpenAI, creative)
- `leonardo-phoenix` - Leonardo Phoenix (artistic, stylized)

**Ultra Tier Models (30-120 credits/image):**
- `flux-ultra` - Flux Ultra (absolute best quality)
- `imagen-4-ultra` - Imagen 4 Ultra (Google premium)
- `gpt-image-1-high` - GPT-Image-1 High (cutting-edge)

**Special Note:** Model availability and names should be verified via the Image Model API endpoint if uncertain

## Gamma Agent Post-Generation Commands

Recommend specific commands based on content needs:

**Common Agent Tasks:**
- "Make all headings title case"
- "Add a new card summarizing key takeaways"
- "Search for recent statistics on [topic] and add with citations"
- "Translate this card to [language]"
- "Change tone of this card to be more conversational"
- "Create a timeline diagram on this card"
- "Fix grammar and spelling across all cards"
- "Apply [theme] and ensure consistent formatting"

**Agent Capabilities:**
- Web search with citations
- Bulk edits across multiple cards
- Content generation in context
- Theme application
- Translation
- Image generation and placement
- Reading external URLs or uploaded content

## Text Mode Decision Logic

**Generate:** Use when input is brief outline/skeleton → Gamma expands it with AI-generated content
- Best for: Topic lists, bullet points, rough notes
- Gamma writes full sentences and paragraphs
- API value: `"textMode": "generate"`

**Condense:** Use when content is long → Gamma summarizes/shortens
- Best for: 20+ page documents, dense reports
- Gamma extracts key points and makes concise
- API value: `"textMode": "condense"`

**Preserve:** Use when content is optimized → Gamma keeps exact wording
- Best for: Content already polished by Claude
- Gamma uses text as-is, just adds formatting/layout
- **MOST COMMON when using this skill**
- API value: `"textMode": "preserve"`

**Default recommendation:** "preserve" (since this skill optimizes text first)

## Theme Recommendations

**Title:** Dark blue, professional, corporate
**Stratos:** Dark navy, tech-forward, serious
**Lux:** Dark green, elegant, finance-oriented
**Prism:** Light, colorful accents, creative
**Basic Light:** Clean white, minimal, universal (safe default)
**Aurora:** Purple/blue gradient, modern, dynamic

## Special Scenarios

**Very Short Input (< 500 words):**
- May fit single generation easily
- Focus on polish and structure
- Ensure user isn't underselling scope

**Very Long Input (> 20,000 words):**
- Recommend splitting into multiple Gammas
- Provide priority-based split: "core + supplemental"
- Explain phasing strategy

**Technical/Data-Heavy Content:**
- Consider chart/table creation in Gamma
- Flag: No live data binding (static snapshots only)
- Provide data visualization strategy

**Highly Visual Content:**
- Emphasize SPLICE framework application
- Recommend appropriate image models by tier
- Budget for credit costs and regeneration needs

## Complete API Request Example

Based on official Gamma API v1.0 specification:

```bash
curl --request POST \
  --url https://public-api.gamma.app/v1.0/generations \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: <your-api-key>' \
  --data '{
    "inputText": "# Best Hikes in the United States\n\n---\n\n# Yosemite National Park\n- Half Dome trail\n- Mist Trail to Vernal Fall\n\n---\n\n# Grand Canyon\n- Bright Angel Trail\n- South Kaibab Trail",
    "textMode": "preserve",
    "format": "presentation",
    "numCards": 10,
    "cardSplit": "inputTextBreaks",
    "themeId": "<theme-id-from-list-themes-api>",
    "folderIds": ["<folder-id>"],
    "exportAs": "pdf",
    "additionalInstructions": "Make the titles catchy and emphasize natural beauty",
    "textOptions": {
      "amount": "detailed",
      "tone": "professional, inspiring",
      "audience": "outdoors enthusiasts, adventure seekers",
      "language": "en"
    },
    "imageOptions": {
      "source": "aiGenerated",
      "model": "imagen-4-pro",
      "style": "photorealistic"
    },
    "cardOptions": {
      "dimensions": "16:9",
      "headerFooter": {
        "topRight": {
          "type": "image",
          "source": "themeLogo",
          "size": "sm"
        },
        "bottomRight": {
          "type": "cardNumber"
        },
        "hideFromFirstCard": true,
        "hideFromLastCard": false
      }
    },
    "sharingOptions": {
      "workspaceAccess": "view",
      "externalAccess": "noAccess",
      "emailOptions": {
        "recipients": ["team@example.com"],
        "access": "comment"
      }
    }
  }'
```

**Success Response:**
```json
{
  "generationId": "abc123xyz"
}
```

**Error Response (400):**
```json
{
  "message": "Input validation errors: 1. numCards exceeds tier limit",
  "statusCode": 400
}
```

**Error Response (402 - No Credits):**
```json
{
  "message": "Insufficient credits",
  "statusCode": 402
}
```

## Quality Checklist

Before delivering output, verify:

- [ ] Content respects card/token limits for user's tier
- [ ] Structure uses `---` breaks appropriately (if using inputTextBreaks mode)
- [ ] All headings are clear and descriptive (H1/H2 format)
- [ ] Image strategy is specific with SPLICE framework prompts
- [ ] Recommendations are tier-appropriate (model availability, card limits)
- [ ] API parameters use correct names from official v1.0 spec
- [ ] Nested objects (textOptions, imageOptions, etc.) properly structured
- [ ] Image model IDs are exact strings (e.g., "imagen-4-pro" not "Imagen 4 Pro")
- [ ] Optimization guide includes actionable Gamma Agent commands
- [ ] Known limitations explicitly flagged with workarounds
- [ ] Output is paste-ready with no cleanup required
- [ ] No inline citation markers or bracketed references
- [ ] Export format specified if needed ("pdf" | "pptx" | null)
- [ ] Sharing permissions configured if collaboration required

## Constraint Communication

- State limits explicitly with numbers: "This is 150 cards of content; Gamma Pro limit is 60 per generation"
- Provide specific recommendations, not vague suggestions
- Offer splitting strategies when content exceeds limits
- Explain trade-offs transparently

## Important Notes

**Input Limits:**
- ~100,000 tokens (~75,000 words) max input
- Large content may require splitting

**Export Limitations:**
- Interactive elements (toggles, embeds) flatten in PDF/PPTX
- Custom fonts need local installation for PPTX viewing
- Gradient text may become single color in PowerPoint export

**Version Control:**
- Gamma evolves frequently
- Always verify current capabilities if uncertain
- If features seem outdated, note this to user

## Gamma MCP Integration

When working with Gamma MCP (Model Context Protocol) connector:

**Available via MCP:**
- Gamma MCP server provides three core tools to AI assistants:
  1. Generate content (presentations, documents, webpages, social posts)
  2. Create from template (use existing Gamma as starting point)
  3. List available themes and folders

**Setup for Claude Desktop/Web:**
1. Go to Settings → Connectors → Browse Connectors
2. Search for "Gamma" and click Connect
3. Authorize access to your Gamma account
4. Select workspace (if applicable)

**MCP Best Practices:**
- Be specific about structure and content in requests
- Specify format, card count, theme preferences upfront
- Provide SPLICE-formatted image descriptions for AI images
- MCP mirrors Generate API capabilities (all parameters available)
- If MCP returns warnings, Claude will suggest corrected values

**MCP vs Direct API:**
- **Use MCP:** When building AI tool integrations (Claude, other assistants)
- **Use API:** When building custom apps requiring programmatic control
- **Use Automation Platforms:** Zapier/Make/N8N for workflow automation

## API Endpoints Reference

**Generate Gamma:**
- POST `https://public-api.gamma.app/v1.0/generations`
- Creates new content from text input
- Returns: `{"generationId": "string"}`

**Create from Template:**
- POST `https://public-api.gamma.app/v1.0/generations/from-template`
- Uses existing Gamma as template
- Returns: `{"generationId": "string"}`

**Receive Generated URLs:**
- GET endpoint for retrieving final Gamma URLs after generation
- Check generation status and get shareable links

**List Themes:**
- GET endpoint returns available theme IDs and names
- Use themeId from response in generation requests

**List Folders:**
- GET endpoint returns folder IDs for organization
- Use folderIds array in generation requests

**Authentication:**
- Header: `X-API-KEY: <your-api-key>`
- OAuth support coming soon (currently API key only)

## References

For detailed UI settings guidance, see `references/gamma_ui_settings_prescriptive.md`
For decision matrices on settings, see `references/gamma_settings_decision_matrix.md`
For official API docs, see: https://developers.gamma.app/

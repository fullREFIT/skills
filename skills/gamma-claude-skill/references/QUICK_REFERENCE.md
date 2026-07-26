# Gamma API Quick Reference Card

## Common Use Cases with API Examples

### 1. Basic Presentation (Most Common)

```json
{
  "inputText": "# Topic\n\n---\n\n# Section 1\n- Point A\n- Point B",
  "textMode": "preserve",
  "format": "presentation",
  "numCards": 15,
  "cardSplit": "inputTextBreaks",
  "textOptions": {
    "amount": "detailed",
    "language": "en"
  },
  "imageOptions": {
    "source": "aiGenerated",
    "model": "imagen-4-pro"
  }
}
```

**Use for**: Standard pitch decks, client presentations, internal updates

---

### 2. Investor Pitch with Export

```json
{
  "inputText": "[Your content with --- breaks]",
  "textMode": "preserve",
  "format": "presentation",
  "numCards": 20,
  "exportAs": "pdf",
  "textOptions": {
    "tone": "professional, confident",
    "audience": "investors, venture capitalists",
    "amount": "detailed"
  },
  "imageOptions": {
    "source": "aiGenerated",
    "model": "imagen-4-pro",
    "style": "modern, clean, professional photography"
  },
  "cardOptions": {
    "dimensions": "16:9"
  }
}
```

**Use for**: Funding pitches, board presentations

---

### 3. Quick Social Media Carousel

```json
{
  "inputText": "[5-8 cards of content]",
  "textMode": "preserve",
  "format": "social",
  "numCards": 6,
  "textOptions": {
    "amount": "concise",
    "tone": "engaging, conversational"
  },
  "imageOptions": {
    "source": "aiGenerated",
    "model": "flux-pro",
    "style": "vibrant, eye-catching, instagram aesthetic"
  },
  "cardOptions": {
    "dimensions": "9:16"
  }
}
```

**Use for**: Instagram/LinkedIn carousels, social campaigns

---

### 4. Technical Documentation

```json
{
  "inputText": "[Detailed technical content]",
  "textMode": "preserve",
  "format": "document",
  "numCards": 45,
  "textOptions": {
    "amount": "extensive",
    "tone": "technical, precise",
    "audience": "developers, engineers"
  },
  "imageOptions": {
    "source": "unsplash"
  },
  "cardOptions": {
    "dimensions": "fluid"
  }
}
```

**Use for**: API docs, technical guides, system documentation

---

### 5. Team Collaboration with Sharing

```json
{
  "inputText": "[Project content]",
  "textMode": "preserve",
  "format": "presentation",
  "folderIds": ["team-folder-id"],
  "sharingOptions": {
    "workspaceAccess": "edit",
    "emailOptions": {
      "recipients": ["team@company.com"],
      "access": "comment"
    }
  }
}
```

**Use for**: Collaborative projects, team presentations

---

### 6. High-Quality Marketing Deck

```json
{
  "inputText": "[Marketing content]",
  "textMode": "preserve",
  "format": "presentation",
  "themeId": "aurora-theme-id",
  "numCards": 25,
  "textOptions": {
    "tone": "compelling, aspirational",
    "audience": "potential customers, prospects",
    "amount": "detailed"
  },
  "imageOptions": {
    "source": "aiGenerated",
    "model": "flux-ultra",
    "style": "luxurious, premium, editorial photography"
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
      }
    }
  }
}
```

**Use for**: Product launches, brand presentations (Ultra tier)

---

### 7. Quick Draft with AI Expansion

```json
{
  "inputText": "Product overview\n- Key features\n- Market opportunity\n- Team\n- Roadmap",
  "textMode": "generate",
  "format": "presentation",
  "numCards": 12,
  "textOptions": {
    "amount": "detailed"
  },
  "imageOptions": {
    "source": "noImages"
  }
}
```

**Use for**: Rapid prototyping, brainstorming sessions

---

### 8. Summarize Long Report

```json
{
  "inputText": "[20+ pages of dense content]",
  "textMode": "condense",
  "format": "presentation",
  "numCards": 15,
  "textOptions": {
    "amount": "concise",
    "tone": "executive summary style"
  },
  "imageOptions": {
    "source": "unsplash"
  }
}
```

**Use for**: Executive summaries, condensed reports

---

## Image Model Selection by Quality Need

| Need | Model | Cost | Use Case |
|------|-------|------|----------|
| **Fast iteration** | `flux-fast-1-1` | 2 credits | Testing, drafts |
| **Standard quality** | `flux-pro` | 8 credits | Most presentations |
| **Best balanced** | `imagen-4-pro` ⭐ | 15 credits | Professional work |
| **Maximum quality** | `flux-ultra` | 120 credits | Premium deliverables |

---

## Card Count Guidelines

| Content Length | Estimated Cards | Time to Present |
|----------------|-----------------|-----------------|
| 1 page text | 2-3 cards | 2-3 minutes |
| 5 pages text | 10-15 cards | 10-15 minutes |
| 10 pages text | 20-30 cards | 20-30 minutes |
| 20 pages text | 40-60 cards | 40+ minutes |

**Rule of thumb**: 1 minute speaking ≈ 1-2 cards

---

## Tier Limits Quick Check

| Tier | Max Cards | Best Model Available | Monthly Credits |
|------|-----------|----------------------|-----------------|
| Free | 10 | imagen-3-fast | Limited |
| Plus | 20 | flux-pro | Moderate |
| Pro | 60 | imagen-4-pro | 4,000 |
| Ultra | 75 | flux-ultra | 20,000 |

---

## Common Mistakes to Avoid

❌ **Wrong**: `"model": "Imagen 4 Pro"`
✅ **Right**: `"model": "imagen-4-pro"`

❌ **Wrong**: `"textOptions": "detailed"`
✅ **Right**: `"textOptions": {"amount": "detailed"}`

❌ **Wrong**: Forgetting required `textMode` parameter
✅ **Right**: Always include `"textMode": "preserve"` (or generate/condense)

❌ **Wrong**: Using card breaks without setting cardSplit
✅ **Right**: Use `"cardSplit": "inputTextBreaks"` when content has `---`

---

## MCP Quick Start (Claude)

1. **Connect**: Settings → Connectors → Search "Gamma" → Connect
2. **Authorize**: Allow access to your Gamma account
3. **Use**: Ask Claude to create Gamma presentations naturally
4. **Example prompt**:
   ```
   Create a Gamma presentation about [topic].
   Make it 15 cards, professional tone, use imagen-4-pro for images.
   Theme: modern and clean. Format: 16:9 presentation.
   ```

---

## API Endpoints Cheat Sheet

| Action | Method | Endpoint |
|--------|--------|----------|
| Generate content | POST | `/v1.0/generations` |
| Use template | POST | `/v1.0/generations/from-template` |
| Get status/URLs | GET | (use generationId from response) |
| List themes | GET | (themes endpoint) |
| List folders | GET | (folders endpoint) |

**Auth**: Include header `X-API-KEY: <your-api-key>`

---

## SPLICE Image Prompt Template

For best AI-generated images, use this structure:

```
[Style] [Perspective] subject doing [action], [Lighting],
[Cultural/contextual details], [Emotion/mood]
```

**Example**:
```
"A photorealistic close-up of a laptop on a modern desk,
soft natural window light, minimalist Scandinavian office,
productive and focused atmosphere"
```

---

**Quick Tip**: Start with `"textMode": "preserve"` and detailed content for best results. Let Gamma focus on design while you control the message.

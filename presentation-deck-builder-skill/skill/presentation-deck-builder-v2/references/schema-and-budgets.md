# Report schema and content budgets

The renderer validates each report with `src/report-validation.ts` and `src/content-budgets.ts`. This reference describes the public v2 contract. When this document and the validator disagree, the validator wins.

## Top-level report

```jsonc
{
  "version": "1.0.0",
  "slug": "kebab-case-slug",
  "title": "Deck title",
  "subtitle": "Optional framing line",
  "topic": "Subject",
  "date": "2026-01-01",
  "brand": {
    "name": "Applied by the adapter",
    "theme": "applied-profile-id",
    "wordmark": {
      "fullText": "Applied wordmark",
      "slashColor": "#D43B2A",
      "tagline": "Optional verified tagline"
    }
  },
  "modeDefaults": {
    "defaultMode": "presenter",
    "showHelpHint": true,
    "showProgressRail": true
  },
  "intro": {},
  "methodology": {},
  "items": [],
  "closing": {},
  "seo": {}
}
```

The brand adapter replaces the `brand` object and updates the isolated renderer’s allowed palette. Authors can leave the template’s Carbon Forge values in place before running the adapter.

## Intro

```jsonc
{
  "label": "DECISION BRIEF",
  "title": "What this presentation decides",
  "subtitle": "Optional subtitle",
  "summary": "Maximum 85 words.",
  "proofStats": [
    { "label": "ITEMS", "value": "4" }
  ],
  "tags": ["operations", "research"]
}
```

Stat labels have a maximum of 14 characters.

## Methodology

```jsonc
{
  "label": "METHOD",
  "title": "How the evidence was evaluated",
  "body": [
    "Each paragraph has a maximum of 85 words."
  ]
}
```

## Report item

```jsonc
{
  "id": "r-01",
  "rankLabel": "01",
  "itemClass": "ranked",
  "category": "WORKFLOW / DECISION",
  "layer": "systems",
  "title": "Item title",
  "headline": "Maximum 18 words",
  "thesis": "Maximum 32 words",
  "whyLabel": "WHY IT MATTERS",
  "whyBody": "Maximum 85 words.",
  "takeaway": "Maximum 24 words.",
  "verdict": {},
  "stats": [],
  "highlights": [],
  "sources": [],
  "tags": [],
  "tabs": [],
  "furtherReading": []
}
```

`itemClass` accepts `hidden`, `ranked`, `sponsor`, or `appendix`.

`layer` accepts:

- `systems`: primary accent allowed
- `teams`: secondary gold emphasis allowed
- `neutral`: no layer accent

## Verdict

```jsonc
{
  "state": "TEST",
  "fit": "Who this is for",
  "effort": "MEDIUM",
  "whyNow": "Maximum 24 words.",
  "risks": ["Maximum three risks"],
  "nextStep": "Concrete next action"
}
```

`state` accepts `USE`, `WATCH`, `IGNORE`, `REPLICATE`, or `TEST`.

`effort` accepts `LOW`, `MEDIUM`, or `HIGH`.

## Stats and highlights

```jsonc
{
  "stats": [
    { "label": "STATUS", "value": "READY", "emphasis": "red" }
  ],
  "highlights": [
    { "title": "Short title", "body": "Maximum 24 words." }
  ]
}
```

A report item can contain at most four stats and four highlights. Highlight titles have a maximum of five words.

`emphasis` accepts `neutral`, `red`, or `gold`. Gold is allowed only when `layer` is `teams`.

## Sources

```jsonc
{
  "label": "Source name",
  "url": "https://example.com/source",
  "domain": "example.com",
  "type": "article"
}
```

Source labels have a maximum of 24 characters. Source type accepts `github`, `docs`, `tweet`, `youtube`, `issue`, `article`, or `other`.

Every item needs at least one `https` source.

## Tabs

```jsonc
{
  "id": "source",
  "type": "source",
  "label": "SOURCE",
  "title": "Read the source before adopting",
  "body": "Maximum 85 words per paragraph.",
  "embed": {},
  "stats": [],
  "highlights": [],
  "links": []
}
```

Each item needs exactly one `summary` tab. Other tab types are `source`, `proof`, `tweet`, `video`, `controversy`, `mechanics`, `decision`, and `further-reading`.

Tab labels have a maximum of 16 characters. Tab IDs must be unique within each item.

## Embeds

Supported embed kinds:

| Kind | Expected value |
| --- | --- |
| `github-card` | `https://github.com/owner/repository` |
| `tweet` | Public X status URL |
| `youtube` | Public YouTube URL |
| `image` | `https` thumbnail URL |
| `html` | Self-contained HTML supplied by the report author |

Embeds degrade to a link when they cannot load. Review supplied HTML before deployment.

## Closing and SEO

```jsonc
{
  "closing": {
    "label": "NEXT",
    "title": "What happens now",
    "body": ["Maximum 85 words per paragraph."],
    "cta": {
      "label": "Read the guide",
      "url": "https://example.com/guide"
    }
  },
  "seo": {
    "title": "Browser title",
    "description": "Sharing description",
    "ogImage": "https://example.com/image.png"
  }
}
```

## Hard budgets

| Field | Limit |
| --- | --- |
| Item headline | 18 words |
| Item thesis | 32 words |
| Body paragraph | 85 words |
| Item takeaway | 24 words |
| Highlight title | 5 words |
| Highlight body | 24 words |
| Verdict why-now text | 24 words |
| Stat label | 14 characters |
| Source label | 24 characters |
| Tab label | 16 characters |
| Item stats | 4 |
| Item highlights | 4 |
| Verdict risks | 3 |

## Structural rules

- Report and item IDs must be unique in their scope.
- The slug must be kebab-case.
- The date must use `YYYY-MM-DD`.
- Unknown fields are rejected.
- Every URL must start with `https://`.
- The wordmark accent color must belong to the active profile palette.
- The adapter applies the active brand before validation.

## Validate

Run inside a prepared renderer:

```bash
npm run validate
```

A successful result identifies the report slug and item count. Fix the JSON and rerun when the validator names a failing field.

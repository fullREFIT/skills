# Instagram Format Specifications

Platform rules for the IG-instagram-carousel/ deliverable.

## Image Format

| Attribute | Value |
|-----------|-------|
| Dimensions | 1080×1080 px (square) |
| Format | PNG |
| Color space | sRGB |
| Min file size | 5 KB per image |
| Max total size | 30 MB combined (Instagram comfort zone) |
| Slide count | Matches LinkedIn carousel (6–10 slides) |

Source: PNGs are copied directly from `LIC-linkedin-carousel/slides/slide-*.png`. The LinkedIn carousel uses the same 1080×1080 square format, so no re-rendering is needed.

## Caption Rules

| Rule | Detail |
|------|--------|
| Max length | 2,200 characters (Instagram limit) |
| Opening line | Same live wire as LinkedIn post — identical or very close. No re-angling. |
| CTA | Same CTA family as LinkedIn; adapt copy for IG character limits |
| Link handling | No link in caption body. End with "link in bio" or "(link in first comment)" |
| Hashtags | 5–10 tags at end of caption. Lowercase, no spaces, no branded terms per Module B. |
| Punctuation | No exclamation points, no em dashes, no semicolons, no emoji |
| Voice | Full four-module TOV OS compliance — same as LinkedIn post |

## Hashtag Selection

Choose hashtags that:
- Reflect the content's cluster and live wire (not generic AI/productivity terms)
- Match the ICA's search behavior on Instagram (what they'd actually follow)
- Mix broad (reach) and specific (relevance): 2–3 broad, 3–5 niche
- No branded hashtags (replace with your own brand handles) per your brand guidelines

Example hashtag mix for AI operations content:
```
#aioperations #aiagents #agentdesign #llmops #operationsai #aitools #productivityai #automationai
```

## Cross-format Consistency

The IG carousel is a direct copy of the LinkedIn carousel. Content consistency is guaranteed by the copy operation — there is no re-angling, re-writing, or editorial variation for Instagram. The only differences from LinkedIn are:

1. File format: separate PNGs instead of a PDF
2. Caption: derived from the LinkedIn post, adapted for IG character limits and "link in bio" convention

Any editorial drift between IG and LinkedIn is a production error.

## Caption File Format

```markdown
# Instagram Caption — {slug} · {MMDDYY}

---

{caption text here}

{hashtags here}
```

## Accessibility

For each slide, the caption or alt text (where the platform supports it) should describe:
- The key headline or claim on that slide
- Any data or list items visible on the slide

Instagram's alt text field is set manually at publish time — note the key text per slide at the bottom of the caption file if needed.

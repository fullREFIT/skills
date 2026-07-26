# TikTok Format Specifications

Carbon Forge platform rules for the TT-tiktok-carousel/ deliverable.

## Image Format

| Attribute | Value |
|-----------|-------|
| Dimensions | 1080×1920 px (9:16 vertical) |
| Format | PNG |
| Color space | sRGB |
| Min file size | 5 KB per image |
| Slide count | Matches LinkedIn carousel (6–10 slides) |
| TikTok max slides | 35 (10 is sufficient for content parity) |

Source: PNGs are rendered from vertical HTML slides via Playwright Chromium. Each slide is independently verified at 1080×1920.

## Caption Rules

| Rule | Detail |
|------|--------|
| Max length | 4,000 characters (TikTok limit) |
| Opening line | Same live wire as LinkedIn post — identical or very close. No re-angling. |
| Length target | Shorter than LinkedIn: retain core tension + CTA, trim extended body |
| CTA | Same CTA family as LinkedIn; adapt copy for TikTok format |
| Link handling | No link in caption. End with "link in bio" |
| Hashtags | 3–8 tags at end or inline. No spaces, lowercase, no branded terms per Module B. |
| Punctuation | No exclamation points, no em dashes, no semicolons, no emoji |
| Voice | Full four-module TOV OS compliance |

## Hashtag Selection

TikTok hashtags serve discoverability differently than Instagram:
- 3–8 tags (fewer is often better on TikTok)
- Mix: 1–2 very broad (#ai #business), 2–3 mid-tier (#aiagents #operations), 1–2 niche
- Prioritize tags that perform on TikTok's content graph, not just SEO terms
- No branded hashtags per Module B rules

Example hashtag mix for AI operations content:
```
#aiagent #aioperations #llmops #agentai #aitools #automationai #operationsai
```

## Cross-format Consistency

The TikTok carousel is a vertical reflow of the LinkedIn carousel. Content consistency is guaranteed by extracting content verbatim from the LinkedIn HTML slides. The only differences from LinkedIn are:

1. Canvas: 1080×1920 instead of 1080×1080
2. Font sizes: scaled up per tt-reflow-rules.md
3. Caption: adapted for TikTok character limits and "link in bio" convention

Any editorial drift between TikTok and LinkedIn is a production error. The content sync check in step 6 of the skill enforces this.

## Caption File Format

```markdown
# TikTok Caption — {slug} · {MMDDYY}

---

{caption text here}

{hashtags here}
```

## Sound Recommendation (optional)

For text-heavy carousels, note at the bottom of the caption file:
- "Suggested audio: silent / minimal ambient"
- Do not suggest trending audio that would conflict with brand voice or require licensing

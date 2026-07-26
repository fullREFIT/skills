# TikTok Carousel Forge — Brand Configuration

Fill in these values for your brand before using the skill.
The reflow rules in `references/tt-reflow-rules.md` read from this file.

## Brand Tokens

```
BRAND_NAME: Your Brand        # e.g. "Acme Corp"
BRAND_WORDMARK_HTML: |
  <span style="font-family:Outfit,sans-serif; font-weight:400; font-size:22px; letter-spacing:-0.01em; color:#F2F0EE;">
    <span style="font-weight:400;">your</span><span style="color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">BRAND</span>
  </span>

BRAND_TAGLINE_HTML: |
  <div style="font-family:'JetBrains Mono',monospace; font-weight:500; font-size:13px; letter-spacing:0.06em; text-transform:uppercase;">
    <span style="color:#F2F0EE;">YOUR TAGLINE.</span> <span style="color:#FFB400;">SECOND PART.</span>
  </div>
```

## Brand Colors

| Token | Value | Role |
|-------|-------|------|
| `BRAND_BG` | `#121010` | Background (dark) |
| `BRAND_ACCENT` | `#D43B2A` | Primary accent (red) |
| `BRAND_GOLD` | `#FFB400` | Secondary accent (gold) |
| `BRAND_TEXT` | `#F2F0EE` | Primary text (off-white) |
| `BRAND_MUTED` | `#878E88` | Muted text (gray) |

## Fonts

This skill uses Google Fonts by default:
- **Outfit** (weights 400, 700, 900) — headlines and body
- **JetBrains Mono** (weights 400, 600, 700) — labels and counters

Replace the Google Fonts CDN link in the HTML shell if you use different fonts.

## File Naming Conventions

| Token | Description | Example |
|-------|-------------|---------|
| `{slug}` | Kebab-case content identifier | `my-topic-name` |
| `{MMDDYY}` | Date of production | `072426` |

## Design System Name

Replace references to "Carbon Forge" in skill instructions with your own design system name,
or leave them as-is if you're using this skill standalone.

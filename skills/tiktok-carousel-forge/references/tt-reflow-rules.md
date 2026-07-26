# TikTok Vertical Reflow Rules

Rules for converting a Carbon Forge LinkedIn carousel (1080×1080, square) to a TikTok vertical carousel (1080×1920, 9:16). Content stays identical — only dimensions and font sizes change.

## Dimensional Differences

| Attribute | LinkedIn/IG 1080×1080 | TikTok 1080×1920 |
|---|---|---|
| Aspect ratio | 1:1 | 9:16 |
| Canvas | 1080×1080 | 1080×1920 |
| Vertical space | 1080px | 1920px (+840px, +78%) |
| Horizontal space | 1080px | 1080px (unchanged) |
| Reading pattern | Central focus | Top-to-bottom flow |

## HTML Shell (Vertical Base Template)

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1920px; overflow:hidden; font-family:Outfit,sans-serif; }
</style>
</head>
<body>
<div style="width:1080px; height:1920px; background:#121010; position:relative;">

  <!-- HEADER — same position and size as square -->
  <div style="position:absolute; top:60px; left:80px; right:80px; display:flex; justify-content:space-between; align-items:center;">
    <!-- WORDMARK left, SLIDE COUNTER right -->
  </div>

  <!-- CONTENT ZONE — top:200px bottom:200px (was 140px in square) -->
  <div style="position:absolute; top:200px; left:80px; right:80px; bottom:200px; display:flex; align-items:center;">
    <div style="width:100%;">
      <!-- SLIDE CONTENT HERE -->
    </div>
  </div>

  <!-- FOOTER — same position and size as square -->
  <div style="position:absolute; bottom:60px; left:80px; right:80px; display:flex; justify-content:space-between; align-items:flex-end;">
    <!-- WORDMARK left, TAGLINE right -->
  </div>

</div>
</body></html>
```

## Shared Components (identical to square)

Set your brand tokens in `config.example.md` before using these templates.

**Wordmark** (header and footer) — replace with your `BRAND_WORDMARK_HTML` from config:
```html
<span style="font-family:Outfit,sans-serif; font-weight:400; font-size:22px; letter-spacing:-0.01em; color:#F2F0EE;">
  <span style="font-weight:400;">your</span><span style="color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">BRAND</span>
</span>
```

**Slide counter** (top right):
```html
<div style="font-family:'JetBrains Mono',monospace; font-weight:600; font-size:18px; color:#878E88; letter-spacing:0.04em;">01 / 08</div>
```

**Footer tagline** — replace with your `BRAND_TAGLINE_HTML` from config:
```html
<div style="font-family:'JetBrains Mono',monospace; font-weight:500; font-size:13px; letter-spacing:0.06em; text-transform:uppercase;">
  <span style="color:#F2F0EE;">YOUR TAGLINE.</span> <span style="color:#FFB400;">SECOND PART.</span>
</div>
```

## Reflow Scale Table

Apply these changes per element when converting from square to vertical:

| Element | Square size | Vertical size | Note |
|---------|------------|---------------|------|
| Gold label (JetBrains Mono) | 20px | 20px | unchanged |
| Slide counter | 18px | 18px | unchanged |
| Wordmark | 22px | 22px | unchanged |
| Footer tagline | 13px | 13px | unchanged |
| Hook headline | 74–92px / weight 900 | 92px / weight 900 | use 92px for all hooks |
| Lever/section headline | 60–68px / weight 700 | 72–78px / weight 700 | scale up ~15% |
| Body text (hook sub) | 38–46px / weight 400 | 46px / weight 400 | use 46px consistently |
| Body text (lever body) | 28–34px / weight 400 | 34–38px / weight 400 | scale up ~10% |
| Arrow bullet items | 30–34px | 34px | use 34px consistently |
| Gold statement | 32–38px / weight 700 | 38–42px / weight 700 | scale up ~10% |
| Red closing statement | 32px / weight 700 | 36–38px / weight 700 | scale up ~10–15% |
| Red divider bar | width:100px, height:6px | width:140px, height:6px | wider, same height |
| Content zone padding | top:140px / bottom:140px | top:200px / bottom:200px | more vertical breathing room |
| Dark card padding | 44px | 50px | slightly more internal padding |
| Card border radius | 16px | 16px | unchanged |
| Margin-bottom values | as specified per template | scale up ~15–20% | more vertical space between elements |

## Template-specific Reflow Notes

### hook template
- Headline: always 92px / weight 900 in vertical
- Body text: 46px / weight 400 / off-white (#F2F0EE)
- Gold statement: 38–42px / weight 700

### bullets template (arrow list)
- Headline: 64px / weight 700
- Arrow items: 34px / weight 400, arrow "→" at 36px
- Gold statement: 36px / weight 700

### system template (bordered items)
- Headline: 68–72px / weight 700
- Border item title: 32px / weight 700
- Border item sub: 26–28px / weight 400 / off-white (#F2F0EE)
- Gold statement: 36px / weight 700

### story template (dark card)
- Headline: 60–64px / weight 700
- Card title: 32–34px / weight 700
- Card body: 28–30px / weight 400 / off-white (#F2F0EE)
- Red close: 34–36px / weight 700

### cta template
- Wordmark at 40px (same as square)
- Headline: 56–60px / weight 700 / max-width:840px
- Body: 30–32px / off-white (#F2F0EE) / max-width:760px
- Button: padding:28px 64px, font-size:30px / weight 700
- Gold link line: 28px / weight 600 / Forge Gold

## Content Sync Rule

Read the LinkedIn carousel HTML for each slide. Extract:
- The gold label text (JetBrains Mono label, if present)
- The main headline text (exact wording)
- All body text (exact wording, bullet items, card content)
- The CTA text (headline, button label, link-in-comment line)

Copy this content verbatim into the vertical HTML. Do not rephrase, shorten, or re-angle any text to fit the larger canvas — the vertical canvas has MORE space, so all content fits.

## Playwright Render

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1920})
    for html_path in sorted(slides_vertical_dir.glob("slide-vertical-*.html")):
        page.goto(f"file://{html_path.absolute()}")
        page.wait_for_timeout(700)  # Google Fonts load time
        page.screenshot(
            path=str(output_dir / f"tiktok-carousel_{slug}_{date}_{i:02d}.png"),
            clip={"x": 0, "y": 0, "width": 1080, "height": 1920}
        )
    browser.close()
```

The 700ms wait is required for Google Fonts (Outfit + JetBrains Mono) to load before the screenshot.

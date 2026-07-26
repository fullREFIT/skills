# Slide System
## Complete HTML/CSS Component Library for LinkedIn Carousels and Infographics

This reference contains production-ready HTML patterns for every slide type. All patterns are verified working with wkhtmltoimage (older WebKit renderer).

---

## Palette Reference

```
Carbon Core    #121010   (background, deepest dark)
Forge Red      #D43B2A   (CTAs, Layer 1/systems accent)
Forge Gold     #FFB400   (highlights, Layer 2/enablement accent)
Forge Dark     #333130   (card backgrounds, secondary dark)
Ash White      #F2F0EE   (not used in slides — slides are always dark)
Pure White     #FFFFFF   (primary text)
Echo           #878E88   (secondary text, metadata)
Soft Gray      #E5E3E0   (borders, dividers)
```

## Font Stack

Load via Google Fonts `<link>` in every slide (Playwright fetches at render time):
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

```
Primary:  'Outfit', Poppins, sans-serif
Mono:     'JetBrains Mono', 'DejaVu Sans Mono', monospace
```

**No italics anywhere. No emojis. No gradients as primary treatments.**

---

## Base Slide Structure

Every slide starts from this HTML skeleton (Playwright + flexbox, Google Fonts):

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1080px; overflow:hidden; font-family:Outfit,sans-serif; }
</style>
</head>
<body>
<div style="width:1080px; height:1080px; background:#121010; position:relative;">

  <!-- HEADER: wordmark left, slide counter right -->
  <div style="position:absolute; top:60px; left:80px; right:80px; display:flex; justify-content:space-between; align-items:center;">
    <span style="font-family:'Outfit',Poppins,sans-serif; font-size:22px; color:#FFFFFF;">
      <span style="font-weight:400; letter-spacing:-0.01em;">full</span><span style="font-weight:400; color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">REFIT</span>
    </span>
    <div style="font-family:'JetBrains Mono',monospace; font-weight:600; font-size:18px; color:#878E88; letter-spacing:0.04em;">01 / 05</div>
  </div>

  <!-- CONTENT ZONE: absolute bounds, flex-centered vertically -->
  <div style="position:absolute; top:140px; left:80px; right:80px; bottom:140px; display:flex; align-items:center;">
    <div style="width:100%;">
      <!-- Slide-specific content here -->
    </div>
  </div>

  <!-- FOOTER: wordmark left, split-color tagline right -->
  <div style="position:absolute; bottom:60px; left:80px; right:80px; display:flex; justify-content:space-between; align-items:flex-end;">
    <span style="font-family:'Outfit',Poppins,sans-serif; font-size:20px; color:#FFFFFF;">
      <span style="font-weight:400; letter-spacing:-0.01em;">full</span><span style="font-weight:400; color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">REFIT</span>
    </span>
    <div style="font-family:'JetBrains Mono',monospace; font-weight:500; font-size:13px; letter-spacing:0.06em; text-transform:uppercase;">
      <span style="color:#F2F0EE;">SYSTEMS BUILT.</span> <span style="color:#FFB400;">TEAMS EQUIPPED.</span>
    </div>
  </div>

</div>
</body></html>
```

**Why `position:absolute` + `display:flex; align-items:center`:** The absolute zone from top:140px to bottom:140px creates an 800px content area. Flexbox centers the content block vertically, distributing empty space equally above and below — correct for typographic poster design. Rendered with Playwright Chromium (add `page.wait_for_timeout(500)` before screenshot to allow font loading).

---

## Shared Components

### Wordmark

```html
<span style="font-family:'Outfit',Poppins,sans-serif; font-size:24px; color:#FFFFFF;">
  <span style="font-weight:400; letter-spacing:-0.01em;">full</span><span style="font-weight:400; color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">REFIT</span>
</span>
```

### Tagline

```html
<div style="font-family:'DejaVu Sans Mono',monospace; font-weight:500; font-size:14px; letter-spacing:0.06em; color:#878E88; text-transform:uppercase;">
  SYSTEMS BUILT. TEAMS EQUIPPED.
</div>
```

### Footer (wordmark + tagline, spread)

```html
<div style="display:table; width:100%;">
  <div style="display:table-cell; vertical-align:bottom;">
    <!-- Wordmark -->
  </div>
  <div style="display:table-cell; vertical-align:bottom; text-align:right;">
    <!-- Tagline -->
  </div>
</div>
```

### Header (left content + slide counter)

```html
<div style="display:table; width:100%;">
  <div style="display:table-cell; vertical-align:middle;">
    <!-- Left content (wordmark or section title) -->
  </div>
  <div style="display:table-cell; vertical-align:middle; text-align:right;">
    <span style="font-family:'DejaVu Sans Mono',monospace; font-weight:600; font-size:18px; color:#878E88;">1/5</span>
  </div>
</div>
```

### Divider Bar

```html
<div style="width:100px; height:5px; background:#D43B2A; margin-top:48px; margin-bottom:48px;"></div>
```

Color options: `#D43B2A` (Forge Red, default), `#FFB400` (Forge Gold, for enablement context).

### Stat Block (with left border)

```html
<div style="border-left:5px solid #D43B2A; padding-left:28px;">
  <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:36px; color:#FFFFFF; line-height:1;">$1.2M</div>
  <div style="font-family:'Outfit',Poppins,sans-serif; font-size:22px; color:#878E88; margin-top:8px; line-height:1.4;">Annual pipeline value</div>
</div>
```

Border colors: `#D43B2A` for systems/operational metrics, `#FFB400` for enablement/team metrics, `#878E88` for neutral/baseline metrics.

---

## Template 1: Hook Slide

The scroll-stopper. Big typography. Minimal elements. Maximum negative space.

### Pattern A: Big Number + Statement

```html
<!-- In content zone -->
<div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:144px; letter-spacing:-0.03em; color:#FFFFFF; line-height:0.9;">47</div>
<div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:64px; color:#FFFFFF; letter-spacing:-0.03em; line-height:1.1; margin-top:12px;">calls last week.</div>

<div style="width:100px; height:5px; background:#D43B2A; margin-top:48px; margin-bottom:48px;"></div>

<div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:64px; color:#878E88; letter-spacing:-0.03em; line-height:1.1;">
  You know the total.<br>You know <span style="color:#D43B2A;">nothing else.</span>
</div>
```

### Pattern B: Statement + Counter-Statement

```html
<div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:72px; color:#FFFFFF; letter-spacing:-0.03em; line-height:1.1;">
  Your best employee<br>quits Friday.
</div>

<div style="width:100px; height:5px; background:#D43B2A; margin-top:56px; margin-bottom:56px;"></div>

<div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:72px; color:#FFB400; letter-spacing:-0.03em; line-height:1.1;">
  What happens<br>Monday?
</div>
```

---

## Template 2: Data Reveal

Stats and metrics that quantify a problem or result.

```html
<!-- In content zone -->
<div style="border-left:5px solid #878E88; padding:16px 24px; margin-bottom:16px;">
  <span style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:44px; color:#FFFFFF; margin-right:20px;">$1.2M</span>
  <span style="font-family:'Outfit',Poppins,sans-serif; font-size:26px; color:#878E88;">Pipeline total</span>
</div>
<!-- Repeat for each metric -->

<div style="width:60px; height:5px; background:#D43B2A; margin-top:28px; margin-bottom:28px;"></div>

<div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:26px; color:#D43B2A; margin-bottom:12px;">
  What your CRM doesn't show you
</div>

<div style="padding-left:28px; margin-bottom:10px;">
  <span style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:22px; color:#D43B2A; margin-right:12px;">?</span>
  <span style="font-family:'Outfit',Poppins,sans-serif; font-size:22px; color:#878E88;">Were features described correctly?</span>
</div>
<!-- Repeat for each question -->
```

---

## Template 3: Comparison (Two-Column)

**Critical: Use float-based layout, not flexbox.**

```html
<!-- In content zone -->
<div style="overflow:hidden;">

  <!-- Left column -->
  <div style="width:430px; float:left; background:#333130; border-radius:16px; padding:36px; border-top:5px solid #878E88; min-height:500px; position:relative;">
    <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:600; font-size:22px; color:#878E88;">What your team does today</div>
    <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:34px; color:#FFFFFF; margin-top:16px;">ChatGPT</div>
    <div style="font-family:'Outfit',Poppins,sans-serif; font-size:22px; color:#878E88; margin-top:12px;">Emails. Summaries. Maybe a first draft.</div>
    <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:88px; color:#878E88; position:absolute; bottom:36px; left:36px;">10%</div>
  </div>

  <!-- Right column -->
  <div style="width:430px; float:right; background:#333130; border-radius:16px; padding:36px; border-top:5px solid #FFB400; min-height:500px; position:relative;">
    <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:600; font-size:22px; color:#FFB400;">What's actually possible</div>
    <!-- Tool list items -->
    <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:88px; color:#FFB400; position:absolute; bottom:36px; left:36px;">100%</div>
  </div>

</div>
```

Column widths: Two columns at 430px each with the remaining 60px as gap (920px content area from 1080px - 160px padding). Adjust for 3-column layouts: 280px each with 20px gaps.

---

## Template 4: List Steps

```html
<!-- In content zone -->
<div style="margin-bottom:28px;">
  <div style="overflow:hidden;">
    <div style="float:left; font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:32px; color:#FFB400; width:56px;">01</div>
    <div style="margin-left:80px;">
      <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:28px; color:#FFFFFF; line-height:1.2;">Pick the most painful process</div>
      <div style="font-family:'Outfit',Poppins,sans-serif; font-size:22px; color:#878E88; margin-top:8px; line-height:1.4;">Not the most interesting. The one costing you the most time, errors, and anxiety.</div>
    </div>
  </div>
</div>
<!-- Repeat for each step -->
```

---

## Template 5: Story Card

```html
<!-- In content zone -->
<div style="background:#333130; border-radius:16px; padding:48px; margin-bottom:32px; border-left:5px solid #D43B2A;">
  <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:36px; color:#FFFFFF; line-height:1.2;">
    One rep was quoting discontinued pricing on 30% of calls.
  </div>
  <div style="font-family:'Outfit',Poppins,sans-serif; font-size:24px; color:#878E88; margin-top:16px; line-height:1.4;">
    Nobody knew. The CRM didn't flag it. It took an AI reading every transcript to catch it.
  </div>
</div>
```

Stack multiple cards vertically. Alternate border colors (Red/Gold) to show both value layers.

---

## Template 6: System Display (Layer-Coded)

```html
<!-- Layer 1 item -->
<div style="border-left:5px solid #D43B2A; padding-left:32px; margin-bottom:32px;">
  <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:22px; color:#D43B2A; letter-spacing:0.06em;">LAYER 1: BUILD THE SYSTEM</div>
  <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:36px; color:#FFFFFF; margin-top:12px; line-height:1.2;">
    A knowledge base that captures everything your key people know.
  </div>
  <div style="font-family:'Outfit',Poppins,sans-serif; font-size:24px; color:#878E88; margin-top:12px; line-height:1.4;">
    Processes, exceptions, client requirements — structured for AI-powered search.
  </div>
</div>

<!-- Layer 2 item -->
<div style="border-left:5px solid #FFB400; padding-left:32px; margin-bottom:32px;">
  <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:22px; color:#FFB400; letter-spacing:0.06em;">LAYER 2: MAKE THE TEAM CAPABLE</div>
  <!-- Same structure, different accent color -->
</div>
```

---

## Template 7: CTA Slide

```html
<!-- Full slide (not using the standard content-zone pattern — CTA is centered) -->
<div style="width:1080px; height:1080px; background:#121010; padding:80px; position:relative;">

  <!-- Centered content -->
  <div style="position:absolute; top:80px; left:80px; right:80px; bottom:160px; display:table; width:calc(100% - 160px);">
    <div style="display:table-cell; vertical-align:middle; text-align:center;">

      <!-- Wordmark (large) -->
      <span style="font-family:'Outfit',Poppins,sans-serif; font-size:36px; color:#FFFFFF;">
        <span style="font-weight:400; letter-spacing:-0.01em;">full</span><span style="font-weight:400; color:#D43B2A;">/</span><span style="font-weight:700; letter-spacing:0.1em;">REFIT</span>
      </span>

      <!-- Divider -->
      <div style="width:80px; height:5px; background:#D43B2A; margin:40px auto;"></div>

      <!-- Headline -->
      <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:52px; color:#FFFFFF; letter-spacing:-0.03em; line-height:1.15; max-width:800px; margin:0 auto;">
        How blind is your sales process?
      </div>

      <!-- Description -->
      <div style="font-family:'Outfit',Poppins,sans-serif; font-size:24px; color:#878E88; margin-top:28px; line-height:1.5; max-width:700px; margin-left:auto; margin-right:auto;">
        The Sales Visibility Audit scores your team across three dimensions. Takes three minutes.
      </div>

      <!-- CTA Button -->
      <div style="display:inline-block; margin-top:48px; padding:20px 48px; background:#D43B2A; border-radius:12px; font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:24px; color:#FFFFFF;">
        Take the Sales Visibility Audit
      </div>

      <!-- Link in comment -->
      <div style="margin-top:24px; font-family:'Outfit',Poppins,sans-serif; font-weight:600; font-size:22px; color:#FFB400;">
        (Link in the first comment)
      </div>

    </div>
  </div>

  <!-- Tagline at bottom -->
  <div style="position:absolute; bottom:80px; left:80px;">
    <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:500; font-size:16px; letter-spacing:0.06em; color:#878E88; text-transform:uppercase;">
      SYSTEMS BUILT. TEAMS EQUIPPED.
    </div>
  </div>

</div>
```

**CTA button colors:**
- Forge Red (`#D43B2A`) background + white text — default for most CTAs
- Forge Gold (`#FFB400`) background + Carbon Core (`#121010`) text — for enablement/team-focused CTAs

---

## Infographic-Specific Patterns

### Portrait Layout (1080x1350)

Change the body dimensions:
```html
<style>body { width:1080px; height:1350px; overflow:hidden; }</style>
```

And the outer container:
```html
<div style="width:1080px; height:1350px; background:#121010; padding:80px; position:relative;">
```

The extra 270px of vertical space allows for:
- More breathing room between sections
- One additional content block
- Larger footer area

### Data Snapshot Infographic

```html
<!-- Title area -->
<div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:48px; color:#FFFFFF; letter-spacing:-0.02em; line-height:1.15;">
  The Cost of Key-Person<br>Dependency
</div>
<div style="width:80px; height:5px; background:#D43B2A; margin-top:32px; margin-bottom:40px;"></div>

<!-- 3 stat blocks stacked -->
<div style="background:#333130; border-radius:16px; padding:36px; margin-bottom:20px; border-left:5px solid #D43B2A;">
  <div style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:52px; color:#FFFFFF;">50-200%</div>
  <div style="font-family:'Outfit',Poppins,sans-serif; font-size:22px; color:#878E88; margin-top:8px;">of annual salary to replace a key employee</div>
</div>
<!-- Repeat for each stat -->

<!-- Source/context line at bottom -->
<div style="font-family:'Outfit',Poppins,sans-serif; font-size:18px; color:#878E88; margin-top:32px;">
  Based on analysis of $1-10M companies with 10-50 employees.
</div>
```

### Checklist Infographic

```html
<!-- Checklist item -->
<div style="overflow:hidden; margin-bottom:20px;">
  <div style="float:left; width:40px; height:40px; border-radius:8px; background:rgba(255,180,0,0.12); text-align:center; line-height:40px;">
    <span style="font-family:'DejaVu Sans Mono',monospace; font-weight:700; font-size:20px; color:#FFB400;">&#10003;</span>
  </div>
  <div style="margin-left:60px;">
    <div style="font-family:'Outfit',Poppins,sans-serif; font-weight:700; font-size:24px; color:#FFFFFF;">Show me this working inside a company like mine</div>
    <div style="font-family:'Outfit',Poppins,sans-serif; font-size:20px; color:#878E88; margin-top:6px;">Not a demo. A real system deployed at a real company.</div>
  </div>
</div>
```

---

## Typography Quick Reference

Verified sizes from production-approved carousels (April 2026 batch, 30 posts):

| Element | Template | Font | Weight | Size | Color | Notes |
|---------|----------|------|--------|------|-------|-------|
| Hook headline | hook | Outfit | 900 | 92px | `#F2F0EE` | line-height:1.06, tracking:-0.03em |
| Hook sub text | hook | Outfit | 400 | 40px | `#878E88` | line-height:1.4 |
| Hook gold statement | hook | Outfit | 700 | 34px | `#FFB400` | line-height:1.4 |
| Bullets headline | bullets | Outfit | 700 | 50px | `#F2F0EE` | line-height:1.15, tracking:-0.02em |
| Bullets arrow text | bullets | Outfit | 400 | 30px | `#F2F0EE` | line-height:1.4 |
| Bullets gold statement | bullets | Outfit | 700 | 32px | `#FFB400` | line-height:1.4 |
| System headline | system | Outfit | 700 | 54px | `#F2F0EE` | line-height:1.12, tracking:-0.02em |
| System item title | system | Outfit | 700 | 28px | `#F2F0EE` | line-height:1.3 |
| System item sub | system | Outfit | 400 | 22px | `#878E88` | line-height:1.4 |
| System gold statement | system | Outfit | 700 | 32px | `#FFB400` | line-height:1.4 |
| Story headline | story | Outfit | 700 | 52px | `#F2F0EE` | line-height:1.12, tracking:-0.02em |
| Story card title | story | Outfit | 700 | 30px | `#F2F0EE` | line-height:1.3 |
| Story card body | story | Outfit | 400 | 26px | `#F2F0EE` | line-height:1.5 |
| Story red close | story | Outfit | 700 | 32px | `#D43B2A` | line-height:1.4 |
| CTA headline | cta | Outfit | 700 | 52px | `#F2F0EE` | max-width:840px |
| CTA body | cta | Outfit | 400 | 28px | `#878E88` | line-height:1.5 |
| CTA button | cta | Outfit | 700 | 28px | `#FFFFFF` | padding:24px 56px |
| CTA link-in-comment | cta | Outfit | 600 | 26px | `#FFB400` | |
| Section label | all | JetBrains Mono | 600 | 20px | `#FFB400` | uppercase, tracking:0.12em |
| Red divider bar | all | — | — | 100px×6px | `#D43B2A` | margin-bottom:44px |
| Arrow bullet | bullets | — | — | 30px | `#D43B2A` | → character |
| Border item accent | system/story | — | — | 5-6px wide | `#D43B2A` or `#FFB400` | left border |
| Slide counter | all | JetBrains Mono | 600 | 18px | `#878E88` | tracking:0.04em |
| Wordmark header | all | Outfit | 400/700 | 22px | `#FFFFFF` | "full" Regular 400, "/" Forge Red Regular 400, "REFIT" Bold 700 |
| Wordmark footer | all | Outfit | 400/700 | 20px | `#FFFFFF` | "full" Regular 400, "/" Forge Red Regular 400, "REFIT" Bold 700 |
| Tagline SYSTEMS | all | JetBrains Mono | 500 | 13px | `#F2F0EE` | uppercase |
| Tagline EQUIPPED | all | JetBrains Mono | 500 | 13px | `#FFB400` | uppercase |

**Minimum size rule:** Nothing below 20px at 1080px render width. Content should fill 65–75% of the 800px content zone.

---

*Slide System v2.0 — April 2026*
*Updated: Playwright rendering, 5-template system with verified font scales, flex layout, split-color footer tagline*
*Part of LinkedIn Carousel Forge skill*

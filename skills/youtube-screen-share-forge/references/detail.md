# YouTube Screen Share Forge — Detail Reference

> All detailed procedures, HTML templates, CSS specs, and step-by-step instructions.
> Load this file before executing the skill.

---

## Prerequisites

**Brand tokens:** Set in `config.example.md` (copy to `config.md` with your values). Brand system adapts from the carousel forge's 1080×1080 square to 1920×1080 landscape — same colors, different proportions.

**Runtime requirements:** Chrome (or any modern browser) for fullscreen playback. No Python, no wkhtmltoimage, no PDF tools needed.

**Ecamm Live setup:** Window capture mode. Open the HTML file in Chrome, go fullscreen (Cmd+Control+F on Mac or F11), select the Chrome window in Ecamm as the screen share source. Slide navigation via keyboard — arrow keys or spacebar — while the Ecamm camera captures the presenter on the second input.

**iPad Pro alternative:** Open the HTML file in Safari on Mac or iPad, AirPlay to a mirrored window, capture that window in Ecamm.

---

## Step 1 — Parse Input

Accept input in one of three forms:

**Form A — Framework section from a script:**
Read the FRAMEWORK section of the script file or pasted content. Extract: the conceptual structure (number of parts, their names), the key insight per section, any specific data points, comparisons, or diagnostic questions. Ignore the teleprompter prose — extract only the structure and substance.

**Form B — Concept spec:**
Read the concept spec produced by `/script-to-lead-magnet` or a manual spec. Extract: the framework name, the 3-6 component parts, the viewer's specific outcome.

**Form C — Free-form description:**
Accept a plain-language description of what the presentation should teach. Apply the same structure principles — identify the conceptual components, sequence them logically, determine slide count.

---

## Step 2 — Content Strategy

### Slide count target

| Video type | Framework section | Target slides |
|-----------|------------------|---------------|
| Long-form (8-15 min) | 50%+ of runtime | 8-14 slides |
| Short-form demo | Entire video | 4-8 slides |
| Framework overview only | One section | 5-10 slides |

### Slide density rule

**Target: 1 slide per 45 seconds of screen share runtime.**
- 8 min screen share = 10–11 slides minimum
- 10 min screen share = 13–14 slides minimum
- 12 min screen share = 16 slides minimum

To hit this density: split multi-part slides into separate slides. A slide with a diagnostic question AND a flow should be two slides. A framework overview followed by 3 deep-dives is 4 slides, not 1. When in doubt, add a Chapter Title slide between major sections — they signal transitions, cost 2-3 seconds, and prevent the "wall of content" problem.

### Slide sequence rules

1. Always open with a **Chapter Title** slide naming the framework
2. For multi-part frameworks: one **Framework Overview** slide showing all parts, then individual **Concept Reveal** slides for each part
3. Use **Before/After** slides when showing transformation or contrast
4. Use **Process Flow** slides when sequence matters
5. Use **Data/Stat** slides when a number or finding anchors the point
6. Use **Diagnostic Checklist** when the viewer is evaluating their own situation
7. Always close the framework section with a **Summary** slide
8. Optional: **Chapter Title** slides between major sections to signal transitions

### Template selection per content type

| If the content is... | Use template |
|---------------------|-------------|
| The framework name and its 3-5 parts shown together | Framework Overview |
| One concept explained in depth | Concept Reveal |
| Old way vs. new way, or problem vs. solution | Before/After Comparison |
| Steps to follow in sequence | Process Flow |
| A number, statistic, or finding that anchors the argument | Data/Stat |
| Questions the viewer answers about their own situation | Diagnostic Checklist |
| How a system's components connect | System Architecture |
| A major transition between sections | Chapter Title |
| Bringing together the key points | Summary |

---

## Step 3 — Slide Design

For each slide, specify:
- Template type (from the list above)
- Headline (max 8 words for most templates; 4 words for Chapter Title)
- Body content (what goes in the content zone — specific to each template)
- Accent color: Forge Red for systems/infrastructure content, Forge Gold for team/enablement content
- Speaker note (what the presenter says during this slide — extracted from the script, not displayed on screen)

Speaker notes are embedded in the HTML as `<!-- NOTE: -->` comments — not visible in fullscreen but serve as a reference when reviewing the file.

---

## Step 4 — HTML Build

### Shell structure

Every output is a single HTML file using this shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>[PRESENTATION TITLE] — [Your Brand]</title>
<style>
/* BRAND TOKENS — update from config.example.md to match your brand */
:root {
  --forge-red: #D43B2A;
  --forge-gold: #FFB400;
  --forge-dark: #333130;
  --forge-darker: #121010;
  --off-white: #F2F0EE;
  --white: #FFFFFF;
  --echo: #878E88;
  /* Legacy aliases */
  --carbon-core: #121010;
  --pure-white: #FFFFFF;
  --slide-w: 1920px;
  --slide-h: 1080px;
  --pad: 80px;
  --pad-sm: 48px;
}

/* RESET AND BASE */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #000;
  font-family: 'Outfit', -apple-system, 'Helvetica Neue', sans-serif;
  color: var(--off-white);
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SLIDE CONTAINER */
.deck {
  position: relative;
  width: var(--slide-w);
  height: var(--slide-h);
  overflow: hidden;
}

/* INDIVIDUAL SLIDES */
.slide {
  position: absolute;
  inset: 0;
  background: var(--carbon-core);
  display: none;
  flex-direction: column;
}
.slide.active { display: flex; }

/* PROGRESS BAR */
.progress {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--forge-red);
  transition: width 0.2s ease;
  z-index: 100;
}

/* SLIDE COUNTER */
.counter {
  position: fixed;
  top: 24px;
  right: 40px;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 18px;
  color: var(--echo);
  letter-spacing: 0.1em;
  z-index: 100;
}

/* WORDMARK — always white text, red slash, no gray, no opacity.
   Colors defined on span classes (not parent) to prevent inheritance failures at any size. */
.wm { font-family: 'Outfit', sans-serif; font-size: 18px; letter-spacing: 0.05em; }
.wm-full { font-weight: 400; color: var(--off-white); }
.wm-slash { font-weight: 400; color: var(--forge-red); }
.wm-refit { font-weight: 700; color: var(--off-white); letter-spacing: 0.1em; }
.wm-xl { font-size: 96px; }
.wm-md { font-size: 28px; }

/* DIVIDER */
.divider {
  width: 48px;
  height: 3px;
  background: var(--forge-red);
  margin: 24px 0;
}
.divider.gold { background: var(--forge-gold); }

/* TYPOGRAPHY SCALE — sized for 1920x1080 viewed at 720p on YouTube */
.t-hero  { font-size: 120px; font-weight: 900; line-height: 1.0; color: var(--off-white); }
.t-h1    { font-size: 84px;  font-weight: 800; line-height: 1.1; color: var(--off-white); }
.t-h2    { font-size: 60px;  font-weight: 700; line-height: 1.15; color: var(--off-white); }
.t-h3    { font-size: 44px;  font-weight: 700; line-height: 1.2; color: var(--off-white); }
.t-body  { font-size: 34px;  font-weight: 400; line-height: 1.5; color: var(--off-white); }
/* CRITICAL: t-label is the ONLY element allowed to use echo/gray. Body text is always off-white. */
.t-label { font-size: 24px;  font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--echo); }
.t-mono  { font-family: 'JetBrains Mono', monospace; font-size: 28px; color: var(--forge-gold); }
.t-red   { color: var(--forge-red); }
.t-gold  { color: var(--forge-gold); }
.t-echo  { color: var(--echo); }

/* CRITICAL COLOR RULE — BODY TEXT IS ALWAYS WHITE:
   - All body text, list items, card descriptions, bullet points: var(--off-white). Never gray.
   - Echo (#878E88) ONLY for: t-label (uppercase, bold, small), tagline, slide counter.
   - To de-emphasize text: use smaller font size at off-white. Not gray at the same size.
   - If you're about to add t-echo to a content element: STOP. Use var(--off-white) instead. */

/* SLIDE HEADER AND FOOTER */
.slide-header {
  padding: 32px var(--pad) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
.slide-footer {
  padding: 0 var(--pad) 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-shrink: 0;
}
.tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: var(--echo);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* CONTENT ZONE — top-anchored to prevent dead space on sparse slides */
.content {
  flex: 1;
  padding: 48px var(--pad) 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* ACCENT BARS */
.accent-bar {
  width: 100%;
  height: 4px;
  background: var(--forge-red);
}
.accent-bar.gold { background: var(--forge-gold); }
.accent-bar.top { margin-bottom: 0; }
.accent-bar.bottom { margin-top: 0; }

/* GOOGLE FONTS */
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>

<!-- SLIDE COUNTER -->
<div class="counter" id="counter">1 / N</div>

<!-- PROGRESS BAR -->
<div class="progress" id="progress"></div>

<!-- DECK -->
<div class="deck" id="deck">

  <!-- SLIDES GO HERE -->

</div>

<script>
// Navigation
const slides = document.querySelectorAll('.slide');
const counter = document.getElementById('counter');
const progress = document.getElementById('progress');
let current = 0;
const total = slides.length;

function show(n) {
  slides[current].classList.remove('active');
  current = Math.max(0, Math.min(n, total - 1));
  slides[current].classList.add('active');
  counter.textContent = (current + 1) + ' / ' + total;
  progress.style.width = ((current + 1) / total * 100) + '%';
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') show(current + 1);
  if (e.key === 'ArrowLeft' || e.key === 'Backspace') show(current - 1);
  if (e.key === 'f' || e.key === 'F') document.documentElement.requestFullscreen?.();
  if (e.key === 'Escape') document.exitFullscreen?.();
  if (e.key === 'Home') show(0);
  if (e.key === 'End') show(total - 1);
});

// Click to advance
document.getElementById('deck').addEventListener('click', () => show(current + 1));

show(0);
</script>
</body>
</html>
```

---

## Templates

### Template: Chapter Title

Use between major sections. Full-bleed typographic treatment.

```html
<div class="slide active">
  <div class="accent-bar top" style="background:var(--forge-red)"></div>
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content" style="justify-content:center; text-align:left;">
    <div class="t-label" style="margin-bottom:16px;">The Framework</div>
    <div class="t-hero" style="color:var(--forge-red);">01</div>
    <div class="t-h1" style="max-width:900px;">Chapter Title Goes Here</div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
  <div class="accent-bar bottom" style="background:var(--forge-red)"></div>
</div>
```

### Template: Framework Overview

Shows all 3-5 parts of the framework simultaneously. Use immediately after the Chapter Title.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content">
    <div class="t-label" style="margin-bottom:8px;">The Framework</div>
    <div class="t-h2" style="margin-bottom:40px;">Framework Name: The 4-Part Structure</div>
    <!-- Horizontal part cards -->
    <div style="display:flex; gap:24px; align-items:stretch;">
      <div style="flex:1; background:var(--forge-dark); padding:32px 28px; border-top:3px solid var(--forge-red);">
        <div class="t-mono" style="font-size:20px; margin-bottom:12px;">01</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:8px;">Part One</div>
        <div class="t-body" style="font-size:20px;">One-line description of what this part covers.</div>
      </div>
      <div style="flex:1; background:var(--forge-dark); padding:32px 28px; border-top:3px solid var(--forge-gold);">
        <div class="t-mono" style="font-size:20px; margin-bottom:12px;">02</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:8px;">Part Two</div>
        <div class="t-body" style="font-size:20px;">One-line description of what this part covers.</div>
      </div>
      <div style="flex:1; background:var(--forge-dark); padding:32px 28px; border-top:3px solid var(--forge-red);">
        <div class="t-mono" style="font-size:20px; margin-bottom:12px;">03</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:8px;">Part Three</div>
        <div class="t-body" style="font-size:20px;">One-line description of what this part covers.</div>
      </div>
      <div style="flex:1; background:var(--forge-dark); padding:32px 28px; border-top:3px solid var(--forge-gold);">
        <div class="t-mono" style="font-size:20px; margin-bottom:12px;">04</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:8px;">Part Four</div>
        <div class="t-body" style="font-size:20px;">One-line description of what this part covers.</div>
      </div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
</div>
```

### Template: Concept Reveal

One concept in depth. The most common template — use one per framework part.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
    <div class="t-mono" style="font-size:16px; color:var(--forge-red);">01 / PART NAME</div>
  </div>
  <div class="content">
    <div class="t-label" style="margin-bottom:8px; color:var(--forge-red);">The Concept</div>
    <div class="t-h1" style="max-width:1100px; margin-bottom:24px;">The Concept Headline</div>
    <div class="divider"></div>
    <div class="t-body" style="max-width:900px; margin-bottom:40px;">
      One or two sentences. What this concept means and why it matters. Keep it to 30 words max.
    </div>
    <!-- Supporting points -->
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; align-items:flex-start; gap:16px;">
        <div style="width:8px; height:8px; background:var(--forge-red); border-radius:50%; margin-top:12px; flex-shrink:0;"></div>
        <div class="t-body" style="font-size:26px;">Supporting point one — specific and concrete.</div>
      </div>
      <div style="display:flex; align-items:flex-start; gap:16px;">
        <div style="width:8px; height:8px; background:var(--forge-red); border-radius:50%; margin-top:12px; flex-shrink:0;"></div>
        <div class="t-body" style="font-size:26px;">Supporting point two — different from point one.</div>
      </div>
      <div style="display:flex; align-items:flex-start; gap:16px;">
        <div style="width:8px; height:8px; background:var(--forge-red); border-radius:50%; margin-top:12px; flex-shrink:0;"></div>
        <div class="t-body" style="font-size:26px;">Supporting point three — closes the argument.</div>
      </div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
</div>
```

### Template: Before/After Comparison

Two-column. Left = the problem state. Right = the solution state.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content">
    <div class="t-h2" style="margin-bottom:36px;">The Difference This Makes</div>
    <div style="display:flex; gap:32px; height:580px;">
      <!-- BEFORE -->
      <div style="flex:1; background:var(--forge-dark); padding:40px; border-top:4px solid var(--echo);">
        <div class="t-label" style="margin-bottom:20px; color:var(--echo);">Before</div>
        <div class="t-h3" style="color:var(--echo); margin-bottom:24px; font-size:32px;">The Old Way</div>
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div class="t-body" style="font-size:24px;">— Specific pain point one</div>
          <div class="t-body" style="font-size:24px;">— Specific pain point two</div>
          <div class="t-body" style="font-size:24px;">— Specific pain point three</div>
        </div>
        <div style="margin-top:auto; padding-top:40px;">
          <div class="t-mono" style="font-size:48px; color:var(--echo);">X hrs/week</div>
          <div class="t-label" style="color:var(--echo);">Time cost</div>
        </div>
      </div>
      <!-- AFTER -->
      <div style="flex:1; background:var(--forge-dark); padding:40px; border-top:4px solid var(--forge-gold); display:flex; flex-direction:column;">
        <div class="t-label" style="margin-bottom:20px; color:var(--forge-gold);">After</div>
        <div class="t-h3" style="margin-bottom:24px; font-size:32px;">The New Way</div>
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div class="t-body" style="font-size:24px;">✓ Specific outcome one</div>
          <div class="t-body" style="font-size:24px;">✓ Specific outcome two</div>
          <div class="t-body" style="font-size:24px;">✓ Specific outcome three</div>
        </div>
        <div style="margin-top:auto; padding-top:40px;">
          <div class="t-mono" style="font-size:48px; color:var(--forge-gold);">Y hrs/week</div>
          <div class="t-label" style="color:var(--forge-gold);">Time cost</div>
        </div>
      </div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
</div>
```

### Template: Process Flow

Numbered steps, left to right.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content">
    <div class="t-label" style="margin-bottom:8px;">The Process</div>
    <div class="t-h2" style="margin-bottom:48px;">How This Actually Works</div>
    <div style="display:flex; gap:0; align-items:stretch;">
      <div style="flex:1; background:var(--forge-dark); padding:36px 28px; border-top:4px solid var(--forge-red); position:relative;">
        <div class="t-mono" style="font-size:56px; color:var(--forge-red); margin-bottom:16px;">01</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:12px;">Step Name</div>
        <div class="t-body" style="font-size:22px;">What happens at this step. One or two sentences max.</div>
      </div>
      <div style="width:32px; display:flex; align-items:center; justify-content:center; color:var(--echo); font-size:24px;">→</div>
      <div style="flex:1; background:var(--forge-dark); padding:36px 28px; border-top:4px solid var(--forge-gold);">
        <div class="t-mono" style="font-size:56px; color:var(--forge-gold); margin-bottom:16px;">02</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:12px;">Step Name</div>
        <div class="t-body" style="font-size:22px;">What happens at this step. One or two sentences max.</div>
      </div>
      <div style="width:32px; display:flex; align-items:center; justify-content:center; color:var(--echo); font-size:24px;">→</div>
      <div style="flex:1; background:var(--forge-dark); padding:36px 28px; border-top:4px solid var(--forge-red);">
        <div class="t-mono" style="font-size:56px; color:var(--forge-red); margin-bottom:16px;">03</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:12px;">Step Name</div>
        <div class="t-body" style="font-size:22px;">What happens at this step. One or two sentences max.</div>
      </div>
      <div style="width:32px; display:flex; align-items:center; justify-content:center; color:var(--echo); font-size:24px;">→</div>
      <div style="flex:1; background:var(--forge-dark); padding:36px 28px; border-top:4px solid var(--forge-gold);">
        <div class="t-mono" style="font-size:56px; color:var(--forge-gold); margin-bottom:16px;">04</div>
        <div class="t-h3" style="font-size:28px; margin-bottom:12px;">Step Name</div>
        <div class="t-body" style="font-size:22px;">What happens at this step. One or two sentences max.</div>
      </div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
</div>
```

### Template: Data/Stat

One big number. What it means. Why it matters.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content" style="align-items:flex-start;">
    <div class="t-label" style="margin-bottom:16px;">The Number</div>
    <div style="display:flex; align-items:baseline; gap:16px; margin-bottom:8px;">
      <div style="font-size:160px; font-weight:900; color:var(--forge-red); line-height:1; font-family:'Outfit',sans-serif;">45</div>
      <div class="t-h1" style="color:var(--echo); font-size:64px;">people</div>
    </div>
    <div class="t-h2" style="color:var(--forge-gold); margin-bottom:24px;">$200M in revenue</div>
    <div class="divider"></div>
    <div class="t-body" style="max-width:900px;">
      What this number means in plain language. One sentence. Specifically what it implies for the viewer's company.
    </div>
    <div style="margin-top:48px; padding:28px 36px; background:var(--forge-dark); border-left:4px solid var(--forge-red); max-width:800px;">
      <div class="t-body" style="font-style:italic; color:var(--pure-white);">"The takeaway in one sentence. What this means for a CEO at a $5M company."</div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
</div>
```

### Template: Diagnostic Checklist

Questions the viewer answers about their own situation.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content">
    <div class="t-label" style="margin-bottom:8px;">The Diagnostic</div>
    <div class="t-h2" style="margin-bottom:12px;">Is This Happening at Your Company?</div>
    <div class="t-body" style="margin-bottom:36px; font-size:24px;">Check the ones that are true right now.</div>
    <div style="display:flex; flex-direction:column; gap:20px;">
      <div style="display:flex; align-items:center; gap:24px; padding:20px 28px; background:var(--forge-dark); border-left:4px solid var(--forge-red);">
        <div style="width:28px; height:28px; border:2px solid var(--forge-red); border-radius:4px; flex-shrink:0;"></div>
        <div class="t-body" style="font-size:26px;">Diagnostic question one — specific and observable.</div>
      </div>
      <div style="display:flex; align-items:center; gap:24px; padding:20px 28px; background:var(--forge-dark); border-left:4px solid var(--forge-red);">
        <div style="width:28px; height:28px; border:2px solid var(--forge-red); border-radius:4px; flex-shrink:0;"></div>
        <div class="t-body" style="font-size:26px;">Diagnostic question two — different symptom.</div>
      </div>
      <div style="display:flex; align-items:center; gap:24px; padding:20px 28px; background:var(--forge-dark); border-left:4px solid var(--forge-red);">
        <div style="width:28px; height:28px; border:2px solid var(--forge-red); border-radius:4px; flex-shrink:0;"></div>
        <div class="t-body" style="font-size:26px;">Diagnostic question three — closes the pattern.</div>
      </div>
    </div>
    <div style="margin-top:24px; padding:20px 28px; background:rgba(212,59,42,0.1); border:1px solid var(--forge-red);">
      <div class="t-body" style="font-size:22px; color:var(--forge-red);">If you checked 2 or more: this is your most expensive process right now.</div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">SYSTEMS BUILT. TEAMS EQUIPPED.</div>
  </div>
</div>
```

### Template: Free Resource (CTA Slide)

Always the last slide. Gold accent bar top, wordmark centered, headline, numbered steps, red CTA button.

**CTA button text:** Use your configured CTA URL from `config.example.md`. The viewer sees this on screen and must be able to type it — always use the full URL, never just "Free in the community" without the URL.

```html
<div class="slide">
  <div class="accent-bar gold"></div>
  <div class="content" style="align-items:center; text-align:center;">
    <div class="wm wm-md" style="margin-bottom:40px;">
      <span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span>
    </div>
    <div class="t-h1" style="margin-bottom:16px;">[Resource Name]</div>
    <div class="divider gold" style="margin:16px auto;"></div>
    <div class="t-h3" style="color:var(--forge-gold); font-weight:500; margin-bottom:48px;">[Resource subtitle — what they get]</div>
    <div style="display:flex; flex-direction:column; gap:24px; text-align:left; margin-bottom:48px; max-width:800px;">
      <div style="display:flex; align-items:baseline; gap:20px;">
        <div class="t-mono" style="color:var(--forge-red); font-size:28px; flex-shrink:0;">01</div>
        <div class="t-body" style="font-size:28px;">[Step one — what they do]</div>
      </div>
      <div style="display:flex; align-items:baseline; gap:20px;">
        <div class="t-mono" style="color:var(--forge-red); font-size:28px; flex-shrink:0;">02</div>
        <div class="t-body" style="font-size:28px;">[Step two — what they do]</div>
      </div>
      <div style="display:flex; align-items:baseline; gap:20px;">
        <div class="t-mono" style="color:var(--forge-red); font-size:28px; flex-shrink:0;">03</div>
        <div class="t-body" style="font-size:28px;">[Step three — what they do]</div>
      </div>
    </div>
    <div style="display:inline-block; background:var(--forge-red); color:#fff; padding:24px 56px; border-radius:6px; font-size:28px; font-weight:600; letter-spacing:0.02em;">[YOUR CTA URL HERE]</div>
  </div>
  <div class="accent-bar"></div>
</div>
```

### Template: Summary

Brings together the key points. Use as the final slide of the framework section.

```html
<div class="slide">
  <div class="slide-header">
    <div class="wm"><span class="wm-full">full</span><span class="wm-slash">/</span><span class="wm-refit">REFIT</span></div>
  </div>
  <div class="content">
    <div class="t-label" style="margin-bottom:8px;">The Takeaway</div>
    <div class="t-h1" style="max-width:1000px; margin-bottom:32px;">What You Know Now</div>
    <div style="display:flex; flex-direction:column; gap:20px; max-width:1100px;">
      <div style="display:flex; align-items:baseline; gap:20px;">
        <div class="t-mono" style="color:var(--forge-red); font-size:20px; flex-shrink:0;">01</div>
        <div class="t-body" style="font-size:28px;">Summary point one — the most important takeaway.</div>
      </div>
      <div style="display:flex; align-items:baseline; gap:20px;">
        <div class="t-mono" style="color:var(--forge-gold); font-size:20px; flex-shrink:0;">02</div>
        <div class="t-body" style="font-size:28px;">Summary point two — the second most important.</div>
      </div>
      <div style="display:flex; align-items:baseline; gap:20px;">
        <div class="t-mono" style="color:var(--forge-red); font-size:20px; flex-shrink:0;">03</div>
        <div class="t-body" style="font-size:28px;">Summary point three — what to do with this.</div>
      </div>
    </div>
    <div style="margin-top:40px; padding:28px; background:var(--forge-dark); border-top:3px solid var(--forge-gold); max-width:900px;">
      <div class="t-label" style="color:var(--forge-gold); margin-bottom:8px;">Next Step</div>
      <div class="t-body">Free resource at [YOUR CTA URL]: [Resource Name].</div>
    </div>
  </div>
  <div class="slide-footer">
    <div class="tagline">[YOUR TAGLINE HERE]</div>
  </div>
</div>
```

---

## Step 5 — Quality Checklist

Before outputting the file, verify:

**Legibility at video resolution:**
- [ ] All body text at minimum 34px (renders ~17px at 720p)
- [ ] All headline text at minimum 44px
- [ ] All labels and metadata at minimum 18px
- [ ] No text within 48px of slide edges
- [ ] Sufficient contrast — Pure White (#FFFFFF) text on Carbon Core (#121010) background, no grey-on-grey
- [ ] Legible when viewed at 720p (half the native resolution) — test at 50% browser zoom

**Keyboard navigation:**
- [ ] Arrow keys advance and go back
- [ ] Spacebar advances
- [ ] Home/End jump to first/last slide
- [ ] F key triggers fullscreen request
- [ ] Slide counter updates correctly
- [ ] Progress bar advances with each slide

**Brand compliance:**
- [ ] Brand palette only — use colors from `config.example.md`
- [ ] Wordmark: format per `config.example.md`. Present on every slide (header position)
- [ ] Tagline in footer on most slides (from `config.example.md`)
- [ ] No italics, no emojis, no gradients as primary treatments
- [ ] Use accent colors consistently (primary accent for main emphasis, secondary for highlights)

**Ecamm readiness:**
- [ ] File opens cleanly in Chrome with no console errors
- [ ] Fullscreen mode works (F key or browser fullscreen)
- [ ] No browser UI visible in fullscreen
- [ ] Click-to-advance works as backup to keyboard

---

## Step 6 — Output

**File naming:** `[video-slug]-slides.html`
Example: `why-everything-takes-so-long-slides.html`

**Output path:** `/mnt/user-data/outputs/[video-slug]-slides.html`

**Ecamm setup instructions to include with delivery:**
```
Ecamm Live Setup:
1. Open [filename].html in Chrome
2. Press F to go fullscreen (or Cmd+Control+F on Mac)
3. In Ecamm: Add source → Window Capture → select Chrome window
4. Navigate slides: Arrow keys or Spacebar
5. Return to talking head: switch source in Ecamm to camera input
6. Start from beginning: Home key
```

**Optional iPad Pro setup:**
```
iPad Pro Alternative:
1. Open [filename].html in Safari on Mac
2. Use AirPlay to mirror to iPad Pro
3. In Ecamm: Add source → AirPlay / iPad display
4. Control slides from Mac keyboard while iPad shows the presentation
```

---

## Speaker Notes

For every slide, include a `<!-- NOTE: -->` HTML comment with what the presenter says during that slide. These are NOT displayed in fullscreen but serve as the reference when reviewing the file.

```html
<!-- NOTE: "The execution bottleneck at most companies didn't disappear when AI arrived — it moved. And most companies haven't noticed where it went." -->
<div class="slide">
  ...
</div>
```

The speaker notes parallel the script's teleprompter content. They let the presenter review the complete presentation before recording without needing to open the script file separately.

---

*YouTube Screen Share Forge v2.0 — May 2026*
*Output: Single HTML file, 1920×1080, keyboard-navigable*
*Designed for Ecamm Live browser window capture*
*Brand system: configure via `config.example.md`*

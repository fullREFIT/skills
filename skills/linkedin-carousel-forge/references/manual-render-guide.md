# Manual Render Guide
## Producing Carousel PDFs Without the Render Script

When wkhtmltoimage is unavailable (e.g., Claude.ai chat, some CI environments), use these alternative approaches.

---

## Option 1: React Artifact + Screenshot (Claude.ai Chat)

When working in Claude.ai chat, produce slides as a React (.jsx) artifact:

1. Build all slides as React components in a single artifact
2. Add tabbed navigation between posts and arrow navigation between slides
3. Render at 1080x1080px with a CSS `transform: scale()` for preview
4. User screenshots each slide at full resolution

**Providing the artifact:** Build with tabbed post selection + dot/arrow slide navigation. Scale preview to fit viewport. Include an export note explaining the screenshot process.

**Font loading:** In React artifacts, load Google Fonts via `<link>` in the component:
```jsx
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

This loads the default design system fonts (Outfit + JetBrains Mono) without system installation.

---

## Option 2: Browser Dev Tools Screenshot

1. Open each HTML slide file in a browser
2. Open DevTools (F12) → Device toolbar (Ctrl+Shift+M)
3. Set dimensions to 1080x1080
4. Right-click → "Capture screenshot" or use the DevTools screenshot command
5. Combine PNGs into PDF using any PDF tool

---

## Option 3: Puppeteer Script (Node.js)

If Node.js is available but wkhtmltoimage is not:

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function renderSlides(inputDir, outputPdf) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.html'))
    .sort();

  const pngs = [];
  for (const file of files) {
    const htmlPath = path.resolve(inputDir, file);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    const pngPath = htmlPath.replace('.html', '.png');
    await page.screenshot({ path: pngPath, type: 'png' });
    pngs.push(pngPath);
  }

  // Combine to PDF using pdf-lib or similar
  await browser.close();
}
```

Puppeteer uses a modern Chromium renderer, so flexbox and grid work correctly. However, the slides in this skill are designed for wkhtmltoimage compatibility (float-based layouts), so they work in both renderers.

---

## Option 4: Online HTML-to-Image Tools

Several web tools convert HTML to images:
- htmlcsstoimage.com (API available)
- hcti.io
- Screenshot API services

Upload each HTML file, set dimensions to 1080x1080, download PNGs, combine into PDF.

---

## Combining PNGs into PDF

### On macOS
1. Select all PNG files in Finder
2. Right-click → Quick Actions → Create PDF
3. Reorder pages if needed in Preview

### On Windows
1. Select all PNG files
2. Right-click → Print → Microsoft Print to PDF
3. Set paper size to match aspect ratio

### Using Python (any platform)
```bash
pip install img2pdf
python -c "import img2pdf, sys; open(sys.argv[-1],'wb').write(img2pdf.convert(sys.argv[1:-1]))" slide1.png slide2.png slide3.png output.pdf
```

### Using ImageMagick
```bash
convert slide1.png slide2.png slide3.png output.pdf
```

---

*Manual Render Guide v1.0 — March 2026*
*Part of LinkedIn Carousel Forge skill*

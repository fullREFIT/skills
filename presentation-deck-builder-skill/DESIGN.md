# Design system

## Direction
Carbon Forge workbench. The page should feel like an operating instrument for building presentations, not a generic SaaS template.

## Scene
An operator is choosing a deck system on a laptop before a meeting. The room is bright, the task is time-sensitive, and the page must make the mechanism obvious without decoration getting in the way.

## Macrostructure
Workbench with an H2 split hero, N9 edge-aligned navigation, F3 tabular specification, C1 and C3 actions, and Ft5 statement footer.

## Color tokens
- Carbon Core: `#121010`
- Forge Dark: `#333130`
- Ash White: `#F2F0EE`
- Pure White: `#FFFFFF`
- Forge Red: `#D43B2A`
- Forge Gold: `#FFB400`
- Echo: `#6B6765`
- Soft Gray: `#D8D4D1`

Use Forge Red for primary actions and small state markers. Use Gold sparingly for capability or team signals. Do not use gradients.

## Typography
- Display and body: Outfit
- Technical labels: JetBrains Mono
- Hero maximum: 88px
- Body measure: 68ch
- No italic headings

## Layout
- 4px base spacing scale
- Split hero with a real CSS-rendered deck preview
- Alternating full-width workbench sections
- Avoid repeated equal cards
- Mobile single-column at 960px
- Tap targets at least 44px

## Motion
- One initial deck-stage settle
- Brand selector crossfade and color change
- No repeated scroll reveals
- Full reduced-motion support

## Accessibility
- WCAG AA contrast
- Semantic heading order
- Visible focus states
- Keyboard-operable brand selector
- No content hidden when JavaScript is unavailable

## Hallmark stamp
Macrostructure: Workbench. Genre: modern-minimal. Theme: Carbon Forge custom. Enrichment: live CSS deck preview. Nav: N9. Footer: Ft5.

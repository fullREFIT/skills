# Presentation Deck Builder v2

An open-source agent skill and renderer for turning structured research into branded, keyboard-navigable presentation websites.

**Website:** https://fullrefit-presentation-deck-builder.vercel.app
**User guide:** [USER-GUIDE.md](USER-GUIDE.md)
**Skill download:** [presentation-deck-builder-v2.zip](https://fullrefit-presentation-deck-builder.vercel.app/downloads/presentation-deck-builder-v2.zip)

## Why this exists

A presentation workflow often mistakes one house style for a universal rule. Presentation Deck Builder v2 separates content from brand selection. It offers four built-in profiles, accepts a validated custom profile, and creates an isolated renderer for each deck.

## What is included

```text
.
├── site/                         Landing page
├── docs/                         Supporting public documentation
├── examples/                     Synthetic example inputs
├── downloads/                    Installable skill zip
├── skill/
│   └── presentation-deck-builder-v2/
│       ├── SKILL.md
│       ├── README.md
│       ├── references/
│       ├── scripts/
│       └── assets/
│           ├── brands/
│           └── renderer/         Self-contained Vite renderer
├── USER-GUIDE.md
├── SECURITY.md
├── CONTRIBUTING.md
└── LICENSE
```

## Built-in brands

| Preset | Best fit |
| --- | --- |
| Carbon Forge | Technical reviews and operator briefings |
| TabSquirrel | Calm product education and knowledge tools |
| Executive Signal | Board updates, priorities, and metrics |
| Editorial Studio | Narrative reports, workshops, and learning material |

Custom profiles define ten color roles, three font roles, a wordmark, optional tagline, and explicit visual rules.

## Quick start

```bash
git clone https://github.com/fullREFIT/presentation-deck-builder-skill.git
cd presentation-deck-builder-skill
cp skill/presentation-deck-builder-v2/assets/report-template.json ./my-report.json
python3 skill/presentation-deck-builder-v2/scripts/prepare-branded-renderer.py \
  --brand carbon-forge \
  --report ./my-report.json \
  --output ./build/my-deck
cd build/my-deck
npm install
npm run validate
npm test
npm run typecheck
npm run build
npm run dev
```

The template contains replacement text. Edit it before expecting a useful deck.

## Agent installation

The downloadable zip follows the Agent Skills open format. It can be uploaded to Claude.ai or copied into the skills directory for Claude Code, Codex, Cursor, and compatible tools.

See [the complete installation and usage guide](USER-GUIDE.md).

## Public-package guarantees

- No machine-specific filesystem paths
- No API keys or credential helpers
- No telemetry
- No private reports or customer data
- No dependency on a private renderer repository
- Safe replacement guard for generated output directories
- Synthetic sample content only

## Development

The root site is a static landing page. The bundled renderer has its own Node project under:

```text
skill/presentation-deck-builder-v2/assets/renderer/
```

Run the repository checks:

```bash
npm install
npm test
npm run build
```

## License

Code and documentation are available under the MIT License. Brand names and marks remain the property of their respective owners. See [TRADEMARKS.md](TRADEMARKS.md).

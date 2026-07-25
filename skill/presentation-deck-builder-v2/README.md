# Presentation Deck Builder v2 skill

An installable Agent Skills package for creating validated, branded presentation websites.

## Installation

### Claude.ai, Claude Desktop, or Cowork

Upload `presentation-deck-builder-v2.zip` in Settings, Customize, Skills.

### Claude Code

```bash
cp -R presentation-deck-builder-v2 ~/.claude/skills/
```

### Codex

```bash
cp -R presentation-deck-builder-v2 ~/.codex/skills/
```

### Cursor

```bash
cp -R presentation-deck-builder-v2 ~/.cursor/skills/
```

## Requirements

- Python 3.10 or newer
- Node.js 20 or newer
- npm

No credential or hosted service is required.

## Contents

- `SKILL.md`: agent workflow and completion contract
- `references/user-guide.md`: complete step-by-step guide
- `references/schema-and-budgets.md`: report structure and content limits
- `references/brand-profile-schema.md`: custom-brand JSON contract
- `references/custom-brand-intake.md`: process for normalizing brand material
- `scripts/prepare-branded-renderer.py`: safe brand adapter
- `assets/brands/`: four built-in profiles
- `assets/report-template.json`: synthetic report template
- `assets/renderer/`: self-contained presentation renderer

## Quick test

From the skill directory:

```bash
python3 scripts/prepare-branded-renderer.py \
  --brand carbon-forge \
  --report assets/report-template.json \
  --output /tmp/presentation-deck-builder-smoke
cd /tmp/presentation-deck-builder-smoke
npm install
npm run validate
npm test
npm run typecheck
npm run build
```

## Public project

- Website: https://fullrefit-presentation-deck-builder.vercel.app
- Repository: https://github.com/fullREFIT/presentation-deck-builder-skill
- Guide: https://github.com/fullREFIT/presentation-deck-builder-skill/blob/main/USER-GUIDE.md

Licensed under MIT. Brand marks are addressed separately in the repository’s `TRADEMARKS.md`.

# Contributing

Contributions are welcome when they preserve the project’s core guarantees: isolated builds, source-backed content, explicit brand selection, deterministic validation, and no credential dependency.

## Development setup

```bash
git clone https://github.com/fullREFIT/skills.git
cd skills/presentation-deck-builder-skill
npm install
npm run check
```

Renderer checks:

```bash
cd skill/presentation-deck-builder-v2/assets/renderer
npm install
npm run validate
npm test
npm run typecheck
npm run build
```

## Pull requests

Include:

- the problem being fixed
- why the chosen boundary belongs in this repository
- tests for changed behavior
- screenshots for landing-page changes at desktop and mobile widths
- confirmation that `npm run audit:public` passes

Do not include real customer reports, private filesystem paths, credentials, proprietary fonts, or unlicensed logos.

## Brand profiles

A new built-in profile needs:

- a clear audience and use case distinct from existing profiles
- complete functional color and font roles
- evidence that the contributor can publish the brand name and marks
- adapter and renderer smoke tests
- documented rules and tradeoffs

Generic custom profiles should normally remain user-owned files rather than becoming built-in presets.

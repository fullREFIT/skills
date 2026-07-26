# Presentation Deck Builder v2: step-by-step user guide

This guide takes a first-time user from download to a validated presentation website. No private full/REFIT repository, hosted service, or API key is required.

## What this creates

The skill turns a structured JSON report into a responsive presentation website with:

- presenter and document modes
- keyboard, touch, and sidebar navigation
- direct links to individual reports
- built-in content budgets
- four brand presets
- custom-brand support
- local validation and tests
- a production-ready static build

It does not generate PowerPoint or Keynote files.

## Requirements

Install:

- Python 3.10 or newer
- Node.js 20 or newer
- npm
- an agent platform that supports skills, or a terminal if using the scripts manually

Check the versions:

```bash
python3 --version
node --version
npm --version
```

## Option A: install from the downloadable zip

### Claude.ai, Claude Desktop, or Cowork

1. Download `presentation-deck-builder-v2.zip` from the project website.
2. Open **Settings**.
3. Open **Customize** and then **Skills**.
4. Choose **Create skill** or the upload option.
5. Upload the zip without unpacking it.
6. Enable the skill.
7. Ensure code execution is enabled if the platform requires it for scripts.
8. Start a new conversation and ask for a presentation deck.

Example prompt:

```text
Use Presentation Deck Builder v2 to turn the attached research into an executive briefing. Show me the four built-in brands before choosing one. Do not invent any data.
```

### Claude Code

Unzip the package, then copy the skill folder:

```bash
unzip presentation-deck-builder-v2.zip
cp -R presentation-deck-builder-v2 ~/.claude/skills/
```

Verified one-command project installation:

Run this from the root folder of the project where Claude Code should use the skill:

```bash
npx skills@latest add fullREFIT/skills \
  --skill presentation-deck-builder-v2 \
  --agent claude-code \
  --yes \
  --copy
```

This command downloads the public repository and copies the complete skill into `.claude/skills/presentation-deck-builder-v2` for that project. It requires Node.js, npm, and an internet connection.

**Expected result:** the installer reports `Installation complete`, and `npx skills@latest list --json` lists `presentation-deck-builder-v2` with project scope.

Manual project-only installation:

```bash
mkdir -p .claude/skills
cp -R presentation-deck-builder-v2 .claude/skills/
```

### OpenAI Codex

```bash
unzip presentation-deck-builder-v2.zip
mkdir -p ~/.codex/skills
cp -R presentation-deck-builder-v2 ~/.codex/skills/
```

### Cursor

```bash
unzip presentation-deck-builder-v2.zip
mkdir -p ~/.cursor/skills
cp -R presentation-deck-builder-v2 ~/.cursor/skills/
```

## Option B: clone the repository

```bash
git clone https://github.com/fullREFIT/skills.git
cd skills/presentation-deck-builder-skill
```

The installable skill is located at:

```text
skill/presentation-deck-builder-v2/
```

## Step 1: define the briefing

Before writing JSON, answer four questions:

1. Who will see the deck?
2. What decision should they make?
3. Which sources support the content?
4. Will the deck be presented live, shared as a link, or read independently?

A deck without a decision often becomes a formatted document with unnecessary navigation.

## Step 2: create the report JSON

Copy the template:

```bash
cp skill/presentation-deck-builder-v2/assets/report-template.json ./my-report.json
```

Edit these top-level fields first:

- `slug`: kebab-case route identifier
- `title`: deck title
- `subtitle`: one-line framing
- `topic`: subject area
- `date`: ISO date
- `intro`: opening decision frame
- `methodology`: how evidence was selected or interpreted
- `items`: the body of the briefing
- `closing`: final action
- `seo`: browser and sharing metadata

The agent should read `references/schema-and-budgets.md` before authoring. The validator rejects oversized headlines, labels, takeaways, highlights, risks, and tabs.

### Source discipline

For every factual item:

- include a public or authorized source
- distinguish verified facts from inference
- write a recommendation separately from evidence
- use `https` links
- avoid customer data unless the output remains private

Do not invent evidence to make the deck look complete.

## Step 3: choose a built-in brand

### Carbon Forge

Choose for technical reviews, operating briefs, implementation plans, and decisive recommendations.

```bash
--brand carbon-forge
```

### TabSquirrel

Choose for calm product education, knowledge organization, and approachable technology.

```bash
--brand tab-squirrel
```

### Executive Signal

Choose for board updates, metrics, priorities, and data-led decision meetings.

```bash
--brand executive-signal
```

### Editorial Studio

Choose for narrative reports, workshops, learning material, and story-led research.

```bash
--brand editorial-studio
```

## Step 4: prepare the branded renderer

Run from the repository root:

```bash
python3 skill/presentation-deck-builder-v2/scripts/prepare-branded-renderer.py \
  --brand executive-signal \
  --report ./my-report.json \
  --output ./build/my-report-deck
```

What the script does:

1. Validates the selected brand profile.
2. Copies the bundled renderer into a new output directory.
3. Replaces color and font tokens in the copy.
4. Generalizes the brand schema and validator in the copy.
5. Replaces the wordmark and page metadata.
6. Applies the brand block to the report.
7. Writes the report into the renderer.
8. Sets the manifest default to the report slug.
9. Marks the output so `--force` can safely identify it later.

The bundled renderer is never modified.

## Step 5: install dependencies

```bash
cd build/my-report-deck
npm install
```

`npm install` is required in each newly generated renderer unless dependencies are managed by a shared package cache.

## Step 6: run all verification gates

```bash
npm run validate
npm test
npm run typecheck
npm run build
```

Expected result:

- validation confirms the report slug and item count
- tests pass
- TypeScript exits with no errors
- Vite creates `dist/`

If validation fails, fix the report. Do not weaken a content budget merely to make an overcrowded slide pass.

## Step 7: preview locally

```bash
npm run dev
```

Open the localhost URL printed by Vite. Test:

- `Left` and `Right` for tabs
- `Up` and `Down` for items
- `Space` for the next meaningful view
- sidebar opening and closing
- help overlay
- direct route `/report/your-slug`
- desktop width around 1440px
- tablet width around 768px
- mobile widths 320px, 375px, and 414px

Check that no headline, stat, source, or control overflows its container.

## Step 8: create a custom brand

Read the schema:

```text
skill/presentation-deck-builder-v2/references/brand-profile-schema.md
```

Start from one of the preset JSON files in `assets/brands/` and save a new profile outside the installed skill.

Required color roles:

- `dark`
- `dark2`
- `canvas`
- `surface`
- `text`
- `muted`
- `primary`
- `primaryHover`
- `secondary`
- `border`

Required font roles:

- `body`
- `display`
- `mono`
- `googleCss`

The `googleCss` field must be empty or use an `https://fonts.googleapis.com/css2` URL.

Example command:

```bash
python3 skill/presentation-deck-builder-v2/scripts/prepare-branded-renderer.py \
  --brand custom \
  --custom-profile ./my-brand.json \
  --report ./my-report.json \
  --output ./build/my-custom-deck
```

### Recommended custom-brand process

1. Gather the logo, website, brand guide, colors, and font licenses.
2. Identify which supplied assets are authoritative.
3. Map supplied colors to the ten functional roles.
4. Use a text wordmark when no web-safe logo is supplied.
5. Confirm body, display, and mono font stacks.
6. Write explicit rules such as “no gradients” or “gold only for capability signals.”
7. Show the normalized profile to the brand owner.
8. Obtain confirmation before building.
9. Run every verification gate.
10. Compare the rendered deck against the source brand material.

The skill must not infer trademark ownership or publish proprietary font files.

## Step 9: rebuild safely

To replace an output created by this skill:

```bash
python3 skill/presentation-deck-builder-v2/scripts/prepare-branded-renderer.py \
  --brand tab-squirrel \
  --report ./my-report.json \
  --output ./build/my-report-deck \
  --force
```

`--force` refuses to delete a directory unless it contains `.presentation-deck-builder-output`.

## Step 10: deploy to Vercel

Vercel is optional. Local generation and builds do not require an account.

Install and authenticate the Vercel CLI, then run inside the generated renderer:

```bash
vercel link
vercel deploy --prod
```

Verify the exact production URL in an unauthenticated browser. Confirm the page title, report route, JavaScript assets, and selected brand.

Other static hosts can deploy the generated `dist/` directory.

## Troubleshooting

### “Brand profile missing”

Confirm the preset id or pass `--custom-profile` with an existing JSON file.

### “Color must be six-digit hex”

Use values such as `#D43B2A`, not three-digit hex, RGB, HSL, or named colors.

### “Expected renderer marker missing”

The supplied `--source` renderer is not compatible with this adapter. Remove `--source` to use the bundled renderer.

### “Refusing to replace unmarked directory”

Choose a new output directory. Do not add the marker manually to an unrelated folder.

### Report validation failure

Read the exact field named by the validator, then compare it with `references/schema-and-budgets.md`.

### Fonts do not match

Confirm the Google Fonts URL loads the exact family names used in the CSS stacks. Licensed local fonts require an intentional renderer fork and are not bundled.

### The local route shows the sample

Confirm `public/report-manifest.json` contains `defaultSlug` matching the report slug and that `public/reports/<slug>.json` exists.

## Security and privacy

- The adapter makes no network calls.
- No telemetry is included.
- No API key is required.
- Font loading and optional GitHub metadata are the only browser-side network features in the renderer.
- Do not put confidential reports into a public Git repository.
- Review custom links and embedded sources before deployment.
- Treat downloaded reports and brand profiles as untrusted input.

## Updating

Pull the latest repository changes and reinstall the skill folder. Generated deck outputs remain independent and are not changed automatically.

## Uninstalling

Remove the installed skill directory:

```bash
rm -rf ~/.claude/skills/presentation-deck-builder-v2
```

Only run that command when the path exactly matches the installed skill directory. Generated deck projects are separate and remain intact.

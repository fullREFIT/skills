# Signal Scanner

Internal build/activity content scanner for creators and builders. Mines your own builds, automations, tools, debugging sessions, docs, runbooks, deployments, and agent work for proof-backed content and revenue opportunities.

## Installation

### Claude.ai / Claude Desktop
1. Navigate to Settings > Customize > Skills.
2. Click "+" then "Create skill".
3. Upload `signal-scanner.zip`.
4. Toggle the skill on.

### Claude Code
```bash
cp -r signal-scanner/ ~/.claude/skills/signal-scanner/
```

## Before First Use

**Customize `references/business-context.md`** — this file contains your business context (offers, sprint state, strengths, constraints). The default file is a template with placeholders. Fill it in before running any scans.

**Update `references/revenue-content-engine-context.md`** — update the canonical file paths to point to your actual project structure.

## Usage

Point it at a build, folder, doc, session, workflow, or activity trail and say one of:

- "Scan this build"
- "What content is in this work?"
- "Mine this project for content"
- "Scan my activity from today"
- "What revenue angle is in this?"
- "/scan"

The skill produces a structured scan with proof inventory, content candidates, revenue opportunities, Revenue-Content Engine routing, verdict, and one next action.

## What It Does

1. Inspects real proof artifacts from your own work.
2. Separates usable system/operator lessons from private personal-process material.
3. Enforces the brand-position rule: the creator is never the failure case.
4. Generates proof-backed content candidates across long-form, short-form, LinkedIn, carousel, lead magnet, and service angles.
5. Routes candidates through Revenue-Content Engine layers without bypassing your content demand engine.
6. Prioritizes buyer-facing revenue action when the proof creates one.
7. Assigns one specific next action.

## What It Does NOT Do

- Does not primarily scan market news or competitor announcements.
- Does not produce final scripts or posts.
- Does not replace your weekly shortlist or recording-candidate promotion.
- Does not run final editorial QA.
- Does not fabricate proof.

## Design Principle

The lesson is the asset. Your real work supplies the proof, but you are not the failure case. Signal Scanner captures the content/revenue opportunity while the artifact is fresh, then routes it to the correct Revenue-Content Engine layer.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill instructions |
| `references/revenue-content-engine-context.md` | RCE map and internal-proof routing rules |
| `references/business-context.md` | Your business context — **customize before use** |
| `references/analysis-framework.md` | Scoring, gates, and output standards |
| `README.md` | This file |

## Version

v1.2 - Generalized for any creator or builder. Original: mines the creator's own builds and activities, not primarily external market-news scanning.

# claude-md-forge

Turn a long conversation, a video transcript, a strategy doc, or a pile of notes into a topic-specific `CLAUDE.md` — so that opening Claude Code in that directory starts every session already holding the strategy, tactics, vocabulary, and rejected paths from that source.

## What it actually does

Distills, rather than summarizes. The inclusion test for every line is *"if the agent did not know this, what would it do differently?"* — anything with no concrete answer goes to `docs/` or gets cut, with a visible cut list so you can check the judgment.

It refuses to produce README-style documentation. Badges, install steps, license blocks, contribution guidelines, and contact info are all accurate and all behaviorally inert; they belong in `README.md`, not in a file that loads into every turn.

## Install

Unzip into your skills directory:

- Claude Code: `~/.claude/skills/claude-md-forge/`
- Project-scoped: `<project>/.claude/skills/claude-md-forge/`
- Claude.ai / Cowork: upload `claude-md-forge.skill` or `.zip` and save.

## Use

```
Turn this conversation into a CLAUDE.md for ~/work/lead-gen
Make a CLAUDE.md from this YouTube transcript so my Claude Code sessions
  in ./pricing know the method
```

Give it the source (paste, file path, or attached transcript) and the target directory.

## Output

```
<project-dir>/
├── CLAUDE.md                 the behavioral contract
└── docs/
    ├── <topic>-reference.md  depth that didn't earn persistent-context space
    └── SOURCES.md            sources, dates, transcription fixes, cut list
```

Plus a short chat report: what the file makes the agent do differently, what was cut, what could not be verified.

## Verify

```bash
python3 scripts/audit_claudemd.py path/to/CLAUDE.md
python3 scripts/audit_claudemd.py path/to/CLAUDE.md --json   # machine-readable
```

Checks budget, README drift, transcript narration, unfilled placeholders, required structure, provenance, undated volatile facts, unverifiable criteria, and the ratio of instructions to description. Exit 1 on any FAIL. No dependencies beyond Python 3.

## Files

| Path | Purpose |
|---|---|
| `SKILL.md` | Triggers, governing principle, six-pass procedure, sizing, boundaries |
| `references/extraction-passes.md` | Full pass-by-pass extraction procedure |
| `references/claude-md-template.md` | Annotated section-by-section template |
| `references/anti-patterns.md` | README trap, transcript summary, paste, vibes, fabrication |
| `assets/CLAUDE.md.template` | Copyable skeleton |
| `scripts/audit_claudemd.py` | Deterministic audit |

## Boundaries

Not for scaffolding new projects (`cc-project-architect`), refreshing stale docs against current reality (`project-doc-refresh`), or producing human-facing guides from transcripts (`transcript-superguide`).

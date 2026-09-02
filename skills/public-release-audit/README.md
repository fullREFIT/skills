# Public Release Audit

Audit a private skill, prompt, framework, protocol, template, or project before publishing it for strangers to use.

The audit separates four questions:

1. Do we have the right to publish it?
2. Does it contain private or identifying material?
3. Can a stranger use it without the author's private systems?
4. Is the chosen public package complete and verified?

## Install

Clone this repository and copy `skills/public-release-audit/` into the skill directory for your agent, or install it through the repository's supported skill installer.

## First use

Ask the agent:

```text
Audit `/path/to/my-skill` for public release. Determine the provenance, privacy, portability, release verdict, and best package shape. Run the safety scan and report evidence for every finding.
```

## Contents

- `SKILL.md`: core audit workflow and verdict rules
- `references/package-selection.md`: choose skill, protocol, reference, template, or project
- `references/public-release-checklist.md`: evidence and acceptance checklist
- `scripts/scan_public_safety.py`: deterministic first-pass scanner
- `assets/`: reserved for reusable release templates

## Scope

The scanner identifies likely private material. It does not determine copyright ownership, permission, confidentiality, or whether a workflow is genuinely useful. The agent must inspect every finding and report unresolved uncertainty as `HOLD`.

## License

MIT. See the repository license.

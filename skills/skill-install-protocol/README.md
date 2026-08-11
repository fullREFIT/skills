# Skill Install Protocol

Distribute one completed skill from a canonical source to the client environments already installed on a machine.

## Use

```text
Install the completed skill at `/path/to/canonical-collection/skill-name` using the skill-install-protocol. Verify every existing client destination and report parity, skipped clients, and behavioral tests.
```

## Package contents

- `SKILL.md`: canonical-first installation and verification workflow
- `references/verification-matrix.md`: destination and evidence template
- `scripts/`: reserved for deterministic platform helpers
- `assets/`: reserved for reusable report templates

## Important limits

This skill does not install a client, create credentials, modify platform settings, or publish a repository. It reports those as separate actions requiring the platform's supported workflow.

## License

MIT.

# Package Selection

Choose the smallest public artifact that preserves the useful behavior.

| Shape | Use when | Required surface |
| --- | --- | --- |
| Skill | An agent should discover and invoke a repeatable workflow | `SKILL.md`, trigger description, workflow, references, validation |
| Protocol | A human or agent must follow a fixed governance or operating sequence, and the repository already has a protocol convention | purpose, inputs, gates, steps, outputs, verification, failure cases |
| Reference | The material explains a domain or API and is loaded by another skill | concise source-backed document linked from its parent |
| Template | The material is copied and filled in by the user or agent | placeholders, instructions, example, validation |
| Script | Deterministic behavior is better expressed as executable code | CLI contract, dependencies, exit codes, tests |
| Full project | The deliverable has its own runtime, installation, tests, and release lifecycle | repository directory, README, license, CI, install and first-success workflow |

## Decision rules

1. Choose a skill when triggerability is part of the value.
2. Choose a protocol when the main value is governance and it should not auto-trigger as a task skill.
3. Put supporting material in `references/`, not a parallel catalog.
4. Do not convert a full application into a skill just to make it easier to publish.
5. Do not create a protocol folder merely because the source began as a prompt.
6. If one artifact contains several independent workflows, split them into separate skills or a skill plus references.
7. If publication requires a private service, publish a pluggable interface only when the public behavior remains useful without that service.
8. If provenance is unresolved, choose `HOLD`, regardless of package shape.

## Public release tiers

- `stable`: first-success workflow verified from the canonical public repository
- `beta`: structure and safety verified, but end-to-end behavior or one claimed platform remains unverified
- `experimental`: published for inspection only, with no implied support
- `private`: not included in the public repository

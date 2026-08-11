# Verification Matrix

Use one row per destination. Never report a group of destinations as verified when one row is unknown.

| Destination | Root existed | Pre-existing skill | Copy result | File count | Hash parity | Reload or fresh session | Trigger test | Status |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| `<client root>` | yes/no | yes/no | copied/skipped/failed | `<n>` | pass/fail/not run | pass/fail/not applicable | pass/fail/not run | verified/blocked |

## Evidence rules

- `Root existed` is a filesystem check on the client root, not on its `skills/` child.
- `File count` is a quick check. `Hash parity` is the load-bearing check.
- `Reload or fresh session` proves the client can discover the copied skill.
- `Trigger test` is required for a new or substantially customized skill.
- A skipped destination must include the exact reason, such as `client root absent` or `desktop upload not attempted`.
- A failed destination must be re-copied from canonical before it can be marked verified.

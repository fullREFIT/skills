# Security Policy

## Report a vulnerability

Do not publish vulnerability details, credentials, private data, or exploit steps in a public issue.

Use GitHub's private vulnerability reporting feature for this repository. If that feature is unavailable, contact the repository owner through the verified full/REFIT website and state only that you need a private security channel.

Include:

- The affected skill and version or commit
- The minimum steps needed to reproduce the issue
- The impact you observed
- Whether credentials or personal data may be exposed
- A safe contact method for follow-up

## Public package policy

Published skills must not include:

- Credentials, tokens, passwords, or connection strings
- Private customer records or internal business documents
- Machine-specific home-directory paths
- Hidden telemetry
- Destructive actions without explicit guards
- Dependencies on private repositories unless clearly declared and intentionally access-gated

## Supported releases

The latest commit on `main` and the latest tagged release receive security fixes. Older versions may be asked to upgrade before a fix is investigated.

## Response

Maintainers will acknowledge a credible report privately, assess impact, prepare a fix, and coordinate disclosure. Acknowledgement is not a guarantee of a specific resolution timeline.

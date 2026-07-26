# Security policy

## Supported version

Security fixes are applied to the latest release on the `main` branch.

## Reporting a vulnerability

Do not open a public issue containing an exploitable vulnerability or private data. Email `paul@fullrefit.com` with:

- affected file and version
- reproduction steps
- expected impact
- suggested mitigation, if known

## Security model

The adapter:

- uses the Python standard library
- makes no network calls
- validates brand identifiers, colors, fonts, and font stylesheet URLs
- escapes wordmark and metadata strings before inserting them into HTML
- refuses unsafe output paths
- replaces an existing directory only when it contains the generated-output marker

The renderer can make browser requests to:

- Google Fonts when a selected profile uses its stylesheet service
- the public GitHub API when a report contains a GitHub repository card
- source URLs deliberately included in a report

No telemetry, analytics, API key, or hosted generation service is included.

## User responsibilities

- Review report links and embedded sources before deployment.
- Keep confidential reports out of public repositories.
- Confirm font and trademark rights for custom brands.
- Treat downloaded reports and brand profiles as untrusted input.
- Verify the deployed site without authentication before sharing its URL.

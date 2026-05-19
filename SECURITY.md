# Security Policy

## Supported Versions

Security fixes are applied to the current `develop` branch and the latest public release when releases are available.

## Reporting a Vulnerability

Do not open a public GitHub issue for security vulnerabilities.

Please report suspected vulnerabilities privately to the maintainers. Include:

- Affected files, screens, or endpoints.
- Steps to reproduce the issue.
- Expected and actual behavior.
- Impact and severity if known.
- Any proof-of-concept code, screenshots, or logs that help explain the issue.

If GitHub private vulnerability reporting is enabled for this repository, use that channel. Otherwise, contact a maintainer directly through the repository owner profile.

## Sensitive Data

Do not commit:

- `.env` files.
- API keys or service tokens.
- ngrok or other private tunnel URLs.
- Native signing keys, certificates, or provisioning profiles.
- Production analytics or crash reporting credentials.

If a secret is committed, rotate it immediately and remove it from the repository history before publishing the repository publicly.

# Contributing

Thank you for considering a contribution to Check-IA Mobile. This project is an Expo mobile client for fact-checking and media literacy workflows.

## Ways to Contribute

- Fix bugs in the mobile app.
- Improve accessibility, performance, or test coverage.
- Improve French-language copy and learning content.
- Add documentation for setup, architecture, or backend integration.
- Report reproducible issues with clear device and environment details.

## Development Setup

```bash
git clone https://github.com/immerSIR/checkia-mobile.git
cd checkia-mobile
npm install
cp .env.example .env
npm start
```

Set `EXPO_PUBLIC_API_URL` in `.env` to a backend API you control. Do not commit `.env` files or tunnel URLs.

Use Node.js 20.19.4 or newer. Node 22 LTS is recommended and is used by CI.

## Before Opening a Pull Request

Run:

```bash
npm run typecheck
npm test
```

For UI changes, also run the app on at least one supported target:

```bash
npm run android
# or
npm run ios
```

## Pull Request Guidelines

- Keep pull requests focused on one change.
- Add or update tests for behavior changes.
- Update documentation when setup, scripts, or user-facing behavior changes.
- Include screenshots or screen recordings for visible UI changes.
- Describe any backend assumptions or required API changes.

## Code Style

- Use TypeScript for application code.
- Follow the existing Expo Router and component organization.
- Prefer small reusable components over large screen files.
- Keep French user-facing copy clear, direct, and consistent with the existing tone.
- Do not hard-code private URLs, credentials, tokens, or signing material.

## Commit Messages

Use short, descriptive commit messages. Conventional Commits are welcome but not required.

Examples:

```text
fix: load API URL from Expo config
docs: add setup guide
test: cover URL verification helper
```

## Code of Conduct

By participating in this project, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

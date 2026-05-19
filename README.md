# Check-IA Mobile

Check-IA Mobile is an Expo and React Native app for AI-assisted fact-checking workflows. It is designed for French-speaking communities, with product copy and learning content focused on media literacy, misinformation, and verification habits in Francophone Africa.

The app currently includes:

- Authentication screens for login and registration backed by Supabase Auth, with the Supabase session stored in `expo-secure-store`.
- A home dashboard with synchronized text, URL, and image verification history.
- Verification flows for text, URLs, and images, including polling for asynchronous backend results.
- Audio verification UI scaffolding for a future backend workflow.
- Local URL preview metadata derived from the submitted URL.
- A learning area with media literacy articles and categories.
- Jest and React Native Testing Library coverage for UI components, hooks, helpers, and API services.

## Project Status

This repository is being prepared as an open-source mobile client. Text, URL, authentication, and image verification flows now call the backend API. Audio verification and third-party sign-in remain UI placeholders until compatible backend services are available. Contributions should keep user-facing copy clear for French-speaking audiences and avoid adding hard-coded private service URLs or credentials.

## Tech Stack

- Expo SDK 54
- Expo Router
- React 19
- React Native 0.81
- TypeScript
- Axios
- Jest
- React Native Testing Library

## Requirements

- Node.js 20.19.4 or newer. Node 22 LTS is recommended.
- npm 10 or newer
- Git
- Expo CLI through `npx expo`
- Android Studio, Xcode, Expo Go, or another Expo-compatible test target
- Watchman is recommended on macOS and Linux

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/immerSIR/checkia-mobile.git
cd checkia-mobile
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Update `.env` with the backend URL and the Supabase project used by that backend. The app requires these values at runtime:

```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Start the development server:

```bash
npm start
```

Then choose a target from the Expo prompt:

- Press `a` for Android.
- Press `i` for iOS on macOS.
- Scan the QR code with Expo Go for a physical device.

## Scripts

```bash
npm start          # Start Expo
npm run android    # Build and run on Android
npm run ios        # Build and run on iOS
npm run web        # Start Expo for web
npm test           # Run Jest tests
npm run test:watch # Run Jest in watch mode
npm run coverage   # Generate test coverage
npm run typecheck  # Run the TypeScript compiler without emitting files
```

## Configuration

The app reads its backend URL from `EXPO_PUBLIC_BACKEND_URL`. `EXPO_PUBLIC_API_URL` is still accepted for older local `.env` files and is normalized back to the backend root if it ends in `/api`. Supabase Auth reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

Do not point the mobile app at the backend `/api/auth/*` endpoints. The backend validates Supabase JWTs; the app signs in, signs up, refreshes, and signs out through the official Supabase SDK, then sends `Authorization: Bearer <supabase_jwt>` to the Check-IA API.

For physical device testing, `localhost` points to the device, not your development machine. Use a LAN IP address or a tunnel URL that you control.

Do not commit `.env`, ngrok tunnel URLs, production API keys, signing keys, certificates, provisioning profiles, or other private deployment material.

## Repository Layout

```text
app/             Expo Router routes and screens
assets/          App icons and splash assets
components/      Reusable UI and feature components
constants/       Shared constants and theme values
data/            Static learning and mock dashboard data
docs/            Maintainer and project documentation
hooks/           Reusable React hooks
services/        API client modules
styles/          Shared screen styles
utils/           Helper functions
```

## Testing

Run the full test suite:

```bash
npm test
```

Run coverage locally:

```bash
npm run coverage
```

Generated coverage output is intentionally ignored by Git. Share coverage summaries in pull requests when they are relevant, but do not commit generated reports.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues should be reported through the process in [SECURITY.md](SECURITY.md), not public GitHub issues.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

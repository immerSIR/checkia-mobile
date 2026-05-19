# Development Guide

## Local Backend

The mobile app expects a backend API compatible with the routes in `services/api.ts`.

Set the API base URL in `.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

For device testing, `localhost` points to the device, not your computer. Use a LAN IP address or a tunnel URL that you control:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000/api
```

Do not commit local tunnel URLs.

## Useful Commands

```bash
npm start
npm run android
npm run ios
npm run web
npm test
npm run coverage
npm run typecheck
```

## Troubleshooting

Clear Expo and Metro state:

```bash
npx expo start -c
```

Reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

If native builds become inconsistent, regenerate native projects through Expo instead of committing local generated `ios/` or `android/` folders unless the project intentionally moves to a prebuild workflow.

# Development Guide

## Local Backend

The mobile app expects a backend API compatible with the routes in `services/api.ts`.

Set the API base URL in `.env`. The app fails fast on startup when this value is missing outside tests:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

`localhost` works only when the app runtime can reach a backend on the same host. For physical device testing, `localhost` points to the device, not your computer. Use a LAN IP address or a tunnel URL that you control:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000/api
```

Do not commit local tunnel URLs.

The current mobile client calls these backend capabilities:

- Authentication through `/auth/login/`, `/auth/register/`, `/auth/user/`, and `/auth/logout/`.
- Text and URL submissions through `/submissions/`, with result polling on `/submissions/{id}/`.
- Image AI detection through `/detect-ai-image/`.
- Image content verification through `/verify-image-content/`.
- Image history through `/image-verifications/`.
- Asynchronous task polling through `/task-status/{taskId}/`.

Audio verification is still UI-only and intentionally disabled in the analyze button until a backend contract is added.

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

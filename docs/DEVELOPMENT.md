# Development Guide

## Local Backend

The mobile app expects a backend API compatible with the routes in `services/api.ts`.

Set the backend and Supabase project values in `.env`. The app fails fast on startup when these values are missing outside tests:

```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

`localhost` works only when the app runtime can reach a backend on the same host. For physical device testing, `localhost` points to the device, not your computer. Use a LAN IP address or a tunnel URL that you control:

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.20:8000
```

Do not commit local tunnel URLs.

The current mobile client signs users in directly with Supabase Auth and sends the Supabase access token as `Authorization: Bearer <supabase_jwt>` to the backend. It does not call the backend `/api/auth/*` proxy views.

The current mobile client calls these backend capabilities:

- Text and URL submissions through `POST /api/submissions/`, with task polling on `/api/task-status/{taskId}/`.
- User text history through `GET /api/user-submissions/`.
- Image AI detection through `POST /api/detect-ai-image/`.
- Image content verification through `POST /api/verify-image-content/`.
- Image history through `GET /api/image-verifications/`.
- Public facts through `GET /api/facts/`.
- Public keywords through `GET /api/keywords/`.

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

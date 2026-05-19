# Architecture

Check-IA Mobile is organized around Expo Router routes, reusable feature components, and a small API service layer.

## Routing

Routes live in `app/` and are grouped by user flow:

- `app/(auth)/` contains authentication and onboarding screens.
- `app/(tabs)/` contains the main tab navigation screens.
- `app/history/` contains the history view.
- `app/learn/[slug].tsx` displays learning content by slug.
- `app/result/[id].tsx` displays verification results.

## Feature Areas

- `components/home/` renders the dashboard summary and recent history UI.
- `components/verify/` renders the text, URL, image, and audio verification inputs.
- `components/learn/` renders learning content lists and cards.
- `components/profile/` renders profile menu rows.
- `components/ui/` contains reusable primitive UI components.

## Data and State

- `hooks/useVerify.ts` owns local state and actions for the verification screen.
- `utils/apiMappers.ts` maps backend submissions and image verification records into shared view models for history and result screens.
- `data/` contains static learning content and fallback UI data used by current screens.
- `constants/` contains theme values and feature constants.
- `utils/` contains testable helper functions.

## API Layer

`services/supabase.ts` creates the Supabase client and persists Supabase Auth sessions in `expo-secure-store`. `services/api.ts` creates the Axios client and exports API modules for authentication, fact-checking, image verification, task polling, public content, and local URL preview metadata.

The backend base URL comes from:

```text
EXPO_PUBLIC_BACKEND_URL
```

`EXPO_PUBLIC_API_URL` is accepted for older local environments and normalized back to the backend root when it ends in `/api`.

Supabase Auth reads:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

The Axios request interceptor reads the active Supabase session through the SDK and adds `Authorization: Bearer <supabase_jwt>` when a token is available. On a 401 response, it asks Supabase to refresh the session, retries the request once, and signs the user out if the retry cannot be authorized.

Authentication uses Supabase SDK methods (`signUp`, `signInWithPassword`, `signOut`). The app must not call backend `/api/auth/*` proxy endpoints.

Current backend routes used by the app:

- `POST /api/submissions/`
- `GET /api/task-status/{taskId}/`
- `GET /api/user-submissions/`
- `POST /api/detect-ai-image/`
- `POST /api/verify-image-content/`
- `GET /api/image-verifications/`
- `GET /api/facts/`
- `GET /api/keywords/`

Text and URL submissions poll `/api/task-status/{taskId}/` until the backend status leaves `en cours`. Image submissions poll the same task endpoint until the asynchronous image verification returns a final result. API code preserves backend French status strings (`en cours`, `vérifié`, `rejeté`) and maps them to UI copy only in `utils/apiMappers.ts`.

## Testing

Tests are colocated in `__tests__` directories near the source they cover. Jest uses the `jest-expo` preset and React Native Testing Library for component tests.

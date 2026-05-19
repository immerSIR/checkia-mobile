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

`services/api.ts` creates the Axios client and exports API modules for authentication, fact-checking, image verification, task polling, and local URL preview metadata.

The base URL comes from:

```text
EXPO_PUBLIC_API_URL
```

This value is required outside tests. The service layer trims whitespace and trailing slashes before passing the URL to Axios.

The Axios request interceptor reads the JWT token from `expo-secure-store` and adds an `Authorization` header when a token is available.

Current backend routes used by the app:

- `POST /auth/login/`
- `POST /auth/register/`
- `GET /auth/user/`
- `POST /auth/logout/`
- `POST /submissions/`
- `GET /submissions/`
- `GET /submissions/{id}/`
- `POST /detect-ai-image/`
- `POST /verify-image-content/`
- `GET /image-verifications/`
- `GET /task-status/{taskId}/`

Text and URL submissions poll `/submissions/{id}/` until the backend status leaves `en cours`. Image submissions poll `/task-status/{taskId}/` until the asynchronous image verification returns a final result.

## Testing

Tests are colocated in `__tests__` directories near the source they cover. Jest uses the `jest-expo` preset and React Native Testing Library for component tests.

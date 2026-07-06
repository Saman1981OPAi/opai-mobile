# OPAi Mobile Architecture

## Current App Foundation

The first mobile foundation is an Expo React Native app with a shared TypeScript codebase for iOS and Android.

Current layers:

- `App.tsx`: app entry and active module state.
- `src/components`: reusable mobile UI primitives and shell.
- `src/data`: static module/workflow definitions for MVP screens.
- `src/screens`: module-specific app screens.
- `src/theme`: OPAi mobile design tokens.
- `src/types`: shared navigation and workflow types.

## Navigation Model

The app uses a Nori-inspired active AI structure:

- Persistent active AI panel near the top.
- Primary bottom navigation for the highest-frequency modules:
  - Home
  - Start My Shift
  - New Incident
  - Translation
  - AI Assistant
- Secondary modules are reachable from the dashboard and active AI workflows:
  - Calendar
  - Court
  - Training & Requalification
  - Notes & Files
  - Notifications
  - Settings

## MVP Build Order

1. Authentication shell.
2. Dashboard.
3. Start My Shift reminders.
4. Translation.
5. Calendar.
6. AI Assistant.
7. Notifications.
8. Incident capture.
9. Court, Training, Notes & Files.

## Future Services

- Firebase Authentication for login.
- Firebase Cloud Messaging for push notifications.
- FastAPI backend for business logic.
- PostgreSQL for durable records.
- OpenAI API for AI assistant features.
- Cloudflare R2 for secure files.

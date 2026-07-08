# Sprint 006: Backend Planning and Secure API Contract

## Objective

Create the backend planning foundation and secure API contract for OPAi Police without implementing a production backend.

## Scope Completed

- Added backend architecture planning.
- Added formal planned API contract.
- Added TypeScript-style data model planning.
- Added environment configuration planning.
- Added security and privacy model.
- Added error handling standard.
- Added local mock service layer in `src/services`.
- Refactored screen data access to use mock services where appropriate.

## Mock Service Layer

The app now has local service abstractions for:

- `apiClient`
- `mockApiClient`
- `authService`
- `dashboardService`
- `shiftService`
- `incidentService`
- `aiService`
- `translationService`
- `calendarService`
- `courtService`
- `trainingService`
- `notesService`
- `notificationService`

These services return local placeholder data only. They do not call a live server.

## Explicit Non-Goals

- No real backend deployment.
- No production database.
- No OpenAI API calls.
- No real authentication provider.
- No payment or subscription logic.
- No police-service integrations.
- No production secrets.
- No network calls from the app to a live server.
- No Android release workflow.
- No Google Play production workflow.

## iOS-First Priority

iOS remains the active launch priority. Android compatibility is preserved, but Android and Google Play release work remain paused until the D-U-N-S Number for Ebrahimi Holdings is received.

## Testing Required

- `pnpm typecheck`
- iOS Expo export
- Android Expo export for compatibility only
- Local Expo smoke test
- Static scan for live network, OpenAI, database, payment, secret, and Android production workflow additions

## Known Limitations

- API contract is documentation only.
- Data models are planning interfaces only.
- Mock services are synchronous local facades.
- No server, database, storage, notification, calendar, AI, or auth provider is connected.

## Next Recommended Sprint

Sprint 007 should review the EAS production build workflow failure, then either stabilize iOS build automation or create backend repository scaffolding after the API contract is approved.

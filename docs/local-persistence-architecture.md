# Local Persistence Architecture

Sprint 007 introduces a device-local persistence layer for the OPAi Police prototype. It is designed for offline demonstration data only and does not connect to a backend, cloud database, OpenAI API, police-service system, payment provider, analytics platform, or production account service.

## Storage Approach

- `@react-native-async-storage/async-storage` stores one versioned local application data object.
- `src/storage/storageKeys.ts` centralizes storage keys and the current storage version.
- `src/storage/storageTypes.ts` defines the persisted data contract.
- `src/storage/storageClient.ts` wraps JSON read/write/remove operations.
- `src/storage/migrationService.ts` provides a versioned migration point for future schema changes.
- `src/storage/seedDataService.ts` creates default local demo data.
- `src/storage/persistenceService.ts` loads, saves, resets, and clears local prototype data.

## Persisted Prototype Data

- Mock auth session state and mock profile after local sign-in.
- Consent status for Terms, Privacy, AI disclaimer, and PTSD awareness disclaimer.
- Local preferences for language, biometrics placeholder, notifications placeholder, theme, and PTSD reminders.
- Start My Shift reminders and enabled/disabled local state.
- Incident draft examples with attachment metadata only.
- Notes and files metadata only.
- Calendar, court, training, requalification, and follow-up reminder examples.
- Mock AI and translation demo history.

## Data Not Persisted

- Passwords.
- Access tokens or refresh tokens.
- Real police records.
- Real evidence.
- Real photos, documents, audio, or uploads.
- Sensitive personal information.
- Backend API responses.
- OpenAI API responses.
- Payment or subscription records.
- Police-service integration data.

## Reset and Clear Behavior

- Reset Demo Data restores default local prototype data while preserving the current mock auth session.
- Clear Local Data removes persisted prototype data, signs out, reseeds a clean signed-out demo state, and returns the app to the Welcome screen.
- Both actions require user confirmation from Settings.

## Future Production Direction

Production persistence should move sensitive data to a secure backend with encrypted storage, strict access controls, audited API activity, secure session handling, consent controls, and Canadian privacy-by-design safeguards. Device-local storage should be limited to safe preferences, encrypted session material where appropriate, and explicitly approved offline caches.

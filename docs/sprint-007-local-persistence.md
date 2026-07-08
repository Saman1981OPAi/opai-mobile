# Sprint 007: Local Persistence and Offline Prototype

## Summary

Sprint 007 turns the local OPAi Police prototype into an offline-capable demo by adding device-local persistence for mock state and placeholder content. The app remains pre-launch and prototype-only.

## Completed

- Added a versioned local storage layer using AsyncStorage.
- Added seed data, storage types, migration scaffolding, and persistence services.
- Restored mock signed-in state after app restart.
- Persisted consent status, profile, preferences, notification placeholders, biometric preference placeholder, Start My Shift reminders, incident drafts, notes/file metadata, calendar/court/training reminders, and mock AI/translation history.
- Added a local toggle for Start My Shift reminders.
- Added mock AI and translation history entries when the local input bars are tapped.
- Added Settings actions for Reset Demo Data and Clear Local Data.
- Added confirmation prompts before destructive storage actions.
- Added a local prototype privacy warning in sensitive screens and Settings.
- Kept Android compatible while maintaining iOS as the active launch priority.

## Still Not Added

- No backend.
- No real authentication.
- No database.
- No OpenAI API calls.
- No cloud sync.
- No police-service integrations.
- No payments or subscriptions.
- No analytics or ads.
- No production secrets.
- No Google Play production workflow.

## Security and Privacy Notes

The prototype can store demo content locally on the device. Reviewers and testers must not enter real police records, real evidence, confidential information, or sensitive personal information. Future production versions must use secure backend storage, encryption, role-based access control, audit logging, secure session management, and privacy-by-design controls.

## Testing Expectations

- TypeScript typecheck passes.
- iOS Expo export passes.
- Android Expo export passes for compatibility only.
- Local Expo smoke test passes.
- Mock sign-in, consent, preferences, reminder toggles, incident drafts, notes, calendar/court/training examples, AI history, translation history, Reset Demo Data, Clear Local Data, and existing navigation remain functional.

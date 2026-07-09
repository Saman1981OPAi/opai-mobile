# Sprint 009: Calendar, Court, Training, and Requalification Workflow

## Summary

Sprint 009 converts the Calendar, Court, Training, Requalification, and Follow-Up areas from static cards into local editable workflows.

The work remains a local/offline prototype. It does not connect to a backend, database, OpenAI API, external calendar provider, police-service system, payment system, subscription service, or production secret.

## Added

- Local workflow data models for:
  - Calendar items
  - Court reminders
  - Training events
  - Requalification deadlines
  - Follow-up reminders
- Versioned local storage migration from version 2 to version 3.
- Local seed data for schedule, court, training, qualification, and follow-up examples.
- Editable screens with add, edit, delete, complete/reopen, status, reminder, and lead-time controls.
- Home Dashboard duty snapshot from local workflow data.
- Start My Shift daily readiness summary from local workflow data.
- Local notification scheduling for workflow reminders using the Sprint 008 local notification scheduler.

## Guardrails

- Calendar sync is not connected.
- Court and training details must be verified through authorized systems.
- Start My Shift remains supportive and non-mandatory.
- No official police insignia, government badges, RCMP, OPP, TPS, YRP, or protected agency branding is added.
- Android compatibility remains preserved, but launch work remains iOS-first.

## Validation

Required validation before merge:

- `pnpm typecheck`
- iOS Expo export
- Android Expo export for compatibility only
- Local Expo smoke test
- Static scan for backend/network/API/payment/secrets usage


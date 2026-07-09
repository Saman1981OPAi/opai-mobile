# Sprint 008: iOS Local Notification Prototype

## Summary

Sprint 008 adds an iOS-first local notification prototype to OPAi Police using Expo-compatible local notifications.

## Added

- `expo-notifications` dependency.
- Local notification permission service.
- Local notification scheduler service.
- Notification preference and scheduled reminder types.
- Persistent notification preferences in the Sprint 007 local storage model.
- Local scheduled reminder metadata.
- Settings notification permission flow.
- Notification category toggles and lead-time controls.
- Local test notification scheduling.
- Demo court and training reminder scheduling.
- Cancel all local notifications action.
- User-facing privacy and productivity-aid notices.

## Supported Prototype Notification Types

- Court reminders.
- Training reminders.
- Requalification reminders.
- Start My Shift reminders.
- Follow-up reminders.
- Calendar event reminders.
- System/test reminders.

## Not Added

- No backend push notifications.
- No APNs server integration.
- No Firebase Cloud Messaging.
- No backend API calls.
- No OpenAI API calls.
- No production database.
- No payments or subscriptions.
- No police-service integrations.
- No production secrets.
- No Android production release workflow.
- No Google Play production workflow.

## iOS Priority

iOS remains the active launch priority. Android compatibility is preserved, but Android production release work remains paused until the D-U-N-S Number for Ebrahimi Holdings is received.

## Validation Expectations

- Typecheck passes.
- iOS Expo export passes.
- Android Expo export passes for compatibility only.
- Local Expo launch smoke test passes.
- Existing mock authentication, navigation, and local persistence continue to work.
- Notification permission, Maybe Later, test scheduling, demo scheduling, category preferences, lead times, and cancel-all behavior are available from Settings.

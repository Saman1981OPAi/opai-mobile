# Release Candidate Hardening Checklist

## Navigation

- [x] Mock sign-in flow remains available.
- [x] Mock create account flow remains available.
- [x] Consent flow remains required before app access.
- [x] Core modules remain reachable from app navigation.
- [x] Settings subpages remain reachable from Settings.
- [x] Clear Local Data returns the app to the signed-out state.
- [x] Mock sign-out returns to the Welcome flow.

## Local Persistence

- [x] Local persistence architecture remains AsyncStorage-based.
- [x] No production database was added.
- [x] Reset Demo Data remains available.
- [x] Clear Local Data remains available.

## Notifications

- [x] Notification permission request remains user-initiated.
- [x] Test notification remains local-only.
- [x] Demo court/training reminders remain local-only.
- [x] Bulk local reminder scheduling now replaces previous prototype notifications.
- [x] Cancel All Local Notifications remains available.
- [x] No APNs server, Firebase Cloud Messaging, or remote push integration was added.

## Legal and Disclaimers

- [x] General productivity/AI-assistance disclaimer remains present.
- [x] Professional-use disclaimer remains present.
- [x] AI mock/testing disclaimer remains present.
- [x] Prototype/testing disclaimer remains present.
- [x] PTSD awareness disclaimer remains present.
- [x] Translation disclaimer remains present.
- [x] Incident/file placeholder disclaimers remain present.

## Security and Privacy

- [x] No backend calls added.
- [x] No OpenAI calls added.
- [x] No production database added.
- [x] No real file upload added.
- [x] No payment/subscription code added.
- [x] No analytics/advertising SDK added.
- [x] No hardcoded secrets added.
- [x] No police-service integration added.

## Documentation

- [x] Beta feedback triage created.
- [x] App Store review risk audit created.
- [x] Final pre-TestFlight QA notes created.
- [x] README updated.
- [x] Android paused status remains documented.


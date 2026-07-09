# Sprint 014: Settings, Privacy, Legal, and Consent Polish

Sprint 014 polishes the Settings, Privacy, Legal, Consent, Support, About, Data & Storage, and App Store compliance areas for the iOS-first OPAi Police prototype.

This sprint remains local/offline only. It does not add backend APIs, OpenAI calls, production databases, cloud sync, real authentication providers, payments, subscriptions, real file uploads, police-service integrations, analytics, advertising, production secrets, Google Play release workflow, or Android production release workflow.

## Settings Structure

The Settings screen is organized into clear local sections:

- Account
- Privacy & Security
- Notifications & Preferences
- Legal & Compliance
- Support & About

The screen includes local mock account status, consent status, privacy/terms drafts, disclaimer screens, local notification controls, local data/storage controls, support contacts, and About OPAi content.

## Consent Status

Consent remains local prototype consent only. The app shows local acceptance state for:

- Terms of Use
- Privacy Policy
- AI Disclaimer
- PTSD Awareness Disclaimer
- Translation Disclaimer
- Prototype / Testing Disclaimer

Local acceptance timestamps are stored when available. No backend consent records are created.

## Data & Storage

Data & Storage lists the local prototype data categories stored on-device, including mock profile, consent, preferences, reminders, incident drafts, translation history, AI mock history, notes, and file metadata placeholders.

Reset Demo Data restores sample/demo data and keeps the current mock sign-in. Clear Local Data removes local app data, signs out the mock user, and returns to the Welcome screen.

## iOS-First Priority

iOS remains the active launch priority. Android compatibility is preserved, but Android and Google Play release work remain paused until the D-U-N-S Number for Ebrahimi Holdings is received.

## Known Limitations

- Legal text is local draft text and must be verified before final App Store submission.
- Privacy Policy and Terms URLs are referenced as production URLs to verify before final submission.
- Support contacts are displayed locally; live ticketing/email sending is not connected.
- Consent records are local only and not synchronized to a backend.

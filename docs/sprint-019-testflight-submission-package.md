# Sprint 019: TestFlight Submission Package

## Objective

Prepare a complete iOS-first TestFlight submission package for OPAi Police without adding product
features or production integrations.

## Delivered

- Updated release metadata to build `19` and `TestFlight Submission Package`.
- Added a submission master checklist and final build upload checklist.
- Added copy-ready App Store Connect fields and TestFlight beta information.
- Added final App Review notes and an internal tester invitation.
- Verified public website/legal/contact URLs and documented missing aliases.
- Added final App Privacy and screenshot package checklists.
- Added post-submission monitoring and release branch guidance.
- Added a final no-integration audit.
- Updated README and current TestFlight preparation notes.

## Safety Boundary

This sprint adds no backend, OpenAI, database, cloud sync, real authentication, payment,
subscription, real file upload, police-service integration, analytics, advertising, or production
secret. The build remains a local/offline testing prototype using demo data.

## URL Finding

The live canonical legal pages are `/privacy-policy` and `/terms-of-service`. The requested aliases
`/privacy`, `/terms`, and `/support` currently return 404 and are documented as follow-up website
redirects. The final App Store package uses only currently live URLs.

## Platform Priority

iOS remains the active launch priority. Android compatibility is maintained, while Android
production release and Google Play work remain paused pending the D-U-N-S Number for Ebrahimi
Holdings.

## Validation

- TypeScript typecheck passed.
- Local iOS Expo export passed.
- Android Expo export passed for compatibility only.
- Local Expo/Metro startup reached the listening state in CI mode.
- Static integration and encoding scans passed; the only integration-related runtime text is a
  user-facing disclaimer stating that prohibited integrations are absent.

A signed EAS build, physical-device TestFlight install, screenshot approval, GitHub CI, and App
Store Connect field completion remain operator steps after review and merge.

## Next Recommended Sprint

Sprint 020 should focus on TestFlight upload execution, physical-device beta verification, and only
the fixes supported by observed tester or App Store processing feedback.

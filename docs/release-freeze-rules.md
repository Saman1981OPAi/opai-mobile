# Release Freeze Rules

These rules apply from TestFlight submission preparation through hotfix verification.

## Not Allowed

- New modules or major UI redesign
- New backend, OpenAI, database, cloud sync, or real authentication integration
- New payments, subscriptions, file upload, or storage services
- New device permissions
- Police-service, government, RMS, or operational-system integrations
- Analytics, tracking, advertising, or unrelated dependency upgrades
- Android production or Google Play release workflow

## Allowed With Review

- Reproducible bug and crash fixes
- Metadata, screenshot, copy, legal, privacy, and compliance corrections
- Build/signing/configuration fixes
- Small accessibility or layout fixes tied to an observed blocker
- Tests and documentation directly supporting the correction

Every allowed change must be minimal, traced to a review/tester report, validated, and delivered by
PR. Feature requests remain deferred until the release freeze ends.

Android compatibility stays intact. Android production work remains paused pending the D-U-N-S
Number for Ebrahimi Holdings.

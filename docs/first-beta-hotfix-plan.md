# First Beta Hotfix Plan

## Hotfix Immediately

- Crash on launch or blank app screen
- Cannot complete mock sign-in or required consent
- Broken navigation that blocks the main app
- App Store rejection requiring an in-binary correction
- Privacy, legal, content-rights, or unsafe claim in the binary
- Build processing or signing/configuration failure
- Missing or incorrect permission explanation
- Reset/Clear action that corrupts or exposes local prototype data

## Defer

- Minor copy or spacing changes
- Non-blocking layout polish
- Preference requests
- New modules, integrations, or feature requests
- Refactors without a release-blocking defect

## Validation Gate

- [ ] Reproduce and document root cause.
- [ ] Keep the diff limited to the identified issue.
- [ ] Run typecheck and iOS Expo export.
- [ ] Run local launch and affected-module smoke tests.
- [ ] Verify mock auth, consent, and navigation when touched.
- [ ] Run static no-integration and secret scans.
- [ ] Confirm Android compatibility when shared code changes.
- [ ] Obtain PR review and passing CI.
- [ ] Increment build number only when uploading a new binary.

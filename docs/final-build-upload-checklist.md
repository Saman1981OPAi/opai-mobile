# Final Build Upload Checklist

## Before Upload

- [ ] `main` is current and Sprint 019 has been reviewed and merged.
- [x] Native version is `0.1.0`; displayed beta version is `0.1.0-beta`.
- [x] iOS build number is `19`.
- [ ] CI, typecheck, iOS export, and final release build pass.
- [ ] App icon and splash screen are visually confirmed on a real device.
- [x] No production secrets or hardcoded API keys are present in the reviewed source.
- [x] No backend, OpenAI, production database, payment, analytics, advertising, or police-system
  integration is present.
- [x] No real file upload or cloud storage is present.
- [x] No unnecessary iOS permissions are configured in `app.json`.
- [x] No official police or government insignia is intentionally used.

## Upload Preparation

- [ ] Generate the signed iOS build through the approved EAS production profile.
- [ ] Upload the build to App Store Connect.
- [ ] Wait for processing to complete without errors.
- [ ] Select build `19` for TestFlight.
- [ ] Paste the final beta information and App Review notes.
- [ ] Add internal testers.
- [ ] Answer export compliance and content-rights questions accurately.
- [ ] Review App Privacy answers against the uploaded binary.

## After Upload

- [ ] Confirm the build appears in TestFlight.
- [ ] Install it from TestFlight on a physical iPhone and supported iPad.
- [ ] Run launch, mock auth, consent, navigation, persistence, and local notification smoke tests.
- [ ] Confirm the feedback route and support email work.
- [ ] Monitor App Store Connect processing, crashes, and tester reports.


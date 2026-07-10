# TestFlight Submission Support Checklist

Use this checklist with target build `21`. Synchronize the EAS remote baseline before generating
the binary.

## Before Upload

- [ ] Confirm `main` is stable and Sprint 019 is merged.
- [x] Confirm native version `0.1.0`, beta label `0.1.0-beta`, and target build `21`.
- [ ] Re-run typecheck and iOS export from the final merged commit.
- [ ] Confirm no production secrets, backend, OpenAI, or database calls.
- [x] App Review notes and TestFlight beta notes are prepared.
- [x] Live URLs: Privacy `/privacy-policy`, Terms `/terms-of-service`, Support `/contact`.
- [ ] Confirm final screenshots use accepted dimensions and match build `21`.
- [ ] Visually confirm the app icon and splash screen on a real device.
- [x] Confirm bundle identifier `com.opaiapp.police`.

## During Upload

- [ ] Upload the signed iOS build and confirm processing starts.
- [ ] Confirm processing completes and the build appears in App Store Connect.
- [ ] Complete encryption/export compliance and content-rights questions accurately.
- [ ] Review App Privacy answers against the uploaded binary.
- [ ] Select processed build `21` for internal TestFlight.
- [ ] Add approved internal testers and paste final beta information.

## After Upload

- [ ] Install through TestFlight on a real iPhone and supported iPad.
- [ ] Confirm launch, mock sign-in, create account, consent, and sign-out.
- [ ] Open every core module and verify bottom/secondary navigation.
- [ ] Confirm local persistence and local notifications when enabled.
- [ ] Confirm Reset Demo Data and Clear Local Data.
- [ ] Monitor App Store Connect processing, crashes, and tester feedback.
- [ ] Log reproducible issues using the beta feedback intake system.

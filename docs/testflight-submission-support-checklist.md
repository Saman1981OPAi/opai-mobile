# TestFlight Submission Support Checklist

Use this checklist with build `19`. A documentation-only change does not require a replacement
binary; increment the build number only when a new binary is generated.

## Before Upload

- [ ] Confirm `main` is stable and Sprint 019 is merged.
- [x] Confirm native version `0.1.0`, beta label `0.1.0-beta`, and build `19`.
- [ ] Re-run typecheck and iOS export from the final merged commit.
- [ ] Confirm no production secrets, backend, OpenAI, or database calls.
- [x] App Review notes and TestFlight beta notes are prepared.
- [x] Live URLs: Privacy `/privacy-policy`, Terms `/terms-of-service`, Support `/contact`.
- [ ] Confirm final screenshots use accepted dimensions and match build `19`.
- [ ] Visually confirm the app icon and splash screen on a real device.
- [x] Confirm bundle identifier `com.opaiapp.police`.

## During Upload

- [ ] Upload the signed iOS build and confirm processing starts.
- [ ] Confirm processing completes and the build appears in App Store Connect.
- [ ] Complete encryption/export compliance and content-rights questions accurately.
- [ ] Review App Privacy answers against the uploaded binary.
- [ ] Select build `19` for internal TestFlight.
- [ ] Add approved internal testers and paste final beta information.

## After Upload

- [ ] Install through TestFlight on a real iPhone and supported iPad.
- [ ] Confirm launch, mock sign-in, create account, consent, and sign-out.
- [ ] Open every core module and verify bottom/secondary navigation.
- [ ] Confirm local persistence and local notifications when enabled.
- [ ] Confirm Reset Demo Data and Clear Local Data.
- [ ] Monitor App Store Connect processing, crashes, and tester feedback.
- [ ] Log reproducible issues using the beta feedback intake system.

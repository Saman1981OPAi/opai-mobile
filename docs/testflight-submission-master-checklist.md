# TestFlight Submission Master Checklist

This separates repository-ready items from actions that require a signed build, App Store Connect,
or physical-device review.

## App Build

- [ ] Final signed iOS build exports successfully through EAS.
- [x] Native version `0.1.0` and displayed beta version `0.1.0-beta` are confirmed.
- [x] Target build number `21` is confirmed; EAS remote synchronization remains a pre-build action.
- [x] App icon and splash assets are configured.
- [x] Display name is `OPAi Police`.
- [x] Bundle identifier is `com.opaiapp.police`.
- [x] iOS permissions and encryption declaration are documented.
- [x] No unnecessary sensitive permissions are requested in app configuration.
- [ ] Physical-device launch and crash-free smoke test pass.

## App Content

- [x] Testing / Pre-Launch status is visible.
- [x] Authentication, AI Assistant, translation, and file workflows are mock/local only.
- [x] Persistence and notifications are device-local only.
- [x] No backend, OpenAI, real translation API, cloud sync/storage, file upload, police-system
  integration, payment, advertising, or tracking is present.

## Legal and Compliance

- [x] Live website, Privacy Policy, Terms, and contact URLs are documented.
- [x] Support and privacy contacts are documented.
- [x] App Review notes, beta information, tester invitation, and known limitations are prepared.
- [x] App Privacy answer checklist is prepared.
- [x] Required in-app disclaimers are retained.
- [x] No official police/government affiliation is claimed.
- [x] Brand review prohibits protected police/government insignia.
- [ ] Add redirects for `/privacy`, `/terms`, and optional `/support`, or continue using the verified
  live canonical URLs.

## Assets

- [x] App icon and splash paths exist in configuration.
- [x] Accepted screenshot dimensions and recommended ordering are documented.
- [ ] Final iPhone and iPad screenshots are captured from build `21` and manually approved.
- [ ] Screenshots are checked for real data, protected marks, third-party imagery, and overclaims.

## Testing

- [x] Typecheck passes on the Sprint 019 branch.
- [x] Local iOS Expo export passes.
- [x] Android Expo export passes for compatibility only.
- [x] Local Expo/Metro startup reaches the listening state in CI mode.
- [ ] GitHub CI passes.
- [ ] Signed TestFlight build is installed and tested on a physical iPhone and iPad.

## App Store Connect

- [ ] Signed build uploaded and processing completed.
- [ ] Build selected for internal TestFlight.
- [ ] Beta information and App Review notes entered.
- [ ] Internal testers added.
- [ ] Export compliance, content rights, and App Privacy answers completed.

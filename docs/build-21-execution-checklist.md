# Build 21 Execution Checklist

Prepared July 10, 2026 from `main` commit `77768df` plus the reviewed readiness corrections in this
branch. This checklist prepares execution; it does not generate, upload, submit, or install a build.

## Source and Release Identity

- [x] Branch started from clean, current `main` at `77768df`.
- [x] Displayed version: `0.1.0-beta`.
- [x] Native iOS version: `0.1.0`.
- [x] Target build: `21`.
- [x] Platform priority: iOS-first.
- [x] Status: Testing / Pre-Launch / Local Prototype.
- [x] App display name: OPAi Police.
- [x] Bundle identifier: `com.opaiapp.police`.

## Assets and iOS Configuration

- [x] App icon configured at `assets/icon.png` (1024 x 1024).
- [x] Splash configured at `assets/splash.png` (1242 x 2436) with `#05070B` background.
- [x] iPhone and iPad orientations remain supported.
- [x] Non-exempt encryption flag is false.
- [x] Arbitrary network loads are explicitly disabled in App Transport Security.
- [x] Notification permission is explain-first and user initiated.
- [x] Notification copy states reminders are local and no remote push service is used.
- [x] No camera, microphone, photo library, contacts, location, health, tracking, or document-picker
  permission is declared.

Expo configuration introspection includes the notifications entitlement because
`expo-notifications` is installed. The current app does not request or store an APNs token and does
not implement remote push. Reconfirm the production archive entitlements before upload.

## EAS Remote Version Gate

- [x] EAS authentication succeeds and the authenticated account has Owner access to
  `ebrahimi-holdings`.
- [x] `eas.json` uses remote app versioning and production auto-increment.
- [x] Read-only audit found the remote iOS build number is currently `8`.
- [ ] Confirm in App Store Connect that build `21` has never been used.
- [ ] Run `pnpm exec eas build:version:set --platform ios --profile production` interactively.
- [ ] Set the remote baseline to `20` only after the unused-build check.
- [ ] Re-run `eas build:version:get` and record the remote baseline.
- [ ] Start the production iOS build and confirm auto-increment produces build `21`.

Do not commit Expo, Apple, App Store Connect, signing, certificate, password, session, or two-factor
credentials.

## Validation Results

- [x] `pnpm typecheck` passed.
- [x] iOS Expo export passed.
- [x] Android Expo export passed for compatibility only.
- [x] Local Expo/Metro smoke test returned HTTP 200.
- [x] Runtime prohibited-integration scan passed.
- [x] Production-secret and credential scan passed.
- [x] Expo public configuration and iOS introspection were reviewed.
- [x] All App Store and canonical URLs returned HTTP 200.

## Public URLs

- [x] https://opaiapp.com/privacy
- [x] https://opaiapp.com/terms
- [x] https://opaiapp.com/support
- [x] https://opaiapp.com/privacy-policy
- [x] https://opaiapp.com/terms-of-service
- [x] https://opaiapp.com/contact

## Prohibited Scope Confirmation

- [x] No backend, OpenAI, production database, payment, subscription, analytics, tracking,
  advertising, real file upload, cloud storage, or police-service integration was added.
- [x] No Apple credential, production secret, token, certificate, or private key was added.
- [x] No Android production or Google Play release work was added.
- [x] Android compatibility remains intact pending the D-U-N-S Number for Ebrahimi Holdings.

## Build and Upload Execution - Manual

- [ ] Generate the signed iOS production build.
- [ ] Verify EAS reports native version `0.1.0` and build `21`.
- [ ] Inspect permissions, entitlements, signing identity, icon, splash, and dependency report.
- [ ] Upload build `21` to App Store Connect.
- [ ] Wait for processing and resolve all warnings.
- [ ] Select build `21` for TestFlight.
- [ ] Install through TestFlight on a physical iPhone and iPad.
- [ ] Complete and record real-device smoke/accessibility certification.
- [ ] Certify screenshots, App Privacy, rating, rights, export, and review notes against the binary.
- [ ] Change public-submission go/no-go only after every manual gate has evidence.

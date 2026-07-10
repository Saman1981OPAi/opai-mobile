# Build 21 Current State

Date: July 10, 2026

## Repository

- Repository: `opai-mobile`
- Branch: `build-21-ios-testflight-build-execution`
- Current commit: `711dfb37c14b040ff8edfa54ba58cee1ee8ccb15`
- Commit message: `Fix iOS push notification signing capability`
- Working tree before documentation updates: clean
- Website deployment work: not touched

## GitHub Pull Requests

- Open PR observed through GitHub API: PR #4, `Sprint 005: iOS App Store Readiness and Compliance Pass`
- Build 21 blocking status: PR #4 is legacy/superseded and does not block Build 21 execution.

## Build 21 Status

- Current App Store Connect visible build before Build 21 attempts: Build 8
- Build 21 was attempted twice before the Apple capability fix.
- The previous Build 21 attempts failed before IPA generation because the App Store provisioning profile did not include Push Notifications or `aps-environment`.
- Push Notifications were enabled on the Apple App ID by the human operator.
- The stale Apple App Store provisioning profile was deleted by the human operator.
- EAS stale provisioning profile record was removed.
- EAS iOS remote baseline was reset to 20.
- Production iOS EAS build was rerun and generated Build 21 successfully.

## Platform Priority

- iOS remains the active launch priority.
- Android remains compatible only.
- Android release and Google Play workflows remain paused pending the D-U-N-S Number for Ebrahimi Holdings.


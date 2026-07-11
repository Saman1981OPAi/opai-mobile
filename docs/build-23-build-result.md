# Build 23 Build Result

## Result

Build 23 was generated successfully on July 10, 2026.

## Build Details

- EAS Build ID: `72212502-2c0c-41a8-8e1d-7d165b97fa99`
- Build URL: https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/builds/72212502-2c0c-41a8-8e1d-7d165b97fa99
- IPA artifact: https://expo.dev/artifacts/eas/u2bERl5kegC81BMER_tCcJOaipqpbmpk3OguGaJYDF0.ipa
- App version: `0.1.0`
- Build number: `23`
- Bundle identifier: `com.opaiapp.police`
- Platform: iOS
- Profile: `production`
- Source branch: `main`
- Source commit: `561dc33 Merge Build 23 premium home redesign`

## Pre-Build Validation

- `pnpm typecheck`: passed
- Lint: no `lint` script is configured in `package.json`
- iOS Expo export with `--clear`: passed
- Android Expo export with `--clear`: passed for compatibility only
- EAS remote iOS build number before build: `22`
- EAS auto-increment result: `23`
- Secret scan: no committed credentials or production secrets found
- Prohibited integration scan: no new backend, OpenAI, database, payment, analytics, tracking, SDK, or police-service integrations found

## Build Command

```bash
pnpm exec eas build --platform ios --profile production --non-interactive --wait
```

## Warnings

- EAS warned that Expo Go is used for development and is not recommended for production apps.
- EAS noted that `ios.buildNumber` in app config is ignored because remote version source is active.
- EAS recommended enforcing the EAS CLI version in `eas.json`.
- Node emitted a `url.parse()` deprecation warning from the EAS CLI dependency chain.

## Current Status

- IPA generated: yes
- Uploaded to App Store Connect: yes
- Android production build generated: no
- Android release workflow: paused

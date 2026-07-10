# Build 22 Build Result

## Result

Build 22 was generated successfully on July 10, 2026.

## Build Details

- EAS Build ID: `6c9bceae-7b11-453b-98d6-e5f06a1a8b28`
- EAS build page: https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/builds/6c9bceae-7b11-453b-98d6-e5f06a1a8b28
- IPA artifact: https://expo.dev/artifacts/eas/z0FF9ywwcu0Wjnk9wHGdUSYaaR4b4G5kK5DuAYuJEMk.ipa
- Platform: iOS
- Profile: `production`
- Distribution: App Store
- Bundle identifier: `com.opaiapp.police`
- Native version: `0.1.0`
- In-app release label: `0.1.0-beta`
- Build number: `22`
- Git commit: `5257efad5666683ac616a13dfda3cec555e2c374`
- Commit message: `Merge Build 22 iOS layout weather social and device testing`
- Build status: `FINISHED`
- IPA status: generated successfully
- Upload status: not uploaded to App Store Connect/TestFlight by this step

## Command Used

Global `eas` was not available on the local Windows PATH, so the equivalent project-local EAS CLI command was used:

```bash
pnpm exec eas build --platform ios --profile production
```

No `--auto-submit` flag was used.

## EAS Versioning

- Remote iOS build number before build: `21`
- EAS incremented build number from `21` to `22`
- Remote iOS build number after build: `22`
- Next replacement build, if required, must use build `23`

## Preflight Validation

- `pnpm typecheck`: passed
- `pnpm run lint`: not configured; `package.json` has no lint script
- iOS Expo export with `--clear`: passed
- Android Expo export with `--clear`: passed for compatibility only
- Metro smoke test: passed on `http://localhost:8081`
- Required legal/support URLs: HTTP 200
- Static scan: no committed credentials or prohibited SDK integrations found
- Android production release: not started

## Warnings Observed

- Expo Go development warning was shown for production build preparation.
- EAS CLI recommended pinning `cli.version` in `eas.json`.
- `ios.buildNumber` in app config is ignored when EAS remote versioning is enabled.
- Node emitted a `url.parse()` deprecation warning from tooling.
- EAS loaded only public production environment values: `EXPO_PUBLIC_APP_ENV` and `EXPO_PUBLIC_API_BASE_URL`.
- EAS reported no production environment variables with `Plain text` or `Sensitive` visibility.

## Credential Handling

EAS used remote iOS credentials and an App Store Connect API key from the EAS credentials service. No Apple credentials, certificates, provisioning profiles, EAS tokens, API keys, or production secrets were committed to the repository.

## Current Submission Status

Build 22 is generated but not uploaded. Public submission remains `NO-GO` until Build 22 is uploaded, processed by Apple, appears in TestFlight, installed on a physical iPhone, and passes physical certification.

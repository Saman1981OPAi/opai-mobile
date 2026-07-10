# Version and Build Number Review

## Approved Target

- Displayed beta version: `0.1.0-beta`
- Native store version: `0.1.0`
- Target iOS build number: `21`
- Release type: Internal TestFlight Beta
- Platform: iOS-first
- Status: Testing / Pre-Launch / Local Prototype

Do not change the native version to production `1.0` without explicit approval.

## Configuration Locations

- `app.json` -> `expo.name`: OPAi Police
- `app.json` -> `expo.version`: `0.1.0`
- `app.json` -> `expo.ios.buildNumber`: local manifest/display value `21`
- `app.json` -> `expo.ios.bundleIdentifier`: `com.opaiapp.police`
- `app.json` -> `expo.extra.release`: displayed beta metadata
- `src/config/release.ts`: in-app release/status metadata
- `eas.json` -> `cli.appVersionSource`: `remote`
- `eas.json` -> `build.production.autoIncrement`: `true`

## EAS Source of Truth

The EAS remote iOS value was initially `8`. The release owner confirmed App Store Connect shows
build `8` and build `21` is unused. On July 10, 2026, the EAS baseline was set to `20` and verified
with `eas build:version:get`.

With remote versioning and production auto-increment enabled, the next production iOS build is
expected to become build `21`.

1. Immediately before building, confirm the remote baseline still reports `20`.
2. Run `pnpm build:ios`.
3. Stop if EAS proposes any native build number other than `21`.
4. Verify the finished and processed binary reports `0.1.0 (21)` before selecting it in TestFlight.

Do not commit credentials or automate an Apple login through source files.

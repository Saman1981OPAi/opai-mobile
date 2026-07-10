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

The EAS remote iOS value was `8` on July 9, 2026. With remote versioning enabled, EAS ignores the
local `ios.buildNumber` for the native binary and auto-increments the remote value. To produce native
build `21`:

1. Run `pnpm exec eas build:version:get --platform ios --profile production`.
2. Confirm the remote value and the highest build already used in App Store Connect.
3. Run `pnpm exec eas build:version:set --platform ios --profile production` interactively.
4. Set the last-used/baseline value to `20` only after confirming build `21` is unused.
5. Run the production build; auto-increment should produce native build `21`.
6. Verify the processed binary reports build `21` before selecting it in TestFlight.

Do not commit credentials or automate an Apple login through source files.

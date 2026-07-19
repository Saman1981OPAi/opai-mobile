# Build 26 Release Toolchain

## Supported Versions

- Node.js: `22.23.1`
- pnpm: `11.9.0`
- Package manager activation: Corepack
- Expo SDK: existing SDK 57 dependency family

Node 24 is not an approved Build 26 certification environment. No custom Metro
resolver, hoisting change, or manual `node_modules` edit is part of this setup.

## EAS Profiles

- `internal-staging` is the only profile that points to the Render staging API.
- `production` points to `https://api.opaiapp.com`.
- `testflight` inherits `production` and has no environment override.
- Build 26 must not be generated until the production API is deployed and
  certified.

## Local Validation

Run from a clean dependency installation:

```text
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm install --frozen-lockfile
pnpm doctor
pnpm typecheck
pnpm lint
pnpm test
pnpm verify:release-config
pnpm scan:release
pnpm export:ios
pnpm export:android
```

The static Expo exports validate JavaScript bundling only. They do not replace
a native EAS iOS build or physical iPhone and iPad certification.

## Windows Certification Result

Validated on Windows on July 18, 2026:

- Node.js `22.23.1`
- pnpm `11.9.0`
- Corepack `0.35.0`
- Expo CLI `57.0.9`
- Expo Doctor: `20/20` checks passed
- Typecheck: passed
- Lint: passed with 19 pre-existing warnings and no errors
- Unit tests: passed, `18/18`
- Clean iOS export: passed in 18.49 seconds
- Clean Android export: passed in 12.17 seconds
- Release-profile verification: passed
- Release source/security scan: passed

The previous native-Windows export failure is classified as a Node 24 and
stale pnpm-linked dependency environment incompatibility. Node 22 completed
both clean exports without a custom Metro resolver.

Expo SDK 57 patch packages and required peer packages were aligned only where
Expo Doctor identified compatibility issues. Expo, React Native, React, Metro,
and native architecture were not upgraded to a different release family.

`pnpm peers check` reports one upstream metadata warning:
`@expo/log-box@57.0.1` requests `@expo/dom-webview` `^57.0.1`, while Expo
`57.0.7` supplies `57.0.0`. Expo Doctor accepts the installed tree and reports
no duplicate or incompatible native modules, so no internal Expo package
override is applied.

## Release Gate

EAS CLI `20.5.1` successfully resolves the `testflight` profile to:

- `EXPO_PUBLIC_APP_ENV=production`
- `EXPO_PUBLIC_OPAI_API_BASE_URL=https://api.opaiapp.com`

This configuration is ready for review, but Build 26 remains blocked until the
production API and reviewer account are deployed and certified.

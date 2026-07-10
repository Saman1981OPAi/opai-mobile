# Build 21 EAS Baseline Confirmation

Recorded July 10, 2026.

## Verified State

- App Store Connect visible build: `8` (confirmed by the release owner).
- Build `21` unused: confirmed by the release owner.
- EAS remote iOS baseline before change: `8`.
- EAS remote iOS baseline after change: `20`.
- Baseline `20` read-back: verified with `eas build:version:get`.
- Expected next production iOS build: `21`.
- Native app version: `0.1.0`.
- Displayed testing version: `0.1.0-beta`.
- Android release: paused pending the D-U-N-S Number for Ebrahimi Holdings.

No Android configuration, Google Play workflow, Apple credential, API key, production secret, or
repository credential was added or changed.

## Human Build Command

First verify the baseline still reports `20`:

```bash
pnpm exec eas build:version:get --platform ios --profile production
```

Then generate the production iOS build:

```bash
pnpm build:ios
```

Expected behavior: production auto-increment advances the EAS baseline from `20` to native build
`21`. Stop and investigate if EAS proposes or generates any other build number. This confirmation
does not mean build `21` has been generated, uploaded, processed, installed, or certified.

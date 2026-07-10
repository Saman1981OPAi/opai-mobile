# Final Pre-Upload Build Checklist

Run this from the reviewed `main` or approved iOS release branch.

## Repository and Version

- [ ] Sprint 020 and Sprint 021 are merged.
- [ ] Branch is up to date with `origin/main` and the worktree is clean.
- [x] App name: OPAi Police.
- [x] User-facing native version: `0.1.0`; beta label: `0.1.0-beta`.
- [x] Target iOS build: `21`.
- [x] Bundle identifier: `com.opaiapp.police`.
- [ ] EAS remote iOS baseline is set to `20` before the auto-incrementing production build.

## Assets and Permissions

- [x] App icon configured at `assets/icon.png`.
- [x] Splash image configured at `assets/splash.png` with background `#05070B`.
- [x] iPad support is enabled.
- [x] Info.plist declares non-exempt encryption as false.
- [x] No unnecessary camera, microphone, location, contacts, health, payment, or photo permissions.
- [ ] Icon and splash are visually confirmed on the signed TestFlight build.

## Validation

- [ ] Clean dependency install passes.
- [ ] Typecheck and iOS export pass from the final commit.
- [ ] GitHub CI passes.
- [ ] Local Expo launch smoke test passes.
- [ ] No backend, OpenAI, database, upload, cloud, payment, police integration, analytics, or secret.
- [ ] Final App Review notes, beta information, URLs, screenshots, and privacy answers are approved.

## Platform Status

- [x] Android compatibility is preserved.
- [x] Android production and Google Play release remain paused pending the D-U-N-S Number.

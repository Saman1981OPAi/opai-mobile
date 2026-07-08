# Project 015: Mobile Deployment

The mobile app uses Expo EAS Build through GitHub Actions. EAS builds are currently manual-only so
main-branch documentation and planning merges do not trigger failed production build emails while
the required Expo credentials are being finalized.

## Current Launch Priority

iOS is the active launch platform. Android and Google Play submission are paused until the D-U-N-S Number for Ebrahimi Holdings is received.

Preserve Android support and configuration, but do not prioritize Android-specific store assets, Google Play release workflows, or Android production deployment until that business verification dependency is complete.

## Environments

- `staging`: internal preview builds from the `staging` branch.
- `production`: App Store-ready iOS builds from the `main` branch. Android production deployment is paused until the D-U-N-S Number is received.

## Required GitHub Secrets

- `EXPO_TOKEN`

Production submission currently requires Apple credentials configured in Expo/EAS or supplied
through the secure GitHub environment. Google Play credentials should not be treated as an active
launch requirement until Android submission resumes.

If `EXPO_TOKEN` is missing, the workflow stops during the Expo token preflight step with a clear
configuration error. Add an Expo access token as the `EXPO_TOKEN` GitHub Actions secret before
running a manual EAS build.

## Commands

```bash
pnpm typecheck
pnpm exec eas build --platform ios --profile preview
pnpm exec eas build --platform ios --profile production
```

## Notes

- The workflow is triggered manually with `workflow_dispatch`.
- The workflow defaults manual builds to iOS because iOS is the current launch priority.
- Android support remains in the codebase for future compatibility.
- Android production builds and Google Play release activity should wait until the D-U-N-S Number is received.
- Environment values use `EXPO_PUBLIC_*` variables so the app can point at staging or production
  backend APIs without code changes.

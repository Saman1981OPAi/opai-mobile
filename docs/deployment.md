# Project 015: Mobile Deployment

The mobile app uses Expo EAS Build through GitHub Actions.

## Environments

- `staging`: internal preview builds from the `staging` branch.
- `production`: App Store / Play Store-ready builds from the `main` branch.

## Required GitHub Secrets

- `EXPO_TOKEN`

Production submission also requires Apple and Google credentials configured in Expo/EAS or supplied
through the secure GitHub environment.

## Commands

```bash
pnpm typecheck
pnpm exec eas build --platform ios --profile preview
pnpm exec eas build --platform ios --profile production
pnpm exec eas build --platform android --profile production
```

## Notes

- The workflow defaults manual builds to iOS because iOS has already been prepared.
- Android is supported by selecting `android` or `all` in the workflow dispatch input.
- Environment values use `EXPO_PUBLIC_*` variables so the app can point at staging or production
  backend APIs without code changes.

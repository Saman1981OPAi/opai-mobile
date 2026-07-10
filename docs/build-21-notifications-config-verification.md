# Build 21 Notifications Config Verification

Date: July 10, 2026

## Verified Files

- `app.json`
- `eas.json`
- `package.json`

## Expo Notifications

- `expo-notifications` is installed: `~57.0.3`
- Expo config plugin is explicitly listed:

```json
"plugins": [
  "expo-notifications"
]
```

## iOS Entitlements

`app.json` includes:

```json
"ios": {
  "bundleIdentifier": "com.opaiapp.police",
  "buildNumber": "21",
  "entitlements": {
    "aps-environment": "production"
  }
}
```

## Introspection Result

Command:

```bash
pnpm exec expo config --type introspect --json
```

Confirmed:

- Bundle identifier: `com.opaiapp.police`
- `ios.entitlements.aps-environment`: `production`
- `modResults.ios.entitlements.aps-environment`: `production`
- App display name: `OPAi Police`
- ATS arbitrary loads disabled: `NSAllowsArbitraryLoads: false`

## Android

No Android release configuration changes were made.


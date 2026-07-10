# Build 21 Apple Capability Fix

Date: July 10, 2026

## App ID

- Bundle ID: `com.opaiapp.police`
- Apple Developer App ID capability updated by human operator.

## Apple Developer Actions Completed

- Push Notifications enabled for `com.opaiapp.police`.
- Invalid App Store provisioning profile deleted in Apple Developer:

```text
*[expo] com.opaiapp.police AppStore 2026-07-06T23:54:33.840Z
```

## Result

The Apple App ID now supports the `aps-environment` entitlement required by `expo-notifications` for production iOS builds.

## Credentials Policy

No Apple credentials, App Store Connect API keys, certificates, provisioning profiles, or EAS tokens were committed to the repository.


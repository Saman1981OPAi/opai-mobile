# Build 21 EAS Credentials Refresh

Date: July 10, 2026

## Previous EAS Profile Issue

EAS was still referencing the stale App Store provisioning profile created before Push Notifications were enabled:

```text
*[expo] com.opaiapp.police AppStore 2026-07-06T23:54:33.840Z
```

## EAS Credential Action

The stale EAS provisioning profile record was removed through EAS authenticated GraphQL credentials tooling.

Deleted EAS provisioning profile record:

- EAS profile ID: `3cc68220-363e-420f-8208-87652e6924ec`
- Developer Portal ID: `2BRN4W24RJ`
- Status before deletion: `active`
- Updated before deletion: `2026-07-06T23:54:35.075Z`

## Post-Deletion Credential State

After deletion:

- App Store build credentials still existed.
- Distribution certificate remained attached.
- Provisioning profile was no longer attached.

This allowed EAS to create a fresh App Store provisioning profile during the next iOS production build.

## Fresh Profile Created

During the successful Build 21 run, EAS created a new Apple provisioning profile:

- Developer Portal ID: `G6UHG3F43H`
- Status: `active`
- Apple Team: `4Q9G8QBF37`
- Expiration: July 2, 2027

## Scope Control

- No certificates were deleted.
- No Android credentials were changed.
- No repository credential files were added.


# Build 21 Failure Analysis

Date: July 10, 2026

## Failed EAS Builds

- Failed Build ID: `7666a4db-707f-42d0-8538-db887953bee8`
- Failed Build URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/builds/7666a4db-707f-42d0-8538-db887953bee8`
- Failed Build ID: `733c1575-2c01-4d5d-870e-d8e689892fe9`
- Failed Build URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/builds/733c1575-2c01-4d5d-870e-d8e689892fe9`

## Failure Summary

Both failed builds were assigned app build version `21`, but failed before IPA generation.

The Xcode signing error was:

```text
Provisioning profile "*[expo] com.opaiapp.police AppStore 2026-07-06T23:54:33.840Z" doesn't include the Push Notifications capability.
Provisioning profile "*[expo] com.opaiapp.police AppStore 2026-07-06T23:54:33.840Z" doesn't include the aps-environment entitlement.
```

## Cause

The app config correctly requested production push notification entitlements, but the Apple App Store provisioning profile was created before Push Notifications were enabled on the App ID.

This was a signing/capability/provisioning issue.

## Not Product-Code Related

The failure was not caused by:

- Backend API integration
- OpenAI API integration
- Database integration
- Payment or subscription logic
- Real file upload
- Police-service integration
- Android configuration


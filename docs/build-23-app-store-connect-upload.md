# Build 23 App Store Connect Upload

## Upload Result

Build 23 was uploaded successfully to App Store Connect on July 10, 2026.

## Submitted Build

- EAS Build ID: `72212502-2c0c-41a8-8e1d-7d165b97fa99`
- Build number: `23`
- App version: `0.1.0`
- Bundle identifier: `com.opaiapp.police`
- ASC App ID: `6788187875`
- Project ID: `c9044294-c57a-47f8-bb2e-15721c8882a2`
- IPA artifact: https://expo.dev/artifacts/eas/u2bERl5kegC81BMER_tCcJOaipqpbmpk3OguGaJYDF0.ipa

## Submission

- EAS Submission ID: `1b7a679d-972d-4348-9e37-7fa434f9d3ed`
- Submission URL: https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/1b7a679d-972d-4348-9e37-7fa434f9d3ed
- App Store Connect TestFlight URL: https://appstoreconnect.apple.com/apps/6788187875/testflight/ios
- Command used:

```bash
pnpm exec eas submit --platform ios --id 72212502-2c0c-41a8-8e1d-7d165b97fa99 --non-interactive --wait
```

The exact Build 23 artifact was submitted. `--latest` was not used. Android was not submitted.

## Upload Status

- EAS submission status: uploaded successfully
- Apple processing status: pending immediately after upload
- TestFlight status: pending Apple processing
- Real-device testing completed: no

## Credential Handling

EAS used the App Store Connect API key stored in the EAS credentials service:

- Key ID: `JC8W8GVUD2`
- Key source: EAS servers

No Apple credentials, EAS tokens, App Store Connect private keys, certificates, provisioning profiles, or secrets were committed to the repository.

## Current Decision

Public submission remains `NO-GO`.

Build 23 must finish Apple processing, appear in TestFlight, install on a physical iPhone, and pass the full certification checklist before any public App Review decision.

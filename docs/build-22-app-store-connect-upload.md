# Build 22 App Store Connect Upload

## Upload Result

Build 22 was uploaded successfully to App Store Connect on July 10, 2026.

## Submitted Build

- EAS Build ID: `6c9bceae-7b11-453b-98d6-e5f06a1a8b28`
- Build number: `22`
- App version: `0.1.0`
- Bundle identifier: `com.opaiapp.police`
- ASC App ID: `6788187875`
- Project ID: `c9044294-c57a-47f8-bb2e-15721c8882a2`
- IPA artifact: https://expo.dev/artifacts/eas/z0FF9ywwcu0Wjnk9wHGdUSYaaR4b4G5kK5DuAYuJEMk.ipa

## Submission

- Submission ID: `0bebc73a-ea44-486f-b0b8-06ffead7dca8`
- Submission URL: https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/0bebc73a-ea44-486f-b0b8-06ffead7dca8
- Command used:

```bash
pnpm exec eas submit --platform ios --id 6c9bceae-7b11-453b-98d6-e5f06a1a8b28
```

The exact Build 22 artifact was submitted. `--latest` was not used. `--auto-submit` was not used during build generation.

## Upload Status

- EAS submission status: uploaded successfully
- Apple processing status: complete / binary validated
- TestFlight status: visible in iOS TestFlight as `0.1.0 (22)`
- Export compliance: pending App Store Connect confirmation if Apple prompts
- Export compliance observed in Build Metadata: `App Uses Non-Exempt Encryption: No`
- Internal groups assigned: `admin@opaiapp.com` and `Team (Expo)`
- Internal tester count shown by App Store Connect: 1 tester in each assigned internal group
- What to Test text: saved
- Real-device testing completed: no

## Credential Handling

EAS used the App Store Connect API key stored in the EAS credentials service:

- Key ID: `JC8W8GVUD2`
- Key source: EAS servers

No Apple credentials, EAS tokens, App Store Connect private keys, certificates, provisioning profiles, or secrets were committed to the repository.

## Current Decision

Public submission remains `NO-GO`.

Build 22 must still be installed on a physical iPhone and pass the full certification checklist before any public App Review decision.

## App Store Connect Verification

Observed on July 10, 2026:

- Build detail heading: `0.1.0 (22)`
- Binary State: `Validated`
- Bundle Short Version String: `0.1.0`
- Bundle Version String: `22`
- Bundle ID: `com.opaiapp.police`
- Upload Date: `Jul 10, 2026 at 7:18 PM`
- App Uses Non-Exempt Encryption: `No`
- Entitlement includes `aps-environment: production`
- Groups assigned:
  - `admin@opaiapp.com` / Internal / 1 tester
  - `Team (Expo)` / Internal / 1 tester
- Individual testers on the build detail page: 0

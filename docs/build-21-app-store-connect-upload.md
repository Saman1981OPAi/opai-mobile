# Build 21 App Store Connect Upload

Date: July 10, 2026

## Upload Scope

- App: OPAi Police
- Platform: iOS only
- Bundle identifier: `com.opaiapp.police`
- EAS Build ID: `17c847f7-6ac2-476f-83ba-b2e90ea95841`
- Build number: `21`
- EAS project: `ebrahimi-holdings/opai-police`
- App Store Connect app ID: `6788187875`
- Android release status: paused pending the D-U-N-S Number for Ebrahimi Holdings

## Submission Command

Requested command:

```bash
eas submit --platform ios --id 17c847f7-6ac2-476f-83ba-b2e90ea95841
```

Executed through the project-local EAS CLI:

```bash
pnpm exec eas submit --platform ios --id 17c847f7-6ac2-476f-83ba-b2e90ea95841 --wait --non-interactive
```

No new build was generated. No Android build was submitted.

## EAS Submission Result

Primary EAS submission:

- EAS Submission ID: `cf0ebd44-a6b3-4cc7-b2ad-969410848dec`
- Submission URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/cf0ebd44-a6b3-4cc7-b2ad-969410848dec`
- Platform: iOS
- Upload target: App Store Connect / TestFlight
- Upload status: `FINISHED`
- Error: none reported by EAS

Duplicate queued submission record:

- EAS Submission ID: `b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Submission URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Status at last check: `IN_QUEUE`
- Cause: a second local submit attempt timed out without terminal output while the first submission was still queued.
- Scope: same existing Build 21 artifact, not a new build.

## App Store Connect Status

- App Store Connect processing status: not yet independently confirmed in App Store Connect.
- Build 21 appears in TestFlight: not yet independently confirmed.
- Export compliance action required: not yet confirmed.
- Internal testers assigned: not yet confirmed.
- Real-device TestFlight installation complete: no.
- Real-device certification complete: no.

## Security Confirmation

- No Apple credentials were committed.
- No App Store Connect API private keys were committed.
- No EAS tokens were committed.
- No certificates were committed.
- No provisioning profiles were committed.
- No `.ipa` files were committed.
- No Android release workflow was started.

## Current Decision

Public submission remains **NO-GO**.

Build 21 may move forward only after it finishes App Store Connect processing, appears in TestFlight, is installed on a physical iPhone, and passes the complete real-device certification checklist.

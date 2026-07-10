# Build 21 GO / NO-GO

Date: July 10, 2026

## Status Fields

- Push Notifications enabled on App ID: yes
- Provisioning profile refreshed: yes
- EAS baseline reset to 20: yes
- Build 21 generated: yes
- IPA generated: yes
- Uploaded to App Store Connect: yes, via EAS Submit
- EAS submission complete: yes
- Processing complete: yes, Build Uploads shows `Complete`
- Appears in TestFlight: yes
- TestFlight build status: `Ready to Submit`
- Export compliance complete: no `Missing Compliance` prompt observed at time of review
- Internal testers assigned: yes, `Team (Expo)` internal group with 1 tester
- Installed through TestFlight: no
- Real-device certification complete: no
- Public submission decision: NO-GO

## Build 21

- EAS Build ID: `17c847f7-6ac2-476f-83ba-b2e90ea95841`
- Build URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/builds/17c847f7-6ac2-476f-83ba-b2e90ea95841`
- Build number: `21`
- IPA generated: yes

## Submission

- Submission command: `eas submit --platform ios --id 17c847f7-6ac2-476f-83ba-b2e90ea95841`
- Executed command: `pnpm exec eas submit --platform ios --id 17c847f7-6ac2-476f-83ba-b2e90ea95841 --wait --non-interactive`
- Primary EAS Submission ID: `cf0ebd44-a6b3-4cc7-b2ad-969410848dec`
- Primary EAS Submission URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/cf0ebd44-a6b3-4cc7-b2ad-969410848dec`
- Primary EAS submission status: `FINISHED`
- Upload target: App Store Connect / TestFlight for OPAi Police
- Duplicate EAS submission record: `b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Duplicate EAS submission status at last check: `IN_QUEUE`
- Duplicate note: same existing Build 21 artifact, not a new generated build.

## Rule

Public submission remains NO-GO until:

1. Build 21 is installed through TestFlight on a physical iPhone.
2. Build 21 passes real-device certification.
3. Any Apple export-compliance or beta-review prompts are completed accurately if presented.

## Android

Android remains compatible but is not an active production release path. Google Play release work remains paused pending the D-U-N-S Number for Ebrahimi Holdings.


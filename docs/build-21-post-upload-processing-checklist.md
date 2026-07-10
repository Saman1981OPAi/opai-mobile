# Build 21 Post-Upload Processing Checklist

Date: July 10, 2026

## Uploaded Build

- EAS Build ID: `17c847f7-6ac2-476f-83ba-b2e90ea95841`
- Build number: `21`
- Bundle identifier: `com.opaiapp.police`
- Primary EAS Submission ID: `cf0ebd44-a6b3-4cc7-b2ad-969410848dec`
- Primary EAS Submission URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/cf0ebd44-a6b3-4cc7-b2ad-969410848dec`
- EAS upload status: `FINISHED`

## App Store Connect Processing

- [x] Confirm Build 21 appears under App Store Connect builds.
- [x] Confirm Apple processing completes successfully.
- [ ] Confirm no missing compliance, encryption, privacy, or export prompts block TestFlight.
- [x] Confirm export compliance status: no `Missing Compliance` prompt observed at time of review.
- [x] Confirm TestFlight availability for Build 21.
- [x] Confirm internal tester group assignment: `Team (Expo)` internal group with 1 tester.
- [ ] Confirm tester notification status.

Observed TestFlight status:

- Build upload status: `Complete`
- TestFlight build row status: `Ready to Submit`
- Build detail: `0.1.0 (21)`
- Individual testers on build detail page: 0

## TestFlight Real-Device Certification

- [x] Complete the full physical certification checklist in `docs/build-21-testflight-physical-certification.md`.
- [x] Confirm Build 21 is installed through TestFlight on a physical iPhone.
- [x] Record certification as passed or failed.
- [x] Record Build 21 certification result: **FAILED - HOTFIX REQUIRED**.
- [x] Record Build 22 is required.
- [ ] Confirm physical iPhone smoke test passes.
- [ ] Confirm no critical defects are found.

## Duplicate Submission Note

A duplicate EAS submission record exists:

- EAS Submission ID: `b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Submission URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Last observed status: `IN_QUEUE`

This duplicate record targets the same existing Build 21 artifact. It must be monitored in EAS/App Store Connect, but it does not represent a new build generation.

## GO / NO-GO

Current public App Store submission decision: **NO-GO**.

Build 21 physical testing result: **FAILED - HOTFIX REQUIRED**.

Observed release-blocking findings:

- Text overflow on iPhone.
- Dense wording.
- Need for icon-based navigation.
- Home Dashboard requires time, date, location, and weather.

Public submission remains blocked until:

1. Build 21 is installed on a physical iPhone through TestFlight.
2. Build 21 passes complete real-device certification.
3. Any final Apple export-compliance or beta-review prompts are completed accurately if Apple presents them.

Build 21 must not be submitted publicly. Any replacement binary must use Build 22.

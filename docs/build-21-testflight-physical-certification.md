# Build 21 TestFlight Physical Certification

Date: July 10, 2026

## Certification Status

BUILD 21 TESTFLIGHT CERTIFICATION: **FAILED - HOTFIX REQUIRED**

Build 21 was installed and tested through TestFlight on a physical iPhone. The build must not be submitted publicly.

## Build Record

- Build: `21`
- EAS Build ID: `17c847f7-6ac2-476f-83ba-b2e90ea95841`
- Bundle identifier: `com.opaiapp.police`
- IPA generated: Yes
- Uploaded: Yes
- Apple processing: Complete
- Installed through TestFlight: Yes
- Physical iPhone smoke test: Failed
- Critical defects: Text/layout containment defects

## Physical Test Findings

- Text overflow on iPhone.
- Dense wording in several screens.
- Need for icon-based navigation and stronger hierarchy.
- Home Dashboard requires time, date, location, and weather.
- Build 22 is required before public submission.

## Installation and Identity

- [x] App installs through TestFlight.
- [ ] Build number shown is `21`.
- [ ] App name is `OPAi Police`.
- [ ] Correct app icon appears.
- [ ] App launches without crashing.
- [ ] Splash screen displays correctly.

## Authentication and Consent

- [ ] Welcome screen opens.
- [ ] Mock sign-in works.
- [ ] Mock account creation works.
- [ ] Consent flow works.
- [ ] Sign-out returns to Welcome.
- [ ] No real credentials are required.

## Core Modules

- [ ] Home Dashboard opens.
- [ ] Start My Shift opens.
- [ ] New Incident opens.
- [ ] OPAi Assistant opens.
- [ ] Translation opens.
- [ ] Calendar opens.
- [ ] Court opens.
- [ ] Training opens.
- [ ] Requalification opens.
- [ ] Follow-Ups open.
- [ ] Notes & Files opens.
- [ ] Settings opens.

## Local Persistence

- [ ] Create a local incident draft.
- [ ] Create a local note.
- [ ] Add a calendar item.
- [ ] Close the app.
- [ ] Reopen it.
- [ ] Confirm the local data remains.

## Push and Local Notifications

- [ ] Notification explanation appears before the system prompt.
- [ ] Notification permission can be granted.
- [ ] Test notification fires.
- [ ] Court/training reminder can be scheduled.
- [ ] Notification preferences persist.
- [ ] App does not crash when notification permissions are denied.

## Legal and Support

- [ ] Privacy page opens.
- [ ] Terms page opens.
- [ ] Support page opens.
- [ ] AI disclaimer opens.
- [ ] Translation disclaimer opens.
- [ ] PTSD disclaimer opens.
- [ ] Prototype disclaimer opens.
- [ ] About screen opens.

## Data Controls

- [ ] Reset Demo Data works.
- [ ] Clear Local Data works.
- [ ] Clear Local Data signs the mock user out.
- [ ] App returns to the Welcome screen.

## TestFlight Monitoring

After testers begin using Build 21, monitor App Store Connect for:

- [ ] Build status.
- [ ] Installs.
- [ ] Sessions.
- [ ] Crashes.
- [ ] Feedback.

## Pass Recording Template

Use this only after all certification checks pass on a physical iPhone:

```text
BUILD 21 TESTFLIGHT CERTIFICATION: PASSED

Build: 21
EAS Build ID: 17c847f7-6ac2-476f-83ba-b2e90ea95841
IPA generated: Yes
Uploaded: Yes
Apple processing: Complete
Installed through TestFlight: Yes
Physical iPhone smoke test: Passed
Critical defects: None
```

When this is recorded, public-submission status may move to **CONDITIONAL GO**.

Conditional means final App Store metadata, screenshots, privacy answers, age rating, content rights, export compliance, and App Review notes still require final review before pressing Submit for Review.

## Failure Recording Template

Certification result:

```text
BUILD 21 TESTFLIGHT CERTIFICATION: FAILED
HOTFIX REQUIRED
```

After Build 21 has been uploaded to Apple, any replacement binary must use Build 22, not another Build 21.

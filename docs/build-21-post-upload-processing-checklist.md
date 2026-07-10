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

- [ ] Confirm Build 21 appears under App Store Connect builds.
- [ ] Confirm Apple processing completes successfully.
- [ ] Confirm no missing compliance, encryption, privacy, or export prompts block TestFlight.
- [ ] Confirm export compliance status.
- [ ] Confirm TestFlight availability for Build 21.
- [ ] Confirm internal tester group assignment.
- [ ] Confirm tester notification status.

## TestFlight Real-Device Certification

- [ ] Install Build 21 through TestFlight on a physical iPhone.
- [ ] Confirm app launches successfully.
- [ ] Confirm the app displays Testing / Pre-Launch status.
- [ ] Confirm mock authentication works.
- [ ] Confirm mock sign-out works.
- [ ] Confirm Home navigation works.
- [ ] Confirm Start My Shift works.
- [ ] Confirm New Incident workflow works.
- [ ] Confirm AI Assistant mock workflow works.
- [ ] Confirm Translation workflow works.
- [ ] Confirm Calendar, Court, Training, Notes & Files, Settings workflows work.
- [ ] Confirm local notifications behavior if prompted.
- [ ] Confirm no production backend, OpenAI, database, payment, analytics, tracking, or police-service integration is active.
- [ ] Confirm no official police or government insignia is present.
- [ ] Confirm legal, privacy, AI, PTSD, translation, incident, reminder, and file disclaimers are visible where appropriate.

## Duplicate Submission Note

A duplicate EAS submission record exists:

- EAS Submission ID: `b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Submission URL: `https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/b4250c4c-7ed1-4173-ae44-132ed9236a31`
- Last observed status: `IN_QUEUE`

This duplicate record targets the same existing Build 21 artifact. It must be monitored in EAS/App Store Connect, but it does not represent a new build generation.

## GO / NO-GO

Current public App Store submission decision: **NO-GO**.

Public submission remains blocked until:

1. Build 21 is confirmed in App Store Connect.
2. Apple processing is complete.
3. Build 21 appears in TestFlight.
4. Build 21 is installed on a physical iPhone.
5. Build 21 passes complete real-device certification.

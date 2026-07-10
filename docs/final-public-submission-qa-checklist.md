# Final Public Submission QA Checklist

Automated validation may check compilation and export, but physical-device items remain manual.

## Startup and Auth

- [ ] Launch build `21` on a physical iPhone without a crash or blank screen.
- [x] Mock sign-in and mock create-account paths remain in source.
- [x] Consent flow remains required before app access.
- [x] Mock sign-out remains available.

## Core Modules

- [x] Home, Start My Shift, New Incident, OPAi Assistant, Translation, Calendar, Court, Training,
  Requalification, Follow-Ups, Notes & Files, and Settings remain connected in the local shell.
- [ ] Complete the full module walkthrough on uploaded build `21` in TestFlight.

## Local Data and Notifications

- [x] Device-local persistence architecture remains present.
- [x] Reset Demo Data and Clear Local Data remain present.
- [x] Local notification explanation, preferences, test scheduling, and cancellation remain present.
- [ ] Verify permission and notification delivery on the physical review device.

## Legal and Compliance

- [x] Privacy, Terms, AI, PTSD, Translation, Prototype, Support, and About screens remain available.
- [x] No official affiliation is claimed in the release package.
- [x] No backend, OpenAI, database, payment, cloud storage, or real file-upload integration is added.
- [x] No camera, microphone, location, contacts, tracking, or document-picker permission is added.
- [ ] Confirm asset rights and absence of protected marks in final binary and screenshots.
- [ ] Confirm App Privacy, age rating, content rights, and export answers in App Store Connect.

## Current Manual Blockers

- [ ] Generate build `21`.
- [ ] Upload build `21` to App Store Connect/TestFlight.
- [ ] Complete real-device TestFlight certification.
- [ ] Capture or certify screenshots from the final binary.

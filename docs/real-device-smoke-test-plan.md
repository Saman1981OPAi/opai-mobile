# Real-Device Smoke Test Plan

Run after installing the processed build through TestFlight on a real iPhone. Repeat core layout
and navigation checks on a supported iPad.

## Startup and Identity

- [ ] App launches without crash or blank screen.
- [ ] App icon, name, and splash screen are correct.
- [ ] Version/build shown in Settings matches `0.1.0-beta` / `21`.
- [ ] Testing / Pre-Launch status is visible.

## Mock Authentication

- [ ] Welcome, mock sign-in, and mock create-account flows work.
- [ ] Consent is required and can be completed.
- [ ] Sign-out returns to Welcome.

## Core Navigation

- [ ] Home Dashboard and Start My Shift open.
- [ ] New Incident and OPAi Assistant open.
- [ ] Translation, Calendar, Court, and Training open.
- [ ] Requalification, Follow-Ups, Notes & Files, and Settings open.
- [ ] No clipped text, overlap, unreachable control, or broken route appears.

## Local Data

- [ ] Create a demo note, incident draft, and calendar reminder.
- [ ] Restart the app and confirm data persists locally.
- [ ] Confirm no real data or network upload is requested.

## Local Notifications

- [ ] Permission explanation appears before the system prompt.
- [ ] Allow/decline behavior is understandable.
- [ ] Demo notification fires when allowed.
- [ ] Notification preferences persist and cancel behavior works.

## Legal and Support

- [ ] Privacy, Terms, disclaimers, Support, About, and Data & Storage screens open.
- [ ] AI, translation, PTSD, professional-use, and prototype warnings are readable.

## Reset and Clear

- [ ] Reset Demo Data restores only demo content.
- [ ] Clear Local Data confirms destruction, clears prototype data, and returns to Welcome.

Record device model, iOS version, build, result, issue IDs, and tester. Never attach real police,
personal, evidentiary, medical, or confidential data.

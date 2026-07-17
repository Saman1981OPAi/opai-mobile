# Build 26 Paid Duty and Canvass

## Scope

This branch adds two complete local-first operational productivity workflows:

- Paid Duty: add, edit, delete, duplicate, complete, reopen, filter, and schedule optional reminders.
- Canvass: start, complete, reopen, and delete sessions; add, edit, delete, search, filter, and sort entries.

Both features are available on iOS and Android. Neither sends user content to OPAi AI or the backend.

## Paid Duty data flow

Paid Duty records are stored with the existing app-local persistence and remain subject to the device's
security controls.
Reminder dates are calculated from the stored IANA timezone and local wall-clock duty time so daylight-
saving and device-timezone changes do not silently change the duty instant. Editing or deleting a duty
cancels obsolete notification identifiers before new reminders are scheduled.

Notification permission is requested only when a user saves a duty with reminders. Reminder lock-screen
content includes only the generic title and start time. Names, notes, rates, contact information, reference
numbers, and detailed addresses are excluded.

## Canvass data flow

Canvass sessions and entries are stored locally. The feature does not request location permission, track
movement, geocode addresses, call AI, call the OPAi backend, or add analytics. Search, filtering, and sort
operate in memory over the user's local records.

Canvass records are personal reference notes only. They are not an official occurrence, evidence record,
notebook entry, records-management system, or disclosure platform.

## Permissions and privacy

- Paid Duty: optional local notification permission only.
- Canvass: no new platform permission.
- Clear Local Data and Reset Sample Data cancel scheduled notifications and remove local records.
- No credentials, remote sync, content logging, location collection, or police-service integration.

## Validation

- Strict TypeScript validation.
- Expo lint with no new errors.
- Unit tests cover Paid Duty validation, timezone conversion, reminder deduplication, Canvass session
  validation, and Canvass entry validation.
- Final iOS and Android clean exports are required before review.

## Apple rejection relevance

Both public Home actions lead to complete, working local workflows with real persistence and error states.
No beta, testing, prototype, placeholder, or coming-soon wording is introduced.

## Remaining blockers

- Human PR review and merge.
- Physical notification, timezone, persistence, Dynamic Type, VoiceOver, iPhone, iPad, and Android tests.
- Production backend certification for other Build 26 network features.
- Build 26 generation and Apple submission remain NO-GO.

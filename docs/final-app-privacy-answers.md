# Build 26 App Privacy Answer Draft

Updated: 2026-07-16

This is a conservative internal mapping for the intended Build 26 binary. App Store Connect
answers must be verified against the final merged code, production backend behavior, OpenAI data
handling, Apple definitions, and the uploaded binary immediately before submission.

## Overall answers

- Data collection: **Yes**. Authenticated account data and user-requested AI/translation content
  are transmitted off device for app functionality.
- Tracking: **No**.
- Advertising: **No**.
- Data-broker sharing: **No**.
- Payments or purchase history: **Not collected by Build 26 while subscriptions remain hidden**.

Do not select `Data Not Collected` for Build 26.

## Conservative data-type mapping

| Apple data type | Build 26 use | Linked to user | Tracking | Retention boundary |
| --- | --- | --- | --- | --- |
| Name | Account profile | Yes | No | Production account lifecycle |
| Email Address | Authentication and account support | Yes | No | Production account lifecycle |
| User ID | Authentication, quotas, and request authorization | Yes | No | Production account lifecycle |
| Other User Content | AI prompts, report text, and text translation selected by the user | Yes | No | No content logging; provider storage disabled; confirm production logs |
| Audio Data | User-selected voice translation and Audio Statement transcription | Yes | No | Temporary backend processing copy; local original remains on device |
| Photos or Videos | User-selected image translation | Yes | No | Temporary request processing; confirm production cleanup |
| Other User Content / Documents | User-selected document translation | Yes | No | Temporary request processing; confirm production cleanup |

All listed collection is for App Functionality. The final answers must match Apple's exact current
category names and whether temporary processing qualifies for an applicable exception.

## Data kept on device by default

- Report drafts and operational reference data.
- Audio Statement recordings and locally saved transcripts.
- Paid Duty schedules and optional reminder identifiers.
- Canvass sessions and entries.
- Calendar, court, training, qualification, and follow-up records.
- Consent dates, notification preferences, and optional AI/translation history.
- Manual weather city and cached WeatherKit response.

Local-only storage does not make the data developer-collected by itself. User-requested AI,
transcription, and translation actions create the off-device processing described above.

## Location and WeatherKit

OPAi requests foreground location only after the user chooses local weather. Coordinates are used
on device for native Apple WeatherKit, are not stored as location history, and are not sent to the
OPAi backend. Manual Canadian-city weather does not require location permission. Confirm Apple's
current treatment of WeatherKit before finalizing the Location answer; do not declare that OPAi
collects location unless final binary or backend behavior changes.

## Explicitly absent

- Background location, movement tracking, geofencing, or address geocoding.
- Contacts, browsing history, advertising identifiers, or third-party analytics.
- Health diagnosis, health records, crisis-resource selection tracking, or call history.
- Police-service credentials, RMS synchronization, or government-system integration.
- Subscription or payment collection while commerce remains hidden.

## Mandatory final gate

Before submission, verify production retention, temporary-file cleanup, content-free logging,
third-party SDK behavior, diagnostics, account deletion/support handling, and the App Privacy
answers displayed in App Store Connect. Record the completed review in the final Build 26 metadata
audit. No privacy answer is approved solely by this draft.

# Build 26 App Review Notes Draft

Updated: 2026-07-16

Do not copy these notes into App Store Connect until every gate in
`docs/build-26-final-release-gate.md` has passed.

## Purpose and boundaries

OPAi Police is a productivity and AI assistance app designed for Canadian law enforcement
officers. It is not official police-service software and is not affiliated with or endorsed by a
police service or government agency unless an authorized agreement expressly states otherwise.
It does not replace official police systems, service policy, supervision, training, legal advice,
medical advice, court requirements, or professional judgment.

The production API is `https://api.opaiapp.com`. Do not use these notes until that endpoint and its
`/health` and `/ready` checks have been independently certified.

## Reviewer account

The dedicated reviewer email and password must be entered only in App Store Connect App Review
Information. They are not stored in this repository. Before submission, confirm that the account:

- exists and is active in the production database;
- requires no MFA, email verification, password change, or police-service credential;
- signs in from a clean iPhone and iPad installation;
- restores its session after terminate and relaunch; and
- can access every visible feature with fictional information.

## Review path

1. Sign in with the credentials supplied in App Store Connect.
2. Accept the Terms, Privacy, AI processing, translation, professional-use, and wellness notices.
3. From Home, open Start Shift, Report, Audio, Paid Duty, Canvass, Translate, Calendar, and OPAi.
4. Open Court, Training, Mental Health Resources, and Settings from the secondary navigation.
5. For Audio Statement, record a short fictional phrase, stop, play it locally, then select
   Transcribe. Review or edit the transcript before selecting Translate.
6. In Translation, use fictional text or a non-sensitive sample audio/image/document selected by
   the reviewer. Every output is labelled as AI-generated and requiring verification.
7. Paid Duty and Canvass store information locally. Paid Duty reminders are optional. Canvass does
   not request location or send entries to AI.
8. Mental Health Resources is a verified directory only. Do not place test calls to crisis lines.
9. Home weather uses native Apple WeatherKit. The reviewer may choose a manual Canadian city or
   grant foreground-only location. Denying location does not block the app.
10. Settings provides Privacy, Terms, support, consent status, local-data controls, and sign-out.

## Feature and commerce notes

- Device Testing is hidden and is not part of the submitted product.
- Subscriptions, paywall controls, Pro claims, and purchase actions are hidden.
- Audio, selected images, and selected documents are uploaded only after an explicit action.
- AI, transcription, and translation requests pass through the authenticated OPAi backend.
- OPAi does not add tracking, advertising, background location, or police-service integration.

## Contact

Support URL: `https://opaiapp.com/support`

Privacy URL: `https://opaiapp.com/privacy`

Terms URL: `https://opaiapp.com/terms`

# App Review Notes Final

## Copy for App Review

OPAi Police is currently an iOS-first internal beta and local/offline prototype. The app uses mock
authentication, local persistence, local notifications, mock AI Assistant responses, mock
translation workflows, local report-writing drafts, local calendar/court/training reminders, local
notes, file metadata placeholders, an optional Home Dashboard weather preview, and a local Device
Testing reference module.

The app does not connect to a production backend, OpenAI, police systems, cloud storage, payment
services, real authentication, tracking, analytics, or a production database. Device Testing uses
bundled curated local guide content only. It does not call live AI, certify equipment, create
official equipment records, upload device data, or request new device permissions.

Please use demo/mock data only. Do not enter real police records, confidential information,
sensitive personal information, real evidence, real statements, or official documents.

OPAi Police is not official police software and is not affiliated with any police service or
government agency unless expressly authorized in the future.

## Reviewer Test Instructions

1. Launch the app.
2. Use mock sign-in or mock create account.
3. Accept the local consent screens.
4. Explore Home, Start My Shift, Report Writing, Device Testing, Translation, OPAi Assistant,
   Calendar, Court, Training, Notes & Files, and Settings.
5. Test Reset Demo Data and Clear Local Data in Settings.
6. Test local notification permission and a demo notification if the device allows it.
7. On Home, test weather Refresh, City, and optional Local weather. Local requests foreground
   location only and the app continues working if permission is denied.
8. On Home, open Device Testing. Select a category and exact model to view a verified local guide.
   Unsupported models should display a refusal/manual notice. Breath Instrument requires qualified
   technician confirmation. Use of Force must remain non-prescriptive.

No reviewer credentials are required because the authentication flow is a local mock.

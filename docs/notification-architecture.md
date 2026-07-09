# Notification Architecture

Sprint 008 adds an iOS-first local notification prototype for OPAi Police. The implementation uses Expo local notifications only and does not implement remote push notifications, APNs server integration, Firebase Cloud Messaging, backend calls, cloud sync, analytics, or production notification credentials.

## Local Prototype Design

- `expo-notifications` schedules device-local reminders.
- `src/services/notificationPermissionService.ts` checks and requests OS notification permission.
- `src/services/notificationScheduler.ts` schedules, lists, and cancels local notifications.
- `src/services/notificationService.ts` maps local OPAi data into scheduled reminder metadata.
- Notification settings and scheduled reminder metadata persist through the Sprint 007 local persistence layer.

## Notification Categories

- `courtReminder`
- `trainingReminder`
- `requalificationReminder`
- `startShiftReminder`
- `followUpReminder`
- `calendarEventReminder`
- `systemReminder`

## iOS Permission Flow

OPAi does not ask for notification permission on launch. The Settings screen first explains why notifications are useful, then offers:

- Enable Notifications
- Maybe Later

The user choice is stored locally. No APNs token is generated or persisted in this sprint.

## User Controls

Settings includes local toggles for:

- Enable all reminders
- Court reminders
- Training reminders
- Requalification reminders
- Start My Shift reminders
- Follow-up reminders
- Calendar event reminders

Lead-time controls cycle through:

- At time of event
- 15 minutes before
- 1 hour before
- 1 day before
- 1 week before

## Relationship to App Modules

Court, training, requalification, shift, follow-up, and calendar reminder metadata is derived from existing local prototype data. No external calendar service is connected. No Google Calendar, Apple Calendar, Outlook, police-service scheduling system, or backend is synced.

## Future Production Push Model

A production notification model should use a secure backend to manage:

- Authenticated user notification preferences.
- Server-side scheduling rules.
- APNs and FCM provider credentials stored in a secret manager.
- Audit logging and consent records.
- Secure delivery retry handling.
- Privacy-by-design data minimization.

That future model is planning-only and not implemented in Sprint 008.

## Privacy and Safety

Notifications are productivity aids only. They do not replace official police systems, supervision, service policy, legal advice, medical advice, professional judgment, court scheduling systems, training systems, or official qualification records.

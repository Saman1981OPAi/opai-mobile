# Notification Permissions

Sprint 008 uses an explain-first permission flow.

## User-Facing Explanation

OPAi can send local reminders for court dates, training, requalification deadlines, shift readiness, follow-ups, and calendar events. You can change this anytime in Settings.

## Permission Rules

- Permission is not requested on app launch.
- Permission is requested only after the user taps Enable Notifications.
- Maybe Later stores a local preference and does not call the OS permission prompt.
- Permission status is stored locally as prototype state.
- No APNs device token is requested, generated, transmitted, or stored.
- No Firebase Cloud Messaging token is requested, generated, transmitted, or stored.

## Testing Notice

Notification reminders in this testing version are scheduled locally on this device. OPAi does not send remote push notifications in this prototype.

Do not enter real police records, confidential information, sensitive personal information, or real evidence into this testing version.

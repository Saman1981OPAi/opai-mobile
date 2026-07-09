# Notification Testing

Sprint 008 adds a Settings section titled `Notification Testing - Local Prototype`.

## Test Actions

- Request notification permission.
- Schedule a test notification in 10 seconds.
- Schedule a demo court reminder in 10 seconds.
- Schedule a demo training reminder in 10 seconds.
- Schedule local reminder metadata from existing local prototype data.
- Cancel all local notifications.
- View locally stored notification preference state and scheduled reminder count.

## Expected Result

On a device or simulator that supports notifications, the test notification should appear after approximately 10 seconds if permission is granted.

## Limitations

- Expo local notification behavior depends on device, simulator, OS settings, Focus modes, and notification permission.
- No remote push notification service is used.
- No backend notification queue is used.
- No external calendar sync is used.
- Clear Local Data resets stored metadata but should not be treated as production secure deletion.

## App Store Compliance Notes

Sprint 008 does not add emergency dispatch, supervisory tracking, official compliance certification, or guaranteed attendance/compliance claims. User-facing copy states that reminders are productivity aids and that official obligations must be verified through authorized systems and supervisors.

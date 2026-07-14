# iOS Permission Audit

## Current iOS Configuration

- App display name: OPAi Police
- Bundle identifier: `com.opaiapp.police`
- Version: `0.1.0`
- Beta app version label: `0.1.0-beta`
- Current certified build number: `25`
- Next public-release candidate: Build `26` after all production gates pass
- Orientation: default
- Supports iPad: true
- Encryption flag: `ITSAppUsesNonExemptEncryption` is false
- App Transport Security: arbitrary network loads are explicitly disabled

## Permission Review

- Notifications: may be requested only after an in-app explanation. Used for local prototype reminders only.
- Expo introspection includes the notification entitlement required by the installed notifications
  module. The current app does not request, generate, transmit, or store an APNs device token.
- Camera: no required permission in current prototype.
- Microphone: no required permission in current prototype.
- Photo Library: no required permission in current prototype.
- Contacts: no required permission in current prototype.
- Location: optional foreground location may be requested only after an explanatory alert and the
  user taps Continue. It is used by native Apple WeatherKit on the iPhone and is not used for
  background tracking, location history, AI prompts, analytics, or OPAi backend transmission.
- Document picker: no required permission in current prototype.
- Health: no required permission in current prototype.
- Tracking: no tracking permission is required or added.

## Notes

Do not add camera, microphone, photo library, contacts, health, tracking, background location, or document picker permissions unless a future sprint explicitly implements and documents those capabilities.

Build 26 location permission wording:

`OPAi Police uses your approximate foreground location only when you choose local weather for the Home Dashboard. Location is not tracked in the background.`


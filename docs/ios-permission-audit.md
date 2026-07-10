# iOS Permission Audit

## Current iOS Configuration

- App display name: OPAi Police
- Bundle identifier: `com.opaiapp.police`
- Version: `0.1.0`
- Beta app version label: `0.1.0-beta`
- Target build number: `21`
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
- Location: no required permission in current prototype.
- Document picker: no required permission in current prototype.
- Health: no required permission in current prototype.
- Tracking: no tracking permission is required or added.

## Notes

Do not add camera, microphone, photo library, location, contacts, health, tracking, or document picker permissions unless a future sprint explicitly implements and documents those capabilities.


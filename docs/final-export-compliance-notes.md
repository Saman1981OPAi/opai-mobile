# Final Export Compliance Notes

- The current prototype does not implement custom cryptography.
- The current prototype does not connect to backend services.
- The current prototype does not implement production secure messaging.
- `ITSAppUsesNonExemptEncryption` is set to `false` in `app.json`.
- Standard platform encryption may be used by iOS, Expo, App Store distribution, or future HTTPS
  networking, but no future feature should be considered part of the current binary.

Final export-compliance answers must be completed in App Store Connect based on the actual uploaded
build and Apple's current requirements. This document supplies engineering facts for developer or
legal review and is not a legal conclusion.

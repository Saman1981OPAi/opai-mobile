# App Privacy Review Notes

## Current Prototype Privacy Posture

The current build is a local/offline prototype. App Store Connect privacy answers must reflect the actual uploaded build, not future planned features.

## Likely Current Declarations

- Name, if a mock profile collects name.
- Email address, if a mock profile collects email.
- User ID, if the local mock user ID exists.
- User content, if testers create local notes, incidents, translations, AI mock prompts, or file metadata placeholders.
- Product interaction, only if local interaction state is treated as usage data.
- Diagnostics, only if Apple, Expo, or tooling collects crash/performance diagnostics for the distributed build.

## Not Collected Unless Later Added

- Advertising data.
- Tracking.
- Third-party analytics.
- Payment data.
- Health data.
- Precise location.
- Coarse location.
- Contacts.
- Real photos or videos.
- Real audio recordings.
- Real documents or evidence files.
- Browsing history.

## Notes

The app does not add advertising SDKs, analytics SDKs, production backend calls, OpenAI calls, police-service integrations, real authentication, real file upload, or cloud storage in Sprint 016.


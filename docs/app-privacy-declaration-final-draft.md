# App Privacy Declaration Final Draft

## Important

App Store Connect privacy answers must reflect the actual uploaded build, not future planned features.

## Likely Current Declarations

Contact Info:

- Name, if mock profile name is considered collected.
- Email Address, if mock profile email is considered collected.

User Content:

- Other User Content, because testers may create local notes, incident drafts, translations, AI mock prompts, and file metadata placeholders.
- Customer Support, if users contact support by email outside the app.

Identifiers:

- User ID, if the local mock user ID is considered collected.

Usage Data:

- Product Interaction, only if local app interaction state is treated as collected usage data.

Location:

- Coarse Location may apply for Build 22 if the user chooses local Home Dashboard weather and grants foreground location permission.
- Location is used only for weather convenience, is not tracked in the background, and is not uploaded to an OPAi backend in this prototype.

Diagnostics:

- Crash Data and Performance Data only if Apple, Expo, or tooling collects diagnostics for the distributed build.

## Not Collected Unless Later Added

- Advertising Data.
- Tracking.
- Contacts.
- Precise Location.
- Health Data.
- Payment Info.
- Real photos or videos.
- Real audio recordings.
- Browsing History.
- Third-party analytics.
- Financial information.
- Sensitive information beyond optional local prototype text entered by a tester.

## Current Build Notes

Build 22 adds optional foreground location weather and Open-Meteo weather requests. The beta does not add advertising SDKs, analytics SDKs, production backend calls, OpenAI calls, police-service integrations, real authentication, real file upload, payment code, tracking, or cloud storage.


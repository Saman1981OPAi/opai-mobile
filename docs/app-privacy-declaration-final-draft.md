# App Privacy Declaration Final Draft

## Important

App Store Connect privacy answers must reflect the actual uploaded build, not future planned features.

## Build 26 review notes

This is a review draft, not a substitute for answering App Store Connect from the final uploaded
binary. Build 25 remains the certified staging binary. Build 26 has not been generated.

## Data categories requiring final review

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

- Coarse or Precise Location must be reviewed against Apple's definitions if the user chooses Local
  weather and grants foreground permission.
- Coordinates are passed directly to native Apple WeatherKit on the iPhone for that user action.
- OPAi does not save coordinates, build location history, track in the background, include location
  in AI prompts, or upload location to the OPAi backend.
- Manual city selection works without location permission and stores only the selected bundled city.

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

## Build 26 change notes

- Replaces reachable Open-Meteo production requests with native Apple WeatherKit.
- Adds no Azure weather service, WeatherKit REST call, WeatherKit private key, analytics, tracking,
  payment, advertising, or police-service integration.
- Keeps a local weather response cache and selected city; Clear Local Data removes both.
- The existing Build 25 AI and Translation backend flows are outside this weather change and must
  remain accurately declared for the eventual production backend and final binary.


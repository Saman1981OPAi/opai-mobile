# Final App Privacy Answer Checklist

App Store Connect answers must reflect the actual uploaded build, not future planned features.
Confirm these recommendations against the final binary and Apple's current definitions before
submitting.

## Data Present in the Current Local Prototype

The following data can be entered or generated and stored locally on the device:

- Name: mock profile fields
- Email address: mock profile field
- User ID: local mock user identifier
- Other user content: local notes, incident drafts, translation text, and mock Assistant prompts
- Product interaction: local state such as preferences, consent, histories, and reminders

The app does not transmit this prototype data to OPAi servers. Whether Apple considers data that
never leaves the device to be "collected" must be answered using the current App Privacy guidance.
Do not mark a type as collected solely because it exists locally if Apple's definition excludes
on-device-only processing.

## Diagnostics to Confirm

- Crash data: declare only if the uploaded Expo/Apple build sends diagnostics to a developer or
  third party.
- Performance data: declare only if the uploaded build sends performance diagnostics.
- Apple-provided aggregate diagnostics: verify the App Store Connect setting and current Apple
  guidance separately from app code.

## Not Collected by Current App Code

- Advertising data or cross-app tracking
- Contacts
- Precise or coarse location
- Health or medical data
- Payment or financial information
- Real photos, videos, or audio
- Browsing or search history
- Third-party analytics data
- Real evidence or official records
- Sensitive information sent to OPAi, OpenAI, police systems, or cloud services

## Final Review

- [ ] Compare answers with the exact uploaded build.
- [ ] Confirm no analytics, advertising, backend, OpenAI, or cloud SDK was added.
- [ ] Confirm local-only fields are handled according to Apple's current definition of collection.
- [ ] Confirm diagnostics behavior for the production EAS build.
- [ ] Have the privacy owner approve the final App Store Connect answers.


# App Privacy Notes

Status: Sprint 005 planning notes for Apple App Privacy review

These notes summarize likely App Privacy declarations based on current and planned OPAi Police functionality. They are not a substitute for the final Apple questionnaire, which must be completed from the production build and enabled features.

## Current Sprint 005 State

- The app uses local mock authentication only.
- No production backend is connected.
- No database is connected.
- No OpenAI API calls are connected.
- No network calls are added by Sprint 005.
- No payments or subscriptions are added by Sprint 005.
- No production secrets are stored in the repository.

## Likely Data Types If Planned Features Are Enabled

Future App Privacy declarations may include:

- Name
- Email Address
- User ID
- Device ID
- Photos or Videos, if upload is enabled
- Audio Data, if voice translation, dictation, or voice command is enabled
- Other User Content, such as notes, incidents, AI prompts, translation text, report drafts, documents, or evidence references
- Search History, if app search is stored
- Product Interaction
- Crash Data
- Performance Data
- Purchases, if paid plans or subscriptions are later added

## Data Types Not Expected Unless Features Are Added

- Advertising Data: not expected unless ads are added.
- Contacts: not expected unless contact access is added.
- Precise Location: not expected unless GPS incident/location features are enabled.
- Health Data: not expected unless the app collects medical or PTSD-related health information beyond educational awareness content.

## Privacy-by-Design Notes

- Collect only the minimum data needed for a workflow.
- Ask for explicit consent before syncing calendars, using location, uploading files, recording audio, processing photos, or storing AI prompt history.
- Keep PTSD awareness content educational unless a future clinical feature has dedicated medical/legal review.
- Do not use police workflow content for advertising.
- Do not connect production AI processing until data retention, consent, audit logging, and deletion behavior are documented.

## Production URL Checklist

- Privacy Policy: `https://opaiapp.com/privacy`
- Terms of Use: `https://opaiapp.com/terms`
- Contact: `https://opaiapp.com/contact`
- Support: `https://opaiapp.com/support`

These URLs must be verified before final App Store submission.

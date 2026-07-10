# Final App Privacy Answers

App Store Connect answers must describe the uploaded binary and Apple's current definitions, not
future plans. Re-check the dependency manifest and binary before submitting.

## Recommended Current Answer

**Data Not Collected** is the recommended answer for the current local-only prototype if final
binary inspection confirms that no SDK transmits data to OPAi or a third party.

The mock profile, incidents, notes, translations, assistant prompts, preferences, identifiers, and
file metadata placeholders are stored on the user's device with AsyncStorage. They are not sent to
OPAi, OpenAI, a backend, analytics, advertising, cloud storage, or another user. Under Apple's
definition, data processed only on-device is generally not collected by the developer.

## Data Present Locally but Not Transmitted

| Data type | Local use | Current transmission |
| --- | --- | --- |
| Name and email | Mock profile | None |
| Local mock user ID | Mock auth state | None |
| Incident, note, translation, and assistant text | Prototype workflows | None |
| File metadata placeholders | Prototype organization | None; no real file access |
| Product interaction state | Navigation and preferences | None |
| Notification preferences | Local scheduling | None |

## Not Collected by Current App Code

- Advertising or tracking data
- Contacts or location
- Health data
- Payment or financial information
- Photos, videos, or audio
- Browsing history
- Analytics or advertising identifiers
- Camera, microphone, photo library, or document contents
- Police-service, government, or production account data

## Final Binary Review

- Confirm Expo, Apple, and other included tooling do not introduce reportable diagnostics.
- Declare Crash Data or Performance Data only if the uploaded binary actually transmits it.
- If a support workflow later transmits user details, declare Customer Support and relevant Contact
  Info at that time.
- Do not declare locally processed data as collected solely because a local form exists; apply
  Apple's current definitions to actual transmission and retention.

Build `21` has not been generated or uploaded, so the final App Privacy answer remains a manual
submission gate.

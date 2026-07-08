# App Store Compliance Audit

Status: Sprint 005 iOS readiness pass

## Current Platform Priority

iOS is the active launch and review priority. Android compatibility remains intact, but Android production release and Google Play submission are paused until the D-U-N-S Number for Ebrahimi Holdings is received.

## Compliance Findings

The current app and repository were reviewed for App Store readiness. Sprint 005 confirms:

- OPAi Police is described as a productivity and AI assistance tool, not an official police service app.
- The app uses OPAi-created shield and maple-leaf-inspired branding.
- No RCMP, OPP, TPS, YRP, or other protected police-service insignia were intentionally added in Sprint 005.
- No government badge or official police crest dependency was added.
- No copyrighted third-party image dependency was added.
- The app remains labeled as testing/pre-launch through header and auth-flow messaging.
- The app does not claim to provide medical diagnosis, treatment, therapy, crisis intervention, or emergency support.
- The app does not claim to provide legal advice.
- The app does not claim AI responses are guaranteed accurate.
- The app does not claim to replace official police systems, supervision, training, service policy, or professional judgment.

## Required Disclaimers

The required disclaimer language is centralized in `src/data/compliance.ts` and presented in consent/onboarding plus core app disclaimer areas:

- OPAi Police is a productivity and AI assistance tool.
- OPAi Police is not a replacement for official police systems, supervision, service policy, legal advice, medical advice, or professional judgment.
- AI-generated responses may be incomplete or inaccurate and must be verified by the user.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support.

## Legal and Support References

The Settings screen includes these pre-launch references:

- Privacy Policy: `https://opaiapp.com/privacy`
- Terms of Use: `https://opaiapp.com/terms`
- Support Contact: `https://opaiapp.com/contact`
- Support: `https://opaiapp.com/support`

Production URLs must be verified before final App Store submission.

## App Store Review Notes Draft

OPAi Police is currently in testing/pre-launch. The app is intended as a productivity and AI assistance tool for Canadian police officers. It is not an official police service app and does not replace official police systems, supervision, service policy, legal advice, medical advice, or professional judgment. AI-generated responses may be incomplete or inaccurate and must be verified by the user. PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support.

## Items Still Required Before Final Approval

- Verify production Privacy Policy, Terms of Use, Contact, and Support URLs.
- Confirm final App Store screenshots match the submitted build.
- Complete Apple App Privacy questionnaire based on final enabled features.
- Confirm any future AI, voice, camera, photo, document, calendar, notification, or location permissions have matching purpose strings and review notes.
- Confirm no official agency marks are present in final screenshots, icons, or metadata.

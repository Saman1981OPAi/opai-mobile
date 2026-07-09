# App Store Connect Field Package

Copy these values into the App Store Connect record for the uploaded iOS build. Reconfirm every
field against the actual build before submission.

## App Information

- App name: OPAi Police
- Subtitle: AI for Canadian Policing
- Primary category: Productivity
- Secondary category: Utilities (Business is an acceptable alternative if required)
- Marketing URL: https://opaiapp.com
- Support URL: https://opaiapp.com/contact
- Privacy Policy URL: https://opaiapp.com/privacy-policy
- Requested privacy alias: https://opaiapp.com/privacy (not live as of July 9, 2026)
- Copyright: 2026 OPAi

The live canonical Privacy Policy URL is used above because App Store Connect requires a working
public URL. Add a website redirect for `/privacy` before using that shorter alias.

## Promotional Text

Currently in testing. Built for Canadian policing productivity with shift readiness, incident
drafts, reminders, translation mockups, notes, and PTSD awareness.

## Description

OPAi Police is an iOS-first productivity prototype built to explore clearer, more organized
Canadian policing workflows.

This testing and pre-launch version works locally and offline. It includes Start My Shift
reminders, local New Incident drafts, a mock OPAi Assistant workflow, mock translation tools,
calendar and court reminders, training and requalification reminders, follow-ups, notes and file
metadata placeholders, local notifications, and PTSD awareness messaging.

This build uses mock authentication and demo data. It does not connect to a production backend,
OpenAI, a real translation service, cloud storage, a production database, payment services, or any
police-service system. It does not upload files or provide real AI, OCR, evidence storage, or
records-management functionality.

OPAi Police is not official police software and is not affiliated with any police service or
government agency unless future written authorization is obtained. It does not replace official
systems, records-management systems, notebook requirements, supervision, service policy, legal or
medical advice, training, court requirements, or professional judgment. AI-style and translation
mock responses may be incomplete or inaccurate and must be verified.

Use demo information only. Do not enter real police records, evidence, confidential information,
sensitive personal information, statements, or official documents in this testing build.

## Keywords

`AI,policing,law enforcement,productivity,reminders,incident,translation,court,training,PTSD,Canada`

## Field-Length Validation

- Subtitle: 24 characters (Apple maximum: 30)
- Promotional text: 160 characters (Apple maximum: 170)
- Keywords: 98 UTF-8 bytes (Apple maximum: 100)
- Description: below Apple's 4,000-character maximum

The original requested subtitle, `AI Assistant for Canadian Policing`, is 34 characters and cannot
be entered in App Store Connect. The final subtitle preserves the intent within Apple's limit. The
original promotional text and keyword list were similarly shortened without changing the product
positioning. Apple adds the copyright symbol automatically, so the field uses `2026 OPAi`.

References:

- https://developer.apple.com/help/app-store-connect/reference/app-information/app-information
- https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information

## Contact Emails

- Support: support@opaiapp.com
- Privacy: privacy@opaiapp.com
- Security: security@opaiapp.com
- Legal: legal@opaiapp.com

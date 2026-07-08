# Security and Privacy Model

Status: Sprint 006 planning only

## Core Requirements

- HTTPS only.
- Encryption in transit.
- Encryption at rest for databases, files, backups, and sensitive logs.
- Secure token and session management.
- Role-based access control.
- Audit logging for sensitive actions.
- Data minimization.
- User consent tracking.
- Secure file upload handling.
- Rate limiting.
- Input validation.
- Canadian privacy compliance planning.

## Token and Session Rules

- Use short-lived access tokens.
- Rotate refresh tokens.
- Revoke sessions on logout and password reset.
- Bind biometric unlock to secure local storage, not to server auth bypass.
- Never log raw credentials or tokens.

## File Upload Security

- Validate file type and size.
- Use signed upload/download URLs.
- Scan files where provider support exists.
- Encrypt storage at rest.
- Restrict access to file owner or approved roles.
- Audit file access where policy requires.

## AI Prompt and Data Handling Rules

- Route AI calls through the backend.
- Minimize personal and incident data sent to AI providers.
- Do not use AI output as guaranteed legal, medical, policy, or operational direction.
- Show disclaimers near AI features.
- Define retention and deletion behavior before storing prompt history.
- Rate limit AI endpoints.

## Consent and Privacy

- Track consent version and timestamp.
- Require explicit authorization before calendar sync, photo upload, file upload, voice processing, location, notifications, or AI history retention.
- Do not collect health data unless a future reviewed feature requires it.
- PTSD awareness content remains educational only.

## Canadian Privacy Considerations

- Apply privacy-by-design principles.
- Document collection purpose for each data category.
- Limit retention.
- Support access and deletion processes where required.
- Keep sensitive public-safety workflow data segregated and access controlled.

## Required Disclaimers

- OPAi Police is a productivity and AI assistance tool.
- OPAi Police is not a replacement for official police systems, supervision, service policy, legal advice, medical advice, or professional judgment.
- AI-generated responses may be incomplete or inaccurate and must be verified by the user.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support.

# API Contract

Status: Sprint 006 planning only. No live endpoints are implemented.

## Contract Rules

- All production endpoints must use HTTPS.
- All authenticated endpoints require a valid access token or secure session.
- Request and response bodies use JSON unless uploading files.
- File upload endpoints use multipart upload or signed upload flows.
- Errors use the standard format in `docs/error-handling.md`.
- AI, legal, medical, and policing limitation disclaimers must be returned where relevant.

## Common Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body is invalid.",
    "requestId": "req_123"
  }
}
```

Common codes include `AUTH_REQUIRED`, `AUTH_INVALID_CREDENTIALS`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `RATE_LIMITED`, `SERVER_ERROR`, `AI_UNAVAILABLE`, and `FILE_UPLOAD_FAILED`.

## Planned Endpoints

| Group | Method | Endpoint | Auth | Purpose | Request Example | Response Example | Security Notes | Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Authentication | POST | `/auth/register` | No | Create account after consent. | `{ "email": "officer@example.ca", "password": "***", "consents": ["terms"] }` | `{ "userId": "usr_123", "verificationRequired": true }` | Hash passwords, rate limit, verify email. | Store consent timestamp and minimum profile data. |
| Authentication | POST | `/auth/login` | No | Start secure session. | `{ "email": "officer@example.ca", "password": "***" }` | `{ "accessToken": "...", "refreshToken": "...", "expiresIn": 900 }` | Rate limit and audit failed attempts. | Do not expose password or auth internals. |
| Authentication | POST | `/auth/logout` | Yes | Revoke current session. | `{ "refreshToken": "..." }` | `{ "success": true }` | Revoke token server-side. | Log session revocation metadata only. |
| Authentication | POST | `/auth/refresh` | Yes | Refresh access token. | `{ "refreshToken": "..." }` | `{ "accessToken": "...", "expiresIn": 900 }` | Rotate refresh tokens. | Avoid returning profile unless needed. |
| Authentication | POST | `/auth/password-reset` | No | Request password reset. | `{ "email": "officer@example.ca" }` | `{ "accepted": true }` | Do not reveal whether email exists. | Send minimal reset email. |
| Authentication | POST | `/auth/verify-code` | No | Verify email/reset code. | `{ "email": "officer@example.ca", "code": "000000" }` | `{ "verified": true }` | Expire codes quickly. | Store verification metadata only. |
| Authentication | GET | `/auth/me` | Yes | Read session identity. | None | `{ "userId": "usr_123", "role": "officer" }` | Verify token and status. | Return only session-safe fields. |
| User Profile | GET | `/users/me` | Yes | Read profile. | None | `{ "userId": "usr_123", "firstName": "Sam", "role": "officer" }` | Own profile only unless admin. | Return minimum profile fields. |
| User Profile | PATCH | `/users/me` | Yes | Update profile. | `{ "preferredLanguage": "en-CA" }` | `{ "updated": true }` | Validate editable fields. | Do not allow role self-escalation. |
| User Profile | PATCH | `/users/me/preferences` | Yes | Update app preferences. | `{ "notifications": { "court": true } }` | `{ "updated": true }` | Validate preference names. | Store preference history only if needed. |
| User Profile | PATCH | `/users/me/consents` | Yes | Update consents. | `{ "termsAccepted": true, "privacyAccepted": true }` | `{ "updated": true }` | Immutable audit trail recommended. | Track consent version and timestamp. |
| Dashboard | GET | `/dashboard` | Yes | Read home summary. | None | `{ "reminders": [], "upcoming": [] }` | User-scoped data only. | Avoid excessive aggregation. |
| Dashboard | GET | `/dashboard/reminders` | Yes | Read reminder summary. | None | `{ "items": [] }` | User-scoped data only. | Return only active reminders. |
| Dashboard | GET | `/dashboard/upcoming` | Yes | Read upcoming events. | None | `{ "items": [] }` | User-scoped data only. | Limit range by default. |
| Start My Shift | GET | `/shift/reminders` | Yes | Read non-mandatory reminders. | None | `{ "items": [] }` | Never enforce checklist completion. | Store only user preference state. |
| Start My Shift | POST | `/shift/session` | Yes | Create optional shift session. | `{ "startedAt": "2026-07-08T12:00:00Z" }` | `{ "id": "shift_123" }` | User-scoped session. | Avoid turning reminders into mandatory records. |
| Start My Shift | PATCH | `/shift/session/{id}` | Yes | Update optional shift session. | `{ "status": "ready" }` | `{ "updated": true }` | Enforce owner access. | Keep minimal session metadata. |
| Incidents | GET | `/incidents` | Yes | List incidents. | None | `{ "items": [] }` | Strong authorization. | Paginate and minimize list fields. |
| Incidents | POST | `/incidents` | Yes | Create incident draft. | `{ "type": "Traffic Stop", "notes": "..." }` | `{ "id": "inc_123" }` | Validate content and ownership. | Sensitive data, apply retention policy. |
| Incidents | GET | `/incidents/{id}` | Yes | Read incident. | None | `{ "id": "inc_123", "notes": "..." }` | Owner/role access only. | Audit access to sensitive records. |
| Incidents | PATCH | `/incidents/{id}` | Yes | Update incident. | `{ "notes": "updated" }` | `{ "updated": true }` | Validate and audit changes. | Keep change history as policy requires. |
| Incidents | DELETE | `/incidents/{id}` | Yes | Delete or archive draft. | None | `{ "deleted": true }` | Soft delete may be required. | Respect retention/deletion rules. |
| Incidents | POST | `/incidents/{id}/attachments` | Yes | Attach file metadata/upload. | multipart or signed upload request | `{ "fileId": "file_123" }` | Scan/validate file uploads. | Evidence-like content needs strict access. |
| AI Assistant | POST | `/ai/chat` | Yes | AI chat request. | `{ "message": "Draft summary" }` | `{ "message": "Mock response", "disclaimer": "Verify output." }` | Server-side AI routing only. | Minimize prompt data and retention. |
| AI Assistant | POST | `/ai/report-review` | Yes | Review report text. | `{ "draft": "..." }` | `{ "suggestions": [] }` | Rate limit and validate length. | Sensitive content, clear retention policy. |
| AI Assistant | POST | `/ai/summarize-notes` | Yes | Summarize notes. | `{ "notes": "..." }` | `{ "summary": "..." }` | Server-side model controls. | Avoid storing raw prompts by default. |
| AI Assistant | POST | `/ai/suggest-followups` | Yes | Suggest tasks. | `{ "incidentId": "inc_123" }` | `{ "items": [] }` | Verify incident access. | AI suggestions are not official direction. |
| Translation | POST | `/translation/text` | Yes | Translate text. | `{ "text": "...", "target": "fr" }` | `{ "translatedText": "..." }` | Validate language and length. | Store history only with consent. |
| Translation | POST | `/translation/voice` | Yes | Translate audio. | signed upload or audio payload | `{ "translatedText": "..." }` | Secure audio handling. | Audio data needs explicit consent. |
| Translation | POST | `/translation/document` | Yes | Translate document. | signed upload request | `{ "fileId": "file_123", "status": "queued" }` | Validate files. | Document content is sensitive. |
| Translation | POST | `/translation/camera` | Yes | OCR/camera translation. | `{ "imageFileId": "file_123" }` | `{ "text": "...", "translatedText": "..." }` | Image validation. | Photo processing requires clear consent. |
| Calendar | GET | `/calendar/events` | Yes | List events. | None | `{ "items": [] }` | User-scoped access. | Sync only after explicit authorization. |
| Calendar | POST | `/calendar/events` | Yes | Create event. | `{ "title": "Court", "startAt": "..." }` | `{ "id": "cal_123" }` | Validate date/time. | Avoid syncing third parties without consent. |
| Calendar | PATCH | `/calendar/events/{id}` | Yes | Update event. | `{ "title": "Updated" }` | `{ "updated": true }` | Owner access only. | Audit important date changes. |
| Calendar | DELETE | `/calendar/events/{id}` | Yes | Delete event. | None | `{ "deleted": true }` | Owner access only. | Respect sync deletion rules. |
| Court | GET | `/court/events` | Yes | List court events. | None | `{ "items": [] }` | User-scoped access. | Treat court data as sensitive. |
| Court | POST | `/court/events` | Yes | Create court event. | `{ "matter": "R. v. Example", "date": "..." }` | `{ "id": "court_123" }` | Validate required fields. | Minimize case identifiers. |
| Court | PATCH | `/court/events/{id}` | Yes | Update court event. | `{ "date": "..." }` | `{ "updated": true }` | Owner access only. | Audit schedule changes. |
| Training | GET | `/training/events` | Yes | List training events. | None | `{ "items": [] }` | User-scoped access. | Avoid employer claims unless verified. |
| Training | POST | `/training/events` | Yes | Create training event. | `{ "title": "Firearms", "date": "..." }` | `{ "id": "trn_123" }` | Validate dates. | Store minimum certification data. |
| Training | PATCH | `/training/events/{id}` | Yes | Update training event. | `{ "date": "..." }` | `{ "updated": true }` | Owner access only. | Audit requalification changes. |
| Training | GET | `/training/requalification` | Yes | Read requalification reminders. | None | `{ "items": [] }` | User-scoped access. | Clearly label reminders as supportive. |
| Notes and Files | GET | `/notes` | Yes | List notes. | None | `{ "items": [] }` | Owner access only. | Paginate and minimize previews. |
| Notes and Files | POST | `/notes` | Yes | Create note. | `{ "title": "Shift note", "body": "..." }` | `{ "id": "note_123" }` | Validate content. | Sensitive user content. |
| Notes and Files | GET | `/notes/{id}` | Yes | Read note. | None | `{ "id": "note_123", "body": "..." }` | Owner access only. | Audit if required. |
| Notes and Files | PATCH | `/notes/{id}` | Yes | Update note. | `{ "body": "updated" }` | `{ "updated": true }` | Owner access only. | Preserve history if policy requires. |
| Notes and Files | DELETE | `/notes/{id}` | Yes | Delete note. | None | `{ "deleted": true }` | Owner access only. | Apply retention/deletion policy. |
| Notes and Files | POST | `/files/upload` | Yes | Upload file. | multipart or signed upload request | `{ "fileId": "file_123" }` | Validate, scan, encrypt. | File content may be highly sensitive. |
| Notes and Files | GET | `/files/{id}` | Yes | Read file metadata or signed URL. | None | `{ "id": "file_123", "downloadUrl": "..." }` | Short-lived signed URLs. | Audit file access. |
| Notifications | GET | `/notifications` | Yes | List notifications. | None | `{ "items": [] }` | User-scoped access. | Avoid revealing sensitive content on lock screen. |
| Notifications | PATCH | `/notifications/{id}/read` | Yes | Mark read. | `{ "read": true }` | `{ "updated": true }` | Owner access only. | Store read state only. |
| Notifications | POST | `/notifications/preferences` | Yes | Update preferences. | `{ "court": true, "training": true }` | `{ "updated": true }` | Validate preference names. | Consent for push delivery required. |
| Legal / Compliance | GET | `/legal/privacy` | No | Current privacy policy. | None | `{ "url": "https://opaiapp.com/privacy", "version": "..." }` | Public endpoint. | Return policy metadata. |
| Legal / Compliance | GET | `/legal/terms` | No | Current terms. | None | `{ "url": "https://opaiapp.com/terms", "version": "..." }` | Public endpoint. | Return terms metadata. |
| Legal / Compliance | GET | `/legal/disclaimers` | No | Current disclaimers. | None | `{ "items": [] }` | Public endpoint. | Keep versions for consent records. |

## Future Versioning

Production APIs should use versioned paths, for example `/v1/auth/login`, before public release.

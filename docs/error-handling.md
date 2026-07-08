# Error Handling

Status: Sprint 006 planning only

## Standard Error Format

```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password.",
    "requestId": "req_123"
  }
}
```

## Rules

- Every error response should include a stable machine-readable code.
- User-facing messages should be clear and safe.
- `requestId` should map to backend logs.
- Do not leak stack traces, secrets, SQL errors, provider internals, or token details.
- Validation errors may include field-level details after privacy review.

## Common Error Categories

| Category | Example Code | HTTP Status | Notes |
| --- | --- | ---: | --- |
| Authentication | `AUTH_INVALID_CREDENTIALS` | 401 | Invalid login or expired session. |
| Authorization | `FORBIDDEN` | 403 | User lacks access to resource. |
| Validation | `VALIDATION_ERROR` | 422 | Request body or params invalid. |
| Not Found | `NOT_FOUND` | 404 | Resource does not exist or is hidden. |
| Rate Limit | `RATE_LIMITED` | 429 | Too many requests. |
| Server | `SERVER_ERROR` | 500 | Generic unexpected backend failure. |
| AI Service | `AI_UNAVAILABLE` | 503 | AI provider or routing unavailable. |
| File Upload | `FILE_UPLOAD_FAILED` | 400/500 | Upload rejected or failed. |

## Mobile Handling

The mobile app should map known error codes to friendly messages and avoid showing raw backend details. Offline, timeout, and maintenance states should be handled separately from validation failures.

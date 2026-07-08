# Environment Configuration

Status: Sprint 006 planning only. Do not commit real secrets.

## Future Environment Variables

| Variable | Scope | Required For | Secret? | Notes |
| --- | --- | --- | --- | --- |
| `API_BASE_URL` | Mobile/backend | Backend API routing | No for public URL | Use staging and production values. |
| `OPENAI_API_KEY` | Backend only | OpenAI Responses API | Yes | Never expose in mobile app. |
| `DATABASE_URL` | Backend only | PostgreSQL | Yes | Use secret manager. |
| `JWT_SECRET` | Backend only | Token signing | Yes | Rotate and store securely. |
| `STORAGE_BUCKET` | Backend | Secure file storage | No/Maybe | Bucket name may be non-secret; credentials are secret. |
| `PUSH_NOTIFICATION_KEY` | Backend/CI | Push notification provider | Yes | Never commit. |
| `CALENDAR_CLIENT_ID` | Backend | Calendar OAuth | Maybe | Treat as sensitive config. |
| `CALENDAR_CLIENT_SECRET` | Backend | Calendar OAuth | Yes | Never expose in mobile app. |
| `SENTRY_DSN` | Mobile/backend | Crash monitoring if approved | Maybe | Confirm privacy policy first. |
| `APP_ENV` | All | Staging/production switch | No | Values: `development`, `staging`, `production`. |

## Rules

- Do not commit `.env` files with production values.
- Do not put OpenAI, database, JWT, calendar secret, storage secret, or push credentials in the mobile bundle.
- Mobile may use public `EXPO_PUBLIC_*` values only for non-secret configuration.
- Use separate staging and production environments.
- Rotate any credential suspected of exposure.

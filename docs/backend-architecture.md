# Backend Architecture

Status: Sprint 006 planning only

## System Overview

The future OPAi Police backend should be a secure FastAPI service that supports the mobile app without exposing sensitive implementation details to the client. Sprint 006 does not implement the backend; it defines the architecture boundary and contract.

Preferred future stack:

- FastAPI and Python
- PostgreSQL
- SQLAlchemy or equivalent ORM
- Alembic migrations
- JWT or secure session-based authentication
- Secure file storage
- OpenAI Responses API integration later
- Push notification support later
- Calendar integration later

## API Gateway / Backend Role

The backend should be the only production entry point for mobile data workflows. It should:

- Validate every request.
- Enforce authentication and authorization.
- Apply role-based access control.
- Store only required user/workflow data.
- Route future AI requests through privacy-aware backend services.
- Issue audit logs for sensitive events.
- Protect file upload and download access.

## Mobile App Communication Model

The mobile app should communicate with the backend over HTTPS only. The app should never call production databases, OpenAI APIs, storage buckets, or police-service systems directly.

Sprint 006 adds mock local services in `src/services`. These services prepare future integration points while returning local placeholder data only.

## Authentication Boundary

Authentication should be owned by the backend and a secure identity provider. The mobile app should hold short-lived session state and securely stored refresh credentials only after production auth is approved.

Planned auth responsibilities:

- Email/password registration and login.
- Password reset and verification code flows.
- Session refresh and revocation.
- Optional two-factor authentication.
- Device biometric unlock bound to secure local storage.
- Consent tracking.

## Database Boundary

PostgreSQL should store durable records only after privacy, consent, retention, and deletion policies are defined. The mobile app should not write directly to the database.

## AI Service Boundary

Future OpenAI Responses API calls should be routed through the backend, not directly from the mobile app. The backend should:

- Remove unnecessary personal data before AI calls.
- Attach clear AI disclaimers.
- Log AI usage metadata without over-collecting prompt content.
- Apply rate limits and abuse controls.
- Support specialized assistants through server-side routing.

## File Storage Boundary

Files should be uploaded through signed backend-mediated flows. The backend should validate content type, size, ownership, malware-scan status if available, and access policy.

## Notification Boundary

Push notifications should be produced from backend-owned reminder and calendar state. The app should store notification preferences, but the backend should enforce delivery rules.

## Calendar Integration Boundary

Calendar sync should require explicit user authorization. The backend should isolate third-party calendar tokens, encrypt credentials, and avoid syncing more calendar data than required.

## Future Admin Portal Boundary

A future admin portal should be separated from officer mobile workflows. It should have distinct roles, audit logging, stricter access controls, and no access to sensitive officer content unless explicitly permitted by policy.

## iOS-First Priority

iOS remains the active launch platform. Android compatibility must stay intact, but Android production release and Google Play workflows remain paused until the D-U-N-S Number for Ebrahimi Holdings is received.

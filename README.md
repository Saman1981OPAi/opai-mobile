# OPAi Mobile

Cross-platform OPAi Police mobile application for iOS and Android, with current launch priority on iOS.

## Objective

Build a shared-codebase mobile app for OPAi Police using React Native, TypeScript, and Expo. The app uses a Nori-inspired active AI navigation structure while implementing law-enforcement workflows, AI assistance, translation tools, scheduling, reminders, and PTSD awareness.

## Current Platform Priority

Android and Google Play submission are paused until the D-U-N-S Number for Ebrahimi Holdings is received.

Current priority:

1. iOS app development
2. Website and public launch materials
3. App Store readiness
4. Shared design system and architecture
5. Documentation and security planning

Android support stays in the codebase and cross-platform compatibility must be preserved. Immediate review, testing, screenshots, and launch work should prioritize iOS. Do not prioritize Android-specific store assets, Google Play release workflows, or Android production deployment until the D-U-N-S Number is received.

## Current MVP Scope

This repository starts the mobile app foundation and screen architecture. It does not build the complete production backend yet.

Included screens:

- Home Dashboard
- Start My Shift
- New Incident
- Translation
- Calendar
- AI Assistant
- Court
- Training & Requalification
- Notes & Files
- Notifications
- Settings

## Stack

- Expo
- React Native
- React 19
- TypeScript
- Shared OPAi design tokens

Future integrations:

- Firebase Authentication
- Firebase Cloud Messaging
- FastAPI backend
- PostgreSQL
- OpenAI API
- Cloudflare R2 secure file storage

## Development

```bash
pnpm install
pnpm start
```

Local prototype options:

```bash
pnpm ios
pnpm android
pnpm web
pnpm typecheck
```

Sprint 003 keeps the app fully local. The clickable prototype uses placeholder data only and does
not connect to backend services, OpenAI APIs, databases, authentication, payments, or real user
accounts.

Sprint 004 adds a local mock authentication foundation. It includes signed-out auth screens,
consent gates, a biometric placeholder, a mock profile, and mock sign-out. It still does not
connect to backend services, network APIs, OpenAI, databases, payments, subscriptions, or real
accounts.

Sprint 007 adds device-local persistence for offline prototype data using AsyncStorage. It stores
mock auth state, consent, preferences, reminder settings, incident draft examples, notes/file
metadata, calendar/court/training examples, and mock AI/translation history. Do not enter real
police records, evidence, confidential information, or sensitive personal information.

Sprint 008 adds an iOS-first local notification prototype using `expo-notifications`. It supports
local-only reminder permission, category preferences, lead-time controls, test notification
scheduling, demo court/training reminders, and cancel-all behavior. It does not add backend push,
APNs server integration, Firebase Cloud Messaging, external calendar sync, OpenAI, databases,
payments, subscriptions, police-service integrations, or production secrets.

Sprint 009 adds local editable workflows for Calendar, Court, Training, Requalification, and
Follow-Up reminders. These workflows use placeholder/offline data and the Sprint 008 local
notification scheduler only. External calendar sync, backend APIs, databases, OpenAI, payments,
subscriptions, police-service integrations, and production secrets remain out of scope.

## Apple Build & Upload

This project is prepared for EAS Build and App Store Connect upload.

```bash
pnpm build:ios
pnpm submit:ios
```

Apple requires an active Apple Developer Program account, an App Store Connect app record, and authentication during build/signing and upload.
Apple account email addresses are not stored in the application config or displayed inside the iOS app.

## Validation

```bash
pnpm typecheck
```

## Deployment

Project 015 adds GitHub Actions CI and EAS Build automation for staging and production mobile
builds. See `docs/deployment.md`.

## Sprint 002 Design System

Sprint 002 introduces reusable OPAi mobile UI tokens, branded components, and static screen
templates for Home Dashboard, Start My Shift, New Incident, AI Assistant, Translation, and
Calendar. See `docs/sprint-002-design-system.md`.

## Sprint 003 App Shell

Sprint 003 connects the mobile app shell into a clickable local prototype with bottom navigation,
secondary module navigation, local placeholder data, and prototype-only interactions. See
`docs/sprint-003-app-shell.md`.

## Sprint 004 Authentication Foundation

Sprint 004 adds the authentication UI foundation and local mock auth state model. See
`docs/sprint-004-authentication-foundation.md`.

## Sprint 006 Backend Planning and API Contract

Sprint 006 adds backend architecture planning, a secure API contract, TypeScript-style data model
planning, environment configuration notes, security/privacy rules, error handling standards, and a
mock local service layer. The app still does not connect to a real backend, database, OpenAI API,
payment system, police-service integration, or production secret. See:

- `docs/backend-architecture.md`
- `docs/api-contract.md`
- `docs/data-models.md`
- `docs/environment-configuration.md`
- `docs/security-privacy-model.md`
- `docs/error-handling.md`
- `docs/sprint-006-backend-planning-api-contract.md`

## Sprint 007 Local Persistence

Sprint 007 adds an offline local persistence layer for prototype-only data. See:

- `docs/local-persistence-architecture.md`
- `docs/sprint-007-local-persistence.md`
- `docs/offline-prototype-limitations.md`

## Sprint 008 Local Notifications

Sprint 008 adds local notification scheduling for testing and pre-launch review. See:

- `docs/notification-architecture.md`
- `docs/notification-permissions.md`
- `docs/notification-testing.md`
- `docs/sprint-008-local-notifications.md`

## Sprint 009 Calendar, Court, Training, and Requalification

Sprint 009 adds local workflow screens and storage for calendar items, court reminders, training
events, requalification deadlines, and follow-up reminders. See:

- `docs/calendar-workflow.md`
- `docs/court-reminder-workflow.md`
- `docs/training-requalification-workflow.md`
- `docs/follow-up-reminder-workflow.md`
- `docs/sprint-009-calendar-court-training-workflow.md`

## Product Principles

- Start My Shift is a reminder screen, not a mandatory checklist.
- AI output assists officers; it does not replace official police systems, supervision, service
  policy, legal advice, medical advice, or professional judgment.
- Privacy, consent, and minimal sensitive-data storage are core requirements.
- Notifications must support court, training, requalification, and shift reminders.
- PTSD awareness is part of the mission and must be handled with dignity.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, or
  crisis intervention.

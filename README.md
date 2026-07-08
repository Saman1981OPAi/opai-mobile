# OPAi Mobile

Cross-platform OPAi Police mobile application for iOS and Android.

## Objective

Build a shared-codebase mobile app for OPAi Police using React Native, TypeScript, and Expo. The app uses a Nori-inspired active AI navigation structure while implementing law-enforcement workflows, AI assistance, translation tools, scheduling, reminders, and PTSD awareness.

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

## Product Principles

- Start My Shift is a reminder screen, not a mandatory checklist.
- AI output assists officers; it does not replace official police systems, supervision, service
  policy, legal advice, medical advice, or professional judgment.
- Privacy, consent, and minimal sensitive-data storage are core requirements.
- Notifications must support court, training, requalification, and shift reminders.
- PTSD awareness is part of the mission and must be handled with dignity.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, or
  crisis intervention.

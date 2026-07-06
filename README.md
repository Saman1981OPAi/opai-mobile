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

## Apple Build & Upload

This project is prepared for EAS Build and App Store Connect upload.

```bash
pnpm build:ios
pnpm submit:ios
```

Apple requires an active Apple Developer Program account, an App Store Connect app record, and authentication during build/signing and upload.

## Validation

```bash
pnpm typecheck
```

## Product Principles

- Start My Shift is a reminder screen, not a mandatory checklist.
- AI output assists officers; it does not replace officer judgment.
- Privacy, consent, and minimal sensitive-data storage are core requirements.
- Notifications must support court, training, requalification, and shift reminders.
- PTSD awareness is part of the mission and must be handled with dignity.

# Sprint 003: Mobile App Shell and Local Prototype

## Objective

Convert the Sprint 002 static UI foundation into a clickable local prototype for OPAi Police while preserving the reusable design system and brand rules.

## Scope Completed

- Connected the mobile app shell to the main OPAi Police screens:
  - Home Dashboard
  - Start My Shift
  - New Incident
  - AI Assistant
  - Translation
  - Calendar
  - Court
  - Training & Requalification
  - Notes & Files
  - Settings
- Kept bottom navigation for primary screens.
- Added a reusable secondary module menu for additional modules.
- Added local prototype selection state so cards and rows respond when tapped.
- Made prototype rows/cards clickable:
  - Home quick actions
  - Start My Shift reminders
  - New Incident form sections and examples
  - AI Assistant suggested actions
  - Translation mode cards and examples
  - Calendar event cards
  - Court reminders
  - Training and requalification reminders
  - Notes & Files cards
  - Settings menu items
- Added local placeholder data for court, training, requalification, follow-ups, incident examples, AI suggested actions, translation examples, notes, files, and settings.
- Added user-facing disclaimers for AI assistance, official-system limitations, verification, professional judgment, and PTSD awareness limitations.

## Explicit Non-Goals

- No backend implementation.
- No network calls.
- No OpenAI API calls.
- No database integration.
- No authentication flow.
- No real user accounts.
- No payment or subscription logic.
- No calendar synchronization.

## Brand and Compliance Guardrails

- Dark blue/black premium interface.
- Police blue accent.
- PTSD awareness accent uses `#7FFFD4`.
- Maple leaf and shield-inspired OPAi branding.
- No official police service logos.
- No government badges.
- No RCMP, OPP, TPS, YRP, or other protected insignia.
- App remains clearly marked as testing/pre-launch.

## Local Run

```bash
pnpm install
pnpm start
pnpm typecheck
```

For platform-specific local testing:

```bash
pnpm ios
pnpm android
pnpm web
```

## Known Limitations

- Prototype state is local and resets when the app reloads.
- Tapping cards updates the local prototype selection banner; it does not save records.
- AI, translation, calendar, notes, and settings screens are UI-only.
- Native EAS builds should be run before TestFlight or Play Store distribution.

## Next Recommended Sprint

Sprint 004 should add deeper local form behavior for the New Incident workflow, still without backend persistence, so the product team can validate the reporting flow before API integration.

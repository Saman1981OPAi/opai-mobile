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

Sprint 010 expands New Incident into a structured local/offline incident drafting workflow with
multi-step basics, persons, witnesses, notes, attachment metadata, review/save actions, follow-up
reminder creation, local calendar placeholders, and an AI-ready placeholder. It still does not
connect to backend APIs, databases, OpenAI, real evidence upload, cloud sync, police-service
systems, payments, subscriptions, analytics, advertising, or production secrets.

Sprint 011 expands Translation into a local/offline mock workflow with text translation, voice,
conversation, camera/OCR, document, history, preferences, and incident-link placeholders. It does
not connect to real translation APIs, OpenAI, backend APIs, OCR services, microphone recording,
camera access, document upload, cloud storage, police-service systems, payments, subscriptions,
analytics, advertising, or production secrets.

Sprint 012 expands OPAi Assistant into a local/mock workflow with categories, category-specific
prompt chips, suggested actions, mock responses, local AI history, prompt guardrail placeholders,
incident/notes placeholders, and AI safety notices. It does not connect to OpenAI, backend APIs, databases, cloud sync,
police-service systems, legal databases, payments, subscriptions, analytics, advertising, or
production secrets.

Sprint 013 expands Notes & Files into a local/offline productivity workspace with structured notes,
folders, file metadata placeholders, workflow links, search/filter controls, and local save-as-note
actions from mock AI and translation history. It does not upload, store, process, sync, or open real
files and does not connect to backend APIs, OpenAI, databases, cloud storage, police-service
systems, payments, subscriptions, analytics, advertising, camera, microphone, photo library, or
document picker APIs.

Sprint 014 polishes Settings, Privacy, Legal, Consent, Support, About, Data & Storage, and App Store
review readiness. It adds local static Privacy Policy, Terms of Use, disclaimer, consent status,
support/contact, and storage status screens. It remains a local/offline prototype and does not add
backend APIs, OpenAI, production databases, cloud sync, real authentication providers, real file
upload, payments, subscriptions, analytics, advertising, police-service integrations, production
secrets, Google Play release workflow, or Android production workflow.

Sprint 015 adds an iOS-first UI/UX polish and accessibility pass. It improves accessible labels,
button loading/disabled states, auth validation errors, local destructive-action confirmations,
empty states, disclaimer readability, App Store screenshot readiness documentation, and brand
compliance documentation. It remains a local/offline prototype and does not add backend APIs,
OpenAI, production databases, cloud sync, real authentication providers, real file upload, payments,
subscriptions, analytics, advertising, police-service integrations, production secrets, Google Play
release workflow, or Android production workflow.

Sprint 016 prepares the internal iOS TestFlight beta package. It adds beta version/build visibility,
TestFlight readiness documentation, beta tester instructions, QA checklists, App Store Connect notes,
app privacy review notes, screenshot checklists, bug report templates, and beta feedback templates.
It remains a local/offline prototype and does not add backend APIs, OpenAI, production databases,
cloud sync, real authentication providers, real file upload, payments, subscriptions, analytics,
advertising, police-service integrations, production secrets, Google Play release workflow, or
Android production workflow.

Sprint 017 prepares the iOS release candidate and App Store asset finalization package. It updated
the beta build number to `17`, keeps the app at `0.1.0-beta`, adds App Store metadata drafts, App
Review notes, screenshot final checklists, legal URL verification, App Privacy declaration draft,
iOS permission audit, release candidate QA checklist, and TestFlight submission checklist. It remains
a local/offline prototype and does not add backend APIs, OpenAI, production databases, cloud sync,
real authentication providers, real file upload, payments, subscriptions, analytics, advertising,
police-service integrations, production secrets, Google Play release workflow, or Android production
workflow.

Sprint 018 hardens the release candidate after beta-readiness review. It updates the current build
number to `18`, keeps the app at `0.1.0-beta`, fixes duplicate bulk local notification scheduling,
adds beta feedback triage, App Store review risk audit, hardening checklist, and final pre-TestFlight
QA notes. It remains a local/offline prototype and does not add backend APIs, OpenAI, production
databases, cloud sync, real authentication providers, real file upload, payments, subscriptions,
analytics, advertising, police-service integrations, production secrets, Google Play release workflow,
or Android production workflow.

Sprint 019 prepares the final iOS-first TestFlight submission package. It updates the current build
number to `19`, keeps the app at `0.1.0-beta`, and adds copy-ready App Store Connect fields, final
review and tester notes, URL and privacy checks, screenshot and upload checklists, monitoring and
release guidance, and a final no-integration audit. It adds no product features or production
integrations. Android compatibility remains intact while Google Play release work stays paused
pending the D-U-N-S Number for Ebrahimi Holdings.

Sprint 020 adds TestFlight submission support and hotfix readiness documentation without changing
the candidate binary. Build `19` remains current. The sprint adds issue-response and App Review
templates, hotfix/build-replacement procedures, tester onboarding, feedback intake, screenshot and
privacy/legal checks, and release-freeze rules. It adds no product feature or production
integration, and Android production release remains paused.

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

## Sprint 010 New Incident Workflow

Sprint 010 adds structured local incident drafting. See:

- `docs/incident-workflow.md`
- `docs/incident-data-model.md`
- `docs/incident-privacy-limitations.md`
- `docs/sprint-010-new-incident-workflow.md`

## Sprint 011 Translation Workflow

Sprint 011 adds structured local/mock translation workflows. See:

- `docs/translation-workflow.md`
- `docs/translation-privacy-limitations.md`
- `docs/translation-future-api-plan.md`
- `docs/sprint-011-translation-workflow.md`

## Sprint 012 AI Assistant Mock Workflow

Sprint 012 adds the structured local/mock OPAi Assistant workflow and safety layer, including
category-specific prompt chips and local history controls. See:

- `docs/sprint-012-ai-assistant-mock-workflow.md`
- `docs/ai-platform-architecture.md`
- `docs/ai-safety-layer.md`
- `docs/future-openai-integration.md`
- `docs/ai-privacy-limitations.md`

## Sprint 013 Notes and Files Workflow

Sprint 013 adds the structured local/offline Notes & Files workspace. See:

- `docs/sprint-013-notes-files-workflow.md`
- `docs/notes-files-workflow.md`
- `docs/file-metadata-limitations.md`
- `docs/future-secure-file-storage-plan.md`
- `docs/notes-files-privacy-limitations.md`

## Sprint 014 Settings, Privacy, Legal, and Consent

Sprint 014 adds the local Settings, Privacy, Legal, Consent, Support, About, Data & Storage, and App
Store review readiness polish. See:

- `docs/sprint-014-settings-privacy-legal-consent.md`
- `docs/app-store-review-readiness.md`
- `docs/privacy-policy-draft.md`
- `docs/terms-of-use-draft.md`
- `docs/legal-disclaimers.md`
- `docs/support-contact-info.md`

## Sprint 015 iOS UI UX Polish and Accessibility

Sprint 015 improves iOS-first review polish and accessibility. See:

- `docs/sprint-015-ios-ui-ux-accessibility-polish.md`
- `docs/accessibility-audit.md`
- `docs/app-store-screenshot-readiness.md`
- `docs/ui-polish-notes.md`
- `docs/brand-compliance-check.md`

## Sprint 016 TestFlight Internal Beta Preparation

Sprint 016 prepares the internal iOS TestFlight beta documentation and in-app beta version/build
visibility. Current beta values:

- App version: `0.1.0-beta`
- Native Expo version: `0.1.0`
- Build: `19`
- Status: TestFlight Submission Package
- Platform priority: iOS-first

See:

- `docs/sprint-016-testflight-internal-beta-preparation.md`
- `docs/testflight-readiness-audit.md`
- `docs/testflight-beta-notes.md`
- `docs/beta-tester-instructions.md`
- `docs/internal-qa-checklist.md`
- `docs/known-limitations-beta.md`
- `docs/app-store-connect-preparation.md`
- `docs/app-privacy-review-notes.md`
- `docs/screenshot-checklist-ios.md`
- `docs/bug-report-template.md`
- `docs/beta-feedback-template.md`

## Sprint 017 iOS Release Candidate and App Store Assets

Sprint 017 prepares the iOS release candidate documentation and App Store-facing asset package. See:

- `docs/sprint-017-release-candidate-app-store-assets.md`
- `docs/release-candidate-audit.md`
- `docs/app-store-metadata-final-draft.md`
- `docs/app-review-notes-draft.md`
- `docs/app-store-screenshot-final-checklist.md`
- `docs/legal-url-verification.md`
- `docs/app-privacy-declaration-final-draft.md`
- `docs/ios-permission-audit.md`
- `docs/release-candidate-qa-checklist.md`
- `docs/testflight-submission-checklist.md`
- `docs/known-limitations-beta.md`

## Sprint 018 Beta Feedback and Release Candidate Hardening

Sprint 018 hardens the iOS release candidate and prepares final pre-TestFlight QA. See:

- `docs/sprint-018-beta-feedback-release-candidate-hardening.md`
- `docs/beta-feedback-triage.md`
- `docs/app-store-review-risk-audit.md`
- `docs/release-candidate-hardening-checklist.md`
- `docs/final-pre-testflight-qa.md`

## Sprint 019 TestFlight Submission Package

Sprint 019 assembles the final copy, checklists, and operating guidance needed to upload build `19`
for internal TestFlight review. See:

- `docs/sprint-019-testflight-submission-package.md`
- `docs/testflight-submission-master-checklist.md`
- `docs/app-store-connect-field-package.md`
- `docs/testflight-beta-information.md`
- `docs/app-review-notes-final.md`
- `docs/internal-tester-invitation.md`
- `docs/final-url-verification.md`
- `docs/final-app-privacy-answer-checklist.md`
- `docs/final-screenshot-package-checklist.md`
- `docs/final-build-upload-checklist.md`
- `docs/post-submission-monitoring-plan.md`
- `docs/release-branch-strategy.md`
- `docs/final-no-integration-check.md`

## Sprint 020 TestFlight Submission Support and Hotfix Readiness

Sprint 020 prepares controlled response and beta-operations guidance for build `19`. See:

- `docs/sprint-020-testflight-submission-support-hotfix-readiness.md`
- `docs/testflight-submission-support-checklist.md`
- `docs/app-store-issue-response-playbook.md`
- `docs/app-review-response-templates.md`
- `docs/hotfix-branch-strategy.md`
- `docs/build-replacement-procedure.md`
- `docs/beta-tester-onboarding-package.md`
- `docs/beta-feedback-intake-system.md`
- `docs/first-beta-hotfix-plan.md`
- `docs/app-store-connect-cross-check.md`
- `docs/screenshot-correction-procedure.md`
- `docs/privacy-legal-final-verification.md`
- `docs/release-freeze-rules.md`

## Product Principles

- Start My Shift is a reminder screen, not a mandatory checklist.
- AI output assists officers; it does not replace official police systems, supervision, service
  policy, legal advice, medical advice, or professional judgment.
- Privacy, consent, and minimal sensitive-data storage are core requirements.
- Notifications must support court, training, requalification, and shift reminders.
- PTSD awareness is part of the mission and must be handled with dignity.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, or
  crisis intervention.

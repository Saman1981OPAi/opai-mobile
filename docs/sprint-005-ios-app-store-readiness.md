# Sprint 005: iOS App Store Readiness and Compliance Pass

## Objective

Prepare OPAi Police for iOS App Store review readiness by auditing compliance, metadata alignment, disclaimers, screenshot/assets structure, privacy references, and testing/pre-launch language.

## Platform Priority

iOS is the active launch priority. Android compatibility remains intact, but Android production release and Google Play submission are paused until the D-U-N-S Number for Ebrahimi Holdings is received.

## Scope Completed

- Added centralized compliance disclaimers in `src/data/compliance.ts`.
- Reused the required disclaimer language in authentication consent and core app disclaimer areas.
- Added Privacy Policy, Terms of Use, Contact, and Support references for Settings/legal review.
- Confirmed app headers and auth flow show testing/pre-launch language.
- Documented App Store compliance findings.
- Documented likely Apple App Privacy declarations.
- Documented screenshot asset dimensions and organization.
- Confirmed brand token values:
  - Background: `#05070B`
  - Primary Blue: `#0A84FF`
  - Accent Blue: `#4DA3FF`
  - PTSD Awareness Accent: `#7FFFD4`
  - Text: `#FFFFFF`

## Explicit Non-Goals

- No real backend.
- No database integration.
- No OpenAI API calls.
- No real authentication.
- No payments or subscriptions.
- No police-service integrations.
- No production secrets.
- No Android release workflow.
- No Google Play production workflow.

## Compliance Items Reviewed

- Official-police-service claim risk.
- Protected insignia risk.
- Medical and PTSD-content claim risk.
- Legal-advice claim risk.
- AI accuracy claim risk.
- Official systems and professional-judgment replacement risk.
- Testing/pre-launch language.
- Legal/support URL visibility.
- Screenshot organization and dimensions.
- App Privacy planning notes.

## Testing Required for PR

- `pnpm typecheck`
- `pnpm exec expo export --platform ios --output-dir .expo-review-ios --clear`
- Local Expo smoke test
- GitHub CI
- Android Expo export for compatibility only, not active Android launch

## Known Limitations

- Production URLs must be verified before final App Store approval.
- App Privacy declarations must be completed from the final submitted build.
- Screenshots must be revalidated against the final iOS build.
- Mock authentication remains local only.
- No real AI, backend, calendar sync, document upload, photo upload, voice processing, notification delivery, or data storage is connected in this sprint.

## Next Recommended Sprint

Sprint 006 should continue iOS-first readiness by adding final App Store metadata review, permission-purpose-string review, and a build-submission checklist once the next iOS build candidate is ready.

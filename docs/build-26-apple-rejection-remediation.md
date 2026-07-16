# Build 26 Apple Rejection Remediation

## Apple findings

- Submission: `ea2af42f-d25a-47c9-a700-04eed12474fd`
- Review date: July 15, 2026
- Review device: iPad Air 11-inch (M3), iPadOS 26.5.2
- Guideline 2.1(a): the reviewer could not sign in with the supplied credentials.
- Guideline 2.2: the submitted app appeared to be a beta, test, trial, or incomplete product.

Build 25 is historical and must not be resubmitted. A replacement must use Build 26 or higher.

## Source remediation

- Removed public Beta, Testing, Pre-launch, Mock, and staging labels from the authentication and app headers.
- Removed inactive biometric, verification-code, and password-reset controls from the public sign-in flow.
- Removed Device Testing from public navigation and marketing scope while retaining its dormant source.
- Removed metadata-only Notes & Files from public navigation.
- Replaced public placeholder/demo wording with production wording or clearly fictional local examples.
- Kept AI, translation, professional-use, and wellness safety warnings.

## Remaining release gates

- Deploy and certify the production backend at `https://api.opaiapp.com`.
- Provision and certify a dedicated non-expiring reviewer account in the production database.
- Verify sign-in, refresh, relaunch, and all reviewable features from a clean iPhone and iPad installation.
- Complete the public-completeness audit after all Build 26 feature branches are merged.
- Do not submit until an independent final review explicitly returns `SAFE TO SUBMIT TO APPLE`.

## Validation completed on this branch

- `pnpm typecheck`: passed.
- `pnpm lint`: passed with no errors; 19 existing style/legacy warnings remain recorded for later cleanup.
- WeatherKit unit tests: 6 passed, 0 failed.
- Clean iOS Expo export: passed.
- Clean Android Expo compatibility export: passed.
- No iOS or Android production binary was generated.
- No Apple upload or App Review submission was performed.

# Hotfix Readiness Confirmation

- [x] Hotfix branch strategy exists: `docs/hotfix-branch-strategy.md`.
- [x] Build replacement procedure exists: `docs/build-replacement-procedure.md`.
- [x] App Review response templates exist: `docs/app-review-response-templates.md`.
- [x] Screenshot correction procedure exists: `docs/screenshot-correction-procedure.md`.
- [x] Privacy/legal verification exists: `docs/privacy-legal-final-verification.md`.
- [x] Release freeze rules exist: `docs/release-freeze-rules.md`.
- [x] First beta hotfix criteria exist: `docs/first-beta-hotfix-plan.md`.

Do not create a hotfix branch merely in anticipation of an issue. Start only after a processing,
review, crash, or tester report identifies a specific correction. Keep the PR small and increment
the build number only when replacing the binary.

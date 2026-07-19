# Build 26 Unreachable Prototype-Code Audit

Date: 2026-07-19

Scope: production mobile source on `main` after the mental-health resource correction. Historical sprint, certification, and audit documents are intentionally excluded from removal.

## Audit Method

- Traced `App.tsx` through `AppShell` and the `ModuleScreen` navigation switch.
- Searched TypeScript and TSX imports, module identifiers, release flags, and user-facing strings.
- Searched for `beta`, `testing`, `prototype`, `pre-launch`, `mock`, `demo`, `coming soon`, `staging`, `placeholder`, and `TODO`.
- Distinguished unreachable modules from intentionally dormant, feature-controlled source and from local sample-data terminology.

## Findings

| Path | Purpose | Imported | Navigation | Feature flag | Production-bundle strings | Decision and risk |
| --- | --- | --- | --- | --- | --- | --- |
| `src/screens/ModuleScreen.tsx` (`TranslationScreen`, formerly lines 1806-2125) | Sprint 011 mock Translation UI | No call site; the function lived inside an imported module | No. `translation` renders `Build25TranslationScreen` | None | Yes. It contained mock, placeholder, testing, and pre-launch copy | **Removed.** Low risk because the production navigation path has used `Build25TranslationScreen` since Build 25. |
| `src/services/translationService.ts` | Local mock Translation modes and generated placeholder output | Only by the removed legacy screen and an unused handler in `ModuleScreen` | No | None | Yes. It generated `[Mock Translation]` output | **Removed.** Low risk after removal of all import sites. |
| `src/features/deviceTesting/**` and `src/services/api/deviceTestingApi.ts` | Curated Device Testing reference implementation | Internally connected within its own feature folder, but not imported from the application shell | No production route | `DEVICE_TESTING_VISIBLE` is false, but the current shell has no Device Testing branch | Not in the reachable application graph | **Retained.** Removal risk is high because this is an intentionally dormant, source-grounded feature with release history and approved future scope. It must remain hidden unless separately approved. |
| `src/components/ActiveAiPanel.tsx` and `src/components/Primitives.tsx` | Earlier dashboard/AI presentation primitives | Only reference each other | No | None | Potentially, if reintroduced | **Deferred.** Genuinely unreachable, but unrelated to prototype Translation and not a release-path defect. Remove in a dedicated component cleanup after visual regression review. |
| `src/components/ui/FeatureCard.tsx` and `src/components/ui/PTSDRibbonCard.tsx` | Earlier reusable UI cards | No import sites | No | None | Static UI copy only | **Deferred.** Unreachable, but preserving design-system components has low current cost and deletion needs design-system ownership review. |
| `src/services/authService.ts`, `calendarService.ts`, `courtService.ts`, `shiftService.ts`, and `trainingService.ts` | Earlier mock service wrappers | No import sites | No | None | Mock data only | **Deferred.** Unreachable, but removal should be grouped with the local-data architecture cleanup rather than this narrow production-string removal. |
| `src/utils/aiGuardrails.ts` | Earlier local mock-AI classifier | No import sites | No | None | Mock response copy | **Deferred.** Unreachable. Remove with the older AI mock history/type migration after confirming stored-data compatibility. |

## Reachable Terminology

The search also found `mock`, `demo`, `placeholder`, and `prototype` in active local-storage migrations, type names, fixture identifiers, notification test utilities, and data-reset controls. These terms are not proof of an unfinished public screen. They must be reviewed in context before removal because changing persisted field names or migration values can break existing TestFlight data.

Reachable Notes & Files, notification-preview, seed-data, and fallback copy was revised to use production-safe language such as "sample", "test", and "file reference". Persisted fields and internal identifiers including `mockResponse`, `prototypeDisclaimer`, `fileMetadataPlaceholders`, and `*-demo` remain unchanged for storage compatibility and are not shown as release-status labels.

`incidentWorkflowService.buildAiReadyPreview` remains unreachable and contains obsolete testing-version copy. It is retained for a later service-layer cleanup because the active Report Writing route uses the authenticated Build 25 API path and has no call site to this helper.

The legacy Translation implementation was the only large duplicate screen found in an imported production module whose entire UI had no route and whose copy was explicitly obsolete.

## Release Assertions

- The Translation route continues to render `Build25TranslationScreen`.
- Device Testing remains unavailable from production navigation.
- No historical audit or sprint documentation was deleted.
- No backend, OpenAI, payment, analytics, tracking, or native-permission behavior was changed.
- This cleanup does not authorize Build 26 generation or App Store submission.

# Beta Feedback Triage

## Review Scope

Reviewed July 9, 2026:

- Connected Gmail search for OPAi/TestFlight/beta feedback: no tester feedback found; only historical
  GitHub build-failure notifications.
- Open GitHub issues: none.
- EAS iOS build history: latest production build `8` finished successfully from an older commit.
- GitHub EAS workflow history: three old failures; latest inspected failure lacked `EXPO_TOKEN`.
- Apple/App Store review notes: none available.
- Physical-device TestFlight results for target build `21`: not available.
- Simulated internal QA: static navigation, keyboard, layout, accessibility, and release review.

No external tester feedback is represented as real. Items marked Simulated QA are engineering audit
findings from the current source.

## Feedback Log

| ID | Source / Date | Reporter / Device | Build | Module / Type | Severity | Description and reproduction | Expected / Actual | Decision / Status | Evidence / Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BF-022-001 | Simulated QA / 2026-07-09 | Codex audit / iOS code path | 21 target | App shell / Navigation | High | Scroll down in one module, then choose another bottom tab. A shared ScrollView can retain the prior offset. | New module starts at top / It may open mid-content. | Fix in Sprint 022 / Fixed | AppShell now resets scroll to y=0 when module ID changes. |
| BF-022-002 | Simulated QA / 2026-07-09 | Codex audit / iPhone form path | 21 target | Forms / UI/Layout | Medium | Focus a lower form field while the software keyboard is visible. | Input remains reachable and taps work / Keyboard inset handling was implicit. | Fix in Sprint 022 / Fixed | App shell now adjusts keyboard insets, dismisses on drag, and preserves handled taps. |
| BF-022-003 | Static accessibility audit / 2026-07-09 | Codex audit / iOS | 21 target | Auth and chips / Accessibility | Medium | Inspect Back/text controls and interactive step/category/prompt chips. | Comfortable 44-point targets / Some controls used text-only or 38-point minimums. | Fix in Sprint 022 / Fixed | Text control and chip minimum heights now meet 44 points; Back control has an explicit label. |
| BF-022-004 | GitHub Actions / 2026-07-08 | CI / Ubuntu | old main | EAS build / Build issue | Medium | Dispatch production EAS workflow without `EXPO_TOKEN`. | Clear preflight / Old run reached EAS and failed authentication. | Not reproducible / Resolved before Sprint 022 | Current workflow has explicit Verify Expo token steps; repository stores no token. |
| BF-022-005 | Manual launch review / 2026-07-09 | Pending tester / real iPhone and iPad | 21 target | All / TestFlight | Medium | Target build has not been uploaded or installed through TestFlight. | Recorded real-device result / No result exists yet. | Defer to Sprint 023 / Pending | Follow real-device smoke plan after reviewed build upload. |
| BF-022-006 | URL verification / 2026-07-09 | Automated HTTP check / N/A | N/A | Store metadata / Compliance | Medium | `/privacy`, `/terms`, and `/support` aliases returned 404. | Every entered URL is live. | Fix shipped / Resolved | Website PR #21 added static aliases; all short and canonical URLs return HTTP 200. |

No screenshot or video reference was available for these items.

## Triage Rules

- Critical and high bugs block wider beta until fixed and verified.
- Medium items may proceed only with an owner, status, and documented risk.
- Low items remain backlog unless they affect accessibility or review compliance.
- Feature requests are out of scope during release freeze.


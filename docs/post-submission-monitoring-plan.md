# Post-Submission Monitoring Plan

## Operating Rhythm

- Check App Store Connect immediately after upload and at least daily while processing or review is
  active.
- Watch for processing failures, missing compliance fields, export-compliance questions, and beta
  review feedback.
- Monitor TestFlight feedback and available crash diagnostics.
- Record reproducible issues in GitHub without operational or personal data.
- Triage critical and high issues before inviting more testers.
- Prepare a small hotfix branch only when a verified issue requires it.

## Severity

| Severity | Definition | Response |
| --- | --- | --- |
| Critical | Crash, app will not launch, or tester cannot reach the mock app shell | Stop rollout and prepare hotfix |
| High | Core workflow is broken or data reset/corruption affects testing | Prioritize before expanding beta |
| Medium | Confusing UX or broken non-critical flow | Schedule in next hardening pass |
| Low | Typo, minor layout issue, or cosmetic polish | Batch for normal maintenance |

## Feedback Record

Capture build number, device, iOS version, module, steps, expected result, actual result, severity,
screenshots when safe, owner, and disposition. Never include real police, personal, evidentiary, or
confidential data.


# Beta Feedback Triage

## Status

No external beta feedback has been provided yet. This document is the Sprint 018 placeholder triage system for internal TestFlight feedback.

## Categories

- Critical crash
- Navigation issue
- Data persistence issue
- Local notification issue
- UI/layout issue
- Accessibility issue
- Legal/disclaimer issue
- App Store compliance issue
- Copy/text issue
- Screenshot/asset issue
- Documentation issue
- Future feature request
- Out of scope for current beta

## Feedback Log

| ID | Title | Description | Screen/Module | Severity | Status | Decision | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BF-001 | Bulk local reminders can stack duplicate scheduled notifications | Repeatedly pressing Schedule Local Reminders could schedule a new batch without first cancelling the prior prototype batch. | Settings / Notifications | Medium | Fixed | Fix in Sprint 018 | Scheduling now cancels prior local prototype notifications before replacing the local reminder set. |
| BF-002 | Physical-device QA pending | Real TestFlight device testing has not been completed in this sprint. | All | Medium | Deferred | Defer | Complete on iPhone/iPad after build upload. |
| BF-003 | Live URL verification pending | Privacy, Terms, Contact, and Support URLs require final live verification before App Store final submission. | App Store metadata | Medium | Deferred | Defer | Do not add runtime URL checks. |

## Triage Rules

- Critical and High bugs should be fixed before wider beta distribution.
- Medium bugs may be fixed before beta or tracked for the next sprint depending on risk.
- Low issues can be grouped into polish passes.
- Future features remain out of scope unless they affect review readiness.


# Beta Feedback Intake System

Track each reproducible report as one GitHub issue or approved internal record. Never copy real
police, evidentiary, personal, medical, or confidential information into the tracker.

## Required Fields

| Field | Purpose |
| --- | --- |
| Feedback ID and date | Stable reference and timing |
| Tester | Approved tester alias or name |
| Device and iOS version | Reproduction environment |
| App build | Exact binary under test |
| Screen/module | Ownership and routing |
| Issue type and severity | Triage classification |
| Description | Concise observed problem |
| Steps to reproduce | Repeatable sequence |
| Expected and actual result | Behavioral difference |
| Screenshot/video | Optional, sanitized evidence |
| Status | New, triaged, reproducing, planned, fixed, verified, deferred, closed |
| Assigned decision | Owner and chosen action |
| Notes | Safe technical context only |

## Issue Types

- Crash
- Navigation
- UI/Layout
- Accessibility
- Local persistence
- Local notifications
- Mock authentication
- Legal/disclaimer
- Copy/text
- App Store compliance
- Feature request
- Other

## Severity

- Critical: crash, cannot launch, cannot enter the app, or severe privacy/compliance risk
- High: core workflow blocked or persistent local data loss
- Medium: confusing or broken non-critical workflow
- Low: typo, cosmetic issue, or minor polish

Critical and high issues require reproduction and an explicit ship/hold decision. Feature requests
are not hotfixes and remain deferred during the release freeze.

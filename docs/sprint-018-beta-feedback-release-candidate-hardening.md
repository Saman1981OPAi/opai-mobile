# Sprint 018: Beta Feedback Fixes and Release Candidate Hardening

## Objective

Harden the OPAi Police iOS release candidate by addressing beta-readiness issues, stabilizing local prototype workflows, reviewing documentation consistency, and preparing for a clean TestFlight/App Store review cycle.

## Completed

- Updated release/build metadata to build `18`.
- Kept app version at `0.1.0-beta`; this is not a production `1.0` release.
- Updated release channel to `Internal Beta / Release Candidate Hardening`.
- Hardened bulk local reminder scheduling so repeated scheduling replaces prior prototype notifications instead of stacking duplicates.
- Added beta feedback triage documentation.
- Added App Store review risk audit.
- Added release candidate hardening checklist.
- Added final pre-TestFlight QA documentation.
- Updated README and current beta/release documentation references.

## Bugs Fixed

- Bulk local reminder scheduling now cancels previous local prototype notifications before scheduling the new reminder set.

## Deferred Issues

- Physical iPhone/iPad TestFlight QA remains required.
- Live URL verification remains required before final App Store submission.
- Full production backend, OpenAI, real authentication, cloud sync, secure file storage, and police-service integrations remain future work.

## Out of Scope

- No real backend API calls.
- No OpenAI API calls.
- No production database.
- No cloud sync.
- No real authentication provider.
- No payments or subscriptions.
- No real file upload.
- No police-service integrations.
- No third-party analytics or advertising SDKs.
- No production secrets.
- No Google Play or Android production workflow.

## Next Recommended Sprint

Sprint 019 should prepare the final TestFlight submission package.

